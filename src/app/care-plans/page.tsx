import type { CSSProperties } from "react";
import { pageMetadata } from "@/lib/seo";
import { careComparison, carePlans } from "@/data/pricing";
import { careReasons } from "@/data/services";
import { careFaqs } from "@/data/faqs";
import { getProject } from "@/data/projects";
import { PageHero } from "@/components/sections/PageHero";
import { CarePlanCard } from "@/components/sections/PricingCard";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { MockupWindow } from "@/components/visuals/ProjectMockup";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { DisplayLines, Label } from "@/components/ui/Type";

export const metadata = pageMetadata({
  title: "Website Care Plans | EasyWebSolns",
  description:
    "Monthly website care from $49/month: monitoring, security, backups, updates and content changes — so your website stays healthy without needing your attention.",
  path: "/care-plans",
});

const statuses = [
  { label: "Secure", note: "Security monitoring", pos: "left-[3%] top-[16%]" },
  { label: "Backed up", note: "Regular backups", pos: "right-[3%] top-[24%]" },
  { label: "Monitored", note: "Uptime & SSL", pos: "left-[6%] bottom-[14%]" },
  { label: "Updated", note: "Software & plugins", pos: "right-[6%] bottom-[20%]" },
];

const incident = [
  { step: "Detect", text: "Monitoring alerts us when your website becomes unavailable or its SSL certificate has a problem." },
  { step: "Assess", text: "We investigate the cause — an update, the hosting provider, a plugin, or something else." },
  { step: "Restore", text: "We work to bring the website back, using backups where needed, and keep you informed." },
  { step: "Report", text: "We explain what happened, what we did, and anything that would help prevent it again." },
];

/** A website surrounded by quiet status indicators. Illustrative — not live data. */
function StatusVisual() {
  const project = getProject("brand-business-website")!;
  return (
    <div data-theme="dark" className="@container relative aspect-[4/5] overflow-hidden bg-night sm:aspect-[16/10] lg:aspect-[16/7]">
      <Photo name="careDeskDark" alt="" sizes="100vw" treatment="violet" parallax={0.08} priority />
      <div aria-hidden="true" className="absolute inset-0 bg-night/40" />
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 w-[70%] -translate-x-1/2 -translate-y-1/2 sm:w-[52%] lg:w-[40%]">
        <MockupWindow project={project} />
      </div>
      <ul aria-label="What a care plan looks after" className="absolute inset-0">
        {statuses.map((s, i) => (
          <li
            key={s.label}
            className={`enter absolute ${s.pos} flex items-center gap-3 rounded-[8px] border border-white/15 bg-night/60 px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3`}
            style={{ "--d": `${900 + i * 150}ms` } as CSSProperties}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-violet-300 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-violet-300" />
            </span>
            <span>
              <span className="label block text-white">{s.label}</span>
              <span className="hidden text-xs text-white/55 sm:block">{s.note}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CarePlansPage() {
  return (
    <>
      <PageHero
        label="Website care plans"
        size="lg"
        lines={["Your website", "shouldn't need", "your attention", <span key="e" className="text-violet-600">every day.</span>]}
        description="Stay secure, updated, monitored and supported without having to manage the technical details yourself."
        media={<StatusVisual />}
      >
        <ButtonLink href="/contact?need=care">Protect My Website</ButtonLink>
      </PageHero>

      {/* Why care matters — a spec index */}
      <section aria-labelledby="why-care-heading" className="bg-white py-24 sm:py-36">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Label index="01">Why it matters</Label>
              <DisplayLines id="why-care-heading" className="mt-8 text-[3rem] text-ink sm:text-[4.5rem]" lines={["A website", "isn't finished", "at launch."]} />
              <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden lg:block">
                <Photo name="processCareUnderground" alt="" sizes="35vw" treatment="mono" reveal />
              </div>
            </div>
          </div>
          <ol className="border-t border-ink lg:col-span-6 lg:col-start-7">
            {careReasons.map((r, i) => (
              <li key={r.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line-strong py-8" data-reveal="" style={{ "--d": `${i * 50}ms` } as CSSProperties}>
                <span className="font-display text-sm text-violet-600 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="display text-[2rem] text-ink sm:text-[2.4rem]">{r.title}</h3>
                  <p className="mt-3 max-w-md text-[1rem] leading-relaxed text-ink-700">{r.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Plans + comparison on dark */}
      <section id="plans" aria-labelledby="plans-heading" data-theme="dark" className="grain relative bg-night py-24 text-white sm:py-36">
        <div className="container-site relative z-[2]">
          <Label index="02" tone="dark">
            Plans
          </Label>
          <DisplayLines id="plans-heading" className="mt-8 text-[3rem] text-white sm:text-[5rem] xl:text-[6.5rem]" lines={["Simple", "monthly care."]} />
          <p className="mt-6 max-w-md text-lg text-white/60" data-reveal="">
            Billed monthly. Choose the level of care your website needs.
          </p>
          <div className="mt-16 grid gap-5 lg:grid-cols-3">
            {carePlans.map((plan, i) => (
              <CarePlanCard key={plan.id} plan={plan} index={i} />
            ))}
          </div>

          <div className="mt-28">
            <h3 className="display text-[2.4rem] sm:text-[3rem]" data-reveal="">
              Compare plans
            </h3>
            <div className="mt-8">
              <ComparisonTable
                tone="dark"
                caption="Care plan comparison"
                columns={carePlans.map((p) => ({ name: p.name, price: `${p.price}${p.unit}` }))}
                rows={careComparison}
                highlight={1}
              />
            </div>
          </div>
        </div>
      </section>

      {/* When something goes wrong */}
      <section aria-labelledby="incident-heading" className="bg-paper py-24 sm:py-36">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Label index="03">If something breaks</Label>
              <DisplayLines id="incident-heading" className="mt-8 text-[3rem] text-ink sm:text-[5rem]" lines={["When something", "goes wrong."]} />
            </div>
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-grey lg:col-span-5 lg:justify-self-end" data-reveal="">
              Websites occasionally have bad days. What matters is noticing quickly and handling it calmly. Here&apos;s
              what happens when you&apos;re on a care plan.
            </p>
          </div>
          <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-0">
            <span aria-hidden="true" className="signal absolute top-0 left-0 hidden h-[2px] w-full md:block" data-reveal="rule" />
            {incident.map((s, i) => (
              <li key={s.step} className="relative border-l border-line-strong pl-6 md:border-l-0 md:pt-10 md:pr-8 md:pl-0" data-reveal="" style={{ "--d": `${200 + i * 150}ms` } as CSSProperties}>
                <span aria-hidden="true" className="absolute -top-[5px] left-0 hidden size-3 rounded-full bg-violet md:block" />
                <p className="label text-grey">Step {String(i + 1).padStart(2, "0")}</p>
                <h3 className="display mt-3 text-[2.2rem] text-ink">{s.step}</h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-ink-700">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FAQSection index="04" items={careFaqs} />

      <CTASection
        eyebrow="Website care"
        lines={["Launch with", "confidence.", <span key="m" className="text-violet-300">Maintain with ease.</span>]}
        description="Tell us about your website and we'll recommend the right care plan."
        primary={{ label: "Protect My Website", href: "/contact?need=care" }}
        secondary={{ label: "Build a New Website", href: "/websites" }}
        photo="careNightStreet"
      />
    </>
  );
}
