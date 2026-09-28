import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionButton, ActionForm } from "@/components/forms";
import { Avatar, Badge, Card, Field, PageHeader } from "@/components/ui";
import { requireStaff, ticketScope } from "@/lib/context";
import { staffOptions, userNames } from "@/lib/lookups";
import { prisma } from "@/lib/prisma";
import { cn, formatDate, formatDateTime, hoursFromMinutes, toDateInput } from "@/lib/utils";
import { deleteTicket, logTime, replyTicket, updateTicket } from "../actions";

export const metadata: Metadata = { title: "Ticket" };

export default async function TicketPage({ params }: PageProps<"/app/tickets/[id]">) {
  const ctx = await requireStaff("tickets:read");
  const { id } = await params;
  const ticket = await ctx.db.ticket.findFirst({
    where: { id, ...ticketScope(ctx) },
    include: {
      client: true,
      project: true,
      status: true,
      priority: true,
      category: true,
      subscription: { include: { plan: true } },
      comments: { orderBy: { createdAt: "asc" } },
      timeLogs: { orderBy: { workDate: "desc" } },
    },
  });
  if (!ticket) notFound();

  const care = ctx.has("CARE_PLANS");
  const [statuses, priorities, categories, projects, subs, staff, events] = await Promise.all([
    ctx.db.ticketStatus.findMany({ where: { OR: [{ isActive: true }, { id: ticket.statusId }] }, orderBy: { sort: "asc" } }),
    ctx.db.ticketPriority.findMany({ where: { OR: [{ isActive: true }, { id: ticket.priorityId }] }, orderBy: { sort: "asc" } }),
    ctx.db.ticketCategory.findMany({ where: { OR: [{ isActive: true }, { id: ticket.categoryId ?? "" }] }, orderBy: { sort: "asc" } }),
    ctx.db.project.findMany({ where: { clientId: ticket.clientId }, select: { id: true, name: true } }),
    care ? ctx.db.careSubscription.findMany({ where: { clientId: ticket.clientId }, include: { plan: true } }) : [],
    staffOptions(ctx),
    ctx.db.activity.findMany({ where: { entityType: "TICKET", entityId: id }, orderBy: { createdAt: "asc" } }),
  ]);
  // Authors can be staff or client users of this organisation.
  const authorIds = [ticket.raisedById, ticket.assigneeId, ...ticket.comments.map((c) => c.authorId), ...events.map((e) => e.userId), ...ticket.timeLogs.map((t) => t.userId)];
  const names = await userNames(ctx, authorIds);
  const clientUsers = new Set(
    (await prisma.membership.findMany({ where: { organizationId: ctx.orgId, type: "CLIENT", userId: { in: authorIds.filter((x): x is string => !!x) } }, select: { userId: true } })).map((m) => m.userId),
  );

  const feed = [
    ...ticket.comments.map((c) => ({ kind: "comment" as const, at: c.createdAt, c })),
    ...events.map((e) => ({ kind: "event" as const, at: e.createdAt, e })),
  ].sort((a, b) => a.at.getTime() - b.at.getTime());
  const write = ctx.can("tickets:write");
  const minutes = ticket.timeLogs.reduce((s, t) => s + t.minutes, 0);
  const late = ticket.dueAt && ticket.dueAt < new Date() && !ticket.status.isClosed;

  return (
    <>
      <PageHeader
        title={ticket.subject}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {ticket.number} ·{" "}
            <Link className="link" href={`/app/clients/${ticket.clientId}`}>
              {ticket.client.name}
            </Link>
            <Badge color={ticket.status.color}>{ticket.status.name}</Badge>
            <Badge color={ticket.priority.color}>{ticket.priority.name}</Badge>
            {late && <Badge tone="red">Overdue</Badge>}
          </span>
        }
        back={{ href: "/app/tickets", label: "Tickets" }}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <article className="card p-5">
            <header className="mb-3 flex items-center gap-2 text-sm">
              <Avatar name={names.get(ticket.raisedById ?? "") ?? "?"} />
              <span className="font-medium">{ticket.raisedById ? names.get(ticket.raisedById) ?? "Unknown" : "—"}</span>
              <span className="text-grey">
                opened via {ticket.source.toLowerCase()} · {formatDateTime(ticket.createdAt)}
              </span>
            </header>
            <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
          </article>

          {feed.map((item) =>
            item.kind === "event" ? (
              <p key={item.e.id} className="px-2 text-xs text-grey">
                {item.e.userId ? names.get(item.e.userId) : "System"} · {item.e.content} · {formatDateTime(item.at)}
              </p>
            ) : (
              <article
                key={item.c.id}
                className={cn("rounded-xl border p-5", item.c.isInternal ? "border-amber-200 bg-amber-50/60" : clientUsers.has(item.c.authorId ?? "") ? "border-line bg-white" : "border-violet-100 bg-violet-50/40")}
              >
                <header className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                  <Avatar name={names.get(item.c.authorId ?? "") ?? "?"} />
                  <span className="font-medium">{item.c.authorId ? names.get(item.c.authorId) ?? "Former user" : "—"}</span>
                  {clientUsers.has(item.c.authorId ?? "") && <Badge>Client</Badge>}
                  {item.c.isInternal && <Badge tone="amber">Internal note</Badge>}
                  <span className="text-xs text-grey">{formatDateTime(item.at)}</span>
                </header>
                <p className="text-sm whitespace-pre-wrap">{item.c.body}</p>
              </article>
            ),
          )}

          {write && (
            <Card>
              <ActionForm action={replyTicket.bind(null, id)} reset submit="Send" className="space-y-3">
                <textarea name="body" rows={4} className="input" placeholder="Write a reply…" required aria-label="Reply" />
                <label className="flex items-center gap-2 text-sm text-grey">
                  <input type="checkbox" name="isInternal" /> Internal note (never shown to the client)
                </label>
              </ActionForm>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Properties">
            {write ? (
              <ActionForm action={updateTicket.bind(null, id)} submit="Update" submitClassName="btn-secondary btn-sm" className="space-y-3">
                <Field label="Status">
                  <select name="statusId" className="input" defaultValue={ticket.statusId}>
                    {statuses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Priority">
                  <select name="priorityId" className="input" defaultValue={ticket.priorityId}>
                    {priorities.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </Field>
                {ctx.can("tickets:assign") && (
                  <Field label="Assignee">
                    <select name="assigneeId" className="input" defaultValue={ticket.assigneeId ?? ""}>
                      <option value="">Unassigned</option>
                      {staff.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
                <Field label="Category">
                  <select name="categoryId" className="input" defaultValue={ticket.categoryId ?? ""}>
                    <option value="">—</option>
                    {categories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Project">
                  <select name="projectId" className="input" defaultValue={ticket.projectId ?? ""}>
                    <option value="">—</option>
                    {projects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </Field>
                {care && (
                  <Field label="Care plan">
                    <select name="subscriptionId" className="input" defaultValue={ticket.subscriptionId ?? ""}>
                      <option value="">—</option>
                      {subs.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.plan.name} {s.websiteUrl ? `· ${s.websiteUrl}` : ""}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
                <Field label="Due">
                  <input type="date" name="dueAt" className="input" defaultValue={toDateInput(ticket.dueAt)} />
                </Field>
              </ActionForm>
            ) : (
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-grey">Assignee</dt><dd>{ticket.assigneeId ? names.get(ticket.assigneeId) : "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-grey">Category</dt><dd>{ticket.category?.name ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-grey">Due</dt><dd>{formatDate(ticket.dueAt)}</dd></div>
              </dl>
            )}
            {ticket.resolvedAt && <p className="mt-3 text-xs text-grey">Resolved {formatDateTime(ticket.resolvedAt)}</p>}
          </Card>

          {care && ticket.subscription && (
            <Card title={`Time on ${ticket.subscription.plan.name} plan`}>
              <p className="text-sm">
                <span className="font-display text-xl font-semibold">{hoursFromMinutes(minutes)}</span> <span className="text-grey">logged on this ticket</span>
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-grey">
                {ticket.timeLogs.map((t) => (
                  <li key={t.id}>
                    {formatDate(t.workDate)} · {hoursFromMinutes(t.minutes)} · {t.userId ? names.get(t.userId) : ""} — {t.description}
                  </li>
                ))}
              </ul>
              {ctx.can("timelogs:write") && (
                <ActionForm action={logTime.bind(null, id)} reset submit="Log time" submitClassName="btn-secondary btn-sm" className="mt-4 space-y-2 border-t border-line pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <input name="minutes" type="number" min="1" step="1" className="input" placeholder="Minutes" required aria-label="Minutes" />
                    <input name="workDate" type="date" className="input" defaultValue={toDateInput(new Date())} aria-label="Date" />
                  </div>
                  <input name="description" className="input" placeholder="What was done" aria-label="Work description" />
                </ActionForm>
              )}
              <Link href={`/app/care/${ticket.subscription.id}`} className="mt-3 inline-block text-xs font-medium text-violet-700 hover:underline">
                View plan usage →
              </Link>
            </Card>
          )}

          {ctx.can("tickets:delete") && (
            <ActionButton action={deleteTicket.bind(null, id)} className="btn-danger btn-sm" confirm="Delete this ticket permanently?">
              Delete ticket
            </ActionButton>
          )}
        </div>
      </div>
    </>
  );
}
