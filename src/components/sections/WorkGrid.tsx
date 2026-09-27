"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { projectCategories, type Project } from "@/data/projects";
import { ProjectCover } from "@/components/visuals/ProjectCover";
import { cn } from "@/lib/cn";

/** Asymmetric rhythm: each slot has its own column span, ratio and offset. */
const slots = [
  { col: "lg:col-span-7", ratio: "aspect-[4/3]", offset: "", frame: "right" as const },
  { col: "lg:col-span-5", ratio: "aspect-[4/5]", offset: "lg:mt-40", frame: "low" as const },
  { col: "lg:col-span-5", ratio: "aspect-[4/5]", offset: "", frame: "low" as const },
  { col: "lg:col-span-7", ratio: "aspect-[16/11]", offset: "lg:mt-28", frame: "left" as const },
  { col: "lg:col-span-12", ratio: "aspect-[4/3] sm:aspect-[21/9]", offset: "", frame: "wide-right" as const },
  { col: "lg:col-span-6 lg:col-start-4", ratio: "aspect-[4/3]", offset: "", frame: "right" as const },
];

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      <div className="flex flex-col justify-between gap-6 border-y border-ink py-4 sm:flex-row sm:items-center">
        <div role="group" aria-label="Filter projects" className="-mx-1 flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {projectCategories.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(cat)}
                className={cn(
                  "label relative flex h-11 shrink-0 items-center gap-2 rounded-[6px] px-3 transition-colors duration-300",
                  active ? "bg-ink text-white" : "text-grey hover:text-ink",
                )}
              >
                {cat}
                <sup className={cn("text-[0.55rem]", active ? "text-violet-300" : "text-grey")}>
                  {cat === "All" ? projects.length : projects.filter((p) => p.category === cat).length}
                </sup>
              </button>
            );
          })}
        </div>
        <p className="label text-grey" aria-live="polite">
          Showing {String(visible.length).padStart(2, "0")} {visible.length === 1 ? "project" : "projects"}
        </p>
      </div>

      <div className="mt-16 grid gap-x-10 gap-y-20 lg:grid-cols-12 lg:gap-y-28">
        {visible.map((project, i) => {
          const slot = slots[i % slots.length];
          return (
            <article
              key={project.slug}
              className={cn("group relative", slot.col, slot.offset)}
              data-reveal=""
              style={{ "--d": `${(i % 2) * 100}ms` } as CSSProperties}
            >
              <div className={cn("relative overflow-hidden", slot.ratio)}>
                <ProjectCover project={project} sizes="(min-width: 1024px) 60vw, 100vw" frame={slot.frame} />
                <span aria-hidden="true" className="signal absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 transition-transform duration-700 ease-[var(--ease-cinema)] group-hover:scale-x-100" />
              </div>
              <div className="mt-6 transition-transform duration-700 ease-[var(--ease-premium)] group-hover:translate-x-1">
                <div>
                  <p className="label text-grey">
                    <span className="text-violet-600">{String(projects.indexOf(project) + 1).padStart(2, "0")}</span> — {project.industry}
                    {project.status === "concept" && " · Concept"}
                  </p>
                  <h2 className="display mt-3 text-[2rem] text-ink sm:text-[2.6rem]">
                    <Link href={`/work/${project.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                      {project.name}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-grey">{project.description}</p>
                </div>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1" aria-label="Services provided">
                  {project.services.map((s) => (
                    <li key={s} className="text-xs text-ink-700 before:mr-1.5 before:text-violet-600 before:content-['/']">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <span aria-hidden="true" className="pointer-events-none absolute -inset-2 ring-violet group-has-[a:focus-visible]:ring-2" />
            </article>
          );
        })}
      </div>

      {visible.length === 0 && (
        <div className="mt-16 border border-dashed border-line-strong px-6 py-20 text-center">
          <p className="display text-3xl text-ink">Coming soon.</p>
          <p className="mt-3 text-grey">Projects in this category will be added shortly.</p>
          <button type="button" onClick={() => setFilter("All")} className="label mt-6 h-11 rounded-[6px] bg-ink px-4 text-white">
            Show all projects
          </button>
        </div>
      )}
    </div>
  );
}
