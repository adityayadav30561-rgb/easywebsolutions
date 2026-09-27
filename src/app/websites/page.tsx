import { pageMetadata } from "@/lib/seo";
import { packageComparison, websitePackages } from "@/data/pricing";
import { buildSteps, includedFeatures } from "@/data/services";
import { websiteFaqs } from "@/data/faqs";
import { getProject } from "@/data/projects";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PricingCard } from "@/components/sections/PricingCard";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { ProjectMockup } from "@/components/visuals/ProjectMockup";

export const metadata = pageMetadata({
  title: "Website Design & Development | EasyWebSolns",
  description:
    "Custom website design and development packages from $499. Responsive, fast and conversion-focused websites built around your business goals.",
  path: "/websites",
});

function HeroStack() {
  const a = getProject("professional-practice-website");
  const b = getProject("local-services-website");
  if (!a || !b) return null;
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-[1/0.85] w-full max-w-lg">
      <div className="absolute top-0 right-0 w-[82%] overflow-hidden rounded-[20px] border border-line shadow-[var(--shadow-float)] motion-safe:animate-float-slow">
        <div className="aspect-[4/3]">
          <ProjectMockup project={a} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-[66%] overflow-hidden rounded-[20px] border border-line shadow-[var(--shadow-float)] motion-safe:animate-float [animation-delay:-4s]">
        <div className="aspect-[4/3]">
          <ProjectMockup project={b} />
        </div>
      </div>
    </div>
  );
}

export default function WebsitesPage() {
  return (
    <>
      <PageHero
        eyebrow="Websites"
        title="Websites built to do more than look good."
        description="We combine strategy, design, development and performance to create websites that help businesses attract, engage and convert visitors."
        aside={<HeroStack />}
      >
        <div className="flex flex-col gap-3 min-[480px]:flex-row">
          <ButtonLink href="/contact?need=new-website" size="lg" arrow>
            Start Your Website
          </ButtonLink>
          <ButtonLink href="#packages" size="lg" variant="secondary">
            See Packages
          </ButtonLink>
        </div>
      </PageHero>

      {/* Packages */}
      <section id="packages" className="border-t border-line bg-mist py-24 sm:py-32" aria-labelledby="packages-heading">
        <div className="container-site">
          <SectionHeading
            id="packages-heading"
            eyebrow="01 — Packages"
            title="Choose the right starting point."
            description="Three clear packages with one-time pricing. We'll confirm the exact scope with you before any work begins."
            align="center"
          />
          <div className="mx-auto mt-16 grid max-w-md gap-6 lg:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-5">
            {websitePackages.map((plan, i) => (
              <PricingCard key={plan.id} plan={plan} index={i} headingLevel="h3" />
            ))}
          </div>

          <div className="mt-20">
            <h3 className="mb-6 text-xl font-semibold" data-reveal="">
              At a glance
            </h3>
            <ComparisonTable
              caption="Website package comparison"
              columns={websitePackages.map((p) => ({ name: p.name, price: p.price }))}
              rows={packageComparison}
              highlight={1}
            />
            <p className="mt-5 flex items-start gap-2 text-sm text-slate" data-reveal="">
              <Icon name="sparkle" size={16} className="mt-0.5 shrink-0 text-violet-600" />
              Not sure which package fits? Tell us about your business and we&apos;ll recommend the right one — or
              put together a custom quote.
            </p>
          </div>
        </div>
      </section>

      {/* How we build */}
      <section className="py-24 sm:py-32" aria-labelledby="build-heading">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                id="build-heading"
                eyebrow="02 — How we build websites"
                title="A considered process, from strategy to support."
                description="Every step has a purpose: understand the business, design the experience, build it properly and look after it once it's live."
              />
            </div>
          </div>
          <ol className="lg:col-span-7">
            {buildSteps.map((step, i) => (
              <li
                key={step.title}
                className="group grid grid-cols-[2rem_1fr] gap-6 border-t border-line py-8 last:border-b sm:gap-10"
                data-reveal=""
              >
                <span className="font-display text-sm font-semibold text-slate-400 transition-colors group-hover:text-violet-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-semibold sm:text-2xl">{step.title}</h3>
                    <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-slate">{step.description}</p>
                  </div>
                  <span className="hidden size-11 shrink-0 items-center justify-center rounded-xl border border-line text-slate transition-all duration-500 group-hover:border-violet/30 group-hover:bg-violet-50 group-hover:text-violet-600 sm:flex">
                    <Icon name={step.icon} size={20} />
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What's included */}
      <section className="border-y border-line bg-paper py-24 sm:py-32" aria-labelledby="included-heading">
        <div className="container-site">
          <SectionHeading
            id="included-heading"
            eyebrow="03 — What's included"
            title="The details that make a website work."
            description="The building blocks we use across our packages. Your package lists exactly which are included."
          />
          <div className="mt-14">
            <FeatureGrid items={includedFeatures} />
          </div>
        </div>
      </section>

      <FAQSection eyebrow="04 — FAQ" items={websiteFaqs} />

      <CTASection
        eyebrow="Get a website quote"
        title="Tell us what you need."
        description="Share a few details about your business and goals. We'll recommend the right package and give you a clear quote."
        primary={{ label: "Get a Quote", href: "/contact?need=new-website" }}
        secondary={{ label: "View Our Work", href: "/work" }}
      />
    </>
  );
}
