import type { ReactNode } from "react";

/** Shared layout for long-form legal pages. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-5 text-[2.5rem] leading-[1.08] font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-slate">Last updated: {updated}</p>
          <div className="mt-12 space-y-10 border-t border-line pt-12 text-[0.9875rem] leading-relaxed text-ink-700 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_li]:mt-1.5 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
