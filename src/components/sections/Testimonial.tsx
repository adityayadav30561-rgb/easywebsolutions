import { testimonials } from "@/data/testimonials";
import { Icon } from "@/components/ui/Icon";

export function Testimonial() {
  const t = testimonials[0];
  if (!t) return null;
  return (
    <section className="border-y border-line bg-paper py-24 sm:py-32" aria-labelledby="testimonial-heading">
      <div className="container-site">
        <h2 id="testimonial-heading" className="sr-only">
          What clients say
        </h2>
        <figure className="relative mx-auto max-w-4xl text-center" data-reveal="">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-300 to-violet-600 text-white shadow-[0_12px_30px_-12px_rgb(124_58_237/0.7)]">
            <Icon name="quote" size={24} />
          </span>
          <blockquote className="mt-10">
            <p className="font-display text-[1.75rem] leading-[1.25] font-medium tracking-[-0.02em] text-ink sm:text-4xl lg:text-[2.75rem]">
              “{t.quote}”
            </p>
          </blockquote>
          <figcaption className="mt-10 flex items-center justify-center gap-4">
            <span aria-hidden="true" className="h-px w-8 bg-violet-300" />
            <span className="text-left">
              <span className="block text-[0.9375rem] font-semibold text-ink">{t.name}</span>
              <span className="block text-sm text-slate">{t.company}</span>
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-violet-300" />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
