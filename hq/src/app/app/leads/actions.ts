"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { form, safe, zOptEmail, zOptText, zText } from "@/lib/actions";
import { audit, authorize, leadScope } from "@/lib/context";
import { must } from "@/lib/guard";
import { assertStaff } from "@/lib/lookups";

const schema = z.object({
  title: zText(160),
  contactName: zOptText(120),
  companyName: zOptText(160),
  email: zOptEmail,
  phone: zOptText(40),
  website: zOptText(200),
  sourceId: z.string().nullable(),
  stageId: z.string().min(1, "Choose a stage"),
  value: z.number().min(0).max(100_000_000).nullable(),
  ownerId: z.string().nullable(),
  expectedCloseDate: z.date().nullable(),
  notes: zOptText(5000),
});

async function parse(fd: FormData) {
  const f = form(fd);
  return schema.parse({
    title: f.str("title"),
    contactName: f.opt("contactName"),
    companyName: f.opt("companyName"),
    email: f.opt("email"),
    phone: f.opt("phone"),
    website: f.opt("website"),
    sourceId: f.opt("sourceId"),
    stageId: f.str("stageId"),
    value: f.num("value"),
    ownerId: f.opt("ownerId"),
    expectedCloseDate: f.date("expectedCloseDate"),
    notes: f.opt("notes"),
  });
}

export const saveLead = safe(async (id: string | null, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("leads:write");
  const data = await parse(fd);
  // Every referenced id must belong to this organisation.
  must(await ctx.db.pipelineStage.findUnique({ where: { id: data.stageId } }), "Stage");
  if (data.sourceId) must(await ctx.db.leadSource.findUnique({ where: { id: data.sourceId } }), "Source");
  await assertStaff(ctx, data.ownerId);
  if (ctx.assignedOnly) data.ownerId = ctx.userId;

  if (id) {
    must(await ctx.db.lead.findFirst({ where: { id, ...leadScope(ctx) } }), "Lead");
    await ctx.db.lead.update({ where: { id }, data });
    await audit(ctx, "update", "lead", id, `Updated lead "${data.title}"`);
    refresh();
    return { ok: "Saved" };
  }
  const lead = await ctx.db.lead.create({ data: { organizationId: ctx.orgId, ...data, ownerId: data.ownerId ?? ctx.userId } });
  await audit(ctx, "create", "lead", lead.id, `Created lead "${lead.title}"`);
  redirect(`/app/leads/${lead.id}`);
});

export const moveLead = safe(async (id: string, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("leads:write");
  const stageId = String(fd.get("stageId") ?? "");
  const lead = must(await ctx.db.lead.findFirst({ where: { id, ...leadScope(ctx) } }), "Lead");
  const stage = must(await ctx.db.pipelineStage.findUnique({ where: { id: stageId } }), "Stage");
  await ctx.db.lead.update({
    where: { id },
    data: { stageId, lostReason: stage.kind === "LOST" ? String(fd.get("lostReason") ?? "") || lead.lostReason : null },
  });
  await ctx.db.activity.create({
    data: { organizationId: ctx.orgId, entityType: "LEAD", entityId: id, type: "SYSTEM", userId: ctx.userId, content: `Moved to ${stage.name}` },
  });
  refresh();
});

export const convertLead = safe(async (id: string) => {
  const ctx = await authorize("leads:write", "clients:write");
  const lead = must(await ctx.db.lead.findFirst({ where: { id, ...leadScope(ctx) } }), "Lead");
  if (lead.convertedClientId) redirect(`/app/clients/${lead.convertedClientId}`);

  const won = await ctx.db.pipelineStage.findFirst({ where: { kind: "WON", isActive: true }, orderBy: { sort: "asc" } });
  const client = await ctx.db.client.create({
    data: {
      organizationId: ctx.orgId,
      name: lead.companyName || lead.contactName || lead.title,
      email: lead.email,
      phone: lead.phone,
      website: lead.website,
      ownerId: lead.ownerId,
      notes: lead.notes,
    },
  });
  if (lead.contactName) {
    await ctx.db.contact.create({
      data: { organizationId: ctx.orgId, clientId: client.id, name: lead.contactName, email: lead.email, phone: lead.phone, isPrimary: true },
    });
  }
  await ctx.db.lead.update({
    where: { id },
    data: { convertedClientId: client.id, convertedAt: new Date(), ...(won ? { stageId: won.id } : {}) },
  });
  // Quotes drafted for the lead now belong to the client.
  await ctx.db.quotation.updateMany({ where: { leadId: id, clientId: null }, data: { clientId: client.id } });
  await audit(ctx, "convert", "lead", id, `Converted lead "${lead.title}" to client "${client.name}"`);
  redirect(`/app/clients/${client.id}`);
});

export const deleteLead = safe(async (id: string) => {
  const ctx = await authorize("leads:delete");
  const lead = must(await ctx.db.lead.findFirst({ where: { id, ...leadScope(ctx) } }), "Lead");
  await ctx.db.activity.deleteMany({ where: { entityType: "LEAD", entityId: id } });
  await ctx.db.lead.delete({ where: { id } });
  await audit(ctx, "delete", "lead", id, `Deleted lead "${lead.title}"`);
  redirect("/app/leads");
});
