import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/blocks/PageIntro";
import { Em } from "@/components/blocks/SectionHead";
import { WorkGrid } from "@/components/blocks/WorkGrid";
import { SeoResults } from "@/components/blocks/SeoResults";
import { AppsShowcase } from "@/components/blocks/AppsShowcase";
import { CTA } from "@/components/blocks/CTA";

export const metadata = pageMetadata({
  title: "Portfolio: Apps, SEO Results & Websites | EasyWebSolns",
  description: "Mobile apps with live demos, SEO results verified in Google Analytics and Search Console, and website design concepts.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageIntro
        lines={["Selected", <Em key="w">work.</Em>]}
        lead="Apps you can try for yourself and SEO results verified in our clients' own analytics, alongside design concepts that show how we think about structure, clarity and conversion."
      />
      <AppsShowcase />
      <SeoResults />
      <section aria-labelledby="all-work-heading" className="pt-8 pb-24 sm:pb-32">
        <div className="wrap">
          <h2 id="all-work-heading" className="t-display mb-8 text-[clamp(2.4rem,5vw,4rem)]">
            All <Em>work.</Em>
          </h2>
          <WorkGrid />
        </div>
      </section>
      <CTA lines={["Your project", <Em key="n">could be next.</Em>]} lead="Tell us about your business and what you want your website to achieve." />
    </>
  );
}
