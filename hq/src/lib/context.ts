import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { Feature } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import { getSession } from "./auth";
import { permissionFeature, type PermissionKey } from "./permissions";
import { prisma } from "./prisma";
import { withTenant } from "./tenant";

/**
 * Everything a request inside an organisation needs: who the user is, which
 * organisation they are acting in, what their role allows, which modules the
 * organisation has, and a database client that is locked to that organisation.
 */
export const getOrgContext = cache(async () => {
  const session = await getSession();
  if (!session?.activeOrgId) return null;

  const membership = await prisma.membership.findUnique({
    where: { organizationId_userId: { organizationId: session.activeOrgId, userId: session.userId } },
    include: {
      organization: { include: { features: true } },
      role: { include: { permissions: true } },
      client: true,
    },
  });
  if (!membership || membership.status !== "ACTIVE") return null;
  const org = membership.organization;
  if (org.status !== "ACTIVE") return null;

  const features = new Set<Feature>(org.features.filter((f) => f.enabled).map((f) => f.feature));
  if (membership.type === "CLIENT" && (!features.has("CLIENT_PORTAL") || !membership.clientId)) return null;

  // A permission only counts when the module it belongs to is switched on.
  const permissions = new Set<string>(
    membership.role.permissions
      .map((p) => p.permissionKey)
      .filter((k) => {
        const f = permissionFeature(k);
        return !f || features.has(f);
      }),
  );

  const userId = session.userId;
  const assignedOnly = membership.role.dataScope === "ASSIGNED";

  return {
    session,
    user: session.user,
    userId,
    org,
    orgId: org.id,
    membership,
    role: membership.role,
    type: membership.type,
    clientId: membership.clientId,
    features,
    permissions,
    assignedOnly,
    db: withTenant(prisma, org.id),
    can: (perm: PermissionKey) => permissions.has(perm),
    has: (feature: Feature) => features.has(feature),
  };
});

export type OrgContext = NonNullable<Awaited<ReturnType<typeof getOrgContext>>>;

async function resolve() {
  const session = await getSession();
  if (!session) redirect("/login");
  const ctx = await getOrgContext();
  if (!ctx) redirect("/select-org");
  return ctx;
}

/** Staff-only area. Optionally require one or more permissions (all must match). */
export async function requireStaff(...perms: PermissionKey[]) {
  const ctx = await resolve();
  if (ctx.type !== "STAFF") redirect("/portal");
  if (perms.some((p) => !ctx.can(p))) redirect("/app/denied");
  return ctx;
}

/** Client-portal area, bound to the member's own client company. */
export async function requireClient(...perms: PermissionKey[]) {
  const ctx = await resolve();
  if (ctx.type !== "CLIENT" || !ctx.clientId) redirect("/app");
  if (perms.some((p) => !ctx.can(p))) redirect("/portal");
  return { ...ctx, clientId: ctx.clientId };
}

/** For server actions: throws instead of redirecting when access is missing. */
export async function authorize(...perms: PermissionKey[]) {
  const ctx = await getOrgContext();
  if (!ctx || ctx.type !== "STAFF") throw new Error("Not signed in to an organisation");
  const missing = perms.filter((p) => !ctx.can(p));
  if (missing.length) throw new Error(`Missing permission: ${missing.join(", ")}`);
  return ctx;
}

export async function authorizeClient(...perms: PermissionKey[]) {
  const ctx = await getOrgContext();
  if (!ctx || ctx.type !== "CLIENT" || !ctx.clientId) throw new Error("Not signed in to a client portal");
  if (perms.some((p) => !ctx.can(p))) throw new Error("Not allowed");
  return { ...ctx, clientId: ctx.clientId };
}

// ─── Record-level scope for roles limited to "assigned" work ───

export function projectScope(ctx: OrgContext): Prisma.ProjectWhereInput {
  if (!ctx.assignedOnly) return {};
  return { OR: [{ managerId: ctx.userId }, { members: { some: { userId: ctx.userId } } }] };
}

export function ticketScope(ctx: OrgContext): Prisma.TicketWhereInput {
  if (!ctx.assignedOnly) return {};
  return {
    OR: [{ assigneeId: ctx.userId }, { raisedById: ctx.userId }, { project: projectScope(ctx) }],
  };
}

export function leadScope(ctx: OrgContext): Prisma.LeadWhereInput {
  return ctx.assignedOnly ? { ownerId: ctx.userId } : {};
}

export function clientScope(ctx: OrgContext): Prisma.ClientWhereInput {
  if (!ctx.assignedOnly) return {};
  return {
    OR: [
      { ownerId: ctx.userId },
      { projects: { some: projectScope(ctx) } },
      { tickets: { some: { assigneeId: ctx.userId } } },
    ],
  };
}

export function careScope(ctx: OrgContext): Prisma.CareSubscriptionWhereInput {
  return ctx.assignedOnly ? { client: clientScope(ctx) } : {};
}

export async function audit(ctx: OrgContext, action: string, entityType: string, entityId: string | null, summary: string) {
  await ctx.db.auditLog.create({
    data: { organizationId: ctx.orgId, userId: ctx.userId, action, entityType, entityId, summary },
  });
}
