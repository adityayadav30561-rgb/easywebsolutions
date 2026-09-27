import type { Cell } from "@/data/pricing";
import { cn } from "@/lib/cn";

type Props = {
  caption: string;
  columns: { name: string; price: string }[];
  rows: { label: string; values: readonly Cell[] }[];
  highlight?: number;
  tone?: "light" | "dark";
};

function Value({ v, dark }: { v: Cell; dark: boolean }) {
  if (v === true)
    return (
      <span className="inline-flex items-center justify-center">
        <svg aria-hidden="true" viewBox="0 0 16 16" className={cn("size-4", dark ? "text-violet-300" : "text-violet-600")} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m3 8.5 3.2 3L13 4.5" />
        </svg>
        <span className="sr-only">Included</span>
      </span>
    );
  if (v === false || v === "—")
    return (
      <span className={dark ? "text-white/25" : "text-[#868c97]"}>
        <span aria-hidden="true">—</span>
        <span className="sr-only">Not included</span>
      </span>
    );
  return <span className={cn("text-sm font-medium", dark ? "text-white" : "text-ink")}>{v}</span>;
}

/** Specification-sheet comparison. Scrolls horizontally on narrow screens with the feature column pinned. */
export function ComparisonTable({ caption, columns, rows, highlight, tone = "light" }: Props) {
  const dark = tone === "dark";
  const bg = dark ? "bg-night" : "bg-white";
  return (
    <div className={cn("relative border-t", dark ? "border-white" : "border-ink")} data-reveal="">
      <div className="relative overflow-x-auto overscroll-x-contain" tabIndex={0} role="region" aria-label={caption}>
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className={cn("border-b", dark ? "border-line-dark" : "border-line-strong")}>
              <th scope="col" className={cn("sticky left-0 z-10 py-6 pr-6", bg)}>
                <span className={cn("label", dark ? "text-white/50" : "text-grey")}>Specification</span>
              </th>
              {columns.map((c, i) => (
                <th key={c.name} scope="col" className={cn("px-4 py-6 text-center align-bottom", i === highlight && (dark ? "bg-white/[0.05]" : "bg-violet-50/60"))}>
                  <span className={cn("label block", dark ? "text-white" : "text-ink")}>{c.name}</span>
                  <span className={cn("mt-2 block font-display text-xl font-semibold tracking-[-0.03em]", dark ? "text-white" : "text-ink")}>{c.price}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className={cn("border-b", dark ? "border-line-dark" : "border-line")}>
                <th scope="row" className={cn("sticky left-0 z-10 py-4 pr-6 text-[0.9375rem] font-normal", bg, dark ? "text-white/75" : "text-ink-700")}>
                  {row.label}
                </th>
                {row.values.map((v, i) => (
                  <td key={i} className={cn("px-4 py-4 text-center", i === highlight && (dark ? "bg-white/[0.05]" : "bg-violet-50/60"))}>
                    <Value v={v} dark={dark} />
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
