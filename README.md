# EasyWebSolns — Websites That Work For You

Marketing website for **easywebsolns.com**, a website design, development, optimization and website-care studio.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4**. Every page is statically prerendered; the only
server code is the contact-form endpoint.

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

CTAs pre-fill the contact form: `/contact?package=professional`, `/contact?plan=plus`, `/contact?need=optimization`.

## ⚠️ Before launch — replace placeholders

All placeholders are centralised and marked `PLACEHOLDER` in code.

1. **Logo** — `public/brand/logo.svg` is a placeholder. Replace it with the official logo file (SVG or PNG) and update
   `logo.src`, `logo.width` and `logo.height` in `src/config/site.ts` to the file's intrinsic size. The logo is rendered
   unmodified in the navbar, footer and social share image. Replace `src/app/icon.svg` (favicon) too.
2. **Contact details** — email, phone and WhatsApp number in `src/config/site.ts`.
3. **Social links** — Instagram / LinkedIn / Facebook URLs in `src/config/site.ts`.
4. **Testimonials** — `src/data/testimonials.ts` (only publish real, approved quotes).
5. **Portfolio** — `src/data/projects.ts` contains clearly labelled *concept* projects. Add real client work with
   `status: "client"`, an `image` screenshot (e.g. `/public/work/name.webp`) and only measured results.
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
  components/
    layout/            Navbar, MobileMenu, Footer, Logo
    sections/          PageHero, PricingCard, ComparisonTable, PortfolioCard, FAQ, CTASection, …
    sections/home/     homepage-only sections
    visuals/           HeroVisual, ProjectMockup, BrowserFrame (code-drawn mockups)
    contact/           ContactForm
    ui/                Button, Icon, SectionHeading, RevealObserver
  config/site.ts       brand, contact details, navigation
  data/                pricing, care plans, services, projects, FAQs, testimonials
  lib/                 SEO helper, contact validation, utils
```

Content lives in `src/data` and `src/config` — pages and components never hardcode repeated content.

## Design system

Tokens are defined in `src/app/globals.css` (`@theme`): ink `#101522`, violet `#8B5CF6` / `#A78BFA` / `#F5F1FF`,
paper `#FAFAFC`, slate `#64748B`. Headings use **Sora**, body text **Inter** (self-hosted via `next/font`).
Scroll reveals use a single IntersectionObserver and respect `prefers-reduced-motion`; page transitions use the
View Transitions API where supported.
