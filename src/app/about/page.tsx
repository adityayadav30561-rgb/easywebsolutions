import type { CSSProperties } from "react";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { DisplayLines, Label } from "@/components/ui/Type";

export const metadata = pageMetadata({
  title: "About EasyWebSolns | Web Design & Digital Experiences",
  description:
    "EasyWebSolns helps businesses create modern websites that look professional, communicate clearly and make it easier for customers to take action.",
  path: "/about",
});

const approach = [
  { word: "Clarity", text: "We remove unnecessary complexity and make it easy for visitors to understand your business." },
  { word: "Craft", text: "We care about the details—from typography and spacing to interactions and performance." },
  {
    word: "Partnership",
    text: "We don't disappear after launch. Our care plans help businesses maintain and improve their websites.",
  },
];

const values = [
  { word: "Clarity", text: "Plain language, honest scope and websites that explain themselves." },
  { word: "Quality", text: "Careful design and clean builds that hold up on every device." },
  { word: "Reliability", text: "Doing what we say, communicating clearly and looking after what we launch." },
  { word: "Continuous improvement", text: "Treating a website as something that can keep getting better." },
];

const howWeWork = [
  ["Clear communication throughout", "You'll always know which stage the project is at and what we need from you next."],
  ["Scope in writing, before anything starts", "You know what's included, what isn't, and what it costs before we begin."],
  ["Real content, early", "We design with your actual words and images as soon as possible, so there are no surprises at the end."],
  ["Launch is a milestone, not a hand-off", "After launch we can keep your website secure, updated and improving through a care plan."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About EasyWebSolns"
        size="md"
        lines={["We believe your", "website should", <span key="p">earn its <span className="text-violet-600">place.</span></span>]}
        description="EasyWebSolns helps businesses create modern digital experiences that look professional, communicate clearly and make it easier for customers to take action."
        aside={
          <div className="relative aspect-[4/5] overflow-hidden">
            <Photo name="aboutWoodCarving" alt="" sizes="(min-width: 1024px) 38vw, 100vw" treatment="mono" priority position="30% 50%" />
            <p className="label absolute bottom-4 left-4 rounded-[4px] bg-night/60 px-2 py-1 text-white">Fig. — Craft, up close</p>
          </div>
        }
      >
        <ButtonLink href="/contact">Work With Us</ButtonLink>
      </PageHero>

      {/* Story */}
      <section aria-labelledby="story-heading" className="bg-white py-24 sm:py-36">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Label index="01">Our story</Label>
            <h2 id="story-heading" className="sr-only">
              Our story
            </h2>
          </div>
          <div className="space-y-8 lg:col-span-7 lg:col-start-6" data-reveal="">
            <p className="font-display text-[1.9rem] leading-[1.2] font-medium tracking-[-0.02em] text-ink sm:text-[2.6rem]">
              Too many good businesses are let down by their websites — slow, dated, confusing, or built once and never
              touched again.
            </p>
            <p className="text-lg leading-relaxed text-ink-700">
              EasyWebSolns exists to fix that. We design and build websites for businesses that want to be taken
              seriously online, and we stay involved afterwards so the website keeps working for them.
            </p>
            <p className="text-lg leading-relaxed text-grey">
              Our packages are clear and our pricing is published, because choosing a web partner shouldn&apos;t feel
              like a negotiation. What you get is a website designed around your business — not a template with your
              logo dropped in.
            </p>
          </div>
        </div>
      </section>

      {/* Full-bleed photograph */}
      <div className="relative aspect-[4/3] sm:aspect-[21/9]">
        <Photo name="processDesignLetterpress" alt="" sizes="100vw" treatment="mono" reveal parallax={0.1} />
        <p className="label absolute right-5 bottom-5 rounded-[4px] bg-night/60 px-2 py-1 text-white sm:right-8 sm:bottom-8">Typography — where design begins</p>
      </div>

      {/* Approach */}
      <section aria-labelledby="approach-heading" className="bg-paper py-24 sm:py-36">
        <div className="container-site">
          <Label index="02">Approach</Label>
          <DisplayLines id="approach-heading" className="mt-8 text-[3rem] text-ink sm:text-[5rem] xl:text-[6.5rem]" lines={["Three principles."]} />
          <ol className="mt-16">
            {approach.map((a, i) => (
              <li key={a.word} className="group grid gap-4 border-t border-ink py-10 lg:grid-cols-12 lg:items-baseline" data-reveal="" style={{ "--d": `${i * 80}ms` } as CSSProperties}>
                <span className="font-display text-sm text-violet-600 lg:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display text-[3rem] text-ink transition-transform duration-700 ease-[var(--ease-premium)] group-hover:translate-x-2 sm:text-[4.5rem] lg:col-span-6">
                  {a.word}
                </h3>
                <p className="max-w-md text-lg leading-relaxed text-ink-700 lg:col-span-5">{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Mission — dark statement */}
      <section aria-labelledby="mission-heading" data-theme="dark" className="grain relative isolate overflow-hidden bg-night text-white">
        <div className="grid lg:grid-cols-2">
          <div className="container-site relative z-[2] py-24 sm:py-32 lg:!pr-16">
            <Label index="03" tone="dark">
              Mission
            </Label>
            <DisplayLines
              id="mission-heading"
              className="mt-8 text-[2.8rem] text-white sm:text-[4.5rem] xl:text-[5rem]"
              lines={["Make great", "websites", <span key="a" className="text-violet-300">accessible</span>, "to growing", "businesses."]}
            />
            <div className="mt-10 max-w-lg space-y-5 text-lg leading-relaxed text-white/70" data-reveal="">
              <p>
                Good websites shouldn&apos;t be reserved for companies with large budgets and in-house teams. Growing
                businesses deserve a website that represents them properly and makes it easy for customers to get in
                touch.
              </p>
              <p>That means clear packages, published prices, careful design — and support after launch.</p>
            </div>
          </div>
          <div className="relative min-h-[26rem]">
            <Photo name="aboutStoneArtisan" alt="" sizes="(min-width: 1024px) 50vw, 100vw" treatment="violet" reveal />
          </div>
        </div>
      </section>

      {/* How we work + values */}
      <section aria-labelledby="how-heading" className="bg-white py-24 sm:py-36">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Label index="04">How we work</Label>
            <DisplayLines id="how-heading" className="mt-8 text-[3rem] text-ink sm:text-[4.5rem]" lines={["Straight", "forward."]} />
          </div>
          <ol className="border-t border-ink lg:col-span-7">
            {howWeWork.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2.5rem_1fr] border-b border-line-strong py-7" data-reveal="" style={{ "--d": `${i * 60}ms` } as CSSProperties}>
                <span className="font-display text-sm text-grey-400">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">{t}</h3>
                  <p className="mt-2 text-[1rem] leading-relaxed text-grey">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="container-site mt-28">
          <Label index="05">Values</Label>
          <ul className="mt-10 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li key={v.word} className="border-line py-8 sm:pr-8 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0 max-lg:border-b" data-reveal="" style={{ "--d": `${i * 80}ms` } as CSSProperties}>
                <p className="display text-[2rem] text-ink lg:text-[1.7rem] xl:text-[2rem]">{v.word}</p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-grey">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection
        eyebrow="Work with us"
        lines={["Let's build", <span key="u" className="text-violet-300">something useful.</span>]}
        description="Tell us about your business and what you'd like your website to do."
        primary={{ label: "Start a Project", href: "/contact" }}
        secondary={{ label: "View Our Work", href: "/work" }}
        photo="whyConcreteBlocks"
      />
    </>
  );
}
