# My Portfolio

Next.js (App Router) portfolio. Read `node_modules/next/dist/docs/` before changing framework-level code.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build && npm start
```

## Structure

```
src/
  app/                    Routes only
    layout.js, page.js    Root layout and home page
    globals.css
    works/                /works and /works/[slug]
  components/
    layout/               Header, Logo
    ui/                   Button, ButtonGradient
    sections/             Home page sections (Hero, AboutMe, Projects, ...) with their .css
    works/                WorksGallery, ProjectDetail with their .css
  data/
    db.json               Editable content (projects, services, testimonials, logos)
    profile.js            Name, contacts, experience, education (from the resume)
  lib/db.js               getDb() loader and isPublished() helper
public/
  assets/images/          avatars/, hero/, projects/, services/, case-studies/
  assets/3d/              .glb models
  resume/                 Vignesh-V-Resume.pdf
  case-studies/           Static case study HTML
design/                   Unused design source files (not served)
```

## Portfolio editor

Open `/admin`. The first visit asks you to create a 6-digit PIN (entered in OTP-style boxes) and a security question; after that it is a
sign-in screen. **Forgot PIN?** asks the security question and lets you set a new PIN.
**Account** (top bar) changes the PIN or the security question. A 6-digit PIN has only 1,000,000 combinations, so the lockout below is what protects it; keep the editor
off the public internet (or behind another login) if the content is sensitive. Credentials are stored hashed (scrypt)
in `.data/admin-auth.json`, which is git-ignored; sessions are HttpOnly cookies that expire after 8 hours,
and repeated wrong attempts are locked out for 15 minutes.

In production the first-time setup also requires the `ADMIN_TOKEN` environment variable as a setup key,
so nobody else can claim an unconfigured site. Delete `.data/admin-auth.json` to reset everything.

Tabs: Case studies (each opens a full-page editor with image layouts: one by one, grid or bento, with gap and
corner-radius controls), Services (with card image), Experience, Education & certifications, Testimonials. Experience dates drive the durations and the "years of experience" shown across the site.
Saving writes `src/data/db.json` through `/api/portfolio`; uploads go to `public/uploads`.
Only Published/Active items appear on the site. The editor writes to the server's file system, so it works on a
self-hosted Node server, not on read-only hosts such as Vercel.

## Projects showcase

`/works` is a Behance-style gallery (category chips, search, sort, appreciations/views) and
`/works/[slug]` is the stacked-image project page with an action rail, previous/next and related projects.
"Appreciate" is remembered per visitor in localStorage; appreciation and view totals are numbers you set in the editor.

Import with the `@/` alias, e.g. `import Button from '@/components/ui/Button'`.

## Contact form email

The home page contact form posts to `/api/contact`, which emails the message to you; reply-to is the visitor,
so pressing Reply answers them. Sending happens on the server, so credentials never reach the browser.

**Free, no domain needed: your own Gmail**
1. Turn on 2-Step Verification for the Gmail account.
2. Create an App Password at https://myaccount.google.com/apppasswords.
3. Copy `.env.example` to `.env.local` and set `GMAIL_APP_PASSWORD` (and `CONTACT_TO` / `GMAIL_USER` if not the
   email in `src/data/profile.js`), then restart the server.

Alternatively set `RESEND_API_KEY` for [Resend](https://resend.com) (its free test sender only delivers to your own
Resend account email unless you verify a domain). Gmail is used first if both are set.

Until one is set the form tells the visitor direct sending is unavailable and opens their email app instead.
Protections: a hidden honeypot field, input length limits and 5 messages per hour per connection.
