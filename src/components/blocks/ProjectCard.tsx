import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { photos } from "@/data/images";
import { Arrow } from "@/components/site/Button";
import { cn } from "@/lib/cn";

/** Portfolio card: full-bleed colour photograph with a floating glass caption. */
export function ProjectCard({ project, className, sizes = "(min-width: 1024px) 40vw, 90vw", priority }: { project: Project; className?: string; sizes?: string; priority?: boolean }) {
  const photo = photos[project.cover];
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn("group relative block overflow-hidden rounded-[2.25rem] bg-night shadow-[0_30px_60px_-30px_rgb(30_20_70/0.45)]", className)}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        quality={75}
        className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-premium)] group-hover:scale-[1.06]"
        style={{ objectPosition: project.coverPosition ?? "50% 50%" }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      <span className="glass glass-live glass-dark glass-thin absolute top-4 left-4 px-3 py-1.5 text-xs font-medium [--radius:999px]">
        {project.status === "concept" ? "Design concept" : project.industry}
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
