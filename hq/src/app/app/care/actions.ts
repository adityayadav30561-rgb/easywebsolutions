"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { form, safe, zOptText, zText } from "@/lib/actions";
import { clampBillingDay, billingPeriod, nextBillingDate } from "@/lib/care";
import { audit, authorize, careScope, clientScope } from "@/lib/context";
import { publicToken } from "@/lib/documents";
import { must } from "@/lib/guard";
import { computeLine, computeTotals } from "@/lib/money";
import { nextNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

// ─── Plans (the agency's own care-plan catalogue) ───

export const savePlan = safe(async (id: string | null, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("careplans:write");
  const f = form(fd);
  const data = z
    .object({
      name: zText(80),
      subtitle: zOptText(120),
      price: z.number({ error: "Enter a price" }).min(0).max(1_000_000),
      includedHours: z.number().min(0).max(1000),
      responseTimeHours: z.number().int().min(0).max(1000).nullable(),
      features: z.array(z.string().max(200)).max(50),
      isActive: z.boolean(),
      sort: z.number().int().min(0).max(1000),
    })
    .parse({
      name: f.str("name"),
      subtitle: f.opt("subtitle"),
      price: f.num("price"),
      includedHours: f.num("includedHours") ?? 0,
      responseTimeHours: f.num("responseTimeHours"),
      features: f.str("features").split("\n").map((s) => s.trim()).filter(Boolean),
      isActive: f.bool("isActive"),
      sort: f.num("sort") ?? 0,
    });
  if (id) {
    must(await ctx.db.carePlan.findUnique({ where: { id } }), "Plan");
    await ctx.db.carePlan.update({ where: { id }, data });
  } else {
    await ctx.db.carePlan.create({ data: { organizationId: ctx.orgId, ...data } });
  }
  await audit(ctx, id ? "update" : "create", "care-plan", id, `${id ? "Updated" : "Created"} care plan "${data.name}"`);
  refresh();
  return { ok: "Saved" };
});

// ─── Subscriptions ───

const subSchema = z.object({
  clientId: z.string().min(1, "Choose a client"),
  planId: z.string().min(1, "Choose a plan"),
  websiteUrl: zOptText(300),
  startDate: z.date(),
  billingDay: z.number().int().min(1).max(28),
  status: z.enum(["ACTIVE", "PAUSED", "CANCELLED"]),
  notes: zOptText(3000),
});

export const saveSubscription = safe(async (id: string | null, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("careplans:write");
  const f = form(fd);
  const start = f.date("startDate") ?? new Date();
  const data = subSchema.parse({
    clientId: f.str("clientId"),
    planId: f.str("planId"),
    websiteUrl: f.opt("websiteUrl"),
    startDate: start,
    billingDay: clampBillingDay(f.num("billingDay") ?? start.getUTCDate()),
    status: f.str("status") || "ACTIVE",
    notes: f.opt("notes"),
  });
  must(await ctx.db.client.findFirst({ where: { id: data.clientId, ...clientScope(ctx) } }), "Client");
  must(await ctx.db.carePlan.findUnique({ where: { id: data.planId } }), "Plan");

  if (id) {
    const sub = must(await ctx.db.careSubscription.findFirst({ where: { id, ...careScope(ctx) } }), "Subscription");
    await ctx.db.careSubscription.update({
      where: { id },
      data: {
        ...data,
        nextBillingDate: data.billingDay !== sub.billingDay ? nextBillingDate(data.billingDay) : sub.nextBillingDate,
        cancelledAt: data.status === "CANCELLED" ? (sub.cancelledAt ?? new Date()) : null,
      },
    });
    await audit(ctx, "update", "care-subscription", id, `Updated care subscription`);
    refresh();
    return { ok: "Saved" };
  }
  // First bill is due on the start date's billing day (today or later).
  const firstBill = start.getUTCDate() === data.billingDay ? start : nextBillingDate(data.billingDay, start);
  const sub = await ctx.db.careSubscription.create({ data: { organizationId: ctx.orgId, ...data, nextBillingDate: firstBill } });
  await audit(ctx, "create", "care-subscription", sub.id, `Started care subscription`);
  redirect(`/app/care/${sub.id}`);
});

/**
 * Invoice the subscription for its next billing date and roll the date
 * forward one month. Monthly billing in one click.
 */
export const billSubscription = safe(async (id: string) => {
  const ctx = await authorize("careplans:write", "invoices:write");
  const sub = must(await ctx.db.careSubscription.findFirst({ where: { id, ...careScope(ctx) }, include: { plan: true } }), "Subscription");
  if (sub.status !== "ACTIVE") return { error: "Only active subscriptions can be billed." };

  const periodStart = sub.nextBillingDate;
  const periodEnd = billingPeriod(sub.billingDay, periodStart).end;
  const line = {
    description: `${sub.plan.name} care plan${sub.websiteUrl ? ` — ${sub.websiteUrl}` : ""}\n${formatDate(periodStart)} – ${formatDate(new Date(periodEnd.getTime() - 86_400_000))}`,
    quantity: 1,
    unitPrice: Number(sub.plan.price),
    discountPct: 0,
    taxRate: 0,
  };
  const inv = await ctx.db.invoice.create({
    data: {
      organizationId: ctx.orgId,
      number: await nextNumber(prisma, ctx.orgId, "INVOICE"),
      clientId: sub.clientId,
      subscriptionId: sub.id,
      currencyCode: ctx.org.currencyCode,
      issueDate: new Date(),
      dueDate: periodStart > new Date() ? periodStart : new Date(),
      notes: ctx.org.invoiceNotes,
      publicToken: publicToken(),
      createdById: ctx.userId,
      ...computeTotals([line]),
    },
  });
  await ctx.db.invoiceItem.create({ data: { organizationId: ctx.orgId, invoiceId: inv.id, sort: 0, ...line, lineTotal: computeLine(line).lineTotal } });
  await ctx.db.careSubscription.update({ where: { id }, data: { nextBillingDate: periodEnd } });
  await audit(ctx, "bill", "care-subscription", id, `Invoice ${inv.number} for ${sub.plan.name} care`);
  redirect(`/app/invoices/${inv.id}`);
});

export const addTimeLog = safe(async (subscriptionId: string, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("timelogs:write");
  must(await ctx.db.careSubscription.findFirst({ where: { id: subscriptionId, ...careScope(ctx) } }), "Subscription");
  const f = form(fd);
  const data = z
    .object({ minutes: z.number().int().min(1, "Enter minutes").max(24 * 60), description: zText(500), workDate: z.date(), ticketId: z.string().nullable() })
    .parse({ minutes: f.num("minutes"), description: f.str("description"), workDate: f.date("workDate") ?? new Date(), ticketId: f.opt("ticketId") });
  if (data.ticketId) must(await ctx.db.ticket.findFirst({ where: { id: data.ticketId, subscriptionId } }), "Ticket on this plan");
  await ctx.db.careTimeLog.create({ data: { organizationId: ctx.orgId, subscriptionId, userId: ctx.userId, ...data } });
  refresh();
  return { ok: "Logged" };
});

export const deleteTimeLog = safe(async (id: string) => {
  const ctx = await authorize("timelogs:write");
  const log = must(await ctx.db.careTimeLog.findUnique({ where: { id } }), "Time entry");
  if (log.userId !== ctx.userId && !ctx.can("careplans:write")) return { error: "You can only remove your own entries." };
  await ctx.db.careTimeLog.delete({ where: { id } });
  refresh();
});
