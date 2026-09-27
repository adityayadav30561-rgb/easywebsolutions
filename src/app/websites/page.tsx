import type { CSSProperties } from "react";
import { pageMetadata } from "@/lib/seo";
import { packageComparison, websitePackages } from "@/data/pricing";
import { buildSteps, includedFeatures } from "@/data/services";
import { websiteFaqs } from "@/data/faqs";
import { getProject } from "@/data/projects";
import { PageHero } from "@/components/sections/PageHero";
import { PackageSheet } from "@/components/sections/PricingCard";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { DeviceShowcase } from "@/components/visuals/DeviceShowcase";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { DisplayLines, Label } from "@/components/ui/Type";

export const metadata = pageMetadata({
  title: "Website Design & Development | EasyWebSolns",
  description:
    "Custom website design and development from $499. Strategy, UX, design, development and performance — websites built to help businesses attract, engage and convert.",
  path: "/websites",
});

export default function WebsitesPage() {
  const showcase = getProject("professional-practice-website")!;
  return (
    <>
      <PageHero
        label="Website design & development"
        lines={["Websites", "built to", <span key="m">move <span className="text-violet-600">business.</span></span>]}
        description="We combine strategy, design, development and performance to create websites that help businesses attract, engage and convert visitors."
        media={<DeviceShowcase photo="websitesCurvedMuseum" project={showcase} caption="Concept — Professional practice website" />}
      >
        <ButtonLink href="/contact?need=new-website">Get a Website Quote</ButtonLink>
      </PageHero>

      {/* How we build — a numbered editorial sequence with imagery */}
      <section aria-labelledby="build-heading" className="bg-white py-24 sm:py-36">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Label index="01">How we build</Label>
              <DisplayLines id="build-heading" className="mt-8 text-[3rem] text-ink sm:text-[5rem] xl:text-[6.5rem]" lines={["Six disciplines.", "One website."]} />
            </div>
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-grey lg:col-span-5 lg:justify-self-end" data-reveal="">
              Good websites aren&apos;t decorated after the fact. Each stage shapes the next, from the first question about
              your customers to the last check before launch.
            </p>
          </div>

          <ol className="mt-20 grid gap-x-10 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
            {buildSteps.map((step, i) => (
              <li key={step.title} className={i % 3 === 1 ? "lg:mt-24" : i % 3 === 2 ? "lg:mt-12" : undefined} data-reveal="" style={{ "--d": `${(i % 3) * 90}ms` } as CSSProperties}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Photo name={step.photo} alt="" sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" treatment="mono" />
                  <span className="label absolute top-4 left-4 rounded-[4px] bg-white px-2 py-1 !text-[0.625rem] text-ink">
                    {String(i + 1).padStart(2, "0")} / 06
                  </span>
                </div>
                <h3 className="display mt-7 text-[2.4rem] text-ink">{step.title}</h3>
                <p className="mt-3 max-w-sm text-[1rem] leading-relaxed text-ink-700">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" aria-labelledby="packages-heading" className="bg-paper py-24 sm:py-36">
        <div className="container-site">
          <Label index="02">Packages</Label>
          <DisplayLines id="packages-heading" className="mt-8 text-[3rem] text-ink sm:text-[5rem] xl:text-[6.5rem]" lines={["Choose your", "starting point."]} />
          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-0 lg:[&>*+*]:-ml-px">
            {websitePackages.map((plan, i) => (
              <PackageSheet key={plan.id} plan={plan} index={i} />
            ))}
          </div>

          <div className="mt-28">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <h3 className="display text-[2.4rem] text-ink sm:text-[3rem]" data-reveal="">
                At a glance
              </h3>
              <p className="max-w-sm text-sm text-grey" data-reveal="">
                Only what each package lists. Not sure which fits? We&apos;ll recommend one — or quote for something custom.
              </p>
            </div>
            <div className="mt-8">
              <ComparisonTable
                caption="Website package comparison"
                columns={websitePackages.map((p) => ({ name: p.name, price: p.price }))}
                rows={packageComparison}
                highlight={1}
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's included — typographic index, not icon cards */}
      <section aria-labelledby="included-heading" data-theme="dark" className="grain relative bg-night py-24 text-white sm:py-36">
        <div className="container-site relative z-[2]">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Label index="03" tone="dark">
                What&apos;s included
              </Label>
              <DisplayLines id="included-heading" className="mt-8 text-[3rem] text-white sm:text-[5rem] xl:text-[6.5rem]" lines={["The details that", "make it work."]} />
            </div>
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-white/60 lg:col-span-5 lg:justify-self-end" data-reveal="">
              The building blocks we use across our packages. Each package lists exactly which are included.
            </p>
          </div>
          <ul className="mt-16 grid border-t border-white sm:grid-cols-2 lg:grid-cols-4">
            {includedFeatures.map((f, i) => (
              <li key={f.title} className="group border-b border-line-dark py-7 sm:pr-8" data-reveal="" style={{ "--d": `${(i % 4) * 60}ms` } as CSSProperties}>
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-xs text-violet-300 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-xl font-semibold tracking-[-0.02em] transition-colors group-hover:text-violet-300">{f.title}</span>
                </p>
                <p className="mt-2 pl-7 text-sm leading-relaxed text-white/55">{f.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQSection index="04" items={websiteFaqs} />

      <CTASection
        eyebrow="Get a website quote"
        lines={["Tell us", <span key="n" className="text-violet-300">what you need.</span>]}
        description="Share a few details about your business and goals. We'll recommend the right package and send a clear quote."
        primary={{ label: "Get a Quote", href: "/contact?need=new-website" }}
        secondary={{ label: "View Our Work", href: "/work" }}
        photo="serviceGalaxySoho"
      />
    </>
  );
}
