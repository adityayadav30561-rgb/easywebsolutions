"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { form, safe, zEmail, zOptEmail, zOptText, zText } from "@/lib/actions";
import { audit, authorize, clientScope } from "@/lib/context";
import { must } from "@/lib/guard";
import { createInvitation } from "@/lib/invites";
import { assertStaff } from "@/lib/lookups";

const clientSchema = z.object({
  name: zText(160),
  industry: zOptText(80),
  website: zOptText(200),
  email: zOptEmail,
  phone: zOptText(40),
  address: zOptText(300),
  city: zOptText(80),
  country: zOptText(80),
  taxId: zOptText(60),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  ownerId: z.string().nullable(),
  notes: zOptText(5000),
});

export const saveClient = safe(async (id: string | null, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("clients:write");
  const f = form(fd);
  const data = clientSchema.parse({
    name: f.str("name"),
    industry: f.opt("industry"),
    website: f.opt("website"),
    email: f.opt("email"),
    phone: f.opt("phone"),
    address: f.opt("address"),
    city: f.opt("city"),
    country: f.opt("country"),
    taxId: f.opt("taxId"),
    status: f.str("status") || "ACTIVE",
    ownerId: f.opt("ownerId"),
    notes: f.opt("notes"),
  });
  await assertStaff(ctx, data.ownerId);

  if (id) {
    must(await ctx.db.client.findFirst({ where: { id, ...clientScope(ctx) } }), "Client");
    await ctx.db.client.update({ where: { id }, data });
    await audit(ctx, "update", "client", id, `Updated client "${data.name}"`);
    refresh();
    return { ok: "Saved" };
  }
  const client = await ctx.db.client.create({ data: { organizationId: ctx.orgId, ...data, ownerId: data.ownerId ?? ctx.userId } });
  await audit(ctx, "create", "client", client.id, `Created client "${client.name}"`);
  redirect(`/app/clients/${client.id}`);
});

export const deleteClient = safe(async (id: string) => {
  const ctx = await authorize("clients:delete");
  const c = must(await ctx.db.client.findUnique({ where: { id } }), "Client");
  const [projects, invoices, tickets, subs] = await Promise.all([
    ctx.db.project.count({ where: { clientId: id } }),
    ctx.db.invoice.count({ where: { clientId: id } }),
    ctx.db.ticket.count({ where: { clientId: id } }),
    ctx.db.careSubscription.count({ where: { clientId: id } }),
  ]);
  if (projects + invoices + tickets + subs > 0) {
    return { error: "This client has projects, tickets, invoices or care plans. Mark it inactive instead." };
  }
  await ctx.db.activity.deleteMany({ where: { entityType: "CLIENT", entityId: id } });
  await ctx.db.client.delete({ where: { id } });
  await audit(ctx, "delete", "client", id, `Deleted client "${c.name}"`);
  redirect("/app/clients");
});

const contactSchema = z.object({
  name: zText(120),
  email: zOptEmail,
  phone: zOptText(40),
  designation: zOptText(80),
  isPrimary: z.boolean(),
});

export const addContact = safe(async (clientId: string, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("clients:write");
  must(await ctx.db.client.findFirst({ where: { id: clientId, ...clientScope(ctx) } }), "Client");
  const f = form(fd);
  const data = contactSchema.parse({ name: f.str("name"), email: f.opt("email"), phone: f.opt("phone"), designation: f.opt("designation"), isPrimary: f.bool("isPrimary") });
  if (data.isPrimary) await ctx.db.contact.updateMany({ where: { clientId }, data: { isPrimary: false } });
  await ctx.db.contact.create({ data: { organizationId: ctx.orgId, clientId, ...data } });
  refresh();
  return { ok: "Contact added" };
});

export const removeContact = safe(async (id: string) => {
  const ctx = await authorize("clients:write");
  const c = must(await ctx.db.contact.findUnique({ where: { id } }), "Contact");
  must(await ctx.db.client.findFirst({ where: { id: c.clientId, ...clientScope(ctx) } }), "Client");
  await ctx.db.contact.delete({ where: { id } });
  refresh();
});

/** Give someone at the client a login to the client portal. */
export const inviteClientUser = safe(async (clientId: string, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("clients:write");
  if (!ctx.has("CLIENT_PORTAL")) return { error: "The client portal isn't enabled for your organisation." };
  must(await ctx.db.client.findFirst({ where: { id: clientId, ...clientScope(ctx) } }), "Client");
  const email = zEmail.parse(String(fd.get("email") ?? "").trim());
  const name = String(fd.get("name") ?? "").trim() || null;
  const roleId = String(fd.get("roleId") ?? "");
  const role = must(await ctx.db.role.findFirst({ where: { id: roleId, type: "CLIENT" } }), "Portal role");

  const existing = await ctx.db.membership.findFirst({ where: { user: { email } } });
  if (existing && (existing.type !== "CLIENT" || existing.clientId !== clientId)) {
    return { error: "That email already belongs to someone else in this organisation." };
  }
  const link = await createInvitation(ctx, { email, name, roleId: role.id, clientId });
  await audit(ctx, "invite", "client", clientId, `Invited ${email} to the client portal`);
  refresh();
  return { ok: `Invitation link (valid 7 days, copy it now): ${link}` };
});

export const setPortalAccess = safe(async (membershipId: string, _prev: unknown, fd: FormData) => {
  const ctx = await authorize("clients:write");
  const m = must(await ctx.db.membership.findFirst({ where: { id: membershipId, type: "CLIENT" } }), "Portal user");
  must(await ctx.db.client.findFirst({ where: { id: m.clientId ?? "", ...clientScope(ctx) } }), "Client");
  const status = fd.get("status") === "ACTIVE" ? "ACTIVE" : "DISABLED";
  await ctx.db.membership.update({ where: { id: membershipId }, data: { status } });
  refresh();
});
