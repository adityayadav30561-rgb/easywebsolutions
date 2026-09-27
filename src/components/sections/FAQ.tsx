"use client";

import { useId, useState } from "react";
import type { Faq } from "@/data/faqs";
import { cn } from "@/lib/cn";

/** Accessible accordion: real buttons, aria-expanded, animated grid-rows reveal. */
export function FAQ({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="border-t border-ink">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <div key={item.question} className="border-b border-line-strong">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-7 text-left"
              >
                <span className="font-display text-sm text-grey-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-xl font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-violet-700 sm:text-2xl">
                  {item.question}
                </span>
                <span aria-hidden="true" className="relative size-4 self-center">
                  <span className="absolute top-1/2 left-0 h-[1.5px] w-4 -translate-y-1/2 bg-ink" />
                  <span
                    className={cn(
                      "absolute top-0 left-1/2 h-4 w-[1.5px] -translate-x-1/2 bg-ink transition-transform duration-500 ease-[var(--ease-premium)]",
                      isOpen && "scale-y-0",
                    )}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-premium)]",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="max-w-2xl pb-8 pl-14 text-[1rem] leading-relaxed text-ink-700">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
