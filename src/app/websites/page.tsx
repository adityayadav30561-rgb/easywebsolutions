import Image from "next/image";
import { pageMetadata } from "@/lib/seo";
import { buildSteps, includedFeatures } from "@/data/services";
import { packageComparison, websitePackages } from "@/data/pricing";
import { websiteFaqs } from "@/data/faqs";
import { photos } from "@/data/images";
import { getProject } from "@/data/projects";
import { PageIntro } from "@/components/blocks/PageIntro";
import { Em, SectionHead } from "@/components/blocks/SectionHead";
import { PackageCard } from "@/components/blocks/PackageCard";
import { CompareTable } from "@/components/blocks/CompareTable";
import { FAQSection } from "@/components/blocks/FAQSection";
import { CTA } from "@/components/blocks/CTA";
import { GlassPhoto } from "@/components/blocks/GlassPhoto";
import { Check } from "@/components/blocks/Check";
import { Glass } from "@/components/glass/Glass";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { ButtonLink } from "@/components/site/Button";
import { MockupWindow } from "@/components/visuals/ProjectMockup";

export const metadata = pageMetadata({
  title: "Website Design & Development | EasyWebSolns",
  description:
    "Custom website design and development for businesses. Starter $499, Professional $799, Premium $1,199+. Fast, responsive websites built to turn visitors into enquiries.",
  path: "/websites",
});

export default function WebsitesPage() {
  const showcase = getProject("professional-practice-website")!;
  return (
    <>
      <PageIntro
        lines={["Websites built", <Em key="m">to move business.</Em>]}
        lead="We combine strategy, design, development and performance to create websites that help businesses attract, engage and convert visitors."
      >
        <ButtonLink href="/contact?need=new-website">Get a website quote</ButtonLink>
        <ButtonLink href="#packages" variant="glass">
          See packages
        </ButtonLink>
      </PageIntro>

      {/* Showcase: photo in a glass bezel with a concept site floating over it */}
      <section aria-label="Example concept website" className="pb-24 sm:pb-36">
        <div className="wrap relative">
          <Reveal>
            <div className="relative aspect-[4/5] sm:aspect-[16/9]">
              <GlassPhoto name="websitesDesk" sizes="(min-width: 1280px) 78rem, 100vw" className="absolute inset-0" priority />
              <div className="absolute inset-x-[6%] bottom-[-8%] sm:inset-x-auto sm:right-[5%] sm:bottom-[-10%] sm:w-[58%]">
                <Parallax amount={50}>
                  <div className="glass p-[1.2%] [--radius:1.6rem]">
                    <MockupWindow project={showcase} className="overflow-hidden rounded-[1.2rem]" />
                  </div>
                  <p className="mt-3 text-right text-sm text-mute">Design concept: professional practice website</p>
                </Parallax>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="build-heading" className="py-24 sm:py-32">
        <div className="wrap">
          <SectionHead
            id="build-heading"
            lines={["Six disciplines.", <Em key="o">One website.</Em>]}
            lead="Good websites aren't decorated after the fact. Each stage shapes the next, from the first question about your customers to the last check before launch."
          />
          <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {buildSteps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={(i % 3) * 0.08}>
                <Glass interactive className="flex h-full flex-col p-2.5 [--radius:2.25rem]">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.8rem]">
                    <Image src={photos[step.photo].src} alt="" fill sizes="(min-width: 1024px) 26rem, (min-width: 640px) 45vw, 90vw" placeholder="blur" quality={70} className="object-cover" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="t-title text-[1.9rem] text-ink">{step.title}</h3>
                    <p className="mt-3 text-ink-2">{step.description}</p>
                  </div>
                </Glass>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="packages" aria-labelledby="packages-heading" className="py-24 sm:py-32">
        <div className="wrap">
          <SectionHead id="packages-heading" lines={["Choose your", <Em key="s">starting point.</Em>]} lead="Prices are one-time. Scope is confirmed in writing before any work begins." />
          <ul className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
            {websitePackages.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.1} className="h-full">
                <PackageCard plan={p} />
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-16" >
            <div id="compare" className="scroll-mt-28">
              <h3 className="t-title mb-6 text-[2rem] text-ink">Compare at a glance</h3>
              <CompareTable
                caption="Website package comparison"
                columns={websitePackages.map((p) => ({ name: p.name, price: p.price }))}
                rows={packageComparison.map((r) => ({ label: r.label, values: r.values }))}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="included-heading" className="py-24 sm:py-32">
        <div className="wrap">
          <SectionHead id="included-heading" lines={["The details that", <Em key="m">make it work.</Em>]} lead="The building blocks we use across our packages. Each package lists exactly which are included." />
          <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {includedFeatures.map((f, i) => (
              <Reveal as="li" key={f.title} delay={(i % 4) * 0.06}>
                <Glass interactive className="h-full p-6 [--radius:1.75rem]">
                  <span className="grid size-10 place-items-center rounded-full bg-white/70 text-violet-600 shadow-[inset_0_1px_0_#fff]">
                    <Check />
                  </span>
                  <h3 className="mt-5 text-[1.12rem] font-semibold tracking-[-0.02em] text-ink">{f.title}</h3>
                  <p className="mt-2 text-[0.95rem] text-ink-2">{f.description}</p>
                </Glass>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <FAQSection faqs={websiteFaqs} />

      <CTA
        lines={["Tell us", <Em key="n">what you need.</Em>]}
        lead="Share a few details about your business and goals. We'll recommend the right package and send a clear quote."
        primary={{ label: "Get a website quote", href: "/contact?need=new-website" }}
      />
    </>
  );
}
