"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { form, safe, zOptText } from "@/lib/actions";
import { audit, authorize, clientScope, type OrgContext } from "@/lib/context";
import { parseLines, publicToken } from "@/lib/documents";
import { must } from "@/lib/guard";
import { nextNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

export const saveInvoice = safe(async (id: string | null, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("invoices:write");
  const f = form(fd);
  const head = z
    .object({ clientId: z.string().min(1, "Choose a client"), issueDate: z.date(), dueDate: z.date().nullable(), notes: zOptText(5000) })
    .parse({ clientId: f.str("clientId"), issueDate: f.date("issueDate") ?? new Date(), dueDate: f.date("dueDate"), notes: f.opt("notes") });
  must(await ctx.db.client.findFirst({ where: { id: head.clientId, ...clientScope(ctx) } }), "Client");
  const { rows, totals } = await parseLines(ctx, fd.get("items"));

  if (id) {
    const inv = must(await ctx.db.invoice.findUnique({ where: { id } }), "Invoice");
    if (inv.status !== "DRAFT" && inv.status !== "SENT") return { error: "Only draft or unpaid invoices can be edited." };
    if (Number(inv.amountPaid) > totals.total) return { error: "The new total is less than what has already been paid." };
    await ctx.db.invoice.update({ where: { id }, data: { ...head, ...totals } });
    await ctx.db.invoiceItem.deleteMany({ where: { invoiceId: id } });
    await ctx.db.invoiceItem.createMany({ data: rows.map(({ serviceItemId: _s, ...r }) => ({ ...r, invoiceId: id })) });
    await audit(ctx, "update", "invoice", id, `Updated invoice ${inv.number}`);
    redirect(`/app/invoices/${id}`);
  }
  const inv = await ctx.db.invoice.create({
    data: {
      organizationId: ctx.orgId,
      number: await nextNumber(prisma, ctx.orgId, "INVOICE"),
      currencyCode: ctx.org.currencyCode,
      publicToken: publicToken(),
      createdById: ctx.userId,
      ...head,
      ...totals,
    },
  });
  await ctx.db.invoiceItem.createMany({ data: rows.map(({ serviceItemId: _s, ...r }) => ({ ...r, invoiceId: inv.id })) });
  await audit(ctx, "create", "invoice", inv.id, `Created invoice ${inv.number}`);
  redirect(`/app/invoices/${inv.id}`);
});

/** Recalculate amount paid and status from the payments on record. */
async function settle(ctx: OrgContext, invoiceId: string) {
  const inv = must(await ctx.db.invoice.findUnique({ where: { id: invoiceId } }), "Invoice");
  const agg = await ctx.db.payment.aggregate({ where: { invoiceId }, _sum: { amount: true } });
  const paid = Number(agg._sum.amount ?? 0);
  const total = Number(inv.total);
  const status = inv.status === "VOID" ? "VOID" : paid >= total - 0.005 && total > 0 ? "PAID" : paid > 0 ? "PARTIALLY_PAID" : inv.sentAt ? "SENT" : "DRAFT";
  await ctx.db.invoice.update({ where: { id: invoiceId }, data: { amountPaid: paid, status } });
}

export const markSent = safe(async (id: string) => {
  const ctx = await authorize("invoices:write");
  const inv = must(await ctx.db.invoice.findUnique({ where: { id } }), "Invoice");
  await ctx.db.invoice.update({ where: { id }, data: { sentAt: inv.sentAt ?? new Date(), status: inv.status === "DRAFT" ? "SENT" : inv.status } });
  refresh();
});

export const voidInvoice = safe(async (id: string) => {
  const ctx = await authorize("invoices:write");
  const inv = must(await ctx.db.invoice.findUnique({ where: { id }, include: { _count: { select: { payments: true } } } }), "Invoice");
  if (inv._count.payments > 0) return { error: "Remove the recorded payments before voiding." };
  await ctx.db.invoice.update({ where: { id }, data: { status: "VOID" } });
  if (inv.quotationId) {
    const q = await ctx.db.quotation.findUnique({ where: { id: inv.quotationId } });
    if (q?.status === "INVOICED") await ctx.db.quotation.update({ where: { id: q.id }, data: { status: "ACCEPTED" } });
  }
  await audit(ctx, "void", "invoice", id, `Voided invoice ${inv.number}`);
  refresh();
});

export const deleteInvoice = safe(async (id: string) => {
  const ctx = await authorize("invoices:write");
  const inv = must(await ctx.db.invoice.findUnique({ where: { id } }), "Invoice");
  if (inv.status !== "DRAFT") return { error: "Only drafts can be deleted — void sent invoices instead." };
  await ctx.db.invoice.delete({ where: { id } });
  await audit(ctx, "delete", "invoice", id, `Deleted draft invoice ${inv.number}`);
  redirect("/app/invoices");
});

export const recordPayment = safe(async (invoiceId: string, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("payments:write");
  const inv = must(await ctx.db.invoice.findUnique({ where: { id: invoiceId } }), "Invoice");
  if (inv.status === "VOID") return { error: "This invoice is void." };
  const f = form(fd);
  const data = z
    .object({ amount: z.number().positive("Enter an amount"), method: z.string().trim().min(1).max(60), reference: zOptText(120), paidAt: z.date(), notes: zOptText(500) })
    .parse({ amount: f.num("amount"), method: f.str("method") || "Bank transfer", reference: f.opt("reference"), paidAt: f.date("paidAt") ?? new Date(), notes: f.opt("notes") });
  const balance = Number(inv.total) - Number(inv.amountPaid);
  if (data.amount > balance + 0.005) return { error: `That's more than the balance due (${balance.toFixed(2)}).` };
  await ctx.db.payment.create({ data: { organizationId: ctx.orgId, invoiceId, recordedById: ctx.userId, ...data } });
  if (!inv.sentAt) await ctx.db.invoice.update({ where: { id: invoiceId }, data: { sentAt: new Date() } });
  await settle(ctx, invoiceId);
  await audit(ctx, "payment", "invoice", invoiceId, `Recorded payment of ${data.amount} on ${inv.number}`);
  refresh();
  return { ok: "Payment recorded" };
});

export const deletePayment = safe(async (paymentId: string) => {
  const ctx = await authorize("payments:write");
  const p = must(await ctx.db.payment.findUnique({ where: { id: paymentId } }), "Payment");
  await ctx.db.payment.delete({ where: { id: paymentId } });
  await settle(ctx, p.invoiceId);
  await audit(ctx, "payment-delete", "invoice", p.invoiceId, `Removed a payment of ${p.amount}`);
  refresh();
});

export const regenerateInvoiceLink = safe(async (id: string) => {
  const ctx = await authorize("invoices:write");
  must(await ctx.db.invoice.findUnique({ where: { id } }), "Invoice");
  await ctx.db.invoice.update({ where: { id }, data: { publicToken: publicToken() } });
  refresh();
  return { ok: "New link created." };
});
