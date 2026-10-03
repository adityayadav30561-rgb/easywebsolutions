"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useScrollFx } from "./useScrollFx";
import { useRef, type ReactNode } from "react";

/** Moves its content against the scroll by `amount` px across the viewport. */
export function Parallax({ children, amount = 80, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fx = useScrollFx();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={fx ? { y } : undefined} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
