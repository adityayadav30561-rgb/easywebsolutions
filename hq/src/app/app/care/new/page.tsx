import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { SubscriptionForm } from "../SubscriptionForm";

export const metadata: Metadata = { title: "New care subscription" };

export default async function NewSubscription({ searchParams }: PageProps<"/app/care/new">) {
  const ctx = await requireStaff("careplans:write");
  const { clientId } = await searchParams;
  return (
    <>
      <PageHeader title="Add care subscription" back={{ href: "/app/care", label: "Care plans" }} />
      <Card>
        <SubscriptionForm ctx={ctx} clientId={typeof clientId === "string" ? clientId : undefined} />
      </Card>
    </>
  );
}
