"use server";

import { refresh } from "next/cache";
import { safe, zEmail } from "@/lib/actions";
import { audit, authorize, type OrgContext } from "@/lib/context";
import { must } from "@/lib/guard";
import { createInvitation } from "@/lib/invites";

/** Refuse changes that would leave the organisation without an active owner. */
async function keepAnOwner(ctx: OrgContext, membershipId: string) {
  const owners = await ctx.db.membership.findMany({ where: { status: "ACTIVE", role: { key: "owner" } }, select: { id: true } });
  if (owners.length === 1 && owners[0].id === membershipId) throw new Error("There must always be at least one active Owner.");
}

export const inviteStaff = safe(async (_prev: unknown, fd: FormData) => {
  const ctx = await authorize("team:manage");
  const email = zEmail.parse(String(fd.get("email") ?? "").trim());
  const name = String(fd.get("name") ?? "").trim() || null;
  const role = must(await ctx.db.role.findFirst({ where: { id: String(fd.get("roleId") ?? ""), type: "STAFF" } }), "Role");
  if (role.key === "owner" && ctx.role.key !== "owner") return { error: "Only an Owner can invite another Owner." };
  const existing = await ctx.db.membership.findFirst({ where: { user: { email } } });
  if (existing) return { error: "That person is already in this organisation." };
  const link = await createInvitation(ctx, { email, name, roleId: role.id });
  await audit(ctx, "invite", "membership", null, `Invited ${email} as ${role.name}`);
  refresh();
  return { ok: `Invitation link (valid 7 days, copy it now): ${link}` };
});

export const changeRole = safe(async (membershipId: string, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("team:manage");
  const m = must(await ctx.db.membership.findFirst({ where: { id: membershipId, type: "STAFF" }, include: { role: true, user: true } }), "Member");
  const role = must(await ctx.db.role.findFirst({ where: { id: String(fd.get("roleId") ?? ""), type: "STAFF" } }), "Role");
  if ((role.key === "owner" || m.role.key === "owner") && ctx.role.key !== "owner") return { error: "Only an Owner can change Owner access." };
  if (m.role.key === "owner" && role.key !== "owner") await keepAnOwner(ctx, m.id);
  await ctx.db.membership.update({ where: { id: membershipId }, data: { roleId: role.id, jobTitle: String(fd.get("jobTitle") ?? "").trim() || null } });
  await audit(ctx, "role", "membership", membershipId, `${m.user.name} is now ${role.name}`);
  refresh();
  return { ok: "Saved" };
});

export const setMemberStatus = safe(async (membershipId: string, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("team:manage");
  const m = must(await ctx.db.membership.findFirst({ where: { id: membershipId, type: "STAFF" }, include: { role: true, user: true } }), "Member");
  if (m.userId === ctx.userId) return { error: "You can't disable yourself." };
  if (m.role.key === "owner" && ctx.role.key !== "owner") return { error: "Only an Owner can change Owner access." };
  const status = fd.get("status") === "ACTIVE" ? "ACTIVE" : "DISABLED";
  if (status === "DISABLED") await keepAnOwner(ctx, m.id);
  await ctx.db.membership.update({ where: { id: membershipId }, data: { status } });
  await audit(ctx, status === "ACTIVE" ? "enable" : "disable", "membership", membershipId, `${status === "ACTIVE" ? "Re-enabled" : "Disabled"} ${m.user.name}`);
  refresh();
});

export const revokeInvite = safe(async (id: string) => {
  const ctx = await authorize("team:manage");
  const inv = must(await ctx.db.invitation.findUnique({ where: { id } }), "Invitation");
  await ctx.db.invitation.delete({ where: { id } });
  await audit(ctx, "revoke", "invitation", id, `Revoked invitation for ${inv.email}`);
  refresh();
});
