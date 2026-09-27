import { processSteps } from "@/data/services";

/** Four-step process: horizontal on desktop, vertical on mobile. */
export function ProcessTimeline() {
  return (
    <div className="relative">
      {/* Desktop connecting line */}
      <span aria-hidden="true" className="absolute top-[1.375rem] right-[12.5%] left-[1.375rem] hidden h-px bg-line-strong lg:block">
        <span
          data-reveal="fade"
          className="block h-full bg-gradient-to-r from-violet-600 via-violet-300 to-transparent [--reveal-delay:300ms]"
        />
      </span>

      <ol className="relative grid gap-0 lg:grid-cols-4 lg:gap-8">
      {processSteps.map((step, i) => (
        <li
          key={step.number}
          className="relative grid grid-cols-[2.75rem_1fr] gap-x-5 pb-12 last:pb-0 lg:block lg:pb-0"
          data-reveal=""
          style={{ ["--reveal-delay" as string]: `${i * 120}ms` }}
        >
          {/* Mobile vertical line */}
          {i < processSteps.length - 1 && (
            <span aria-hidden="true" className="absolute top-12 bottom-1 left-[1.375rem] w-px bg-gradient-to-b from-violet-300/70 to-line lg:hidden" />
          )}
          <span className="relative z-10 flex size-11 items-center justify-center rounded-full border border-violet/25 bg-white font-display text-sm font-semibold text-violet-600 shadow-[0_0_0_6px_#fff,var(--shadow-card)]">
            {step.number}
          </span>
          <div className="lg:mt-8">
            <h3 className="text-xl font-semibold lg:text-2xl">{step.title}</h3>
            <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-slate">{step.description}</p>
          </div>
        </li>
      ))}
      </ol>
    </div>
  );
}
