"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { work, workFilters } from "@/data/work";
import { WorkCard } from "./WorkCard";
import { cn } from "@/lib/cn";

const spring = { type: "spring", stiffness: 420, damping: 36, mass: 0.7 } as const;

/** Type filter (an iOS-style segmented control) over an animated grid of all work. */
export function WorkGrid() {
  const [cat, setCat] = useState<(typeof workFilters)[number]["key"]>("all");
  const list = cat === "all" ? work : work.filter((w) => w.kind === cat);
  return (
    <div>
      <div role="group" aria-label="Filter projects" className="glass glass-thin inline-flex max-w-full gap-1 overflow-x-auto p-1.5 [--radius:999px]" data-lenis-prevent>
        {workFilters.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={cat === f.key}
            onClick={() => setCat(f.key)}
            className={cn("relative rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-300", cat === f.key ? "text-white" : "text-ink-2 hover:text-ink")}
          >
            {cat === f.key && <motion.span layoutId="seg" transition={spring} className="absolute inset-0 rounded-full bg-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]" />}
            <span className="relative">
              {f.label} <span className={cn("ml-0.5 text-xs", cat === f.key ? "text-white/60" : "text-mute")}>{f.key === "all" ? work.length : work.filter((w) => w.kind === f.key).length}</span>
            </span>
          </button>
        ))}
      </div>
      <motion.ul layout className="mt-10 grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((item, i) => (
            <motion.li
              key={item.slug}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <WorkCard item={item} priority={i < 2} sizes="(min-width: 768px) 46vw, 92vw" className="aspect-[4/5] sm:aspect-[5/4]" />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
