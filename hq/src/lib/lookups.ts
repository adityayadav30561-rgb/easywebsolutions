import "server-only";
import { clientScope, type OrgContext } from "./context";

/** Active staff of the current organisation, for owner / assignee pickers. */
export async function staffOptions(ctx: OrgContext) {
  const rows = await ctx.db.membership.findMany({
    where: { type: "STAFF", status: "ACTIVE" },
    select: { userId: true, user: { select: { name: true } } },
    orderBy: { user: { name: "asc" } },
  });
  return rows.map((r) => ({ id: r.userId, name: r.user.name }));
}

export async function userNames(ctx: OrgContext, ids: (string | null | undefined)[]) {
  const list = [...new Set(ids.filter((x): x is string => !!x))];
  if (!list.length) return new Map<string, string>();
  // Only resolve names of people who belong to this organisation.
  const rows = await ctx.db.membership.findMany({ where: { userId: { in: list } }, select: { userId: true, user: { select: { name: true } } } });
  return new Map(rows.map((r) => [r.userId, r.user.name]));
}

export async function clientOptions(ctx: OrgContext) {
  return ctx.db.client.findMany({ where: { ...clientScope(ctx), status: "ACTIVE" }, select: { id: true, name: true }, orderBy: { name: "asc" } });
}

/** Throws unless `userId` is active staff in this organisation. */
export async function assertStaff(ctx: OrgContext, userId: string | null) {
  if (!userId) return null;
  const m = await ctx.db.membership.findFirst({ where: { userId, type: "STAFF", status: "ACTIVE" } });
  if (!m) throw new Error("That person isn't on this team");
  return userId;
}
