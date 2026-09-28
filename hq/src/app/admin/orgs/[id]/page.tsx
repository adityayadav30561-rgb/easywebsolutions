import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/forms";
import { Card, Field, PageHeader, StatusBadge } from "@/components/ui";
import { ALL_FEATURES } from "@/lib/permissions";
import { requirePlatformAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { addOwner, updateOrganization } from "../../actions";

export const metadata: Metadata = { title: "Organisation" };

export default async function AdminOrg({ params }: PageProps<"/admin/orgs/[id]">) {
  await requirePlatformAdmin();
  const { id } = await params;
  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      features: true,
      memberships: { where: { type: "STAFF" }, include: { user: { select: { name: true, email: true, lastLoginAt: true } }, role: { select: { name: true } } } },
      _count: { select: { clients: true, projects: true, tickets: true, invoices: true, careSubs: true } },
    },
  });
  if (!org) notFound();
  const on = new Set(org.features.filter((f) => f.enabled).map((f) => f.feature));

  return (
    <>
      <PageHeader title={org.name} description={<span className="flex items-center gap-2"><StatusBadge status={org.status} /> {org.slug} · since {formatDate(org.createdAt)}</span>} back={{ href: "/admin", label: "Organisations" }} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Subscription">
          <ActionForm action={updateOrganization.bind(null, id)} submit="Save" className="space-y-4">
            <fieldset>
              <legend className="label">Modules</legend>
              <div className="space-y-2">
                {ALL_FEATURES.map((f) => (
                  <label key={f.key} className="flex items-start gap-2 text-sm">
                    <input type="checkbox" name="feature" value={f.key} defaultChecked={on.has(f.key)} className="mt-0.5" />
                    <span>
                      {f.label}
                      <span className="block text-xs text-grey">{f.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Field label="Status">
              <select name="status" className="input" defaultValue={org.status}>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended (nobody can sign in)</option>
              </select>
            </Field>
          </ActionForm>
        </Card>

        <div className="space-y-6">
          <Card title="Usage">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Clients", org._count.clients],
                ["Projects", org._count.projects],
                ["Tickets", org._count.tickets],
                ["Invoices", org._count.invoices],
                ["Care subscriptions", org._count.careSubs],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-grey">{k}</dt>
                  <dd className="font-display text-lg font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-grey">Counts only — the agency&apos;s records stay private to its own team.</p>
          </Card>
          <Card title="Staff">
            <ul className="space-y-2 text-sm">
              {org.memberships.map((m) => (
                <li key={m.id} className="flex justify-between gap-2">
                  <span className="min-w-0 truncate">
                    {m.user.name} <span className="text-grey">· {m.user.email}</span>
                  </span>
                  <span className="text-grey">{m.role.name}</span>
                </li>
              ))}
            </ul>
            <ActionForm action={addOwner.bind(null, id)} reset submit="Make owner" submitClassName="btn-secondary btn-sm" className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
              <input name="email" type="email" className="input flex-1" placeholder="Existing user's email" required aria-label="Email" />
            </ActionForm>
          </Card>
        </div>
      </div>
    </>
  );
}
