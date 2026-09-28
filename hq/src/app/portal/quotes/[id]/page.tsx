import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentView } from "@/components/DocumentView";
import { PrintButton } from "@/components/forms";
import { PageHeader, StatusBadge } from "@/components/ui";
import { requireClient } from "@/lib/context";
import { quoteDoc } from "@/lib/docdata";

export const metadata: Metadata = { title: "Quotation" };

export default async function PortalQuote({ params }: PageProps<"/portal/quotes/[id]">) {
  const ctx = await requireClient("portal:quotes");
  const { id } = await params;
  const q = await ctx.db.quotation.findFirst({ where: { id, clientId: ctx.clientId, status: { not: "DRAFT" } }, include: { items: { orderBy: { sort: "asc" } }, client: true, lead: true } });
  if (!q) notFound();
  return (
    <>
      <PageHeader
        title={q.number}
        description={<StatusBadge status={q.status} />}
        back={{ href: "/portal/quotes", label: "Quotations" }}
        actions={
          <>
            {q.status === "SENT" && (
              <Link href={`/q/${q.publicToken}`} className="btn-primary">
                Review & accept
              </Link>
            )}
            <PrintButton />
          </>
        }
      />
      <DocumentView d={quoteDoc(q, ctx.org)} />
    </>
  );
}
