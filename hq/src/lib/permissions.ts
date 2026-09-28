/**
 * Permission catalogue (the `Permission` master table is seeded from this)
 * and the system roles every new organisation receives.
 */
import type { Feature } from "@/generated/prisma/enums";

export type PermissionDef = { key: string; module: string; label: string; portal?: boolean; feature?: Feature };

export const PERMISSIONS = [
  { key: "dashboard:view", module: "Dashboard", label: "View dashboard" },
  { key: "reports:view", module: "Dashboard", label: "View revenue & pipeline figures" },

  { key: "leads:read", module: "Leads", label: "View leads", feature: "LEADS" },
  { key: "leads:write", module: "Leads", label: "Create & edit leads", feature: "LEADS" },
  { key: "leads:delete", module: "Leads", label: "Delete leads", feature: "LEADS" },

  { key: "clients:read", module: "Clients", label: "View clients" },
  { key: "clients:write", module: "Clients", label: "Create & edit clients" },
  { key: "clients:delete", module: "Clients", label: "Delete clients" },

  { key: "projects:read", module: "Projects", label: "View projects", feature: "PROJECTS" },
  { key: "projects:write", module: "Projects", label: "Create & edit projects", feature: "PROJECTS" },
  { key: "projects:delete", module: "Projects", label: "Delete projects", feature: "PROJECTS" },
  { key: "tasks:write", module: "Projects", label: "Manage tasks", feature: "PROJECTS" },

  { key: "tickets:read", module: "Tickets", label: "View tickets", feature: "TICKETS" },
  { key: "tickets:write", module: "Tickets", label: "Create, reply & update tickets", feature: "TICKETS" },
  { key: "tickets:assign", module: "Tickets", label: "Assign tickets", feature: "TICKETS" },
  { key: "tickets:delete", module: "Tickets", label: "Delete tickets", feature: "TICKETS" },

  { key: "quotes:read", module: "Quotations", label: "View quotations", feature: "QUOTATIONS" },
  { key: "quotes:write", module: "Quotations", label: "Create & edit quotations", feature: "QUOTATIONS" },
  { key: "quotes:send", module: "Quotations", label: "Send quotations & share links", feature: "QUOTATIONS" },

  { key: "invoices:read", module: "Invoices", label: "View invoices", feature: "INVOICES" },
  { key: "invoices:write", module: "Invoices", label: "Create, edit & send invoices", feature: "INVOICES" },
  { key: "payments:write", module: "Invoices", label: "Record payments", feature: "INVOICES" },

  { key: "careplans:read", module: "Care plans", label: "View care subscriptions", feature: "CARE_PLANS" },
  { key: "careplans:write", module: "Care plans", label: "Manage plans & subscriptions", feature: "CARE_PLANS" },
  { key: "timelogs:write", module: "Care plans", label: "Log update hours", feature: "CARE_PLANS" },

  { key: "masters:manage", module: "Settings", label: "Manage masters (stages, statuses, catalogue…)" },
  { key: "team:manage", module: "Settings", label: "Invite staff & manage roles" },
  { key: "settings:manage", module: "Settings", label: "Edit organisation settings" },
  { key: "audit:view", module: "Settings", label: "View audit log" },

  { key: "portal:projects", module: "Client portal", label: "See their projects", portal: true, feature: "PROJECTS" },
  { key: "portal:tickets", module: "Client portal", label: "Raise & follow tickets", portal: true, feature: "TICKETS" },
  { key: "portal:quotes", module: "Client portal", label: "View & accept quotations", portal: true, feature: "QUOTATIONS" },
  { key: "portal:invoices", module: "Client portal", label: "View invoices", portal: true, feature: "INVOICES" },
  { key: "portal:care", module: "Client portal", label: "See care plan & hours used", portal: true, feature: "CARE_PLANS" },
] as const satisfies readonly PermissionDef[];

export type PermissionKey = (typeof PERMISSIONS)[number]["key"];

const staffKeys = PERMISSIONS.filter((p) => !("portal" in p)).map((p) => p.key);
const portalKeys = PERMISSIONS.filter((p) => "portal" in p).map((p) => p.key);

export const SYSTEM_ROLES: {
  key: string;
  name: string;
  description: string;
  type: "STAFF" | "CLIENT";
  dataScope: "ALL" | "ASSIGNED";
  permissions: PermissionKey[];
}[] = [
  {
    key: "owner",
    name: "Owner",
    description: "Full access, including team, roles and settings.",
    type: "STAFF",
    dataScope: "ALL",
    permissions: staffKeys,
  },
  {
    key: "admin",
    name: "Admin",
    description: "Everything except organisation settings.",
    type: "STAFF",
    dataScope: "ALL",
    permissions: staffKeys.filter((k) => k !== "settings:manage"),
  },
  {
    key: "manager",
    name: "Manager",
    description: "Runs sales and delivery; no team, masters or settings.",
    type: "STAFF",
    dataScope: "ALL",
    permissions: staffKeys.filter(
      (k) => !["settings:manage", "team:manage", "masters:manage", "audit:view", "clients:delete", "leads:delete", "projects:delete", "tickets:delete"].includes(k),
    ),
  },
  {
    key: "member",
    name: "Team member",
    description: "Works only on projects, tickets and leads assigned to them.",
    type: "STAFF",
    dataScope: "ASSIGNED",
    permissions: [
      "dashboard:view",
      "leads:read",
      "leads:write",
      "clients:read",
      "projects:read",
      "tasks:write",
      "tickets:read",
      "tickets:write",
      "careplans:read",
      "timelogs:write",
    ],
  },
  {
    key: "client",
    name: "Client",
    description: "Client portal: their own projects, tickets, quotations and invoices.",
    type: "CLIENT",
    dataScope: "ASSIGNED",
    permissions: portalKeys,
  },
];

export function permissionFeature(key: string): Feature | undefined {
  const def = PERMISSIONS.find((p) => p.key === key) as PermissionDef | undefined;
  return def?.feature;
}

export const ALL_FEATURES: { key: Feature; label: string; description: string }[] = [
  { key: "LEADS", label: "Leads & pipeline", description: "Lead capture, stages and follow-ups." },
  { key: "PROJECTS", label: "Projects", description: "Projects, tasks and client-visible progress." },
  { key: "TICKETS", label: "Tickets", description: "Support tickets with SLA priorities." },
  { key: "QUOTATIONS", label: "Quotations", description: "Auto-numbered quotes with online acceptance." },
  { key: "INVOICES", label: "Invoices", description: "Invoices, payments and balances." },
  { key: "CARE_PLANS", label: "Care plans", description: "Monthly website-care subscriptions and hours used." },
  { key: "CLIENT_PORTAL", label: "Client portal", description: "Let clients log in to see their work." },
];
