"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { ActionResult } from "@/lib/actions";
import { cn } from "@/lib/utils";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

/**
 * Form bound to a server action returning `{ error } | { ok }`.
 * Shows the message, disables the submit button while pending and
 * optionally resets itself after success.
 */
export function ActionForm({
  action,
  children,
  className,
  submit,
  submitClassName = "btn-primary",
  reset,
  footer,
}: {
  action: Action;
  children: ReactNode;
  className?: string;
  submit?: string;
  submitClassName?: string;
  reset?: boolean;
  footer?: ReactNode;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (reset && state && "ok" in state) ref.current?.reset();
  }, [state, reset]);

  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      {state && "error" in state && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state && "ok" in state && state.ok && (
        <p role="status" className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {state.ok}
        </p>
      )}
      {(submit || footer) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {submit && <Submit className={submitClassName}>{submit}</Submit>}
          {footer}
        </div>
      )}
    </form>
  );
}

export function Submit({ children, className = "btn-primary", name, value }: { children: ReactNode; className?: string; name?: string; value?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} name={name} value={value} aria-busy={pending}>
      {pending ? <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

/** One-click action button (e.g. "Mark as sent"), optionally confirmed. */
export function ActionButton({
  action,
  children,
  className = "btn-secondary",
  confirm,
  fields,
}: {
  action: Action;
  children: ReactNode;
  className?: string;
  confirm?: string;
  fields?: Record<string, string>;
}) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form
      action={formAction}
      className="inline-flex flex-col"
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {fields && Object.entries(fields).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <Submit className={cn(className)}>{children}</Submit>
      {state && "error" in state && (
        <span role="alert" className="mt-1 text-xs text-red-700">
          {state.error}
        </span>
      )}
    </form>
  );
}

/** Select that submits its form as soon as the value changes. */
export function AutoSubmitSelect({ name, defaultValue, children, className, label }: { name: string; defaultValue?: string; children: ReactNode; className?: string; label: string }) {
  return (
    <select
      name={name}
      aria-label={label}
      defaultValue={defaultValue}
      className={cn("input", className)}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
    >
      {children}
    </select>
  );
}

export function CopyButton({ text, label = "Copy link" }: { text: string; label?: string }) {
  return (
    <button
      type="button"
      className="btn-secondary btn-sm"
      onClick={async (e) => {
        const btn = e.currentTarget;
        await navigator.clipboard.writeText(text);
        const prev = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = prev), 1500);
      }}
    >
      {label}
    </button>
  );
}

export function PrintButton() {
  return (
    <button type="button" className="btn-secondary no-print" onClick={() => window.print()}>
      Download PDF / Print
    </button>
  );
}
