"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { getProject } from "@/data/projects";
import { seoProjects } from "@/data/seo-projects";
import { appProjects } from "@/data/app-projects";
import { MockupWindow } from "@/components/visuals/ProjectMockup";
import { ButtonLink, Arrow } from "@/components/site/Button";
import { Aurora } from "@/components/site/Aurora";
import { Em } from "@/components/blocks/SectionHead";
import { CountUp } from "@/components/motion/CountUp";
import { cn } from "@/lib/cn";

import eiHome from "@/assets/work/apps/event-intelligence-india/light/01-home.webp";
import maHome from "@/assets/work/apps/maharishi-ayurveda/07-home.webp";
import tcHome from "@/assets/work/apps/toys-cartel/04-home.webp";

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { type: "spring", stiffness: 420, damping: 36, mass: 0.7 } as const;
const SCENE_MS = 6500;

const badowl = seoProjects.find((p) => p.slug === "badowl")!;
const khadi = seoProjects.find((p) => p.slug === "khadi-organique")!;
const concept = getProject("brand-business-website")!;

/* ── Pieces ─────────────────────────────────────────────── */

function Phone({ src, alt, className, priority }: { src: StaticImageData; alt: string; className?: string; priority?: boolean }) {
  return (
    <div className={cn("glass absolute p-[2.2%] [--radius:15%/7%]", className)}>
      <div className="overflow-hidden rounded-[13%/6%] bg-white">
        <Image src={src} alt={alt} placeholder="blur" quality={90} priority={priority} sizes="(min-width: 1024px) 15rem, 32vw" className="block h-auto w-full" />
      </div>
    </div>
  );
}

function Chip({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease, delay: 0.25 + delay }}
      className={cn("absolute z-30", className)}
    >
      <div className="glass glass-live glass-thin float-y flex items-center gap-2 px-3.5 py-2 text-[0.82rem] font-medium whitespace-nowrap text-ink [--radius:999px] sm:text-[0.88rem]" style={{ animationDelay: `${delay * 3}s` }}>
        <span className="size-1.5 rounded-full bg-gradient-to-br from-violet to-iris shadow-[0_0_10px_rgb(108_124_255/0.7)]" />
        {children}
      </div>
    </motion.div>
  );
}

/** Entrance for each layer of a scene: rises into place, slightly staggered. */
function Layer({ children, i = 0, className, pos = "inset-0" }: { children: ReactNode; i?: number; className?: string; /** Position classes (default: fill the stage) */ pos?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.98, transition: { duration: 0.35, ease } }}
      transition={{ duration: 0.9, ease, delay: i * 0.08 }}
      className={cn("absolute", pos, className)}
    >
      {children}
    </motion.div>
  );
}

/* ── Scenes ─────────────────────────────────────────────── */

function AppsScene({ priority }: { priority?: boolean }) {
  const [ei, ma, tc] = ["event-intelligence-india", "maharishi-ayurveda", "toys-cartel"].map((s) => appProjects.find((p) => p.slug === s)!);
  return (
    <>
      <Layer i={1}>
        <Phone src={maHome} alt={`${ma.name} app home screen`} priority={priority} className="top-[15%] left-[5%] w-[27%] -rotate-[7deg]" />
      </Layer>
      <Layer i={2}>
        <Phone src={tcHome} alt={`${tc.name} app home screen`} priority={priority} className="top-[15%] right-[5%] w-[27%] rotate-[7deg]" />
      </Layer>
      <Layer i={0} className="z-10">
        <Phone src={eiHome} alt={`${ei.name} app home screen`} priority={priority} className="top-[3%] left-1/2 w-[31%] -translate-x-1/2 shadow-[0_40px_80px_-30px_rgb(30_20_70/0.55)]" />
      </Layer>
      <Chip className="bottom-[9%] left-[2%]">iOS, Android &amp; web</Chip>
      <Chip className="top-[7%] right-[1%]" delay={0.15}>
        Live demos
      </Chip>
    </>
  );
}

