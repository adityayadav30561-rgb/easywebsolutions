import type { Faq } from "@/data/faqs";
import { DisplayLines, Label } from "@/components/ui/Type";
import { ButtonLink } from "@/components/ui/Button";
import { FAQ } from "./FAQ";

/** FAQ block with FAQPage structured data. */
export function FAQSection({ index, items }: { index: string; items: Faq[] }) {
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
    <section className="bg-white py-24 sm:py-36" aria-labelledby="faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Label index={index}>Questions</Label>
            <DisplayLines id="faq-heading" className="mt-8 text-[3rem] text-ink sm:text-[4.5rem]" lines={["Asked", "& answered."]} />
            <p className="mt-8 max-w-xs text-[1rem] leading-relaxed text-grey" data-reveal="">
              Something we haven&apos;t covered? Ask us directly — we&apos;ll give you a straight answer.
            </p>
            <div className="mt-8" data-reveal="">
              <ButtonLink href="/contact" variant="link">
                Ask a Question
              </ButtonLink>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8" data-reveal="">
          <FAQ items={items} />
        </div>
      </div>
    </section>
  );
}
