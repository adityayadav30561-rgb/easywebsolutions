"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { Feature } from "@/generated/prisma/enums";
import { safe, zEmail, zText } from "@/lib/actions";
import { getSession, hashPassword } from "@/lib/auth";
import { ALL_FEATURES } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { provisionOrganization } from "@/lib/provision";
import { slugify } from "@/lib/utils";

async function requirePlatformAdmin() {
  const s = await getSession();
  if (!s?.user.isPlatformAdmin) throw new Error("Platform admins only");
  return s;
}

const featureKeys = new Set<string>(ALL_FEATURES.map((f) => f.key));

export const createOrganization = safe(async (_prev: unknown, fd: FormData) => {
  await requirePlatformAdmin();
  const data = z
    .object({
      name: zText(120),
      slug: z.string().regex(/^[a-z0-9-]{2,48}$/, "Slug: 2–48 lowercase letters, numbers or dashes"),
      ownerEmail: zEmail,
      ownerName: z.string().trim().max(100),
      ownerPassword: z.string().max(200),
      currencyCode: z.string().length(3),
    })
    .parse({
      name: fd.get("name"),
      slug: slugify(String(fd.get("slug") || fd.get("name") || "")),
      ownerEmail: String(fd.get("ownerEmail") ?? "").trim(),
      ownerName: fd.get("ownerName") ?? "",
      ownerPassword: fd.get("ownerPassword") ?? "",
      currencyCode: fd.get("currencyCode") || "USD",
    });
  const features = fd.getAll("feature").map(String).filter((f) => featureKeys.has(f)) as Feature[];
  if (await prisma.organization.findUnique({ where: { slug: data.slug } })) return { error: "That slug is taken." };

  let owner = await prisma.user.findUnique({ where: { email: data.ownerEmail } });
  if (!owner) {
    if (data.ownerName.length < 2) return { error: "Enter the owner's name." };
    if (data.ownerPassword.length < 8) return { error: "Set a temporary password of at least 8 characters for the new owner." };
    owner = await prisma.user.create({ data: { email: data.ownerEmail, name: data.ownerName, passwordHash: await hashPassword(data.ownerPassword) } });
  }
  const org = await provisionOrganization(prisma, { name: data.name, slug: data.slug, currencyCode: data.currencyCode, features, owner: { userId: owner.id } });
  redirect(`/admin/orgs/${org.id}`);
});

export const updateOrganization = safe(async (id: string, _prev: unknown, fd: FormData) => {
  await requirePlatformAdmin();
  const org = await prisma.organization.findUnique({ where: { id } });
  if (!org) return { error: "Not found" };
  const enabled = new Set(fd.getAll("feature").map(String));
  const status = fd.get("status") === "SUSPENDED" ? "SUSPENDED" : "ACTIVE";
  await prisma.$transaction([
    prisma.organization.update({ where: { id }, data: { status } }),
    ...ALL_FEATURES.map((f) =>
      prisma.organizationFeature.upsert({
        where: { organizationId_feature: { organizationId: id, feature: f.key } },
        update: { enabled: enabled.has(f.key) },
        create: { organizationId: id, feature: f.key, enabled: enabled.has(f.key) },
      }),
    ),
  ]);
  refresh();
  return { ok: "Saved" };
});

export const addOwner = safe(async (id: string, _prev: unknown, fd: FormData) => {
  await requirePlatformAdmin();
  const email = zEmail.parse(String(fd.get("email") ?? "").trim());
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "No account with that email. Create the organisation owner from the form, or ask them to accept an invite." };
  const role = await prisma.role.findFirst({ where: { organizationId: id, key: "owner" } });
  if (!role) return { error: "Owner role missing" };
  await prisma.membership.upsert({
    where: { organizationId_userId: { organizationId: id, userId: user.id } },
    update: { roleId: role.id, type: "STAFF", clientId: null, status: "ACTIVE" },
    create: { organizationId: id, userId: user.id, roleId: role.id, type: "STAFF" },
  });
  refresh();
  return { ok: `${user.name} is now an owner.` };
});
