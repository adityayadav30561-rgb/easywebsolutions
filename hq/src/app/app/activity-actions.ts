"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { form, safe } from "@/lib/actions";
import { authorize, clientScope, leadScope, projectScope, ticketScope, type OrgContext } from "@/lib/context";
import type { EntityType } from "@/generated/prisma/enums";
import { must } from "@/lib/guard";

/** Confirms the record exists in this organisation and is visible to the user. */
async function assertEntity(ctx: OrgContext, type: EntityType, id: string) {
  switch (type) {
    case "LEAD":
      return must(await ctx.db.lead.findFirst({ where: { id, ...leadScope(ctx) } }), "Lead");
    case "CLIENT":
      return must(await ctx.db.client.findFirst({ where: { id, ...clientScope(ctx) } }), "Client");
    case "PROJECT":
      return must(await ctx.db.project.findFirst({ where: { id, ...projectScope(ctx) } }), "Project");
    case "TICKET":
      return must(await ctx.db.ticket.findFirst({ where: { id, ...ticketScope(ctx) } }), "Ticket");
    case "QUOTATION":
      return must(await ctx.db.quotation.findUnique({ where: { id } }), "Quotation");
    case "INVOICE":
      return must(await ctx.db.invoice.findUnique({ where: { id } }), "Invoice");
    case "CARE_SUBSCRIPTION":
      return must(await ctx.db.careSubscription.findUnique({ where: { id } }), "Subscription");
  }
}

const WRITE_PERM = {
  LEAD: "leads:write",
  CLIENT: "clients:write",
  PROJECT: "projects:write",
  TICKET: "tickets:write",
  QUOTATION: "quotes:write",
  INVOICE: "invoices:write",
  CARE_SUBSCRIPTION: "careplans:write",
} as const;

export const addActivity = safe(async (entityType: EntityType, entityId: string, _prev: unknown, fd: FormData) => {
  const ctx = await authorize(WRITE_PERM[entityType]);
  await assertEntity(ctx, entityType, entityId);
  const f = form(fd);
  const data = z
    .object({
      type: z.enum(["NOTE", "CALL", "EMAIL", "MEETING", "FOLLOW_UP"]),
      content: z.string().trim().min(1, "Write something").max(4000),
      dueAt: z.date().nullable(),
    })
    .parse({ type: f.str("type") || "NOTE", content: f.str("content"), dueAt: f.date("dueAt") });
  await ctx.db.activity.create({
    data: { organizationId: ctx.orgId, entityType, entityId, userId: ctx.userId, ...data, type: data.dueAt ? "FOLLOW_UP" : data.type },
  });
  refresh();
  return { ok: "Added" };
});

export const toggleActivity = safe(async (id: string) => {
  const ctx = await authorize();
  const a = must(await ctx.db.activity.findUnique({ where: { id } }), "Activity");
  await authorize(WRITE_PERM[a.entityType]);
  await assertEntity(ctx, a.entityType, a.entityId);
  await ctx.db.activity.update({ where: { id }, data: { doneAt: a.doneAt ? null : new Date() } });
  refresh();
});
