import { services } from "@/data/services";
import { DisplayLines, Label } from "@/components/ui/Type";
import { ServiceRow } from "@/components/sections/ServiceRow";

export function Services() {
  return (
    <section aria-labelledby="services-heading" className="bg-paper py-24 sm:py-36">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Label index="02">Services</Label>
            <DisplayLines id="services-heading" className="mt-8 text-[3.4rem] text-ink sm:text-[6rem] xl:text-[8rem]" lines={["What we do"]} />
          </div>
          <p className="max-w-sm text-[1.0625rem] leading-relaxed text-grey lg:col-span-4 lg:justify-self-end" data-reveal="">
            Three ways we help: build the website, look after it, and keep making it better.
          </p>
        </div>
        <ul className="mt-16 border-t border-ink">
          {services.map((s, i) => (
            <ServiceRow key={s.number} {...s} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
