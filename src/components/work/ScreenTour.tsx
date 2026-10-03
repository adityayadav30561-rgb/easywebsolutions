"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import type { AppProject, AppScreen } from "@/data/app-projects";
import { screenCount } from "@/data/app-projects";
import { Em } from "@/components/blocks/SectionHead";
import { cn } from "@/lib/cn";
import { useScrollFx } from "@/components/motion/useScrollFx";

const spring = { type: "spring", stiffness: 420, damping: 36, mass: 0.7 } as const;

/** A real screen in a glass bezel, cut to the iPhone's corner radius. Opens full size. */
function Phone({ screen, name, dark, loadDark }: { screen: AppScreen; name: string; dark: boolean; loadDark: boolean }) {
  const full = dark && screen.dark ? screen.dark : screen.image;
  return (
    <figure className="w-[min(58vw,15rem)] shrink-0 snap-start sm:w-[clamp(13rem,19vw,17rem)]">
      <a href={full.src} target="_blank" rel="noopener noreferrer" className={cn("glass block p-[3.5%] transition-transform duration-500 ease-[var(--ease-premium)] hover:-translate-y-1.5 [--radius:16%/7.4%]", dark && "glass-dark")}>
        <span className="relative block overflow-hidden rounded-[13%/6%] bg-white">
          <Image src={screen.image} alt={`${name}: ${screen.title}. ${screen.caption}`} placeholder="blur" quality={90} sizes="(min-width: 640px) 17rem, 58vw" className="block h-auto w-full" />
          {screen.dark && loadDark && (
            <Image
              src={screen.dark}
              alt=""
              aria-hidden={!dark}
              quality={90}
              sizes="(min-width: 640px) 17rem, 58vw"
              className={cn("absolute inset-0 h-full w-full transition-opacity duration-700 ease-[var(--ease-premium)]", dark ? "opacity-100" : "opacity-0")}
            />
          )}
        </span>
      </a>
      <figcaption className="mt-4 px-1">
        <span className={cn("block font-semibold transition-colors duration-700", dark ? "text-white" : "text-ink")}>{screen.title}</span>
        <span className={cn("mt-0.5 block text-sm transition-colors duration-700", dark ? "text-white/60" : "text-mute")}>{screen.caption}</span>
      </figcaption>
    </figure>
  );
}

function ThemeSwitch({ dark, onChange }: { dark: boolean; onChange: (d: boolean) => void }) {
  return (
    <div role="group" aria-label="App theme" className={cn("glass glass-thin inline-flex gap-1 p-1.5 [--radius:999px]", dark && "glass-dark")}>
      {[
        { key: false, label: "Light" },
        { key: true, label: "Dark" },
      ].map((o) => (
        <button
          key={o.label}
          type="button"
          aria-pressed={dark === o.key}
          onClick={() => onChange(o.key)}
          className={cn("relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300", dark === o.key ? (dark ? "text-ink" : "text-white") : dark ? "text-white/70 hover:text-white" : "text-ink-2 hover:text-ink")}
        >
          {dark === o.key && <motion.span layoutId="theme-seg" transition={spring} className={cn("absolute inset-0 rounded-full", dark ? "bg-white" : "bg-ink")} />}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Every screen of the app on one horizontal rail, grouped by flow. With a
 * mouse/trackpad the section pins and vertical scroll slides the rail (the
 * distance is measured so it ends on the last screen); on touch screens it's a
 * native swipe carousel with snap points, which never stutters. Apps with a dark theme get a Light/Dark switch
 * that cross-fades every screen (dark images load only once it's first used).
 */
export function ScreenTour({ project }: { project: AppProject }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [dark, setDark] = useState(false);
  const [loadDark, setLoadDark] = useState(false);
  const fx = useScrollFx();

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
  }, [fx]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const setTheme = (d: boolean) => {
    if (d) setLoadDark(true);
    setDark(d);
  };

  const intro = (
    <div className={cn("flex shrink-0 flex-col justify-center", fx ? "w-[26rem] pr-4" : "max-w-xl")}>
      <h2 id="screens-heading" className={cn("t-display text-[clamp(2.8rem,6vw,5rem)] transition-colors duration-700", dark && "!text-white")}>
        Inside the <Em>app.</Em>
      </h2>
      <p className={cn("t-lead mt-5 max-w-sm transition-colors duration-700", dark && "!text-white/70")}>
        All {screenCount(project)} screens, in the order a user meets them. Select any screen to see it full size.
      </p>
      {project.hasDarkMode && (
        <div className="mt-7">
          <ThemeSwitch dark={dark} onChange={setTheme} />
        </div>
      )}
    </div>
  );

  const rail = (
    <>
      {fx && intro}
      {project.flows.map((f, fi) => (
        <Fragment key={f.title}>
          <div className="flex w-[40vw] shrink-0 snap-start flex-col justify-center sm:w-[13rem]">
            <span className={cn("text-sm font-medium tabular-nums transition-colors duration-700", dark ? "text-white/50" : "text-mute")}>
              {String(fi + 1).padStart(2, "0")} / {String(project.flows.length).padStart(2, "0")}
            </span>
            <h3 className={cn("t-title mt-2 text-[clamp(1.6rem,2.6vw,2.2rem)] transition-colors duration-700", dark ? "!text-white" : "text-ink")}>{f.title}</h3>
          </div>
          {f.screens.map((s) => (
            <Phone key={s.image.src} screen={s} name={project.name} dark={dark} loadDark={loadDark} />
          ))}
        </Fragment>
      ))}
    </>
  );

  const bg = (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 rounded-[2.75rem] transition-colors duration-700 ease-[var(--ease-premium)]", dark ? "bg-night" : "bg-white/0")} />
  );

  if (!fx) {
    return (
      <section aria-labelledby="screens-heading" className="relative mx-3 py-16 sm:mx-5 sm:py-20">
        {bg}
        <div className="relative px-5 sm:px-10">{intro}</div>
        <div className="no-scrollbar relative mt-10 flex snap-x snap-mandatory items-center gap-5 overflow-x-auto overscroll-x-contain px-5 pb-4 [scroll-padding-inline:1.25rem] sm:gap-8 sm:px-10 sm:[scroll-padding-inline:2.5rem]">
          {rail}
        </div>
        <p className={cn("relative mt-4 px-5 text-sm transition-colors duration-700 sm:px-10", dark ? "text-white/50" : "text-mute")}>Swipe to see every screen.</p>
      </section>
    );
  }

  return (
    <section ref={section} aria-labelledby="screens-heading" style={{ height: `calc(100svh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden px-3 sm:px-5">
        <div className="relative flex h-full flex-col justify-center">
          {bg}
          <motion.div ref={track} style={{ x }} className="relative flex w-max items-center gap-5 px-5 will-change-transform sm:gap-8 sm:px-[max(2rem,calc((100vw-82rem)/2+2rem))]">
            {rail}
          </motion.div>
          <div className="wrap relative mt-8 w-full">
            <div className={cn("glass glass-thin h-1.5 overflow-hidden [--radius:999px]", dark && "glass-dark")} aria-hidden="true">
              <motion.div style={{ width: bar }} className="h-full rounded-full bg-gradient-to-r from-violet-600 via-iris to-sky" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
