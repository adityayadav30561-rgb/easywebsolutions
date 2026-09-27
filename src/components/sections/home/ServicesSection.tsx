import { services } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/sections/ServiceCard";

export function ServicesSection() {
  return (
    <section className="relative bg-mist py-24 sm:py-32" aria-labelledby="services-heading">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading id="services-heading" eyebrow="01 — Services" title="What we build." />
          <p className="max-w-md text-base leading-relaxed text-slate lg:text-right" data-reveal="">
            From the first launch to steady improvement, everything your website needs to keep working for your business.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.number} {...s} index={i} className="md:last:col-span-2 lg:last:col-span-1" />
          ))}
        </div>
      </div>
    </section>
  );
}
