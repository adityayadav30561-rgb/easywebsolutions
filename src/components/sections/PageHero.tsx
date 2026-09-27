import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  lines: ReactNode[];
  description?: ReactNode;
  children?: ReactNode;
  /** Visual below the headline (full-bleed band) */
  media?: ReactNode;
  /** Visual to the right of the headline on desktop */
  aside?: ReactNode;
  className?: string;
  size?: "xl" | "lg" | "md";
};

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Inner-page hero: paper ground, oversized display lines, load choreography. */
export function PageHero({ label, lines, description, children, media, aside, className, size = "xl" }: Props) {
  return (
    <section className={cn("relative overflow-hidden bg-paper", className)}>
      <div className={cn("container-site pt-36 pb-16 sm:pt-44 lg:pt-48", Boolean(aside) && "grid gap-14 lg:grid-cols-12 lg:items-end")}>
        <div className={aside ? "lg:col-span-7" : undefined}>
          <div className="enter flex items-center gap-4" style={d(150)}>
            <span aria-hidden="true" className="h-px w-10 bg-ink" />
            <p className="label text-ink">{label}</p>
          </div>
          <h1
            className={cn(
              "display mt-10 text-ink",
              size === "xl" && "text-[3.1rem] sm:text-[6rem] xl:text-[8.75rem]",
              size === "lg" && "text-[2.8rem] sm:text-[5rem] xl:text-[6.75rem]",
              size === "md" && "text-[2.6rem] sm:text-[4.5rem] lg:text-[4.25rem] xl:text-[5.5rem]",
            )}
          >
            {lines.map((line, i) => (
              <span key={i} className="ln enter-line" style={{ "--i": i, "--d": "200ms" } as CSSProperties}>
                <span>{line}</span>
              </span>
            ))}
          </h1>
          {(description || children) && (
            <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,30rem)_auto] md:items-end md:justify-between">
              {description && (
                <p className="enter max-w-xl text-lg leading-relaxed text-ink-700" style={d(600)}>
                  {description}
                </p>
              )}
              {children && (
                <div className="enter" style={d(720)}>
                  {children}
                </div>
              )}
            </div>
          )}
        </div>
        {aside && (
          <div className="settle lg:col-span-5" style={d(500)}>
            {aside}
          </div>
        )}
      </div>
      {media && (
        <div className="settle" style={d(650)}>
          {media}
        </div>
      )}
    </section>
  );
}
