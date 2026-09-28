"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { safe, zText } from "@/lib/actions";
import { authorizeClient } from "@/lib/context";
import { must } from "@/lib/guard";
import { createTicket } from "@/lib/tickets";

/**
 * Client-portal actions. Every lookup is pinned to the member's own client
 * company, on top of the organisation scope.
 */
export const raiseTicket = safe(async (_prev: unknown, fd: FormData) => {
  const ctx = await authorizeClient("portal:tickets");
  const data = z
    .object({ subject: zText(200), description: zText(10_000), projectId: z.string().nullable(), subscriptionId: z.string().nullable(), categoryId: z.string().nullable() })
    .parse({
      subject: fd.get("subject"),
      description: fd.get("description"),
      projectId: fd.get("projectId") || null,
      subscriptionId: fd.get("subscriptionId") || null,
      categoryId: fd.get("categoryId") || null,
    });
  if (data.projectId) must(await ctx.db.project.findFirst({ where: { id: data.projectId, clientId: ctx.clientId, visibleToClient: true } }), "Project");
  if (data.subscriptionId) {
    if (!ctx.has("CARE_PLANS")) data.subscriptionId = null;
    else must(await ctx.db.careSubscription.findFirst({ where: { id: data.subscriptionId, clientId: ctx.clientId } }), "Care plan");
  }
  if (data.categoryId) must(await ctx.db.ticketCategory.findFirst({ where: { id: data.categoryId, isActive: true } }), "Category");
  const t = await createTicket(ctx.db, ctx.orgId, { ...data, clientId: ctx.clientId, raisedById: ctx.userId, source: "PORTAL" });
  redirect(`/portal/tickets/${t.id}`);
});

export const replyAsClient = safe(async (ticketId: string, _prev: unknown, fd: FormData) => {
  const ctx = await authorizeClient("portal:tickets");
  const ticket = must(await ctx.db.ticket.findFirst({ where: { id: ticketId, clientId: ctx.clientId }, include: { status: true } }), "Request");
  const body = zText(10_000).parse(fd.get("body"));
  await ctx.db.ticketComment.create({ data: { organizationId: ctx.orgId, ticketId, authorId: ctx.userId, body, isInternal: false } });

  // A client reply re-opens a request that was closed or waiting on them.
  if (ticket.status.isClosed || /waiting/i.test(ticket.status.name)) {
    const open = await ctx.db.ticketStatus.findFirst({ where: { isActive: true, isClosed: false }, orderBy: [{ isDefault: "desc" }, { sort: "asc" }] });
    if (open) await ctx.db.ticket.update({ where: { id: ticketId }, data: { statusId: open.id, resolvedAt: null } });
  } else {
    await ctx.db.ticket.update({ where: { id: ticketId }, data: { updatedAt: new Date() } });
  }
  refresh();
  return { ok: "Sent" };
});
