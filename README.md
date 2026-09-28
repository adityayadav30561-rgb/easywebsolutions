# EasyWebSolns — Websites That Work For You

Marketing website for **easywebsolns.com**, a website design, development, optimization and website-care studio.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4**. Every page is statically prerendered; the only
server code is the contact-form endpoint.

> **HQ (the agency CRM)** lives in [`hq/`](hq/README.md). It is a separate Next.js app with its own database and
> is deployed as a second Vercel project (root directory `hq`).

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
```

## Pages

| Route           | Purpose                                                    |
| --------------- | ---------------------------------------------------------- |
| `/`             | Home                                                       |
| `/websites`     | Website packages, comparison, process, what's included, FAQ |
| `/care-plans`   | Care plans, comparison table, FAQ                          |
| `/work`         | Portfolio with category filters                            |
| `/work/[slug]`  | Case study pages (generated from `src/data/projects.ts`)   |
| `/about`        | Approach, mission, values                                  |
| `/contact`      | Enquiry form + contact details                             |
| `/privacy`, `/terms` | Legal templates                                        |
| `/credits`      | Photography credits                                        |

CTAs pre-fill the contact form: `/contact?package=professional`, `/contact?plan=plus`, `/contact?need=optimization`.

## ⚠️ Before launch — replace placeholders

All placeholders are centralised and marked `PLACEHOLDER` in code.

1. **Logo** — done: the official logo is `public/brand/easywebsolns-logo.png` (background removed, whitespace trimmed);
   the favicon (`src/app/icon.png`, `apple-icon.png`) is the logo's "e" mark.
2. **Contact details** — email, phone and WhatsApp number in `src/config/site.ts`.
3. **Social links** — Instagram / LinkedIn / Facebook URLs in `src/config/site.ts`.
4. **Testimonials** — `src/data/testimonials.ts` (only publish real, approved quotes).
5. **Portfolio** — `src/data/projects.ts` contains clearly labelled *concept* projects (a licensed photograph with a
   code-drawn website over it). Add real client work with `status: "client"`, an `image` screenshot
   (e.g. `/public/work/name.webp`) and only measured results.
6. **Legal pages** — `/privacy` and `/terms` are templates; have them reviewed for your jurisdiction.

## Contact form delivery

The form posts to `POST /api/contact` (validation, honeypot and basic rate limiting included). Configure **one**
delivery method in your hosting environment (see `.env.example`):

- **Email via Resend:** `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, optional `CONTACT_FROM_EMAIL` (a verified sender).
- **Webhook:** `CONTACT_WEBHOOK_URL` — receives the enquiry as JSON (Zapier, Make, Slack workflow, etc.).

In development with nothing configured, enquiries are printed to the server console. In production with nothing
configured the endpoint returns `503` and the form shows a fallback email link, so enquiries are never silently lost.

## Project structure

```
src/
  app/                 routes, metadata, sitemap, robots, OG image, API route
  assets/images/       licensed photography (see docs/IMAGE-SOURCES.md)
  components/
    layout/            Navbar, MobileMenu, Footer, Logo
    sections/          PageHero, ServiceRow, ProjectShowcase, ProcessJourney, PricingCard (PackageSheet,
                       CarePlanCard), ComparisonTable, WorkGrid, FAQ, Testimonial, CTASection
    sections/home/     homepage-only sections
    visuals/           ProjectMockup, ProjectCover, DeviceShowcase, BrowserFrame
    contact/           ContactForm
    ui/                Button, Photo, Type (Label, DisplayLines), Icon, ScrollEffects
  config/site.ts       brand, contact details, navigation
  data/                pricing, care plans, services, projects, FAQs, testimonials, images
  lib/                 SEO helper, contact validation, utils
```

Content lives in `src/data` and `src/config` — pages and components never hardcode repeated content.

## Design system — "Structure & Light"

- **Palette (sampled from the logo):** navy `#121621`, near-black `#0B0D14`, white, off-white `#F7F7F5`, grey
  `#575B62`. Logo purple `#8A6DBC` (deep `#67578D`, text `#6F55A3`, lavender `#B797CD`) is the *signal* — a thin line of light, an underline, an index number — never a background.
- **Type:** Sora for uppercase display statements (tight 0.9 line-height, negative tracking) and Inter for body/UI.
  Small tracked labels (`(01) SERVICES`) carry the editorial structure.
- **Shape:** mostly hard edges and hairlines; radius is reserved for buttons (8px) and small chips (4–6px).
- **Imagery:** licensed architectural and craft photography, treated in CSS (monochrome, violet grade, dark overlay).
  Every file is listed with source and licence in [`docs/IMAGE-SOURCES.md`](docs/IMAGE-SOURCES.md) and credited at
  `/credits`. Images are statically imported (`src/data/images.ts`) so Next.js serves AVIF/WebP with blur placeholders.
- **Motion:** CSS load choreography in the hero, line-by-line display reveals, mask reveals for images, light
  parallax and a pinned horizontal process journey on desktop — all driven by one small scroll engine
  (`ScrollEffects`) and disabled under `prefers-reduced-motion`.
