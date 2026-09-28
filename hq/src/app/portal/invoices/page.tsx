import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, StatusBadge, Table } from "@/components/ui";
import { requireClient } from "@/lib/context";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Invoices" };

export default async function PortalInvoices() {
  const ctx = await requireClient("portal:invoices");
  const invoices = await ctx.db.invoice.findMany({ where: { clientId: ctx.clientId, status: { not: "DRAFT" } }, orderBy: { issueDate: "desc" } });
  return (
    <>
      <PageHeader title="Invoices" />
      <Table head={["Number", "Issued", "Due", "Total", "Balance", "Status"]}>
        {invoices.map((i) => {
          const late = i.dueDate && i.dueDate < new Date() && ["SENT", "PARTIALLY_PAID"].includes(i.status);
          return (
            <tr key={i.id}>
              <td>
                <Link href={`/portal/invoices/${i.id}`} className="link">
                  {i.number}
                </Link>
              </td>
              <td className="text-grey">{formatDate(i.issueDate)}</td>
              <td className="text-grey">{formatDate(i.dueDate)}</td>
              <td className="tabular-nums">{formatMoney(i.total, i.currencyCode)}</td>
              <td className="tabular-nums">{i.status === "VOID" ? "—" : formatMoney(Number(i.total) - Number(i.amountPaid), i.currencyCode)}</td>
              <td>
                <StatusBadge status={late ? "OVERDUE" : i.status} />
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
