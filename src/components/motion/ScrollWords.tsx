"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

function Word({ word, i, total, progress, accent }: { word: string; i: number; total: number; progress: MotionValue<number>; accent: boolean }) {
  const start = i / total;
  const end = start + 1.6 / total;
  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={cn("inline-block will-change-[opacity]", accent && "t-serif t-gradient")}>
      {word}&nbsp;
    </motion.span>
  );
}

/**
 * A statement that lights up word by word as it scrolls through the
 * viewport. Wrap words to emphasise in *asterisks*.
 */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.4"] });
  const words = text.split(" ");

  if (reduce) {
    return (
      <p className={className}>
        {words.map((w, i) => {
          const accent = w.startsWith("*");
          return (
            <span key={i} className={cn(accent && "t-serif t-gradient")}>
              {w.replaceAll("*", "")}{" "}
            </span>
          );
        })}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} word={w.replaceAll("*", "")} accent={w.startsWith("*")} i={i} total={words.length} progress={scrollYProgress} />
      ))}
    </p>
  );
}
