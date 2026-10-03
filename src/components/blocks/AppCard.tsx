import Image from "next/image";
import Link from "next/link";
import type { AppProject } from "@/data/app-projects";
import { Arrow } from "@/components/site/Button";
import { cn } from "@/lib/cn";

/** App card: the app's own screen collage with the same floating glass caption as other work. */
export function AppCard({ project, className, sizes = "(min-width: 1024px) 40vw, 90vw", priority }: { project: AppProject; className?: string; sizes?: string; priority?: boolean }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn("group relative block overflow-hidden rounded-[2.25rem] shadow-[0_30px_60px_-30px_rgb(30_20_70/0.45)]", className)}
      style={{ backgroundColor: project.accent }}
    >
      <Image
        src={project.hero}
        alt={`${project.name} app screens`}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        quality={90}
        className="object-cover object-[50%_30%] transition-transform duration-[1.4s] ease-[var(--ease-premium)] group-hover:scale-[1.05]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <span className="glass glass-live glass-dark glass-thin absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 text-xs font-medium [--radius:999px]">
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="1.5" width="8" height="13" rx="2" />
          <path d="M7 12.2h2" strokeLinecap="round" />
        </svg>
        App · Live demo
      </span>

      <div className="glass glass-live glass-thin absolute inset-x-3 bottom-3 flex items-end justify-between gap-4 p-5 transition-transform duration-700 ease-[var(--ease-premium)] group-hover:-translate-y-1 [--radius:1.6rem] sm:p-6">
        <div className="min-w-0">
          <h3 className="t-head text-[1.35rem] text-ink sm:text-[1.6rem]">{project.name}</h3>
          <p className="mt-1 line-clamp-2 text-[0.92rem] text-ink-2">{project.kicker}</p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-110">
          <Arrow />
        </span>
      </div>
    </Link>
  );
}
