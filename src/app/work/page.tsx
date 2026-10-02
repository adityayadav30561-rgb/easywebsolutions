import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/blocks/PageIntro";
import { Em } from "@/components/blocks/SectionHead";
import { WorkGrid } from "@/components/blocks/WorkGrid";
import { CTA } from "@/components/blocks/CTA";

export const metadata = pageMetadata({
  title: "Website Design Portfolio | EasyWebSolns",
  description: "Website design concepts for business, technology, professional services, retail, hospitality and community organisations.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageIntro
        lines={["Selected", <Em key="w">work.</Em>]}
        lead="Design concepts that show how we think about structure, clarity and conversion. Client case studies are added with permission."
      />
      <section aria-label="Projects" className="pb-24 sm:pb-32">
        <div className="wrap">
          <WorkGrid />
        </div>
      </section>
      <CTA lines={["Your project", <Em key="n">could be next.</Em>]} lead="Tell us about your business and what you want your website to achieve." />
    </>
  );
}
