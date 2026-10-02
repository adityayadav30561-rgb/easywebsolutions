import { Check } from "./Check";
import { cn } from "@/lib/cn";

type Cell = boolean | string;

/** Side-by-side comparison on glass. Only facts from each plan's feature list. */
export function CompareTable({ caption, columns, rows, dark }: { caption: string; columns: { name: string; price: string }[]; rows: { label: string; values: Cell[] }[]; dark?: boolean }) {
  return (
    <div className={cn("glass overflow-hidden [--radius:2rem]", dark && "glass-dark")}>
      <div className="overflow-x-auto" data-lenis-prevent>
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              <th scope="col" className={cn("w-[34%] px-6 py-6 text-sm font-medium", dark ? "text-white/55" : "text-mute")}>
                Compare
              </th>
              {columns.map((c) => (
                <th key={c.name} scope="col" className="px-6 py-6">
                  <span className={cn("block text-lg font-semibold tracking-[-0.02em]", dark ? "text-white" : "text-ink")}>{c.name}</span>
                  <span className={cn("text-sm font-normal", dark ? "text-white/55" : "text-mute")}>{c.price}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className={cn("border-t", dark ? "border-white/10" : "border-hairline")}>
                <th scope="row" className={cn("px-6 py-4 text-[0.95rem] font-medium", dark ? "text-white/85" : "text-ink")}>
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td key={i} className={cn("px-6 py-4 text-[0.95rem]", dark ? "text-white/75" : "text-ink-2")}>
                    {v === true ? (
                      <>
                        <Check className={dark ? "text-violet-300" : "text-violet-600"} />
                        <span className="sr-only">Included</span>
                      </>
                    ) : v === false ? (
                      <>
                        <span aria-hidden="true" className={dark ? "text-white/25" : "text-mute-2"}>—</span>
                        <span className="sr-only">Not included</span>
                      </>
                    ) : v === "—" ? (
                      <>
                        <span aria-hidden="true" className={dark ? "text-white/25" : "text-mute-2"}>—</span>
                        <span className="sr-only">Not included</span>
                      </>
                    ) : (
                      v
                    )}
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
