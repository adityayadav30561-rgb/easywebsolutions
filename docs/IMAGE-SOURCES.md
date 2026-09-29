# Image sources

Every photograph on the site shows web design and development work in full colour, and was checked individually on its Unsplash page (29 September 2026) and is marked **“Free to use under the Unsplash License”** — none are Unsplash+ (paid) images.

**Unsplash License** (https://unsplash.com/license): photos can be downloaded and used for free for commercial and non-commercial purposes, and may be modified. Attribution is not required (credit is given here anyway). Restrictions: images may not be sold without significant modification, and may not be compiled to create a competing image service.

Files live in `src/assets/images/` and are imported through `src/data/images.ts` (Next.js generates responsive AVIF/WebP sizes and blur placeholders). Photos are shown in full colour; where text sits on a photo, a soft violet/dark overlay is added with CSS. The source files are unmodified downloads at reduced resolution.

| Image | Source | URL | Creator | License | Usage notes |
|---|---|---|---|---|---|
| `hero-design-studio.jpg` — Designer's desk with a monitor, tablet and phone showing website designs | Unsplash | https://unsplash.com/photos/pKRNxEguRgM | Daniel Korpai | Unsplash License | Home hero background |
| `intro-laptop-desk.jpg` — Laptop and desktop screen showing a website on a bright desk | Unsplash | https://unsplash.com/photos/hGV2TfOh0ns | Domenico Loia | Unsplash License | Home intro |
| `service-design-dev.jpg` — Monitor displaying a website design system | Unsplash | https://unsplash.com/photos/_x335IZXxfc | Balázs Kétyi | Unsplash License | Service: Website design & development; Websites build step (UX) |
| `service-care.jpg` — Laptop showing colourful code in an editor | Unsplash | https://unsplash.com/photos/8qEB0fTe9Vw | Mohammad Rahmani | Unsplash License | Service: Website care |
| `service-optimization.jpg` — Website performance analytics graphs on a screen | Unsplash | https://unsplash.com/photos/JKUTrJ4vK00 | Luke Chesser | Unsplash License | Service: Website optimization; Websites page |
| `process-discover.jpg` — Wall of colourful sticky notes from a planning session | Unsplash | https://unsplash.com/photos/qFpnvZ_j9HU | Hugo Rocha | Unsplash License | Process: Discover / Strategy |
| `process-design.jpg` — Watercolour wireframe sketches of website layouts | Unsplash | https://unsplash.com/photos/tZc3vjPCk-Q | Hal Gatewood | Unsplash License | Process: Design; About page |
| `process-build.jpg` — Laptop with website code on a developer's desk | Unsplash | https://unsplash.com/photos/m_HRfLhgABo | Christopher Gower | Unsplash License | Process: Build / Development |
| `process-launch.jpg` — Hand holding a smartphone showing a live website | Unsplash | https://unsplash.com/photos/NqNDfVTohvM | David Liceaga | Unsplash License | Process: Launch; Work page |
| `process-care.jpg` — Dashboard of website metrics on a laptop | Unsplash | https://unsplash.com/photos/qwtCeJ5cLYs | Stephen Dawson | Unsplash License | Process: Care; Care plans page |
| `why-team.jpg` — Three people laughing while working on laptops together | Unsplash | https://unsplash.com/photos/g1Kr4Ozfoac | Brooke Cagle | Unsplash License | Why EasyWebSolns; About page |
| `about-collaboration.jpg` — Team reviewing a design on a laptop around a table | Unsplash | https://unsplash.com/photos/Of_m3hMsoAA | Jud Mackrill | Unsplash License | Home about split; About page |
| `about-workspace.jpg` — Developer typing code on a laptop beside a plant | Unsplash | https://unsplash.com/photos/UcYBL5V0xWQ | Nubelson Fernandes | Unsplash License | About page hero |
| `cta-workspace.jpg` — Web designer working on a website across two screens | Unsplash | https://unsplash.com/photos/iEiUITs149M | Campaign Creators | Unsplash License | Final CTA background |
| `care-monitoring.jpg` — Laptop showing website analytics and statistics | Unsplash | https://unsplash.com/photos/mcSDtbWXUZU | Lukas Blazek | Unsplash License | Home care section; Care plans page |
| `care-support.jpg` — Two people discussing a website on a laptop | Unsplash | https://unsplash.com/photos/7okkFhxrxNw | KOBU Agency | Unsplash License | Care plans page hero; photo inside the home-hero website mockup |
| `websites-desk.jpg` — Laptop showing an online store website on a desk | Unsplash | https://unsplash.com/photos/Px3iBXV-4TU | Igor Miske | Unsplash License | Websites page hero |
| `contact-conversation.jpg` — Two people pointing at a laptop while planning a website | Unsplash | https://unsplash.com/photos/ZKBzlifgkgw | Mimi Thian | Unsplash License | Contact page |
| `work-tech.jpg` — Two developers working on code at monitors | Unsplash | https://unsplash.com/photos/Im_cQ6hQo10 | Compagnons | Unsplash License | Project cover: Brand & Business Website |
| `work-professional.jpg` — Professional working on a business website at her desk | Unsplash | https://unsplash.com/photos/ARW7Ic7MSAM | Campaign Creators | Unsplash License | Project cover: Professional Practice Website |
| `work-store.jpg` — Smartphone showing a shop's mobile website | Unsplash | https://unsplash.com/photos/eNE1rUBItAk | Sarah Dorweiler | Unsplash License | Project cover: Online Store Concept |
| `work-venue.jpg` — Hand holding a phone showing a mobile site, laptop behind | Unsplash | https://unsplash.com/photos/mxPiMiz7KCo | Daniel Korpai | Unsplash License | Project cover: Hospitality & Venue Website |
| `work-local-business.jpg` — Designer using a drawing tablet with colour swatches and a laptop | Unsplash | https://unsplash.com/photos/CGpifH3FjOA | Theme Photos | Unsplash License | Project cover: Local Services Website |
| `work-community.jpg` — Designer sketching website wireframes at a desk | Unsplash | https://unsplash.com/photos/pqzRfBhd9r0 | UX Indonesia | Unsplash License | Project cover: Community Organisation Website |

## Not photography

- **Logo** (`public/brand/easywebsolns-logo.png`) and favicon (`src/app/icon.png`, `src/app/apple-icon.png`): the official EasyWebSolns logo supplied by the business (background made transparent, whitespace trimmed; the favicon uses the logo mark).
- **Browser/website mockups**: drawn in code (`src/components/visuals`), no third-party assets.
- **Fonts**: Sora and Inter (SIL Open Font License), served via `next/font`.

## Adding images

Only add images whose licence you have verified on the source page. Record every new image in this table before it ships.
