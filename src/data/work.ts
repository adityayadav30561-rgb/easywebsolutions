/**
 * Everything shown on the Work page, in display order.
 *
 * - `kind` drives the card design, the case-study template and the filters.
 * - `featured` items (in this order) appear in the home page "Selected work" rail.
 *   Keep it to the 4–6 strongest pieces; everything stays on /work.
 *
 * To add a real website later, add its data file and push it here with
 * kind "website" — filters appear automatically once a kind has items.
 */
import { projects, type Project } from "./projects";
import { seoProjects, type SeoProject } from "./seo-projects";
import { appProjects, type AppProject } from "./app-projects";

export type WorkKind = "website" | "app" | "seo";

export type WorkItem =
  | { kind: "seo"; slug: string; featured: boolean; project: SeoProject }
  | { kind: "app"; slug: string; featured: boolean; project: AppProject }
  | { kind: "concept"; slug: string; featured: boolean; project: Project };

/** Design concepts featured on the home page (none now that real apps and SEO work fill the rail). */
const featuredConcepts = new Set<string>([]);

export const work: WorkItem[] = [
  ...seoProjects.map((p) => ({ kind: "seo" as const, slug: p.slug, featured: p.featured, project: p })),
  ...appProjects.map((p) => ({ kind: "app" as const, slug: p.slug, featured: p.featured, project: p })),
  ...projects.map((p) => ({ kind: "concept" as const, slug: p.slug, featured: featuredConcepts.has(p.slug), project: p })),
];

/** Home rail order: alternate apps and SEO results so the two read as one body of work. */
const railOrder = ["event-intelligence-india", "badowl", "maharishi-ayurveda", "kama-health-india", "toys-cartel", "khadi-organique"];
const rank = (slug: string) => (railOrder.includes(slug) ? railOrder.indexOf(slug) : railOrder.length);
export const featuredWork = work.filter((w) => w.featured).sort((a, b) => rank(a.slug) - rank(b.slug));

export function getWork(slug: string) {
  return work.find((w) => w.slug === slug);
}

/** Filter tabs: only kinds that currently have projects are shown. */
const filterDefs: { key: "all" | WorkItem["kind"]; label: string }[] = [
  { key: "all", label: "All work" },
  { key: "seo", label: "SEO" },
  { key: "app", label: "Apps" },
  { key: "concept", label: "Website concepts" },
];
export const workFilters = filterDefs.filter((f) => f.key === "all" || work.some((w) => w.kind === f.key));
