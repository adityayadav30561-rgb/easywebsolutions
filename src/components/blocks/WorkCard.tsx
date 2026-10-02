import type { WorkItem } from "@/data/work";
import { ProjectCard } from "./ProjectCard";
import { SeoCard } from "./SeoCard";

/** Renders the right card for any kind of work. */
export function WorkCard({ item, className, sizes, priority }: { item: WorkItem; className?: string; sizes?: string; priority?: boolean }) {
  if (item.kind === "seo") return <SeoCard project={item.project} className={className} sizes={sizes} priority={priority} />;
  return <ProjectCard project={item.project} className={className} sizes={sizes} priority={priority} />;
}
