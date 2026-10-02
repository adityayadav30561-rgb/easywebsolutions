import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/blocks/PageIntro";
import { Em } from "@/components/blocks/SectionHead";
import { WorkGrid } from "@/components/blocks/WorkGrid";
import { SeoResults } from "@/components/blocks/SeoResults";
import { CTA } from "@/components/blocks/CTA";

export const metadata = pageMetadata({
  title: "Website Design Portfolio | EasyWebSolns",
  description: "SEO results verified in Google Analytics and Search Console for e-commerce, healthcare, logistics and local businesses, plus website design concepts.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageIntro
        lines={["Selected", <Em key="w">work.</Em>]}
        lead="Real results for real clients, verified in their own analytics, alongside design concepts that show how we think about structure, clarity and conversion."
      />
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
