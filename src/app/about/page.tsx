import Image from "next/image";
import { pageMetadata } from "@/lib/seo";
import { photos } from "@/data/images";
import { PageIntro } from "@/components/blocks/PageIntro";
import { Em, SectionHead } from "@/components/blocks/SectionHead";
import { GlassPhoto } from "@/components/blocks/GlassPhoto";
import { CTA } from "@/components/blocks/CTA";
import { Glass } from "@/components/glass/Glass";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { Aurora } from "@/components/site/Aurora";
import { ButtonLink } from "@/components/site/Button";

export const metadata = pageMetadata({
  title: "About EasyWebSolns | Web Design & Digital Experiences",
  description:
    "EasyWebSolns helps businesses create modern websites that look professional, communicate clearly and make it easier for customers to take action.",
  path: "/about",
});

const principles = [
  { word: "Clarity", text: "We remove unnecessary complexity and make it easy for visitors to understand your business." },
  { word: "Craft", text: "We care about the details, from typography and spacing to interactions and performance." },
  { word: "Partnership", text: "We don't disappear after launch. Our care plans help businesses maintain and improve their websites." },
];

const howWeWork = [
  ["Clear communication throughout", "You'll always know which stage the project is at and what we need from you next."],
  ["Scope in writing, before anything starts", "You know what's included, what isn't, and what it costs before we begin."],
  ["Real content, early", "We design with your actual words and images as soon as possible, so there are no surprises at the end."],
  ["Launch is a milestone, not a hand-off", "After launch we can keep your website secure, updated and improving through a care plan."],
];

const values = [
  { word: "Clarity", text: "Plain language, honest scope and websites that explain themselves." },
  { word: "Quality", text: "Careful design and clean builds that hold up on every device." },
  { word: "Reliability", text: "Doing what we say, communicating clearly and looking after what we launch." },
  { word: "Improvement", text: "Treating a website as something that can keep getting better." },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        lines={["Your website should", <Em key="p">earn its place.</Em>]}
        lead="EasyWebSolns helps businesses create modern digital experiences that look professional, communicate clearly and make it easier for customers to take action."
        aside={<GlassPhoto name="aboutWorkspace" sizes="(min-width: 1024px) 34rem, 90vw" priority className="aspect-[4/5]" />}
      >
        <ButtonLink href="/contact">Work with us</ButtonLink>
      </PageIntro>

      <section aria-label="Our story" className="py-24 sm:py-36">
        <div className="wrap">
          <ScrollWords
            className="t-title max-w-[24ch] text-[clamp(2rem,4.8vw,4.2rem)] text-ink"
            text="Too many good businesses are let down by their websites. Slow, dated, confusing, or built once and *never* *touched* *again.*"
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <Reveal>
              <p className="text-[1.15rem] leading-relaxed text-ink-2">
                EasyWebSolns exists to fix that. We design and build websites for businesses that want to be taken seriously online, and we stay involved afterwards so the website keeps working for them.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[1.15rem] leading-relaxed text-ink-2">
                Our packages are clear and our pricing is published, because choosing a web partner shouldn&apos;t feel like a negotiation. What you get is a website designed around your business, not a template with your logo dropped in.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="h-[22rem] overflow-hidden rounded-[2.4rem] sm:h-[34rem]">
          <Parallax amount={50} className="-mt-[6%] h-[112%]">
            <GlassPhoto name="processDesign" sizes="(min-width: 1280px) 78rem, 100vw" className="h-full" />
          </Parallax>
        </div>
      </div>

      <section aria-labelledby="principles-heading" className="py-24 sm:py-36">
        <div className="wrap">
          <SectionHead id="principles-heading" lines={["Three", <Em key="p">principles.</Em>]} />
          <ul className="mt-16 grid gap-5 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.word} delay={i * 0.1}>
                <Glass interactive className="flex h-full min-h-[20rem] flex-col justify-between p-8 [--radius:2.25rem]">
                  <span className="t-serif t-gradient text-[3.5rem] leading-none">{i + 1}</span>
                  <div>
                    <h3 className="t-title text-[2.4rem] text-ink">{p.word}</h3>
                    <p className="mt-3 text-ink-2">{p.text}</p>
                  </div>
                </Glass>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="mission-heading" className="px-3 py-10 sm:px-5">
        <div className="noise relative isolate overflow-hidden rounded-[2.75rem] bg-night">
          <Aurora className="opacity-70 mix-blend-screen" />
          <div className="relative grid gap-10 p-6 sm:p-12 lg:grid-cols-2 lg:p-16">
            <div className="flex flex-col justify-center py-8">
              <SectionHead id="mission-heading" dark align="left" lines={["Great websites,", <Em key="a">within reach.</Em>]} />
              <Reveal delay={0.15} className="mt-8 max-w-lg space-y-5 text-[1.1rem] leading-relaxed text-white/70">
                <p>
                  Good websites shouldn&apos;t be reserved for companies with large budgets and in-house teams. Growing businesses deserve a website that represents them properly and makes it easy for customers to get in touch.
                </p>
                <p>That means clear packages, published prices, careful design, and support after launch.</p>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <div className="glass glass-dark h-full min-h-[24rem] p-2.5 [--radius:2.25rem]">
                <div className="relative h-full min-h-[23rem] overflow-hidden rounded-[1.85rem]">
                  <Image src={photos.aboutCollaboration.src} alt={photos.aboutCollaboration.alt} fill sizes="(min-width: 1024px) 40vw, 90vw" placeholder="blur" quality={75} className="object-cover" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="py-24 sm:py-36">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead id="how-heading" align="left" lines={["How we", <Em key="w">work.</Em>]} lead="Straightforward, from the first call to long after launch." />
          </div>
          <ol className="space-y-4 lg:col-span-7">
            {howWeWork.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.06}>
                <Glass interactive className="flex gap-5 p-6 sm:p-7 [--radius:1.75rem]">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-white">{i + 1}</span>
                  <div>
                    <h3 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-ink">{t}</h3>
                    <p className="mt-1.5 text-ink-2">{d}</p>
                  </div>
                </Glass>
              </Reveal>
            ))}
          </ol>
        </div>
        <div className="wrap mt-24">
          <SectionHead lines={["What we", <Em key="v">value.</Em>]} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal as="li" key={v.word} delay={i * 0.08}>
                <Glass interactive className="h-full p-7 [--radius:2rem]">
                  <h3 className="t-title text-[1.9rem] text-ink">{v.word}</h3>
                  <p className="mt-3 text-ink-2">{v.text}</p>
                </Glass>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CTA lines={["Let's build", <Em key="u">something useful.</Em>]} lead="Tell us about your business and what you'd like your website to do." secondary={{ label: "See our work", href: "/work" }} />
    </>
  );
}
