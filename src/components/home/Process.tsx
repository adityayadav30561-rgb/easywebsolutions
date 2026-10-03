"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { processSteps } from "@/data/services";
import { photos } from "@/data/images";
import { Em, SectionHead } from "@/components/blocks/SectionHead";
import { cn } from "@/lib/cn";

/** Five steps. The glass panel stays pinned and changes with the step you're reading. */
export function Process() {
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 0.55", "end 0.55"] });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(processSteps.length - 1, Math.max(0, Math.floor(v * processSteps.length)))));
  const step = processSteps[active];

  return (
    <section aria-labelledby="process-heading" className="py-24 sm:py-36">
      <div className="wrap">
        <SectionHead id="process-heading" lines={["From first call", <Em key="l">to launch day.</Em>]} lead="A clear process, so you always know what's happening and what we need from you next." />

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="hidden lg:col-span-6 lg:block">
            <div className="glass sticky top-[16svh] aspect-[4/5] p-2.5 [--radius:2.6rem]">
              <div className="relative h-full overflow-hidden rounded-[2.2rem]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={step.photo}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image src={photos[step.photo].src} alt="" fill sizes="45vw" placeholder="blur" quality={75} className="object-cover" />
                  </motion.div>
                </AnimatePresence>
                <div className="glass glass-live glass-thin absolute inset-x-4 bottom-4 flex items-center justify-between px-5 py-4 [--radius:1.4rem]">
                  <span className="t-head text-xl text-ink">{step.title}</span>
                  <span className="text-sm font-medium text-ink-2 tabular-nums">
                    {active + 1} / {processSteps.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div aria-hidden="true" className="absolute top-0 bottom-0 left-[1.15rem] w-[2px] rounded-full bg-ink/8">
              <motion.div style={{ height: fill }} className="w-full rounded-full bg-gradient-to-b from-violet-600 via-iris to-sky" />
            </div>
            <ol ref={list} className="space-y-6 lg:space-y-[22svh] lg:py-[12svh]">
              {processSteps.map((s, i) => (
                <li key={s.title} className="relative pl-14">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1 left-0 grid size-10 place-items-center rounded-full text-sm font-semibold transition-all duration-500",
                      i <= active ? "bg-ink text-white shadow-[0_8px_20px_-8px_rgb(90_69_137/0.8)]" : "glass glass-thin text-mute [--radius:999px]",
                    )}
                  >
                    {i + 1}
                  </span>
                  <h3 className={cn("t-title text-[clamp(2rem,4vw,3.2rem)] transition-colors duration-500", i === active ? "text-ink" : "text-ink/35 max-lg:text-ink")}>{s.title}</h3>
                  <p className={cn("mt-3 max-w-md text-[1.08rem] leading-relaxed transition-colors duration-500", i === active ? "text-ink-2" : "text-ink-2/50 max-lg:text-ink-2")}>{s.description}</p>
                  <p className="mt-4 text-sm text-mute">{s.detail}</p>
                  <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[1.6rem] lg:hidden">
                    <Image src={photos[s.photo].src} alt="" fill sizes="90vw" placeholder="blur" quality={70} className="object-cover" />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
