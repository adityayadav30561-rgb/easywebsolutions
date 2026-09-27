"use client";

import { useId, useState } from "react";
import type { Faq } from "@/data/faqs";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/** Accessible accordion: real buttons, aria-expanded, animated grid-rows reveal. */
export function FAQ({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <div key={item.question}>
            <h3 className="font-sans">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left text-[1.0625rem] font-medium text-ink transition-colors hover:text-violet-700 sm:text-lg"
              >
                {item.question}
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-[var(--ease-premium)]",
                    isOpen ? "rotate-45 border-violet/30 bg-violet-50 text-violet-600" : "border-line text-slate group-hover:border-violet/30",
                  )}
                >
                  <Icon name="plus" size={16} />
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
                <p className="max-w-3xl pr-12 pb-7 text-[0.9375rem] leading-relaxed text-slate sm:text-base">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
