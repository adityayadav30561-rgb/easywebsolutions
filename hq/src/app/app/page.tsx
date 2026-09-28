import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, Empty, PageHeader, Stat } from "@/components/ui";
import { careScope, leadScope, projectScope, requireStaff, ticketScope } from "@/lib/context";
import { formatMoney } from "@/lib/money";
import { formatDate, daysFromNow } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const ctx = await requireStaff();
  const { db } = ctx;
  const cur = ctx.org.currencyCode;
  const money = ctx.can("reports:view");

  if (!ctx.can("dashboard:view")) {
    return <PageHeader title={`Welcome, ${ctx.user.name.split(" ")[0]}`} description="Use the menu to get to your work." />;
  }

  const [leads, projects, tickets, quotes, invoices, subs, myTickets, followUps, renewals] = await Promise.all([
    ctx.can("leads:read")
      ? db.lead.aggregate({ where: { ...leadScope(ctx), stage: { kind: "OPEN" } }, _count: true, _sum: { value: true } })
      : null,
    ctx.can("projects:read") ? db.project.count({ where: { ...projectScope(ctx), status: { isClosed: false } } }) : null,
    ctx.can("tickets:read") ? db.ticket.count({ where: { ...ticketScope(ctx), status: { isClosed: false } } }) : null,
    ctx.can("quotes:read") ? db.quotation.aggregate({ where: { status: "SENT" }, _count: true, _sum: { total: true } }) : null,
    ctx.can("invoices:read")
      ? db.invoice.findMany({ where: { status: { in: ["SENT", "PARTIALLY_PAID"] } }, select: { total: true, amountPaid: true, dueDate: true } })
      : null,
    ctx.can("careplans:read")
      ? db.careSubscription.findMany({ where: { ...careScope(ctx), status: "ACTIVE" }, select: { plan: { select: { price: true } } } })
      : null,
    ctx.can("tickets:read")
      ? db.ticket.findMany({
          where: { assigneeId: ctx.userId, status: { isClosed: false } },
          include: { client: { select: { name: true } }, priority: true, status: true },
          orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }],
          take: 6,
        })
      : [],
    db.activity.findMany({ where: { userId: ctx.userId, dueAt: { not: null }, doneAt: null }, orderBy: { dueAt: "asc" }, take: 6 }),
    ctx.can("careplans:read")
      ? db.careSubscription.findMany({
          where: { ...careScope(ctx), status: "ACTIVE", nextBillingDate: { lte: daysFromNow(14) } },
          include: { client: { select: { name: true } }, plan: { select: { name: true, price: true } } },
          orderBy: { nextBillingDate: "asc" },
          take: 6,
        })
      : [],
  ]);

  const outstanding = invoices?.reduce((s, i) => s + Number(i.total) - Number(i.amountPaid), 0) ?? 0;
  const overdue = invoices?.filter((i) => i.dueDate && i.dueDate < new Date()).length ?? 0;
  const mrr = subs?.reduce((s, x) => s + Number(x.plan.price), 0) ?? 0;

  return (
    <>
      <PageHeader title={`Good to see you, ${ctx.user.name.split(" ")[0]}`} description={formatDate(new Date(), { weekday: "long", day: "numeric", month: "long" })} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {leads && <Stat label="Open leads" value={leads._count} hint={money ? `${formatMoney(leads._sum.value, cur)} in pipeline` : undefined} href="/app/leads" />}
        {projects !== null && <Stat label="Active projects" value={projects} href="/app/projects" />}
        {tickets !== null && <Stat label="Open tickets" value={tickets} href="/app/tickets" />}
        {quotes && <Stat label="Quotes awaiting reply" value={quotes._count} hint={money ? formatMoney(quotes._sum.total, cur) : undefined} href="/app/quotes?status=SENT" />}
        {invoices && money && <Stat label="Outstanding" value={formatMoney(outstanding, cur)} hint={overdue ? `${overdue} overdue` : "Nothing overdue"} href="/app/invoices" />}
        {subs && <Stat label="Care subscriptions" value={subs.length} hint={money ? `${formatMoney(mrr, cur)} / month` : undefined} href="/app/care" />}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {ctx.can("tickets:read") && (
          <Card title="Assigned to me" pad={false} actions={<Link href="/app/tickets?mine=1" className="text-xs text-grey hover:text-ink">All →</Link>}>
            {myTickets.length ? (
              <ul className="divide-y divide-zinc-100">
                {myTickets.map((t) => (
                  <li key={t.id}>
                    <Link href={`/app/tickets/${t.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-zinc-50">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{t.subject}</span>
                        <span className="text-xs text-grey">
                          {t.number} · {t.client.name}
                          {t.dueAt ? ` · due ${formatDate(t.dueAt)}` : ""}
                        </span>
                      </span>
                      <Badge color={t.priority.color}>{t.priority.name}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="Nothing assigned to you" />
            )}
          </Card>
        )}

        <Card title="My follow-ups" pad={false}>
          {followUps.length ? (
            <ul className="divide-y divide-zinc-100">
              {followUps.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                  <span className="min-w-0 truncate">{a.content}</span>
                  <Badge tone={a.dueAt! < new Date() ? "red" : "neutral"}>{formatDate(a.dueAt)}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="No follow-ups due">Add one from any lead or client timeline.</Empty>
          )}
        </Card>

        {ctx.can("careplans:read") && (
          <Card title="Care renewals in the next 14 days" pad={false} actions={<Link href="/app/care" className="text-xs text-grey hover:text-ink">All →</Link>}>
            {renewals.length ? (
              <ul className="divide-y divide-zinc-100">
                {renewals.map((s) => (
                  <li key={s.id}>
                    <Link href={`/app/care/${s.id}`} className="flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-zinc-50">
                      <span>
                        <span className="font-medium">{s.client.name}</span> <span className="text-grey">· {s.plan.name}</span>
                      </span>
                      <span className="text-grey">
                        {formatDate(s.nextBillingDate)}
                        {money ? ` · ${formatMoney(s.plan.price, cur)}` : ""}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="No renewals coming up" />
            )}
          </Card>
        )}
      </div>
    </>
  );
}
