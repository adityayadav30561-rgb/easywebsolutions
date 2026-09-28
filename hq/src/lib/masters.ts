import type { Feature } from "@/generated/prisma/enums";

/**
 * Config for the generic Masters screens. Each master is a small per-agency
 * lookup table; the same page and actions handle all of them.
 */
export type MasterField =
  | { name: string; label: string; type: "text" | "color" | "textarea"; required?: boolean }
  | { name: string; label: string; type: "int" | "decimal"; min?: number; max?: number; step?: string; required?: boolean }
  | { name: string; label: string; type: "bool" }
  | { name: string; label: string; type: "enum"; options: { value: string; label: string }[] }
  | { name: string; label: string; type: "taxRate" };

export type MasterDef = {
  key: string;
  label: string;
  description: string;
  model: string; // Prisma delegate name
  feature?: Feature;
  fields: MasterField[];
  order: Record<string, "asc" | "desc">;
  hasDefault?: boolean;
  columns: string[];
};

const name = { name: "name", label: "Name", type: "text", required: true } as const;
const color = { name: "color", label: "Colour", type: "color" } as const;
const sort = { name: "sort", label: "Order", type: "int", min: 0, max: 1000 } as const;
const active = { name: "isActive", label: "Active", type: "bool" } as const;
const isDefault = { name: "isDefault", label: "Default", type: "bool" } as const;

export const MASTERS: MasterDef[] = [
  {
    key: "lead-sources",
    label: "Lead sources",
    description: "Where leads come from.",
    model: "leadSource",
    feature: "LEADS",
    fields: [name, sort, active],
    order: { sort: "asc" },
    columns: ["name", "sort", "isActive"],
  },
  {
    key: "pipeline-stages",
    label: "Pipeline stages",
    description: "Columns of the lead pipeline. Won/lost stages close a lead.",
    model: "pipelineStage",
    feature: "LEADS",
    fields: [
      name,
      { name: "kind", label: "Type", type: "enum", options: [{ value: "OPEN", label: "Open" }, { value: "WON", label: "Won" }, { value: "LOST", label: "Lost" }] },
      { name: "probability", label: "Win probability %", type: "int", min: 0, max: 100 },
      color,
      sort,
      active,
    ],
    order: { sort: "asc" },
    columns: ["name", "kind", "probability", "color", "sort", "isActive"],
  },
  {
    key: "project-statuses",
    label: "Project statuses",
    description: "Stages a project moves through. Clients see these in the portal.",
    model: "projectStatus",
    feature: "PROJECTS",
    fields: [name, color, { name: "isClosed", label: "Counts as finished", type: "bool" }, sort, active],
    order: { sort: "asc" },
    columns: ["name", "color", "isClosed", "sort", "isActive"],
  },
  {
    key: "ticket-statuses",
    label: "Ticket statuses",
    description: "The default status is given to new tickets.",
    model: "ticketStatus",
    feature: "TICKETS",
    fields: [name, color, { name: "isClosed", label: "Closes the ticket", type: "bool" }, isDefault, sort, active],
    order: { sort: "asc" },
    hasDefault: true,
    columns: ["name", "color", "isClosed", "isDefault", "sort", "isActive"],
  },
  {
    key: "ticket-priorities",
    label: "Ticket priorities",
    description: "SLA hours set each new ticket's due time.",
    model: "ticketPriority",
    feature: "TICKETS",
    fields: [name, color, { name: "slaHours", label: "SLA (hours)", type: "int", min: 0, max: 10000 }, isDefault, sort, active],
    order: { sort: "asc" },
    hasDefault: true,
    columns: ["name", "color", "slaHours", "isDefault", "sort", "isActive"],
  },
  {
    key: "ticket-categories",
    label: "Ticket categories",
    description: "Mark categories that count as care-plan change requests.",
    model: "ticketCategory",
    feature: "TICKETS",
    fields: [name, { name: "isChangeRequest", label: "Change request", type: "bool" }, sort, active],
    order: { sort: "asc" },
    columns: ["name", "isChangeRequest", "sort", "isActive"],
  },
  {
    key: "tax-rates",
    label: "Tax rates",
    description: "GST / VAT / sales-tax rates for quotation and invoice lines.",
    model: "taxRate",
    fields: [name, { name: "rate", label: "Rate %", type: "decimal", min: 0, max: 100, step: "0.01", required: true }, isDefault, active],
    order: { name: "asc" },
    hasDefault: true,
    columns: ["name", "rate", "isDefault", "isActive"],
  },
  {
    key: "payment-terms",
    label: "Payment terms",
    description: "Due days and deposit percentage used when quotations become invoices.",
    model: "paymentTerm",
    fields: [name, { name: "dueDays", label: "Due in (days)", type: "int", min: 0, max: 365 }, { name: "depositPercent", label: "Deposit %", type: "int", min: 0, max: 100 }, isDefault, active],
    order: { dueDays: "asc" },
    hasDefault: true,
    columns: ["name", "dueDays", "depositPercent", "isDefault", "isActive"],
  },
  {
    key: "services",
    label: "Services catalogue",
    description: "Priced services that quotations and invoices are built from.",
    model: "serviceItem",
    fields: [
      name,
      { name: "category", label: "Category", type: "text" },
      { name: "unitPrice", label: "Price", type: "decimal", min: 0, step: "0.01", required: true },
      { name: "unit", label: "Unit", type: "text" },
      { name: "taxRateId", label: "Tax", type: "taxRate" },
      { name: "description", label: "Description (shown on documents)", type: "textarea" },
      active,
    ],
    order: { name: "asc" },
    columns: ["name", "category", "unitPrice", "unit", "isActive"],
  },
];

export function masterByKey(key: string) {
  return MASTERS.find((m) => m.key === key);
}
