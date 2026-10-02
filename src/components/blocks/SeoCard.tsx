import Image from "next/image";
import Link from "next/link";
import type { SeoProject } from "@/data/seo-projects";
import { Arrow } from "@/components/site/Button";
import { cn } from "@/lib/cn";

/**
 * SEO result card: the client's real homepage, tinted, with the headline
 * result set large over it and the same floating glass caption as other work.
 */
export function SeoCard({ project, className, sizes = "(min-width: 1024px) 40vw, 90vw", priority }: { project: SeoProject; className?: string; sizes?: string; priority?: boolean }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn("group relative block overflow-hidden rounded-[2.25rem] bg-night shadow-[0_30px_60px_-30px_rgb(30_20_70/0.45)]", className)}
    >
      <Image
        src={project.shots.desktop}
        alt={`${project.name} website homepage`}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        quality={72}
        className="object-cover object-top transition-transform duration-[1.4s] ease-[var(--ease-premium)] group-hover:scale-[1.05]"
      />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${project.accent}cc 0%, rgb(10 10 16 / 0.82) 55%, rgb(10 10 16 / 0.92) 100%)` }} />
      <div aria-hidden="true" className="absolute -top-1/3 -right-1/4 size-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(108_124_255/0.35),transparent)]" />

      <span className="glass glass-dark glass-thin absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 text-xs font-medium [--radius:999px]">
        <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52_211_153)]" />
        SEO · Verified results
      </span>

      <div className="absolute inset-x-6 top-[22%] text-white sm:inset-x-8">
        <p className="t-display text-[clamp(3.4rem,8vw,6.2rem)] !text-white">{project.headline.value}</p>
        <p className="mt-2 text-[1.15rem] font-medium text-white/90">{project.headline.label}</p>
        <p className="mt-1 text-sm text-white/55">{project.headline.period}</p>
      </div>

      <div className="glass glass-thin absolute inset-x-3 bottom-3 flex items-end justify-between gap-4 p-5 transition-transform duration-700 ease-[var(--ease-premium)] group-hover:-translate-y-1 [--radius:1.6rem] sm:p-6">
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