function WebScene() {
  return (
    <>
      <Layer className="flex items-center">
        <div className="glass w-full p-[1.1%] [--radius:clamp(1rem,2vw,1.8rem)]">
          <MockupWindow project={concept} className="overflow-hidden rounded-[clamp(0.75rem,1.6vw,1.4rem)]" />
        </div>
      </Layer>
      <Chip className="bottom-[10%] left-[3%] sm:top-[9%] sm:bottom-auto">Designed for phones first</Chip>
      <Chip className="top-[4%] right-[4%]" delay={0.12}>
        SEO-ready foundations
      </Chip>
      <Chip className="right-[6%] bottom-[8%] max-sm:hidden" delay={0.24}>
        Built to load fast
      </Chip>
    </>
  );
}

function SeoScene() {
  const ga = badowl.analytics!;
  return (
    <>
      <Layer pos="top-[2%] right-[14%] left-0">
        <div className="glass p-[1%] [--radius:clamp(0.9rem,1.8vw,1.6rem)]">
          <div className="overflow-hidden rounded-[clamp(0.7rem,1.4vw,1.3rem)] bg-white">
            <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#fbfbfd] px-3 py-2">
              <span className="size-2 rounded-full bg-[#ff5f57]/80" />
              <span className="size-2 rounded-full bg-[#febc2e]/80" />
              <span className="size-2 rounded-full bg-[#28c840]/80" />
              <span className="mx-auto truncate rounded bg-black/[0.04] px-4 py-0.5 text-[0.68rem] font-medium text-mute">{badowl.domain}</span>
            </div>
            <Image src={badowl.shots.desktop} alt={`${badowl.name} website`} placeholder="blur" quality={80} sizes="(min-width: 1024px) 34rem, 80vw" className="block h-auto w-full" />
          </div>
        </div>
      </Layer>
      <Layer i={1} pos="right-0 bottom-[4%]" className="z-10 w-[56%] sm:w-[50%]">
        <div className="glass glass-solid p-4 shadow-[0_40px_80px_-30px_rgb(30_20_70/0.5)] [--radius:1.6rem] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.8rem] font-medium text-ink-2 sm:text-sm">Active users</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[0.7rem] font-semibold text-emerald-700 ring-1 ring-emerald-600/15">
              <svg viewBox="0 0 12 12" aria-hidden="true" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10V2M2.5 5.5L6 2l3.5 3.5" />
              </svg>
              Verified
            </span>
          </div>
          <p className="t-title mt-1 text-[clamp(1.9rem,3.6vw,2.9rem)] text-ink">
            <CountUp value={badowl.headline.value} duration={1.6} />
          </p>
          {/* Decorative rising curve (not plotted data) */}
          <svg viewBox="0 0 200 54" aria-hidden="true" className="mt-2 h-auto w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hero-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="rgb(108 124 255)" stopOpacity="0.35" />
                <stop offset="1" stopColor="rgb(108 124 255)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 50 C30 50 45 49 70 46 S110 40 130 30 S170 10 200 4 L200 54 L0 54 Z"
              fill="url(#hero-area)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease, delay: 0.5 }}
            />
            <motion.path
              d="M0 50 C30 50 45 49 70 46 S110 40 130 30 S170 10 200 4"
              fill="none"
              stroke="rgb(108 124 255)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease, delay: 0.3 }}
            />
          </svg>
          <p className="mt-2 text-[0.72rem] text-mute sm:text-xs">
            {badowl.name} · {ga.metrics[0].value} users · Google Analytics
          </p>
        </div>
      </Layer>
      <Chip className="top-[24%] right-[17%] sm:top-[40%] sm:right-[1%]" delay={0.2}>
        Avg. position {badowl.search.position} on Google
      </Chip>
    </>
  );
}

const scenes = [
  { key: "web", label: "Websites", caption: "Custom websites, designed and built to turn visitors into enquiries.", link: { label: "Website packages", href: "/websites" }, Scene: WebScene },
  { key: "apps", label: "Apps", caption: "Mobile apps for iOS, Android and the web. Try the live demos.", link: { label: "Explore our apps", href: "/work#apps" }, Scene: AppsScene },
  { key: "seo", label: "SEO", caption: `${badowl.name}: ${badowl.headline.value} more active users after our SEO work, verified in Google Analytics.`, link: { label: "See SEO results", href: "/work#seo" }, Scene: SeoScene },
] as const;

/* ── Hero ───────────────────────────────────────────────── */

