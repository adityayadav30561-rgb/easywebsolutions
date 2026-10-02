"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import type { Faq } from "@/data/faqs";
import { cn } from "@/lib/cn";

function Item({ faq, open, onToggle }: { faq: Faq; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <li className={cn("glass glass-thin transition-[--glare] [--radius:1.6rem]", open && "[--glare:1]")}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-7 sm:py-6">
          <span className="text-[1.08rem] font-semibold tracking-[-0.02em] text-ink sm:text-[1.2rem]">{faq.question}</span>
          <span aria-hidden="true" className={cn("relative grid size-9 shrink-0 place-items-center rounded-full bg-white/70 transition-transform duration-500 ease-[var(--ease-spring)]", open && "rotate-45")}>
            <span className="absolute h-[1.5px] w-3.5 rounded bg-ink" />
            <span className="absolute h-3.5 w-[1.5px] rounded bg-ink" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-3xl px-6 pb-6 leading-relaxed text-ink-2 sm:px-7 sm:pb-7">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function FAQList({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="space-y-3">
      {faqs.map((f, i) => (
        <Item key={f.question} faq={f} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
      ))}
    </ul>
  );
}
