"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children into view once (opacity and transform only, so it stays on the GPU). */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease, delay }}
    >
      {children}
    </M>
  );
}

/**
 * Headline whose lines rise out of a mask one after another. The heading
 * itself is observed (not the clipped lines), so the reveal always fires.
 */
export function RevealLines({
  lines,
  as = "h2",
  className,
  delay = 0,
  onMount,
  id,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  /** Animate on page load instead of when scrolled into view */
  onMount?: boolean;
  id?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Tag = as;
    return (
      <Tag id={id} className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }
  const M = motion[as];
  return (
    <M
      id={id}
      className={className}
      initial="hidden"
      {...(onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } })}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span
            className="block will-change-transform"
            variants={{
              hidden: { y: "105%", opacity: 0 },
              show: { y: "0%", opacity: 1, transition: { duration: 1.15, ease, delay: delay + i * 0.09 } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </M>
  );
}
