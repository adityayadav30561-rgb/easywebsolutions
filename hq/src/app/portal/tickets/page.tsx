import type { Metadata } from "next";
import Link from "next/link";
import { Badge, PageHeader, Table } from "@/components/ui";
import { requireClient } from "@/lib/context";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Support requests" };

export default async function PortalTickets() {
  const ctx = await requireClient("portal:tickets");
  const tickets = await ctx.db.ticket.findMany({ where: { clientId: ctx.clientId }, include: { status: true, priority: true }, orderBy: { updatedAt: "desc" }, take: 300 });
  return (
    <>
      <PageHeader
        title="Support requests"
        description="Changes, questions and anything that needs fixing."
        actions={
          <Link href="/portal/tickets/new" className="btn-primary">
            New request
          </Link>
        }
      />
      <Table head={["Request", "Status", "Priority", "Opened", "Last update"]}>
        {tickets.map((t) => (
          <tr key={t.id}>
            <td>
              <Link href={`/portal/tickets/${t.id}`} className="link">
                {t.subject}
              </Link>
              <div className="text-xs text-grey">{t.number}</div>
            </td>
            <td>
              <Badge color={t.status.color}>{t.status.name}</Badge>
            </td>
            <td>
              <Badge color={t.priority.color}>{t.priority.name}</Badge>
            </td>
            <td className="text-grey">{formatDate(t.createdAt)}</td>
            <td className="text-grey">{formatDate(t.updatedAt)}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
