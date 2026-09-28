import type { PrismaClient } from "@/generated/prisma/client";
import type { Feature } from "@/generated/prisma/enums";
import { DEFAULT_PREFIX } from "./numbering";
import { ALL_FEATURES, PERMISSIONS, SYSTEM_ROLES } from "./permissions";

/** Keep the global Permission master in sync with the code catalogue. */
export async function syncPermissions(db: PrismaClient) {
  for (const [i, p] of PERMISSIONS.entries()) {
    const data = { module: p.module, label: p.label, isPortal: "portal" in p, sort: i };
    await db.permission.upsert({ where: { key: p.key }, update: data, create: { key: p.key, ...data } });
  }
}

/** Default masters every new agency starts with; all editable in Settings → Masters. */
export const DEFAULT_MASTERS = {
  leadSources: ["Website", "Referral", "Google Ads", "Social media", "Cold outreach", "Repeat client"],
  pipelineStages: [
    { name: "New", kind: "OPEN", probability: 10, color: "#94a3b8" },
    { name: "Contacted", kind: "OPEN", probability: 25, color: "#8a6dbc" },
    { name: "Proposal sent", kind: "OPEN", probability: 50, color: "#6f55a3" },
    { name: "Negotiation", kind: "OPEN", probability: 75, color: "#67578d" },
    { name: "Won", kind: "WON", probability: 100, color: "#15803d" },
    { name: "Lost", kind: "LOST", probability: 0, color: "#b91c1c" },
  ],
  projectStatuses: [
    { name: "Planning", color: "#94a3b8", isClosed: false },
    { name: "Design", color: "#8a6dbc", isClosed: false },
    { name: "Development", color: "#6f55a3", isClosed: false },
    { name: "Review", color: "#b45309", isClosed: false },
    { name: "Launched", color: "#15803d", isClosed: true },
    { name: "On hold", color: "#64748b", isClosed: false },
  ],
  ticketStatuses: [
    { name: "Open", color: "#6f55a3", isClosed: false, isDefault: true },
    { name: "In progress", color: "#b45309", isClosed: false },
    { name: "Waiting on client", color: "#64748b", isClosed: false },
    { name: "Resolved", color: "#15803d", isClosed: true },
    { name: "Closed", color: "#334155", isClosed: true },
  ],
  ticketPriorities: [
    { name: "Low", color: "#64748b", slaHours: 120 },
    { name: "Normal", color: "#6f55a3", slaHours: 48, isDefault: true },
    { name: "High", color: "#b45309", slaHours: 24 },
    { name: "Urgent", color: "#b91c1c", slaHours: 4 },
  ],
  ticketCategories: [
    { name: "Content update", isChangeRequest: true },
    { name: "Design change", isChangeRequest: true },
    { name: "Bug / something broken", isChangeRequest: false },
    { name: "Question", isChangeRequest: false },
    { name: "New feature", isChangeRequest: false },
  ],
  paymentTerms: [
    { name: "Due on receipt", dueDays: 0, depositPercent: 0 },
    { name: "Net 15", dueDays: 15, depositPercent: 0, isDefault: true },
    { name: "Net 30", dueDays: 30, depositPercent: 0 },
    { name: "50% deposit, balance on launch", dueDays: 7, depositPercent: 50 },
  ],
} as const;

export type ProvisionInput = {
  name: string;
  slug: string;
  email?: string | null;
  website?: string | null;
  currencyCode?: string;
  features: Feature[];
  owner: { userId: string };
};

/**
 * Create an organisation with its system roles, default masters, number
 * sequences and an owner membership. Runs in one transaction.
 */
export async function provisionOrganization(db: PrismaClient, input: ProvisionInput) {
  return db.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: {
        name: input.name,
        slug: input.slug,
        email: input.email ?? null,
        website: input.website ?? null,
        currencyCode: input.currencyCode ?? "USD",
        quoteTerms:
          "This quotation is valid for 30 days. Work begins once the quotation is accepted and any deposit is received.",
        invoiceNotes: "Thank you for your business.",
      },
    });
    const organizationId = org.id;

    await tx.organizationFeature.createMany({
      data: ALL_FEATURES.map((f) => ({ organizationId, feature: f.key, enabled: input.features.includes(f.key) })),
    });

    let ownerRoleId = "";
    for (const r of SYSTEM_ROLES) {
      const role = await tx.role.create({
        data: {
          organizationId,
          key: r.key,
          name: r.name,
          description: r.description,
          type: r.type,
          dataScope: r.dataScope,
          isSystem: true,
          permissions: { create: r.permissions.map((permissionKey) => ({ permissionKey })) },
        },
      });
      if (r.key === "owner") ownerRoleId = role.id;
    }

    await tx.membership.create({
      data: { organizationId, userId: input.owner.userId, roleId: ownerRoleId, type: "STAFF" },
    });

    const m = DEFAULT_MASTERS;
    await tx.leadSource.createMany({ data: m.leadSources.map((name, sort) => ({ organizationId, name, sort })) });
    await tx.pipelineStage.createMany({ data: m.pipelineStages.map((s, sort) => ({ organizationId, ...s, sort })) });
    await tx.projectStatus.createMany({ data: m.projectStatuses.map((s, sort) => ({ organizationId, ...s, sort })) });
    await tx.ticketStatus.createMany({ data: m.ticketStatuses.map((s, sort) => ({ organizationId, ...s, sort })) });
    await tx.ticketPriority.createMany({ data: m.ticketPriorities.map((s, sort) => ({ organizationId, ...s, sort })) });
    await tx.ticketCategory.createMany({ data: m.ticketCategories.map((s, sort) => ({ organizationId, ...s, sort })) });
    await tx.paymentTerm.createMany({ data: m.paymentTerms.map((s) => ({ organizationId, ...s })) });
    await tx.taxRate.create({ data: { organizationId, name: "No tax", rate: 0, isDefault: true } });
    await tx.numberSequence.createMany({
      data: (Object.keys(DEFAULT_PREFIX) as (keyof typeof DEFAULT_PREFIX)[]).map((type) => ({
        organizationId,
        type,
        prefix: DEFAULT_PREFIX[type],
      })),
    });

    return org;
  });
}
