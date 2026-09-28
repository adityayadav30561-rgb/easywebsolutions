import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionButton, ActionForm } from "@/components/forms";
import { Badge, Card, PageHeader } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { masterByKey, type MasterField } from "@/lib/masters";
import { deleteMaster, saveMaster } from "../actions";

export const metadata: Metadata = { title: "Masters" };

type Row = Record<string, unknown> & { id: string };

function Input({ field, row, taxes }: { field: MasterField; row?: Row; taxes: { id: string; name: string }[] }) {
  const v = row?.[field.name];
  const base = { name: field.name, "aria-label": field.label };
  switch (field.type) {
    case "bool":
      return (
        <label className="flex items-center gap-2 text-sm whitespace-nowrap">
          <input type="checkbox" name={field.name} defaultChecked={row ? Boolean(v) : field.name === "isActive"} /> {field.label}
        </label>
      );
    case "enum":
      return (
        <select {...base} className="input" defaultValue={(v as string) ?? field.options[0].value}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "color":
      return <input {...base} type="color" className="h-9 w-12 cursor-pointer rounded-lg border border-line bg-white p-1" defaultValue={(v as string) ?? "#8a6dbc"} />;
    case "int":
    case "decimal":
      return <input {...base} type="number" className="input" min={field.min} max={field.max} step={field.type === "int" ? "1" : (field.step ?? "any")} required={field.required} defaultValue={v != null ? String(v) : ""} placeholder={field.label} />;
    case "taxRate":
      return (
        <select {...base} className="input" defaultValue={(v as string) ?? ""}>
          <option value="">No tax</option>
          {taxes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      );
    case "textarea":
      return <textarea {...base} rows={2} className="input" defaultValue={(v as string) ?? ""} placeholder={field.label} />;
    default:
      return <input {...base} className="input" required={field.required} defaultValue={(v as string) ?? ""} placeholder={field.label} />;
  }
}

function MasterEditor({ masterKey, row, taxes }: { masterKey: string; row?: Row; taxes: { id: string; name: string }[] }) {
  const def = masterByKey(masterKey)!;
  const inline = def.fields.filter((f) => f.type !== "bool" && f.type !== "textarea");
  const extra = def.fields.filter((f) => f.type === "bool" || f.type === "textarea");
  return (
    <ActionForm action={saveMaster.bind(null, masterKey, row?.id ?? null)} submit={row ? "Save" : "Add"} submitClassName="btn-secondary btn-sm" reset={!row}>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${inline.length > 3 ? 8 : 10}rem, 1fr))` }}>
        {inline.map((f) => (
          <div key={f.name}>
            <span className="label">{f.label}</span>
            <Input field={f} row={row} taxes={taxes} />
          </div>
        ))}
      </div>
      {extra.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {extra.map((f) => (
            <div key={f.name} className={f.type === "textarea" ? "w-full" : ""}>
              <Input field={f} row={row} taxes={taxes} />
            </div>
          ))}
        </div>
      )}
    </ActionForm>
  );
}

export default async function MasterPage({ params }: PageProps<"/app/settings/masters/[key]">) {
  const ctx = await requireStaff("masters:manage");
  const { key } = await params;
  const def = masterByKey(key);
  if (!def || (def.feature && !ctx.has(def.feature))) notFound();

  const delegate = (ctx.db as unknown as Record<string, { findMany: (a: unknown) => Promise<Row[]> }>)[def.model];
  const [rows, taxes] = await Promise.all([delegate.findMany({ orderBy: def.order }), ctx.db.taxRate.findMany({ where: { isActive: true }, select: { id: true, name: true } })]);
  return (
    <>
      <PageHeader title={def.label} description={def.description} back={{ href: "/app/settings/masters", label: "Masters" }} />
      <div className="space-y-4">
        {rows.map((row) => (
          <Card
            key={row.id}
            title={
              <span className="flex items-center gap-2">
                {"color" in row && <span className="size-2.5 rounded-full" style={{ background: row.color as string }} aria-hidden="true" />}
                {String(row.name)}
                {row.isDefault === true && <Badge tone="violet">Default</Badge>}
                {row.isActive === false && <Badge>Inactive</Badge>}
              </span>
            }
            actions={
              <ActionButton action={deleteMaster.bind(null, key, row.id)} className="btn-ghost btn-sm" confirm={`Delete "${String(row.name)}"?`}>
                Delete
              </ActionButton>
            }
          >
            <MasterEditor masterKey={key} row={row} taxes={taxes} />
          </Card>
        ))}
        <Card title={`Add ${def.label.toLowerCase().replace(/s$/, "")}`}>
          <MasterEditor masterKey={key} taxes={taxes} />
        </Card>
      </div>
    </>
  );
}
