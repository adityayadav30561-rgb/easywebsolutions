"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Counts up to a figure like "+7,245.2%", "311K" or "1.19M" when it scrolls
 * into view, keeping its prefix, suffix, separators and decimals. The final
 * text is rendered on the server, so it's correct without JavaScript.
 */
export function CountUp({ value, className, duration = 1.8 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!el || !inView || reduce || !m) return;
    const [, prefix, num, suffix] = m;
    const target = parseFloat(num.replace(/,/g, ""));
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const grouped = num.includes(",");
    const fmt = (n: number) => {
      const fixed = n.toFixed(decimals);
      if (!grouped) return fixed;
      const [i, d] = fixed.split(".");
      return i.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (d ? `.${d}` : "");
    };
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => (el.textContent = `${prefix}${fmt(n)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {value}
    </span>
  );
}
