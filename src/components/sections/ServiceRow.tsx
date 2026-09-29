import Link from "next/link";
import type { CSSProperties } from "react";
import type { PhotoKey } from "@/data/images";
import { Photo } from "@/components/ui/Photo";

type Props = {
  number: string;
  title: string;
  description: string;
  items: readonly string[];
  photo: PhotoKey;
  cta: { label: string; href: string };
  index: number;
};

/** Editorial service row: number, title, copy, capabilities, image. The whole row is the link. */
export function ServiceRow({ number, title, description, items, photo, cta, index }: Props) {
  return (
    <li className="group relative border-b border-line" data-reveal="" style={{ "--d": `${index * 80}ms` } as CSSProperties}>
      {/* Accent line appears on hover */}
      <span aria-hidden="true" className="signal absolute top-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-700 ease-[var(--ease-cinema)] group-hover:scale-x-100" />
      <div className="grid gap-8 py-10 transition-transform duration-700 ease-[var(--ease-premium)] group-hover:translate-x-2 sm:py-14 lg:grid-cols-12 lg:gap-8">
        <p className="font-display text-sm font-semibold text-grey transition-colors duration-500 group-hover:text-violet-600 lg:col-span-1 lg:pt-3">
          {number}
        </p>
        <div className="lg:col-span-5">
          <h3 className="display text-[2.4rem] text-ink sm:text-[3.4rem] xl:text-[4rem]">
            <Link href={cta.href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {title}
            </Link>
          </h3>
          <span className="label mt-8 inline-flex items-center gap-3 text-ink">
            {cta.label}
            <svg aria-hidden="true" viewBox="0 0 20 16" className="h-3 w-4 text-violet-600 transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-2" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M0 8h18M12 2l6 6-6 6" />
            </svg>
          </span>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[1rem] leading-relaxed text-ink-700">{description}</p>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5" aria-label={`${title} capabilities`}>
            {items.map((item) => (
              <li key={item} className="text-[0.8125rem] text-grey before:mr-2 before:text-violet-600 before:content-['/']">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden lg:col-span-3">
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-premium)] group-hover:scale-[1.07]">
            <Photo name={photo} alt="" sizes="(min-width: 1024px) 24vw, 100vw" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-violet/0 mix-blend-multiply transition-colors duration-700 group-hover:bg-violet/30" />
        </div>
      </div>
      {/* Keyboard focus ring for the stretched link */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 ring-violet group-has-[a:focus-visible]:ring-2" />
    </li>
  );
}
