import { websitePackages } from "@/data/pricing";
import { PackageSheet } from "@/components/sections/PricingCard";
import { DisplayLines, Label } from "@/components/ui/Type";
import { ButtonLink } from "@/components/ui/Button";

const inEvery = [
  ["Designed for you", "No templates. Layout, typography and structure shaped around your business."],
  ["Built for phones first", "Every page designed and tested for mobile, tablet and desktop."],
  ["Made to be found", "Clean structure, titles and descriptions search engines understand."],
  ["Launched properly", "SSL, testing and a careful go-live — not a file handed over."],
];

export function Packages() {
  return (
    <section aria-labelledby="packages-heading" className="bg-paper py-24 sm:py-36">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Label index="05">Website packages</Label>
            <DisplayLines
              id="packages-heading"
              className="mt-8 text-[3rem] text-ink sm:text-[5rem] xl:text-[6.5rem]"
              lines={["Choose your", "starting point."]}
            />
          </div>
          {/* Value before price */}
          <dl className="grid gap-x-8 sm:grid-cols-2 lg:col-span-5 lg:self-end">
            {inEvery.map(([t, d], i) => (
              <div key={t} className="border-t border-line-strong py-5" data-reveal="" style={{ ["--d" as string]: `${i * 80}ms` }}>
                <dt className="text-[0.9375rem] font-semibold text-ink">{t}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-grey">{d}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-0 lg:[&>*+*]:-ml-px">
          {websitePackages.map((plan, i) => (
            <PackageSheet key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center" data-reveal="">
          <p className="max-w-lg text-[0.9375rem] text-grey">
            Prices are one-time. Scope is confirmed in writing before any work begins — no surprises.
          </p>
          <ButtonLink href="/websites#packages" variant="link">
            Compare Website Packages
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
