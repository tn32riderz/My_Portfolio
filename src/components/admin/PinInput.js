'use client';

import { useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { PIN_LENGTH } from '@/lib/securityQuestions';

/** OTP-style PIN entry: one box per digit, auto-advance, paste support. `value` is a digit string. */
export default function PinInput({ label, value, onChange, autoComplete = 'off', autoFocus = false, hint }) {
  const refs = useRef([]);
  const [visible, setVisible] = useState(false);
  const digits = Array.from({ length: PIN_LENGTH }, (_, i) => value[i] ?? '');

  const focus = (i) => refs.current[Math.max(0, Math.min(PIN_LENGTH - 1, i))]?.focus();
  const setAt = (i, digit) => {
    const next = digits.slice();
    next[i] = digit;
    onChange(next.join('').slice(0, PIN_LENGTH));
  };

  const onInput = (i, e) => {
    const typed = e.target.value.replace(/\D/g, '');
    if (!typed) return;
    if (typed.length > 1) { // browser autofill / fast typing: spread across the boxes
      const next = (value.slice(0, i) + typed).slice(0, PIN_LENGTH);
      onChange(next);
      focus(next.length >= PIN_LENGTH ? PIN_LENGTH - 1 : next.length);
      return;
    }
    setAt(i, typed);
    if (i < PIN_LENGTH - 1) focus(i + 1);
  };

  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[i]) setAt(i, '');
      else if (i > 0) { setAt(i - 1, ''); focus(i - 1); }
    } else if (e.key === 'ArrowLeft') { e.preventDefault(); focus(i - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); focus(i + 1); }
  };

  const onPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    focus(pasted.length >= PIN_LENGTH ? PIN_LENGTH - 1 : pasted.length);
  };

  return (
    <fieldset className="ad-pin">
      <legend className="ad-label">{label}</legend>
      <div className="ad-pin__row">
        {digits.map((d, i) => (
          <input key={i} ref={(el) => { refs.current[i] = el; }} className={`ad-pin__box${d ? ' is-filled' : ''}`}
            type={visible ? 'text' : 'password'} inputMode="numeric" pattern="[0-9]*" maxLength={PIN_LENGTH}
            autoComplete={i === 0 ? autoComplete : 'off'} autoFocus={autoFocus && i === 0}
            aria-label={`${label}, digit ${i + 1} of ${PIN_LENGTH}`} value={d}
            onChange={(e) => onInput(i, e)} onKeyDown={(e) => onKeyDown(i, e)} onPaste={onPaste} onFocus={(e) => e.target.select()} />
        ))}
        <button type="button" className="ad-icon" onClick={() => setVisible((v) => !v)} aria-label={visible ? 'Hide PIN' : 'Show PIN'} aria-pressed={visible}>
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hint && <p className="ad-hint">{hint}</p>}
    </fieldset>
  );
}
