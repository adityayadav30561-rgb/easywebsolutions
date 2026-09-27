import { NextResponse } from "next/server";
import { budgetOptions, needOptions, packageLabels, validateContact, type ContactPayload } from "@/lib/contact";

/**
 * Contact form endpoint.
 *
 * Delivery (configure one in your hosting environment — see README):
 *  - RESEND_API_KEY + CONTACT_TO_EMAIL (+ optional CONTACT_FROM_EMAIL): sends an email via Resend.
 *  - CONTACT_WEBHOOK_URL: POSTs the enquiry as JSON (Zapier, Make, Slack workflow, Formspree, etc.).
 * In development with neither configured, enquiries are logged to the server console.
 */

const MAX_BODY = 20_000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const str = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function formatText(d: ContactPayload) {
  const need = needOptions.find((o) => o.value === d.need)?.label ?? d.need;
  return [
    `Name: ${d.name}`,
    `Business: ${d.business || "—"}`,
    `Email: ${d.email}`,
    `Phone: ${d.phone || "—"}`,
    `Website: ${d.website || "—"}`,
    `Needs: ${need || "—"}`,
    `Budget: ${d.budget || "—"}`,
    d.interest ? `Interested in: ${packageLabels[d.interest] ?? d.interest}` : null,
    "",
    d.message,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

async function deliver(d: ContactPayload) {
  const text = formatText(d);

  if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "EasyWebSolns Website <onboarding@resend.dev>",
        to: process.env.CONTACT_TO_EMAIL.split(",").map((s) => s.trim()),
        reply_to: d.email,
        subject: `New enquiry from ${d.name}${d.business ? ` (${d.business})` : ""}`,
        text,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    return true;
  }

  if (process.env.CONTACT_WEBHOOK_URL) {
    const res = await fetch(process.env.CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...d, company_url: undefined, text, submittedAt: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return true;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[contact] No delivery configured — enquiry received:\n" + text);
    return true;
  }

  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) {
    return NextResponse.json({ ok: false, error: "Your message is too long." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const data: ContactPayload = {
    name: str(body.name, 120),
    business: str(body.business, 160),
    email: str(body.email, 200),
    phone: str(body.phone, 40),
    website: str(body.website, 300),
    need: needOptions.some((o) => o.value === body.need) ? String(body.need) : "",
    budget: (budgetOptions as readonly string[]).includes(String(body.budget)) ? String(body.budget) : "",
    message: str(body.message, 5000),
    interest: str(body.interest, 40) in packageLabels ? str(body.interest, 40) : "",
    company_url: str(body.company_url, 200),
  };

  // Bots fill hidden fields — accept silently without delivering.
  if (data.company_url) return NextResponse.json({ ok: true });

  const errors = validateContact(data);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const delivered = await deliver(data);
    if (!delivered) {
      console.error("[contact] No delivery method configured (set RESEND_API_KEY/CONTACT_TO_EMAIL or CONTACT_WEBHOOK_URL).");
      return NextResponse.json({ ok: false, error: "The form is temporarily unavailable." }, { status: 503 });
    }
  } catch (err) {
    console.error("[contact] Delivery failed", err);
    return NextResponse.json({ ok: false, error: "We couldn't send your enquiry." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
