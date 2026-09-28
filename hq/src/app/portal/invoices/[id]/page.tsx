import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentView } from "@/components/DocumentView";
import { PrintButton } from "@/components/forms";
import { PageHeader, StatusBadge } from "@/components/ui";
import { requireClient } from "@/lib/context";
import { invoiceDoc } from "@/lib/docdata";

export const metadata: Metadata = { title: "Invoice" };

export default async function PortalInvoice({ params }: PageProps<"/portal/invoices/[id]">) {
  const ctx = await requireClient("portal:invoices");
  const { id } = await params;
  const inv = await ctx.db.invoice.findFirst({ where: { id, clientId: ctx.clientId, status: { not: "DRAFT" } }, include: { items: { orderBy: { sort: "asc" } }, client: true } });
  if (!inv) notFound();
  return (
    <>
      <PageHeader title={inv.number} description={<StatusBadge status={inv.status} />} back={{ href: "/portal/invoices", label: "Invoices" }} actions={<PrintButton />} />
      <DocumentView d={invoiceDoc(inv, ctx.org)} />
    </>
  );
}
