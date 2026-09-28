import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { requireStaff } from "@/lib/context";
import { ProjectForm } from "../ProjectForm";

export const metadata: Metadata = { title: "New project" };

export default async function NewProject({ searchParams }: PageProps<"/app/projects/new">) {
  const ctx = await requireStaff("projects:write");
  const { clientId } = await searchParams;
  return (
    <>
      <PageHeader title="New project" back={{ href: "/app/projects", label: "Projects" }} />
      <Card>
        <ProjectForm ctx={ctx} clientId={typeof clientId === "string" ? clientId : undefined} />
      </Card>
    </>
  );
}
