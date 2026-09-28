# Image sources

Every photograph on the site was checked individually on its Unsplash page (September 2026) and is marked **“Free to use under the Unsplash License”** — none are Unsplash+ (paid) images.

**Unsplash License** (https://unsplash.com/license): photos can be downloaded and used for free for commercial and non-commercial purposes, and may be modified. Attribution is not required (credit is given here anyway). Restrictions: images may not be sold without significant modification, and may not be compiled to create a competing image service.

Files live in `src/assets/images/` and are imported through `src/data/images.ts` (Next.js generates responsive AVIF/WebP sizes and blur placeholders). Colour treatments (monochrome, purple grading, overlays) are applied with CSS; the source files are unmodified downloads at reduced resolution.

| Image | Source | URL | Creator | License | Usage notes |
|---|---|---|---|---|---|
| `hero-modernist-facade.jpg` — Black and white photo of a modernist building | Unsplash | https://unsplash.com/photos/xUCYN4GPePI | Maxence Ambert | Unsplash License | Home hero background (monochrome, purple light) |
| `first-sale-solo-building.jpg` — Concrete tower against a pale sky (Solo-building series) | Unsplash | https://unsplash.com/photos/VO7HVshBK5Y | Pierre Châtel-Innocenti | Unsplash License | Home intro magazine spread |
| `service-grid-facade.jpg` — Grid facade looking up, Washington D.C. | Unsplash | https://unsplash.com/photos/MPWbGMrZ6eo | Christophe Laurenceau | Unsplash License | Service row: Website design & development |
| `service-laptop-night.jpg` — Laptop on a desk at night | Unsplash | https://unsplash.com/photos/vw_y__9mKl8 | Ankit Singh | Unsplash License | Service row: Website care |
| `service-galaxy-soho.jpg` — Curved facade of Galaxy SOHO, Beijing | Unsplash | https://unsplash.com/photos/t0nojyPGbok | Sam Balye | Unsplash License | Service row: Website optimization; Websites page |
| `process-discover-concrete.jpg` — Heiligkreuzkirche concrete interior, Chur | Unsplash | https://unsplash.com/photos/9AjwOAIdsII | Ricardo Gomez Angel | Unsplash License | Process: Discover |
| `process-design-letterpress.jpg` — Letterpress type being arranged, Taichung | Unsplash | https://unsplash.com/photos/98ZZnRQKISM | Raymond Yeung | Unsplash License | Process: Design; About page |
| `process-build-brutalist.jpg` — Brutalist balconies, Mériadeck, Bordeaux | Unsplash | https://unsplash.com/photos/4frZSdcZaE0 | Alexander Psiuk | Unsplash License | Process: Build |
| `process-launch-city.jpg` — New York City at night from above | Unsplash | https://unsplash.com/photos/AaceTp_LRAM | dominik hofbauer | Unsplash License | Process: Launch |
| `process-care-underground.jpg` — Underground car park in dim light, Bergen | Unsplash | https://unsplash.com/photos/VsejBFGkeyM | David Werbrouck | Unsplash License | Process: Care; Care plans |
| `why-concrete-blocks.jpg` — Brutalist concrete blocks, Salamanca | Unsplash | https://unsplash.com/photos/9DRX_cW48RQ | uve sanchez | Unsplash License | Why EasyWebSolns |
| `about-stone-artisan.jpg` — Artisan carving stone, Mount Qingcheng | Unsplash | https://unsplash.com/photos/XChuTe9LR6s | Quan-You Zhang | Unsplash License | Home about split; About page |
| `about-wood-carving.jpg` — Chisel carving wood, close-up | Unsplash | https://unsplash.com/photos/3cIvvzjE6Lk | Dominik Scythe | Unsplash License | About page |
| `cta-buildings-night.jpg` — Low angle view of two buildings at night | Unsplash | https://unsplash.com/photos/53McvMr9sjo | Viktor Talashuk | Unsplash License | Final CTA background |
| `care-night-street.jpg` — Empty Toronto street at night | Unsplash | https://unsplash.com/photos/D6Bk1A3-gMA | Patrick Tomasso | Unsplash License | Home care section background |
| `care-desk-dark.jpg` — Dark minimal desk with monitor | Unsplash | https://unsplash.com/photos/EJPzqPYZgvI | Kevin Canlas | Unsplash License | Care plans page hero |
| `websites-curved-museum.jpg` — Curved architecture, Canadian Museum of History | Unsplash | https://unsplash.com/photos/I-tis7ZFIVI | Zachary McSween Manickchand | Unsplash License | Websites page hero |
| `contact-reflection.jpg` — Brutalist building reflected in water | Unsplash | https://unsplash.com/photos/1jyHQxBAE7A | William Priess | Unsplash License | Contact page |
| `work-tech-tower.jpg` — Tall building against dark sky, Tokyo | Unsplash | https://unsplash.com/photos/CvocCBtUdfE | mos design | Unsplash License | Project cover: Brand & Business Website |
| `work-professional-windows.jpg` — Repeating window pattern of a tall building | Unsplash | https://unsplash.com/photos/jtkDOOIl2uE | Michael Cochran | Unsplash License | Project cover: Professional Practice Website |
| `work-store-lamp.jpg` — Yellow desk lamp on a glass trestle table | Unsplash | https://unsplash.com/photos/BPmgWWtwcuQ | Brecht Corbeel | Unsplash License | Project cover: Online Store Concept |
| `work-venue-tram.jpg` — Red tram at night, Queens Quay West, Toronto | Unsplash | https://unsplash.com/photos/023T4jyCRqA | Filip Mroz | Unsplash License | Project cover: Hospitality & Venue Website |
| `work-local-craft.jpg` — Grayscale photo of a person cutting a slab | Unsplash | https://unsplash.com/photos/idEEZ-wQkfA | Benjamin Thomas | Unsplash License | Project cover: Local Services Website |
| `work-community-studio.jpg` — Hands working on a project at a table | Unsplash | https://unsplash.com/photos/HPF5e282XCc | gomi | Unsplash License | Project cover: Community Organisation Website |

## Not photography

- **Logo** (`public/brand/easywebsolns-logo.png`) and favicon (`src/app/icon.png`, `src/app/apple-icon.png`): the official EasyWebSolns logo supplied by the business (background made transparent, whitespace trimmed; the favicon uses the logo mark).
- **Browser/website mockups**: drawn in code (`src/components/visuals`), no third-party assets.
- **Fonts**: Sora and Inter (SIL Open Font License), served via `next/font`.

## Adding images

Only add images whose licence you have verified on the source page. Record every new image in this table before it ships.
