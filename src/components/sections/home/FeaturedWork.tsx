import { featuredProjectSlugs, getProject, type Project } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { PortfolioCard } from "@/components/sections/PortfolioCard";

export function FeaturedWork() {
  const [first, second, third, fourth] = featuredProjectSlugs
    .map(getProject)
    .filter((p): p is Project => Boolean(p));

  return (
    <section className="py-24 sm:py-32" aria-labelledby="work-heading">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="work-heading"
            eyebrow="02 — Our Work"
            title="Work that speaks for itself."
            description="A selection of websites designed to make businesses look as good online as they are offline."
          />
          <ButtonLink href="/work" variant="secondary" arrow className="self-start lg:self-auto">
            View All Work
          </ButtonLink>
        </div>

        <div className="mt-16 space-y-20 sm:space-y-24">
          {first && <PortfolioCard project={first} layout="feature" />}
          <div className="grid gap-16 md:grid-cols-2 md:gap-8 lg:gap-10">
            {second && <PortfolioCard project={second} />}
            {third && <PortfolioCard project={third} className="md:mt-28" delay={120} />}
          </div>
          {fourth && <PortfolioCard project={fourth} layout="feature-split" />}
        </div>
      </div>
    </section>
  );
}
