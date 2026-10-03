import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWork, work } from "@/data/work";
import { pageMetadata } from "@/lib/seo";
import { Em } from "@/components/blocks/SectionHead";
import { WorkCard } from "@/components/blocks/WorkCard";
import { CTA } from "@/components/blocks/CTA";
import { SeoCaseStudy } from "@/components/work/SeoCaseStudy";
import { ConceptCaseStudy } from "@/components/work/ConceptCaseStudy";
import { AppCaseStudy } from "@/components/work/AppCaseStudy";

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getWork(slug);
  if (!item) return {};
  if (item.kind === "seo") {
    const p = item.project;
    return pageMetadata({
      title: `${p.name} SEO Case Study: ${p.headline.value} ${p.headline.label} | EasyWebSolns`,
      description: `${p.kicker} SEO results for ${p.name} (${p.industry}, ${p.location}), verified in Google Analytics and Search Console.`,
      path: `/work/${p.slug}`,
    });
  }
  if (item.kind === "app") {
    const p = item.project;
    return pageMetadata({
      title: `${p.name} App: Design & Development Case Study | EasyWebSolns`,
      description: `${p.kicker} Every screen of the ${p.name} app, plus a live demo.`,
      path: `/work/${p.slug}`,
    });
  }
  const p = item.project;
  return pageMetadata({
    title: `${p.name} — Case Study | EasyWebSolns`,
    description: `${p.description} The challenge, approach and design direction.`,
    path: `/work/${p.slug}`,
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const item = getWork(slug);
  if (!item) notFound();

  const index = work.findIndex((w) => w.slug === item.slug);
  const next = work[(index + 1) % work.length];

  return (
    <>
      {item.kind === "seo" ? <SeoCaseStudy project={item.project} /> : item.kind === "app" ? <AppCaseStudy project={item.project} /> : <ConceptCaseStudy project={item.project} />}

      <section aria-labelledby="next-heading" className="pb-16">
        <div className="wrap">
          <h2 id="next-heading" className="t-display mb-8 text-[clamp(2.4rem,5vw,4rem)]">
            Next <Em>project.</Em>
          </h2>
          <WorkCard item={next} className="aspect-[4/5] sm:aspect-[21/9]" sizes="(min-width: 1280px) 78rem, 100vw" />
        </div>
      </section>

      {item.kind === "seo" ? (
        <CTA lines={["Want results", <Em key="l">like these?</Em>]} lead="Tell us about your business and where you'd like to be found. We'll look at your search visibility and tell you honestly what's possible." primary={{ label: "Talk to us about SEO", href: "/contact?need=seo" }} />
      ) : item.kind === "app" ? (
        <CTA lines={["Have an app", <Em key="l">in mind?</Em>]} lead="Tell us what it should do and who it's for. We'll help you shape it into something people enjoy using." primary={{ label: "Talk to us about your app", href: "/contact?need=app" }} />
      ) : (
        <CTA lines={["Want something", <Em key="l">like this?</Em>]} lead="Tell us about your business and what you want your website to achieve." />
      )}
    </>
  );
}
