import { sendContactEmail } from '@/lib/mail';
import { contactTopics, profile } from '@/data/profile';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d\s.-]{7,25}$/;
const hits = new Map(); // ip -> { first, count }  (in memory; resets on restart)
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

const clean = (v, max) => String(v ?? '').trim().slice(0, max);
const fail = (error, status = 400, extra = {}) => Response.json({ error, ...extra }, { status });

/** POST { fullName, company, email, phone, message, website } -> emails the message to CONTACT_TO. */
export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return fail('Cross-origin requests are not allowed.', 403);

  let body;
  try { body = await request.json(); } catch { return fail('Invalid request.'); }

  // Honeypot: real visitors never see or fill this field. Pretend success so bots learn nothing.
  if (body.website) return Response.json({ ok: true });

  const data = {
    name: clean(body.fullName, 120),
    company: clean(body.company, 120),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    topic: clean(body.topic, 60),
    message: clean(body.message, 5000),
  };
  // Every field is required.
  if (data.name.length < 2) return fail('Please enter your full name.');
  if (data.company.length < 2) return fail('Please enter your company or organization.');
  if (!EMAIL_RE.test(data.email)) return fail('Please enter a valid email address.');
  if (!PHONE_RE.test(data.phone) || data.phone.replace(/\D/g, '').length < 7) return fail('Please enter a valid phone number.');
  if (!contactTopics.includes(data.topic)) return fail('Please choose what this is about.');
  if (data.message.length < 10) return fail('Please write a few words about what you need.');

  // Simple abuse guard: 5 messages per hour per connection.
  const ip = (request.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  const now = Date.now();
  const rec = hits.get(ip);
  const live = rec && now - rec.first < WINDOW_MS ? rec : { first: now, count: 0 };
  if (live.count >= LIMIT) return fail('Too many messages from this connection. Please try again later.', 429);
  hits.set(ip, { ...live, count: live.count + 1 });

  const result = await sendContactEmail(data, { ...process.env, CONTACT_TO: process.env.CONTACT_TO || profile.email });
  if (result.ok) return Response.json({ ok: true });

  if (result.reason === 'not_configured') {
    // Honest about it: nothing was sent. The form falls back to the visitor's email app.
    return fail('Email sending is not set up on this site yet.', 503, { code: 'not_configured', to: profile.email });
  }
  console.error('Contact email failed:', result.detail);
  return fail('Your message could not be sent. Please try again, or email me directly.', 502, { to: profile.email });
}
