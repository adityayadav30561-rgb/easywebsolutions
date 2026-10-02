import Image from "next/image";
import type { ReactNode } from "react";
import type { SeoProject } from "@/data/seo-projects";
import { sources } from "@/data/seo-projects";
import { Em, SectionHead } from "@/components/blocks/SectionHead";
import { Check } from "@/components/blocks/Check";
import { Glass } from "@/components/glass/Glass";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Aurora } from "@/components/site/Aurora";
import { BackToWork } from "./BackToWork";

function Source({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 flex items-start gap-2 text-sm text-mute">
      <svg viewBox="0 0 16 16" aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 1.5l5.5 2v4c0 3.4-2.3 6-5.5 7-3.2-1-5.5-3.6-5.5-7v-4z" />
        <path d="M5.6 8.1l1.7 1.7 3.2-3.4" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

function Up({ change }: { change: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-600/15">
      <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 10V2M2.5 5.5L6 2l3.5 3.5" />
      </svg>
      <CountUp value={change.replace(/^\+/, "")} />
      <span className="sr-only">increase</span>
    </span>
  );
}

/** Website frame for a real screenshot (not a drawn mockup). */
function ScreenFrame({ project }: { project: SeoProject }) {
  return (
    <div className="glass p-[0.9%] [--radius:clamp(1rem,2.2vw,2rem)]">
      <div className="overflow-hidden rounded-[clamp(0.75rem,1.7vw,1.6rem)] bg-white">
        <div className="flex items-center gap-2 border-b border-black/5 bg-[#fbfbfd] px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="size-2.5 rounded-full bg-[#28c840]/80" />
          <span className="mx-auto truncate rounded-md bg-black/[0.04] px-6 py-1 text-xs font-medium text-mute">{project.domain}</span>
          <span className="w-10" />
        </div>
        <Image src={project.shots.desktop} alt={`${project.name} homepage`} placeholder="blur" sizes="(min-width: 1280px) 70rem, 100vw" className="h-auto w-full" priority />
      </div>
    </div>
  );
}

export function SeoCaseStudy({ project }: { project: SeoProject }) {
  const a = project.analytics;
  const s = project.search;
  return (
    <article>
      <header className="pt-32 sm:pt-40">
        <div className="wrap">
          <BackToWork />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <RevealLines as="h1" onMount lines={[project.name]} className="t-display text-[clamp(3rem,7.6vw,6.6rem)]" />
              <Reveal delay={0.3}>
                <p className="t-lead mt-6 max-w-2xl">{project.kicker}</p>
              </Reveal>
            </div>
            <Reveal delay={0.4} className="lg:col-span-4">
              <dl className="glass glass-thin grid grid-cols-2 gap-5 p-6 [--radius:1.75rem]">
                <div className="col-span-2">
                  <dt className="text-sm text-mute">Industry</dt>
                  <dd className="mt-1 font-medium text-ink">{project.industry}</dd>
                </div>
                <div>
                  <dt className="text-sm text-mute">Location</dt>
                  <dd className="mt-1 font-medium text-ink">{project.location}</dd>
                </div>
                <div>
                  <dt className="text-sm text-mute">Service</dt>
                  <dd className="mt-1 font-medium text-ink">SEO</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm text-mute">Website</dt>
                  <dd className="mt-1">
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="link-arrow">
                      {project.domain} ↗
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>

        <div className="wrap relative mt-14">
          <Reveal>
            <ScreenFrame project={project} />
          </Reveal>
          <div className="absolute -bottom-16 right-[6%] hidden w-[17%] min-w-[9rem] sm:block lg:-bottom-24">
            <Parallax amount={70}>
              <div className="glass p-1.5 [--radius:2.4rem]">
                <Image src={project.shots.mobile} alt={`${project.name} on a phone`} placeholder="blur" sizes="15vw" className="h-auto w-full rounded-[2rem]" />
              </div>
            </Parallax>
          </div>
          <div className="absolute -bottom-10 left-[4%] sm:left-[6%]">
            <Parallax amount={40}>
              <div className="glass glass-thin float-y px-6 py-5 [--radius:1.6rem]">
                <p className="t-title text-[clamp(2.2rem,4.4vw,3.4rem)] text-ink">
                  <CountUp value={project.headline.value} />
                </p>
                <p className="text-sm font-medium text-ink-2">{project.headline.label}</p>
              </div>
            </Parallax>
          </div>
        </div>
      </header>

      <div className="wrap mt-32 sm:mt-44">
        <Reveal>
          <p className="t-title max-w-4xl text-[clamp(1.6rem,3.2vw,2.5rem)] text-ink">{project.about}</p>
        </Reveal>
      </div>

      {a && (
        <section aria-labelledby="results-heading" className="py-24 sm:py-32">
          <div className="wrap">
            <SectionHead id="results-heading" lines={["The", <Em key="r">results.</Em>]} lead="Growth in visitors and actions on the website, measured in the client's own analytics." />
            <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {a.metrics.map((m, i) => (
                <Reveal as="li" key={m.label} delay={i * 0.08}>
                  <Glass interactive className="flex h-full flex-col justify-between gap-8 p-7 [--radius:2rem]">
                    <p className="text-[0.95rem] font-medium text-ink-2">{m.label}</p>
                    <div>
                      <p className="t-title text-[clamp(2.6rem,4vw,3.4rem)] text-ink">
                        <CountUp value={m.value} />
                      </p>
                      {m.change && (
                        <p className="mt-3">
                          <Up change={m.change} />
                          <span className="ml-2 text-xs text-mute">vs. previous period</span>
                        </p>
                      )}
                    </div>
                  </Glass>
                </Reveal>
              ))}
            </ul>
            {a.note && <p className="mt-6 max-w-2xl text-ink-2">{a.note}</p>}
            <Source>
              Source: {sources.GA}, {a.period}.
            </Source>
          </div>
        </section>
      )}

      <section aria-labelledby="search-heading" className="px-3 py-10 sm:px-5">
        <div className="noise relative isolate overflow-hidden rounded-[2.75rem] bg-night py-24 sm:py-28">
          <Aurora className="opacity-70 mix-blend-screen" />
          <div className="wrap relative">
            <SectionHead id="search-heading" dark lines={["Found on", <Em key="g">Google.</Em>]} lead="How often the site appeared in Google Search, how often people clicked, and where it ranked." />
            <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Clicks from Google", s.clicks],
                ["Search impressions", s.impressions],
                ["Click-through rate", s.ctr],
                ["Average position", s.position],
              ].map(([label, value], i) => (
                <Reveal as="li" key={label} delay={i * 0.08}>
                  <Glass dark interactive className="flex h-full flex-col justify-between gap-8 p-7 [--radius:2rem]">
                    <p className="text-[0.95rem] font-medium text-white/70">{label}</p>
                    <p className="t-title text-[clamp(2.6rem,4vw,3.4rem)] !text-white">
                      <CountUp value={value} />
                    </p>
                  </Glass>
                </Reveal>
              ))}
            </ul>
            <Reveal className="mt-4">
              <Glass dark interactive className="flex flex-col justify-between gap-6 p-7 sm:flex-row sm:items-end sm:p-9 [--radius:2rem]">
                <div>
                  <p className="text-[0.95rem] font-medium text-white/70">Appearances in Google&apos;s AI results</p>
                  <p className="mt-2 max-w-md text-sm text-white/50">AI Overviews and other generative AI features in Google Search, as reported by Search Console ({project.ai.period}).</p>
                </div>
                <p className="t-display text-[clamp(3.4rem,7vw,5.6rem)] !text-white">
                  <CountUp value={project.ai.impressions} />
                </p>
              </Glass>
            </Reveal>
            <p className="mt-5 text-sm text-white/50">
              Source: {sources.GSC}, web search, {s.period}.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="trend-heading" className="py-24 sm:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead id="trend-heading" align="left" lines={["What the data", <Em key="s">shows.</Em>]} />
          </div>
          <ul className="space-y-4 lg:col-span-7">
            {project.trends.map((t, i) => (
              <Reveal as="li" key={t} delay={i * 0.06}>
                <Glass interactive className="flex gap-4 p-6 [--radius:1.6rem]">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white">
                    <Check />
                  </span>
                  <p className="pt-1 text-[1.05rem] text-ink-2">{t}</p>
                </Glass>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="proof-heading" className="pb-24 sm:pb-32">
        <div className="wrap">
          <SectionHead id="proof-heading" lines={["The", <Em key="e">evidence.</Em>]} lead="Unedited screenshots from the client's Google Analytics and Search Console accounts. Select any to view full size." />
          <ul className="mt-14 space-y-6">
            {project.proof.map((p) => (
              <Reveal as="li" key={p.title}>
                <figure className="glass p-2.5 [--radius:2.25rem] sm:p-3">
                  <a href={p.image.src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-[1.8rem] bg-white">
                    <Image src={p.image} alt={`${p.title} for ${project.name}: ${p.caption}`} placeholder="blur" sizes="(min-width: 1280px) 76rem, 100vw" className="h-auto w-full transition-transform duration-700 ease-[var(--ease-premium)] hover:scale-[1.01]" />
                  </a>
                  <figcaption className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                    <span className="font-semibold text-ink">{p.title}</span>
                    <span className="text-sm text-mute">{p.caption}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
