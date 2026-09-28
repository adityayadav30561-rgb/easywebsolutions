"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { safe } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

/** Public, unauthenticated: the unguessable token in the link is the credential. */
async function openQuote(token: string) {
  const q = await prisma.quotation.findUnique({ where: { publicToken: token }, include: { organization: true } });
  if (!q || q.organization.status !== "ACTIVE") throw new Error("This quotation is no longer available.");
  if (q.status !== "SENT") throw new Error("This quotation can no longer be answered online.");
  if (q.validUntil && q.validUntil.getTime() + 86_400_000 < Date.now()) throw new Error("This quotation has expired. Please ask for an updated one.");
  return q;
}

export const acceptQuote = safe(async (token: string, _prev: unknown, fd: FormData) => {
  const q = await openQuote(token);
  const name = z.string().trim().min(2, "Type your full name to accept").max(120).parse(fd.get("name"));
  if (fd.get("agree") !== "on") return { error: "Please confirm you accept the quotation and its terms." };
  await prisma.quotation.update({ where: { id: q.id }, data: { status: "ACCEPTED", acceptedAt: new Date(), acceptedByName: name } });
  await prisma.activity.create({
    data: { organizationId: q.organizationId, entityType: "QUOTATION", entityId: q.id, type: "SYSTEM", content: `Accepted online by ${name}` },
  });
  refresh();
  return { ok: "Thank you — the quotation has been accepted." };
});

export const declineQuote = safe(async (token: string) => {
  const q = await openQuote(token);
  await prisma.quotation.update({ where: { id: q.id }, data: { status: "REJECTED", rejectedAt: new Date() } });
  await prisma.activity.create({
    data: { organizationId: q.organizationId, entityType: "QUOTATION", entityId: q.id, type: "SYSTEM", content: "Declined online" },
  });
  refresh();
});
