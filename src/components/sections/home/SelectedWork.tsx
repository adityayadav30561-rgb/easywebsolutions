import { featuredProjectSlugs, getProject, type Project } from "@/data/projects";
import { ProjectShowcase, type ShowcaseLayout } from "@/components/sections/ProjectShowcase";
import { DisplayLines, Label } from "@/components/ui/Type";
import { ButtonLink } from "@/components/ui/Button";

const layouts: ShowcaseLayout[] = ["wide", "portrait-right", "full", "offset"];

export function SelectedWork() {
  const featured = featuredProjectSlugs.map(getProject).filter((p): p is Project => Boolean(p));
  return (
    <section aria-labelledby="work-heading" data-theme="dark" className="grain relative bg-night py-24 text-white sm:py-36">
      <div className="container-site relative z-[2]">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <Label index="03" tone="dark">
              Portfolio
            </Label>
            <DisplayLines
              id="work-heading"
              className="mt-8 text-[3.4rem] text-white sm:text-[6rem] xl:text-[8.5rem]"
              lines={[
                <>
                  Selected{" "}
                  <sup className="align-top font-sans text-[0.18em] font-semibold tracking-[0.2em] text-violet-300">
                    ({String(featured.length).padStart(2, "0")})
                  </sup>
                </>,
                "Work",
              ]}
            />
          </div>
          <p className="max-w-sm text-[1.0625rem] leading-relaxed text-white/60" data-reveal="">
            Design concepts that show how we think about structure, clarity and conversion. Client case studies are
            added with permission.
          </p>
        </div>

        <div className="mt-20 space-y-28 sm:mt-28 sm:space-y-40">
          {featured.map((project, i) => (
            <ProjectShowcase key={project.slug} project={project} index={i} layout={layouts[i % layouts.length]} />
          ))}
        </div>

        <div className="mt-28 flex justify-center border-t border-line-dark pt-12" data-reveal="">
          <ButtonLink href="/work" variant="outline-light">
            View All Work
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
