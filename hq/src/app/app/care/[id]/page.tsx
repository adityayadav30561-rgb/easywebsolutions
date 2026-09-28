import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionButton, ActionForm } from "@/components/forms";
import { Timeline } from "@/components/Timeline";
import { Badge, Card, PageHeader, Progress, StatusBadge, Table, Tabs } from "@/components/ui";
import { billingPeriod, usage } from "@/lib/care";
import { careScope, requireStaff } from "@/lib/context";
import { userNames } from "@/lib/lookups";
import { formatMoney } from "@/lib/money";
import { formatDate, hoursFromMinutes, toDateInput } from "@/lib/utils";
import { addTimeLog, billSubscription, deleteTimeLog } from "../actions";
import { SubscriptionForm } from "../SubscriptionForm";

export const metadata: Metadata = { title: "Care subscription" };

export default async function SubscriptionPage({ params, searchParams }: PageProps<"/app/care/[id]">) {
  const ctx = await requireStaff("careplans:read");
  const { id } = await params;
  const sp = await searchParams;
  const back = Math.min(12, Math.max(0, Number(sp.period ?? 0) || 0));

  const sub = await ctx.db.careSubscription.findFirst({ where: { id, ...careScope(ctx) }, include: { client: true, plan: true } });
  if (!sub) notFound();

  // Billing period `back` months before the current one.
  const now = new Date();
  const ref = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - back, Math.min(now.getUTCDate(), 28)));
  const period = billingPeriod(sub.billingDay, ref);

  const [logs, tickets, invoices] = await Promise.all([
    ctx.db.careTimeLog.findMany({ where: { subscriptionId: id, workDate: { gte: period.start, lt: period.end } }, include: { ticket: { select: { id: true, number: true } } }, orderBy: { workDate: "desc" } }),
    ctx.db.ticket.findMany({ where: { subscriptionId: id }, include: { status: true, category: true, timeLogs: { select: { minutes: true } } }, orderBy: { createdAt: "desc" }, take: 100 }),
    ctx.can("invoices:read") ? ctx.db.invoice.findMany({ where: { subscriptionId: id }, orderBy: { issueDate: "desc" }, take: 24 }) : [],
  ]);
  const names = await userNames(ctx, logs.map((l) => l.userId));
  const minutes = logs.reduce((s, l) => s + l.minutes, 0);
  const u = usage(minutes, Number(sub.plan.includedHours));
  const cur = ctx.org.currencyCode;
  const periodTickets = tickets.filter((t) => t.createdAt >= period.start && t.createdAt < period.end);

  return (
    <>
      <PageHeader
        title={`${sub.client.name} — ${sub.plan.name}`}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge status={sub.status} />
            {formatMoney(sub.plan.price, cur)}/month · bills on day {sub.billingDay} · next bill {formatDate(sub.nextBillingDate)}
            {sub.websiteUrl && (
              <a href={sub.websiteUrl} target="_blank" rel="noopener noreferrer" className="link">
                {sub.websiteUrl}
              </a>
            )}
          </span>
        }
        back={{ href: "/app/care", label: "Care plans" }}
        actions={
          <>
            {ctx.can("tickets:write") && (
              <Link href={`/app/tickets/new?clientId=${sub.clientId}`} className="btn-secondary">
                Log change request
              </Link>
            )}
            {ctx.can("careplans:write") && ctx.can("invoices:write") && sub.status === "ACTIVE" && (
              <ActionButton action={billSubscription.bind(null, id)} className="btn-primary" confirm={`Create an invoice for the period starting ${formatDate(sub.nextBillingDate)}?`}>
                Invoice next period
              </ActionButton>
            )}
          </>
        }
      />

      <Tabs
        current={String(back)}
        items={[0, 1, 2, 3, 4, 5].map((n) => {
          const p = billingPeriod(sub.billingDay, new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - n, Math.min(now.getUTCDate(), 28))));
          return { key: String(n), label: n === 0 ? "This period" : formatDate(p.start, { month: "short", year: "2-digit" }), href: `/app/care/${id}?period=${n}` };
        })}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <p className="text-xs text-grey uppercase">Update hours used</p>
              <p className="mt-2 font-display text-2xl font-semibold">
                <span className={u.over ? "text-red-700" : ""}>{u.usedHours}h</span>
                {u.includedHours > 0 && <span className="text-base font-normal text-grey"> / {u.includedHours}h</span>}
              </p>
              {u.includedHours > 0 && (
                <div className="mt-3">
                  <Progress value={u.pct} over={u.over} />
                </div>
              )}
              {u.over && <p className="mt-2 text-xs text-red-700">Over allowance by {Math.round((u.usedHours - u.includedHours) * 100) / 100}h — consider billing the extra time.</p>}
            </div>
            <div className="card p-5">
              <p className="text-xs text-grey uppercase">Change requests</p>
              <p className="mt-2 font-display text-2xl font-semibold">{periodTickets.length}</p>
              <p className="mt-1 text-xs text-grey">in this period</p>
            </div>
            <div className="card p-5">
              <p className="text-xs text-grey uppercase">Period</p>
              <p className="mt-2 text-sm font-medium">
                {formatDate(period.start)} – {formatDate(new Date(period.end.getTime() - 86_400_000))}
              </p>
              {sub.plan.responseTimeHours && <p className="mt-1 text-xs text-grey">Target response {sub.plan.responseTimeHours}h</p>}
            </div>
          </div>

          <Card title="Time log" pad={false}>
            <Table bare head={["Date", "Work", "Ticket", "By", "Time", ""]} empty={<p className="px-5 py-4 text-sm text-grey">No time logged in this period.</p>}>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="text-grey">{formatDate(l.workDate)}</td>
                  <td>{l.description}</td>
                  <td>
                    {l.ticket ? (
                      <Link href={`/app/tickets/${l.ticket.id}`} className="link">
                        {l.ticket.number}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="text-grey">{l.userId ? names.get(l.userId) : "—"}</td>
                  <td className="tabular-nums">{hoursFromMinutes(l.minutes)}</td>
                  <td className="text-right">
                    {ctx.can("timelogs:write") && (l.userId === ctx.userId || ctx.can("careplans:write")) && (
                      <ActionButton action={deleteTimeLog.bind(null, l.id)} className="btn-ghost btn-sm" confirm="Remove this entry?">
                        ✕<span className="sr-only">Remove</span>
                      </ActionButton>
                    )}
                  </td>
                </tr>
              ))}
            </Table>
            {ctx.can("timelogs:write") && (
              <ActionForm action={addTimeLog.bind(null, id)} reset submit="Log time" submitClassName="btn-secondary btn-sm" className="grid gap-2 border-t border-line p-4 sm:grid-cols-[7rem_9rem_1fr_12rem]">
                <input name="minutes" type="number" min="1" className="input" placeholder="Minutes" required aria-label="Minutes" />
                <input name="workDate" type="date" className="input" defaultValue={toDateInput(new Date())} aria-label="Date" />
                <input name="description" className="input" placeholder="What was done" required aria-label="Description" />
                <select name="ticketId" className="input" aria-label="Ticket" defaultValue="">
                  <option value="">No ticket</option>
                  {tickets
                    .filter((t) => !t.status.isClosed)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.number} {t.subject.slice(0, 30)}
                      </option>
                    ))}
                </select>
              </ActionForm>
            )}
          </Card>

          <Card title="Change-request log" pad={false}>
            <Table bare head={["Ticket", "Category", "Raised", "Status", "Time spent"]} empty={<p className="px-5 py-4 text-sm text-grey">No change requests yet.</p>}>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link href={`/app/tickets/${t.id}`} className="link">
                      {t.subject}
                    </Link>
                    <div className="text-xs text-grey">{t.number}</div>
                  </td>
                  <td className="text-grey">{t.category?.name ?? "—"}</td>
                  <td className="text-grey">{formatDate(t.createdAt)}</td>
                  <td>
                    <Badge color={t.status.color}>{t.status.name}</Badge>
                  </td>
                  <td className="tabular-nums">{hoursFromMinutes(t.timeLogs.reduce((s, l) => s + l.minutes, 0))}</td>
                </tr>
              ))}
            </Table>
          </Card>

          <Timeline ctx={ctx} entityType="CARE_SUBSCRIPTION" entityId={id} canWrite={ctx.can("careplans:write")} />
        </div>

        <div className="space-y-6">
          <Card title="Plan includes">
            <ul className="space-y-1.5 text-sm">
              {sub.plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-violet-600" aria-hidden="true">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </Card>
          {ctx.can("invoices:read") && (
            <Card title="Billing history" pad={false}>
              {invoices.length ? (
                <ul className="divide-y divide-zinc-100">
                  {invoices.map((i) => (
                    <li key={i.id}>
                      <Link href={`/app/invoices/${i.id}`} className="flex items-center justify-between px-5 py-2.5 text-sm hover:bg-zinc-50">
                        <span>
                          {i.number} <span className="text-grey">· {formatDate(i.issueDate)}</span>
                        </span>
                        <StatusBadge status={i.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-4 text-sm text-grey">No invoices yet.</p>
              )}
            </Card>
          )}
          {ctx.can("careplans:write") && (
            <Card title="Subscription">
              <SubscriptionForm ctx={ctx} sub={sub} />
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
