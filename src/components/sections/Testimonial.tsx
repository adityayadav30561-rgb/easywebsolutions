import { testimonials } from "@/data/testimonials";
import { Label } from "@/components/ui/Type";

/**
 * Testimonial slot. Content comes from src/data/testimonials.ts; while it holds
 * placeholders the section says so openly rather than inventing praise.
 */
export function Testimonial() {
  const t = testimonials[0];
  if (!t) return null;
  return (
    <section aria-labelledby="testimonial-heading" className="bg-white py-24 sm:py-36">
      <div className="container-site">
        <div className="flex items-center justify-between border-b border-ink pb-5">
          <h2 id="testimonial-heading">
            <Label as="span" index="09">
              Client words
            </Label>
          </h2>
          {t.placeholder && (
            <span className="label rounded-[4px] border border-dashed border-line-strong px-2 py-1 !text-[0.625rem] text-grey">
              Editable placeholder
            </span>
          )}
        </div>
        <figure className="mt-16 grid gap-10 lg:grid-cols-12" data-reveal="">
          <span aria-hidden="true" className="font-display text-[8rem] leading-[0.7] font-semibold text-violet lg:col-span-2">
            “
          </span>
          <div className="lg:col-span-9">
            <blockquote>
              <p className="font-display text-[2.2rem] leading-[1.1] font-medium tracking-[-0.03em] text-ink sm:text-5xl lg:text-[4rem]">
                {t.quote}
              </p>
            </blockquote>
            <figcaption className="mt-10 flex items-center gap-4">
              <span aria-hidden="true" className="signal h-[2px] w-10" />
              <span>
                <span className="block font-semibold text-ink">{t.name}</span>
                <span className="block text-sm text-grey">{t.company}</span>
              </span>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
