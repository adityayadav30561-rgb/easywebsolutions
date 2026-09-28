import type { Metadata } from "next";
import { ActionForm } from "@/components/forms";
import { Badge, Card, Field, PageHeader } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { DEFAULT_PREFIX } from "@/lib/numbering";
import { ALL_FEATURES } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { saveOrganization, saveSequence } from "./actions";

export const metadata: Metadata = { title: "Organisation" };

const SEQ_LABEL = { QUOTATION: "Quotations", INVOICE: "Invoices", TICKET: "Tickets", PROJECT: "Projects" } as const;

export default async function OrgSettings() {
  const ctx = await requireStaff("settings:manage");
  const org = ctx.org;
  const [currencies, sequences] = await Promise.all([prisma.currency.findMany({ orderBy: { code: "asc" } }), ctx.db.numberSequence.findMany()]);
  const zones = Intl.supportedValuesOf("timeZone");

  return (
    <>
      <PageHeader title="Organisation" description="Your agency's details appear on quotations, invoices and the client portal." />
      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <Card title="Profile & branding">
          <ActionForm action={saveOrganization} submit="Save" className="grid gap-4 sm:grid-cols-2">
            <Field label="Agency name" className="sm:col-span-2">
              <input name="name" className="input" required defaultValue={org.name} />
            </Field>
            <Field label="Email">
              <input name="email" type="email" className="input" defaultValue={org.email ?? ""} />
            </Field>
            <Field label="Phone">
              <input name="phone" className="input" defaultValue={org.phone ?? ""} />
            </Field>
            <Field label="Website">
              <input name="website" className="input" defaultValue={org.website ?? ""} />
            </Field>
            <Field label="Tax / VAT / GST number">
              <input name="taxId" className="input" defaultValue={org.taxId ?? ""} />
            </Field>
            <Field label="Address">
              <input name="address" className="input" defaultValue={org.address ?? ""} />
            </Field>
            <Field label="Country">
              <input name="country" className="input" defaultValue={org.country ?? ""} />
            </Field>
            <Field label="Currency">
              <select name="currencyCode" className="input" defaultValue={org.currencyCode}>
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Time zone">
              <select name="timezone" className="input" defaultValue={org.timezone}>
                {["UTC", ...zones.filter((z) => z !== "UTC")].map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
            </Field>
            <Field label="Logo URL" hint="A public https:// image link (PNG or SVG) used on documents.">
              <input name="logoUrl" type="url" className="input" defaultValue={org.logoUrl ?? ""} />
            </Field>
            <Field label="Brand colour">
              <input name="brandColor" type="color" className="h-9 w-16 cursor-pointer rounded-lg border border-line bg-white p-1" defaultValue={org.brandColor} />
            </Field>
            <Field label="Default quotation terms" className="sm:col-span-2">
              <textarea name="quoteTerms" rows={3} className="input" defaultValue={org.quoteTerms ?? ""} />
            </Field>
            <Field label="Default invoice notes (e.g. bank details)" className="sm:col-span-2">
              <textarea name="invoiceNotes" rows={3} className="input" defaultValue={org.invoiceNotes ?? ""} />
            </Field>
          </ActionForm>
        </Card>

        <div className="space-y-6">
          <Card title="Document numbering">
            <div className="space-y-5">
              {(Object.keys(SEQ_LABEL) as (keyof typeof SEQ_LABEL)[]).map((type) => {
                const s = sequences.find((x) => x.type === type);
                const prefix = s?.prefix ?? DEFAULT_PREFIX[type];
                const next = s?.nextNumber ?? 1;
                const pad = s?.padding ?? 4;
                return (
                  <div key={type}>
                    <p className="mb-2 text-sm font-medium">
                      {SEQ_LABEL[type]} <span className="font-normal text-grey">· next {prefix}{String(next).padStart(pad, "0")}</span>
                    </p>
                    <ActionForm action={saveSequence.bind(null, type)} submit="Save" submitClassName="btn-ghost btn-sm" className="grid grid-cols-3 gap-2">
                      <input name="prefix" className="input" defaultValue={prefix} aria-label="Prefix" placeholder="Prefix" />
                      <input name="nextNumber" type="number" min="1" className="input" defaultValue={next} aria-label="Next number" />
                      <input name="padding" type="number" min="1" max="10" className="input" defaultValue={pad} aria-label="Digits" />
                    </ActionForm>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="Modules">
            <ul className="space-y-2.5 text-sm">
              {ALL_FEATURES.map((f) => (
                <li key={f.key} className="flex items-start justify-between gap-3">
                  <span>
                    <span className="font-medium">{f.label}</span>
                    <span className="block text-xs text-grey">{f.description}</span>
                  </span>
                  {ctx.has(f.key) ? <Badge tone="green">On</Badge> : <Badge>Off</Badge>}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-grey">Modules are part of your HQ subscription. Contact the platform administrator to change them.</p>
          </Card>
        </div>
      </div>
    </>
  );
}
