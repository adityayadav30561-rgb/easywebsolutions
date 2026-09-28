import type { DocData } from "@/components/DocumentView";

type Org = DocData["org"] & Record<string, unknown>;
type Party = { name: string; email?: string | null; address?: string | null; city?: string | null; country?: string | null; taxId?: string | null } | null;
type Items = DocData["items"];

type Quote = {
  number: string;
  title: string;
  status: string;
  issueDate: Date;
  validUntil: Date | null;
  currencyCode: string;
  subtotal: unknown;
  discountTotal: unknown;
  taxTotal: unknown;
  total: unknown;
  notes: string | null;
  terms: string | null;
  items: Items;
  client: Party;
  lead: { contactName: string | null; companyName: string | null; email: string | null; title: string } | null;
};

type Invoice = Omit<Quote, "title" | "validUntil" | "terms" | "lead"> & { dueDate: Date | null; amountPaid: unknown };

function partyLines(p: Party) {
  if (!p) return [];
  return [p.address, [p.city, p.country].filter(Boolean).join(", "), p.email, p.taxId ? `Tax ID: ${p.taxId}` : null];
}

export function quoteDoc(q: Quote, org: Org): DocData {
  const to = q.client
    ? { name: q.client.name, lines: partyLines(q.client) }
    : { name: q.lead?.companyName || q.lead?.contactName || "—", lines: [q.lead?.companyName ? q.lead.contactName : null, q.lead?.email] };
  return {
    kind: "Quotation",
    number: q.number,
    title: q.title,
    status: q.status,
    issueDate: q.issueDate,
    secondDateLabel: "Valid until",
    secondDate: q.validUntil,
    currency: q.currencyCode,
    org,
    to,
    items: q.items,
    subtotal: q.subtotal,
    discountTotal: q.discountTotal,
    taxTotal: q.taxTotal,
    total: q.total,
    notes: q.notes,
    terms: q.terms,
  };
}

export function invoiceDoc(i: Invoice, org: Org): DocData {
  return {
    kind: "Invoice",
    number: i.number,
    status: i.status,
    issueDate: i.issueDate,
    secondDateLabel: "Due",
    secondDate: i.dueDate,
    currency: i.currencyCode,
    org,
    to: { name: i.client?.name ?? "—", lines: partyLines(i.client) },
    items: i.items,
    subtotal: i.subtotal,
    discountTotal: i.discountTotal,
    taxTotal: i.taxTotal,
    total: i.total,
    amountPaid: i.amountPaid,
    notes: i.notes,
  };
}
