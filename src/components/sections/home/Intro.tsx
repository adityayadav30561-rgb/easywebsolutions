import { Photo } from "@/components/ui/Photo";
import { DisplayLines, Label } from "@/components/ui/Type";

const questions = [
  { q: "Is this business credible?", a: "Design, detail and clarity answer before a single word is read." },
  { q: "Is this for me?", a: "Clear structure shows the right visitor they're in the right place." },
  { q: "What do I do next?", a: "An obvious next step turns interest into an enquiry." },
];

/** Magazine spread: tall photograph + oversized statement. */
export function Intro() {
  return (
    <section aria-labelledby="intro-heading" className="bg-white py-24 sm:py-36">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <figure className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Photo name="introLaptopDesk" alt="" sizes="(min-width: 1024px) 38vw, 100vw" reveal parallax={0.08} />
            </div>
            <figcaption className="mt-4 flex justify-between border-t border-line pt-3">
              <span className="label text-grey">Fig. 02</span>
              <span className="label text-grey">First impressions</span>
            </figcaption>
          </figure>

          <div className="flex flex-col lg:col-span-7 lg:pl-8">
            <Label index="01">Introduction</Label>
            <DisplayLines
              id="intro-heading"
              className="mt-8 text-[3rem] text-ink sm:text-[5rem] xl:text-[6.4rem]"
              lines={[
                "Your website",
                "is often the",
                <>
                  first <span className="text-violet-600">sale.</span>
                </>,
              ]}
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-auto lg:pt-16">
              <p className="text-xl leading-snug font-medium text-ink sm:text-[1.375rem]" data-reveal="">
                Before someone calls you, visits your office or sends an enquiry, they may already have judged your
                business online.
              </p>
              <p className="text-[1.0625rem] leading-relaxed text-grey" data-reveal="" style={{ ["--d" as string]: "120ms" }}>
                That judgement happens quickly and quietly. A website that looks current, explains itself and makes the
                next step obvious gives people a reason to choose you over the next result.
              </p>
            </div>
          </div>
        </div>

        {/* Three questions every visitor asks */}
        <div className="mt-24 sm:mt-32">
          <div className="h-px bg-ink" data-reveal="rule" />
          <div className="grid sm:grid-cols-3">
            {questions.map((item, i) => (
              <div
                key={item.q}
                className="border-line py-8 sm:border-l sm:px-8 sm:first:border-l-0 sm:first:pl-0 max-sm:border-b"
                data-reveal=""
                style={{ ["--d" as string]: `${i * 100}ms` }}
              >
                <p className="label text-grey">Visitor question {String(i + 1).padStart(2, "0")}</p>
                <p className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-[1.75rem]">{item.q}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
