import Image from "next/image";
import type { AppProject } from "@/data/app-projects";
import { Em, SectionHead } from "@/components/blocks/SectionHead";
import { Check } from "@/components/blocks/Check";
import { Glass } from "@/components/glass/Glass";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { ButtonLink } from "@/components/site/Button";
import { BackToWork } from "./BackToWork";
import { ScreenTour } from "./ScreenTour";

function Collage({ image, alt, accent, priority }: { image: AppProject["hero"]; alt: string; accent: string; priority?: boolean }) {
  return (
    <div className="glass p-[0.9%] [--radius:clamp(1rem,2.2vw,2rem)]">
      <div className="overflow-hidden rounded-[clamp(0.75rem,1.7vw,1.6rem)]" style={{ backgroundColor: accent }}>
        <Image src={image} alt={alt} placeholder="blur" quality={90} priority={priority} sizes="(min-width: 1280px) 76rem, 100vw" className="h-auto w-full" />
      </div>
    </div>
  );
}

export function AppCaseStudy({ project }: { project: AppProject }) {
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
              <Reveal delay={0.45} className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Open the live demo
                </ButtonLink>
              </Reveal>
            </div>
            <Reveal delay={0.4} className="lg:col-span-4">
              <dl className="glass glass-thin grid grid-cols-2 gap-5 p-6 [--radius:1.75rem]">
                <div className="col-span-2">
                  <dt className="text-sm text-mute">Category</dt>
                  <dd className="mt-1 font-medium text-ink">{project.category}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm text-mute">Platforms</dt>
                  <dd className="mt-1 font-medium text-ink">{project.platforms}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm text-mute">Built with</dt>
                  <dd className="mt-1 font-medium text-ink">{project.stack}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm text-mute">Live demo</dt>
                  <dd className="mt-1">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="link-arrow break-all">
                      {project.liveLabel} ↗
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>

        <div className="wrap mt-14">
          <Reveal>
            <Collage image={project.hero} alt={`${project.name} app screens`} accent={project.accent} priority />
          </Reveal>
        </div>
      </header>

      <div className="wrap mt-24 sm:mt-32">
        <Reveal>
          <p className="t-title max-w-4xl text-[clamp(1.6rem,3.2vw,2.5rem)] text-ink">{project.about}</p>
        </Reveal>
      </div>

      <section aria-labelledby="features-heading" className="py-24 sm:py-32">
        <div className="wrap">
          <SectionHead id="features-heading" lines={["What it", <Em key="d">does.</Em>]} />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.highlights.map((h, i) => (
              <Reveal as="li" key={h.title} delay={(i % 3) * 0.08}>
                <Glass interactive className="flex h-full flex-col gap-5 p-7 [--radius:2rem]">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white">
                    <Check />
                  </span>
                  <div>
                    <h3 className="t-head text-[1.25rem] text-ink">{h.title}</h3>
                    <p className="mt-2 text-ink-2">{h.text}</p>
                  </div>
                </Glass>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ScreenTour project={project} />

      <section aria-label={`${project.name}: ${project.heroAltLabel.toLowerCase()}`} className="py-24 sm:py-32">
        <div className="wrap">
          <Parallax amount={40}>
            <Collage image={project.heroAlt} alt={`${project.name}: ${project.heroAltLabel.toLowerCase()}`} accent={project.accent} />
          </Parallax>
          <Reveal className="mt-14 flex flex-col items-center gap-5 text-center">
            <p className="t-lead max-w-xl">Try it yourself. The demo runs in your browser with sample data, no download needed.</p>
            <ButtonLink href={project.liveUrl} target="_blank" rel="noopener noreferrer" variant="glass">
              Open {project.liveLabel}
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
