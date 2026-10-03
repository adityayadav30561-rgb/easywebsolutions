import { appProjects } from "@/data/app-projects";
import { Em, SectionHead } from "@/components/blocks/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { AppCard } from "./AppCard";

/** The apps we've built: the first full width, the rest side by side. */
export function AppsShowcase() {
  return (
    <section id="apps" aria-labelledby="apps-heading" className="scroll-mt-28 py-16 sm:py-24">
      <div className="wrap">
        <SectionHead id="apps-heading" lines={["Apps we've", <Em key="b">built.</Em>]} lead="Mobile apps for iOS, Android and the web. Each one has a live demo you can open in your browser." />
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {appProjects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i === 0 ? 0 : (i - 1) * 0.08} className={i === 0 ? "md:col-span-2" : undefined}>
              <AppCard
                project={p}
                priority={i === 0}
                sizes={i === 0 ? "(min-width: 1280px) 78rem, 100vw" : "(min-width: 768px) 46vw, 92vw"}
                className={i === 0 ? "aspect-[4/5] sm:aspect-[7/4]" : "aspect-[4/5] sm:aspect-[5/4]"}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
