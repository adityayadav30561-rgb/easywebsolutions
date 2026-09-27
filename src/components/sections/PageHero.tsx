import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Optional right-hand content on desktop */
  aside?: ReactNode;
  className?: string;
};

/** Consistent hero for inner pages: soft brand glow, fine grid, large headline. */
export function PageHero({ eyebrow, title, description, children, aside, className }: Props) {
  return (
    <section className={cn("relative isolate overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-44", className)}>
      <div aria-hidden="true" className="noise absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_85%_0%,rgb(139_92_246/0.13),transparent_60%),linear-gradient(180deg,#fff,#faf9fe)]" />
        <div className="fine-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_80%_10%,#000_10%,transparent_70%)]" />
      </div>
      <div className={cn("container-site", Boolean(aside) && "grid gap-12 lg:grid-cols-12 lg:items-end")}>
        <div className={cn(aside ? "lg:col-span-7" : "max-w-4xl")}>
          <p className="hero-in eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-6 bg-violet-600/50" />
            {eyebrow}
          </p>
          <h1
            className="hero-in mt-6 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-[3.5rem] lg:text-[4.25rem]"
            style={{ ["--hero-delay" as string]: "80ms" }}
          >
            {title}
          </h1>
          {description && (
            <p
              className="hero-in mt-7 max-w-2xl text-[1.0625rem] leading-relaxed text-slate sm:text-lg"
              style={{ ["--hero-delay" as string]: "160ms" }}
            >
              {description}
            </p>
          )}
          {children && (
            <div className="hero-in mt-10" style={{ ["--hero-delay" as string]: "240ms" }}>
              {children}
            </div>
          )}
        </div>
        {aside && (
          <div className="hero-in lg:col-span-5" style={{ ["--hero-delay" as string]: "240ms" }}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
