import { ActionForm } from "@/components/forms";
import { Field } from "@/components/ui";
import type { OrgContext } from "@/lib/context";
import { staffOptions } from "@/lib/lookups";
import { toDateInput } from "@/lib/utils";
import { saveLead } from "./actions";

type LeadValues = {
  id: string;
  title: string;
  contactName: string | null;
  companyName: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  sourceId: string | null;
  stageId: string;
  value: unknown;
  ownerId: string | null;
  expectedCloseDate: Date | null;
  notes: string | null;
};

export async function LeadForm({ ctx, lead }: { ctx: OrgContext; lead?: LeadValues }) {
  const [stages, sources, staff] = await Promise.all([
    ctx.db.pipelineStage.findMany({ where: { OR: [{ isActive: true }, { id: lead?.stageId ?? "" }] }, orderBy: { sort: "asc" } }),
    ctx.db.leadSource.findMany({ where: { OR: [{ isActive: true }, { id: lead?.sourceId ?? "" }] }, orderBy: { sort: "asc" } }),
    staffOptions(ctx),
  ]);

  return (
    <ActionForm action={saveLead.bind(null, lead?.id ?? null)} submit={lead ? "Save changes" : "Create lead"} className="grid gap-4 sm:grid-cols-2">
      <Field label="Lead title" className="sm:col-span-2">
        <input name="title" className="input" required defaultValue={lead?.title} placeholder="e.g. New website for a dental clinic" />
      </Field>
      <Field label="Contact name">
        <input name="contactName" className="input" defaultValue={lead?.contactName ?? ""} />
      </Field>
      <Field label="Company">
        <input name="companyName" className="input" defaultValue={lead?.companyName ?? ""} />
      </Field>
      <Field label="Email">
        <input name="email" type="email" className="input" defaultValue={lead?.email ?? ""} />
      </Field>
      <Field label="Phone">
        <input name="phone" className="input" defaultValue={lead?.phone ?? ""} />
      </Field>
      <Field label="Current website">
        <input name="website" className="input" defaultValue={lead?.website ?? ""} placeholder="https://" />
      </Field>
      <Field label={`Estimated value (${ctx.org.currencyCode})`}>
        <input name="value" type="number" min="0" step="0.01" className="input" defaultValue={lead?.value != null ? String(lead.value) : ""} />
      </Field>
      <Field label="Stage">
        <select name="stageId" className="input" required defaultValue={lead?.stageId ?? stages[0]?.id}>
          {stages.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Source">
        <select name="sourceId" className="input" defaultValue={lead?.sourceId ?? ""}>
          <option value="">—</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      {!ctx.assignedOnly && (
        <Field label="Owner">
          <select name="ownerId" className="input" defaultValue={lead?.ownerId ?? ctx.userId}>
            <option value="">Unassigned</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Expected close date">
        <input name="expectedCloseDate" type="date" className="input" defaultValue={toDateInput(lead?.expectedCloseDate)} />
      </Field>
      <Field label="Notes" className="sm:col-span-2">
        <textarea name="notes" rows={4} className="input" defaultValue={lead?.notes ?? ""} />
      </Field>
    </ActionForm>
  );
}
