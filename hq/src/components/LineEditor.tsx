"use client";

import { useState } from "react";
import { computeLine, computeTotals, formatMoney } from "@/lib/money";

type Line = { serviceItemId?: string | null; description: string; quantity: number; unitPrice: number; discountPct: number; taxRate: number };
type Catalogue = {
  items: { id: string; name: string; category: string | null; unit: string; line: Line }[];
  packages: { id: string; name: string; lines: Line[] }[];
  taxes: { id: string; name: string; rate: number }[];
  defaultTax: number;
};

/**
 * Line-item editor for quotations and invoices. Pick catalogue items or a whole
 * package, or type free lines; totals update live. Submitted as JSON in the
 * `items` field — the server recomputes everything.
 */
export function LineEditor({ catalogue, initial, currency }: { catalogue: Catalogue; initial: Line[]; currency: string }) {
  const blank = (): Line => ({ serviceItemId: null, description: "", quantity: 1, unitPrice: 0, discountPct: 0, taxRate: catalogue.defaultTax });
  const [lines, setLines] = useState<Line[]>(initial.length ? initial : [blank()]);
  const totals = computeTotals(lines);

  const update = (i: number, patch: Partial<Line>) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const add = (l: Line) => setLines((ls) => [...ls.filter((x) => x.description || x.unitPrice), l]);
  const num = (v: string) => (v === "" ? 0 : Number(v));

  return (
    <div>
      <input type="hidden" name="items" value={JSON.stringify(lines)} />

      <div className="mb-3 flex flex-wrap gap-2">
        {catalogue.packages.length > 0 && (
          <select
            className="input w-auto"
            aria-label="Start from a package"
            value=""
            onChange={(e) => {
              const p = catalogue.packages.find((x) => x.id === e.target.value);
              if (p) setLines(p.lines.map((l) => ({ ...l })));
            }}
          >
            <option value="">Start from a package…</option>
            {catalogue.packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
        <select
          className="input w-auto"
          aria-label="Add from catalogue"
          value=""
          onChange={(e) => {
            const it = catalogue.items.find((x) => x.id === e.target.value);
            if (it) add({ ...it.line });
          }}
        >
          <option value="">Add from catalogue…</option>
          {catalogue.items.map((it) => (
            <option key={it.id} value={it.id}>
              {it.category ? `${it.category} · ` : ""}
              {it.name} — {formatMoney(it.line.unitPrice, currency)}/{it.unit}
            </option>
          ))}
        </select>
        <button type="button" className="btn-secondary" onClick={() => setLines((ls) => [...ls, blank()])}>
          + Custom line
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[44rem] text-sm">
          <thead className="bg-zinc-50 text-xs text-grey">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Description</th>
              <th className="w-20 px-2 py-2 text-right font-medium">Qty</th>
              <th className="w-28 px-2 py-2 text-right font-medium">Price</th>
              <th className="w-20 px-2 py-2 text-right font-medium">Disc %</th>
              <th className="w-24 px-2 py-2 text-right font-medium">Tax %</th>
              <th className="w-28 px-3 py-2 text-right font-medium">Amount</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i} className="border-t border-line align-top">
                <td className="px-2 py-2">
                  <textarea
                    className="input min-h-10"
                    rows={1}
                    value={l.description}
                    onChange={(e) => update(i, { description: e.target.value })}
                    aria-label={`Line ${i + 1} description`}
                    required
                  />
                </td>
                <td className="px-1 py-2">
                  <input className="input text-right" type="number" min="0" step="any" value={l.quantity} onChange={(e) => update(i, { quantity: num(e.target.value) })} aria-label="Quantity" />
                </td>
                <td className="px-1 py-2">
                  <input className="input text-right" type="number" min="0" step="0.01" value={l.unitPrice} onChange={(e) => update(i, { unitPrice: num(e.target.value) })} aria-label="Unit price" />
                </td>
                <td className="px-1 py-2">
                  <input className="input text-right" type="number" min="0" max="100" step="any" value={l.discountPct} onChange={(e) => update(i, { discountPct: num(e.target.value) })} aria-label="Discount percent" />
                </td>
                <td className="px-1 py-2">
                  <select className="input text-right" value={String(l.taxRate)} onChange={(e) => update(i, { taxRate: num(e.target.value) })} aria-label="Tax rate">
                    {[...new Map([[l.taxRate, `${l.taxRate}%`], ...catalogue.taxes.map((t) => [t.rate, `${t.name} (${t.rate}%)`] as [number, string])])].map(([rate, label]) => (
                      <option key={rate} value={String(rate)}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3.5 text-right tabular-nums">{formatMoney(computeLine(l).lineTotal, currency)}</td>
                <td className="py-2 pr-2">
                  <button
                    type="button"
                    className="btn-ghost btn-sm"
                    onClick={() => setLines((ls) => (ls.length > 1 ? ls.filter((_, j) => j !== i) : [blank()]))}
                    aria-label={`Remove line ${i + 1}`}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="mt-4 ml-auto w-full max-w-xs space-y-1.5 text-sm">
        <div className="flex justify-between"><dt className="text-grey">Subtotal</dt><dd className="tabular-nums">{formatMoney(totals.subtotal, currency)}</dd></div>
        {totals.discountTotal > 0 && <div className="flex justify-between"><dt className="text-grey">Discount</dt><dd className="tabular-nums">−{formatMoney(totals.discountTotal, currency)}</dd></div>}
        <div className="flex justify-between"><dt className="text-grey">Tax</dt><dd className="tabular-nums">{formatMoney(totals.taxTotal, currency)}</dd></div>
        <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{formatMoney(totals.total, currency)}</dd></div>
      </dl>
    </div>
  );
}
