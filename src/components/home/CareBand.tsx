import { carePlans } from "@/data/pricing";
import { CarePlanCard } from "@/components/blocks/PackageCard";
import { Em, SectionHead } from "@/components/blocks/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/site/Button";
import { Aurora } from "@/components/site/Aurora";

/** Care plans on a deep, glowing night panel. */
export function CareBand() {
  return (
    <section aria-labelledby="care-heading" className="px-3 py-10 sm:px-5">
      <div className="noise relative isolate overflow-hidden rounded-[2.75rem] bg-night py-24 sm:py-32">
        <Aurora className="opacity-70 mix-blend-screen" />
        <div className="wrap relative">
          <SectionHead
            id="care-heading"
            dark
            lines={["Launching isn't", <Em key="e">the end.</Em>]}
            lead="Monitoring, backups, updates and changes every month, so your website stays healthy without becoming your job."
          />
          <ul className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
            {carePlans.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.1} className="h-full">
                <CarePlanCard plan={p} />
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-10 flex justify-center">
            <ButtonLink href="/care-plans" variant="glass-dark">
              Explore care plans
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
