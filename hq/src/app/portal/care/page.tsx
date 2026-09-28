import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, Empty, PageHeader, Progress, StatusBadge } from "@/components/ui";
import { currentUsage } from "@/lib/care-usage";
import { requireClient } from "@/lib/context";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Care plan" };

export default async function PortalCare() {
  const ctx = await requireClient("portal:care");
  const subs = await ctx.db.careSubscription.findMany({ where: { clientId: ctx.clientId, status: { not: "CANCELLED" } }, include: { plan: true } });
  const used = await currentUsage(ctx.db, subs);
  const requests = await ctx.db.ticket.findMany({
    where: { clientId: ctx.clientId, subscriptionId: { in: subs.map((s) => s.id) } },
    include: { status: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <>
      <PageHeader title="Your care plan" description="What's included and how much of this month's update time has been used." />
      {subs.length === 0 && (
        <div className="card">
          <Empty title="You're not on a care plan">Ask {ctx.org.name} about keeping your website secure, backed up and up to date.</Empty>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        {subs.map((s) => {
          const u = used.get(s.id)!;
          return (
            <Card
              key={s.id}
              title={
                <span className="flex items-center gap-2">
                  {s.plan.name} <span className="font-normal text-grey">{formatMoney(s.plan.price, ctx.org.currencyCode)}/month</span>
                </span>
              }
              actions={<StatusBadge status={s.status} />}
            >
              {s.websiteUrl && <p className="mb-3 text-sm text-grey">{s.websiteUrl}</p>}
              {u.includedHours > 0 ? (
                <div className="mb-4">
                  <p className="mb-1.5 text-sm">
                    <strong>{u.usedHours}h</strong> of {u.includedHours}h update time used this month
                  </p>
                  <Progress value={u.pct} over={u.over} />
                  <p className="mt-1.5 text-xs text-grey">
                    Resets {formatDate(u.period.end)} · {u.requests} request{u.requests === 1 ? "" : "s"} this month
                  </p>
                </div>
              ) : (
                <p className="mb-4 text-sm text-grey">Minor text and image changes included · {u.requests} request{u.requests === 1 ? "" : "s"} this month</p>
              )}
              <ul className="space-y-1.5 text-sm">
                {s.plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-violet-600" aria-hidden="true">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-grey">Next renewal {formatDate(s.nextBillingDate)}</p>
            </Card>
          );
        })}
      </div>

      {requests.length > 0 && (
        <Card title="Change-request log" className="mt-6" pad={false}>
          <ul className="divide-y divide-zinc-100">
            {requests.map((t) => (
              <li key={t.id}>
                <Link href={`/portal/tickets/${t.id}`} className="flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-zinc-50">
                  <span className="min-w-0 truncate">
                    {t.subject} <span className="text-grey">· {formatDate(t.createdAt)}</span>
                  </span>
                  <Badge color={t.status.color}>{t.status.name}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
