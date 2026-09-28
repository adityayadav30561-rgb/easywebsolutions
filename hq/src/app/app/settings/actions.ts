"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { form, safe, zOptEmail, zOptText, zText } from "@/lib/actions";
import { audit, authorize } from "@/lib/context";
import { prisma } from "@/lib/prisma";

export const saveOrganization = safe(async (_prev: unknown, fd: FormData) => {
  const ctx = await authorize("settings:manage");
  const f = form(fd);
  const data = z
    .object({
      name: zText(120),
      email: zOptEmail,
      phone: zOptText(40),
      website: zOptText(200),
      address: zOptText(300),
      country: zOptText(80),
      taxId: zOptText(60),
      logoUrl: z.union([z.null(), z.url("Logo must be a full https:// URL")]),
      currencyCode: z.string().length(3),
      timezone: z.string().min(1).max(60),
      brandColor: z.string().regex(/^#[0-9a-f]{6}$/i, "Pick a colour"),
      quoteTerms: zOptText(5000),
      invoiceNotes: zOptText(5000),
    })
    .parse({
      name: f.str("name"),
      email: f.opt("email"),
      phone: f.opt("phone"),
      website: f.opt("website"),
      address: f.opt("address"),
      country: f.opt("country"),
      taxId: f.opt("taxId"),
      logoUrl: f.opt("logoUrl"),
      currencyCode: f.str("currencyCode"),
      timezone: f.str("timezone") || "UTC",
      brandColor: f.str("brandColor"),
      quoteTerms: f.opt("quoteTerms"),
      invoiceNotes: f.opt("invoiceNotes"),
    });
  if (!(await prisma.currency.findUnique({ where: { code: data.currencyCode } }))) return { error: "Unknown currency" };
  // Organisation is a global table: always update by the caller's own org id.
  await prisma.organization.update({ where: { id: ctx.orgId }, data });
  await audit(ctx, "update", "organization", ctx.orgId, "Updated organisation settings");
  refresh();
  return { ok: "Saved" };
});

export const saveSequence = safe(async (type: "QUOTATION" | "INVOICE" | "TICKET" | "PROJECT", _prev: unknown, fd: FormData) => {
  const ctx = await authorize("settings:manage");
  const f = form(fd);
  const data = z
    .object({ prefix: z.string().trim().max(12).regex(/^[A-Za-z0-9\-_/]*$/, "Letters, numbers, - _ / only"), nextNumber: z.number().int().min(1).max(99_999_999), padding: z.number().int().min(1).max(10) })
    .parse({ prefix: f.str("prefix"), nextNumber: f.num("nextNumber"), padding: f.num("padding") });
  await ctx.db.numberSequence.upsert({
    where: { organizationId_type: { organizationId: ctx.orgId, type } },
    update: data,
    create: { organizationId: ctx.orgId, type, ...data },
  });
  await audit(ctx, "update", "sequence", null, `Numbering for ${type.toLowerCase()}s set to ${data.prefix}${String(data.nextNumber).padStart(data.padding, "0")}`);
  refresh();
  return { ok: "Saved" };
});
