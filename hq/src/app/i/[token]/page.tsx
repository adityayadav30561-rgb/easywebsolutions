import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentView } from "@/components/DocumentView";
import { PrintButton } from "@/components/forms";
import { invoiceDoc } from "@/lib/docdata";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Invoice", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function PublicInvoice({ params }: PageProps<"/i/[token]">) {
  const { token } = await params;
  const inv = await prisma.invoice.findUnique({
    where: { publicToken: token },
    include: { organization: true, items: { orderBy: { sort: "asc" } }, client: true },
  });
  if (!inv || inv.organization.status !== "ACTIVE" || inv.status === "DRAFT") notFound();

  return (
    <main className="min-h-dvh bg-paper px-4 py-8 sm:py-12">
      <div className="no-print mx-auto mb-6 flex max-w-4xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-grey">
          Invoice from <strong className="text-ink">{inv.organization.name}</strong>
        </p>
        <PrintButton />
      </div>
      {inv.status === "VOID" && <p className="mx-auto mb-4 max-w-4xl rounded-xl bg-zinc-100 p-4 text-sm text-grey">This invoice has been cancelled.</p>}
      {inv.status === "PAID" && <p className="no-print mx-auto mb-4 max-w-4xl rounded-xl bg-green-50 p-4 text-sm text-green-800">Paid in full — thank you.</p>}
      <DocumentView d={invoiceDoc(inv, inv.organization)} />
    </main>
  );
}
