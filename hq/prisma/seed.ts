/**
 * Seed script.
 *
 *   npm run db:seed        → permission master, currencies, platform admin and the
 *                            EasyWebSolns organisation with its real catalogue & care plans.
 *   npm run db:seed:demo   → the above, plus clearly-labelled demo data and a second
 *                            demo agency (no care plans) to show tenant isolation.
 *
 * Safe to re-run: existing records are left as they are.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { nextBillingDate } from "../src/lib/care";
import { computeLine, computeTotals } from "../src/lib/money";
import { nextNumber } from "../src/lib/numbering";
import { provisionOrganization, syncPermissions } from "../src/lib/provision";
import { ALL_FEATURES } from "../src/lib/permissions";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const DEMO = process.env.SEED_DEMO === "1";

const CURRENCIES = [
  ["USD", "US Dollar", "$"],
  ["EUR", "Euro", "€"],
  ["GBP", "British Pound", "£"],
  ["INR", "Indian Rupee", "₹"],
  ["AUD", "Australian Dollar", "A$"],
  ["CAD", "Canadian Dollar", "C$"],
  ["AED", "UAE Dirham", "AED"],
  ["SGD", "Singapore Dollar", "S$"],
] as const;

async function user(email: string, name: string, password: string, isPlatformAdmin = false) {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return existing;
  return db.user.create({
    data: { email, name, isPlatformAdmin, passwordHash: await bcrypt.hash(password, 12) },
  });
}

async function main() {
  await syncPermissions(db);
  for (const [code, name, symbol] of CURRENCIES) {
    await db.currency.upsert({ where: { code }, update: { name, symbol }, create: { code, name, symbol } });
  }

  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@easywebsolns.com").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!2026";
  const admin = await user(adminEmail, "EasyWebSolns Admin", adminPassword, true);

  // ─── EasyWebSolns ───
  let ews = await db.organization.findUnique({ where: { slug: "easywebsolns" } });
  if (!ews) {
    ews = await provisionOrganization(db, {
      name: "EasyWebSolns",
      slug: "easywebsolns",
      email: "hello@easywebsolns.com",
      website: "https://www.easywebsolns.com",
      features: ALL_FEATURES.map((f) => f.key),
      owner: { userId: admin.id },
    });
    const organizationId = ews.id;

    // Service catalogue — the building blocks the quotation generator uses.
    const svc = async (name: string, unitPrice: number, category: string, description?: string, unit = "item") =>
      db.serviceItem.create({ data: { organizationId, name, unitPrice, category, description, unit } });

    const starter = await svc("Starter Website", 499, "Websites", "Up to 5 pages, mobile responsive, contact form, click-to-call, WhatsApp, Google Maps, social links, basic on-page SEO, SSL, launch.", "project");
    const professional = await svc("Professional Website", 799, "Websites", "Up to 10 pages, custom design, service pages, forms, call/WhatsApp buttons, Maps, basic SEO, Analytics, Search Console, speed optimisation, conversion-focused CTAs, 30 days post-launch support.", "project");
    const premium = await svc("Premium Website", 1199, "Websites", "Up to 15 pages, premium custom design, multiple service & location pages, blog, advanced forms, analytics/tracking, speed & conversion optimisation, advanced integrations, 60 days post-launch support.", "project");
    await svc("Additional page", 60, "Add-ons", "One additional page in the site's design.", "page");
    await svc("Website optimisation audit", 150, "Optimisation", "Speed, SEO and conversion review with a prioritised fix list.");
    await svc("Development / changes", 45, "Hourly", "Design or development time outside a package.", "hour");

    for (const [i, [name, item]] of ([["Starter", starter], ["Professional", professional], ["Premium", premium]] as const).entries()) {
      await db.package.create({
        data: { organizationId, name: `${name} Website`, sort: i, items: { create: [{ serviceItemId: item.id, quantity: 1 }] } },
      });
    }

    // Care plans — exactly as published on easywebsolns.com/care-plans.
    const plans = [
      {
        name: "Basic", subtitle: "Website Care", price: 49, includedHours: 0, responseTimeHours: 48,
        features: ["Website monitoring", "Security monitoring", "Backups", "SSL monitoring", "Software/plugin updates", "Minor text/image changes", "Technical support"],
      },
      {
        name: "Plus", subtitle: "Complete Website Care", price: 99, includedHours: 2, responseTimeHours: 24,
        features: ["Everything in Basic", "Up to 2 hours of minor updates/month", "Content changes", "Image changes", "Broken-link checks", "Performance monitoring", "Security monitoring", "Backup management", "Monthly website health check"],
      },
      {
        name: "Priority", subtitle: "Priority Website Care", price: 149, includedHours: 4, responseTimeHours: 8,
        features: ["Everything in Plus", "Up to 4 hours of minor updates/month", "Small layout/section changes", "Priority support", "Monthly website health report", "Faster response time"],
      },
    ];
    for (const [sort, p] of plans.entries()) await db.carePlan.create({ data: { organizationId, sort, ...p } });
    console.log("✓ EasyWebSolns organisation created");
  }

  if (DEMO) await seedDemo(ews.id);
  console.log(`\nSign in at /login as ${adminEmail}${process.env.SEED_ADMIN_PASSWORD ? "" : ` / ${adminPassword}`}`);
}

async function seedDemo(ewsId: string) {
  if (await db.organization.findUnique({ where: { slug: "northwind-digital-demo" } })) {
    console.log("• Demo data already present");
    return;
  }
  const pw = "Demo!2026";
  const staff = await user("designer@demo.test", "Demo Designer", pw);
  const clientUser = await user("client@demo.test", "Demo Client Contact", pw);
  const otherOwner = await user("owner@northwind.demo.test", "Northwind Owner", pw);

  const roles = await db.role.findMany({ where: { organizationId: ewsId } });
  const role = (k: string) => roles.find((r) => r.key === k)!.id;
  const first = async <T>(p: Promise<T | null>) => (await p)!;

  const client = await db.client.create({
    data: { organizationId: ewsId, name: "Demo — Harbour Physio", industry: "Healthcare", email: "front-desk@demo.test", website: "https://example.com", city: "Demo City" },
  });
  await db.contact.create({ data: { organizationId: ewsId, clientId: client.id, name: "Demo Client Contact", email: "client@demo.test", isPrimary: true } });

  await db.membership.create({ data: { organizationId: ewsId, userId: staff.id, roleId: role("member"), type: "STAFF", jobTitle: "Designer" } });
  await db.membership.create({ data: { organizationId: ewsId, userId: clientUser.id, roleId: role("client"), type: "CLIENT", clientId: client.id } });

  const stage = await first(db.pipelineStage.findFirst({ where: { organizationId: ewsId, name: "Proposal sent" } }));
  const source = await first(db.leadSource.findFirst({ where: { organizationId: ewsId, name: "Website" } }));
  await db.lead.create({
    data: { organizationId: ewsId, title: "Demo — New site for a bakery", contactName: "Sam Demo", companyName: "Demo Bakery", email: "sam@demo.test", stageId: stage.id, sourceId: source.id, value: 799, ownerId: staff.id },
  });

  const pStatus = await first(db.projectStatus.findFirst({ where: { organizationId: ewsId, name: "Development" } }));
  const project = await db.project.create({
    data: {
      organizationId: ewsId, number: await nextNumber(db, ewsId, "PROJECT"), name: "Demo — Harbour Physio website", clientId: client.id,
      statusId: pStatus.id, progress: 60, startDate: new Date(), members: { create: [{ userId: staff.id }] },
    },
  });
  for (const [i, t] of ["Sitemap & content plan", "Homepage design", "Service pages", "Launch checklist"].entries()) {
    await db.task.create({ data: { organizationId: ewsId, projectId: project.id, title: t, sort: i, visibleToClient: true, status: i < 2 ? "DONE" : i === 2 ? "IN_PROGRESS" : "TODO", assigneeId: staff.id } });
  }

  const plus = await first(db.carePlan.findFirst({ where: { organizationId: ewsId, name: "Plus" } }));
  const billingDay = 1;
  const sub = await db.careSubscription.create({
    data: { organizationId: ewsId, clientId: client.id, planId: plus.id, websiteUrl: "https://example.com", startDate: new Date(), billingDay, nextBillingDate: nextBillingDate(billingDay) },
  });
  const tStatus = await first(db.ticketStatus.findFirst({ where: { organizationId: ewsId, isDefault: true } }));
  const tPrio = await first(db.ticketPriority.findFirst({ where: { organizationId: ewsId, isDefault: true } }));
  const tCat = await first(db.ticketCategory.findFirst({ where: { organizationId: ewsId, name: "Content update" } }));
  const ticket = await db.ticket.create({
    data: {
      organizationId: ewsId, number: await nextNumber(db, ewsId, "TICKET"), subject: "Demo — Update opening hours on contact page",
      description: "Please change Saturday hours to 9am–1pm.", clientId: client.id, subscriptionId: sub.id, statusId: tStatus.id,
      priorityId: tPrio.id, categoryId: tCat.id, raisedById: clientUser.id, assigneeId: staff.id, source: "PORTAL",
    },
  });
  await db.careTimeLog.create({ data: { organizationId: ewsId, subscriptionId: sub.id, ticketId: ticket.id, userId: staff.id, workDate: new Date(), minutes: 30, description: "Updated opening hours" } });

  const svc = await first(db.serviceItem.findFirst({ where: { organizationId: ewsId, name: "Professional Website" } }));
  const lines = [{ description: svc.name, quantity: 1, unitPrice: 799, serviceItemId: svc.id }];
  await db.quotation.create({
    data: {
      organizationId: ewsId, number: await nextNumber(db, ewsId, "QUOTATION"), title: "Demo — Professional website", clientId: client.id,
      currencyCode: "USD", status: "SENT", sentAt: new Date(), publicToken: crypto.randomUUID().replace(/-/g, ""), ...computeTotals(lines),
      validUntil: new Date(Date.now() + 30 * 86_400_000),
      items: { create: lines.map((l, sort) => ({ organizationId: ewsId, sort, ...l, lineTotal: computeLine(l).lineTotal })) },
    },
  });

  // A second, unrelated agency. It does not offer care plans, and none of its
  // users can see anything above (and vice versa).
  const other = await provisionOrganization(db, {
    name: "Northwind Digital (demo)",
    slug: "northwind-digital-demo",
    features: ["LEADS", "PROJECTS", "TICKETS", "QUOTATIONS", "INVOICES", "CLIENT_PORTAL"],
    owner: { userId: otherOwner.id },
  });
  await db.client.create({ data: { organizationId: other.id, name: "Demo — Northwind's own client", industry: "Retail" } });

  console.log(`✓ Demo data added. Demo logins (password ${pw}):
   designer@demo.test         EasyWebSolns team member (sees only assigned work)
   client@demo.test           Client portal for "Demo — Harbour Physio"
   owner@northwind.demo.test  Owner of a separate agency without care plans`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
