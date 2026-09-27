import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { Hero } from "@/components/sections/home/Hero";
import { ValueStrip } from "@/components/sections/home/ValueStrip";
import { ProblemSolution } from "@/components/sections/home/ProblemSolution";
import { ServicesSection } from "@/components/sections/home/ServicesSection";
import { FeaturedWork } from "@/components/sections/home/FeaturedWork";
import { CarePreview, PricingPreview, ProcessSection, WhyUs } from "@/components/sections/home/HomeSections";
import { Testimonial } from "@/components/sections/Testimonial";
import { CTASection } from "@/components/sections/CTASection";

export const metadata = pageMetadata({
  title: "EasyWebSolns — Websites That Work For You",
  description:
    "Website design, development and ongoing care for growing businesses. Fast, modern websites that build trust, generate enquiries and help you grow online.",
  path: "/",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  logo: `${site.url}${site.logo.src}`,
  slogan: "Websites that work for you",
  description: site.description,
  email: site.contact.email,
  sameAs: site.social.map((s) => s.href),
  serviceType: ["Website design", "Website development", "Website optimization", "Website maintenance"],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <ValueStrip />
      <ProblemSolution />
      <ServicesSection />
      <FeaturedWork />
      <ProcessSection />
      <PricingPreview />
      <CarePreview />
      <WhyUs />
      <Testimonial />
      <div className="pt-24 sm:pt-32">
        <CTASection
          title={
            <>
              Ready to build a website <br className="hidden sm:block" />
              <span className="text-gradient-light">that works for you?</span>
            </>
          }
          description="Tell us about your business and what you want your website to achieve."
          primary={{ label: "Start a Project", href: "/contact" }}
          secondary={{ label: "View Our Work", href: "/work" }}
        />
      </div>
    </>
  );
}
