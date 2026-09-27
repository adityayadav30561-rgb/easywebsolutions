import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { Icon } from "@/components/ui/Icon";
import { ProjectMockup } from "@/components/visuals/ProjectMockup";
import { cn } from "@/lib/cn";

type Props = {
  project: Project;
  layout?: "feature" | "feature-split" | "standard";
  headingLevel?: "h2" | "h3";
  showServices?: boolean;
  className?: string;
  delay?: number;
};

export function ProjectImage({
  project,
  sizes,
  priority,
  wide,
}: {
  project: Project;
  sizes: string;
  priority?: boolean;
  wide?: boolean;
}) {
  return (
    <div className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-premium)] group-hover:scale-[1.035]">
      {project.image ? (
        <Image src={project.image} alt={`${project.name} website`} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <ProjectMockup project={project} wide={wide} />
      )}
    </div>
  );
}

export function PortfolioCard({
  project,
  layout = "standard",
  headingLevel: H = "h3",
  showServices,
  className,
  delay = 0,
}: Props) {
  const href = `/work/${project.slug}`;
  const split = layout === "feature-split";
  const feature = layout !== "standard";

  return (
    <article
      className={cn("group relative", split && "grid gap-8 lg:grid-cols-12 lg:items-end", className)}
      data-reveal=""
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[22px] border border-line bg-mist shadow-[var(--shadow-card)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-card-hover)]",
          layout === "feature" && "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/8]",
          split && "aspect-[4/3] sm:aspect-[16/10] lg:order-2 lg:col-span-8",
          layout === "standard" && "aspect-[4/3.4]",
        )}
      >
        <ProjectImage
          project={project}
          wide={layout === "feature"}
          sizes={feature ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
        />
        {project.status === "concept" && (
          <span className="absolute top-4 left-4 rounded-full border border-white/40 bg-white/80 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] text-ink uppercase backdrop-blur">
            Concept
          </span>
        )}
        <span
          aria-hidden="true"
          className="absolute right-4 bottom-4 flex size-12 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-lg transition-all duration-500 ease-[var(--ease-premium)] group-hover:translate-y-0 group-hover:opacity-100 sm:right-5 sm:bottom-5"
        >
          <Icon name="arrow-up-right" size={20} />
        </span>
      </div>

      <div
        className={cn(
          "transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-1",
          split ? "lg:order-1 lg:col-span-4 lg:pb-4" : "mt-6",
          layout === "feature" && "grid gap-3 md:grid-cols-12 md:items-start",
        )}
      >
        <div className={cn(layout === "feature" && "md:col-span-5")}>
          <p className="text-xs font-semibold tracking-[0.16em] text-violet-600 uppercase">{project.industry}</p>
          <H className={cn("mt-2 font-semibold text-ink", feature ? "text-2xl sm:text-[1.75rem]" : "text-xl sm:text-2xl")}>
            <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {project.name}
            </Link>
          </H>
        </div>
        <div className={cn(layout === "feature" && "md:col-span-6 md:col-start-7")}>
          <p className={cn("text-[0.9375rem] leading-relaxed text-slate", layout !== "feature" && "mt-2.5", split && "max-w-sm")}>
            {project.description}
          </p>
          {showServices && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Services provided">
              {project.services.map((s) => (
                <li key={s} className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink-700">
                  {s}
                </li>
              ))}
            </ul>
          )}
          {split && (
            <span className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-ink">
              View project
              <Icon name="arrow-right" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          )}
        </div>
      </div>
      {/* Keyboard focus ring for the stretched link */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 rounded-[26px] ring-violet-600 group-has-[a:focus-visible]:ring-2"
      />
    </article>
  );
}
