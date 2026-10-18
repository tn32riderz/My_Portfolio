'use client';

import React, { useState, useCallback } from 'react';
import './Contact.css';

/* ── Sparkle icon ── */
function Sparkle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M6.82506 0.129592C6.83644 0.0921028 6.85958 0.0592669 6.89105 0.0359321C6.92253 0.0125972 6.96067 0 6.99985 0C7.03903 0 7.07718 0.0125972 7.10865 0.0359321C7.14013 0.0592669 7.16326 0.0921028 7.17465 0.129592L7.83729 2.35154C8.10616 3.25331 8.59537 4.07394 9.26077 4.73934C9.92617 5.40474 10.7468 5.89397 11.6486 6.16286L13.8706 6.82548C13.9081 6.8369 13.9409 6.86005 13.9641 6.8915C13.9874 6.92296 14 6.96106 14 7.0002C14 7.03933 13.9874 7.07743 13.9641 7.10889C13.9409 7.14034 13.9081 7.16349 13.8706 7.17491L11.6486 7.83753C10.7469 8.10643 9.92626 8.59564 9.26089 9.26101C8.59551 9.92639 8.10631 10.747 7.83744 11.6487L7.17465 13.8706C7.16322 13.9081 7.14008 13.9409 7.10862 13.9641C7.07717 13.9874 7.03906 14 6.99993 14C6.96079 14 6.92268 13.9874 6.89123 13.9641C6.85977 13.9409 6.83663 13.9081 6.8252 13.8706L6.16256 11.6487C5.89364 10.747 5.40438 9.92639 4.73896 9.26104C4.07353 8.59569 3.25288 8.10652 2.35109 7.83768L0.129355 7.17476C0.0919215 7.16334 0.0591464 7.1402 0.0358582 7.10874C0.01257 7.07729 0 7.03918 0 7.00005C0 6.96091 0.01257 6.92281 0.0358582 6.89135C0.0591464 6.8599 0.0919215 6.83676 0.129355 6.82533L2.35124 6.16271C3.25307 5.89384 4.07374 5.40463 4.73916 4.73922C5.40459 4.07382 5.89383 3.25318 6.1627 2.35139L6.82506 0.129592Z"
        fill="url(#contact-sparkle)" />
      <defs>
        <radialGradient id="contact-sparkle" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
          gradientTransform="translate(7) rotate(90) scale(14 9.9964)">
          <stop stopColor="#F5F5FF" />
          <stop offset="0.710673" stopColor="#4B4EFC" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ── Initial state ── */
const INIT = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  message: '',
};

/* ── Validation — all fields are required ── */
function validate(fields) {
  const errs = {};
  if (!fields.fullName.trim())
    errs.fullName = 'Full name is required.';
  if (!fields.company.trim())
    errs.company = 'Company / Agency Name is required.';
  if (!fields.email.trim())
    errs.email = 'Email address is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errs.email = 'Enter a valid email address.';
  if (!fields.phone.trim())
    errs.phone = 'Phone number is required.';
  if (!fields.message.trim())
    errs.message = 'Please specify why you should contact me.';
  return errs;
}

/* ── Reusable field wrapper ── */
function Field({ id, label, error, children }) {
  return (
    <div className={`cf-field${error ? ' cf-field--error' : ''}`}>
      <label className="cf-label" htmlFor={id}>
        {label}
        <span className="cf-required" aria-hidden="true"> *</span>
      </label>
      {children}
      {error && <span className="cf-error-msg" role="alert">{error}</span>}
    </div>
  );
}

