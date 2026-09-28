"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { form, safe, zOptText, zText } from "@/lib/actions";
import { audit, authorize } from "@/lib/context";
import { must } from "@/lib/guard";
import { masterByKey, type MasterField } from "@/lib/masters";

type Delegate = {
  findUnique: (a: unknown) => Promise<Record<string, unknown> | null>;
  create: (a: unknown) => Promise<{ id: string }>;
  update: (a: unknown) => Promise<unknown>;
  updateMany: (a: unknown) => Promise<unknown>;
  delete: (a: unknown) => Promise<unknown>;
};

function readField(f: ReturnType<typeof form>, field: MasterField) {
  switch (field.type) {
    case "bool":
      return f.bool(field.name);
    case "int":
    case "decimal": {
      const n = f.num(field.name);
      if (n === null) {
        if (field.required) throw new Error(`${field.label} is required`);
        return field.name === "slaHours" ? null : 0;
      }
      if (!Number.isFinite(n) || (field.min !== undefined && n < field.min) || (field.max !== undefined && n > field.max)) throw new Error(`${field.label} is out of range`);
      return field.type === "int" ? Math.trunc(n) : n;
    }
    case "enum": {
      const v = f.str(field.name);
      if (!field.options.some((o) => o.value === v)) throw new Error(`Choose a ${field.label.toLowerCase()}`);
      return v;
    }
    case "color": {
      const v = f.str(field.name) || "#8a6dbc";
      if (!/^#[0-9a-f]{6}$/i.test(v)) throw new Error("Colour must be a hex value like #8a6dbc");
      return v;
    }
    case "taxRate":
      return f.opt(field.name);
    case "textarea":
      return zOptText(2000).parse(f.opt(field.name));
    default:
      return field.required ? zText(120).parse(f.str(field.name)) : zOptText(120).parse(f.opt(field.name));
  }
}

export const saveMaster = safe(async (key: string, id: string | null, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("masters:manage");
  const def = must(masterByKey(key), "Master");
  const delegate = (ctx.db as unknown as Record<string, Delegate>)[def.model];
  const f = form(fd);
  const data: Record<string, unknown> = {};
  for (const field of def.fields) data[field.name] = readField(f, field);
  if (data.taxRateId) must(await ctx.db.taxRate.findUnique({ where: { id: data.taxRateId as string } }), "Tax rate");
  if ("unit" in data && !data.unit) data.unit = "item";

  if (def.hasDefault && data.isDefault) await delegate.updateMany({ where: {}, data: { isDefault: false } });
  if (id) {
    must(await delegate.findUnique({ where: { id } }), def.label);
    await delegate.update({ where: { id }, data });
  } else {
    await delegate.create({ data: { ...data, organizationId: ctx.orgId } });
  }
  await audit(ctx, id ? "update" : "create", `master:${key}`, id, `${id ? "Updated" : "Added"} ${def.label.toLowerCase()} "${String(data.name)}"`);
  refresh();
  return { ok: "Saved" };
});

export const deleteMaster = safe(async (key: string, id: string) => {
  const ctx = await authorize("masters:manage");
  const def = must(masterByKey(key), "Master");
  const delegate = (ctx.db as unknown as Record<string, Delegate>)[def.model];
  const row = must(await delegate.findUnique({ where: { id } }), def.label);
  try {
    await delegate.delete({ where: { id } });
  } catch (e) {
    if ((e as { code?: string }).code === "P2003") return { error: `"${String(row.name)}" is in use. Untick "Active" to retire it instead.` };
    throw e;
  }
  await audit(ctx, "delete", `master:${key}`, id, `Deleted ${def.label.toLowerCase()} "${String(row.name)}"`);
  refresh();
});

// ─── Packages (bundles of catalogue services) ───

export const savePackage = safe(async (id: string | null, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("masters:manage");
  const f = form(fd);
  const head = z.object({ name: zText(120), description: zOptText(1000), isActive: z.boolean(), sort: z.number().int().min(0) }).parse({
    name: f.str("name"),
    description: f.opt("description"),
    isActive: f.bool("isActive"),
    sort: f.num("sort") ?? 0,
  });
  const serviceIds = fd.getAll("serviceItemId").map(String);
  const qtys = fd.getAll("quantity").map((q) => Number(q) || 1);
  const prices = fd.getAll("price").map((p) => (String(p).trim() === "" ? null : Number(p)));
  const items = serviceIds.map((sid, i) => ({ serviceItemId: sid, quantity: qtys[i] ?? 1, unitPrice: prices[i] ?? null, sort: i })).filter((i) => i.serviceItemId);
  if (items.length) {
    const n = await ctx.db.serviceItem.count({ where: { id: { in: items.map((i) => i.serviceItemId) } } });
    if (n !== new Set(items.map((i) => i.serviceItemId)).size) throw new Error("Unknown service in package");
  }
  if (id) {
    must(await ctx.db.package.findUnique({ where: { id } }), "Package");
    await ctx.db.package.update({ where: { id }, data: { ...head, items: { deleteMany: {}, create: items } } });
  } else {
    await ctx.db.package.create({ data: { organizationId: ctx.orgId, ...head, items: { create: items } } });
  }
  refresh();
  return { ok: "Saved" };
});

export const deletePackage = safe(async (id: string) => {
  const ctx = await authorize("masters:manage");
  must(await ctx.db.package.findUnique({ where: { id } }), "Package");
  await ctx.db.package.delete({ where: { id } });
  refresh();
});
