import type { CSSProperties } from "react";
import type { Plan } from "@/data/pricing";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * Website package as a proposal sheet: document header, scope list with
 * hairlines, investment line. Professional gets a quiet signal, not a banner.
 */
export function PackageSheet({ plan, index, headingLevel: H = "h3" }: { plan: Plan; index: number; headingLevel?: "h2" | "h3" }) {
  const featured = plan.tier === "featured";
  const premium = plan.tier === "premium";
  return (
    <article
      aria-label={`${plan.name} package, ${plan.price}`}
      className={cn(
        "relative flex min-w-0 flex-col border bg-white transition-shadow duration-700",
        featured ? "border-ink shadow-[0_40px_80px_-50px_rgb(9_12_18/0.5)]" : "border-line-strong",
        premium && "bg-paper",
      )}
      data-reveal=""
      style={{ "--d": `${index * 100}ms` } as CSSProperties}
    >
      {featured && <span aria-hidden="true" className="signal absolute inset-x-0 -top-px h-[3px]" />}
      <div className="flex items-center justify-between border-b border-line px-6 py-4 sm:px-8">
        <span className="label text-grey">Proposal {String(index + 1).padStart(2, "0")}</span>
        {featured ? (
          <span className="label rounded-[4px] bg-violet-50 px-2 py-1 !text-[0.625rem] text-violet-700">Most Popular</span>
        ) : (
          <span className="label text-grey">{plan.unit}</span>
        )}
      </div>

      <div className="px-6 pt-8 sm:px-8 sm:pt-10">
        <H className="display text-[2.1rem] text-ink min-[400px]:text-[2.6rem]">{plan.name}</H>
        <p className="mt-4 min-h-[3.2em] text-[0.9375rem] leading-relaxed text-grey">{plan.summary}</p>
        <div className="mt-8 flex items-end justify-between border-y border-ink py-5">
          <span className="label text-grey">Investment</span>
          <span className="font-display text-[2.75rem] leading-none font-semibold tracking-[-0.04em] text-ink">{plan.price}</span>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 sm:px-8">
        <p className="label text-grey">Scope</p>
        <ol className="mt-3">
          {plan.features.map((f, i) => (
            <li key={f} className="flex items-baseline gap-4 border-b border-line py-2.5 text-[0.9375rem] text-ink-700 last:border-0">
              <span className="w-5 shrink-0 font-display text-[0.6875rem] text-grey-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              {f}
            </li>
          ))}
        </ol>
      </div>

      <div className="px-6 pt-6 pb-6 sm:px-8 sm:pb-8">
        <ButtonLink
          href={plan.cta.href}
          variant={featured ? "solid" : "outline"}
          className="w-full"
          aria-label={`${plan.cta.label} with the ${plan.name} package`}
        >
          {plan.cta.label}
        </ButtonLink>
      </div>
    </article>
  );
}

/** Care plan on a dark surface: fine borders, no floating card chrome. */
export function CarePlanCard({ plan, index, headingLevel: H = "h3" }: { plan: Plan; index: number; headingLevel?: "h2" | "h3" }) {
  const featured = plan.tier === "featured";
  return (
    <article
      aria-label={`${plan.name} care plan, ${plan.price} per month`}
      className={cn(
        "relative flex flex-col border p-6 backdrop-blur-sm sm:p-8",
        featured ? "border-violet-300/50 bg-white/[0.07]" : "border-line-dark bg-white/[0.03]",
      )}
      data-reveal=""
      style={{ "--d": `${index * 100}ms` } as CSSProperties}
    >
      {featured && <span aria-hidden="true" className="signal absolute inset-x-0 -top-px h-[2px]" />}
      <div className="flex items-center justify-between">
        <H className="label text-white">{plan.name}</H>
        {featured && <span className="label rounded-[4px] bg-violet/20 px-2 py-1 !text-[0.625rem] text-violet-300">Most Popular</span>}
      </div>
      <p className="mt-2 text-sm text-white/50">{plan.subtitle}</p>
      <p className="mt-8 flex items-baseline gap-2">
        <span className="font-display text-[3.25rem] leading-none font-semibold tracking-[-0.04em] text-white">{plan.price}</span>
        <span className="text-sm text-white/50">{plan.unit}</span>
      </p>
      <div className="my-7 h-px bg-line-dark" />
      {plan.inherits && <p className="label mb-4 text-violet-300">{plan.inherits}</p>}
      <ul className="flex-1 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-3 text-[0.9375rem] leading-snug text-white/80">
            <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-violet-300" />
            {f}
          </li>
        ))}
      </ul>
      <ButtonLink
        href={plan.cta.href}
        variant={featured ? "light" : "outline-light"}
        className="mt-9 w-full"
        aria-label={`${plan.cta.label} care plan`}
      >
        {plan.cta.label}
      </ButtonLink>
    </article>
  );
}