export default function Contact() {
  const [fields,    setFields]    = useState(INIT);
  const [errors,    setErrors]    = useState({});
  const [touched,   setTouched]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  /* update single field + clear its error */
  const set = useCallback((key, value) => {
    setFields(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  }, [errors]);

  /* validate on blur */
  const blur = useCallback((key) => {
    setTouched(prev => ({ ...prev, [key]: true }));
    const errs = validate({ ...fields });
    if (errs[key]) setErrors(prev => ({ ...prev, [key]: errs[key] }));
    else           setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  }, [fields]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    setTouched({
      fullName: true,
      company: true,
      email: true,
      phone: true,
      message: true
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 1400)); // swap with real API call
    setLoading(false);
    setSubmitted(true);
  }, [fields]);

  /* ── Success screen ── */
  if (submitted) {
    return (
      <section className="cf-section" id="contact">
        <div className="cf-inner">
          <div className="cf-success">
            <span className="cf-success-icon">✓</span>
            <h2 className="cf-success-title">Message Sent!</h2>
            <p className="cf-success-text">
              Thanks {fields.fullName.split(' ')[0]}, I'll get back to you within 24 hours.
            </p>
            <button
              className="cf-submit"
              onClick={() => { setSubmitted(false); setFields(INIT); setErrors({}); setTouched({}); }}
            >
              Send Another
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cf-section" id="contact">
      <div className="cf-inner">

        {/* ── LEFT PANEL ── */}
        <div className="cf-left">
          <div className="cf-label-row">
            <Sparkle />
            <span>Some Recent Projects</span>
          </div>
          <h2 className="cf-heading">Start Your<br />Project</h2>
          <p className="cf-sub">I'll help you plan and build a website that actually performs.</p>
        </div>

        {/* ── FORM ── */}
        <form className="cf-form" id="contact-form" onSubmit={handleSubmit} noValidate>

          {/* Row 1: Name + Company */}
          <div className="cf-row">
            <Field id="cf-fullName" label="Full Name" error={touched.fullName && errors.fullName}>
              <input
                id="cf-fullName"
                className={`cf-input${touched.fullName && errors.fullName ? ' cf-input--err' : ''}`}
                type="text"
                placeholder="John Smith"
                value={fields.fullName}
                onChange={e => set('fullName', e.target.value)}
                onBlur={() => blur('fullName')}
                autoComplete="name"
              />
            </Field>

            <Field id="cf-company" label="Company / Agency Name" error={touched.company && errors.company}>
              <input
                id="cf-company"
                className={`cf-input${touched.company && errors.company ? ' cf-input--err' : ''}`}
                type="text"
                placeholder="Acme Inc."
                value={fields.company}
                onChange={e => set('company', e.target.value)}
                onBlur={() => blur('company')}
                autoComplete="organization"
              />
            </Field>
          </div>

          {/* Row 2: Email + Phone */}
          <div className="cf-row">
            <Field id="cf-email" label="Email Address" error={touched.email && errors.email}>
              <input
                id="cf-email"
                className={`cf-input${touched.email && errors.email ? ' cf-input--err' : ''}`}
                type="email"
                placeholder="john@example.com"
                value={fields.email}
                onChange={e => set('email', e.target.value)}
                onBlur={() => blur('email')}
                autoComplete="email"
              />
            </Field>

            <Field id="cf-phone" label="Phone Number" error={touched.phone && errors.phone}>
              <input
                id="cf-phone"
                className={`cf-input${touched.phone && errors.phone ? ' cf-input--err' : ''}`}
                type="tel"
                placeholder="+1 555 000 0000"
                value={fields.phone}
                onChange={e => set('phone', e.target.value)}
                onBlur={() => blur('phone')}
                autoComplete="tel"
              />
            </Field>
          </div>

          {/* Row 3: Message (full width) */}
          <div className="cf-field-full-width">
            <Field id="cf-message" label="Why should you contact me?" error={touched.message && errors.message}>
              <textarea
                id="cf-message"
                className={`cf-textarea${touched.message && errors.message ? ' cf-input--err' : ''}`}
                rows={4}
                placeholder="Tell me about your project, goals, or any questions you have…"
                value={fields.message}
                onChange={e => set('message', e.target.value)}
                onBlur={() => blur('message')}
              />
            </Field>
          </div>

          {/* Submit */}
          <div className="cf-submit-row">
            <button
              id="cf-submit-btn"
              type="submit"
              className={`cf-submit${loading ? ' cf-submit--loading' : ''}`}
              disabled={loading}
              aria-busy={loading}
            >
              {loading
                ? <span className="cf-spinner" aria-label="Sending…" />
                : 'Submit'}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}
