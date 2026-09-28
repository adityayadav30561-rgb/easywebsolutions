import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm } from "@/components/forms";
import { Badge, Card, Field, PageHeader, StatusBadge, Table } from "@/components/ui";
import { ALL_FEATURES } from "@/lib/permissions";
import { requirePlatformAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { createOrganization } from "./actions";

export const metadata: Metadata = { title: "Platform admin" };

export default async function AdminHome() {
  await requirePlatformAdmin();
  const [orgs, currencies] = await Promise.all([
    prisma.organization.findMany({
      include: { features: { where: { enabled: true } }, _count: { select: { memberships: { where: { type: "STAFF" } }, clients: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.currency.findMany({ orderBy: { code: "asc" } }),
  ]);

  return (
    <>
      <PageHeader title="Organisations" description="Each agency is a separate, private workspace. You control which modules each one gets." />
      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <Table head={["Organisation", "Modules", "Staff", "Clients", "Created", "Status"]}>
          {orgs.map((o) => (
            <tr key={o.id}>
              <td>
                <Link href={`/admin/orgs/${o.id}`} className="link">
                  {o.name}
                </Link>
                <div className="text-xs text-grey">{o.slug}</div>
              </td>
              <td>
                <div className="flex max-w-xs flex-wrap gap-1">
                  {o.features.map((f) => (
                    <Badge key={f.feature} tone={f.feature === "CARE_PLANS" ? "violet" : "neutral"}>
                      {ALL_FEATURES.find((x) => x.key === f.feature)?.label}
                    </Badge>
                  ))}
                </div>
              </td>
              <td>{o._count.memberships}</td>
              <td>{o._count.clients}</td>
              <td className="text-grey">{formatDate(o.createdAt)}</td>
              <td>
                <StatusBadge status={o.status} />
              </td>
            </tr>
          ))}
        </Table>

        <Card title="New organisation">
          <ActionForm action={createOrganization} submit="Create organisation" className="space-y-3">
            <Field label="Agency name">
              <input name="name" className="input" required />
            </Field>
            <Field label="Slug" hint="Leave blank to generate from the name.">
              <input name="slug" className="input" pattern="[a-z0-9-]*" />
            </Field>
            <Field label="Currency">
              <select name="currencyCode" className="input" defaultValue="USD">
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Owner email">
              <input name="ownerEmail" type="email" className="input" required />
            </Field>
            <Field label="Owner name" hint="Only needed if they don't have an HQ account yet.">
              <input name="ownerName" className="input" />
            </Field>
            <Field label="Temporary password" hint="For new owners. Ask them to change it after signing in.">
              <input name="ownerPassword" type="text" className="input" autoComplete="off" />
            </Field>
            <fieldset>
              <legend className="label">Modules</legend>
              <div className="space-y-1.5">
                {ALL_FEATURES.map((f) => (
                  <label key={f.key} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="feature" value={f.key} defaultChecked={f.key !== "CARE_PLANS"} /> {f.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