/**
 * Opening scene: the promise on the left, and on the right a live showcase of
 * what we actually make — websites, real apps and verified SEO results —
 * cycling on its own (iOS-style segmented control) and tilting with the pointer.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(1);
  const [hover, setHover] = useState(false);
  const inView = useInView(section, { amount: 0.3 });
  const playing = !reduce && !hover && inView;

  // Scroll: copy drifts up and fades, the showcase follows more slowly (parallax).
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Pointer: gentle 3D tilt of the showcase.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 140, damping: 20 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 140, damping: 20 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
    setHover(false);
  };

  const scene = scenes[active];
  const lines = ["Websites & apps", "that work", <Em key="y">for you.</Em>];

  return (
    <section ref={section} aria-labelledby="hero-heading" className="relative overflow-hidden">
      <Aurora className="scale-110" />

      <div className="wrap relative z-10 grid min-h-svh items-center gap-12 pt-28 pb-16 sm:pt-32 lg:grid-cols-12 lg:gap-8 lg:pb-20">
        {/* Copy */}
        <motion.div style={reduce ? undefined : { y: textY, opacity: textOpacity }} className="lg:col-span-5">
          <h1 id="hero-heading" className="t-display text-[clamp(3rem,min(7.4vw,11svh),6rem)]">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 1.2, ease, delay: 0.1 + i * 0.1 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.45 }}
            className="t-lead mt-6 max-w-[30rem] !text-ink-2"
          >
            We design and build fast, modern websites and mobile apps, then help the right people find them on Google.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.6 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <ButtonLink href="/contact">Start a project</ButtonLink>
            <ButtonLink href="/work" variant="glass">
              See our work
            </ButtonLink>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.75 }}
            className="mt-10 grid max-w-[32rem] grid-cols-3 gap-4 border-t border-hairline pt-6"
          >
            {[
              { value: badowl.headline.value, label: `more users for ${badowl.name}` },
              { value: khadi.search.impressions, label: `Google impressions for ${khadi.name}` },
              { value: String(appProjects.length), label: "apps live on iOS, Android & web" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end gap-1">
                <dt className="text-[0.8rem] leading-snug text-mute">{s.label}</dt>
                <dd className="t-title text-[clamp(1.4rem,2.4vw,1.9rem)] text-ink">
                  <CountUp value={s.value} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Showcase */}
        <motion.div
          style={reduce ? undefined : { y: stageY }}
          initial={reduce ? false : { opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease, delay: 0.3 }}
          className="lg:col-span-7"
        >
          <div className="[perspective:1600px]" onPointerMove={onMove} onPointerEnter={() => setHover(true)} onPointerLeave={onLeave}>
            <motion.div ref={stage} style={reduce ? undefined : { rotateX, rotateY }} className="relative aspect-[1/0.92] w-full [transform-style:preserve-3d] sm:aspect-[5/4]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={scene.key} className="absolute inset-0" exit={{ opacity: 0, transition: { duration: 0.4 } }}>
                  <scene.Scene priority={active === 1} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Segmented control with an auto-advance progress fill */}
          <div className="mt-6 flex flex-col items-center gap-4 sm:mt-8">
            <div role="tablist" aria-label="What we make" className="glass glass-thin inline-flex gap-1 p-1.5 [--radius:999px]">
              {scenes.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => setActive(i)}
                  className={cn("relative overflow-hidden rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300", active === i ? "text-white" : "text-ink-2 hover:text-ink")}
                >
                  {active === i && (
                    <motion.span layoutId="hero-seg" transition={spring} className="absolute inset-0 overflow-hidden rounded-full bg-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]">
                      {playing && (
                        <motion.span
                          key={`${s.key}-${active}`}
                          className="absolute inset-y-0 left-0 bg-white/14"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: SCENE_MS / 1000, ease: "linear" }}
                          onAnimationComplete={() => setActive((a) => (a + 1) % scenes.length)}
                        />
                      )}
                    </motion.span>
                  )}
                  <span className="relative">{s.label}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={scene.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease }}
                className="max-w-md text-center text-[0.95rem] text-ink-2"
                aria-live="polite"
              >
                {scene.caption}{" "}
                <Link href={scene.link.href} className="group inline-flex items-center gap-1 font-medium whitespace-nowrap text-ink">
                  {scene.link.label} <Arrow className="size-3.5" />
                </Link>
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-canvas to-transparent" />
    </section>
  );
}
