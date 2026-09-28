import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, Empty, PageHeader, Progress, Stat } from "@/components/ui";
import { requireClient } from "@/lib/context";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Client portal" };

export default async function PortalHome() {
  const ctx = await requireClient();
  const { db, clientId } = ctx;
  const [projects, openTickets, quotes, invoices] = await Promise.all([
    ctx.can("portal:projects") ? db.project.findMany({ where: { clientId, visibleToClient: true, status: { isClosed: false } }, include: { status: true }, orderBy: { updatedAt: "desc" } }) : [],
    ctx.can("portal:tickets") ? db.ticket.count({ where: { clientId, status: { isClosed: false } } }) : null,
    ctx.can("portal:quotes") ? db.quotation.count({ where: { clientId, status: "SENT" } }) : null,
    ctx.can("portal:invoices") ? db.invoice.findMany({ where: { clientId, status: { in: ["SENT", "PARTIALLY_PAID"] } }, select: { total: true, amountPaid: true, currencyCode: true } }) : null,
  ]);
  const due = invoices?.reduce((s, i) => s + Number(i.total) - Number(i.amountPaid), 0) ?? 0;

  return (
    <>
      <PageHeader title={`Hello, ${ctx.user.name.split(" ")[0]}`} description={`Everything ${ctx.org.name} is doing for ${ctx.membership.client?.name}.`} />
      <div className="grid gap-4 sm:grid-cols-3">
        {openTickets !== null && <Stat label="Open requests" value={openTickets} href="/portal/tickets" />}
        {quotes !== null && <Stat label="Quotations to review" value={quotes} href="/portal/quotes" />}
        {invoices && <Stat label="Balance due" value={formatMoney(due, invoices[0]?.currencyCode ?? ctx.org.currencyCode)} href="/portal/invoices" />}
      </div>

      {ctx.can("portal:projects") && (
        <Card title="Active projects" className="mt-6" pad={false}>
          {projects.length ? (
            <ul className="divide-y divide-zinc-100">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link href={`/portal/projects/${p.id}`} className="flex flex-col gap-2 px-5 py-4 hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      <span className="block font-medium">{p.name}</span>
                      <span className="text-xs text-grey">{p.dueDate ? `Target ${formatDate(p.dueDate)}` : p.number}</span>
                    </span>
                    <span className="flex w-full items-center gap-3 sm:w-72">
                      <Badge color={p.status.color}>{p.status.name}</Badge>
                      <Progress value={p.progress} />
                      <span className="text-xs text-grey">{p.progress}%</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="No active projects" />
          )}
        </Card>
      )}

      {ctx.can("portal:tickets") && (
        <div className="mt-6">
          <Link href="/portal/tickets/new" className="btn-primary">
            Request a change or get help
          </Link>
        </div>
      )}
    </>
  );
}
