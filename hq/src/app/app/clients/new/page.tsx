import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { ClientForm } from "../ClientForm";

export const metadata: Metadata = { title: "New client" };

export default async function NewClient() {
  const ctx = await requireStaff("clients:write");
  return (
    <>
      <PageHeader title="New client" back={{ href: "/app/clients", label: "Clients" }} />
      <Card>
        <ClientForm ctx={ctx} />
      </Card>
    </>
  );
}
