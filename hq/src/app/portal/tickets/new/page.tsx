import type { Metadata } from "next";
import { ActionForm } from "@/components/forms";
import { Card, Field, PageHeader } from "@/components/ui";
import { requireClient } from "@/lib/context";
import { raiseTicket } from "../../actions";

export const metadata: Metadata = { title: "New request" };

export default async function PortalNewTicket({ searchParams }: PageProps<"/portal/tickets/new">) {
  const ctx = await requireClient("portal:tickets");
  const { projectId } = await searchParams;
  const [projects, subs, categories] = await Promise.all([
    ctx.db.project.findMany({ where: { clientId: ctx.clientId, visibleToClient: true, status: { isClosed: false } }, select: { id: true, name: true } }),
    ctx.has("CARE_PLANS") ? ctx.db.careSubscription.findMany({ where: { clientId: ctx.clientId, status: "ACTIVE" }, include: { plan: true } }) : [],
    ctx.db.ticketCategory.findMany({ where: { isActive: true }, orderBy: { sort: "asc" } }),
  ]);

  return (
    <>
      <PageHeader title="New request" back={{ href: "/portal/tickets", label: "Support requests" }} />
      <Card>
        <ActionForm action={raiseTicket} submit="Send request" className="grid gap-4 sm:grid-cols-2">
          <Field label="What do you need?" className="sm:col-span-2">
            <input name="subject" className="input" required placeholder="e.g. Update our opening hours" />
          </Field>
          <Field label="Type">
            <select name="categoryId" className="input" defaultValue="">
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          {projects.length > 0 && (
            <Field label="Project">
              <select name="projectId" className="input" defaultValue={typeof projectId === "string" ? projectId : ""}>
                <option value="">—</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {subs.length > 0 && (
            <Field label="Care plan" hint="Choose this for changes covered by your plan.">
              <select name="subscriptionId" className="input" defaultValue={subs.length === 1 ? subs[0].id : ""}>
                <option value="">—</option>
                {subs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.plan.name} {s.websiteUrl ? `· ${s.websiteUrl}` : ""}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field label="Details" className="sm:col-span-2" hint="Include page links and the exact text or images to change.">
            <textarea name="description" rows={7} className="input" required />
          </Field>
        </ActionForm>
      </Card>
    </>
  );
}
