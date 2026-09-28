import "server-only";
import { billingPeriod, usage } from "./care";
import type { TenantDb } from "./tenant";

/** Minutes used and change requests raised in each subscription's current billing period. */
export async function currentUsage(db: TenantDb, subs: { id: string; billingDay: number; plan: { includedHours: unknown } }[]) {
  if (!subs.length) return new Map<string, ReturnType<typeof usage> & { requests: number; period: { start: Date; end: Date } }>();
  const since = new Date(Date.now() - 32 * 86_400_000);
  const ids = subs.map((s) => s.id);
  const [logs, tickets] = await Promise.all([
    db.careTimeLog.findMany({ where: { subscriptionId: { in: ids }, workDate: { gte: since } }, select: { subscriptionId: true, workDate: true, minutes: true } }),
    db.ticket.findMany({ where: { subscriptionId: { in: ids }, createdAt: { gte: since } }, select: { subscriptionId: true, createdAt: true } }),
  ]);
  return new Map(
    subs.map((s) => {
      const period = billingPeriod(s.billingDay);
      const inPeriod = (d: Date) => d >= period.start && d < period.end;
      const minutes = logs.filter((l) => l.subscriptionId === s.id && inPeriod(l.workDate)).reduce((t, l) => t + l.minutes, 0);
      const requests = tickets.filter((t) => t.subscriptionId === s.id && inPeriod(t.createdAt)).length;
      return [s.id, { ...usage(minutes, Number(s.plan.includedHours)), requests, period }];
    }),
  );
}
