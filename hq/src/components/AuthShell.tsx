import type { ReactNode } from "react";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: ReactNode; children: ReactNode }) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-night p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <p className="font-display text-sm font-semibold tracking-[0.2em] uppercase">
          HQ <span className="text-violet-300">/ agency workspace</span>
        </p>
        <div>
          <p className="max-w-md font-display text-4xl leading-tight font-semibold tracking-tight">
            Clients, projects, tickets and billing — each agency in its own private space.
          </p>
          <div className="mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-violet-800 via-violet-500 to-violet-300" />
        </div>
        <p className="text-xs text-white/50">by EasyWebSolns</p>
        <div className="pointer-events-none absolute -top-40 -right-40 size-[32rem] rounded-full bg-violet-600/25 blur-3xl" aria-hidden="true" />
      </div>
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-grey">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
