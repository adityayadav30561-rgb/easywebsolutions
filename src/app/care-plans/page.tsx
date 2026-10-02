import { pageMetadata } from "@/lib/seo";
import { careReasons } from "@/data/services";
import { careComparison, carePlans } from "@/data/pricing";
import { careFaqs } from "@/data/faqs";
import { PageIntro } from "@/components/blocks/PageIntro";
import { Em, SectionHead } from "@/components/blocks/SectionHead";
import { CarePlanCard } from "@/components/blocks/PackageCard";
import { CompareTable } from "@/components/blocks/CompareTable";
import { FAQSection } from "@/components/blocks/FAQSection";
import { CTA } from "@/components/blocks/CTA";
import { GlassPhoto } from "@/components/blocks/GlassPhoto";
import { Glass } from "@/components/glass/Glass";
import { Reveal } from "@/components/motion/Reveal";
import { Aurora } from "@/components/site/Aurora";
import { ButtonLink } from "@/components/site/Button";

export const metadata = pageMetadata({
  title: "Website Care Plans | EasyWebSolns",
  description:
    "Monthly website care from $49/month: monitoring, security, backups, updates and content changes — so your website stays healthy without needing your attention.",
  path: "/care-plans",
});

const statuses = [
  { label: "Secure", note: "Security monitoring", pos: "left-[-3%] top-[12%]" },
  { label: "Backed up", note: "Regular backups", pos: "right-[-4%] top-[30%]" },
  { label: "Monitored", note: "Uptime & SSL", pos: "left-[4%] bottom-[10%]" },
  { label: "Updated", note: "Software & plugins", pos: "right-[2%] bottom-[-4%]" },
];

const incident = [
  { step: "Detect", text: "Monitoring alerts us when your website becomes unavailable or its SSL certificate has a problem." },
  { step: "Assess", text: "We investigate the cause: an update, the hosting provider, a plugin, or something else." },
  { step: "Restore", text: "We work to bring the website back, using backups where needed, and keep you informed." },
  { step: "Report", text: "We explain what happened, what we did, and anything that would help prevent it again." },
];

function StatusVisual() {
  return (
    <div className="relative aspect-[4/5]">
      <GlassPhoto name="careSupport" sizes="(min-width: 1024px) 34rem, 90vw" priority className="absolute inset-0" />
      <ul aria-label="What a care plan looks after">
        {statuses.map((s, i) => (
          <li key={s.label} className={`glass glass-thin float-y absolute ${s.pos} flex items-center gap-3 px-4 py-3 [--radius:1.2rem]`} style={{ animationDelay: `${i * 0.8}s` }}>
            <span className="relative grid size-2.5 place-items-center">
              <span className="absolute size-2.5 animate-ping rounded-full bg-emerald-400/60" />
              <span className="size-2 rounded-full bg-emerald-500" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">{s.label}</span>
              <span className="block text-xs text-mute">{s.note}</span>
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
      <PageIntro
        lines={["Your website,", <Em key="l">looked after.</Em>]}
        lead="Stay secure, updated, monitored and supported without having to manage the technical details yourself."
        aside={<StatusVisual />}
      >
        <ButtonLink href="/contact?need=care">Protect my website</ButtonLink>
        <ButtonLink href="#plans" variant="glass">
          See plans
        </ButtonLink>
      </PageIntro>

      <section aria-labelledby="why-care-heading" className="py-24 sm:py-32">
        <div className="wrap">
          <SectionHead id="why-care-heading" lines={["A website isn't", <Em key="f">finished at launch.</Em>]} lead="Software ages, threats change and businesses move on. Care keeps everything working in the background." />
          <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careReasons.map((r, i) => (
              <Reveal as="li" key={r.title} delay={(i % 3) * 0.08}>
                <Glass interactive className="h-full p-7 sm:p-8 [--radius:2rem]">
                  <h3 className="t-title text-[1.9rem] text-ink">{r.title}</h3>
                  <p className="mt-3 text-ink-2">{r.description}</p>
                </Glass>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="plans" aria-labelledby="plans-heading" className="scroll-mt-24 px-3 py-10 sm:px-5">
        <div className="noise relative isolate overflow-hidden rounded-[2.75rem] bg-night py-24 sm:py-32">
          <Aurora className="opacity-70 mix-blend-screen" />
          <div className="wrap relative">
            <SectionHead id="plans-heading" dark lines={["Simple", <Em key="m">monthly care.</Em>]} lead="Billed monthly. Choose the level of care your website needs." />
            <ul className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
              {carePlans.map((p, i) => (
                <Reveal as="li" key={p.id} delay={i * 0.1} className="h-full">
                  <CarePlanCard plan={p} />
                </Reveal>
              ))}
            </ul>
            <Reveal className="mt-16">
              <h3 className="t-title mb-6 text-[2rem] text-white">Compare plans</h3>
              <CompareTable
                dark
                caption="Care plan comparison"
                columns={carePlans.map((p) => ({ name: p.name, price: `${p.price}${p.unit}` }))}
                rows={careComparison.map((r) => ({ label: r.label, values: r.values }))}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="incident-heading" className="py-24 sm:py-32">
        <div className="wrap">
          <SectionHead id="incident-heading" lines={["If something", <Em key="g">goes wrong.</Em>]} lead="A calm, clear routine, so problems are handled quickly and you always know what happened." />
          <ol className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {incident.map((s, i) => (
              <Reveal as="li" key={s.step} delay={i * 0.08}>
                <Glass interactive className="h-full p-7 [--radius:2rem]">
                  <span className="grid size-10 place-items-center rounded-full bg-ink text-sm font-semibold text-white">{i + 1}</span>
                  <h3 className="t-title mt-6 text-[1.8rem] text-ink">{s.step}</h3>
                  <p className="mt-3 text-ink-2">{s.text}</p>
                </Glass>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <FAQSection faqs={careFaqs} id="care-faq" />

      <CTA
        lines={["Keep your website", <Em key="h">healthy.</Em>]}
        lead="Tell us about your website and we'll recommend the plan that fits."
        primary={{ label: "Choose a care plan", href: "/contact?need=care" }}
      />
    </>
  );
}
