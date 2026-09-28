import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, StatusBadge, Table } from "@/components/ui";
import { requireClient } from "@/lib/context";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Quotations" };

export default async function PortalQuotes() {
  const ctx = await requireClient("portal:quotes");
  const quotes = await ctx.db.quotation.findMany({ where: { clientId: ctx.clientId, status: { not: "DRAFT" } }, orderBy: { issueDate: "desc" } });
  return (
    <>
      <PageHeader title="Quotations" />
      <Table head={["Number", "Title", "Total", "Status", "Valid until"]}>
        {quotes.map((q) => (
          <tr key={q.id}>
            <td>
              <Link href={`/portal/quotes/${q.id}`} className="link">
                {q.number}
              </Link>
            </td>
            <td>{q.title}</td>
            <td className="tabular-nums">{formatMoney(q.total, q.currencyCode)}</td>
            <td>
              <StatusBadge status={q.status} />
            </td>
            <td className="text-grey">{formatDate(q.validUntil)}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
