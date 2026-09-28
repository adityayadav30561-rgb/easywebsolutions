import { ActionForm } from "@/components/forms";
import { Field } from "@/components/ui";
import type { OrgContext } from "@/lib/context";
import { clientOptions } from "@/lib/lookups";
import { formatMoney } from "@/lib/money";
import { toDateInput } from "@/lib/utils";
import { saveSubscription } from "./actions";

type SubValues = { id: string; clientId: string; planId: string; websiteUrl: string | null; startDate: Date; billingDay: number; status: string; notes: string | null };

export async function SubscriptionForm({ ctx, sub, clientId }: { ctx: OrgContext; sub?: SubValues; clientId?: string }) {
  const [clients, plans] = await Promise.all([
    clientOptions(ctx),
    ctx.db.carePlan.findMany({ where: { OR: [{ isActive: true }, { id: sub?.planId ?? "" }] }, orderBy: { sort: "asc" } }),
  ]);
  const today = new Date();
  return (
    <ActionForm action={saveSubscription.bind(null, sub?.id ?? null)} submit={sub ? "Save" : "Start subscription"} className="grid gap-4 sm:grid-cols-2">
      <Field label="Client">
        <select name="clientId" className="input" required defaultValue={sub?.clientId ?? clientId ?? ""}>
          <option value="" disabled>
            Choose…
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Plan">
        <select name="planId" className="input" required defaultValue={sub?.planId ?? plans[0]?.id}>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {formatMoney(p.price, ctx.org.currencyCode)}/month{Number(p.includedHours) ? `, ${Number(p.includedHours)}h updates` : ""}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Website covered" className="sm:col-span-2">
        <input name="websiteUrl" className="input" placeholder="https://" defaultValue={sub?.websiteUrl ?? ""} />
      </Field>
      <Field label="Start date">
        <input name="startDate" type="date" className="input" defaultValue={toDateInput(sub?.startDate ?? today)} />
      </Field>
      <Field label="Billing day of month" hint="1–28. Hours reset and the plan renews on this day.">
        <input name="billingDay" type="number" min="1" max="28" className="input" defaultValue={sub?.billingDay ?? Math.min(28, today.getUTCDate())} />
      </Field>
      {sub && (
        <Field label="Status">
          <select name="status" className="input" defaultValue={sub.status}>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </Field>
      )}
      <Field label="Notes" className="sm:col-span-2">
        <textarea name="notes" rows={3} className="input" defaultValue={sub?.notes ?? ""} />
      </Field>
    </ActionForm>
  );
}
