import { Glass } from "@/components/glass/Glass";
import { GlassPhoto } from "@/components/blocks/GlassPhoto";
import { Em, SectionHead } from "@/components/blocks/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";

const reasons = [
  { word: "Custom", text: "Designed around your business, your services and your customers. Never squeezed into a theme." },
  { word: "Fast", text: "Lean code and optimised images, so pages load quickly on real phones and real connections." },
  { word: "Clear", text: "Plain language, clear structure and an obvious next step on every page." },
  { word: "Looked after", text: "We stay after launch. Care plans keep the website secure, current and improving." },
];

/** Bento of reasons with a parallax photograph. */
export function Why() {
  return (
    <section aria-labelledby="why-heading" className="py-24 sm:py-36">
      <div className="wrap">
        <SectionHead id="why-heading" lines={["Built around your business.", <Em key="t">Not a template.</Em>]} />
        <div className="mt-16 grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="h-[26rem] overflow-hidden rounded-[2.25rem] lg:h-full lg:min-h-[36rem]">
              <Parallax amount={40} className="-mt-[7%] h-[115%]">
                <GlassPhoto name="whyTeam" sizes="(min-width: 1024px) 50vw, 100vw" className="h-full" />
              </Parallax>
            </div>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2">
            {reasons.map((r, i) => (
              <Reveal as="li" key={r.word} delay={i * 0.08}>
                <Glass interactive className="flex h-full flex-col justify-end p-7 sm:min-h-[17rem] sm:p-8 [--radius:2rem]">
                  <h3 className="t-title text-[2rem] text-ink">{r.word}</h3>
                  <p className="mt-3 text-ink-2">{r.text}</p>
                </Glass>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
