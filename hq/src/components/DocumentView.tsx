import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";

export type DocData = {
  kind: "Quotation" | "Invoice";
  number: string;
  title?: string | null;
  status: string;
  issueDate: Date;
  secondDateLabel: string;
  secondDate: Date | null;
  currency: string;
  org: { name: string; email: string | null; phone: string | null; website: string | null; address: string | null; country: string | null; taxId: string | null; logoUrl: string | null; brandColor: string };
  to: { name: string; lines: (string | null | undefined)[] };
  items: { description: string; quantity: unknown; unitPrice: unknown; discountPct: unknown; taxRate: unknown; lineTotal: unknown }[];
  subtotal: unknown;
  discountTotal: unknown;
  taxTotal: unknown;
  total: unknown;
  amountPaid?: unknown;
  notes?: string | null;
  terms?: string | null;
};

/** Printable quotation / invoice. Used in the app, the portal and on public links. */
export function DocumentView({ d }: { d: DocData }) {
  const money = (v: unknown) => formatMoney(v, d.currency);
  const balance = d.amountPaid !== undefined ? Number(d.total) - Number(d.amountPaid) : null;
  const hasDiscount = d.items.some((i) => Number(i.discountPct) > 0);
  const hasTax = d.items.some((i) => Number(i.taxRate) > 0);

  return (
    <article className="mx-auto max-w-4xl rounded-xl border border-line bg-white p-6 text-ink sm:p-10 print:border-0 print:p-0">
      <div className="h-1.5 w-full rounded-full" style={{ background: d.org.brandColor }} aria-hidden="true" />
      <header className="mt-8 flex flex-col justify-between gap-6 sm:flex-row">
        <div>
          {d.org.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={d.org.logoUrl} alt={d.org.name} className="max-h-14 max-w-56 object-contain" />
          ) : (
            <p className="font-display text-xl font-semibold">{d.org.name}</p>
          )}
          <div className="mt-3 space-y-0.5 text-xs text-grey">
            {[d.org.address, d.org.country, d.org.email, d.org.phone, d.org.website, d.org.taxId ? `Tax ID: ${d.org.taxId}` : null]
              .filter(Boolean)
              .map((l) => (
                <p key={l}>{l}</p>
              ))}
          </div>
        </div>
        <div className="sm:text-right">
          <p className="font-display text-3xl font-semibold tracking-tight uppercase" style={{ color: d.org.brandColor }}>
            {d.kind}
          </p>
          <p className="mt-1 text-sm font-medium">{d.number}</p>
          <dl className="mt-3 space-y-0.5 text-xs text-grey">
            <div>
              <dt className="inline">Date: </dt>
              <dd className="inline text-ink">{formatDate(d.issueDate)}</dd>
            </div>
            {d.secondDate && (
              <div>
                <dt className="inline">{d.secondDateLabel}: </dt>
                <dd className="inline text-ink">{formatDate(d.secondDate)}</dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium tracking-wide text-grey uppercase">{d.kind === "Invoice" ? "Bill to" : "Prepared for"}</p>
          <p className="mt-1.5 font-medium">{d.to.name}</p>
          {d.to.lines.filter(Boolean).map((l) => (
            <p key={l} className="text-sm text-grey">
              {l}
            </p>
          ))}
        </div>
        {d.title && (
          <div className="sm:text-right">
            <p className="text-xs font-medium tracking-wide text-grey uppercase">Project</p>
            <p className="mt-1.5 font-medium">{d.title}</p>
          </div>
        )}
      </section>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[32rem] text-sm">
          <thead>
            <tr className="border-b-2 text-left text-xs tracking-wide text-grey uppercase" style={{ borderColor: d.org.brandColor }}>
              <th className="py-2 pr-3 font-medium">Description</th>
              <th className="px-3 py-2 text-right font-medium">Qty</th>
              <th className="px-3 py-2 text-right font-medium">Price</th>
              {hasDiscount && <th className="px-3 py-2 text-right font-medium">Disc.</th>}
              {hasTax && <th className="px-3 py-2 text-right font-medium">Tax</th>}
              <th className="py-2 pl-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {d.items.map((i, n) => (
              <tr key={n} className="border-b border-zinc-100 align-top">
                <td className="py-3 pr-3 whitespace-pre-wrap">{i.description}</td>
                <td className="px-3 py-3 text-right tabular-nums">{Number(i.quantity)}</td>
                <td className="px-3 py-3 text-right tabular-nums">{money(i.unitPrice)}</td>
                {hasDiscount && <td className="px-3 py-3 text-right tabular-nums">{Number(i.discountPct) ? `${Number(i.discountPct)}%` : "—"}</td>}
                {hasTax && <td className="px-3 py-3 text-right tabular-nums">{Number(i.taxRate) ? `${Number(i.taxRate)}%` : "—"}</td>}
                <td className="py-3 pl-3 text-right tabular-nums">{money(i.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="mt-6 ml-auto w-full max-w-xs space-y-1.5 text-sm">
        <div className="flex justify-between"><dt className="text-grey">Subtotal</dt><dd className="tabular-nums">{money(d.subtotal)}</dd></div>
        {Number(d.discountTotal) > 0 && <div className="flex justify-between"><dt className="text-grey">Discount</dt><dd className="tabular-nums">−{money(d.discountTotal)}</dd></div>}
        {Number(d.taxTotal) > 0 && <div className="flex justify-between"><dt className="text-grey">Tax</dt><dd className="tabular-nums">{money(d.taxTotal)}</dd></div>}
        <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{money(d.total)}</dd></div>
        {balance !== null && Number(d.amountPaid) > 0 && (
          <>
            <div className="flex justify-between"><dt className="text-grey">Paid</dt><dd className="tabular-nums">−{money(d.amountPaid)}</dd></div>
            <div className="flex justify-between font-semibold"><dt>Balance due</dt><dd className="tabular-nums">{money(balance)}</dd></div>
          </>
        )}
      </dl>

      {(d.notes || d.terms) && (
        <footer className="mt-10 grid gap-6 border-t border-line pt-6 text-sm sm:grid-cols-2">
          {d.notes && (
            <div>
              <p className="text-xs font-medium tracking-wide text-grey uppercase">Notes</p>
              <p className="mt-1.5 whitespace-pre-wrap text-grey">{d.notes}</p>
            </div>
          )}
          {d.terms && (
            <div>
              <p className="text-xs font-medium tracking-wide text-grey uppercase">Terms</p>
              <p className="mt-1.5 whitespace-pre-wrap text-grey">{d.terms}</p>
            </div>
          )}
        </footer>
      )}
    </article>
  );
}
