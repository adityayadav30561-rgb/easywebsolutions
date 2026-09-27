"use client";

import { useState } from "react";
import { projectCategories, type Project } from "@/data/projects";
import { PortfolioCard } from "./PortfolioCard";
import { cn } from "@/lib/cn";

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by category"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {projectCategories.map((cat) => {
          const count = cat === "All" ? projects.length : projects.filter((p) => p.category === cat).length;
          const active = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(cat)}
              className={cn(
                "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all duration-300",
                active
                  ? "border-ink bg-ink text-white shadow-[0_8px_20px_-10px_rgb(16_21_34/0.6)]"
                  : "border-line bg-white text-ink-700 hover:border-violet/30 hover:bg-violet-50",
              )}
            >
              {cat}
              <span className={cn("text-xs tabular-nums", active ? "text-white/60" : "text-slate-400")}>{count}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        {filter === "All" ? "" : ` in ${filter}`}
      </p>

      {visible.length > 0 ? (
        <div className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:gap-x-10">
          {visible.map((project, i) => (
            <PortfolioCard
              key={project.slug}
              project={project}
              headingLevel="h2"
              showServices
              className={cn(filter === "All" && i % 2 === 1 && "md:mt-24")}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-[22px] border border-dashed border-line-strong bg-paper px-6 py-20 text-center">
          <p className="font-display text-xl font-semibold">Projects in this category are coming soon.</p>
          <p className="mt-2 text-slate">In the meantime, explore our other work or tell us about your project.</p>
          <button
            type="button"
            onClick={() => setFilter("All")}
            className="mt-6 inline-flex h-11 items-center rounded-xl border border-line-strong bg-white px-5 text-sm font-medium hover:bg-violet-50"
          >
            Show all projects
          </button>
        </div>
      )}
    </div>
  );
}
