import type { PrismaClient } from "@/generated/prisma/client";
import type { SequenceType } from "@/generated/prisma/enums";

export const DEFAULT_PREFIX: Record<SequenceType, string> = {
  QUOTATION: "Q-",
  INVOICE: "INV-",
  TICKET: "T-",
  PROJECT: "P-",
};

/**
 * Next document number for one organisation, e.g. "INV-0042".
 * The increment is a single UPDATE … RETURNING, so two people saving at the
 * same moment can never receive the same number. Each agency has its own
 * independent sequences.
 */
export async function nextNumber(db: PrismaClient, organizationId: string, type: SequenceType): Promise<string> {
  const bump = () =>
    db.$queryRaw<{ prefix: string; n: number; padding: number }[]>`
      UPDATE "NumberSequence"
         SET "nextNumber" = "nextNumber" + 1
       WHERE "organizationId" = ${organizationId} AND "type" = ${type}::"SequenceType"
   RETURNING "prefix", "nextNumber" - 1 AS n, "padding"`;

  let rows = await bump();
  if (rows.length === 0) {
    await db.numberSequence.createMany({
      data: [{ organizationId, type, prefix: DEFAULT_PREFIX[type] }],
      skipDuplicates: true,
    });
    rows = await bump();
  }
  const { prefix, n, padding } = rows[0];
  return `${prefix}${String(n).padStart(padding, "0")}`;
}
