"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { site } from "@/config/site";
import {
  budgetOptions,
  needOptions,
  packageLabels,
  validateContact,
  type ContactPayload,
  type FieldErrors,
} from "@/lib/contact";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "block w-full rounded-xl border border-line-strong bg-white px-4 py-3 text-[0.9375rem] text-ink placeholder:text-slate-400 " +
  "transition-[border-color,box-shadow] duration-300 outline-none hover:border-ink/25 " +
  "focus:border-violet-600 focus:ring-4 focus:ring-violet/15 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/15";

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-medium text-ink">
        <span>
          {label}
          {required && (
            <span className="ml-0.5 text-violet-600" aria-hidden="true">
              *
            </span>
          )}
        </span>
        {!required && <span className="text-xs font-normal text-slate">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
          <Icon name="x" size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

/** Reads ?need=, ?package= and ?plan= so CTAs across the site pre-fill the form. */
export function ContactFormWithParams() {
  const params = useSearchParams();
  const interest = params.get("package") ?? params.get("plan") ?? "";
  let need = params.get("need") ?? "";
  if (!need && params.get("package")) need = "new-website";
  if (!need && params.get("plan")) need = "care";
  return <ContactForm key={`${need}-${interest}`} defaultNeed={need} interest={interest in packageLabels ? interest : ""} />;
}

export function ContactForm({ defaultNeed = "", interest = "" }: { defaultNeed?: string; interest?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const validNeed = needOptions.some((o) => o.value === defaultNeed) ? defaultNeed : "";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as unknown as ContactPayload;

    const found = validateContact(data);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: FieldErrors; error?: string };
      if (res.ok && json.ok) {
        setSubmittedName(data.name.trim().split(" ")[0] ?? "");
        setStatus("success");
        form.reset();
        return;
      }
      if (json.errors) setErrors(json.errors);
      setServerError(json.error ?? "Something went wrong while sending your enquiry.");
      setStatus("error");
    } catch {
      setServerError("We couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex min-h-[28rem] flex-col items-center justify-center px-4 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-300 to-violet-600 text-white shadow-[0_14px_30px_-12px_rgb(124_58_237/0.7)]">
          <Icon name="check" size={28} strokeWidth={2.2} />
        </span>
        <h2 className="mt-8 text-3xl font-semibold">Thank you{submittedName ? `, ${submittedName}` : ""}.</h2>
        <p className="mt-4 max-w-md text-slate">
          Your enquiry has been sent. We&apos;ll review the details and get back to you by email as soon as we can.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink hover:text-violet-600"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const describedBy = (id: keyof ContactPayload, hint?: boolean) =>
    errors[id] ? `${id}-error` : hint ? `${id}-hint` : undefined;

  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent("Website enquiry")}`;

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby="form-note" className="space-y-6">
      <p id="form-note" className="text-sm text-slate">
        Fields marked <span className="text-violet-600">*</span> are required.
      </p>

      {interest && (
        <div className="flex items-center gap-3 rounded-xl border border-violet/20 bg-violet-50/70 px-4 py-3 text-sm text-ink-800">
          <Icon name="sparkle" size={17} className="shrink-0 text-violet-600" />
          <span>
            Enquiring about: <strong className="font-semibold">{packageLabels[interest]}</strong>
          </span>
          <input type="hidden" name="interest" value={interest} />
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Name" required error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={inputClass}
          />
        </Field>
        <Field id="business" label="Business Name" error={errors.business}>
          <input id="business" name="business" type="text" autoComplete="organization" aria-invalid={Boolean(errors.business)} aria-describedby={describedBy("business")} className={inputClass} />
        </Field>
        <Field id="email" label="Email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className={inputClass}
          />
        </Field>
        <Field id="phone" label="Phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("phone")} className={inputClass} />
        </Field>
      </div>

      <Field id="website" label="Website URL" error={errors.website} hint="If you already have a website.">
        <input
          id="website"
          name="website"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="yourbusiness.com"
          aria-invalid={Boolean(errors.website)}
          aria-describedby={describedBy("website", true)}
          className={inputClass}
        />
      </Field>

      <Field id="need" label="What do you need?">
        <div className="relative">
          <select id="need" name="need" defaultValue={validNeed} className={cn(inputClass, "appearance-none pr-11")}>
            <option value="">Select an option</option>
            {needOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Icon name="arrow-right" size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 rotate-90 text-slate" />
        </div>
      </Field>

      <fieldset>
        <legend className="mb-2 flex w-full items-baseline justify-between text-sm font-medium text-ink">
          <span>Budget</span>
          <span className="text-xs font-normal text-slate">Optional</span>
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {budgetOptions.map((b) => (
            <label key={b} className="relative cursor-pointer">
              <input type="radio" name="budget" value={b} className="peer sr-only" />
              <span className="flex min-h-11 items-center justify-center rounded-xl border border-line-strong bg-white px-3 text-center text-sm font-medium text-ink-700 transition-all duration-300 peer-checked:border-violet-600 peer-checked:bg-violet-50 peer-checked:text-violet-700 peer-focus-visible:ring-4 peer-focus-visible:ring-violet/20 hover:border-ink/25">
                {b}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field id="message" label="Message" required error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-required="true"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
          placeholder="Tell us about your business, what you need and anything else we should know."
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company_url">Leave this field empty</label>
        <input id="company_url" name="company_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && serverError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800">
          <p className="font-medium">{serverError}</p>
          <p className="mt-1">
            You can also email us directly at{" "}
            <a href={mailto} className="font-semibold underline underline-offset-2">
              {site.contact.email}
            </a>
            .
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate sm:max-w-xs">
          We only use your details to respond to your enquiry. See our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
            Privacy Policy
          </Link>
          .
        </p>
        <Button type="submit" size="lg" arrow={status !== "submitting"} disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? "Sending…" : "Send Enquiry"}
        </Button>
      </div>
    </form>
  );
}
