"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Butter-smooth inertial scrolling (Lenis). Native scroll position is kept,
 * so scroll-linked animations, anchors and accessibility keep working.
 * Disabled entirely for people who prefer reduced motion.
 */
export function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      anchors: { offset: -96 },
      autoRaf: true,
    });
    lenis.current = l;
    return () => {
      l.destroy();
      lenis.current = null;
    };
  }, []);

  // New page: start at the top instantly.
  useEffect(() => {
    if (window.location.hash) return;
    lenis.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
