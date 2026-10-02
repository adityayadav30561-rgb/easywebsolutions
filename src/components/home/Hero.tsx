"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform, useMotionTemplate } from "motion/react";
import { useRef } from "react";
import { getProject } from "@/data/projects";
import { MockupWindow } from "@/components/visuals/ProjectMockup";
import { ButtonLink } from "@/components/site/Button";
import { Aurora } from "@/components/site/Aurora";
import { Em } from "@/components/blocks/SectionHead";

const ease = [0.22, 1, 0.36, 1] as const;

const chips = [
  { text: "Designed for phones first", pos: "left-[-4%] top-[18%]", depth: 70 },
  { text: "SEO-ready foundations", pos: "right-[-5%] top-[8%]", depth: 110 },
  { text: "Care plans from $49/mo", pos: "right-[-2%] bottom-[16%]", depth: 50 },
  { text: "Built to load fast", pos: "left-[4%] bottom-[-4%]", depth: 90 },
];

function Chip({ text, pos, depth, progress, delay }: { text: string; pos: string; depth: number; progress: ReturnType<typeof useScroll>["scrollYProgress"]; delay: number }) {
  const y = useTransform(progress, [0, 1], [0, -depth * 2.2]);
  return (
    <motion.div style={{ y }} className={`absolute ${pos} z-20 hidden sm:block`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease, delay }}
        className="glass glass-thin float-y flex items-center gap-2.5 px-4 py-2.5 text-[0.9rem] font-medium whitespace-nowrap text-ink [--radius:999px]"
        style={{ animationDelay: `${delay * 2}s` }}
      >
        <span className="size-2 rounded-full bg-gradient-to-br from-violet to-iris shadow-[0_0_10px_rgb(108_124_255/0.7)]" />
        {text}
      </motion.div>
    </motion.div>
  );
}

/**
 * Opening scene. The headline drifts back and dissolves while a glass-framed
 * website rises, flattens out of its tilt and comes forward — all scrubbed
 * by scroll on a sticky stage.
 */
export function Hero() {
  const stage = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.35 });

  const textOpacity = useTransform(p, [0, 0.38], [1, 0]);
  const textY = useTransform(p, [0, 0.4], [0, -90]);
  const textScale = useTransform(p, [0, 0.4], [1, 0.94]);
  const textBlur = useTransform(p, [0, 0.38], [0, 12]);
  const textFilter = useMotionTemplate`blur(${textBlur}px)`;

  const deviceY = useTransform(p, [0, 0.6], [0, -260]);
  const deviceRotate = useTransform(p, [0, 0.55], [22, 0]);
  const deviceScale = useTransform(p, [0, 0.6], [0.86, 1.04]);

  const project = getProject("brand-business-website")!;

  return (
    <section ref={stage} aria-labelledby="hero-heading" className="relative h-[175svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <Aurora className="scale-110" />

        <motion.div
          style={reduce ? undefined : { opacity: textOpacity, y: textY, scale: textScale, filter: textFilter }}
          className="wrap relative z-10 flex flex-col items-center pt-[max(7.5rem,15svh)] text-center will-change-transform"
        >
          <h1 id="hero-heading" className="t-display text-[clamp(3.2rem,min(10.5vw,15svh),9rem)]">
            {["Websites that", "work for you."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "110%", filter: "blur(12px)", opacity: 0 }}
                  animate={{ y: "0%", filter: "blur(0px)", opacity: 1 }}
                  transition={{ duration: 1.3, ease, delay: 0.15 + i * 0.12 }}
                >
                  {i === 1 ? (
                    <>
                      work <Em>for you.</Em>
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease, delay: 0.55 }}
            className="t-lead mt-7 max-w-[34rem] !text-ink-2"
          >
            We design, build and care for fast, modern websites that make your business easier to trust, understand and choose.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.7 }}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            <ButtonLink href="/contact">Start a project</ButtonLink>
            <ButtonLink href="/work" variant="glass">
              See our work
            </ButtonLink>
          </motion.div>
        </motion.div>

        {/* The device: a website inside a thick glass slab, peeking up from below the fold */}
        <div className="relative z-0 mt-12 [perspective:1600px] sm:mt-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease, delay: 0.45 }}
          >
            <motion.div
              style={reduce ? undefined : { y: deviceY, rotateX: deviceRotate, scale: deviceScale }}
              className="relative mx-auto w-[94vw] max-w-[68rem] origin-top will-change-transform"
            >
              <div className="glass p-[1.1%] [--radius:clamp(1.25rem,2.6vw,2.4rem)]">
                <MockupWindow project={project} className="overflow-hidden rounded-[clamp(0.9rem,2vw,1.9rem)]" />
              </div>
              {chips.map((c, i) => (
                <Chip key={c.text} {...c} progress={p} delay={1 + i * 0.12} />
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-canvas to-transparent" />
      </div>
    </section>
  );
}
