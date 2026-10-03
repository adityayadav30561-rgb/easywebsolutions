/**
 * Central site configuration.
 *
 * ⚠️  EDIT BEFORE LAUNCH — values marked `PLACEHOLDER` must be replaced with
 * the business's real details. Everything on the site reads from here.
 */

export const site = {
  name: "EasyWebSolns",
  domain: "easywebsolns.com",
  url: "https://easywebsolns.com",
  tagline: "Websites that work for you.",
  description:
    "EasyWebSolns designs, builds and cares for fast, modern websites that build trust, generate enquiries and help businesses grow online.",

  /**
   * Official logo (mark, wordmark and tagline), background made transparent and
   * surrounding whitespace trimmed. Width/height are the file's intrinsic size so
   * the original proportions are preserved everywhere.
   */
  logo: {
    src: "/brand/easywebsolns-logo.png",
    width: 1611,
    height: 279,
    alt: "EasyWebSolns — Websites that work for you",
  },

  contact: {
    email: "hello@easywebsolns.com", // PLACEHOLDER — confirm address
    phoneDisplay: "+1 (555) 000-0000", // PLACEHOLDER
    phoneHref: "+15550000000", // PLACEHOLDER — E.164 format, used for tel:
    whatsappNumber: "15550000000", // PLACEHOLDER — digits only, used for wa.me
    whatsappMessage: "Hi EasyWebSolns, I'd like to talk about a website.",
  },

  social: [
    { label: "Instagram", href: "https://www.instagram.com/easywebsolns", icon: "instagram" }, // PLACEHOLDER
    { label: "LinkedIn", href: "https://www.linkedin.com/company/easywebsolns", icon: "linkedin" }, // PLACEHOLDER
    { label: "Facebook", href: "https://www.facebook.com/easywebsolns", icon: "facebook" }, // PLACEHOLDER
  ],

  copyrightYear: 2026,
} as const;

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Websites", href: "/websites" },
  { label: "Care Plans", href: "/care-plans" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerServices = [
  { label: "Business Websites", href: "/websites" },
  { label: "Website Care", href: "/care-plans" },
  { label: "App Development", href: "/work#apps" },
  { label: "SEO & Optimization", href: "/work#seo" },
] as const;

export const legalNav = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
] as const;

export function whatsappHref(message: string = site.contact.whatsappMessage) {
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
