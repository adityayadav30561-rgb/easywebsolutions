import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small tracked uppercase label, optionally with an index: "(01) SELECTED WORK". */
export function Label({
  children,
  index,
  tone = "light",
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  index?: string;
  tone?: "light" | "dark";
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={cn("label flex items-center gap-3", tone === "dark" ? "text-white/60" : "text-grey", className)}>
      {index && <span className={tone === "dark" ? "text-violet-300" : "text-violet-600"}>({index})</span>}
      <span>{children}</span>
    </Tag>
  );
}

/**
 * Display heading split into lines that rise from their baseline on scroll.
 * Pass an array of lines; a line can be a node (e.g. with an accent span).
 */
export function DisplayLines({
  lines,
  as: Tag = "h2",
  className,
  id,
  delay = 0,
  onLoad,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  id?: string;
  delay?: number;
  /** Animate on page load (hero) instead of on scroll */
  onLoad?: boolean;
}) {
  return (
    <Tag
      id={id}
      className={cn("display", className)}
      {...(onLoad ? {} : { "data-reveal": "lines" })}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {lines.map((line, i) => (
        <span key={i} className={cn("ln", onLoad && "enter-line")} style={{ "--i": i } as CSSProperties}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
