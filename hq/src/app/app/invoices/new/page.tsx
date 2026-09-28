import type { Metadata } from "next";
import { daysFromNow } from "@/lib/utils";
import { PageHeader } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { InvoiceForm } from "../InvoiceForm";

export const metadata: Metadata = { title: "New invoice" };

export default async function NewInvoice({ searchParams }: PageProps<"/app/invoices/new">) {
  const ctx = await requireStaff("invoices:write");
  const { clientId } = await searchParams;
  const term = await ctx.db.paymentTerm.findFirst({ where: { isDefault: true } });
  return (
    <>
      <PageHeader title="New invoice" description="The number is assigned automatically when you save." back={{ href: "/app/invoices", label: "Invoices" }} />
      <InvoiceForm
        ctx={ctx}
        inv={{
          clientId: typeof clientId === "string" ? clientId : null,
          issueDate: new Date(),
          dueDate: daysFromNow(term?.dueDays ?? 15),
          notes: ctx.org.invoiceNotes,
          lines: [],
        }}
      />
    </>
  );
}
