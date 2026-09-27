"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { BrowserFrame, Line } from "./BrowserFrame";

/** Layer that shifts slightly with the pointer (desktop only) and floats gently. */
function Layer({
  depth,
  float = "animate-float",
  delay = "0s",
  className,
  style,
  children,
}: {
  depth: number;
  float?: string;
  delay?: string;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute transition-transform duration-[900ms] ease-[var(--ease-premium)] will-change-transform ${className ?? ""}`}
      style={{
        transform: `translate3d(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px), 0)`,
        ...style,
      }}
    >
      <div className={float} style={{ animationDelay: delay }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Hero composition: layered browser windows showing fragments of different
 * website designs, a phone view and a small design-spec card — the output of
 * an agency, not a SaaS dashboard.
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        el.style.setProperty("--px", x.toFixed(3));
        el.style.setProperty("--py", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const violet = "#7c3aed";
  const ink = "#101522";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="@container relative mx-auto aspect-[1/0.92] w-full max-w-[640px] select-none"
    >
      {/* Brand motif: the open ring + arrow of the "e" mark, drawn as fine lines */}
      <svg viewBox="0 0 600 560" className="absolute inset-0 h-full w-full" fill="none">
        <defs>
          <linearGradient id="hv-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" stopOpacity="0.55" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d="M520 280a220 220 0 1 1-60-151" stroke="url(#hv-ring)" strokeWidth="1.2" />
        <path d="m462 110 0 22-22 -2" stroke="url(#hv-ring)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M300 60a220 220 0 0 1 0 440" stroke="rgb(16 21 34 / 0.06)" strokeDasharray="2 6" />
      </svg>
      <div className="absolute top-[18%] left-[22%] h-[60%] w-[60%] rounded-full bg-violet/25 blur-[70px]" />

      {/* Window A — corporate site */}
      <Layer depth={-8} float="animate-float-slow" className="top-[4%] left-[8%] w-[80%]">
        <BrowserFrame url="yourbusiness.com">
          <div className="p-[2.6cqw]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[0.8cqw]">
                <span className="size-[1.8cqw] rounded-[0.5cqw] bg-gradient-to-br from-violet-300 to-violet-600" />
                <Line w="7cqw" c={ink} h={0.9} />
              </div>
              <div className="flex items-center gap-[1.6cqw]">
                <Line w="4cqw" c="#cbd5e1" h={0.6} />
                <Line w="4cqw" c="#cbd5e1" h={0.6} />
                <Line w="4cqw" c="#cbd5e1" h={0.6} />
                <span className="rounded-[0.6cqw] bg-ink px-[1.4cqw] py-[0.7cqw]">
                  <Line w="4cqw" c="rgb(255 255 255 / 0.85)" h={0.55} />
                </span>
              </div>
            </div>
            <div className="mt-[3.6cqw] grid grid-cols-[1.05fr_1fr] items-center gap-[3cqw]">
              <div>
                <p className="w-fit rounded-full bg-violet-50 px-[1.2cqw] py-[0.4cqw] text-[1.05cqw] font-semibold tracking-[0.12em] text-violet-600 uppercase">
                  Consulting
                </p>
                <p className="mt-[1.4cqw] font-display text-[3.7cqw] leading-[1.08] font-semibold tracking-[-0.03em] text-ink">
                  Build trust at first glance.
                </p>
                <div className="mt-[1.6cqw] space-y-[0.8cqw]">
                  <Line w="92%" c="#e2e8f0" />
                  <Line w="70%" c="#e2e8f0" />
                </div>
                <div className="mt-[2.2cqw] flex gap-[1cqw]">
                  <span className="rounded-[0.7cqw] bg-ink px-[1.8cqw] py-[1cqw]">
                    <Line w="6cqw" c="rgb(255 255 255 / 0.9)" h={0.6} />
                  </span>
                  <span className="rounded-[0.7cqw] border border-slate-200 px-[1.8cqw] py-[1cqw]">
                    <Line w="5cqw" c="#94a3b8" h={0.6} />
                  </span>
                </div>
              </div>
              <div className="relative aspect-[1/0.9] overflow-hidden rounded-[1.4cqw] bg-[linear-gradient(150deg,#1b1740_0%,#4c2a9e_55%,#a78bfa_100%)]">
                <div className="absolute -right-[10%] -bottom-[25%] size-[80%] rounded-full border-[1.4cqw] border-white/15" />
                <div className="absolute top-[14%] left-[12%] size-[28%] rounded-full bg-white/15 backdrop-blur" />
                <div className="absolute right-[10%] bottom-[12%] left-[12%] rounded-[1cqw] bg-white/90 p-[1.2cqw]">
                  <Line w="60%" c={ink} h={0.65} />
                  <Line w="85%" c="#cbd5e1" h={0.5} className="mt-[0.7cqw]" />
                </div>
              </div>
            </div>
            <div className="mt-[3cqw] grid grid-cols-3 gap-[1.4cqw]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-[1cqw] border border-slate-100 bg-[#fafafc] p-[1.4cqw]">
                  <span className="block size-[2.2cqw] rounded-[0.6cqw] bg-violet-100" />
                  <Line w="70%" c={ink} h={0.65} className="mt-[1.2cqw]" />
                  <Line w="90%" c="#e2e8f0" h={0.5} className="mt-[0.7cqw]" />
                  <Line w="60%" c="#e2e8f0" h={0.5} className="mt-[0.5cqw]" />
                </div>
              ))}
            </div>
          </div>
        </BrowserFrame>
      </Layer>

      {/* Window B — dark service-business site */}
      <Layer depth={14} delay="-3s" className="bottom-[3%] left-0 w-[54%]">
        <BrowserFrame url="studio.site" dark>
          <div className="p-[2.2cqw]">
            <p className="text-[1cqw] font-semibold tracking-[0.14em] text-violet-300 uppercase">Our services</p>
            <p className="mt-[1cqw] font-display text-[2.5cqw] leading-[1.12] font-semibold tracking-[-0.02em] text-white">
              Crafted for the way you work.
            </p>
            <div className="mt-[2cqw] grid grid-cols-2 gap-[1.1cqw]">
              {["#a78bfa", "#64748b", "#64748b", "#a78bfa"].map((c, i) => (
                <div key={i} className="rounded-[0.9cqw] border border-white/[0.07] bg-white/[0.03] p-[1.2cqw]">
                  <span className="block size-[1.7cqw] rounded-full" style={{ background: c, opacity: 0.8 }} />
                  <Line w="75%" c="rgb(255 255 255 / 0.75)" h={0.55} className="mt-[1cqw]" />
                  <Line w="90%" c="rgb(255 255 255 / 0.14)" h={0.45} className="mt-[0.6cqw]" />
                </div>
              ))}
            </div>
          </div>
        </BrowserFrame>
      </Layer>

      {/* Phone — mobile layout */}
      <Layer depth={22} delay="-6s" className="right-[3%] bottom-0 w-[25%]">
        <div className="rounded-[3.4cqw] border border-[rgb(15_23_42/0.1)] bg-white p-[0.9cqw] shadow-[var(--shadow-float)]">
          <div className="overflow-hidden rounded-[2.6cqw] bg-[#fafafc]">
            <div className="mx-auto mt-[1cqw] h-[1.2cqw] w-[8cqw] rounded-full bg-ink" />
            <div className="p-[1.8cqw]">
              <div className="aspect-[1/0.8] rounded-[1.4cqw] bg-[linear-gradient(160deg,#ede7fe,#c4b5fd)] p-[1.4cqw]">
                <p className="font-display text-[1.9cqw] leading-[1.1] font-semibold text-ink">Book a free consultation</p>
              </div>
              <div className="mt-[1.6cqw] space-y-[0.7cqw]">
                <Line w="90%" c="#e2e8f0" h={0.6} />
                <Line w="65%" c="#e2e8f0" h={0.6} />
              </div>
              <div className="mt-[1.8cqw] flex items-center justify-center gap-[0.6cqw] rounded-[1cqw] bg-ink py-[1.2cqw] text-[1.25cqw] font-medium text-white">
                Call now
              </div>
              <div className="mt-[0.8cqw] flex items-center justify-center rounded-[1cqw] border border-slate-200 py-[1.1cqw] text-[1.25cqw] font-medium text-ink">
                WhatsApp
              </div>
            </div>
          </div>
        </div>
      </Layer>

      {/* Design spec card */}
      <Layer depth={-16} delay="-2s" className="top-[0%] right-0 hidden w-[27%] sm:block">
        <div className="rounded-[1.6cqw] border border-[rgb(15_23_42/0.08)] bg-white/85 p-[1.8cqw] shadow-[var(--shadow-float)] backdrop-blur-md">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-[4.2cqw] leading-none font-semibold text-ink">Aa</span>
            <span className="text-[1.05cqw] font-medium tracking-[0.1em] text-slate-400 uppercase">Type</span>
          </div>
          <p className="mt-[0.8cqw] text-[1.15cqw] text-slate">Sora · Inter</p>
          <div className="mt-[1.4cqw] flex gap-[0.7cqw]">
            {[ink, violet, "#a78bfa", "#f5f1ff"].map((c) => (
              <span key={c} className="size-[2.6cqw] rounded-full border border-black/5" style={{ background: c }} />
            ))}
          </div>
        </div>
      </Layer>
    </div>
  );
}
