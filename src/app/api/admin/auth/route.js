import {
  clientKey, createAccount, endSession, getQuestion, isAuthenticated, isConfigured, limiter,
  normalizeAnswer, setPassword, setSecurityQuestion, setupKeyRequired, setupKeyValid, startSession, validatePassword,
  verifyAnswer, verifyPassword,
} from '@/lib/adminAuth';

const fail = (error, status = 400) => Response.json({ error }, { status });
const tooMany = () => fail('Too many attempts. Try again in 15 minutes.', 429);

function validateQuestion(question, answer) {
  if (typeof question !== 'string' || question.trim().length < 8 || question.length > 140) return 'Choose or write a security question (8–140 characters).';
  if (normalizeAnswer(answer ?? '').length < 3) return 'The security answer must be at least 3 characters.';
  return null;
}

/** GET → the security question (shown on the forgot-password screen). */
export async function GET() {
  const question = await getQuestion();
  return question ? Response.json({ question }) : fail('Admin is not set up yet.', 404);
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return fail('Cross-origin requests are not allowed.', 403);

  let body;
  try { body = await request.json(); } catch { return fail('Invalid JSON.'); }
  const { action } = body;
  const key = `${action}:${clientKey(request)}`;

  /* first-time setup */
  if (action === 'setup') {
    if (await isConfigured()) return fail('Admin is already set up.', 409);
    if (setupKeyRequired() && !setupKeyValid(body.setupKey)) return fail('Invalid setup key.', 403);
    const problem = validatePassword(body.password) || validateQuestion(body.question, body.answer);
    if (problem) return fail(problem);
    await createAccount(body);
    await startSession();
    return Response.json({ ok: true });
  }

  if (!(await isConfigured())) return fail('Admin is not set up yet.', 404);

  if (action === 'login') {
    const lim = limiter(key);
    if (lim.blocked) return tooMany();
    if (!(await verifyPassword(body.password))) { lim.fail(); return fail('Incorrect PIN.', 401); }
    lim.clear();
    await startSession();
    return Response.json({ ok: true });
  }

  /* forgot password: prove identity with the security answer */
  if (action === 'reset') {
    const lim = limiter(key);
    if (lim.blocked) return tooMany();
    const problem = validatePassword(body.next);
    if (problem) return fail(problem);
    if (!(await verifyAnswer(body.answer))) { lim.fail(); return fail('That answer does not match.', 401); }
    lim.clear();
    await setPassword(body.next);
    return Response.json({ ok: true });
  }

  if (action === 'logout') { await endSession(); return Response.json({ ok: true }); }

  /* everything below needs a session AND the current password */
  if (!(await isAuthenticated())) return fail('Not signed in.', 401);
  const lim = limiter(key);
  if (lim.blocked) return tooMany();
  if (!(await verifyPassword(body.current))) { lim.fail(); return fail('Current PIN is incorrect.', 401); }
  lim.clear();

  if (action === 'change-password') {
    const problem = validatePassword(body.next);
    if (problem) return fail(problem);
    await setPassword(body.next);
    await startSession(); // rotating the secret signed everyone out; keep this session
    return Response.json({ ok: true });
  }
  if (action === 'change-question') {
    const problem = validateQuestion(body.question, body.answer);
    if (problem) return fail(problem);
    await setSecurityQuestion(body.question.trim(), body.answer);
    return Response.json({ ok: true });
  }
  return fail('Unknown action.');
}

