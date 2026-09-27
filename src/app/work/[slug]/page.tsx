import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getProject, projects } from "@/data/projects";
import { ProjectCover } from "@/components/visuals/ProjectCover";
import { MockupWindow } from "@/components/visuals/ProjectMockup";
import { CTASection } from "@/components/sections/CTASection";
import { Label } from "@/components/ui/Type";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: `${project.name} — Case Study | EasyWebSolns`,
    description: `${project.description} The challenge, approach and design direction.`,
    path: `/work/${project.slug}`,
  });
}

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function Chapter({ no, title, children }: { no: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-ink py-14 lg:grid-cols-12 lg:gap-10 lg:py-20" data-reveal="">
      <div className="lg:col-span-4">
        <p className="label text-violet-600">Chapter {no}</p>
        <h2 className="display mt-4 text-[2.6rem] text-ink sm:text-[3.4rem]">{title}</h2>
      </div>
      <div className="text-lg leading-relaxed text-ink-700 lg:col-span-7 lg:col-start-6">{children}</div>
    </section>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ol className="border-t border-line-strong">
      {items.map((item, i) => (
        <li key={item} className="grid grid-cols-[2.5rem_1fr] border-b border-line-strong py-4 text-[1.0625rem]">
          <span className="font-display text-sm text-grey-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-ink">{item}</span>
        </li>
      ))}
    </ol>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const cs = project.caseStudy;
  const t = project.mockup.theme;

  return (
    <>
      <article>
        <header className="bg-paper pt-32 sm:pt-40">
          <div className="container-site">
            <Link href="/work" className="enter label group inline-flex min-h-11 items-center gap-3 text-grey hover:text-ink" style={d(100)}>
              <svg aria-hidden="true" viewBox="0 0 20 16" className="h-3 w-4 rotate-180 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M0 8h18M12 2l6 6-6 6" />
              </svg>
              All work
            </Link>
            <div className="mt-8 grid gap-10 pb-14 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="enter label text-grey" style={d(150)}>
                  <span className="text-violet-600">Project {String(index + 1).padStart(2, "0")}</span> — {project.industry}
                  {project.status === "concept" && " · Concept"}
                </p>
                <h1 className="display mt-6 text-[3rem] text-ink sm:text-[5.5rem] xl:text-[7rem]">
                  {project.name.split(" ").reduce<string[][]>((acc, w, i) => {
                    if (i % 2 === 0) acc.push([w]);
                    else acc[acc.length - 1].push(w);
                    return acc;
                  }, []).map((words, i) => (
                    <span key={i} className="ln enter-line" style={{ "--i": i, "--d": "200ms" } as CSSProperties}>
                      <span>{words.join(" ")}</span>
                    </span>
                  ))}
                </h1>
              </div>
              <dl className="enter grid grid-cols-2 gap-6 border-t border-ink pt-6 lg:col-span-4" style={d(500)}>
                <div>
                  <dt className="label text-grey">Industry</dt>
                  <dd className="mt-2 text-ink">{project.industry}</dd>
                </div>
                <div>
                  <dt className="label text-grey">Type</dt>
                  <dd className="mt-2 text-ink">{project.status === "concept" ? "Design concept" : "Client project"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="label text-grey">Services</dt>
                  <dd className="mt-2 text-ink">{project.services.join(" · ")}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="settle group relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]" style={d(400)}>
            <ProjectCover project={project} sizes="100vw" frame="wide-right" priority reveal={false} />
          </div>
        </header>

        <div className="container-site bg-white py-20 sm:py-28">
          <p className="max-w-4xl font-display text-[1.75rem] leading-[1.25] font-medium tracking-[-0.02em] text-ink sm:text-[2.4rem]" data-reveal="">
            {project.kicker} {project.description}
          </p>
          {project.status === "concept" && (
            <p className="mt-8 inline-flex items-center gap-3 border border-dashed border-line-strong px-4 py-3 text-sm text-grey">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-violet" />
              A design concept that demonstrates our approach. It does not represent a specific client.
            </p>
          )}

          <div className="mt-20">
            <Chapter no="01" title="Overview">
              <p>{cs.overview}</p>
            </Chapter>
            <Chapter no="02" title="Challenge">
              <p>{cs.challenge}</p>
            </Chapter>
            <Chapter no="03" title="Approach">
              <Points items={cs.approach} />
            </Chapter>
          </div>
        </div>

        {/* Design direction — full-bleed, on the project's own palette */}
        <section data-theme="dark" className="grain relative bg-night py-20 text-white sm:py-28">
          <div className="container-site relative z-[2] grid gap-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5" data-reveal="">
              <Label index="04" tone="dark">
                Design direction
              </Label>
              <p className="mt-8 text-xl leading-relaxed text-white/80">{cs.designDirection}</p>
              <ul className="mt-10 grid grid-cols-4 border-t border-line-dark" aria-label="Colour palette">
                {[t.text, t.accent, t.accentSoft, t.surface].map((c, i) => (
                  <li key={i} className="pt-4 pr-2">
                    <span className="block aspect-square w-full border border-white/10" style={{ background: c }} />
                    <span className="mt-2 block font-mono text-[0.6875rem] text-white/50 uppercase">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="@container lg:col-span-7" data-reveal="" style={d(150)}>
              <MockupWindow project={project} />
            </div>
          </div>
        </section>

        <div className="container-site bg-white py-20 sm:py-28">
          <Chapter no="05" title="Solution">
            <Points items={cs.solution} />
          </Chapter>
          <Chapter no="06" title="Results">
            <p>{cs.results ?? "Results will be added after launch."}</p>
          </Chapter>
        </div>

        {next && next.slug !== project.slug && (
          <Link href={`/work/${next.slug}`} className="group relative block overflow-hidden bg-night">
            <div className="relative aspect-[4/3] sm:aspect-[21/8]">
              <ProjectCover project={next} sizes="100vw" frame="wide-right" reveal={false} />
              <div aria-hidden="true" className="absolute inset-0 bg-night/55 transition-colors duration-700 group-hover:bg-night/35" />
            </div>
            <div className="container-site absolute inset-0 flex flex-col justify-end pb-10 sm:pb-14">
              <p className="label text-white/60">Next project</p>
              <p className="display mt-4 flex items-center gap-6 text-[2.6rem] text-white sm:text-[5rem]">
                {next.name}
                <svg aria-hidden="true" viewBox="0 0 20 16" className="hidden h-8 w-10 shrink-0 text-violet-300 transition-transform duration-500 group-hover:translate-x-3 sm:block" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M0 8h18M12 2l6 6-6 6" />
                </svg>
              </p>
            </div>
          </Link>
        )}
      </article>

      <CTASection
        lines={["Let's build", <span key="y" className="text-violet-300">yours next.</span>]}
        description="Tell us about your business and what you want your website to achieve."
        primary={{ label: "Start a Project", href: "/contact" }}
        secondary={{ label: "View All Work", href: "/work" }}
      />
    </>
  );
}
