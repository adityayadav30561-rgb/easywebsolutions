import "server-only";
import { hashToken, newToken } from "./auth";
import type { OrgContext } from "./context";
import { appUrl } from "./guard";

/**
 * Create an invitation and return the one-time link. Only the token's hash is
 * stored, so the link can't be recovered later — a new invite replaces it.
 */
export async function createInvitation(ctx: OrgContext, input: { email: string; name?: string | null; roleId: string; clientId?: string | null }) {
  const token = newToken();
  await ctx.db.invitation.deleteMany({ where: { email: input.email, acceptedAt: null } });
  await ctx.db.invitation.create({
    data: {
      organizationId: ctx.orgId,
      email: input.email,
      name: input.name ?? null,
      roleId: input.roleId,
      clientId: input.clientId ?? null,
      tokenHash: hashToken(token),
      invitedById: ctx.userId,
      expiresAt: new Date(Date.now() + 7 * 86_400_000),
    },
  });
  return await appUrl(`/invite/${token}`);
}
