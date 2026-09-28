import { ActionForm } from "@/components/forms";
import { Field } from "@/components/ui";
import type { OrgContext } from "@/lib/context";
import { staffOptions } from "@/lib/lookups";
import { saveClient } from "./actions";

type ClientValues = {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  taxId: string | null;
  status: string;
  ownerId: string | null;
  notes: string | null;
};

export async function ClientForm({ ctx, client }: { ctx: OrgContext; client?: ClientValues }) {
  const staff = await staffOptions(ctx);
  const text = (name: keyof ClientValues, label: string, props: Record<string, string> = {}) => (
    <Field label={label}>
      <input name={name} className="input" defaultValue={(client?.[name] as string | null) ?? ""} {...props} />
    </Field>
  );
  return (
    <ActionForm action={saveClient.bind(null, client?.id ?? null)} submit={client ? "Save changes" : "Create client"} className="grid gap-4 sm:grid-cols-2">
      <Field label="Company / client name" className="sm:col-span-2">
        <input name="name" className="input" required defaultValue={client?.name} />
      </Field>
      {text("industry", "Industry")}
      {text("website", "Website", { placeholder: "https://" })}
      {text("email", "Billing email", { type: "email" })}
      {text("phone", "Phone")}
      {text("address", "Address")}
      {text("city", "City")}
      {text("country", "Country")}
      {text("taxId", "Tax / VAT / GST number")}
      <Field label="Status">
        <select name="status" className="input" defaultValue={client?.status ?? "ACTIVE"}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </Field>
      <Field label="Account owner">
        <select name="ownerId" className="input" defaultValue={client?.ownerId ?? ctx.userId}>
          <option value="">—</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Notes" className="sm:col-span-2">
        <textarea name="notes" rows={3} className="input" defaultValue={client?.notes ?? ""} />
      </Field>
    </ActionForm>
  );
}
