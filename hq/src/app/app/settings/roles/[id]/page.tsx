import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionButton, ActionForm } from "@/components/forms";
import { Badge, Card, Field, PageHeader } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { PERMISSIONS, type PermissionDef } from "@/lib/permissions";
import { deleteRole, saveRole } from "../actions";

export const metadata: Metadata = { title: "Role" };

export default async function RolePage({ params }: PageProps<"/app/settings/roles/[id]">) {
  const ctx = await requireStaff("team:manage");
  const { id } = await params;
  const role = await ctx.db.role.findUnique({ where: { id }, include: { permissions: true, _count: { select: { memberships: true } } } });
  if (!role) notFound();

  const granted = new Set(role.permissions.map((p) => p.permissionKey));
  const locked = role.key === "owner";
  const defs = (PERMISSIONS as readonly PermissionDef[]).filter((p) => !!p.portal === (role.type === "CLIENT"));
  const modules = [...new Set(defs.map((p) => p.module))];

  return (
    <>
      <PageHeader
        title={role.name}
        description={`${role.type === "CLIENT" ? "Client portal role" : "Staff role"} · ${role._count.memberships} ${role._count.memberships === 1 ? "person" : "people"}`}
        back={{ href: "/app/settings/roles", label: "Roles" }}
        actions={
          !role.isSystem && (
            <ActionButton action={deleteRole.bind(null, id)} className="btn-danger btn-sm" confirm={`Delete role "${role.name}"?`}>
              Delete role
            </ActionButton>
          )
        }
      />
      {locked && <p className="mb-4 rounded-lg bg-violet-50 p-3 text-sm text-violet-800">The Owner role always has every permission so an organisation can never lock itself out.</p>}

      <ActionForm action={saveRole.bind(null, id)} submit={locked ? undefined : "Save role"} className="space-y-6">
        <fieldset disabled={locked} className="space-y-6">
          <Card title="Role">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input name="name" className="input" required defaultValue={role.name} />
              </Field>
              <Field label="Description">
                <input name="description" className="input" defaultValue={role.description ?? ""} />
              </Field>
              {role.type === "STAFF" && (
                <Field label="Which records can people with this role see?" className="sm:col-span-2">
                  <select name="dataScope" className="input" defaultValue={role.dataScope}>
                    <option value="ALL">Everything in the organisation</option>
                    <option value="ASSIGNED">Only leads they own, projects they&apos;re on and tickets assigned to them</option>
                  </select>
                </Field>
              )}
            </div>
          </Card>

          <Card title="Permissions" pad={false}>
            <div className="divide-y divide-zinc-100">
              {modules.map((mod) => {
                const perms = defs.filter((p) => p.module === mod);
                const feature = perms[0]?.feature;
                const off = feature && !ctx.has(feature);
                return (
                  <div key={mod} className="grid gap-3 px-5 py-4 sm:grid-cols-[12rem_1fr]">
                    <p className="text-sm font-medium">
                      {mod} {off && <Badge tone="amber">Module off</Badge>}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {perms.map((p) => (
                        <label key={p.key} className="flex items-start gap-2 text-sm">
                          <input type="checkbox" name="perm" value={p.key} defaultChecked={granted.has(p.key)} className="mt-0.5" />
                          <span>
                            {p.label}
                            <span className="block font-mono text-[0.6875rem] text-grey">{p.key}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </fieldset>
      </ActionForm>
    </>
  );
}
