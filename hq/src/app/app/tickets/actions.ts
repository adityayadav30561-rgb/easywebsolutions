"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { form, safe, zText } from "@/lib/actions";
import { audit, authorize, clientScope, ticketScope, type OrgContext } from "@/lib/context";
import { must } from "@/lib/guard";
import { assertStaff } from "@/lib/lookups";
import { createTicket } from "@/lib/tickets";

async function checkRefs(ctx: OrgContext, r: { clientId: string; projectId?: string | null; subscriptionId?: string | null; priorityId?: string | null; categoryId?: string | null; statusId?: string | null }) {
  must(await ctx.db.client.findFirst({ where: { id: r.clientId, ...clientScope(ctx) } }), "Client");
  if (r.projectId) must(await ctx.db.project.findFirst({ where: { id: r.projectId, clientId: r.clientId } }), "Project for this client");
  if (r.subscriptionId) {
    if (!ctx.has("CARE_PLANS")) throw new Error("Care plans aren't enabled");
    must(await ctx.db.careSubscription.findFirst({ where: { id: r.subscriptionId, clientId: r.clientId } }), "Care plan for this client");
  }
  if (r.priorityId) must(await ctx.db.ticketPriority.findUnique({ where: { id: r.priorityId } }), "Priority");
  if (r.categoryId) must(await ctx.db.ticketCategory.findUnique({ where: { id: r.categoryId } }), "Category");
  if (r.statusId) return must(await ctx.db.ticketStatus.findUnique({ where: { id: r.statusId } }), "Status");
}

export const createStaffTicket = safe(async (_prev: unknown, fd: FormData) => {
  const ctx = await authorize("tickets:write");
  const f = form(fd);
  const data = z
    .object({
      subject: zText(200),
      description: zText(10_000),
      clientId: z.string().min(1, "Choose a client"),
      projectId: z.string().nullable(),
      subscriptionId: z.string().nullable(),
      priorityId: z.string().nullable(),
      categoryId: z.string().nullable(),
      assigneeId: z.string().nullable(),
      source: z.enum(["PORTAL", "EMAIL", "PHONE", "WHATSAPP", "INTERNAL"]),
    })
    .parse({
      subject: f.str("subject"),
      description: f.str("description"),
      clientId: f.str("clientId"),
      projectId: f.opt("projectId"),
      subscriptionId: f.opt("subscriptionId"),
      priorityId: f.opt("priorityId"),
      categoryId: f.opt("categoryId"),
      assigneeId: f.opt("assigneeId"),
      source: f.str("source") || "INTERNAL",
    });
  await checkRefs(ctx, data);
  if (data.assigneeId && !ctx.can("tickets:assign")) data.assigneeId = null;
  await assertStaff(ctx, data.assigneeId);
  const ticket = await createTicket(ctx.db, ctx.orgId, {
    ...data,
    // Members limited to their own work keep tickets they raise visible to themselves.
    assigneeId: data.assigneeId ?? (ctx.assignedOnly ? ctx.userId : null),
    raisedById: ctx.userId,
  });
  await audit(ctx, "create", "ticket", ticket.id, `Opened ticket ${ticket.number}`);
  redirect(`/app/tickets/${ticket.id}`);
});

async function ownTicket(id: string, ...perms: ("tickets:write" | "tickets:assign" | "tickets:delete" | "timelogs:write")[]) {
  const ctx = await authorize(...perms);
  const ticket = must(await ctx.db.ticket.findFirst({ where: { id, ...ticketScope(ctx) } }), "Ticket");
  return { ctx, ticket };
}

export const updateTicket = safe(async (id: string, _prev: unknown, fd: FormData) => {
  const { ctx, ticket } = await ownTicket(id, "tickets:write");
  const f = form(fd);
  const data = {
    statusId: f.str("statusId") || ticket.statusId,
    priorityId: f.str("priorityId") || ticket.priorityId,
    categoryId: f.opt("categoryId"),
    projectId: f.opt("projectId"),
    subscriptionId: f.opt("subscriptionId"),
    dueAt: f.date("dueAt"),
  };
  const status = await checkRefs(ctx, { clientId: ticket.clientId, ...data });
  let assigneeId = ticket.assigneeId;
  if (ctx.can("tickets:assign") && fd.has("assigneeId")) assigneeId = await assertStaff(ctx, f.opt("assigneeId"));

  const resolvedAt = status?.isClosed ? (ticket.resolvedAt ?? new Date()) : null;
  await ctx.db.ticket.update({ where: { id }, data: { ...data, assigneeId, resolvedAt } });
  if (status && status.id !== ticket.statusId) {
    await ctx.db.activity.create({
      data: { organizationId: ctx.orgId, entityType: "TICKET", entityId: id, type: "SYSTEM", userId: ctx.userId, content: `Status changed to ${status.name}` },
    });
  }
  refresh();
  return { ok: "Updated" };
});

export const replyTicket = safe(async (id: string, _prev: unknown, fd: FormData) => {
  const { ctx } = await ownTicket(id, "tickets:write");
  const body = zText(10_000).parse(String(fd.get("body") ?? ""));
  await ctx.db.ticketComment.create({
    data: { organizationId: ctx.orgId, ticketId: id, authorId: ctx.userId, body, isInternal: fd.get("isInternal") === "on" },
  });
  await ctx.db.ticket.update({ where: { id }, data: { updatedAt: new Date() } });
  refresh();
  return { ok: "Sent" };
});

export const logTime = safe(async (id: string, _prev: unknown, fd: FormData) => {
  const { ctx, ticket } = await ownTicket(id, "timelogs:write");
  if (!ctx.has("CARE_PLANS")) return { error: "Care plans aren't enabled." };
  if (!ticket.subscriptionId) return { error: "Link this ticket to a care plan first." };
  const f = form(fd);
  const data = z
    .object({ minutes: z.number().int().min(1, "Enter minutes").max(24 * 60), description: zText(500), workDate: z.date() })
    .parse({ minutes: f.num("minutes"), description: f.str("description") || ticket.subject, workDate: f.date("workDate") ?? new Date() });
  await ctx.db.careTimeLog.create({ data: { organizationId: ctx.orgId, subscriptionId: ticket.subscriptionId, ticketId: id, userId: ctx.userId, ...data } });
  refresh();
  return { ok: "Time logged" };
});

export const deleteTicket = safe(async (id: string) => {
  const { ctx, ticket } = await ownTicket(id, "tickets:delete");
  await ctx.db.activity.deleteMany({ where: { entityType: "TICKET", entityId: id } });
  await ctx.db.ticket.delete({ where: { id } });
  await audit(ctx, "delete", "ticket", id, `Deleted ticket ${ticket.number}`);
  redirect("/app/tickets");
});
