import type { ReactNode } from "react";
import type { Project } from "@/data/projects";
import { GlassPhoto } from "@/components/blocks/GlassPhoto";
import { Check } from "@/components/blocks/Check";
import { Glass } from "@/components/glass/Glass";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { MockupWindow } from "@/components/visuals/ProjectMockup";
import { BackToWork } from "./BackToWork";

function Chapter({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal>
      <Glass className="grid gap-6 p-7 sm:p-10 lg:grid-cols-12 lg:gap-10 [--radius:2.25rem]">
        <h2 className="t-title text-[2.2rem] text-ink sm:text-[2.8rem] lg:col-span-4">{title}</h2>
        <div className="text-[1.08rem] leading-relaxed text-ink-2 lg:col-span-8">{children}</div>
      </Glass>
    </Reveal>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <Check className="mt-1.5 text-violet-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Case study for a design concept (a drawn website, not a client project). */
export function ConceptCaseStudy({ project }: { project: Project }) {
  const cs = project.caseStudy;
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
                <div>
                  <dt className="text-sm text-mute">Industry</dt>
                  <dd className="mt-1 font-medium text-ink">{project.industry}</dd>
                </div>
                <div>
                  <dt className="text-sm text-mute">Type</dt>
                  <dd className="mt-1 font-medium text-ink">{project.status === "concept" ? "Design concept" : "Client project"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm text-mute">Services</dt>
                  <dd className="mt-1 font-medium text-ink">{project.services.join(" · ")}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>

        <div className="wrap mt-14">
          <Reveal>
            <div className="relative aspect-[4/5] sm:aspect-[16/9]">
              <GlassPhoto name={project.cover} sizes="(min-width: 1280px) 78rem, 100vw" position={project.coverPosition} priority className="absolute inset-0" />
              <div className="absolute inset-x-[5%] bottom-[-10%] sm:inset-x-[12%]">
                <Parallax amount={60}>
                  <div className="glass p-[1.1%] [--radius:1.6rem]">
                    <MockupWindow project={project} className="overflow-hidden rounded-[1.2rem]" />
                  </div>
                </Parallax>
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="wrap mt-32 space-y-5 pb-24 sm:mt-40">
        <Reveal>
          <p className="t-title max-w-4xl text-[clamp(1.8rem,3.6vw,2.8rem)] text-ink">{project.description}</p>
          {project.status === "concept" && (
            <p className="glass glass-thin mt-8 inline-flex items-center gap-3 px-4 py-3 text-sm text-ink-2 [--radius:1rem]">
              <span aria-hidden="true" className="size-2 rounded-full bg-violet" />
              A design concept that demonstrates our approach. It does not represent a specific client.
            </p>
          )}
        </Reveal>
        <div className="space-y-5 pt-8">
          <Chapter title="Overview">
            <p>{cs.overview}</p>
          </Chapter>
          <Chapter title="The challenge">
            <p>{cs.challenge}</p>
          </Chapter>
          <Chapter title="Approach">
            <Points items={cs.approach} />
          </Chapter>
          <Chapter title="Design direction">
            <p>{cs.designDirection}</p>
          </Chapter>
          <Chapter title="Solution">
            <Points items={cs.solution} />
          </Chapter>
          {cs.results && (
            <Chapter title="Results">
              <p>{cs.results}</p>
            </Chapter>
          )}
        </div>
      </div>
    </article>
  );
}
