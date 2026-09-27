import { pageMetadata } from "@/lib/seo";
import { projects } from "@/data/projects";
import { PageHero } from "@/components/sections/PageHero";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { CTASection } from "@/components/sections/CTASection";

export const metadata = pageMetadata({
  title: "Website Design Portfolio | EasyWebSolns",
  description:
    "Explore website design concepts and projects by EasyWebSolns — modern, responsive websites designed around usability and business goals.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Digital experiences built with purpose."
        description="Explore selected projects and see how we approach design, usability and business goals."
      />
      <section className="pt-4 pb-24 sm:pb-32" aria-label="Projects">
        <div className="container-site">
          <WorkGrid projects={projects} />
          <p className="mt-20 max-w-2xl border-t border-line pt-8 text-sm leading-relaxed text-slate">
            Projects marked <span className="font-semibold text-ink">Concept</span> are design concepts that show our
            approach to structure, design and usability. Client case studies are published with permission.
          </p>
        </div>
      </section>
      <CTASection
        title="Have a project in mind?"
        description="Tell us about your business and what you want your website to achieve."
        primary={{ label: "Start a Project", href: "/contact" }}
        secondary={{ label: "See Website Packages", href: "/websites" }}
      />
    </>
  );
}
