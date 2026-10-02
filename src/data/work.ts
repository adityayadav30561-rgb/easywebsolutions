/**
 * Everything shown on the Work page, in display order.
 *
 * - `kind` drives the card design, the case-study template and the filters.
 * - `featured` items (in this order) appear in the home page "Selected work" rail.
 *   Keep it to the 4–6 strongest pieces; everything stays on /work.
 *
 * To add a real website or app later, add its data file and push it here with
 * kind "website" or "app" — filters appear automatically once a kind has items.
 */
import { projects, type Project } from "./projects";
import { seoProjects, type SeoProject } from "./seo-projects";

export type WorkKind = "website" | "app" | "seo";

export type WorkItem =
  | { kind: "seo"; slug: string; featured: boolean; project: SeoProject }
  | { kind: "concept"; slug: string; featured: boolean; project: Project };

/** Design concepts still featured on the home page until real websites replace them. */
const featuredConcepts = new Set(["brand-business-website", "local-services-website"]);

export const work: WorkItem[] = [
  ...seoProjects.map((p) => ({ kind: "seo" as const, slug: p.slug, featured: p.featured, project: p })),
  ...projects.map((p) => ({ kind: "concept" as const, slug: p.slug, featured: featuredConcepts.has(p.slug), project: p })),
];

export const featuredWork = work.filter((w) => w.featured);

export function getWork(slug: string) {
  return work.find((w) => w.slug === slug);
}

/** Filter tabs: only kinds that currently have projects are shown. */
const filterDefs: { key: "all" | WorkItem["kind"]; label: string }[] = [
  { key: "all", label: "All work" },
  { key: "seo", label: "SEO" },
  { key: "concept", label: "Website concepts" },
];
export const workFilters = filterDefs.filter((f) => f.key === "all" || work.some((w) => w.kind === f.key));
