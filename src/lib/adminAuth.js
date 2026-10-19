import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const scryptAsync = promisify(scrypt);
const DIR = path.join(process.cwd(), '.data');
const FILE = path.join(DIR, 'admin-auth.json');
const COOKIE = 'admin_session';
const SESSION_MS = 8 * 60 * 60 * 1000;
const isProd = process.env.NODE_ENV === 'production';

import { PIN_LENGTH } from "@/lib/securityQuestions";

/* ── hashing (scrypt, per-record salt) ── */
async function hashValue(value, salt = randomBytes(16).toString('hex')) {
  return { salt, hash: (await scryptAsync(value, salt, 64)).toString('hex') };
}
async function matches(value, record) {
  const got = await scryptAsync(value, record.salt, 64);
  const want = Buffer.from(record.hash, 'hex');
  return got.length === want.length && timingSafeEqual(got, want);
}
export const normalizeAnswer = (a) => String(a).trim().toLowerCase().replace(/\s+/g, ' ');

/** The admin credential is a 6-digit PIN. Obvious PINs (111111, 123456, 654321) are refused. */
export function validatePassword(pin) {
  if (typeof pin !== 'string' || !new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin)) return `PIN must be exactly ${PIN_LENGTH} digits.`;
  if (/^(\d)\1+$/.test(pin) || '0123456789'.includes(pin) || '9876543210'.includes(pin)) return 'That PIN is too easy to guess. Avoid repeated or sequential digits.';
  return null;
}

/* ── credential store: .data/admin-auth.json (git-ignored) ── */
async function readAuth() {
  try { return JSON.parse(await fs.readFile(FILE, 'utf-8')); } catch { return null; }
}
async function writeAuth(data) {
  await fs.mkdir(DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), { mode: 0o600 });
  await fs.rename(tmp, FILE);
}

export async function isConfigured() { return Boolean(await readAuth()); }
export async function getQuestion() { return (await readAuth())?.question ?? null; }

export async function createAccount({ password, question, answer }) {
  await writeAuth({
    password: await hashValue(password),
    question,
    answer: await hashValue(normalizeAnswer(answer)),
    sessionSecret: randomBytes(32).toString('hex'),
    updatedAt: new Date().toISOString(),
  });
}
export async function verifyPassword(password) {
  const auth = await readAuth();
  return Boolean(auth) && matches(String(password ?? ''), auth.password);
}
export async function verifyAnswer(answer) {
  const auth = await readAuth();
  return Boolean(auth) && matches(normalizeAnswer(answer ?? ''), auth.answer);
}
/** Changing the password rotates the session secret, which signs out every other session. */
export async function setPassword(password) {
  const auth = await readAuth();
  await writeAuth({ ...auth, password: await hashValue(password), sessionSecret: randomBytes(32).toString('hex'), updatedAt: new Date().toISOString() });
}
export async function setSecurityQuestion(question, answer) {
  const auth = await readAuth();
  await writeAuth({ ...auth, question, answer: await hashValue(normalizeAnswer(answer)), updatedAt: new Date().toISOString() });
}

/* ── sessions: HttpOnly cookie "<expiry>.<hmac>" ── */
const sign = (secret, expiry) => createHmac('sha256', secret).update(String(expiry)).digest('hex');

export async function startSession() {
  const auth = await readAuth();
  const expiry = Date.now() + SESSION_MS;
  (await cookies()).set(COOKIE, `${expiry}.${sign(auth.sessionSecret, expiry)}`, {
    httpOnly: true, sameSite: 'strict', secure: isProd, path: '/', maxAge: SESSION_MS / 1000,
  });
}
export async function endSession() { (await cookies()).delete(COOKIE); }

export async function isAuthenticated() {
  const token = (await cookies()).get(COOKIE)?.value;
  const auth = await readAuth();
  if (!token || !auth) return false;
  const [expiry, sig] = token.split('.');
  if (!(Number(expiry) > Date.now()) || !sig) return false;
  const want = Buffer.from(sign(auth.sessionSecret, expiry));
  const got = Buffer.from(sig);
  return got.length === want.length && timingSafeEqual(got, want);
}

/* ── brute-force limiter (in memory; resets on restart) ── */
const attempts = new Map();
export function limiter(key, max = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const rec = attempts.get(key);
  const live = rec && now - rec.first < windowMs ? rec : null;
  return {
    blocked: Boolean(live && live.count >= max),
    fail() { attempts.set(key, live ? { ...live, count: live.count + 1 } : { first: now, count: 1 }); },
    clear() { attempts.delete(key); },
  };
}
export const clientKey = (request) => (request.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();

/* ── guards ── */
/** Production setup needs ADMIN_TOKEN as a one-time setup key so strangers can't claim an unconfigured site. */
export const setupKeyRequired = () => isProd;
export function setupKeyValid(given) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || typeof given !== 'string') return false;
  const a = Buffer.from(given), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
export const adminDisabled = async () => isProd && !process.env.ADMIN_TOKEN && !(await isConfigured());

/** For write endpoints: returns a Response to send when the request must be rejected, else null. */
export async function checkAdmin(request) {
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) {
    return Response.json({ error: 'Cross-origin requests are not allowed.' }, { status: 403 });
  }
  if (!(await isAuthenticated())) return Response.json({ error: 'Not signed in.' }, { status: 401 });
  return null;
}
