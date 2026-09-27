import type { Cell } from "@/data/pricing";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Props = {
  caption: string;
  columns: { name: string; price: string }[];
  rows: { label: string; values: readonly Cell[] }[];
  highlight?: number;
};

function Value({ v }: { v: Cell }) {
  if (v === true)
    return (
      <span className="inline-flex size-6 items-center justify-center rounded-full bg-violet-50 text-violet-600">
        <Icon name="check" size={13} strokeWidth={2.4} />
        <span className="sr-only">Included</span>
      </span>
    );
  if (v === false || v === "—")
    return (
      <span className="text-slate-400">
        <span aria-hidden="true">—</span>
        <span className="sr-only">Not included</span>
      </span>
    );
  return <span className="text-sm font-medium text-ink-800">{v}</span>;
}

/**
 * Plan comparison. Scrolls horizontally on narrow screens with the feature
 * column pinned, so every value stays readable.
 */
export function ComparisonTable({ caption, columns, rows, highlight }: Props) {
  return (
    <div className="card relative overflow-hidden !shadow-[var(--shadow-card)]" data-reveal="">
      <div className="relative overflow-x-auto overscroll-x-contain" tabIndex={0} role="region" aria-label={caption}>
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="sticky left-0 z-10 bg-white px-5 py-5 text-xs font-semibold tracking-[0.16em] text-slate uppercase sm:px-7">
                Feature
              </th>
              {columns.map((c, i) => (
                <th
                  key={c.name}
                  scope="col"
                  className={cn("px-4 py-5 text-center align-bottom", i === highlight && "bg-violet-50/70")}
                >
                  <span className="block text-xs font-semibold tracking-[0.16em] text-ink uppercase">{c.name}</span>
                  <span className="mt-1 block font-display text-lg font-semibold text-ink">{c.price}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-line last:border-0">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-white px-5 py-4 text-[0.9375rem] font-medium text-ink-700 sm:px-7"
                >
                  {row.label}
                </th>
                {row.values.map((v, i) => (
                  <td key={i} className={cn("px-4 py-4 text-center", i === highlight && "bg-violet-50/70")}>
                    <Value v={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
