import type { ReactNode } from "react";

/** Shared layout for long-form legal pages. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="bg-paper pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label text-grey">Legal</p>
          <h1 className="display mt-6 text-[3rem] text-ink sm:text-[4.5rem]">{title}</h1>
          <p className="label mt-6 text-grey">Last updated — {updated}</p>
        </div>
        <div className="space-y-10 border-t border-ink pt-10 text-[1rem] leading-relaxed text-ink-700 lg:col-span-7 lg:col-start-6 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-ink [&_li]:mt-1.5 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </div>
  );
}
