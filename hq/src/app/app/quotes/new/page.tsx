import type { Metadata } from "next";
import { daysFromNow } from "@/lib/utils";
import { PageHeader } from "@/components/ui";
import { leadScope, requireStaff } from "@/lib/context";
import { editorCatalogue } from "@/lib/documents";
import { QuoteForm } from "../QuoteForm";

export const metadata: Metadata = { title: "New quotation" };

/**
 * Quotations are generated from what the CRM already knows: the client or
 * lead, a package or catalogue items, the agency's default terms and payment
 * terms, and the next number in the agency's sequence.
 */
export default async function NewQuote({ searchParams }: PageProps<"/app/quotes/new">) {
  const ctx = await requireStaff("quotes:write");
  const sp = await searchParams;
  const s = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : null);
  const clientId = s("clientId");
  const leadId = s("leadId");
  const packageId = s("packageId");

  const [client, lead, catalogue] = await Promise.all([
    clientId ? ctx.db.client.findUnique({ where: { id: clientId } }) : null,
    leadId ? ctx.db.lead.findFirst({ where: { id: leadId, ...leadScope(ctx) } }) : null,
    editorCatalogue(ctx),
  ]);
  const pkg = packageId ? catalogue.packages.find((p) => p.id === packageId) : undefined;

  return (
    <>
      <PageHeader title="New quotation" description="The number is assigned automatically when you save." back={{ href: "/app/quotes", label: "Quotations" }} />
      <QuoteForm
        ctx={ctx}
        q={{
          title: lead?.title ?? (client ? `Website for ${client.name}` : ""),
          clientId: client?.id ?? null,
          leadId: client ? null : (lead?.id ?? null),
          paymentTermId: null,
          packageId: pkg?.id ?? null,
          validUntil: daysFromNow(30),
          notes: null,
          terms: ctx.org.quoteTerms,
          lines: pkg?.lines ?? [],
        }}
      />
    </>
  );
}
