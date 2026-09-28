import "server-only";
import type { TicketSource } from "@/generated/prisma/enums";
import type { TenantDb } from "./tenant";
import { nextNumber } from "./numbering";
import { prisma } from "./prisma";

/**
 * Shared ticket creation for staff and the client portal. The caller has
 * already checked that client / project / subscription belong to the tenant.
 */
export async function createTicket(
  db: TenantDb,
  organizationId: string,
  input: {
    subject: string;
    description: string;
    clientId: string;
    projectId?: string | null;
    subscriptionId?: string | null;
    priorityId?: string | null;
    categoryId?: string | null;
    assigneeId?: string | null;
    raisedById: string;
    source: TicketSource;
  },
) {
  const [status, priority] = await Promise.all([
    db.ticketStatus.findFirst({ where: { isActive: true, isClosed: false }, orderBy: [{ isDefault: "desc" }, { sort: "asc" }] }),
    input.priorityId
      ? db.ticketPriority.findUnique({ where: { id: input.priorityId } })
      : db.ticketPriority.findFirst({ where: { isActive: true }, orderBy: [{ isDefault: "desc" }, { sort: "asc" }] }),
  ]);
  if (!status) throw new Error("Set up at least one open ticket status in Masters first");
  if (!priority) throw new Error("Set up at least one ticket priority in Masters first");

  const dueAt = priority.slaHours ? new Date(Date.now() + priority.slaHours * 3_600_000) : null;
  return db.ticket.create({
    data: {
      organizationId,
      number: await nextNumber(prisma, organizationId, "TICKET"),
      subject: input.subject,
      description: input.description,
      clientId: input.clientId,
      projectId: input.projectId ?? null,
      subscriptionId: input.subscriptionId ?? null,
      statusId: status.id,
      priorityId: priority.id,
      categoryId: input.categoryId ?? null,
      assigneeId: input.assigneeId ?? null,
      raisedById: input.raisedById,
      source: input.source,
      dueAt,
    },
  });
}
