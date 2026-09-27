export type Plan = {
  id: string;
  name: string;
  price: string;
  unit: string;
  subtitle: string;
  summary: string;
  features: string[];
  /** Short line shown above the list, e.g. "Everything in Basic +" */
  inherits?: string;
  featured?: boolean;
  tier: "standard" | "featured" | "premium";
  cta: { label: string; href: string };
};

export const websitePackages: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$499",
    unit: "one-time",
    subtitle: "Starter Website",
    summary: "A professional, mobile-ready presence for businesses getting established online.",
    tier: "standard",
    features: [
      "Up to 5 pages",
      "Mobile responsive",
      "Modern design",
      "Contact form",
      "Click-to-call button",
      "WhatsApp integration",
      "Google Maps",
      "Social media links",
      "Basic on-page SEO",
      "SSL",
      "Website launch",
    ],
    cta: { label: "Get Started", href: "/contact?package=starter" },
  },
  {
    id: "professional",
    name: "Professional",
    price: "$799",
    unit: "one-time",
    subtitle: "Professional Website",
    summary: "A custom website built around your services and designed to turn visitors into enquiries.",
    tier: "featured",
    featured: true,
    features: [
      "Up to 10 pages",
      "Custom design",
      "Mobile responsive",
      "Service pages",
      "Contact forms",
      "Call/WhatsApp buttons",
      "Google Maps",
      "Basic SEO setup",
      "Google Analytics",
      "Search Console",
      "Speed optimisation",
      "Conversion-focused CTAs",
      "30 days post-launch support",
    ],
    cta: { label: "Get Started", href: "/contact?package=professional" },
  },
  {
    id: "premium",
    name: "Premium",
    price: "$1,199+",
    unit: "one-time",
    subtitle: "Premium Website",
    summary: "A premium custom build for businesses with more services, locations and content to present.",
    tier: "premium",
    features: [
      "Up to 15 pages",
      "Premium custom design",
      "Multiple service pages",
      "Location pages",
      "Blog",
      "Advanced forms",
      "Analytics/tracking",
      "Speed optimisation",
      "Conversion optimisation",
      "Advanced integrations",
      "60 days post-launch support",
    ],
    cta: { label: "Get Started", href: "/contact?package=premium" },
  },
];

/** At-a-glance rows. Only facts stated in each package's feature list. */
export const packageComparison: { label: string; values: [string, string, string] }[] = [
  { label: "Pages", values: ["Up to 5", "Up to 10", "Up to 15"] },
  { label: "Design", values: ["Modern design", "Custom design", "Premium custom design"] },
  { label: "Forms", values: ["Contact form", "Contact forms", "Advanced forms"] },
  { label: "Analytics", values: ["—", "Google Analytics", "Analytics/tracking"] },
  { label: "Speed optimisation", values: ["—", "Included", "Included"] },
  { label: "Conversion focus", values: ["—", "Conversion-focused CTAs", "Conversion optimisation"] },
  { label: "Post-launch support", values: ["—", "30 days", "60 days"] },
];

export const carePlans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: "$49",
    unit: "/month",
    subtitle: "Website Care",
    summary: "The essentials that keep a website secure, backed up and up to date.",
    tier: "standard",
    features: [
      "Website monitoring",
      "Security monitoring",
      "Backups",
      "SSL monitoring",
      "Software/plugin updates",
      "Minor text/image changes",
      "Technical support",
    ],
    cta: { label: "Choose Basic", href: "/contact?plan=basic" },
  },
  {
    id: "plus",
    name: "Plus",
    price: "$99",
    unit: "/month",
    subtitle: "Complete Website Care",
    summary: "Complete care with monthly update time for the changes your business needs.",
    tier: "featured",
    featured: true,
    inherits: "Everything in Basic +",
    features: [
      "Up to 2 hours of minor updates/month",
      "Content changes",
      "Image changes",
      "Broken-link checks",
      "Performance monitoring",
      "Security monitoring",
      "Backup management",
      "Monthly website health check",
    ],
    cta: { label: "Choose Plus", href: "/contact?plan=plus" },
  },
  {
    id: "priority",
    name: "Priority",
    price: "$149",
    unit: "/month",
    subtitle: "Priority Website Care",
    summary: "More update time, small layout changes and priority handling of requests.",
    tier: "premium",
    inherits: "Everything in Plus +",
    features: [
      "Up to 4 hours of minor updates/month",
      "Small layout/section changes",
      "Priority support",
      "Monthly website health report",
      "Faster response time",
    ],
    cta: { label: "Choose Priority", href: "/contact?plan=priority" },
  },
];

/** `true` = included, `false` = not included, string = concise label. */
export type Cell = boolean | string;

export const careComparison: { label: string; values: [Cell, Cell, Cell] }[] = [
  { label: "Website monitoring", values: [true, true, true] },
  { label: "Security monitoring", values: [true, true, true] },
  { label: "Backups", values: [true, "Managed", "Managed"] },
  { label: "SSL monitoring", values: [true, true, true] },
  { label: "Plugin/software updates", values: [true, true, true] },
  { label: "Minor content changes", values: ["Minor", true, true] },
  { label: "Image changes", values: ["Minor", true, true] },
  { label: "Broken-link checks", values: [false, true, true] },
  { label: "Performance monitoring", values: [false, true, true] },
  { label: "Monthly health check", values: [false, true, true] },
  { label: "Monthly update hours", values: [false, "Up to 2 hrs", "Up to 4 hrs"] },
  { label: "Small layout changes", values: [false, false, true] },
  { label: "Priority support", values: [false, false, true] },
  { label: "Health report", values: [false, false, "Monthly"] },
];
