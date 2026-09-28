"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { form, safe, zOptText, zText } from "@/lib/actions";
import { audit, authorize, clientScope, leadScope } from "@/lib/context";
import { parseLines, publicToken } from "@/lib/documents";
import { must } from "@/lib/guard";
import { computeLine, computeTotals } from "@/lib/money";
import { nextNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

export const saveQuote = safe(async (id: string | null, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("quotes:write");
  const f = form(fd);
  const head = z
    .object({
      title: zText(200),
      clientId: z.string().nullable(),
      leadId: z.string().nullable(),
      paymentTermId: z.string().nullable(),
      packageId: z.string().nullable(),
      validUntil: z.date().nullable(),
      notes: zOptText(5000),
      terms: zOptText(5000),
    })
    .parse({
      title: f.str("title"),
      clientId: f.opt("clientId"),
      leadId: f.opt("leadId"),
      paymentTermId: f.opt("paymentTermId"),
      packageId: f.opt("packageId"),
      validUntil: f.date("validUntil"),
      notes: f.opt("notes"),
      terms: f.opt("terms"),
    });
  if (!head.clientId && !head.leadId) return { error: "Choose a client or lead." };
  if (head.clientId) must(await ctx.db.client.findFirst({ where: { id: head.clientId, ...clientScope(ctx) } }), "Client");
  if (head.leadId) must(await ctx.db.lead.findFirst({ where: { id: head.leadId, ...leadScope(ctx) } }), "Lead");
  if (head.paymentTermId) must(await ctx.db.paymentTerm.findUnique({ where: { id: head.paymentTermId } }), "Payment term");
  if (head.packageId) must(await ctx.db.package.findUnique({ where: { id: head.packageId } }), "Package");
  const { rows, totals } = await parseLines(ctx, fd.get("items"));

  if (id) {
    const existing = must(await ctx.db.quotation.findUnique({ where: { id } }), "Quotation");
    if (["ACCEPTED", "INVOICED"].includes(existing.status)) return { error: "Accepted quotations can't be edited. Duplicate it instead." };
    await ctx.db.quotation.update({ where: { id }, data: { ...head, ...totals } });
    await ctx.db.quotationItem.deleteMany({ where: { quotationId: id } });
    await ctx.db.quotationItem.createMany({ data: rows.map((r) => ({ ...r, quotationId: id })) });
    await audit(ctx, "update", "quotation", id, `Updated quotation ${existing.number}`);
    redirect(`/app/quotes/${id}`);
  }

  const quote = await ctx.db.quotation.create({
    data: {
      organizationId: ctx.orgId,
      number: await nextNumber(prisma, ctx.orgId, "QUOTATION"),
      currencyCode: ctx.org.currencyCode,
      publicToken: publicToken(),
      createdById: ctx.userId,
      ...head,
      ...totals,
    },
  });
  await ctx.db.quotationItem.createMany({ data: rows.map((r) => ({ ...r, quotationId: quote.id })) });
  await audit(ctx, "create", "quotation", quote.id, `Created quotation ${quote.number}`);
  redirect(`/app/quotes/${quote.id}`);
});

const STATUS_PERM = { SENT: "quotes:send", ACCEPTED: "quotes:write", REJECTED: "quotes:write", EXPIRED: "quotes:write", DRAFT: "quotes:write" } as const;

export const setQuoteStatus = safe(async (id: string, status: keyof typeof STATUS_PERM) => {
  const ctx = await authorize(STATUS_PERM[status]);
  const q = must(await ctx.db.quotation.findUnique({ where: { id } }), "Quotation");
  if (q.status === "INVOICED") return { error: "This quotation has already been invoiced." };
  const now = new Date();
  await ctx.db.quotation.update({
    where: { id },
    data: {
      status,
      ...(status === "SENT" ? { sentAt: q.sentAt ?? now } : {}),
      ...(status === "ACCEPTED" ? { acceptedAt: now, acceptedByName: `${ctx.user.name} (recorded by staff)` } : {}),
      ...(status === "REJECTED" ? { rejectedAt: now } : {}),
    },
  });
  await audit(ctx, "status", "quotation", id, `Quotation ${q.number} marked ${status.toLowerCase()}`);
  refresh();
});

/**
 * Turn a quotation into an invoice.
 *  - "full": copies every line (or, if part was already invoiced, one balance line)
 *  - "deposit": one line for the payment term's deposit percentage
 */
export const convertToInvoice = safe(async (id: string, mode: "full" | "deposit") => {
  const ctx = await authorize("quotes:write", "invoices:write");
  const q = must(await ctx.db.quotation.findUnique({ where: { id }, include: { items: { orderBy: { sort: "asc" } }, paymentTerm: true, invoices: { where: { status: { not: "VOID" } } } } }), "Quotation");
  if (!q.clientId) return { error: "Convert the lead to a client before invoicing." };
  if (q.status === "INVOICED") return { error: "Already fully invoiced." };

  const total = Number(q.total);
  const invoiced = q.invoices.reduce((s, i) => s + Number(i.total), 0);
  const round = (n: number) => Math.round(n * 100) / 100;
  let lines: { description: string; quantity: number; unitPrice: number; discountPct: number; taxRate: number; serviceItemId?: string | null }[];

  if (mode === "deposit") {
    const pct = q.paymentTerm?.depositPercent || 50;
    lines = [{ description: `${pct}% deposit for quotation ${q.number} — ${q.title}`, quantity: 1, unitPrice: round((total * pct) / 100), discountPct: 0, taxRate: 0 }];
  } else if (invoiced > 0) {
    lines = [{ description: `Balance for quotation ${q.number} — ${q.title}`, quantity: 1, unitPrice: round(total - invoiced), discountPct: 0, taxRate: 0 }];
  } else {
    lines = q.items.map((i) => ({ description: i.description, quantity: Number(i.quantity), unitPrice: Number(i.unitPrice), discountPct: Number(i.discountPct), taxRate: Number(i.taxRate), serviceItemId: i.serviceItemId }));
  }
  if ((mode === "deposit" || invoiced > 0) && lines[0].unitPrice <= 0) return { error: "Nothing left to invoice." };

  const totals = computeTotals(lines);
  const dueDays = q.paymentTerm?.dueDays ?? 0;
  const invoice = await ctx.db.invoice.create({
    data: {
      organizationId: ctx.orgId,
      number: await nextNumber(prisma, ctx.orgId, "INVOICE"),
      clientId: q.clientId,
      quotationId: q.id,
      currencyCode: q.currencyCode,
      dueDate: new Date(Date.now() + dueDays * 86_400_000),
      notes: ctx.org.invoiceNotes,
      publicToken: publicToken(),
      createdById: ctx.userId,
      ...totals,
    },
  });
  await ctx.db.invoiceItem.createMany({
    data: lines.map((l, sort) => ({ organizationId: ctx.orgId, invoiceId: invoice.id, sort, description: l.description, quantity: l.quantity, unitPrice: l.unitPrice, discountPct: l.discountPct, taxRate: l.taxRate, lineTotal: computeLine(l).lineTotal })),
  });
  if (mode === "full" || invoiced + totals.total >= total - 0.005) {
    await ctx.db.quotation.update({ where: { id }, data: { status: "INVOICED" } });
  } else if (q.status !== "ACCEPTED") {
    await ctx.db.quotation.update({ where: { id }, data: { status: "ACCEPTED", acceptedAt: q.acceptedAt ?? new Date() } });
  }
  await audit(ctx, "create", "invoice", invoice.id, `Invoice ${invoice.number} created from quotation ${q.number}`);
  redirect(`/app/invoices/${invoice.id}`);
});

export const duplicateQuote = safe(async (id: string) => {
  const ctx = await authorize("quotes:write");
  const q = must(await ctx.db.quotation.findUnique({ where: { id }, include: { items: true } }), "Quotation");
  const copy = await ctx.db.quotation.create({
    data: {
      organizationId: ctx.orgId,
      number: await nextNumber(prisma, ctx.orgId, "QUOTATION"),
      title: q.title,
      clientId: q.clientId,
      leadId: q.leadId,
      packageId: q.packageId,
      paymentTermId: q.paymentTermId,
      currencyCode: q.currencyCode,
      subtotal: q.subtotal,
      discountTotal: q.discountTotal,
      taxTotal: q.taxTotal,
      total: q.total,
      notes: q.notes,
      terms: q.terms,
      validUntil: new Date(Date.now() + 30 * 86_400_000),
      publicToken: publicToken(),
      createdById: ctx.userId,
    },
  });
  await ctx.db.quotationItem.createMany({
    data: q.items.map(({ id: _id, quotationId: _q, organizationId: _o, ...rest }) => ({ ...rest, organizationId: ctx.orgId, quotationId: copy.id })),
  });
  redirect(`/app/quotes/${copy.id}`);
});

export const deleteQuote = safe(async (id: string) => {
  const ctx = await authorize("quotes:write");
  const q = must(await ctx.db.quotation.findUnique({ where: { id }, include: { _count: { select: { invoices: true } } } }), "Quotation");
  if (q._count.invoices > 0) return { error: "This quotation has invoices; it can't be deleted." };
  await ctx.db.quotation.delete({ where: { id } });
  await audit(ctx, "delete", "quotation", id, `Deleted quotation ${q.number}`);
  redirect("/app/quotes");
});

export const regenerateLink = safe(async (id: string) => {
  const ctx = await authorize("quotes:send");
  must(await ctx.db.quotation.findUnique({ where: { id } }), "Quotation");
  await ctx.db.quotation.update({ where: { id }, data: { publicToken: publicToken() } });
  refresh();
  return { ok: "New link created — the old one no longer works." };
});
