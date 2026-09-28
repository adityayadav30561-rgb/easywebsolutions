import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentView } from "@/components/DocumentView";
import { ActionButton, ActionForm, PrintButton } from "@/components/forms";
import { Field } from "@/components/ui";
import { quoteDoc } from "@/lib/docdata";
import { prisma } from "@/lib/prisma";
import { formatDateTime, daysFromNow } from "@/lib/utils";
import { acceptQuote, declineQuote } from "../actions";

export const metadata: Metadata = { title: "Quotation", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function PublicQuote({ params }: PageProps<"/q/[token]">) {
  const { token } = await params;
  const q = await prisma.quotation.findUnique({
    where: { publicToken: token },
    include: { organization: true, items: { orderBy: { sort: "asc" } }, client: true, lead: true },
  });
  if (!q || q.organization.status !== "ACTIVE" || q.status === "DRAFT") notFound();

  const expired = q.status === "EXPIRED" || (q.status === "SENT" && q.validUntil && q.validUntil < daysFromNow(-1));

  return (
    <main className="min-h-dvh bg-paper px-4 py-8 sm:py-12">
      <div className="no-print mx-auto mb-6 flex max-w-4xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-grey">
          Quotation from <strong className="text-ink">{q.organization.name}</strong>
        </p>
        <PrintButton />
      </div>

      <DocumentView d={quoteDoc(q, q.organization)} />

      <section className="no-print mx-auto mt-6 max-w-4xl">
        {q.status === "SENT" && !expired && (
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold">Happy to go ahead?</h2>
            <p className="mt-1 text-sm text-grey">Accepting lets {q.organization.name} know you&apos;d like to proceed on the terms above.</p>
            <ActionForm action={acceptQuote.bind(null, token)} submit="Accept quotation" className="mt-4 space-y-3">
              <Field label="Your full name">
                <input name="name" className="input max-w-sm" required autoComplete="name" />
              </Field>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" name="agree" required className="mt-0.5" /> I accept this quotation and its terms.
              </label>
            </ActionForm>
            <div className="mt-4 border-t border-line pt-4 text-sm text-grey">
              Not what you need?{" "}
              <ActionButton action={declineQuote.bind(null, token)} className="btn-ghost btn-sm" confirm="Decline this quotation?">
                Decline quotation
              </ActionButton>
            </div>
          </div>
        )}
        {(q.status === "ACCEPTED" || q.status === "INVOICED") && (
          <p className="rounded-xl bg-green-50 p-5 text-sm text-green-800">
            Accepted{q.acceptedAt ? ` on ${formatDateTime(q.acceptedAt)}` : ""}
            {q.acceptedByName ? ` by ${q.acceptedByName}` : ""}. Thank you!
          </p>
        )}
        {q.status === "REJECTED" && <p className="rounded-xl bg-zinc-100 p-5 text-sm text-grey">This quotation was declined.</p>}
        {expired && <p className="rounded-xl bg-amber-50 p-5 text-sm text-amber-800">This quotation has expired. Please contact {q.organization.name} for an updated one.</p>}
      </section>
    </main>
  );
}
