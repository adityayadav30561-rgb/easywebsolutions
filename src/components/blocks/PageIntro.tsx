import type { ReactNode } from "react";
import { Reveal, RevealLines } from "@/components/motion/Reveal";

/** Top of an inner page: a large headline, a lead and actions. No eyebrow. */
export function PageIntro({ lines, lead, children, aside }: { lines: ReactNode[]; lead: ReactNode; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section aria-labelledby="page-heading" className="relative pt-36 pb-16 sm:pt-44 sm:pb-24">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-10"}>
          <RevealLines id="page-heading" as="h1" onMount lines={lines} className="t-display text-[clamp(3rem,8.4vw,7.4rem)]" />
          <Reveal delay={0.35}>
            <p className="t-lead mt-8 max-w-2xl">{lead}</p>
          </Reveal>
          {children && (
            <Reveal delay={0.45} className="mt-10 flex flex-wrap gap-3">
              {children}
            </Reveal>
          )}
        </div>
        {aside && (
          <Reveal delay={0.3} className="lg:col-span-5">
            {aside}
          </Reveal>
        )}
      </div>
    </section>
  );
}
