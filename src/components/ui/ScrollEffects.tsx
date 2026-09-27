"use client";

import { useEffect } from "react";

/**
 * One lightweight engine for all scroll behaviour:
 *  - [data-reveal]   → adds .is-in when the element enters the viewport (once)
 *  - [data-parallax] → translateY by (distance from viewport centre × factor)
 * New elements (route changes, filtering) are picked up automatically.
 */
export function ScrollEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = (el: Element) => el.classList.add("is-in");

    // Reveals
    // Masked elements are fully clipped until revealed, so observe their parent box instead.
    const targets = new Map<Element, Element>();
    let io: IntersectionObserver | null = null;
    if (!reduce && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              show(targets.get(e.target) ?? e.target);
              targets.delete(e.target);
              io?.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
      );
    }
    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => {
        if (!io) return show(el);
        const watch = el.dataset.reveal === "mask" && el.parentElement ? el.parentElement : el;
        if (!targets.has(watch)) {
          targets.set(watch, el);
          io.observe(watch);
        }
      });
    };

    // Parallax
    let items: HTMLElement[] = [];
    let frame = 0;
    const collect = () => {
      items = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    };
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of items) {
        const r = el.parentElement?.getBoundingClientRect() ?? el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const factor = Number(el.dataset.parallax) || 0.1;
        const offset = (r.top + r.height / 2 - vh / 2) * factor;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    scan();
    if (!reduce) {
      collect();
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }

    const mo = new MutationObserver(() => {
      scan();
      if (!reduce) {
        collect();
        onScroll();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io?.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
