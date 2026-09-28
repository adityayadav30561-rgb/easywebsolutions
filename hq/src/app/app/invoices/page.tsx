import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { PageHeader, Stat, StatusBadge, Table, Tabs } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Invoices" };

const VIEWS: Record<string, { label: string; where: Prisma.InvoiceWhereInput }> = {
  all: { label: "All", where: {} },
  unpaid: { label: "Unpaid", where: { status: { in: ["SENT", "PARTIALLY_PAID"] } } },
  overdue: { label: "Overdue", where: { status: { in: ["SENT", "PARTIALLY_PAID"] }, dueDate: { lt: new Date() } } },
  draft: { label: "Drafts", where: { status: "DRAFT" } },
  paid: { label: "Paid", where: { status: "PAID" } },
  void: { label: "Void", where: { status: "VOID" } },
};

export default async function Invoices({ searchParams }: PageProps<"/app/invoices">) {
  const ctx = await requireStaff("invoices:read");
  const sp = await searchParams;
  const view = typeof sp.view === "string" && sp.view in VIEWS ? sp.view : "all";
  const [invoices, open, month] = await Promise.all([
    ctx.db.invoice.findMany({ where: VIEWS[view].where, include: { client: { select: { name: true } } }, orderBy: { issueDate: "desc" }, take: 500 }),
    ctx.db.invoice.findMany({ where: VIEWS.unpaid.where, select: { total: true, amountPaid: true, dueDate: true } }),
    ctx.db.payment.aggregate({ where: { paidAt: { gte: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)) } }, _sum: { amount: true } }),
  ]);
  const cur = ctx.org.currencyCode;
  const outstanding = open.reduce((s, i) => s + Number(i.total) - Number(i.amountPaid), 0);
  const overdue = open.filter((i) => i.dueDate && i.dueDate < new Date()).reduce((s, i) => s + Number(i.total) - Number(i.amountPaid), 0);

  return (
    <>
      <PageHeader
        title="Invoices"
        actions={
          ctx.can("invoices:write") && (
            <Link href="/app/invoices/new" className="btn-primary">
              New invoice
            </Link>
          )
        }
      />
      {ctx.can("reports:view") && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Outstanding" value={formatMoney(outstanding, cur)} />
          <Stat label="Overdue" value={formatMoney(overdue, cur)} />
          <Stat label="Received this month" value={formatMoney(month._sum.amount, cur)} />
        </div>
      )}
      <Tabs current={view} items={Object.entries(VIEWS).map(([key, v]) => ({ key, label: v.label, href: `/app/invoices?view=${key}` }))} />
      <Table head={["Number", "Client", "Issued", "Due", "Total", "Balance", "Status"]}>
        {invoices.map((i) => {
          const balance = Number(i.total) - Number(i.amountPaid);
          const late = i.dueDate && i.dueDate < new Date() && ["SENT", "PARTIALLY_PAID"].includes(i.status);
          return (
            <tr key={i.id}>
              <td>
                <Link href={`/app/invoices/${i.id}`} className="link">
                  {i.number}
                </Link>
              </td>
              <td className="text-grey">{i.client.name}</td>
              <td className="text-grey">{formatDate(i.issueDate)}</td>
              <td className={late ? "font-medium text-red-700" : "text-grey"}>{formatDate(i.dueDate)}</td>
              <td className="tabular-nums">{formatMoney(i.total, i.currencyCode)}</td>
              <td className="tabular-nums">{i.status === "VOID" ? "—" : formatMoney(balance, i.currencyCode)}</td>
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
