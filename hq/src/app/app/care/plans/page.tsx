import type { Metadata } from "next";
import { ActionForm } from "@/components/forms";
import { Badge, Card, Field, PageHeader } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { formatMoney } from "@/lib/money";
import { savePlan } from "../actions";

export const metadata: Metadata = { title: "Care plan catalogue" };

type Plan = { id: string; name: string; subtitle: string | null; price: unknown; includedHours: unknown; responseTimeHours: number | null; features: string[]; isActive: boolean; sort: number };

function PlanForm({ plan, currency }: { plan?: Plan; currency: string }) {
  return (
    <ActionForm action={savePlan.bind(null, plan?.id ?? null)} submit={plan ? "Save plan" : "Add plan"} submitClassName="btn-secondary btn-sm" className="grid gap-3 sm:grid-cols-2">
      <Field label="Name">
        <input name="name" className="input" required defaultValue={plan?.name} />
      </Field>
      <Field label="Subtitle">
        <input name="subtitle" className="input" defaultValue={plan?.subtitle ?? ""} />
      </Field>
      <Field label={`Price per month (${currency})`}>
        <input name="price" type="number" step="0.01" min="0" className="input" required defaultValue={plan ? String(plan.price) : ""} />
      </Field>
      <Field label="Update hours included / month" hint="0 = no hour allowance">
        <input name="includedHours" type="number" step="0.25" min="0" className="input" defaultValue={plan ? String(plan.includedHours) : "0"} />
      </Field>
      <Field label="Target response time (hours)">
        <input name="responseTimeHours" type="number" min="0" className="input" defaultValue={plan?.responseTimeHours ?? ""} />
      </Field>
      <Field label="Display order">
        <input name="sort" type="number" min="0" className="input" defaultValue={plan?.sort ?? 0} />
      </Field>
      <Field label="Features (one per line)" className="sm:col-span-2">
        <textarea name="features" rows={5} className="input" defaultValue={plan?.features.join("\n") ?? ""} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={plan?.isActive ?? true} /> Available for new subscriptions
      </label>
    </ActionForm>
  );
}

export default async function Plans() {
  const ctx = await requireStaff("careplans:write");
  const plans = await ctx.db.carePlan.findMany({ orderBy: { sort: "asc" }, include: { _count: { select: { subscriptions: { where: { status: "ACTIVE" } } } } } });
  return (
    <>
      <PageHeader title="Care plan catalogue" description="The monthly plans your agency offers. Changes apply to future invoices." back={{ href: "/app/care", label: "Care plans" }} />
      <div className="grid gap-6 lg:grid-cols-2">
        {plans.map((p) => (
          <Card
            key={p.id}
            title={
              <span className="flex items-center gap-2">
                {p.name} <span className="font-normal text-grey">{formatMoney(p.price, ctx.org.currencyCode)}/mo</span>
                {!p.isActive && <Badge>Retired</Badge>}
              </span>
            }
            actions={<span className="text-xs text-grey">{p._count.subscriptions} active</span>}
          >
            <PlanForm plan={p} currency={ctx.org.currencyCode} />
          </Card>
        ))}
        <Card title="New plan">
          <PlanForm currency={ctx.org.currencyCode} />
        </Card>
      </div>
    </>
  );
}
