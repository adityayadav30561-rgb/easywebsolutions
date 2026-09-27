import { pageMetadata } from "@/lib/seo";
import { projects } from "@/data/projects";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { CTASection } from "@/components/sections/CTASection";
import type { CSSProperties } from "react";

export const metadata = pageMetadata({
  title: "Website Design Portfolio | EasyWebSolns",
  description:
    "Selected website design concepts by EasyWebSolns — digital experiences designed around clarity, usability and business goals.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <section className="bg-white pt-36 pb-24 sm:pt-44 sm:pb-36">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="display text-[5.4rem] text-ink min-[400px]:text-[6.5rem] sm:text-[12rem] lg:col-span-8 xl:text-[16rem]">
              <span className="ln enter-line" style={{ "--d": "150ms" } as CSSProperties}>
                <span>
                  Work<span className="text-violet">.</span>
                </span>
              </span>
            </h1>
            <div className="enter pb-4 lg:col-span-4" style={{ "--d": "500ms" } as CSSProperties}>
              <p className="label text-grey">Portfolio · {String(projects.length).padStart(2, "0")} projects</p>
              <p className="mt-4 text-xl leading-snug text-ink">
                A selection of digital experiences we&apos;ve designed and built.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-grey">
                Projects marked <span className="font-semibold text-ink">Concept</span> are design concepts that show
                our approach. Client case studies are published with permission.
              </p>
            </div>
          </div>
          <div className="enter mt-16" style={{ "--d": "650ms" } as CSSProperties}>
            <WorkGrid projects={projects} />
          </div>
        </div>
      </section>
      <CTASection
        lines={["Your project", <span key="n" className="text-violet-300">could be next.</span>]}
        description="Tell us about your business and what you want your website to achieve."
        primary={{ label: "Start a Project", href: "/contact" }}
        secondary={{ label: "See Website Packages", href: "/websites" }}
        photo="processLaunchCity"
      />
    </>
  );
}
