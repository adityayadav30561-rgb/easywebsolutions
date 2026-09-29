import type { CSSProperties } from "react";
import { Photo } from "@/components/ui/Photo";
import { DisplayLines, Label } from "@/components/ui/Type";

const principles = [
  { word: "Custom", text: "Designed around your business, your services and your customers — never squeezed into a theme." },
  { word: "Performance", text: "Lean code and optimised images, so pages load quickly on real phones and real connections." },
  { word: "Clarity", text: "Plain language, clear structure and an obvious next step on every page." },
  { word: "Support", text: "We stay after launch. Care plans keep the website secure, current and improving." },
];

export function Why() {
  return (
    <section aria-labelledby="why-heading" className="relative overflow-hidden bg-white py-24 sm:py-36">
      <div className="container-site">
        <Label index="07">Why EasyWebSolns</Label>
        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          <DisplayLines
            id="why-heading"
            className="text-[3rem] text-ink sm:text-[5.5rem] lg:col-span-8 xl:text-[6.6rem]"
            lines={[
              "Built around",
              "your business.",
              <span key="t" className="text-[#868c97]">
                Not a template.
              </span>,
            ]}
          />
          <div className="relative aspect-[3/4] overflow-hidden lg:col-span-3 lg:col-start-10 lg:mt-24">
            <Photo name="whyTeam" alt="" sizes="(min-width: 1024px) 22vw, 100vw" reveal parallax={0.1} />
          </div>
        </div>

        <ul className="mt-20 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <li
              key={p.word}
              className="group border-line py-8 sm:pr-8 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0 max-lg:border-b"
              data-reveal=""
              style={{ "--d": `${i * 90}ms` } as CSSProperties}
            >
              <p className="display text-[2rem] text-ink transition-colors duration-500 group-hover:text-violet-600 lg:text-[1.7rem] xl:text-[2.1rem]">{p.word}</p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-grey">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
