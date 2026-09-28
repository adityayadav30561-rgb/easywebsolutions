import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { LeadForm } from "../LeadForm";

export const metadata: Metadata = { title: "New lead" };

export default async function NewLead() {
  const ctx = await requireStaff("leads:write");
  return (
    <>
      <PageHeader title="New lead" back={{ href: "/app/leads", label: "Leads" }} />
      <Card>
        <LeadForm ctx={ctx} />
      </Card>
    </>
  );
}
