"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { featuredWork } from "@/data/work";
import { WorkCard } from "@/components/blocks/WorkCard";
import { ButtonLink } from "@/components/site/Button";
import { Em } from "@/components/blocks/SectionHead";

/**
 * Selected work on a horizontal rail. The section pins and vertical scroll
 * slides the rail sideways — the distance is measured, so it always ends
 * exactly on the last card.
 */
export function WorkReel() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (reduce) {
    return (
      <section aria-labelledby="work-heading" className="py-24">
        <div className="wrap">
          <h2 id="work-heading" className="t-display text-[clamp(2.6rem,6.4vw,5.6rem)]">
            Selected <Em>work.</Em>
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {featuredWork.map((w) => (
              <WorkCard key={w.slug} item={w} className="aspect-[4/5] md:aspect-[5/4]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} aria-labelledby="work-heading" style={{ height: `calc(100svh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-stretch gap-5 px-5 will-change-transform sm:gap-7 sm:px-[max(2rem,calc((100vw-82rem)/2+2rem))]">
          <div className="flex w-[82vw] shrink-0 flex-col justify-center pr-6 sm:w-[30rem]">
            <h2 id="work-heading" className="t-display text-[clamp(3rem,7vw,6rem)]">
              Selected <Em>work.</Em>
            </h2>
            <p className="t-lead mt-6 max-w-sm">Apps you can try today, and SEO results verified in our clients&apos; own Google Analytics.</p>
            <ButtonLink href="/work" variant="glass" className="mt-8 self-start">
              All work
            </ButtonLink>
          </div>
          {featuredWork.map((w, i) => (
            <WorkCard key={w.slug} item={w} priority={i < 2} sizes="(min-width: 640px) 44rem, 86vw" className="h-[64svh] max-h-[40rem] w-[86vw] shrink-0 sm:w-[44rem]" />
          ))}
        </motion.div>
        <div className="wrap mt-10">
          <div className="glass glass-thin h-1.5 overflow-hidden [--radius:999px]" aria-hidden="true">
            <motion.div style={{ width: bar }} className="h-full rounded-full bg-gradient-to-r from-violet-600 via-iris to-sky" />
          </div>
        </div>
      </div>
    </section>
  );
}
