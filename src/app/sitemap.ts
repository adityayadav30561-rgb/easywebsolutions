import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/websites", priority: 0.9 },
    { path: "/care-plans", priority: 0.9 },
    { path: "/work", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
    { path: "/credits", priority: 0.1 },
  ];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p.path}`, changeFrequency: "monthly" as const, priority: p.priority })),
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
