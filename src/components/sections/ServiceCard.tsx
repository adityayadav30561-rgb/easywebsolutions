import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Props = {
  number: string;
  title: string;
  description: string;
  items: readonly string[];
  cta: { label: string; href: string };
  index?: number;
  className?: string;
};

export function ServiceCard({ number, title, description, items, cta, index = 0, className }: Props) {
  return (
    <article
      className={cn("card card-hover group relative flex h-full flex-col overflow-hidden p-7 sm:p-8", className)}
      data-reveal=""
      style={{ ["--reveal-delay" as string]: `${index * 90}ms` }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_80%_100%_at_0%_0%,rgb(139_92_246/0.1),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="flex items-start justify-between">
        <span className="font-display text-[3.25rem] leading-none font-semibold tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(124_58_237/0.35)]">
          {number}
        </span>
        <span className="flex size-10 items-center justify-center rounded-full border border-line text-slate transition-all duration-500 ease-[var(--ease-premium)] group-hover:rotate-[-45deg] group-hover:border-violet/30 group-hover:bg-violet-50 group-hover:text-violet-600">
          <Icon name="arrow-right" size={17} />
        </span>
      </div>
      <h3 className="mt-10 text-2xl font-semibold">{title}</h3>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate">{description}</p>

      <ul className="mt-7 flex flex-wrap gap-2 border-t border-line pt-7">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-line bg-paper px-3 py-1.5 text-[0.8125rem] font-medium text-ink-700"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-9">
        <Link
          href={cta.href}
          className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-ink transition-colors hover:text-violet-600 after:absolute after:inset-0 after:content-['']"
        >
          {cta.label}
          <Icon name="arrow-right" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
