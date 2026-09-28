import { ActionForm } from "@/components/forms";
import { LineEditor } from "@/components/LineEditor";
import { Card, Field } from "@/components/ui";
import type { OrgContext } from "@/lib/context";
import { clientScope, leadScope } from "@/lib/context";
import { editorCatalogue, type EditorLine } from "@/lib/documents";
import { toDateInput } from "@/lib/utils";
import { saveQuote } from "./actions";

export type QuoteDefaults = {
  id?: string;
  title: string;
  clientId: string | null;
  leadId: string | null;
  paymentTermId: string | null;
  packageId: string | null;
  validUntil: Date | null;
  notes: string | null;
  terms: string | null;
  lines: EditorLine[];
};

export async function QuoteForm({ ctx, q }: { ctx: OrgContext; q: QuoteDefaults }) {
  const [catalogue, clients, leads, terms] = await Promise.all([
    editorCatalogue(ctx),
    ctx.db.client.findMany({ where: { ...clientScope(ctx), OR: [{ status: "ACTIVE" }, { id: q.clientId ?? "" }] }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    ctx.can("leads:read")
      ? ctx.db.lead.findMany({ where: { ...leadScope(ctx), convertedClientId: null, OR: [{ stage: { kind: "OPEN" } }, { id: q.leadId ?? "" }] }, select: { id: true, title: true, companyName: true }, orderBy: { updatedAt: "desc" } })
      : [],
    ctx.db.paymentTerm.findMany({ where: { OR: [{ isActive: true }, { id: q.paymentTermId ?? "" }] }, orderBy: { dueDays: "asc" } }),
  ]);
  const recipient = q.clientId ? `c:${q.clientId}` : q.leadId ? `l:${q.leadId}` : "";

  return (
    <ActionForm action={saveQuote.bind(null, q.id ?? null)} submit={q.id ? "Save quotation" : "Create quotation"} className="space-y-6">
      <Card title="Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" className="sm:col-span-2">
            <input name="title" className="input" required defaultValue={q.title} placeholder="e.g. Professional website for Harbour Physio" />
          </Field>
          <Field label="Prepared for" hint="A client, or an open lead (the quote moves to the client when the lead is converted).">
            <RecipientSelect recipient={recipient} clients={clients} leads={leads} />
          </Field>
          <Field label="Valid until">
            <input name="validUntil" type="date" className="input" defaultValue={toDateInput(q.validUntil)} />
          </Field>
          <Field label="Payment terms">
            <select name="paymentTermId" className="input" defaultValue={q.paymentTermId ?? terms.find((t) => t.isDefault)?.id ?? ""}>
              <option value="">—</option>
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>
          <input type="hidden" name="packageId" value={q.packageId ?? ""} />
        </div>
      </Card>

      <Card title="Line items">
        <LineEditor catalogue={catalogue} initial={q.lines} currency={ctx.org.currencyCode} />
      </Card>

      <Card title="Notes & terms">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Notes to client">
            <textarea name="notes" rows={4} className="input" defaultValue={q.notes ?? ""} />
          </Field>
          <Field label="Terms">
            <textarea name="terms" rows={4} className="input" defaultValue={q.terms ?? ""} />
          </Field>
        </div>
      </Card>
    </ActionForm>
  );
}

function RecipientSelect({ recipient, clients, leads }: { recipient: string; clients: { id: string; name: string }[]; leads: { id: string; title: string; companyName: string | null }[] }) {
  return (
    <>
      <select name="clientId" className="input" defaultValue={recipient.startsWith("c:") ? recipient.slice(2) : ""} aria-label="Client">
        <option value="">— Client —</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {leads.length > 0 && (
        <select name="leadId" className="input mt-2" defaultValue={recipient.startsWith("l:") ? recipient.slice(2) : ""} aria-label="Or a lead">
          <option value="">— or a lead —</option>
          {leads.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
              {l.companyName ? ` (${l.companyName})` : ""}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
