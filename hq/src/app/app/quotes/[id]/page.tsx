import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentView } from "@/components/DocumentView";
import { ActionButton, CopyButton, PrintButton } from "@/components/forms";
import { Card, PageHeader, StatusBadge } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { quoteDoc } from "@/lib/docdata";
import { appUrl } from "@/lib/guard";
import { formatMoney } from "@/lib/money";
import { formatDateTime } from "@/lib/utils";
import { convertToInvoice, deleteQuote, duplicateQuote, regenerateLink, setQuoteStatus } from "../actions";

export const metadata: Metadata = { title: "Quotation" };

export default async function QuotePage({ params }: PageProps<"/app/quotes/[id]">) {
  const ctx = await requireStaff("quotes:read");
  const { id } = await params;
  const q = await ctx.db.quotation.findUnique({
    where: { id },
    include: { items: { orderBy: { sort: "asc" } }, client: true, lead: true, paymentTerm: true, invoices: { orderBy: { createdAt: "asc" } } },
  });
  if (!q) notFound();

  const write = ctx.can("quotes:write");
  const link = await appUrl(`/q/${q.publicToken}`);
  const editable = write && !["ACCEPTED", "INVOICED"].includes(q.status);
  const canInvoice = write && ctx.can("invoices:write") && q.clientId && ["SENT", "ACCEPTED"].includes(q.status);

  return (
    <>
      <PageHeader
        title={q.number}
        description={
          <span className="flex items-center gap-2">
            <StatusBadge status={q.status} /> {q.title}
          </span>
        }
        back={{ href: "/app/quotes", label: "Quotations" }}
        actions={
          <>
            {editable && (
              <Link href={`/app/quotes/${id}/edit`} className="btn-secondary">
                Edit
              </Link>
            )}
            <PrintButton />
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <DocumentView d={quoteDoc(q, ctx.org)} />

        <div className="no-print space-y-6">
          <Card title="Send & track">
            <div className="space-y-3 text-sm">
              {ctx.can("quotes:send") ? (
                <>
                  <p className="text-grey">Share this link with the client — they can view, download and accept the quotation online.</p>
                  <div className="flex flex-wrap gap-2">
                    <CopyButton text={link} />
                    <a href={link} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm">
                      Open
                    </a>
                    <ActionButton action={regenerateLink.bind(null, id)} className="btn-ghost btn-sm" confirm="Create a new link? The current one will stop working.">
                      New link
                    </ActionButton>
                  </div>
                  {q.status === "DRAFT" && (
                    <ActionButton action={setQuoteStatus.bind(null, id, "SENT")} className="btn-primary w-full">
                      Mark as sent
                    </ActionButton>
                  )}
                </>
              ) : (
                <p className="text-grey">You can view this quotation but not send it.</p>
              )}
              {q.sentAt && <p className="text-xs text-grey">Sent {formatDateTime(q.sentAt)}</p>}
              {q.acceptedAt && (
                <p className="rounded-lg bg-green-50 p-3 text-xs text-green-800">
                  Accepted {formatDateTime(q.acceptedAt)}
                  {q.acceptedByName ? ` by ${q.acceptedByName}` : ""}
                </p>
              )}
              {q.rejectedAt && <p className="text-xs text-red-700">Declined {formatDateTime(q.rejectedAt)}</p>}
            </div>
          </Card>

          {write && q.status !== "INVOICED" && (
            <Card title="Outcome">
              <div className="flex flex-wrap gap-2">
                {q.status !== "ACCEPTED" && (
                  <ActionButton action={setQuoteStatus.bind(null, id, "ACCEPTED")} className="btn-secondary btn-sm">
                    Mark accepted
                  </ActionButton>
                )}
                {q.status !== "REJECTED" && (
                  <ActionButton action={setQuoteStatus.bind(null, id, "REJECTED")} className="btn-secondary btn-sm">
                    Mark declined
                  </ActionButton>
                )}
                {q.status !== "DRAFT" && (
                  <ActionButton action={setQuoteStatus.bind(null, id, "DRAFT")} className="btn-ghost btn-sm">
                    Back to draft
                  </ActionButton>
                )}
              </div>
            </Card>
          )}

          {ctx.can("invoices:read") && (
            <Card title="Invoicing">
              {!q.clientId && <p className="text-sm text-grey">This quotation is for a lead. Convert the lead to a client to invoice it.</p>}
              {canInvoice && (
                <div className="flex flex-col gap-2">
                  <ActionButton action={convertToInvoice.bind(null, id, "full")} className="btn-primary w-full">
                    {q.invoices.length ? "Invoice remaining balance" : "Convert to invoice"}
                  </ActionButton>
                  {q.invoices.length === 0 && (
                    <ActionButton action={convertToInvoice.bind(null, id, "deposit")} className="btn-secondary w-full">
                      Invoice {q.paymentTerm?.depositPercent || 50}% deposit
                    </ActionButton>
                  )}
                </div>
              )}
              {q.invoices.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-sm">
                  {q.invoices.map((i) => (
                    <li key={i.id} className="flex items-center justify-between">
                      <Link href={`/app/invoices/${i.id}`} className="link">
                        {i.number}
                      </Link>
                      <span className="text-grey">{formatMoney(i.total, i.currencyCode)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}

          <Card title="More">
            <p className="mb-3 text-sm">
              For:{" "}
              {q.client ? (
                <Link className="link" href={`/app/clients/${q.client.id}`}>
                  {q.client.name}
                </Link>
              ) : q.lead ? (
                <Link className="link" href={`/app/leads/${q.lead.id}`}>
                  {q.lead.title} (lead)
                </Link>
              ) : (
                "—"
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {write && (
                <ActionButton action={duplicateQuote.bind(null, id)} className="btn-secondary btn-sm">
                  Duplicate
                </ActionButton>
              )}
              {write && q.invoices.length === 0 && (
                <ActionButton action={deleteQuote.bind(null, id)} className="btn-danger btn-sm" confirm="Delete this quotation?">
                  Delete
                </ActionButton>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
