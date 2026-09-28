import { addActivity, toggleActivity } from "@/app/app/activity-actions";
import type { EntityType } from "@/generated/prisma/enums";
import type { OrgContext } from "@/lib/context";
import { userNames } from "@/lib/lookups";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ActionButton, ActionForm } from "./forms";
import { Badge, Card } from "./ui";

/** Notes, calls, meetings and follow-ups attached to any record. */
export async function Timeline({ ctx, entityType, entityId, canWrite }: { ctx: OrgContext; entityType: EntityType; entityId: string; canWrite: boolean }) {
  const items = await ctx.db.activity.findMany({ where: { entityType, entityId }, orderBy: { createdAt: "desc" }, take: 100 });
  const names = await userNames(ctx, items.map((i) => i.userId));

  return (
    <Card title="Timeline">
      {canWrite && (
        <ActionForm action={addActivity.bind(null, entityType, entityId)} reset submit="Add" submitClassName="btn-secondary btn-sm" className="mb-5">
          <textarea name="content" rows={2} className="input" placeholder="Add a note, call summary or follow-up…" required />
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <select name="type" className="input" aria-label="Type" defaultValue="NOTE">
              <option value="NOTE">Note</option>
              <option value="CALL">Call</option>
              <option value="EMAIL">Email</option>
              <option value="MEETING">Meeting</option>
            </select>
            <input type="date" name="dueAt" className="input" aria-label="Follow-up date (optional)" title="Follow-up date (optional)" />
          </div>
        </ActionForm>
      )}
      {items.length ? (
        <ol className="space-y-4">
          {items.map((a) => (
            <li key={a.id} className="border-l-2 border-violet-100 pl-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-grey">
                <Badge tone={a.type === "FOLLOW_UP" ? (a.doneAt ? "green" : "amber") : "neutral"}>{a.type.replace("_", "-").toLowerCase()}</Badge>
                <span>{a.userId ? names.get(a.userId) ?? "Former member" : "System"}</span>
                <span>· {formatDateTime(a.createdAt)}</span>
                {a.dueAt && <span>· due {formatDate(a.dueAt)}</span>}
              </div>
              <p className="mt-1 text-sm whitespace-pre-wrap">{a.content}</p>
              {a.dueAt && canWrite && (
                <div className="mt-1.5">
                  <ActionButton action={toggleActivity.bind(null, a.id)} className="btn-ghost btn-sm">
                    {a.doneAt ? "Mark as not done" : "Mark done"}
                  </ActionButton>
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-grey">No activity yet.</p>
      )}
    </Card>
  );
}
