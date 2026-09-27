import { pageMetadata } from "@/lib/seo";
import { careComparison, carePlans } from "@/data/pricing";
import { careReasons } from "@/data/services";
import { careFaqs } from "@/data/faqs";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PricingCard } from "@/components/sections/PricingCard";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata = pageMetadata({
  title: "Website Care Plans | EasyWebSolns",
  description:
    "Monthly website care plans from $49/month: monitoring, backups, security, updates and content changes — so your website stays healthy after launch.",
  path: "/care-plans",
});

const healthRows: { label: string; icon: IconName }[] = [
  { label: "Uptime monitoring", icon: "activity" },
  { label: "SSL certificate", icon: "lock" },
  { label: "Backups", icon: "database" },
  { label: "Software updates", icon: "refresh" },
];

/** Abstract "website health" panel — illustrative UI, not live data. */
function HealthPanel() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_60%_40%,rgb(139_92_246/0.18),transparent_65%)] blur-xl" />
      <div className="rounded-[24px] border border-line bg-white/90 p-6 shadow-[var(--shadow-float)] backdrop-blur sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate uppercase">Website care</p>
            <p className="mt-1 font-display text-lg font-semibold">Monthly check-up</p>
          </div>
          <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-300 to-violet-600 text-white shadow-[0_10px_24px_-10px_rgb(124_58_237/0.7)]">
            <Icon name="shield" size={20} />
          </span>
        </div>
        <ul className="mt-6 space-y-2.5">
          {healthRows.map((r) => (
            <li key={r.label} className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3">
              <span className="flex items-center gap-3 text-sm font-medium text-ink-800">
                <Icon name={r.icon} size={17} className="text-violet-600" />
                {r.label}
              </span>
              <span className="flex size-6 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                <Icon name="check" size={13} strokeWidth={2.4} />
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-end gap-1.5" aria-hidden="true">
          {[38, 52, 44, 60, 56, 70, 64, 78, 72, 84, 80, 88].map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-md bg-gradient-to-t from-violet-100 to-violet-300"
              style={{ height: `${h * 0.7}px`, opacity: 0.5 + i / 24 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CarePlansPage() {
  return (
    <>
      <PageHero
        eyebrow="Care Plans"
        title="Your website deserves ongoing care."
        description="Stay secure, updated, monitored and supported without having to manage the technical details yourself."
        aside={<HealthPanel />}
      >
        <div className="flex flex-col gap-3 min-[480px]:flex-row">
          <ButtonLink href="/contact?need=care" size="lg" arrow>
            Protect My Website
          </ButtonLink>
          <ButtonLink href="#plans" size="lg" variant="secondary">
            View Plans
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-t border-line py-24 sm:py-32" aria-labelledby="why-care-heading">
        <div className="container-site">
          <SectionHeading
            id="why-care-heading"
            eyebrow="01 — Why website care matters"
            title="A website isn't finished at launch."
            description="Like any business asset, a website needs regular attention to stay secure, reliable and up to date."
          />
          <div className="mt-14">
            <FeatureGrid items={careReasons} columns={3} />
          </div>
        </div>
      </section>

      <section id="plans" className="relative overflow-hidden bg-mist py-24 sm:py-32" aria-labelledby="plans-heading">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(139_92_246/0.1),transparent_45%)]" />
        <div className="container-site relative">
          <SectionHeading
            id="plans-heading"
            eyebrow="02 — Plans"
            title="Simple monthly care plans."
            description="Choose the level of care your website needs. Billed monthly."
            align="center"
          />
          <div className="mx-auto mt-16 grid max-w-md gap-6 lg:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-5">
            {carePlans.map((plan, i) => (
              <PricingCard key={plan.id} plan={plan} index={i} featuredLabel="Recommended" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32" aria-labelledby="compare-heading">
        <div className="container-site">
          <SectionHeading
            id="compare-heading"
            eyebrow="03 — Compare"
            title="Compare care plans."
            description="Everything in each plan, side by side."
          />
          <div className="mt-12">
            <ComparisonTable
              caption="Care plan comparison"
              columns={carePlans.map((p) => ({ name: p.name, price: `${p.price}${p.unit}` }))}
              rows={careComparison}
              highlight={1}
            />
          </div>
        </div>
      </section>

      <div className="border-t border-line">
        <FAQSection eyebrow="04 — FAQ" items={careFaqs} />
      </div>

      <CTASection
        eyebrow="Website care"
        title={
          <>
            Launch with confidence. <br className="hidden sm:block" />
            <span className="text-gradient-light">Maintain with ease.</span>
          </>
        }
        description="Tell us about your website and we'll recommend the right care plan."
        primary={{ label: "Protect My Website", href: "/contact?need=care" }}
        secondary={{ label: "Build a New Website", href: "/websites" }}
      />
    </>
  );
}
