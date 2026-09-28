"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { safe, zEmail } from "@/lib/actions";
import { createSession, destroySession, getSession, hashPassword, hashToken, requireSession, setActiveOrg, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Simple in-memory brake on password guessing (per server instance).
const attempts = new Map<string, { n: number; until: number }>();

export const login = safe(async (_prev: unknown, fd: FormData) => {
  const email = zEmail.parse(String(fd.get("email") ?? "").trim());
  const password = String(fd.get("password") ?? "");
  const a = attempts.get(email);
  if (a && a.until > Date.now()) return { error: "Too many attempts. Try again in a few minutes." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
    const n = (a?.n ?? 0) + 1;
    attempts.set(email, { n, until: n >= 5 ? Date.now() + 5 * 60_000 : 0 });
    return { error: "Email or password is incorrect." };
  }
  attempts.delete(email);

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id, status: "ACTIVE", organization: { status: "ACTIVE" } },
    select: { organizationId: true },
  });
  await createSession(user.id, memberships.length === 1 ? memberships[0].organizationId : null);
  redirect(memberships.length === 1 ? "/" : user.isPlatformAdmin && memberships.length === 0 ? "/admin" : "/select-org");
});

export async function logout() {
  await destroySession();
  redirect("/login");
}

export async function chooseOrg(fd: FormData) {
  const session = await requireSession();
  const orgId = String(fd.get("orgId") ?? "");
  const m = await prisma.membership.findUnique({
    where: { organizationId_userId: { organizationId: orgId, userId: session.userId } },
    include: { organization: true },
  });
  if (!m || m.status !== "ACTIVE" || m.organization.status !== "ACTIVE") redirect("/select-org");
  await setActiveOrg(orgId);
  redirect(m.type === "CLIENT" ? "/portal" : "/app");
}

export const acceptInvite = safe(async (token: string, _prev: unknown, fd: FormData) => {
  const invite = await prisma.invitation.findUnique({ where: { tokenHash: hashToken(token) }, include: { organization: true } });
  if (!invite || invite.acceptedAt || invite.expiresAt < new Date()) return { error: "This invitation is no longer valid." };
  if (invite.organization.status !== "ACTIVE") return { error: "This organisation is not active." };

  const password = String(fd.get("password") ?? "");
  const current = await getSession();
  let userId: string;

  const existing = await prisma.user.findUnique({ where: { email: invite.email } });
  if (existing) {
    if (current?.userId !== existing.id && !(await verifyPassword(password, existing.passwordHash))) {
      return { error: "You already have an account — enter its password to join." };
    }
    userId = existing.id;
  } else {
    const data = z
      .object({ name: z.string().trim().min(2, "Enter your name").max(100), password: z.string().min(8, "Use at least 8 characters").max(200) })
      .parse({ name: fd.get("name"), password });
    const u = await prisma.user.create({ data: { email: invite.email, name: data.name, passwordHash: await hashPassword(data.password) } });
    userId = u.id;
  }

  const role = await prisma.role.findFirst({ where: { id: invite.roleId, organizationId: invite.organizationId } });
  if (!role) return { error: "The role on this invitation was removed. Ask for a new invitation." };

  await prisma.$transaction([
    prisma.membership.upsert({
      where: { organizationId_userId: { organizationId: invite.organizationId, userId } },
      update: { roleId: role.id, type: role.type, clientId: role.type === "CLIENT" ? invite.clientId : null, status: "ACTIVE" },
      create: {
        organizationId: invite.organizationId,
        userId,
        roleId: role.id,
        type: role.type,
        clientId: role.type === "CLIENT" ? invite.clientId : null,
      },
    }),
    prisma.invitation.update({ where: { id: invite.id }, data: { acceptedAt: new Date() } }),
  ]);

  if (current) await destroySession();
  await createSession(userId, invite.organizationId);
  redirect(role.type === "CLIENT" ? "/portal" : "/app");
});

export const changePassword = safe(async (_prev: unknown, fd: FormData) => {
  const session = await requireSession();
  const current = String(fd.get("current") ?? "");
  const next = z.string().min(8, "Use at least 8 characters").max(200).parse(fd.get("next"));
  if (!(await verifyPassword(current, session.user.passwordHash))) return { error: "Current password is incorrect." };
  await prisma.user.update({ where: { id: session.userId }, data: { passwordHash: await hashPassword(next) } });
  await prisma.session.deleteMany({ where: { userId: session.userId, NOT: { id: session.id } } });
  return { ok: "Password updated. Other devices were signed out." };
});
