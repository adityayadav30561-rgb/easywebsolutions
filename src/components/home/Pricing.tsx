import { websitePackages } from "@/data/pricing";
import { PackageCard } from "@/components/blocks/PackageCard";
import { Em, SectionHead } from "@/components/blocks/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/site/Button";

export function Pricing() {
  return (
    <section aria-labelledby="pricing-heading" className="py-24 sm:py-36">
      <div className="wrap">
        <SectionHead
          id="pricing-heading"
          lines={["Clear prices.", <Em key="s">No surprises.</Em>]}
          lead="One-time prices, published up front. Scope is confirmed in writing before any work begins."
        />
        <ul className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
          {websitePackages.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.1} className="h-full">
              <PackageCard plan={p} />
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-10 flex justify-center">
          <ButtonLink href="/websites#compare" variant="glass">
            Compare packages
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
