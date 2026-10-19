'use client';

import React, { useCallback, useId, useRef, useState } from 'react';
import { AlertCircle, Building2, Check, ChevronDown, Mail, MessageSquare, Phone, Tag, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import { contactTopics, profile } from '@/data/profile';
import './Contact.css';

const MAX_MESSAGE = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d\s.-]{7,25}$/;

/* ── Initial state ── */
const INIT = { fullName: '', company: '', email: '', phone: '', topic: '', message: '', website: /* honeypot */ '' };

/* ── Validation: every field is required ── */
const RULES = {
  fullName: (v) => (v.trim().length < 2 ? 'Please enter your full name.' : ''),
  company: (v) => (v.trim().length < 2 ? 'Please enter your company or organization.' : ''),
  email: (v) => (!v.trim() ? 'Please enter your email address.' : !EMAIL_RE.test(v.trim()) ? 'Please enter a valid email address, like name@company.com.' : ''),
  phone: (v) => (!v.trim() ? 'Please enter your phone number.' : !PHONE_RE.test(v.trim()) || v.replace(/\D/g, '').length < 7 ? 'Please enter a valid phone number, including the country code.' : ''),
  topic: (v) => (!v ? 'Please choose what this is about.' : ''),
  message: (v) => (v.trim().length < 10 ? 'Please write a few words about what you need (at least 10 characters).' : ''),
};
const ORDER = Object.keys(RULES);
const validate = (fields) => Object.fromEntries(ORDER.map((k) => [k, RULES[k](fields[k])]).filter(([, msg]) => msg));

/* ── Sparkle icon ── */
function Sparkle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M6.82506 0.129592C6.83644 0.0921028 6.85958 0.0592669 6.89105 0.0359321C6.92253 0.0125972 6.96067 0 6.99985 0C7.03903 0 7.07718 0.0125972 7.10865 0.0359321C7.14013 0.0592669 7.16326 0.0921028 7.17465 0.129592L7.83729 2.35154C8.10616 3.25331 8.59537 4.07394 9.26077 4.73934C9.92617 5.40474 10.7468 5.89397 11.6486 6.16286L13.8706 6.82548C13.9081 6.8369 13.9409 6.86005 13.9641 6.8915C13.9874 6.92296 14 6.96106 14 7.0002C14 7.03933 13.9874 7.07743 13.9641 7.10889C13.9409 7.14034 13.9081 7.16349 13.8706 7.17491L11.6486 7.83753C10.7469 8.10643 9.92626 8.59564 9.26089 9.26101C8.59551 9.92639 8.10631 10.747 7.83744 11.6487L7.17465 13.8706C7.16322 13.9081 7.14008 13.9409 7.10862 13.9641C7.07717 13.9874 7.03906 14 6.99993 14C6.96079 14 6.92268 13.9874 6.89123 13.9641C6.85977 13.9409 6.83663 13.9081 6.8252 13.8706L6.16256 11.6487C5.89364 10.747 5.40438 9.92639 4.73896 9.26104C4.07353 8.59569 3.25288 8.10652 2.35109 7.83768L0.129355 7.17476C0.0919215 7.16334 0.0591464 7.1402 0.0358582 7.10874C0.01257 7.07729 0 7.03918 0 7.00005C0 6.96091 0.01257 6.92281 0.0358582 6.89135C0.0591464 6.8599 0.0919215 6.83676 0.129355 6.82533L2.35124 6.16271C3.25307 5.89384 4.07374 5.40463 4.73916 4.73922C5.40459 4.07382 5.89383 3.25318 6.1627 2.35139L6.82506 0.129592Z"
        fill="url(#contact-sparkle)" />
      <defs>
        <radialGradient id="contact-sparkle" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(7) rotate(90) scale(14 9.9964)">
          <stop stopColor="#F5F5FF" />
          <stop offset="0.710673" stopColor="#4B4EFC" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/**
 * One labelled control with an icon, a "valid" tick and an accessible error message.
 * `children(controlProps)` renders the actual input, select or textarea.
 */
function Field({ name, label, icon: Icon, value, error, touched, wide, hint, children }) {
  const id = useId();
  const errId = `${id}-err`;
  const showError = touched && error;
  const valid = touched && !error && value.trim?.() !== '';
  return (
    <div className={`cf-field${wide ? ' cf-field--wide' : ''}${showError ? ' is-invalid' : ''}${valid ? ' is-valid' : ''}`}>
      <label className="cf-label" htmlFor={id}>
        {label}<span className="cf-required" aria-hidden="true"> *</span>
      </label>
      <div className="cf-control">
        <Icon className="cf-icon" size={18} aria-hidden="true" />
        {children({ id, name, 'aria-required': true, 'aria-invalid': Boolean(showError), 'aria-describedby': showError ? errId : undefined })}
        {valid && <Check className="cf-tick" size={16} aria-hidden="true" />}
      </div>
      {hint && !showError && <p className="cf-hint">{hint}</p>}
      {showError && <p className="cf-error-msg" id={errId} role="alert"><AlertCircle size={14} aria-hidden="true" />{error}</p>}
    </div>
  );
}

