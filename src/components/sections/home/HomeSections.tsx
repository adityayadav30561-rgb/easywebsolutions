import { carePlans, websitePackages } from "@/data/pricing";
import { benefits } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { PricingCard } from "@/components/sections/PricingCard";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";

export function ProcessSection() {
  return (
    <section className="border-y border-line bg-paper py-24 sm:py-32" aria-labelledby="process-heading">
      <div className="container-site">
        <SectionHeading id="process-heading" eyebrow="03 — Process" title="From idea to launch, without the chaos." />
        <div className="mt-16 lg:mt-20">
          <ProcessTimeline />
        </div>
      </div>
    </section>
  );
}

export function PricingPreview() {
  return (
    <section className="py-24 sm:py-32" aria-labelledby="pricing-heading">
      <div className="container-site">
        <SectionHeading
          id="pricing-heading"
          eyebrow="04 — Websites"
          title="Simple website packages."
          description="Clear, one-time prices for professionally designed websites. Every package is built around your business — not a template."
          align="center"
        />
        <div className="mx-auto mt-16 grid max-w-md gap-6 lg:mt-20 lg:max-w-none lg:grid-cols-3 lg:items-stretch lg:gap-5">
          {websitePackages.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>
        <div className="mt-12 flex justify-center" data-reveal="">
          <ButtonLink href="/websites#packages" variant="secondary" arrow>
            Compare Website Packages
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function CarePreview() {
  return (
    <section className="relative overflow-hidden bg-mist py-24 sm:py-32" aria-labelledby="care-heading">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(139_92_246/0.1),transparent_45%)]"
      />
      <div className="container-site relative grid gap-14 xl:grid-cols-12 xl:gap-10">
        <div className="xl:col-span-4">
          <div className="xl:sticky xl:top-28">
            <SectionHeading
              id="care-heading"
              eyebrow="05 — Care"
              title="Launching your website is only the beginning."
              description="Websites need maintenance, security updates, monitoring and occasional improvements. Our care plans keep your website healthy after launch."
            />
            <div className="mt-9" data-reveal="">
              <ButtonLink href="/care-plans" arrow>
                View Care Plans
              </ButtonLink>
            </div>
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-md gap-6 lg:max-w-none lg:grid-cols-3 lg:gap-5 xl:col-span-8">
          {carePlans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} compact index={i} featuredLabel="Recommended" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyUs() {
  return (
    <section className="py-24 sm:py-32" aria-labelledby="why-heading">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            id="why-heading"
            eyebrow="06 — Why EasyWebSolns"
            title={
              <>
                Built around your business.
                <br className="hidden sm:block" /> <span className="text-gradient">Not a template.</span>
              </>
            }
          />
        </div>
        <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7">
          {benefits.map((b, i) => (
            <li
              key={b.number}
              className="border-t border-line py-8"
              data-reveal=""
              style={{ ["--reveal-delay" as string]: `${(i % 2) * 100}ms` }}
            >
              <span className="font-display text-sm font-semibold text-violet-600">{b.number}</span>
              <h3 className="mt-4 text-xl font-semibold">{b.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate">{b.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
