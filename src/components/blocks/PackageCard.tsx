import type { Plan } from "@/data/pricing";
import { Glass } from "@/components/glass/Glass";
import { ButtonLink } from "@/components/site/Button";
import { cn } from "@/lib/cn";
import { Check } from "./Check";

/** Website package: price, summary and the complete, exact feature list. */
export function PackageCard({ plan }: { plan: Plan }) {
  const featured = plan.featured;
  return (
    <div className="relative h-full">
      {featured && (
        <div aria-hidden="true" className="absolute -inset-3 -z-10 rounded-[2.6rem] bg-[conic-gradient(from_180deg_at_50%_50%,#8a6dbc,#6c7cff,#7cc8ff,#ff9ec7,#8a6dbc)] opacity-45 blur-2xl" />
      )}
      <Glass interactive className={cn("flex h-full flex-col p-7 sm:p-9 [--radius:2.25rem]", featured && "ring-1 ring-white/70")}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="t-head text-[1.7rem] text-ink">{plan.name}</h3>
            <p className="mt-1 text-[0.95rem] text-mute">{plan.subtitle}</p>
          </div>
          {featured && <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-white">Most popular</span>}
        </div>
        <p className="mt-8 flex items-baseline gap-2">
          <span className="t-title text-[3.4rem] text-ink">{plan.price}</span>
          <span className="text-mute">{plan.unit}</span>
        </p>
        <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-2">{plan.summary}</p>
        {plan.inherits && <p className="mt-6 text-sm font-semibold text-violet-600">{plan.inherits}</p>}
        <ul className="mt-6 space-y-3 border-t border-hairline pt-6">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-3 text-[0.95rem] text-ink-2">
              <Check className="mt-1 text-violet-600" />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-9">
          <ButtonLink href={plan.cta.href} variant={featured ? "ink" : "glass"} className="w-full">
            {plan.cta.label}
          </ButtonLink>
        </div>
      </Glass>
    </div>
  );
}

/** Care plan on dark glass. */
export function CarePlanCard({ plan }: { plan: Plan }) {
  const featured = plan.featured;
  return (
    <Glass interactive dark className={cn("flex h-full flex-col p-7 sm:p-9 [--radius:2.25rem]", featured && "ring-1 ring-violet-300/50")}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="t-head text-[1.7rem] text-white">{plan.name}</h3>
          <p className="mt-1 text-[0.95rem] text-white/55">{plan.subtitle}</p>
        </div>
        {featured && <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-ink">Most popular</span>}
      </div>
      <p className="mt-8 flex items-baseline gap-2">
        <span className="t-title text-[3.4rem] text-white">{plan.price}</span>
        <span className="text-white/55">{plan.unit}</span>
      </p>
      <p className="mt-4 text-[0.98rem] leading-relaxed text-white/70">{plan.summary}</p>
      {plan.inherits && <p className="mt-6 text-sm font-semibold text-violet-300">{plan.inherits}</p>}
      <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-3 text-[0.95rem] text-white/80">
            <Check className="mt-1 text-violet-300" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-9">
        <ButtonLink href={plan.cta.href} variant={featured ? "light" : "glass-dark"} className="w-full">
          {plan.cta.label}
        </ButtonLink>
      </div>
    </Glass>
  );
}
