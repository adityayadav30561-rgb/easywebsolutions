import "server-only";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import type { OrgContext } from "./context";
import { computeLine, computeTotals, type LineInput } from "./money";

export const lineSchema = z.object({
  description: z.string().trim().min(1, "Every line needs a description").max(2000),
  quantity: z.number().positive("Quantity must be above 0").max(1_000_000),
  unitPrice: z.number().min(0).max(100_000_000),
  discountPct: z.number().min(0).max(100).default(0),
  taxRate: z.number().min(0).max(100).default(0),
  serviceItemId: z.string().nullable().optional(),
});

/** Parse the editor's JSON, check catalogue references belong to this org, and compute totals server-side. */
export async function parseLines(ctx: OrgContext, raw: FormDataEntryValue | null) {
  let json: unknown;
  try {
    json = JSON.parse(String(raw ?? "[]"));
  } catch {
    throw new Error("Could not read the line items");
  }
  const lines = z.array(lineSchema).min(1, "Add at least one line").max(200).parse(json) as LineInput[];
  const ids = [...new Set(lines.map((l) => l.serviceItemId).filter((x): x is string => !!x))];
  if (ids.length) {
    const found = await ctx.db.serviceItem.count({ where: { id: { in: ids } } });
    if (found !== ids.length) throw new Error("A catalogue item on this document doesn't exist");
  }
  return {
    totals: computeTotals(lines),
    rows: lines.map((l, sort) => ({
      organizationId: ctx.orgId,
      sort,
      description: l.description,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      discountPct: l.discountPct ?? 0,
      taxRate: l.taxRate ?? 0,
      lineTotal: computeLine(l).lineTotal,
      serviceItemId: l.serviceItemId ?? null,
    })),
  };
}

export function publicToken() {
  return randomBytes(24).toString("base64url");
}

/** Plain, serialisable catalogue data for the client-side editor. */
export async function editorCatalogue(ctx: OrgContext) {
  const [items, packages, taxes] = await Promise.all([
    ctx.db.serviceItem.findMany({ where: { isActive: true }, include: { taxRate: true }, orderBy: [{ category: "asc" }, { name: "asc" }] }),
    ctx.db.package.findMany({ where: { isActive: true }, include: { items: { include: { serviceItem: { include: { taxRate: true } } }, orderBy: { sort: "asc" } } }, orderBy: { sort: "asc" } }),
    ctx.db.taxRate.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);
  const toLine = (s: (typeof items)[number], qty = 1, price?: unknown): EditorLine => ({
    serviceItemId: s.id,
    description: s.description ? `${s.name} — ${s.description}` : s.name,
    quantity: qty,
    unitPrice: Number(price ?? s.unitPrice),
    discountPct: 0,
    taxRate: Number(s.taxRate?.rate ?? 0),
  });
  return {
    items: items.map((s) => ({ id: s.id, name: s.name, category: s.category, unit: s.unit, line: toLine(s) })),
    packages: packages.map((p) => ({ id: p.id, name: p.name, lines: p.items.map((i) => toLine(i.serviceItem, Number(i.quantity), i.unitPrice ?? undefined)) })),
    taxes: taxes.map((t) => ({ id: t.id, name: t.name, rate: Number(t.rate) })),
    defaultTax: Number(taxes.find((t) => t.isDefault)?.rate ?? 0),
  };
}

export type EditorCatalogue = Awaited<ReturnType<typeof editorCatalogue>>;
export type EditorLine = { serviceItemId: string | null; description: string; quantity: number; unitPrice: number; discountPct: number; taxRate: number };

export function toEditorLines(items: { description: string; quantity: unknown; unitPrice: unknown; discountPct: unknown; taxRate: unknown; serviceItemId?: string | null }[]): EditorLine[] {
  return items.map((i) => ({
    serviceItemId: i.serviceItemId ?? null,
    description: i.description,
    quantity: Number(i.quantity),
    unitPrice: Number(i.unitPrice),
    discountPct: Number(i.discountPct),
    taxRate: Number(i.taxRate),
  }));
}
