import Image from "next/image";
import Link from "next/link";
import { seoProjects } from "@/data/seo-projects";
import { Em, SectionHead } from "@/components/blocks/SectionHead";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow } from "@/components/site/Button";

/** Every SEO result at a glance, each row linking to its full case study. */
export function SeoResults() {
  return (
    <section id="seo" aria-labelledby="seo-heading" className="scroll-mt-28 py-16 sm:py-24">
      <div className="wrap">
        <SectionHead
          id="seo-heading"
          lines={["SEO results you", <Em key="v">can verify.</Em>]}
          lead="Every number comes straight from the client's own Google Analytics and Search Console, with the screenshots on each case study."
        />
        <ul className="mt-14 space-y-3">
          {seoProjects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 0.06}>
              <Link href={`/work/${p.slug}`} className="glass group grid items-center gap-5 p-3 transition-[--glare] hover:[--glare:1] sm:grid-cols-[9rem_1fr_auto] sm:gap-7 sm:p-3.5 lg:grid-cols-[11rem_1.3fr_1fr_1fr_auto] [--radius:2rem]">
                <div className="relative hidden aspect-[16/10] overflow-hidden rounded-[1.4rem] sm:block">
                  <Image src={p.shots.desktop} alt="" fill sizes="11rem" placeholder="blur" className="object-cover object-top transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-105" />
                </div>
                <div className="px-3 pt-2 sm:p-0">
                  <h3 className="t-head text-[1.35rem] text-ink">{p.name}</h3>
                  <p className="mt-0.5 text-sm text-mute">
                    {p.industry} · {p.location}
                  </p>
                </div>
                <div className="px-3 sm:p-0">
                  <p className="t-title text-[2.2rem] text-ink">
                    <CountUp value={p.headline.value} />
                  </p>
                  <p className="text-sm text-ink-2">{p.headline.label}</p>
                </div>
                <dl className="hidden grid-cols-2 gap-4 lg:grid">
                  <div>
                    <dt className="text-xs text-mute">Search impressions</dt>
                    <dd className="mt-0.5 text-lg font-semibold tracking-[-0.02em] text-ink">{p.search.impressions}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-mute">AI result appearances</dt>
                    <dd className="mt-0.5 text-lg font-semibold tracking-[-0.02em] text-ink">{p.ai.impressions}</dd>
                  </div>
                </dl>
                <span className="mx-3 mb-3 grid size-11 place-items-center justify-self-end rounded-full bg-ink text-white transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-110 sm:m-0 sm:mr-2">
                  <Arrow />
                  <span className="sr-only">Read the {p.name} case study</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
