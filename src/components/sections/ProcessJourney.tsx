"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { processSteps } from "@/data/services";
import { Photo } from "@/components/ui/Photo";
import { DisplayLines, Label } from "@/components/ui/Type";
import { cn } from "@/lib/cn";

/**
 * Horizontal journey. On large screens the section pins while the user
 * scrolls; the line fills and each stage's image and copy take over.
 * On small screens (or with reduced motion) it becomes a vertical story.
 */
export function ProcessJourney() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const apply = () => {
      setPinned(mq.matches);
      measure();
    };
    apply();
    mq.addEventListener("change", apply);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const n = processSteps.length;
  const active = Math.min(n - 1, Math.floor(progress * n));

  const heading = (
    <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
      <div>
        <Label index="04">Process</Label>
        <DisplayLines
          id="process-heading"
          className="mt-8 text-[3rem] text-ink sm:text-[5rem] xl:text-[6.5rem]"
          lines={["From idea", "to launch."]}
        />
      </div>
      <p className="max-w-sm text-[1.0625rem] leading-relaxed text-grey" data-reveal="">
        Five clear stages, without the chaos. You always know where the project is and what happens next.
      </p>
    </div>
  );

  return (
    <section
      ref={ref}
      aria-labelledby="process-heading"
      className="relative bg-white"
      style={pinned ? { height: `${n * 70 + 60}vh` } : undefined}
    >
      {pinned ? (
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div className="container-site pt-20 [&_h2]:xl:!text-[5rem]">
            {heading}

            {/* The line */}
            <div className="relative mt-10">
              <div className="h-px bg-line-strong" />
              <div className="signal absolute top-0 left-0 h-[2px] -translate-y-px" style={{ width: `${progress * 100}%` }} />
              <ol className="absolute inset-x-0 -top-[7px] flex justify-between">
                {processSteps.map((s, i) => (
                  <li
                    key={s.number}
                    className={cn("flex flex-col", i === 0 ? "items-start" : i === n - 1 ? "items-end" : "items-center")}
                    style={{ width: 0 }}
                  >
                    <span
                      className={cn(
                        "block size-[14px] shrink-0 rounded-full border-2 transition-colors duration-500",
                        i <= active ? "border-violet bg-violet" : "border-line-strong bg-white",
                      )}
                    />
                    <span className={cn("label mt-4 whitespace-nowrap transition-colors duration-500", i === active ? "text-ink" : "text-grey")}>
                      {s.title}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* The stage */}
            <div className="relative mt-16 grid grid-cols-12 gap-10">
              <div className="relative col-span-5 min-h-[16rem]">
                {processSteps.map((s, i) => (
                  <div
                    key={s.number}
                    aria-hidden={i !== active}
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-[var(--ease-premium)]",
                      i === active ? "translate-y-0 opacity-100" : i < active ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0",
                    )}
                  >
                    <p className="font-display text-[5rem] leading-none font-semibold tracking-[-0.05em] text-violet-600">{s.number}</p>
                    <h3 className="display mt-4 text-[3.5rem] text-ink">{s.title}</h3>
                    <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-700">{s.description}</p>
                    <p className="label mt-6 text-grey">{s.detail}</p>
                  </div>
                ))}
              </div>
              <div className="relative col-span-6 col-start-7 aspect-[16/9] max-h-[46svh] w-full overflow-hidden justify-self-end">
                {processSteps.map((s, i) => (
                  <div
                    key={s.number}
                    className={cn(
                      "absolute inset-0 transition-[opacity,transform] duration-1000 ease-[var(--ease-premium)]",
                      i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
                    )}
                  >
                    <Photo name={s.photo} alt="" sizes="50vw" />
                  </div>
                ))}
                <p className="label absolute bottom-4 left-4 z-10 rounded-[4px] bg-night/60 px-2 py-1 text-white">
                  Stage {processSteps[active]?.number} / {String(n).padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container-site py-24 sm:py-32">
          {heading}
          <ol className="mt-16 border-l border-line-strong">
            {processSteps.map((s, i) => (
              <li key={s.number} className="relative pb-16 pl-8 last:pb-0 sm:pl-12" data-reveal="" style={{ "--d": `${i * 60}ms` } as CSSProperties}>
                <span aria-hidden="true" className="absolute top-2 -left-[7px] size-[13px] rounded-full border-2 border-violet bg-white" />
                <p className="label text-violet-600">Stage {s.number}</p>
                <h3 className="display mt-3 text-[2.6rem] text-ink sm:text-[3.4rem]">{s.title}</h3>
                <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-ink-700">{s.description}</p>
                <p className="label mt-4 text-grey">{s.detail}</p>
                <div className="relative mt-8 aspect-[16/10] overflow-hidden">
                  <Photo name={s.photo} alt="" sizes="(min-width: 640px) 80vw, 100vw" reveal />
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
