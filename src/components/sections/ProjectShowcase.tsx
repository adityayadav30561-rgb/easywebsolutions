import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";
import { ProjectCover } from "@/components/visuals/ProjectCover";
import { cn } from "@/lib/cn";

export type ShowcaseLayout = "wide" | "portrait-right" | "full" | "offset";

/**
 * A single project, composed editorially. Each layout places image and
 * information differently so the portfolio reads like a publication.
 */
export function ProjectShowcase({
  project,
  index,
  layout,
  tone = "dark",
  headingLevel: H = "h3",
}: {
  project: Project;
  index: number;
  layout: ShowcaseLayout;
  tone?: "dark" | "light";
  headingLevel?: "h2" | "h3";
}) {
  const dark = tone === "dark";
  const href = `/work/${project.slug}`;
  const no = String(index + 1).padStart(2, "0");

  const info = (
    <div className="transition-transform duration-700 ease-[var(--ease-premium)] group-hover:-translate-y-1">
      <p className={cn("label flex items-center gap-3", dark || layout === "full" ? "text-white/50" : "text-grey")}>
        <span className={dark || layout === "full" ? "text-violet-300" : "text-violet-600"}>Project {no}</span>
        <span aria-hidden="true" className="h-px w-6 bg-current" />
        {project.industry}
      </p>
      <H className={cn("display mt-5 text-[2.2rem] sm:text-[3rem] xl:text-[3.6rem]", dark || layout === "full" ? "text-white" : "text-ink")}>
        <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
          {project.name}
        </Link>
      </H>
      <p className={cn("mt-5 max-w-sm text-[1rem] leading-relaxed", dark || layout === "full" ? "text-white/65" : "text-grey")}>
        {project.kicker} {project.description}
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <span className={cn("label flex items-center gap-3", dark || layout === "full" ? "text-white" : "text-ink")}>
          View case study
          <svg aria-hidden="true" viewBox="0 0 20 16" className="h-3 w-4 translate-x-0 text-violet-300 opacity-0 transition-all duration-500 group-hover:translate-x-1.5 group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M0 8h18M12 2l6 6-6 6" />
          </svg>
        </span>
        {project.status === "concept" && (
          <span className={cn("label rounded-[4px] border px-2 py-1 !text-[0.625rem]", dark || layout === "full" ? "border-white/20 text-white/60" : "border-line-strong text-grey")}>
            Concept
          </span>
        )}
      </div>
    </div>
  );

  const image = (ratio: string, sizes: string, frame: "right" | "left" | "center" | "low" | "wide-right", extra?: string) => (
    <div className={cn("relative overflow-hidden", ratio, extra)}>
      <ProjectCover project={project} sizes={sizes} frame={frame} />
      <span aria-hidden="true" className="signal absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 transition-transform duration-700 ease-[var(--ease-cinema)] group-hover:scale-x-100" />
    </div>
  );

  const reveal = { "data-reveal": "", style: { "--d": "0ms" } as CSSProperties };

  if (layout === "wide") {
    return (
      <article className="group relative grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10" {...reveal}>
        {image("aspect-[4/3] sm:aspect-[16/10] lg:col-span-8", "(min-width: 1024px) 66vw, 100vw", "right")}
        <div className="lg:col-span-4 lg:pb-2">{info}</div>
      </article>
    );
  }
  if (layout === "portrait-right") {
    return (
      <article className="group relative grid gap-8 lg:grid-cols-12 lg:gap-10" {...reveal}>
        <div className="order-2 lg:order-1 lg:col-span-4 lg:col-start-1 lg:pt-24">{info}</div>
        {image("order-1 aspect-[4/5] lg:order-2 lg:col-span-6 lg:col-start-6", "(min-width: 1024px) 50vw, 100vw", "low")}
      </article>
    );
  }
  if (layout === "full") {
    return (
      <article className="group relative" {...reveal}>
        {image("aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]", "100vw", "wide-right")}
        <div className="mt-8 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:left-0 lg:mt-0 lg:flex lg:w-[48%] lg:items-end lg:bg-gradient-to-r lg:from-night/85 lg:to-transparent lg:p-10">
          <div className="lg:pointer-events-auto">{info}</div>
        </div>
      </article>
    );
  }
  return (
    <article className="group relative grid gap-8 lg:grid-cols-12 lg:gap-10" {...reveal}>
      {image("aspect-[4/3] lg:col-span-7 lg:col-start-2", "(min-width: 1024px) 58vw, 100vw", "left")}
      <div className="lg:col-span-3 lg:col-start-10 lg:pt-10">{info}</div>
    </article>
  );
}
