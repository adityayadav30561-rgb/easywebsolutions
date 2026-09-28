import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Progress, Stat, StatusBadge, Table, Tabs } from "@/components/ui";
import { careScope, requireStaff } from "@/lib/context";
import { currentUsage } from "@/lib/care-usage";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Care plans" };

export default async function Care({ searchParams }: PageProps<"/app/care">) {
  const ctx = await requireStaff("careplans:read");
  const sp = await searchParams;
  const planId = typeof sp.plan === "string" ? sp.plan : "";
  const showAll = sp.all === "1";

  const [plans, subs] = await Promise.all([
    ctx.db.carePlan.findMany({ orderBy: { sort: "asc" } }),
    ctx.db.careSubscription.findMany({
      where: { ...careScope(ctx), ...(showAll ? {} : { status: { not: "CANCELLED" } }), ...(planId ? { planId } : {}) },
      include: { client: { select: { name: true } }, plan: true },
      orderBy: { nextBillingDate: "asc" },
    }),
  ]);
  const used = await currentUsage(ctx.db, subs);
  const cur = ctx.org.currencyCode;
  const active = subs.filter((s) => s.status === "ACTIVE");
  const money = ctx.can("reports:view");

  return (
    <>
      <PageHeader
        title="Care plans"
        description="Which clients are on which plan, when they renew, and how many update hours they've used this billing month."
        actions={
          <>
            {ctx.can("careplans:write") && (
              <Link href="/app/care/plans" className="btn-secondary">
                Manage plans
              </Link>
            )}
            {ctx.can("careplans:write") && (
              <Link href="/app/care/new" className="btn-primary">
                Add subscription
              </Link>
            )}
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans
          .filter((p) => p.isActive)
          .map((p) => {
            const n = active.filter((s) => s.planId === p.id).length;
            return (
              <Stat key={p.id} label={p.name} value={n} hint={`${formatMoney(p.price, cur)}/mo${Number(p.includedHours) ? ` · ${Number(p.includedHours)}h included` : ""}${money ? ` · ${formatMoney(n * Number(p.price), cur)}/mo total` : ""}`} href={`/app/care?plan=${p.id}`} />
            );
          })}
      </div>

      <Tabs
        current={planId || (showAll ? "all" : "current")}
        items={[
          { key: "current", label: "Current", href: "/app/care" },
          ...plans.map((p) => ({ key: p.id, label: p.name, href: `/app/care?plan=${p.id}` })),
          { key: "all", label: "Including cancelled", href: "/app/care?all=1" },
        ]}
      />

      <Table head={["Client", "Plan", "Hours this month", "Requests", "Billing day", "Next bill", "Status"]}>
        {subs.map((s) => {
          const u = used.get(s.id)!;
          const hours = Number(s.plan.includedHours);
          return (
            <tr key={s.id}>
              <td>
                <Link href={`/app/care/${s.id}`} className="link">
                  {s.client.name}
                </Link>
                <div className="max-w-56 truncate text-xs text-grey">{s.websiteUrl}</div>
              </td>
              <td>
                {s.plan.name} <span className="text-xs text-grey">{formatMoney(s.plan.price, cur)}</span>
              </td>
              <td className="w-48">
                {hours > 0 ? (
                  <>
                    <div className="mb-1 text-xs">
                      <span className={u.over ? "font-medium text-red-700" : ""}>{u.usedHours}h</span> <span className="text-grey">of {hours}h</span>
                    </div>
                    <Progress value={u.pct} over={u.over} />
                  </>
                ) : (
                  <span className="text-xs text-grey">{u.usedHours ? `${u.usedHours}h (no allowance)` : "Minor changes only"}</span>
                )}
              </td>
              <td>{u.requests}</td>
              <td className="text-grey">{s.billingDay}</td>
              <td className={s.status === "ACTIVE" && s.nextBillingDate < new Date() ? "font-medium text-red-700" : "text-grey"}>{s.status === "ACTIVE" ? formatDate(s.nextBillingDate) : "—"}</td>
              <td>
                <StatusBadge status={s.status} />
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
