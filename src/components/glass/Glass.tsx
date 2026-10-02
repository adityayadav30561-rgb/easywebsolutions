"use client";

import { useRef, type CSSProperties, type ElementType, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  as?: ElementType;
  dark?: boolean;
  thin?: boolean;
  /** Specular highlight follows the pointer */
  interactive?: boolean;
  radius?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<string, unknown>;

/**
 * Liquid-glass surface. The material itself is pure CSS (`.glass` in
 * globals.css); this component only adds the pointer-tracked highlight,
 * written straight to CSS variables so it never re-renders React.
 */
export function Glass({ as: Tag = "div", dark, thin, interactive, radius, className, style, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    el.style.setProperty("--glare", "1");
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--glare", "0.7");
  };

  return (
    <Tag
      ref={ref}
      className={cn("glass", dark && "glass-dark", thin && "glass-thin", className)}
      style={{ ...(radius ? { "--radius": radius } : null), ...style } as CSSProperties}
      onPointerMove={interactive ? onMove : undefined}
      onPointerLeave={interactive ? onLeave : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
