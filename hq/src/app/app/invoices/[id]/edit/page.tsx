import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { toEditorLines } from "@/lib/documents";
import { InvoiceForm } from "../../InvoiceForm";

export const metadata: Metadata = { title: "Edit invoice" };

export default async function EditInvoice({ params }: PageProps<"/app/invoices/[id]/edit">) {
  const ctx = await requireStaff("invoices:write");
  const { id } = await params;
  const inv = await ctx.db.invoice.findUnique({ where: { id }, include: { items: { orderBy: { sort: "asc" } } } });
  if (!inv) notFound();
  if (inv.status !== "DRAFT" && inv.status !== "SENT") redirect(`/app/invoices/${id}`);
  return (
    <>
      <PageHeader title={`Edit ${inv.number}`} back={{ href: `/app/invoices/${id}`, label: inv.number }} />
      <InvoiceForm ctx={ctx} inv={{ ...inv, lines: toEditorLines(inv.items) }} />
    </>
  );
}
