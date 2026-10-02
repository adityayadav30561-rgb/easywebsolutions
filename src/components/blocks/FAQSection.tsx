import type { Faq } from "@/data/faqs";
import { FAQList } from "./FAQ";
import { Em, SectionHead } from "./SectionHead";

/** Questions with FAQPage structured data. */
export function FAQSection({ faqs, id = "faq" }: { faqs: Faq[]; id?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  return (
    <section aria-labelledby={`${id}-heading`} className="py-24 sm:py-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHead id={`${id}-heading`} align="left" lines={["Good", <Em key="q">questions.</Em>]} lead="Straight answers to what people usually ask before starting." />
        </div>
        <div className="lg:col-span-8">
          <FAQList faqs={faqs} />
        </div>
      </div>
    </section>
  );
}
