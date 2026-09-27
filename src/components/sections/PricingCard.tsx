import type { Plan } from "@/data/pricing";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Props = {
  plan: Plan;
  compact?: boolean;
  index?: number;
  /** Label for the featured badge */
  featuredLabel?: string;
  headingLevel?: "h2" | "h3";
};

/**
 * Pricing card. Standard = clean white, featured = elevated with a violet
 * hairline and glow, premium = gradient hairline on a soft tinted surface.
 */
export function PricingCard({ plan, compact, index = 0, featuredLabel = "Most Popular", headingLevel: H = "h3" }: Props) {
  const featured = plan.tier === "featured";
  const premium = plan.tier === "premium";

  return (
    <article
      aria-label={`${plan.name} — ${plan.price}${plan.unit === "/month" ? " per month" : ""}`}
      className={cn(
        "relative flex flex-col rounded-[22px] transition-[transform,box-shadow] duration-500 ease-[var(--ease-premium)]",
        compact ? "p-7" : "p-7 sm:p-9",
        featured &&
          "z-10 border border-violet/40 bg-white shadow-[var(--shadow-glow)] hover:-translate-y-1 lg:-my-4 lg:py-11",
        premium && "gradient-border bg-white shadow-[var(--shadow-card)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
        !featured && !premium && "card card-hover",
      )}
      data-reveal=""
      style={{ ["--reveal-delay" as string]: `${index * 90}ms` }}
    >
      {premium && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[22px] bg-[radial-gradient(ellipse_90%_50%_at_100%_0%,rgb(139_92_246/0.08),transparent_70%)]"
        />
      )}
      {featured && (
        <p className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.16em] whitespace-nowrap text-white uppercase shadow-lg">
          <span aria-hidden="true" className="mr-1.5 text-violet-300">
            ★
          </span>
          {featuredLabel}
        </p>
      )}

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <H className="font-sans text-xs font-semibold tracking-[0.18em] text-ink uppercase">{plan.name}</H>
          {premium && (
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-violet-700">
              Premium
            </span>
          )}
        </div>
        <p className="mt-1 text-sm font-medium text-slate">{plan.subtitle}</p>

        <p className="mt-6 flex items-baseline gap-1.5">
          <span className={cn("font-display font-semibold tracking-[-0.03em] text-ink", compact ? "text-4xl" : "text-[2.75rem]")}>
            {plan.price}
          </span>
          <span className="text-sm font-medium text-slate">{plan.unit}</span>
        </p>
        {!compact && <p className="mt-4 text-[0.9375rem] leading-relaxed text-slate">{plan.summary}</p>}
      </div>

      <div className="relative my-7 h-px bg-line" />

      <div className="relative flex-1">
        {plan.inherits && <p className="mb-4 text-sm font-semibold text-ink">{plan.inherits}</p>}
        <ul className="space-y-3">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-3 text-[0.9375rem] leading-snug text-ink-700">
              <span
                className={cn(
                  "mt-px flex size-5 shrink-0 items-center justify-center rounded-full",
                  featured ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-600",
                )}
              >
                <Icon name="check" size={12} strokeWidth={2.4} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      <ButtonLink
        href={plan.cta.href}
        variant={featured ? "primary" : "secondary"}
        arrow
        className="relative mt-9 w-full"
        aria-label={`${plan.cta.label} with the ${plan.name} ${plan.unit === "/month" ? "care plan" : "package"}`}
      >
        {plan.cta.label}
      </ButtonLink>
    </article>
  );
}
