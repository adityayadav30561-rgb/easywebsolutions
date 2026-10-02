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
    site/              Nav (floating glass bar), Footer, Button, Aurora (animated colour field)
    glass/             Glass — the liquid-glass surface with pointer-tracked highlight
    motion/            SmoothScroll (Lenis), Reveal / RevealLines, ScrollWords, Parallax
    home/              Hero, Marquee, Statement, ServiceStack, WorkReel, Process, Pricing, CareBand, Why
    blocks/            SectionHead, PageIntro, PackageCard, ProjectCard, WorkGrid, CompareTable, FAQ, CTA, GlassPhoto
    visuals/           code-drawn concept websites (ProjectMockup, BrowserFrame)
    contact/           ContactForm
  config/site.ts       brand, contact details, navigation
  data/                pricing, care plans, services, projects, FAQs, images
  lib/                 SEO helper, contact validation, utils
```

Content lives in `src/data` and `src/config` — pages and components never hardcode repeated content.

## Design system — "Liquid Glass"

- **Material:** content sits on layered glass (`.glass` in `globals.css`): frosted `backdrop-filter` blur with boosted
  saturation, a luminous gradient rim, inner thickness shadows and a specular highlight that follows the pointer.
  A slowly drifting aurora of brand colour (violet, iris, sky, blush) sits behind everything so the glass has
  something to refract. Dark "night" panels use the same glass in a dark tint.
- **Type:** Inter with its optical-size axis (tight display letterforms, open text sizes) paired with Instrument
  Serif italic for single emphasised words. No eyebrow labels above headings.
- **Motion:** Lenis inertial smooth scrolling; Motion for scroll-linked scenes — the hero headline dissolves while a
  glass-framed website rises and flattens, statements light up word by word, service cards stack, the work rail
  slides sideways while pinned, the process panel stays pinned and changes per step, and a glass highlight slides
  between nav items. Everything is transform/opacity based and fully disabled under `prefers-reduced-motion`.
- **Imagery:** licensed full-colour photography of web design and development work, listed with source and licence
  in [`docs/IMAGE-SOURCES.md`](docs/IMAGE-SOURCES.md) and credited at `/credits`.
