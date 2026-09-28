/**
 * Tenant-isolation tests against a real PostgreSQL database (DATABASE_URL).
 * Creates two throwaway organisations and proves neither can read, change or
 * delete the other's records through the scoped client.
 *
 *   npm test
 */
import "dotenv/config";
import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { billingPeriod } from "../src/lib/care";
import { computeTotals } from "../src/lib/money";
import { nextNumber } from "../src/lib/numbering";
import { withTenant } from "../src/lib/tenant";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const tag = `test-${Date.now()}`;
let A = "";
let B = "";
let clientB = "";

before(async () => {
  A = (await db.organization.create({ data: { name: "Agency A", slug: `${tag}-a` } })).id;
  B = (await db.organization.create({ data: { name: "Agency B", slug: `${tag}-b` } })).id;
  clientB = (await db.client.create({ data: { organizationId: B, name: "B's client" } })).id;
  await db.client.create({ data: { organizationId: A, name: "A's client" } });
});

after(async () => {
  await db.organization.deleteMany({ where: { slug: { startsWith: tag } } });
  await db.$disconnect();
});

describe("tenant isolation", () => {
  test("lists only own rows", async () => {
    const rows = await withTenant(db, A).client.findMany();
    assert.deepEqual(rows.map((r) => r.name), ["A's client"]);
    assert.equal(await withTenant(db, A).client.count(), 1);
  });

  test("another agency's id resolves to nothing", async () => {
    const a = withTenant(db, A);
    assert.equal(await a.client.findUnique({ where: { id: clientB } }), null);
    assert.equal(await a.client.findFirst({ where: { id: clientB } }), null);
  });

  test("cannot update or delete another agency's record", async () => {
    const a = withTenant(db, A);
    await assert.rejects(a.client.update({ where: { id: clientB }, data: { name: "hacked" } }));
    await assert.rejects(a.client.delete({ where: { id: clientB } }));
    assert.equal((await a.client.updateMany({ where: { id: clientB }, data: { name: "hacked" } })).count, 0);
    assert.equal((await a.client.deleteMany({ where: { id: clientB } })).count, 0);
    const still = await db.client.findUniqueOrThrow({ where: { id: clientB } });
    assert.equal(still.name, "B's client");
  });

  test("OR filters cannot escape the tenant", async () => {
    const rows = await withTenant(db, A).client.findMany({ where: { OR: [{ id: clientB }, { name: { contains: "" } }] } });
    assert.ok(rows.every((r) => r.organizationId === A));
  });

  test("create is forced into the caller's organisation", async () => {
    const row = await withTenant(db, A).client.create({ data: { name: "spoof", organizationId: B } });
    assert.equal(row.organizationId, A);
  });

  test("organisationId can't be changed on update", async () => {
    const a = withTenant(db, A);
    const row = await a.client.findFirstOrThrow();
    await assert.rejects(a.client.update({ where: { id: row.id }, data: { organizationId: B } }));
  });

  test("global models are refused through the scoped client", async () => {
    await assert.rejects(withTenant(db, A).user.findMany());
  });
});

describe("document numbering", () => {
  test("each agency has its own gap-free sequence, safe under concurrency", async () => {
    const nums = await Promise.all(Array.from({ length: 10 }, () => nextNumber(db, A, "INVOICE")));
    assert.equal(new Set(nums).size, 10);
    assert.deepEqual([...nums].sort(), Array.from({ length: 10 }, (_, i) => `INV-${String(i + 1).padStart(4, "0")}`));
    assert.equal(await nextNumber(db, B, "INVOICE"), "INV-0001");
  });
});

describe("maths", () => {
  test("totals with discount and tax", () => {
    const t = computeTotals([
      { description: "Site", quantity: 1, unitPrice: 799, discountPct: 10, taxRate: 18 },
      { description: "Pages", quantity: 3, unitPrice: 60 },
    ]);
    assert.deepEqual(t, { subtotal: 979, discountTotal: 79.9, taxTotal: 129.44, total: 1028.54 });
  });

  test("care billing period follows the billing day", () => {
    const p = billingPeriod(15, new Date(Date.UTC(2026, 8, 3)));
    assert.equal(p.start.toISOString().slice(0, 10), "2026-08-15");
    assert.equal(p.end.toISOString().slice(0, 10), "2026-09-15");
  });
});
