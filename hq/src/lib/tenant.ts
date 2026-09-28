import type { PrismaClient } from "@/generated/prisma/client";

/**
 * Tenant isolation.
 *
 * `withTenant(client, orgId)` returns a Prisma client that can only ever read
 * or write rows belonging to `orgId`:
 *
 *  - every read / update / delete gets `organizationId = orgId` added to its
 *    `where` (unique lookups too, via Prisma's extended where-unique), so a
 *    record id from another agency simply resolves to "not found";
 *  - every create gets `organizationId` forced to `orgId`, overriding anything
 *    supplied by the caller.
 *
 * Nested relation writes are not rewritten, so tenant rows must be created at
 * the top level (or with `organizationId` passed explicitly).
 */
export const TENANT_MODELS = new Set([
  "Role",
  "Membership",
  "Invitation",
  "OrganizationFeature",
  "LeadSource",
  "PipelineStage",
  "ProjectStatus",
  "TicketStatus",
  "TicketPriority",
  "TicketCategory",
  "TaxRate",
  "ServiceItem",
  "Package",
  "PaymentTerm",
  "NumberSequence",
  "Client",
  "Contact",
  "Lead",
  "Activity",
  "Project",
  "Task",
  "Ticket",
  "TicketComment",
  "Quotation",
  "QuotationItem",
  "Invoice",
  "InvoiceItem",
  "Payment",
  "CarePlan",
  "CareSubscription",
  "CareTimeLog",
  "AuditLog",
]);

const WHERE_OPS = new Set([
  "findMany",
  "findFirst",
  "findFirstOrThrow",
  "findUnique",
  "findUniqueOrThrow",
  "count",
  "aggregate",
  "groupBy",
  "update",
  "updateMany",
  "updateManyAndReturn",
  "delete",
  "deleteMany",
  "upsert",
]);

type Args = Record<string, unknown>;

export function withTenant(client: PrismaClient, organizationId: string) {
  if (!organizationId) throw new Error("withTenant: organizationId is required");

  return client.$extends({
    name: "tenant",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!TENANT_MODELS.has(model)) {
            throw new Error(`${model} is not a tenant model — use the scoped parent relation instead`);
          }
          const a = { ...(args as Args) };

          if (WHERE_OPS.has(operation)) {
            const unique = operation.startsWith("findUnique") || operation === "update" || operation === "delete" || operation === "upsert";
            a.where = unique
              ? { ...((a.where as Args) ?? {}), organizationId }
              : { AND: [(a.where as Args) ?? {}, { organizationId }] };
          }

          if (operation === "create") a.data = { ...(a.data as Args), organizationId };
          if (operation === "upsert") a.create = { ...(a.create as Args), organizationId };
          if (operation === "update" || operation === "updateMany" || operation === "upsert") {
            const key = operation === "upsert" ? "update" : "data";
            if (a[key] && "organizationId" in (a[key] as Args)) {
              throw new Error("organizationId cannot be changed");
            }
          }
          if (operation === "createMany" || operation === "createManyAndReturn") {
            const rows = Array.isArray(a.data) ? a.data : [a.data];
            a.data = rows.map((r) => ({ ...(r as Args), organizationId }));
          }

          return query(a as typeof args);
        },
      },
    },
  });
}

export type TenantDb = ReturnType<typeof withTenant>;
