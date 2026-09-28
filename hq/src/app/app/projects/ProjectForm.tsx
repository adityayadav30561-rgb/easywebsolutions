import { ActionForm } from "@/components/forms";
import { Field } from "@/components/ui";
import type { OrgContext } from "@/lib/context";
import { clientOptions, staffOptions } from "@/lib/lookups";
import { toDateInput } from "@/lib/utils";
import { saveProject } from "./actions";

type ProjectValues = {
  id: string;
  name: string;
  description: string | null;
  clientId: string;
  statusId: string;
  managerId: string | null;
  startDate: Date | null;
  dueDate: Date | null;
  budget: unknown;
  progress: number;
  visibleToClient: boolean;
};

export async function ProjectForm({ ctx, project, clientId }: { ctx: OrgContext; project?: ProjectValues; clientId?: string }) {
  const [clients, statuses, staff] = await Promise.all([
    clientOptions(ctx),
    ctx.db.projectStatus.findMany({ where: { OR: [{ isActive: true }, { id: project?.statusId ?? "" }] }, orderBy: { sort: "asc" } }),
    staffOptions(ctx),
  ]);
  return (
    <ActionForm action={saveProject.bind(null, project?.id ?? null)} submit={project ? "Save changes" : "Create project"} className="grid gap-4 sm:grid-cols-2">
      <Field label="Project name" className="sm:col-span-2">
        <input name="name" className="input" required defaultValue={project?.name} />
      </Field>
      <Field label="Client">
        <select name="clientId" className="input" required defaultValue={project?.clientId ?? clientId ?? ""}>
          <option value="" disabled>
            Choose…
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Status">
        <select name="statusId" className="input" required defaultValue={project?.statusId ?? statuses[0]?.id}>
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Project manager">
        <select name="managerId" className="input" defaultValue={project?.managerId ?? ctx.userId}>
          <option value="">—</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label={`Budget (${ctx.org.currencyCode})`}>
        <input name="budget" type="number" step="0.01" min="0" className="input" defaultValue={project?.budget != null ? String(project.budget) : ""} />
      </Field>
      <Field label="Start date">
        <input name="startDate" type="date" className="input" defaultValue={toDateInput(project?.startDate)} />
      </Field>
      <Field label="Due date">
        <input name="dueDate" type="date" className="input" defaultValue={toDateInput(project?.dueDate)} />
      </Field>
      <Field label="Progress %" hint="Calculated from tasks automatically once the project has tasks.">
        <input name="progress" type="number" min="0" max="100" className="input" defaultValue={project?.progress ?? 0} />
      </Field>
      <label className="flex items-center gap-2 self-center text-sm">
        <input type="checkbox" name="visibleToClient" defaultChecked={project?.visibleToClient ?? true} /> Show in client portal
      </label>
      <Field label="Description / scope" className="sm:col-span-2">
        <textarea name="description" rows={4} className="input" defaultValue={project?.description ?? ""} />
      </Field>
    </ActionForm>
  );
}
