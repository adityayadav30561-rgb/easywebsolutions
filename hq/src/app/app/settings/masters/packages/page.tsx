import type { Metadata } from "next";
import { ActionButton, ActionForm } from "@/components/forms";
import { Badge, Card, Field, PageHeader } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { formatMoney } from "@/lib/money";
import { deletePackage, savePackage } from "../actions";

export const metadata: Metadata = { title: "Packages" };

type Pkg = { id: string; name: string; description: string | null; isActive: boolean; sort: number; items: { serviceItemId: string; quantity: unknown; unitPrice: unknown }[] };

function PackageEditor({ pkg, services, cur }: { pkg?: Pkg; services: { id: string; name: string; unitPrice: unknown }[]; cur: string }) {
  const slots = [...(pkg?.items ?? []), ...Array.from({ length: 3 }, () => null)];
  return (
    <ActionForm action={savePackage.bind(null, pkg?.id ?? null)} submit={pkg ? "Save package" : "Add package"} submitClassName="btn-secondary btn-sm" className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_6rem]">
        <Field label="Name">
          <input name="name" className="input" required defaultValue={pkg?.name} />
        </Field>
        <Field label="Order">
          <input name="sort" type="number" min="0" className="input" defaultValue={pkg?.sort ?? 0} />
        </Field>
      </div>
      <Field label="Description">
        <input name="description" className="input" defaultValue={pkg?.description ?? ""} />
      </Field>
      <div>
        <span className="label">Services (leave price blank to use the catalogue price)</span>
        <div className="space-y-2">
          {slots.map((it, i) => (
            <div key={i} className="grid grid-cols-[1fr_5rem_7rem] gap-2">
              <select name="serviceItemId" className="input" defaultValue={it?.serviceItemId ?? ""} aria-label={`Service ${i + 1}`}>
                <option value="">—</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({formatMoney(s.unitPrice, cur)})
                  </option>
                ))}
              </select>
              <input name="quantity" type="number" min="0" step="any" className="input" defaultValue={it ? String(it.quantity) : "1"} aria-label="Quantity" />
              <input name="price" type="number" min="0" step="0.01" className="input" defaultValue={it?.unitPrice != null ? String(it.unitPrice) : ""} placeholder="Price" aria-label="Price override" />
            </div>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={pkg?.isActive ?? true} /> Active
      </label>
    </ActionForm>
  );
}

export default async function Packages() {
  const ctx = await requireStaff("masters:manage");
  const [packages, services] = await Promise.all([
    ctx.db.package.findMany({ include: { items: { orderBy: { sort: "asc" } } }, orderBy: { sort: "asc" } }),
    ctx.db.serviceItem.findMany({ orderBy: { name: "asc" } }),
  ]);
  const cur = ctx.org.currencyCode;

  return (
    <>
      <PageHeader title="Packages" description="Choosing a package on a quotation fills in all of its lines." back={{ href: "/app/settings/masters", label: "Masters" }} />
      <div className="grid gap-6 lg:grid-cols-2">
        {packages.map((p) => (
          <Card
            key={p.id}
            title={
              <span className="flex items-center gap-2">
                {p.name} {!p.isActive && <Badge>Inactive</Badge>}
              </span>
            }
            actions={
              <ActionButton action={deletePackage.bind(null, p.id)} className="btn-ghost btn-sm" confirm={`Delete package "${p.name}"?`}>
                Delete
              </ActionButton>
            }
          >
            <PackageEditor pkg={p} services={services} cur={cur} />
          </Card>
        ))}
        <Card title="New package">
          <PackageEditor services={services} cur={cur} />
        </Card>
      </div>
    </>
  );
}