export default function Contact() {
  const [fields, setFields] = useState(INIT);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState('');
  const formRef = useRef(null);

  const errors = validate(fields);
  const set = (key) => (e) => setFields((prev) => ({ ...prev, [key]: e.target.value }));
  const blur = (key) => () => setTouched((prev) => ({ ...prev, [key]: true }));
  const common = (key) => ({ value: fields[key], onChange: set(key), onBlur: blur(key) });

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(ORDER.map((k) => [k, true])));
    const firstBad = ORDER.find((k) => errors[k]);
    if (firstBad) {
      // send keyboard / screen reader users straight to the first problem
      formRef.current?.querySelector(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setLoading(true);
    setSendError('');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields) });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setSubmitted(true);
      } else if (json.code === 'not_configured') {
        // Email sending is not configured on the server (see .env.example). Be honest, and fall back to the visitor's mail app.
        const body = [`Name: ${fields.fullName}`, `Email: ${fields.email}`, `Company: ${fields.company}`, `Phone: ${fields.phone}`,
          `About: ${fields.topic}`, '', fields.message].join('\n');
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio enquiry from ${fields.fullName}`)}&body=${encodeURIComponent(body)}`;
        setSendError('Direct sending is not available right now, so I opened your email app. Press send there to reach me.');
      } else {
        setSendError(json.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSendError('Could not reach the server. Check your connection and try again.');
    }
    setLoading(false);
  }, [fields, errors]);

  /* ── Success screen ── */
  if (submitted) {
    return (
      <section className="cf-section" id="contact">
        <div className="cf-inner cf-inner--center">
          <div className="cf-success" role="status">
            <span className="cf-success-icon"><Check size={28} aria-hidden="true" /></span>
            <h2 className="cf-success-title">Message sent!</h2>
            <p className="cf-success-text">
              Thank you, {fields.fullName.trim().split(/\s+/)[0]}. I&apos;ve received your message and will reply to {fields.email.trim()} soon.
            </p>
            <Button text="Send another" onClick={() => { setSendError(''); setSubmitted(false); setFields(INIT); setTouched({}); }} />
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
          <div className="cf-label-row"><Sparkle /><span>Contact</span></div>
          <h2 className="cf-heading">Let&apos;s Talk</h2>
          <p className="cf-sub">Hiring, or have a product in mind? Fill in the form and I&apos;ll reply by email.</p>
          <a className="cf-direct" href={`mailto:${profile.email}`}><Mail size={16} aria-hidden="true" />{profile.email}</a>
        </div>

        {/* ── FORM ── */}
        <form className="cf-form" id="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Contact form">
          <p className="cf-legend"><span aria-hidden="true">*</span> All fields are required</p>

          <div className="cf-row">
            <Field name="fullName" label="Full Name" icon={User} value={fields.fullName} error={errors.fullName} touched={touched.fullName}>
              {(p) => <input {...p} {...common('fullName')} className="cf-input" type="text" placeholder="Your full name" autoComplete="name" maxLength={120} />}
            </Field>
            <Field name="company" label="Company / Organization" icon={Building2} value={fields.company} error={errors.company} touched={touched.company}>
              {(p) => <input {...p} {...common('company')} className="cf-input" type="text" placeholder="Where you work" autoComplete="organization" maxLength={120} />}
            </Field>
          </div>

          <div className="cf-row">
            <Field name="email" label="Email Address" icon={Mail} value={fields.email} error={errors.email} touched={touched.email}>
              {(p) => <input {...p} {...common('email')} className="cf-input" type="email" inputMode="email" placeholder="name@company.com" autoComplete="email" maxLength={200} />}
            </Field>
            <Field name="phone" label="Phone Number" icon={Phone} value={fields.phone} error={errors.phone} touched={touched.phone} hint="Include the country code, for example +971 50 123 4567">
              {(p) => <input {...p} {...common('phone')} className="cf-input" type="tel" inputMode="tel" placeholder="+971 50 123 4567" autoComplete="tel" maxLength={25} />}
            </Field>
          </div>

          <Field name="topic" label="What is this about?" icon={Tag} value={fields.topic} error={errors.topic} touched={touched.topic} wide>
            {(p) => (
              <>
                <select {...p} {...common('topic')} className="cf-input cf-select">
                  <option value="" disabled>Select a topic</option>
                  {contactTopics.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="cf-chevron" size={18} aria-hidden="true" />
              </>
            )}
          </Field>

          <Field name="message" label="Your Message" icon={MessageSquare} value={fields.message} error={errors.message} touched={touched.message} wide>
            {(p) => (
              <>
                <textarea {...p} {...common('message')} className="cf-input cf-textarea" rows={5} maxLength={MAX_MESSAGE}
                  placeholder="Tell me about the role or project, your goals and your timeline…" />
                <span className="cf-count" aria-hidden="true">{fields.message.length} / {MAX_MESSAGE}</span>
              </>
            )}
          </Field>

          {/* Honeypot: hidden from people, tempting to bots */}
          <input type="text" name="website" value={fields.website} onChange={set('website')} tabIndex={-1} autoComplete="off"
            aria-hidden="true" className="cf-honeypot" />

          {sendError && <p className="cf-send-error" role="alert"><AlertCircle size={16} aria-hidden="true" />{sendError}</p>}

          <div className="cf-submit-row">
            <Button type="submit" text={loading ? 'Sending…' : 'Send Message'} disabled={loading} />
          </div>
        </form>
      </div>
    </section>
  );
}
