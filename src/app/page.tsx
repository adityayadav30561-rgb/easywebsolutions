import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Statement } from "@/components/home/Statement";
import { ServiceStack } from "@/components/home/ServiceStack";
import { WorkReel } from "@/components/home/WorkReel";
import { Process } from "@/components/home/Process";
import { Pricing } from "@/components/home/Pricing";
import { CareBand } from "@/components/home/CareBand";
import { Why } from "@/components/home/Why";
import { CTA } from "@/components/blocks/CTA";
import { Em } from "@/components/blocks/SectionHead";

export const metadata = pageMetadata({
  title: "EasyWebSolns — Websites & Apps That Work For You",
  description:
    "Website design and development, mobile apps for iOS, Android and the web, SEO and ongoing care for growing businesses.",
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
  serviceType: ["Website design", "Website development", "Mobile app development", "Search engine optimization", "Website maintenance"],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Marquee />
      <Statement />
      <ServiceStack />
      <WorkReel />
      <Process />
      <Pricing />
      <CareBand />
      <Why />
      <CTA
        lines={["Let's build something", <Em key="w">that works.</Em>]}
        lead="Tell us what you're building, what isn't working, or what you'd like to improve."
        secondary={{ label: "See our work", href: "/work" }}
      />
    </>
  );
}
