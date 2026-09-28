import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/forms";
import { Avatar, Badge, Card, PageHeader } from "@/components/ui";
import { requireClient } from "@/lib/context";
import { userNames } from "@/lib/lookups";
import { cn, formatDateTime } from "@/lib/utils";
import { replyAsClient } from "../../actions";

export const metadata: Metadata = { title: "Request" };

export default async function PortalTicket({ params }: PageProps<"/portal/tickets/[id]">) {
  const ctx = await requireClient("portal:tickets");
  const { id } = await params;
  const t = await ctx.db.ticket.findFirst({
    where: { id, clientId: ctx.clientId },
    // Internal notes are never loaded for client users.
    include: { status: true, priority: true, comments: { where: { isInternal: false }, orderBy: { createdAt: "asc" } } },
  });
  if (!t) notFound();
  const names = await userNames(ctx, [t.raisedById, ...t.comments.map((c) => c.authorId)]);

  return (
    <>
      <PageHeader
        title={t.subject}
        description={
          <span className="flex items-center gap-2">
            {t.number} <Badge color={t.status.color}>{t.status.name}</Badge>
          </span>
        }
        back={{ href: "/portal/tickets", label: "Support requests" }}
      />
      <div className="max-w-3xl space-y-4">
        <article className="card p-5">
          <p className="mb-2 text-xs text-grey">
            {t.raisedById ? names.get(t.raisedById) : ctx.org.name} · {formatDateTime(t.createdAt)}
          </p>
          <p className="text-sm whitespace-pre-wrap">{t.description}</p>
        </article>
        {t.comments.map((c) => {
          const mine = c.authorId === ctx.userId;
          return (
            <article key={c.id} className={cn("rounded-xl border p-5", mine ? "border-line bg-white" : "border-violet-100 bg-violet-50/50")}>
              <header className="mb-2 flex items-center gap-2 text-sm">
                <Avatar name={(c.authorId && names.get(c.authorId)) || ctx.org.name} />
                <span className="font-medium">{(c.authorId && names.get(c.authorId)) || ctx.org.name}</span>
                <span className="text-xs text-grey">{formatDateTime(c.createdAt)}</span>
              </header>
              <p className="text-sm whitespace-pre-wrap">{c.body}</p>
            </article>
          );
        })}
        <Card>
          <ActionForm action={replyAsClient.bind(null, id)} reset submit="Send reply">
            <textarea name="body" rows={4} className="input" placeholder="Write a reply…" required aria-label="Reply" />
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
