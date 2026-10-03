/** Shared contact-form definitions and validation (used by client and server). */

export const needOptions = [
  { value: "new-website", label: "New Website" },
  { value: "redesign", label: "Website Redesign" },
  { value: "care", label: "Website Care" },
  { value: "app", label: "Mobile App" },
  { value: "seo", label: "SEO" },
  { value: "optimization", label: "Website Optimization" },
  { value: "other", label: "Other" },
] as const;

export const budgetOptions = ["Under $500", "$500–$1,000", "$1,000–$2,000", "$2,000+"] as const;

export const packageLabels: Record<string, string> = {
  starter: "Starter website package ($499)",
  professional: "Professional website package ($799)",
  premium: "Premium website package ($1,199+)",
  basic: "Basic care plan ($49/month)",
  plus: "Plus care plan ($99/month)",
  priority: "Priority care plan ($149/month)",
};

export type ContactPayload = {
  name: string;
  business: string;
  email: string;
  phone: string;
  website: string;
  need: string;
  budget: string;
  message: string;
  interest: string;
  /** Honeypot — must stay empty */
  company_url: string;
};

export type FieldErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(data: Partial<ContactPayload>): FieldErrors {
  const errors: FieldErrors = {};
  const name = data.name?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const message = data.message?.trim() ?? "";

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > 120) errors.name = "Please use a shorter name.";

  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(email) || email.length > 200) errors.email = "Please enter a valid email address.";

  if (!message) errors.message = "Please tell us a little about your project.";
  else if (message.length < 10) errors.message = "Please add a little more detail (at least 10 characters).";
  else if (message.length > 5000) errors.message = "Please keep your message under 5,000 characters.";

  if ((data.phone?.length ?? 0) > 40) errors.phone = "Please enter a valid phone number.";
  if ((data.website?.length ?? 0) > 300) errors.website = "Please enter a shorter URL.";
  if ((data.business?.length ?? 0) > 160) errors.business = "Please use a shorter business name.";

  return errors;
}
