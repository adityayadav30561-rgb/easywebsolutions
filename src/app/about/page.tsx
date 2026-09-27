import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { CTASection } from "@/components/sections/CTASection";

export const metadata = pageMetadata({
  title: "About EasyWebSolns | Web Design & Digital Experiences",
  description:
    "EasyWebSolns helps businesses create modern websites that look professional, communicate clearly and make it easier for customers to take action.",
  path: "/about",
});

const principles: { title: string; description: string; icon: IconName }[] = [
  {
    title: "Clarity",
    description: "We remove unnecessary complexity and make it easy for visitors to understand your business.",
    icon: "compass",
  },
  {
    title: "Craft",
    description: "We care about the details—from typography and spacing to interactions and performance.",
    icon: "pen",
  },
  {
    title: "Partnership",
    description:
      "We don't disappear after launch. Our care plans help businesses maintain and improve their websites.",
    icon: "lifebuoy",
  },
];

const values = [
  {
    title: "Clarity",
    description: "Plain language, honest scope and websites that explain themselves.",
  },
  {
    title: "Quality",
    description: "Careful design and clean builds that hold up on every device.",
  },
  {
    title: "Reliability",
    description: "Doing what we say, communicating clearly and looking after what we launch.",
  },
  {
    title: "Continuous Improvement",
    description: "Treating a website as something that can keep getting better over time.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="We believe your website should earn its place in your business."
        description="EasyWebSolns helps businesses create modern digital experiences that look professional, communicate clearly and make it easier for customers to take action."
      >
        <ButtonLink href="/contact" size="lg" arrow>
          Work With Us
        </ButtonLink>
      </PageHero>

      {/* Approach */}
      <section className="border-t border-line py-24 sm:py-32" aria-labelledby="approach-heading">
        <div className="container-site">
          <SectionHeading id="approach-heading" eyebrow="01 — Our approach" title="Three principles behind every project." />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {principles.map((p, i) => (
              <article
                key={p.title}
                className="card card-hover group p-8"
                data-reveal=""
                style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 text-violet-600 transition-transform duration-500 ease-[var(--ease-premium)] group-hover:-translate-y-0.5">
                  <Icon name={p.icon} size={22} />
                </span>
                <h3 className="mt-8 text-2xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate">{p.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-3 sm:px-4" aria-labelledby="mission-heading">
        <div className="noise relative isolate overflow-hidden rounded-[28px] bg-ink py-24 sm:py-32">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_90%_10%,rgb(139_92_246/0.28),transparent_70%)]"
          />
          <div className="container-site grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeading
                id="mission-heading"
                tone="dark"
                eyebrow="02 — Mission"
                title="Make great websites accessible to growing businesses."
              />
            </div>
            <div className="space-y-6 text-base leading-relaxed text-slate-400 sm:text-lg lg:col-span-5 lg:col-start-8" data-reveal="">
              <p>
                Good websites shouldn&apos;t be reserved for companies with large budgets and in-house teams. Growing
                businesses deserve a website that represents them properly, explains what they do and makes it easy
                for customers to get in touch.
              </p>
              <p>
                We offer clear packages with straightforward pricing, design each website around the business it
                represents, and provide care plans for the work that continues after launch.
              </p>
              <p className="text-white">No jargon, no unnecessary complexity — just websites that work for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 sm:py-32" aria-labelledby="values-heading">
        <div className="container-site">
          <SectionHeading id="values-heading" eyebrow="03 — Values" title="What we hold ourselves to." />
          <ol className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li
                key={v.title}
                className="border-b border-line py-10 sm:odd:pr-8 sm:even:border-l sm:even:pl-8 lg:border-b-0 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0 lg:odd:pr-8"
                data-reveal=""
                style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
              >
                <span className="font-display text-[3.5rem] leading-none font-semibold tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(124_58_237/0.35)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-8 text-xl font-semibold">{v.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate">{v.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection
        title="Let's build something useful."
        description="Tell us about your business and what you'd like your website to do."
        primary={{ label: "Start a Project", href: "/contact" }}
        secondary={{ label: "View Our Work", href: "/work" }}
      />
    </>
  );
}
