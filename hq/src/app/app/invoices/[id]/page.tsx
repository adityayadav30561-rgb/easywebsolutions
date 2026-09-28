import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentView } from "@/components/DocumentView";
import { ActionButton, ActionForm, CopyButton, PrintButton } from "@/components/forms";
import { Card, PageHeader, StatusBadge } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { invoiceDoc } from "@/lib/docdata";
import { appUrl } from "@/lib/guard";
import { formatMoney } from "@/lib/money";
import { formatDate, formatDateTime, toDateInput } from "@/lib/utils";
import { deleteInvoice, deletePayment, markSent, recordPayment, regenerateInvoiceLink, voidInvoice } from "../actions";

export const metadata: Metadata = { title: "Invoice" };

export default async function InvoicePage({ params }: PageProps<"/app/invoices/[id]">) {
  const ctx = await requireStaff("invoices:read");
  const { id } = await params;
  const inv = await ctx.db.invoice.findUnique({
    where: { id },
    include: {
      items: { orderBy: { sort: "asc" } },
      client: true,
      quotation: { select: { id: true, number: true } },
      subscription: { select: { id: true, plan: { select: { name: true } } } },
      payments: { orderBy: { paidAt: "desc" } },
    },
  });
  if (!inv) notFound();

  const write = ctx.can("invoices:write");
  const balance = Number(inv.total) - Number(inv.amountPaid);
  const late = inv.dueDate && inv.dueDate < new Date() && ["SENT", "PARTIALLY_PAID"].includes(inv.status);
  const link = await appUrl(`/i/${inv.publicToken}`);

  return (
    <>
      <PageHeader
        title={inv.number}
        description={
          <span className="flex items-center gap-2">
            <StatusBadge status={late ? "OVERDUE" : inv.status} />
            <Link className="link" href={`/app/clients/${inv.clientId}`}>
              {inv.client.name}
            </Link>
          </span>
        }
        back={{ href: "/app/invoices", label: "Invoices" }}
        actions={
          <>
            {write && (inv.status === "DRAFT" || inv.status === "SENT") && (
              <Link href={`/app/invoices/${id}/edit`} className="btn-secondary">
                Edit
              </Link>
            )}
            <PrintButton />
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <DocumentView d={invoiceDoc(inv, ctx.org)} />

        <div className="no-print space-y-6">
          <Card title="Balance">
            <p className="font-display text-3xl font-semibold">{formatMoney(inv.status === "VOID" ? 0 : balance, inv.currencyCode)}</p>
            <p className="mt-1 text-sm text-grey">
              of {formatMoney(inv.total, inv.currencyCode)}
              {inv.dueDate ? ` · due ${formatDate(inv.dueDate)}` : ""}
            </p>
            {inv.quotation && (
              <p className="mt-3 text-sm">
                From quotation{" "}
                <Link className="link" href={`/app/quotes/${inv.quotation.id}`}>
                  {inv.quotation.number}
                </Link>
              </p>
            )}
            {inv.subscription && (
              <p className="mt-3 text-sm">
                Care plan{" "}
                <Link className="link" href={`/app/care/${inv.subscription.id}`}>
                  {inv.subscription.plan.name}
                </Link>
              </p>
            )}
          </Card>

          {write && inv.status !== "VOID" && (
            <Card title="Share">
              <p className="mb-3 text-sm text-grey">Clients can view and download the invoice at this link.</p>
              <div className="flex flex-wrap gap-2">
                <CopyButton text={link} />
                <a href={link} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm">
                  Open
                </a>
                <ActionButton action={regenerateInvoiceLink.bind(null, id)} className="btn-ghost btn-sm" confirm="Create a new link? The current one will stop working.">
                  New link
                </ActionButton>
              </div>
              {inv.status === "DRAFT" ? (
                <ActionButton action={markSent.bind(null, id)} className="btn-primary mt-3 w-full">
                  Mark as sent
                </ActionButton>
              ) : (
                inv.sentAt && <p className="mt-3 text-xs text-grey">Sent {formatDateTime(inv.sentAt)}</p>
              )}
            </Card>
          )}

          <Card title="Payments">
            <ul className="space-y-2 text-sm">
              {inv.payments.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-2">
                  <span>
                    <span className="font-medium">{formatMoney(p.amount, inv.currencyCode)}</span>
                    <span className="block text-xs text-grey">
                      {formatDate(p.paidAt)} · {p.method}
                      {p.reference ? ` · ${p.reference}` : ""}
                    </span>
                  </span>
                  {ctx.can("payments:write") && (
                    <ActionButton action={deletePayment.bind(null, p.id)} className="btn-ghost btn-sm" confirm="Remove this payment?">
                      Remove
                    </ActionButton>
                  )}
                </li>
              ))}
              {inv.payments.length === 0 && <li className="text-grey">No payments recorded.</li>}
            </ul>
            {ctx.can("payments:write") && inv.status !== "VOID" && balance > 0.005 && (
              <ActionForm action={recordPayment.bind(null, id)} reset submit="Record payment" submitClassName="btn-secondary btn-sm" className="mt-4 space-y-2 border-t border-line pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <input name="amount" type="number" step="0.01" min="0.01" className="input" defaultValue={balance.toFixed(2)} aria-label="Amount" required />
                  <input name="paidAt" type="date" className="input" defaultValue={toDateInput(new Date())} aria-label="Date paid" />
                </div>
                <select name="method" className="input" aria-label="Method" defaultValue="Bank transfer">
                  {["Bank transfer", "Card", "UPI", "PayPal", "Stripe", "Cash", "Cheque", "Other"].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <input name="reference" className="input" placeholder="Reference (optional)" aria-label="Reference" />
              </ActionForm>
            )}
          </Card>

          {write && (
            <div className="flex flex-wrap gap-2">
              {inv.status !== "VOID" && inv.status !== "DRAFT" && (
                <ActionButton action={voidInvoice.bind(null, id)} className="btn-danger btn-sm" confirm="Void this invoice? It stays on record but no longer counts.">
                  Void invoice
                </ActionButton>
              )}
              {inv.status === "DRAFT" && (
                <ActionButton action={deleteInvoice.bind(null, id)} className="btn-danger btn-sm" confirm="Delete this draft?">
                  Delete draft
                </ActionButton>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
