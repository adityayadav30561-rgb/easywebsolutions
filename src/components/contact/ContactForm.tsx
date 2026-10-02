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
import { Arrow, Button } from "@/components/site/Button";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "mt-2 block w-full rounded-2xl border border-white/80 bg-white/55 px-4 py-3.5 text-[1.02rem] text-ink placeholder:text-mute-2 " +
  "shadow-[inset_0_1px_2px_rgb(29_29_31/0.06)] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 outline-none " +
  "hover:bg-white/70 focus:border-violet focus:bg-white/80 focus:shadow-[0_0_0_4px_rgb(138_109_188/0.18)] aria-[invalid=true]:border-red-500";

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
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium text-ink">
        <span>
          {label}
          {required && (
            <span className="ml-0.5 text-violet-600" aria-hidden="true">
              *
            </span>
          )}
        </span>
        {!required && <span className="font-normal text-mute">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-mute">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-700">
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
        <span aria-hidden="true" className="grid size-16 place-items-center rounded-full bg-ink text-white shadow-[0_12px_30px_-10px_rgb(90_69_137/0.7)]">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-6"><path d="M3.5 8.4l2.9 2.9 6.1-6.6" /></svg>
        </span>
        <h2 className="t-display mt-8 text-[3rem] sm:text-[4rem]">Thank you{submittedName ? `, ${submittedName}` : ""}.</h2>
        <p className="mt-6 max-w-md text-lg text-ink-2">
          Your enquiry has been sent. We&apos;ll review the details and get back to you by email as soon as we can.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn btn-glass glass glass-thin mt-10 [--radius:999px]"
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
    <form noValidate onSubmit={onSubmit} aria-describedby="form-note" className="space-y-7">
      <p id="form-note" className="text-sm text-mute">
        Fields marked <span className="text-violet-600">*</span> are required.
      </p>

      {interest && (
        <div className="flex items-center gap-3 rounded-2xl bg-violet-50/80 px-4 py-3 text-sm text-ink-2 ring-1 ring-violet-300/50">
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

      <fieldset>
        <legend className="mb-3 flex w-full items-baseline justify-between text-sm font-medium text-ink">
          <span>Project type</span>
          <span className="font-normal text-mute">Optional</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {needOptions.map((o) => (
            <label key={o.value} className="relative cursor-pointer">
              <input type="radio" name="need" value={o.value} defaultChecked={validNeed === o.value} className="peer sr-only" />
              <span className="flex min-h-11 items-center rounded-full border border-white/80 bg-white/55 px-4 text-sm font-medium text-ink-2 shadow-[inset_0_1px_0_#fff] backdrop-blur-md transition-all duration-300 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet hover:bg-white/80 active:scale-95">
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 flex w-full items-baseline justify-between text-sm font-medium text-ink">
          <span>Budget</span>
          <span className="font-normal text-mute">Optional</span>
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {budgetOptions.map((b) => (
            <label key={b} className="relative cursor-pointer">
              <input type="radio" name="budget" value={b} className="peer sr-only" />
              <span className="flex min-h-12 items-center justify-center rounded-full border border-white/80 bg-white/55 px-3 text-center text-sm font-medium text-ink-2 shadow-[inset_0_1px_0_#fff] backdrop-blur-md transition-all duration-300 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet hover:bg-white/80 active:scale-95">
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
          rows={4}
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
        <div role="alert" className="rounded-2xl bg-red-50/90 px-4 py-3.5 text-sm text-red-800 ring-1 ring-red-200">
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
        <p className="text-xs leading-relaxed text-mute sm:max-w-xs">
          We only use your details to respond to your enquiry. See our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
            Privacy Policy
          </Link>
          .
        </p>
        <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
          <span>{status === "submitting" ? "Sending…" : "Send enquiry"}</span>
          {status !== "submitting" && <Arrow />}
        </Button>
      </div>
    </form>
  );
}
