import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { Hero } from "@/components/sections/home/Hero";
import { Intro } from "@/components/sections/home/Intro";
import { Services } from "@/components/sections/home/Services";
import { SelectedWork } from "@/components/sections/home/SelectedWork";
import { ProcessJourney } from "@/components/sections/ProcessJourney";
import { Packages } from "@/components/sections/home/Packages";
import { Care } from "@/components/sections/home/Care";
import { Why } from "@/components/sections/home/Why";
import { AboutSplit } from "@/components/sections/home/AboutSplit";
import { Testimonial } from "@/components/sections/Testimonial";
import { CTASection } from "@/components/sections/CTASection";

export const metadata = pageMetadata({
  title: "EasyWebSolns — Websites That Work For You",
  description:
    "Website design, development, optimization and care for growing businesses. Modern websites that make you easier to trust, understand and choose.",
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
      <Intro />
      <Services />
      <SelectedWork />
      <ProcessJourney />
      <Packages />
      <Care />
      <Why />
      <AboutSplit />
      <Testimonial />
      <CTASection
        lines={["Let's build", "something", <span key="w" className="text-violet-300">that works.</span>]}
        description="Tell us what you're building, what isn't working, or what you'd like to improve."
        primary={{ label: "Start a Project", href: "/contact" }}
        secondary={{ label: "View Our Work", href: "/work" }}
      />
    </>
  );
}
