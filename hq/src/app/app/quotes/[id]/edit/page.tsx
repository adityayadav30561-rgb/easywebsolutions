import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { toEditorLines } from "@/lib/documents";
import { QuoteForm } from "../../QuoteForm";

export const metadata: Metadata = { title: "Edit quotation" };

export default async function EditQuote({ params }: PageProps<"/app/quotes/[id]/edit">) {
  const ctx = await requireStaff("quotes:write");
  const { id } = await params;
  const q = await ctx.db.quotation.findUnique({ where: { id }, include: { items: { orderBy: { sort: "asc" } } } });
  if (!q) notFound();
  if (["ACCEPTED", "INVOICED"].includes(q.status)) redirect(`/app/quotes/${id}`);
  return (
    <>
      <PageHeader title={`Edit ${q.number}`} back={{ href: `/app/quotes/${id}`, label: q.number }} />
      <QuoteForm ctx={ctx} q={{ ...q, lines: toEditorLines(q.items) }} />
    </>
  );
}
