import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { Badge, PageHeader, Table, Tabs } from "@/components/ui";
import { requireStaff, ticketScope } from "@/lib/context";
import { userNames } from "@/lib/lookups";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Tickets" };

export default async function Tickets({ searchParams }: PageProps<"/app/tickets">) {
  const ctx = await requireStaff("tickets:read");
  const sp = await searchParams;
  const view = typeof sp.view === "string" && ["open", "closed", "all"].includes(sp.view) ? sp.view : "open";
  const mine = sp.mine === "1";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const priorityId = typeof sp.priority === "string" ? sp.priority : "";

  const where: Prisma.TicketWhereInput = {
    AND: [
      ticketScope(ctx),
      view === "open" ? { status: { isClosed: false } } : view === "closed" ? { status: { isClosed: true } } : {},
      mine ? { assigneeId: ctx.userId } : {},
      priorityId ? { priorityId } : {},
      q ? { OR: [{ subject: { contains: q, mode: "insensitive" } }, { number: { contains: q, mode: "insensitive" } }, { client: { name: { contains: q, mode: "insensitive" } } }] } : {},
    ],
  };
  const [tickets, priorities] = await Promise.all([
    ctx.db.ticket.findMany({
      where,
      include: { client: { select: { name: true } }, status: true, priority: true, category: true, subscription: { select: { id: true } } },
      orderBy: [{ updatedAt: "desc" }],
      take: 500,
    }),
    ctx.db.ticketPriority.findMany({ orderBy: { sort: "asc" } }),
  ]);
  const names = await userNames(ctx, tickets.map((t) => t.assigneeId));
  const qs = (patch: Record<string, string>) => {
    const all: Record<string, string> = { view, mine: mine ? "1" : "", q, priority: priorityId, ...patch };
    const p = new URLSearchParams(Object.entries(all).filter(([, v]) => v));
    return `/app/tickets?${p}`;
  };

  return (
    <>
      <PageHeader
        title="Tickets"
        actions={
          <>
            <form className="flex gap-2">
              <input type="hidden" name="view" value={view} />
              {mine && <input type="hidden" name="mine" value="1" />}
              <select name="priority" defaultValue={priorityId} className="input w-36" aria-label="Priority">
                <option value="">Any priority</option>
                {priorities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input name="q" defaultValue={q} placeholder="Search" className="input w-40" aria-label="Search tickets" />
              <button className="btn-secondary">Filter</button>
            </form>
            {ctx.can("tickets:write") && (
              <Link href="/app/tickets/new" className="btn-primary">
                New ticket
              </Link>
            )}
          </>
        }
      />
      <Tabs
        current={mine ? "mine" : view}
        items={[
          { key: "open", label: "Open", href: qs({ view: "open", mine: "" }) },
          { key: "mine", label: "Assigned to me", href: qs({ view: "open", mine: "1" }) },
          { key: "closed", label: "Closed", href: qs({ view: "closed", mine: "" }) },
          { key: "all", label: "All", href: qs({ view: "all", mine: "" }) },
        ]}
      />
      <Table head={["Ticket", "Client", "Status", "Priority", "Assignee", "Due", "Updated"]}>
        {tickets.map((t) => {
          const late = t.dueAt && t.dueAt < new Date() && !t.status.isClosed;
          return (
            <tr key={t.id}>
              <td className="max-w-md">
                <Link href={`/app/tickets/${t.id}`} className="link">
                  {t.subject}
                </Link>
                <div className="text-xs text-grey">
                  {t.number}
                  {t.category ? ` · ${t.category.name}` : ""}
                  {t.subscription ? " · care plan" : ""}
                </div>
              </td>
              <td className="text-grey">{t.client.name}</td>
              <td>
                <Badge color={t.status.color}>{t.status.name}</Badge>
              </td>
              <td>
                <Badge color={t.priority.color}>{t.priority.name}</Badge>
              </td>
              <td className="text-grey">{t.assigneeId ? names.get(t.assigneeId) : "—"}</td>
              <td className={late ? "font-medium text-red-700" : "text-grey"}>{formatDate(t.dueAt)}</td>
              <td className="text-grey">{formatDate(t.updatedAt)}</td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
