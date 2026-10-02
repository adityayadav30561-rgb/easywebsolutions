import type { ReactNode } from "react";
import { RevealLines } from "@/components/motion/Reveal";

/** Shared layout for long-form legal pages. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <RevealLines as="h1" onMount lines={[title]} className="t-display text-[clamp(2.8rem,6vw,4.6rem)]" />
          <p className="mt-6 text-sm text-mute">Last updated {updated}</p>
        </div>
        <div className="glass space-y-10 p-7 text-[1rem] leading-relaxed text-ink-2 sm:p-10 lg:col-span-8 [--radius:2.25rem] [&_a]:text-violet-600 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-0.025em] [&_h2]:text-ink [&_li]:mt-1.5 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </div>
  );
}
