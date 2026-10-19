'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { CUSTOM_QUESTION, PIN_LENGTH, QUESTIONS } from '@/lib/securityQuestions';
import PinInput from './PinInput';

async function post(body) {
  const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Something went wrong.');
  return json;
}

function Input({ label, type = 'text', value, onChange, autoComplete, hint, ...rest }) {
  return (
    <label className="ad-field">
      <span className="ad-label">{label}</span>
      <input className="ad-input" type={type} value={value} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} required {...rest} />
      {hint && <span className="ad-hint">{hint}</span>}
    </label>
  );
}

/** Shared question + answer inputs (used by setup and by the account page). */
export function QuestionFields({ question, setQuestion, answer, setAnswer }) {
  const preset = QUESTIONS.includes(question) ? question : CUSTOM_QUESTION;
  return (
    <>
      <label className="ad-field">
        <span className="ad-label">Security question</span>
        <select className="ad-input" value={preset} onChange={(e) => setQuestion(e.target.value === CUSTOM_QUESTION ? '' : e.target.value)}>
          {[...QUESTIONS, CUSTOM_QUESTION].map((q) => <option key={q}>{q}</option>)}
        </select>
      </label>
      {preset === CUSTOM_QUESTION && <Input label="Your question" value={question} onChange={setQuestion} />}
      <Input label="Answer" value={answer} onChange={setAnswer} autoComplete="off"
        hint="Not case sensitive. You will need it to reset your PIN." />
    </>
  );
}

export default function AuthScreen({ mode: initialMode, question, disabled, needsSetupKey }) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode); // setup | login | forgot
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const [secQuestion, setSecQuestion] = useState(QUESTIONS[0]);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  if (disabled) {
    return (
      <main className="ad ad-auth"><div className="ad-auth__card">
        <h1>Admin is disabled</h1>
        <p className="ad-hint">Set the ADMIN_TOKEN environment variable on the server, then reload to create the admin password.</p>
      </div></main>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setNotice('');
    if (password.length !== PIN_LENGTH) { setError(`Enter all ${PIN_LENGTH} digits.`); return; }
    if (mode !== 'login' && password !== confirm) { setError('The two PINs do not match.'); return; }
    setBusy(true);
    try {
      if (mode === 'setup') await post({ action: 'setup', password, question: secQuestion, answer, setupKey });
      if (mode === 'login') await post({ action: 'login', password });
      if (mode === 'forgot') {
        await post({ action: 'reset', answer, next: password });
        setMode('login'); setPassword(''); setConfirm(''); setAnswer('');
        setNotice('PIN updated. Sign in with your new PIN.');
        setBusy(false);
        return;
      }
      router.refresh();
    } catch (err) { setError(err.message); }
    setBusy(false);
  };

  const titles = { setup: 'Create admin PIN', login: 'Admin sign in', forgot: 'Reset PIN' };

  return (
    <main className="ad ad-auth">
      <form className="ad-auth__card" onSubmit={submit}>
        <span className="ad-auth__icon"><Lock size={22} aria-hidden="true" /></span>
        <h1>{titles[mode]}</h1>
        {mode === 'setup' && <p className="ad-hint">First visit: choose a 6-digit PIN and a security question so you can recover access.</p>}
        {mode === 'forgot' && (
          <p className="ad-auth__q"><span className="ad-label">Security question</span>{question}</p>
        )}

        {mode === 'setup' && needsSetupKey && (
          <Input label="Setup key (ADMIN_TOKEN)" type="password" value={setupKey} onChange={setSetupKey} autoComplete="off" />
        )}
        {mode === 'forgot' && <Input label="Your answer" value={answer} onChange={setAnswer} autoComplete="off" />}
        <PinInput label={mode === 'forgot' ? 'New PIN' : mode === 'setup' ? 'Choose a 6-digit PIN' : 'Enter your PIN'} value={password} onChange={setPassword}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'} autoFocus={mode !== 'forgot'}
          hint={mode !== 'login' ? 'Six digits. Avoid repeated or sequential numbers.' : undefined} />
        {mode !== 'login' && <PinInput label="Confirm PIN" value={confirm} onChange={setConfirm} autoComplete="new-password" />}
        {mode === 'setup' && <QuestionFields question={secQuestion} setQuestion={setSecQuestion} answer={answer} setAnswer={setAnswer} />}

        {error && <p className="ad-banner ad-banner--error" role="alert">{error}</p>}
        {notice && <p className="ad-banner ad-banner--ok" role="status">{notice}</p>}

        <button className="ad-btn" type="submit" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'setup' ? 'Create PIN' : mode === 'login' ? 'Sign in' : 'Reset PIN'}
        </button>
        {mode === 'login' && question && (
          <button type="button" className="ad-link" onClick={() => { setMode('forgot'); setError(''); setNotice(''); setPassword(''); }}>Forgot PIN?</button>
        )}
        {mode === 'forgot' && (
          <button type="button" className="ad-link" onClick={() => { setMode('login'); setError(''); setPassword(''); setConfirm(''); }}>Back to sign in</button>
        )}
      </form>
    </main>
  );
}
