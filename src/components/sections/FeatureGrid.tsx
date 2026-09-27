import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Item = { title: string; description: string; icon: IconName };

/** Icon feature grid used for "What's included" and "Why care matters". */
export function FeatureGrid({ items, columns = 4 }: { items: Item[]; columns?: 3 | 4 }) {
  return (
    <ul
      className={cn(
        "grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2",
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
      )}
    >
      {items.map((item, i) => (
        <li
          key={item.title}
          className="group bg-white p-7 transition-colors duration-500 hover:bg-mist sm:p-8"
          data-reveal="fade"
          style={{ ["--reveal-delay" as string]: `${(i % columns) * 70}ms` }}
        >
          <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-white text-violet-600 shadow-[var(--shadow-card)] transition-transform duration-500 ease-[var(--ease-premium)] group-hover:-translate-y-0.5">
            <Icon name={item.icon} size={20} />
          </span>
          <h3 className="mt-6 text-lg font-semibold">{item.title}</h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate">{item.description}</p>
        </li>
      ))}
    </ul>
  );
}
