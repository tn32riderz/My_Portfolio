import nodemailer from 'nodemailer';

/**
 * Delivers the contact-form message to the site owner. Everything runs on the server, so credentials
 * never reach the browser. Providers, in order of preference:
 *   1. Gmail SMTP (free, no domain needed): GMAIL_APP_PASSWORD (+ optional GMAIL_USER)
 *   2. Resend API (free tier):            RESEND_API_KEY (+ CONTACT_FROM)
 * Returns { ok: true } or { ok: false, reason: 'not_configured' | 'failed', detail? }.
 */
export async function sendContactEmail({ name, email, company, phone, topic, message }, env = process.env, makeTransport = nodemailer.createTransport) {
  const details = [`Name: ${name}`, `Email: ${email}`, company && `Company: ${company}`, phone && `Phone: ${phone}`, topic && `About: ${topic}`].filter(Boolean);
  const text = `${details.join('\n')}\n\n${message}`;
  const subject = topic ? `Portfolio enquiry (${topic}) from ${name}` : `Portfolio enquiry from ${name}`;
  const to = env.CONTACT_TO;

  if (env.GMAIL_APP_PASSWORD) {
    const user = env.GMAIL_USER || to;
    try {
      const transport = makeTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass: env.GMAIL_APP_PASSWORD.replace(/\s+/g, '') } });
      await transport.sendMail({
        from: `Portfolio <${user}>`, // Gmail only lets you send as the signed-in account
        to,
        replyTo: `${name} <${email}>`, // hitting Reply in your inbox answers the visitor
        subject,
        text,
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: 'failed', detail: String(err?.message || err).slice(0, 300) };
    }
  }

  if (env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>', to: [to], reply_to: email, subject, text }),
    });
    if (!res.ok) return { ok: false, reason: 'failed', detail: (await res.text().catch(() => '')).slice(0, 300) };
    return { ok: true };
  }

  return { ok: false, reason: 'not_configured' };
}
