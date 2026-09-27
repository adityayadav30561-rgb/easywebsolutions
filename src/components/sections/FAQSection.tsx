import type { Faq } from "@/data/faqs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { FAQ } from "./FAQ";

/** FAQ block with FAQPage structured data. */
export function FAQSection({ eyebrow, items }: { eyebrow: string; items: Faq[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="py-24 sm:py-32" aria-labelledby="faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="faq-heading"
              eyebrow={eyebrow}
              title="Questions, answered."
              description="Can't find what you're looking for? Ask us directly — we're happy to help."
            />
            <div className="mt-8" data-reveal="">
              <ButtonLink href="/contact" variant="secondary" arrow>
                Ask a Question
              </ButtonLink>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6" data-reveal="">
          <FAQ items={items} />
        </div>
      </div>
    </section>
  );
}
