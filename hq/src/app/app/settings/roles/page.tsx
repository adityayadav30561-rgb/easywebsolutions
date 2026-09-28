import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm } from "@/components/forms";
import { Badge, Card, Field, PageHeader, Table } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { createRole } from "./actions";

export const metadata: Metadata = { title: "Roles" };

export default async function Roles() {
  const ctx = await requireStaff("team:manage");
  const roles = await ctx.db.role.findMany({ include: { _count: { select: { memberships: true, permissions: true } } }, orderBy: [{ type: "desc" }, { isSystem: "desc" }, { name: "asc" }] });

  return (
    <>
      <PageHeader title="Roles & permissions" description="Decide exactly what each role can see and do. Staff roles can be limited to records assigned to them." />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Table head={["Role", "Type", "Records", "Permissions", "People"]}>
          {roles.map((r) => (
            <tr key={r.id}>
              <td>
                <Link href={`/app/settings/roles/${r.id}`} className="link">
                  {r.name}
                </Link>{" "}
                {r.isSystem && <Badge>Built-in</Badge>}
                {r.description && <div className="text-xs text-grey">{r.description}</div>}
              </td>
              <td>{r.type === "CLIENT" ? <Badge tone="violet">Client portal</Badge> : <Badge>Staff</Badge>}</td>
              <td className="text-grey">{r.type === "CLIENT" ? "Own company" : r.dataScope === "ALL" ? "All" : "Assigned only"}</td>
              <td>{r._count.permissions}</td>
              <td>{r._count.memberships}</td>
            </tr>
          ))}
        </Table>
        <Card title="New role">
          <ActionForm action={createRole} submit="Create role" className="space-y-3">
            <Field label="Name">
              <input name="name" className="input" required placeholder="e.g. SEO specialist" />
            </Field>
            <Field label="Description">
              <input name="description" className="input" />
            </Field>
            <Field label="Type">
              <select name="type" className="input" defaultValue="STAFF">
                <option value="STAFF">Staff</option>
                <option value="CLIENT">Client portal</option>
              </select>
            </Field>
            <Field label="Copy permissions from">
              <select name="copyFrom" className="input" defaultValue="">
                <option value="">— start empty —</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
