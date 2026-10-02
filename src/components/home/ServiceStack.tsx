"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { services } from "@/data/services";
import { photos } from "@/data/images";
import { ButtonLink } from "@/components/site/Button";
import { Em, SectionHead } from "@/components/blocks/SectionHead";

function Card({ i, total, progress, s }: { i: number; total: number; progress: MotionValue<number>; s: (typeof services)[number] }) {
  const reduce = useReducedMotion();
  const target = 1 - (total - 1 - i) * 0.045;
  const scale = useTransform(progress, [i / total, 1], [1, target]);
  const dim = useTransform(progress, [i / total, (i + 1) / total], [0, i === total - 1 ? 0 : 0.12]);
  const photo = photos[s.photo];
  return (
    <div className="sticky top-[14svh] h-[78svh] min-h-[34rem]" style={{ paddingTop: `${i * 1.6}rem` }}>
      <motion.article
        style={reduce ? undefined : { scale }}
        className="glass relative mx-auto grid h-full max-h-[44rem] origin-top overflow-hidden p-3 will-change-transform [--radius:2.6rem] md:grid-cols-2"
      >
        <div className="flex flex-col justify-between gap-8 p-6 sm:p-10">
          <div>
            <h3 className="t-title text-[clamp(2.1rem,4.2vw,3.6rem)] text-ink">{s.title}</h3>
            <p className="mt-5 max-w-md text-[1.08rem] leading-relaxed text-ink-2">{s.description}</p>
          </div>
          <div>
            <ul className="flex flex-wrap gap-2">
              {s.items.map((it) => (
                <li key={it} className="rounded-full bg-white/60 px-3.5 py-1.5 text-sm font-medium text-ink-2 shadow-[inset_0_1px_0_rgb(255_255_255)]">
                  {it}
                </li>
              ))}
            </ul>
            <ButtonLink href={s.cta.href} variant="ink" className="mt-8">
              {s.cta.label}
            </ButtonLink>
          </div>
        </div>
        <div className="relative hidden overflow-hidden rounded-[2.1rem] md:block">
          <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 45vw, 0px" placeholder="blur" quality={75} className="object-cover" />
        </div>
        <motion.div aria-hidden="true" style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-[#1d1d1f]" />
      </motion.article>
    </div>
  );
}

/** The three services as glass cards that stack and settle as you scroll. */
export function ServiceStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section aria-labelledby="services-heading" className="pt-16 pb-24 sm:pt-24">
      <div className="wrap">
        <SectionHead
          id="services-heading"
          lines={["Everything your website needs.", <Em key="n">Nothing it doesn&apos;t.</Em>]}
          lead="Three ways we help: build the website, look after it, and keep making it better."
        />
        <div ref={ref} className="mt-16">
          {services.map((s, i) => (
            <Card key={s.title} s={s} i={i} total={services.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
