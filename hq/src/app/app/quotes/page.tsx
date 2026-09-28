import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, StatusBadge, Table, Tabs } from "@/components/ui";
import type { QuotationStatus } from "@/generated/prisma/enums";
import { requireStaff } from "@/lib/context";
import { formatMoney } from "@/lib/money";
import { formatDate, daysFromNow } from "@/lib/utils";

export const metadata: Metadata = { title: "Quotations" };

const STATUSES: QuotationStatus[] = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED", "INVOICED"];

export default async function Quotes({ searchParams }: PageProps<"/app/quotes">) {
  const ctx = await requireStaff("quotes:read");
  const sp = await searchParams;
  const status = STATUSES.find((s) => s === sp.status);

  // Sent quotes past their validity date are expired automatically.
  await ctx.db.quotation.updateMany({ where: { status: "SENT", validUntil: { lt: daysFromNow(-1) } }, data: { status: "EXPIRED" } });

  const quotes = await ctx.db.quotation.findMany({
    where: status ? { status } : {},
    include: { client: { select: { name: true } }, lead: { select: { title: true, companyName: true } } },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return (
    <>
      <PageHeader
        title="Quotations"
        actions={
          ctx.can("quotes:write") && (
            <Link href="/app/quotes/new" className="btn-primary">
              New quotation
            </Link>
          )
        }
      />
      <Tabs current={status ?? "ALL"} items={[{ key: "ALL", label: "All", href: "/app/quotes" }, ...STATUSES.map((s) => ({ key: s, label: s.charAt(0) + s.slice(1).toLowerCase(), href: `/app/quotes?status=${s}` }))]} />
      <Table head={["Number", "Title", "For", "Total", "Status", "Issued", "Valid until"]}>
        {quotes.map((q) => (
          <tr key={q.id}>
            <td>
              <Link href={`/app/quotes/${q.id}`} className="link">
                {q.number}
              </Link>
            </td>
            <td className="max-w-xs truncate">{q.title}</td>
            <td className="text-grey">{q.client?.name ?? (q.lead ? `${q.lead.companyName ?? q.lead.title} (lead)` : "—")}</td>
            <td className="tabular-nums">{formatMoney(q.total, q.currencyCode)}</td>
            <td>
              <StatusBadge status={q.status} />
            </td>
            <td className="text-grey">{formatDate(q.issueDate)}</td>
            <td className="text-grey">{formatDate(q.validUntil)}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
