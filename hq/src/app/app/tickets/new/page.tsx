import type { Metadata } from "next";
import { ActionForm } from "@/components/forms";
import { Card, Field, PageHeader } from "@/components/ui";
import { clientScope, projectScope, requireStaff } from "@/lib/context";
import { clientOptions, staffOptions } from "@/lib/lookups";
import { createStaffTicket } from "../actions";

export const metadata: Metadata = { title: "New ticket" };

export default async function NewTicket({ searchParams }: PageProps<"/app/tickets/new">) {
  const ctx = await requireStaff("tickets:write");
  const sp = await searchParams;
  const clientId = typeof sp.clientId === "string" ? sp.clientId : "";
  const projectId = typeof sp.projectId === "string" ? sp.projectId : "";
  const care = ctx.has("CARE_PLANS");

  const [clients, projects, subs, priorities, categories, staff] = await Promise.all([
    clientOptions(ctx),
    ctx.db.project.findMany({ where: { ...projectScope(ctx), status: { isClosed: false } }, select: { id: true, name: true, number: true, client: { select: { name: true } } }, orderBy: { name: "asc" } }),
    care
      ? ctx.db.careSubscription.findMany({ where: { status: "ACTIVE", client: clientScope(ctx) }, select: { id: true, websiteUrl: true, plan: { select: { name: true } }, client: { select: { name: true } } } })
      : [],
    ctx.db.ticketPriority.findMany({ where: { isActive: true }, orderBy: { sort: "asc" } }),
    ctx.db.ticketCategory.findMany({ where: { isActive: true }, orderBy: { sort: "asc" } }),
    staffOptions(ctx),
  ]);
  const defaultPriority = priorities.find((p) => p.isDefault)?.id ?? priorities[0]?.id;

  return (
    <>
      <PageHeader title="New ticket" back={{ href: "/app/tickets", label: "Tickets" }} />
      <Card>
        <ActionForm action={createStaffTicket} submit="Create ticket" className="grid gap-4 sm:grid-cols-2">
          <Field label="Subject" className="sm:col-span-2">
            <input name="subject" className="input" required />
          </Field>
          <Field label="Client">
            <select name="clientId" className="input" required defaultValue={clientId}>
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
          <Field label="Project (optional)" hint="Must belong to the chosen client.">
            <select name="projectId" className="input" defaultValue={projectId}>
              <option value="">—</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.client.name} — {p.name}
                </option>
              ))}
            </select>
          </Field>
          {care && (
            <Field label="Care plan (change request)" hint="Links the ticket to the client's plan so hours count against it.">
              <select name="subscriptionId" className="input" defaultValue="">
                <option value="">—</option>
                {subs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.client.name} — {s.plan.name} {s.websiteUrl ? `(${s.websiteUrl})` : ""}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field label="Priority">
            <select name="priorityId" className="input" defaultValue={defaultPriority}>
              {priorities.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.slaHours ? ` — ${p.slaHours}h SLA` : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select name="categoryId" className="input" defaultValue="">
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          {ctx.can("tickets:assign") && (
            <Field label="Assignee">
              <select name="assigneeId" className="input" defaultValue="">
                <option value="">Unassigned</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field label="Received via">
            <select name="source" className="input" defaultValue="INTERNAL">
              <option value="INTERNAL">Internal</option>
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
              <option value="WHATSAPP">WhatsApp</option>
            </select>
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea name="description" rows={6} className="input" required />
          </Field>
        </ActionForm>
      </Card>
    </>
  );
}
