import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";

type Props = {
  title: ReactNode;
  description?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  eyebrow?: string;
};

/** Large dark navy call-to-action with a restrained purple radial glow. */
export function CTASection({ title, description, primary, secondary, eyebrow }: Props) {
  return (
    <section className="px-3 pb-3 sm:px-4 sm:pb-4" aria-labelledby="cta-heading">
      <div className="noise relative isolate overflow-hidden rounded-[28px] bg-ink px-5 py-20 text-center sm:py-28 lg:py-32">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgb(139_92_246/0.32),transparent_70%),radial-gradient(ellipse_45%_40%_at_50%_110%,rgb(124_58_237/0.18),transparent_70%)]"
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent" />
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="absolute top-1/2 left-1/2 -z-10 w-[min(900px,160vw)] -translate-x-1/2 -translate-y-1/2 text-white/[0.035]"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="200" cy="200" r="120" />
          <circle cx="200" cy="200" r="160" />
          <circle cx="200" cy="200" r="198" />
        </svg>

        <div className="mx-auto max-w-3xl" data-reveal="">
          {eyebrow && <p className="eyebrow mb-6 !text-violet-300">{eyebrow}</p>}
          <h2 id="cta-heading" className="text-[2.25rem] leading-[1.08] font-semibold text-white sm:text-5xl lg:text-[3.75rem]">
            {title}
          </h2>
          {description && <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">{description}</p>}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={primary.href} variant="light" size="lg" arrow className="w-full sm:w-auto">
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} variant="outline-light" size="lg" className="w-full sm:w-auto">
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
