import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getProject, projects } from "@/data/projects";
import { Icon } from "@/components/ui/Icon";
import { CTASection } from "@/components/sections/CTASection";
import { ProjectImage } from "@/components/sections/PortfolioCard";

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

function Block({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-12 md:grid-cols-12 md:gap-8 md:py-16" data-reveal="">
      <div className="md:col-span-4">
        <p className="font-display text-sm font-semibold text-violet-600">{index}</p>
        <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h2>
      </div>
      <div className="text-base leading-relaxed text-slate sm:text-lg md:col-span-7 md:col-start-6">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-4">
          <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
            <Icon name="check" size={13} strokeWidth={2.4} />
          </span>
          <span className="text-ink-700">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const cs = project.caseStudy;

  return (
    <>
      <article>
        <header className="relative isolate overflow-hidden pt-32 pb-12 sm:pt-40">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_85%_0%,rgb(139_92_246/0.1),transparent_60%)]"
          />
          <div className="container-site">
            <Link
              href="/work"
              className="hero-in group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-slate transition-colors hover:text-ink"
            >
              <Icon name="arrow-left" size={16} className="transition-transform group-hover:-translate-x-1" />
              All work
            </Link>
            <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="hero-in eyebrow" style={{ ["--hero-delay" as string]: "60ms" }}>
                  {project.industry}
                  {project.status === "concept" && " · Concept project"}
                </p>
                <h1
                  className="hero-in mt-5 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-[3.5rem] lg:text-[4rem]"
                  style={{ ["--hero-delay" as string]: "120ms" }}
                >
                  {project.name}
                </h1>
                <p
                  className="hero-in mt-6 max-w-2xl text-lg leading-relaxed text-slate"
                  style={{ ["--hero-delay" as string]: "180ms" }}
                >
                  {project.description}
                </p>
              </div>
              <dl
                className="hero-in grid grid-cols-2 gap-6 border-t border-line pt-6 lg:col-span-4 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
                style={{ ["--hero-delay" as string]: "240ms" }}
              >
                <div>
                  <dt className="text-xs font-semibold tracking-[0.16em] text-slate uppercase">Industry</dt>
                  <dd className="mt-1.5 font-medium text-ink">{project.industry}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-[0.16em] text-slate uppercase">Services</dt>
                  <dd className="mt-1.5 font-medium text-ink">{project.services.join(", ")}</dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        <div className="container-site">
          <div
            className="hero-in group relative aspect-[4/3] overflow-hidden rounded-[24px] border border-line shadow-[var(--shadow-card)] sm:aspect-[16/9]"
            style={{ ["--hero-delay" as string]: "300ms" }}
          >
            <ProjectImage project={project} sizes="(min-width: 1280px) 1200px, 100vw" priority wide />
          </div>

          {project.status === "concept" && (
            <p className="mt-6 flex items-start gap-3 rounded-2xl border border-violet/15 bg-violet-50/60 px-5 py-4 text-sm leading-relaxed text-ink-700">
              <Icon name="sparkle" size={18} className="mt-0.5 shrink-0 text-violet-600" />
              This is a design concept that demonstrates our approach. It does not represent a specific client.
            </p>
          )}

          <div className="mt-16 mb-24 sm:mb-32">
            <Block index="01" title="Overview">
              <p>{cs.overview}</p>
            </Block>
            <Block index="02" title="Challenge">
              <p>{cs.challenge}</p>
            </Block>
            <Block index="03" title="Approach">
              <List items={cs.approach} />
            </Block>
            <Block index="04" title="Design Direction">
              <p>{cs.designDirection}</p>
              <ul className="mt-8 flex flex-wrap gap-3" aria-label="Colour palette">
                {[project.mockup.theme.text, project.mockup.theme.accent, project.mockup.theme.accentSoft, project.mockup.theme.surface].map(
                  (c) => (
                    <li key={c} className="flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pr-3.5 pl-1.5">
                      <span className="size-7 rounded-full border border-black/5" style={{ background: c }} />
                      <span className="font-mono text-xs text-slate uppercase">{c}</span>
                    </li>
                  ),
                )}
              </ul>
            </Block>
            <Block index="05" title="Solution">
              <List items={cs.solution} />
            </Block>
            <Block index="06" title="Results">
              <p>{cs.results ?? "Results will be added after launch."}</p>
            </Block>
          </div>

          {next && next.slug !== project.slug && (
            <Link
              href={`/work/${next.slug}`}
              className="group mb-24 flex flex-col justify-between gap-6 rounded-[24px] border border-line bg-paper p-8 transition-colors duration-500 hover:border-violet/30 hover:bg-violet-50/50 sm:mb-32 sm:flex-row sm:items-center sm:p-10"
            >
              <span>
                <span className="text-xs font-semibold tracking-[0.16em] text-slate uppercase">Next project</span>
                <span className="mt-2 block font-display text-2xl font-semibold tracking-tight sm:text-3xl">{next.name}</span>
              </span>
              <span className="flex size-14 items-center justify-center rounded-full bg-ink text-white transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-1 group-hover:-rotate-45">
                <Icon name="arrow-right" size={22} />
              </span>
            </Link>
          )}
        </div>
      </article>

      <CTASection
        title="Let's build something like this for you."
        description="Tell us about your business and what you want your website to achieve."
        primary={{ label: "Start a Project", href: "/contact" }}
        secondary={{ label: "View All Work", href: "/work" }}
      />
    </>
  );
}
