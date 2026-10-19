'use client';

import { useState } from 'react';
import { PIN_LENGTH, QUESTIONS } from '@/lib/securityQuestions';
import PinInput from './PinInput';
import AdminBar from './AdminBar';
import { QuestionFields } from './AuthScreen';

async function post(body) {
  const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Something went wrong.');
}

function usePanel() {
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const run = async (fn, success) => {
    setBusy(true); setMessage(null);
    try { await fn(); setMessage({ kind: 'ok', text: success }); return true; }
    catch (err) { setMessage({ kind: 'error', text: err.message }); return false; }
    finally { setBusy(false); }
  };
  return { message, busy, run };
}

function PasswordPanel() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const { message, busy, run } = usePanel();

  const submit = async (e) => {
    e.preventDefault();
    if (current.length !== PIN_LENGTH || next.length !== PIN_LENGTH) return run(async () => { throw new Error(`Enter all ${PIN_LENGTH} digits in each field.`); });
    if (next !== confirm) return run(async () => { throw new Error('The two new PINs do not match.'); });
    const ok = await run(() => post({ action: 'change-password', current, next }), 'PIN changed. Other devices were signed out.');
    if (ok) { setCurrent(''); setNext(''); setConfirm(''); }
  };

  return (
    <form className="ad-panel" onSubmit={submit}>
      <h2>Change PIN</h2>
      <PinInput label="Current PIN" value={current} onChange={setCurrent} autoComplete="current-password" />
      <PinInput label="New PIN" value={next} onChange={setNext} autoComplete="new-password" hint="Six digits. Avoid repeated or sequential numbers." />
      <PinInput label="Confirm new PIN" value={confirm} onChange={setConfirm} autoComplete="new-password" />
      {message && <p className={`ad-banner ad-banner--${message.kind}`} role={message.kind === 'error' ? 'alert' : 'status'}>{message.text}</p>}
      <button className="ad-btn" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Change PIN'}</button>
    </form>
  );
}

function QuestionPanel({ question: initial }) {
  const [current, setCurrent] = useState('');
  const [question, setQuestion] = useState(initial || QUESTIONS[0]);
  const [answer, setAnswer] = useState('');
  const { message, busy, run } = usePanel();

  const submit = async (e) => {
    e.preventDefault();
    if (current.length !== PIN_LENGTH) return run(async () => { throw new Error(`Enter your ${PIN_LENGTH}-digit PIN to confirm.`); });
    const ok = await run(() => post({ action: 'change-question', current, question, answer }), 'Security question updated.');
    if (ok) { setCurrent(''); setAnswer(''); }
  };

  return (
    <form className="ad-panel" onSubmit={submit}>
      <h2>Security question</h2>
      <p className="ad-hint">Used to reset your PIN if you forget it. Current question: <strong>{initial}</strong></p>
      <QuestionFields question={question} setQuestion={setQuestion} answer={answer} setAnswer={setAnswer} />
      <PinInput label="Current PIN (to confirm)" value={current} onChange={setCurrent} autoComplete="current-password" />
      {message && <p className={`ad-banner ad-banner--${message.kind}`} role={message.kind === 'error' ? 'alert' : 'status'}>{message.text}</p>}
      <button className="ad-btn" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Update security question'}</button>
    </form>
  );
}

export default function AccountScreen({ question }) {
  return (
    <div className="ad">
      <AdminBar title="Account & security" backHref="/admin" backLabel="Back to editor" />
      <div className="ad-account">
        <PasswordPanel />
        <QuestionPanel question={question} />
      </div>
    </div>
  );
}
