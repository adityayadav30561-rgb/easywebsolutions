import type { CSSProperties } from "react";
import { carePlans } from "@/data/pricing";
import { CarePlanCard } from "@/components/sections/PricingCard";
import { Photo } from "@/components/ui/Photo";
import { DisplayLines, Label } from "@/components/ui/Type";
import { ButtonLink } from "@/components/ui/Button";

const lifecycle = ["Build", "Launch", "Protect", "Improve"];

/** The transition from BUILD to CARE — the page turns dark. */
export function Care() {
  return (
    <section aria-labelledby="care-heading" data-theme="dark" className="grain relative isolate overflow-hidden bg-night text-white">
      <div className="absolute inset-x-0 top-0 -z-10 h-[80vh]">
        <Photo name="careNightStreet" alt="" sizes="100vw" treatment="violet" parallax={0.12} position="50% 60%" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/70 to-night" />
      </div>

      <div className="container-site relative z-[2] pt-28 pb-24 sm:pt-40 sm:pb-36">
        <Label index="06" tone="dark">
          Website care
        </Label>
        <DisplayLines
          id="care-heading"
          className="mt-8 text-[3.2rem] text-white sm:text-[6rem] xl:text-[8.5rem]"
          lines={["Launching", <>isn&apos;t the end.</>]}
        />
        <p className="mt-8 max-w-md text-lg leading-relaxed text-white/70" data-reveal="">
          Your website needs care long after the launch button is pressed.
        </p>

        {/* BUILD → LAUNCH → PROTECT → IMPROVE */}
        <ol className="mt-20 grid grid-cols-2 border-t border-line-dark sm:grid-cols-4" aria-label="Website lifecycle">
          {lifecycle.map((step, i) => (
            <li
              key={step}
              className="relative border-line-dark py-6 pr-4 max-sm:odd:border-r sm:border-r sm:pl-6 sm:first:pl-0 sm:last:border-r-0 max-sm:[&:nth-child(n+3)]:border-t max-sm:even:pl-4"
              data-reveal=""
              style={{ "--d": `${i * 120}ms` } as CSSProperties}
            >
              <span aria-hidden="true" className={i >= 2 ? "signal absolute -top-px left-0 h-[2px] w-full" : "absolute -top-px left-0 h-[2px] w-full bg-white/40"} />
              <p className="label text-white/40">{i < 2 ? "We build" : "We care"}</p>
              <p className="display mt-3 text-[1.9rem] sm:text-[2.6rem]">
                {step}
                {i < lifecycle.length - 1 && <span aria-hidden="true" className="ml-2 text-white/25">→</span>}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {carePlans.map((plan, i) => (
            <CarePlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        <div className="mt-12" data-reveal="">
          <ButtonLink href="/care-plans" variant="link-light">
            View Care Plans
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
