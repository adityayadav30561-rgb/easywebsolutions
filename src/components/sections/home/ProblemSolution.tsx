import { problemSolution } from "@/data/services";
import { Icon } from "@/components/ui/Icon";

export function ProblemSolution() {
  return (
    <section className="py-24 sm:py-32" aria-labelledby="problem-heading">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6" data-reveal="">
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-6 bg-violet-600/50" />
              The first impression
            </p>
            <h2 id="problem-heading" className="text-[2rem] leading-[1.1] font-semibold sm:text-[2.5rem] lg:text-[3rem]">
              Your website is more than a digital brochure.
            </h2>
          </div>
          <p className="self-end text-base leading-relaxed text-slate sm:text-lg lg:col-span-5 lg:col-start-8" data-reveal="">
            Your website is often the first interaction someone has with your business. It should communicate credibility,
            explain what you offer and make it easy for the right customer to take the next step.
          </p>
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-card)]" data-reveal="">
          <div className="hidden grid-cols-[1fr_auto_1fr] border-b border-line bg-mist/70 px-8 py-4 text-xs font-semibold tracking-[0.16em] uppercase md:grid">
            <span className="text-slate">Before</span>
            <span className="w-24" />
            <span className="text-violet-600">After</span>
          </div>
          <ol>
            {problemSolution.map((row) => (
              <li
                key={row.problem}
                className="group grid gap-5 border-b border-line px-6 py-8 last:border-b-0 sm:px-8 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-0 md:py-10"
              >
                <div className="flex gap-4">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-slate-400">
                    <Icon name="x" size={14} />
                  </span>
                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-slate uppercase md:hidden">Before</p>
                    <h3 className="font-display text-lg font-medium text-slate line-through decoration-slate-400/60 decoration-1 sm:text-xl">
                      {row.problem}
                    </h3>
                    <p className="mt-1.5 max-w-sm text-[0.9375rem] leading-relaxed text-slate">{row.problemNote}</p>
                  </div>
                </div>

                <div aria-hidden="true" className="flex items-center justify-start pl-12 md:w-24 md:justify-center md:pl-0">
                  <span className="relative flex h-8 w-px items-center justify-center bg-gradient-to-b from-line-strong to-violet-300 md:h-px md:w-16 md:bg-gradient-to-r">
                    <span className="absolute flex size-7 items-center justify-center rounded-full border border-violet/25 bg-white text-violet-600 shadow-[var(--shadow-card)] transition-transform duration-500 ease-[var(--ease-premium)] group-hover:scale-110">
                      <Icon name="arrow-right" size={14} className="rotate-90 md:rotate-0" />
                    </span>
                  </span>
                </div>

                <div className="flex gap-4 rounded-2xl transition-colors duration-500 md:-my-4 md:p-4 md:group-hover:bg-violet-50/60">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-300 to-violet-600 text-white shadow-[0_6px_16px_-6px_rgb(124_58_237/0.6)]">
                    <Icon name="check" size={15} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-violet-600 uppercase md:hidden">After</p>
                    <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">{row.solution}</h3>
                    <p className="mt-1.5 max-w-sm text-[0.9375rem] leading-relaxed text-slate">{row.solutionNote}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
