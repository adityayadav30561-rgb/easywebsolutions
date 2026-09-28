import { ActionForm } from "@/components/forms";
import { LineEditor } from "@/components/LineEditor";
import { Card, Field } from "@/components/ui";
import type { OrgContext } from "@/lib/context";
import { clientScope } from "@/lib/context";
import { editorCatalogue, type EditorLine } from "@/lib/documents";
import { toDateInput } from "@/lib/utils";
import { saveInvoice } from "./actions";

export async function InvoiceForm({
  ctx,
  inv,
}: {
  ctx: OrgContext;
  inv: { id?: string; clientId: string | null; issueDate: Date; dueDate: Date | null; notes: string | null; lines: EditorLine[] };
}) {
  const [catalogue, clients] = await Promise.all([
    editorCatalogue(ctx),
    ctx.db.client.findMany({ where: { ...clientScope(ctx), OR: [{ status: "ACTIVE" }, { id: inv.clientId ?? "" }] }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return (
    <ActionForm action={saveInvoice.bind(null, inv.id ?? null)} submit={inv.id ? "Save invoice" : "Create invoice"} className="space-y-6">
      <Card title="Details">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Client">
            <select name="clientId" className="input" required defaultValue={inv.clientId ?? ""}>
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
          <Field label="Issue date">
            <input name="issueDate" type="date" className="input" required defaultValue={toDateInput(inv.issueDate)} />
          </Field>
          <Field label="Due date">
            <input name="dueDate" type="date" className="input" defaultValue={toDateInput(inv.dueDate)} />
          </Field>
        </div>
      </Card>
      <Card title="Line items">
        <LineEditor catalogue={catalogue} initial={inv.lines} currency={ctx.org.currencyCode} />
      </Card>
      <Card title="Notes">
        <textarea name="notes" rows={3} className="input" defaultValue={inv.notes ?? ""} aria-label="Notes" placeholder="Payment instructions, bank details, thank-you note…" />
      </Card>
    </ActionForm>
  );
}
