import type { ReactNode } from "react";
import { Aurora } from "@/components/site/Aurora";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/site/Button";

/** Closing call to action: a wide glass slab floating over a vivid aurora. */
export function CTA({
  lines,
  lead,
  primary = { label: "Start a project", href: "/contact" },
  secondary,
}: {
  lines: ReactNode[];
  lead?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section aria-label="Get in touch" className="relative py-16 sm:py-24">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-[2.75rem] px-3 py-3">
          <Aurora className="scale-125" />
          <div className="glass relative px-6 py-20 text-center sm:px-12 sm:py-28 [--radius:2.4rem]">
            <RevealLines lines={lines} className="t-display mx-auto max-w-[14ch] text-[clamp(2.8rem,7.5vw,6.5rem)]" />
            {lead && (
              <Reveal delay={0.2}>
                <p className="t-lead mx-auto mt-7 max-w-xl !text-ink-2">{lead}</p>
              </Reveal>
            )}
            <Reveal delay={0.3} className="mt-10 flex flex-wrap justify-center gap-3">
              <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
              {secondary && (
                <ButtonLink href={secondary.href} variant="glass">
                  {secondary.label}
                </ButtonLink>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
