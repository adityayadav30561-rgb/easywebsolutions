"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { projectCategories, projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { cn } from "@/lib/cn";

const spring = { type: "spring", stiffness: 420, damping: 36, mass: 0.7 } as const;

/** Category filter (an iOS-style segmented control) over an animated grid. */
export function WorkGrid() {
  const [cat, setCat] = useState<(typeof projectCategories)[number]>("All");
  const list = cat === "All" ? projects : projects.filter((p) => p.category === cat);
  return (
    <div>
      <div role="group" aria-label="Filter projects" className="glass glass-thin inline-flex max-w-full gap-1 overflow-x-auto p-1.5 [--radius:999px]" data-lenis-prevent>
        {projectCategories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={cn("relative rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-300", cat === c ? "text-white" : "text-ink-2 hover:text-ink")}
          >
            {cat === c && <motion.span layoutId="seg" transition={spring} className="absolute inset-0 rounded-full bg-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]" />}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>
      <motion.ul layout className="mt-10 grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={p} priority={i < 2} sizes="(min-width: 768px) 46vw, 92vw" className="aspect-[4/5] sm:aspect-[5/4]" />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
