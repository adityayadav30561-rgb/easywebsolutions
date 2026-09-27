import type { IconName } from "@/components/ui/Icon";

export const services = [
  {
    number: "01",
    title: "Business Websites",
    description: "Professional websites designed around your brand, audience and business goals.",
    items: [
      "Custom UI",
      "Responsive design",
      "Service pages",
      "Contact forms",
      "SEO foundations",
      "Analytics",
      "Performance optimization",
    ],
    cta: { label: "Explore Websites", href: "/websites" },
  },
  {
    number: "02",
    title: "Website Care",
    description: "Your website stays secure, updated, monitored and performing after launch.",
    items: ["Monitoring", "Backups", "Updates", "Security", "Performance", "Content changes"],
    cta: { label: "Explore Care Plans", href: "/care-plans" },
  },
  {
    number: "03",
    title: "Website Growth",
    description: "Continuous improvements that help your website perform better over time.",
    items: [
      "Conversion optimization",
      "Content improvements",
      "Analytics",
      "UX improvements",
      "Performance optimization",
    ],
    cta: { label: "Talk to Us", href: "/contact?need=optimization" },
  },
] as const;

export const valueStrip: { label: string; icon: IconName }[] = [
  { label: "Modern Design", icon: "sparkle" },
  { label: "Built for Conversion", icon: "target" },
  { label: "Fast & Responsive", icon: "zap" },
  { label: "Ongoing Support", icon: "lifebuoy" },
];

export const problemSolution = [
  {
    problem: "Looks outdated",
    problemNote: "Visitors judge credibility in seconds, and a dated design quietly sends them elsewhere.",
    solution: "Modern visual identity",
    solutionNote: "A clean, current design that reflects the quality of your business.",
  },
  {
    problem: "Confuses visitors",
    problemNote: "Unclear navigation and vague messaging leave people unsure what you offer.",
    solution: "Clear user journeys",
    solutionNote: "Structure and copy that explain what you do and guide people to the right page.",
  },
  {
    problem: "Gets traffic but no enquiries",
    problemNote: "People arrive, look around and leave without taking the next step.",
    solution: "Conversion-focused experiences",
    solutionNote: "Clear calls to action, simple forms and easy ways to call or message you.",
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Discover",
    description: "We understand your business, audience, goals and what the website needs to achieve.",
  },
  {
    number: "02",
    title: "Design",
    description: "We create a visual direction and user experience tailored to your brand.",
  },
  {
    number: "03",
    title: "Build",
    description: "We turn the approved design into a fast, responsive and functional website.",
  },
  {
    number: "04",
    title: "Launch & Care",
    description: "We launch your website and can continue maintaining and improving it.",
  },
];

export const benefits = [
  {
    number: "01",
    title: "Custom, Not Cookie-Cutter",
    description:
      "Every layout is designed around your business, your services and the people you want to reach — not squeezed into a generic theme.",
  },
  {
    number: "02",
    title: "Designed for People",
    description:
      "Clear structure, readable typography and obvious next steps, so visitors understand what you do and how to get in touch.",
  },
  {
    number: "03",
    title: "Built for Performance",
    description:
      "Lean code, optimised images and responsive layouts that load quickly and work properly on phones, tablets and desktops.",
  },
  {
    number: "04",
    title: "Support After Launch",
    description:
      "We don't hand over and disappear. Care plans keep your website secure, updated and improving over time.",
  },
];

export const buildSteps: { title: string; description: string; icon: IconName }[] = [
  {
    title: "Strategy",
    description: "We clarify your goals, audience and the actions you want visitors to take, then plan pages around them.",
    icon: "compass",
  },
  {
    title: "UX",
    description: "We map the structure and user journeys so every page has a clear purpose and an obvious next step.",
    icon: "users",
  },
  {
    title: "Design",
    description: "We create a visual direction that reflects your brand, with typography, spacing and detail that feel considered.",
    icon: "pen",
  },
  {
    title: "Development",
    description: "We build the approved design as a fast, responsive website with clean, maintainable code.",
    icon: "code",
  },
  {
    title: "Testing",
    description: "We check layouts, forms, links and performance across devices and browsers before anything goes live.",
    icon: "check-circle",
  },
  {
    title: "Launch",
    description: "We handle the launch carefully — SSL, analytics and search setup included where your package covers it.",
    icon: "rocket",
  },
  {
    title: "Support",
    description: "Post-launch support is included with Professional and Premium, and care plans are available for ongoing help.",
    icon: "lifebuoy",
  },
];

export const includedFeatures: { title: string; description: string; icon: IconName }[] = [
  { title: "Responsive Design", description: "Layouts designed for phones, tablets and desktops.", icon: "devices" },
  { title: "Contact Forms", description: "Simple forms that make it easy to send an enquiry.", icon: "mail" },
  { title: "WhatsApp", description: "Let customers message you directly in one tap.", icon: "whatsapp" },
  { title: "Click-to-Call", description: "Phone numbers that call straight from a mobile.", icon: "phone" },
  { title: "Google Maps", description: "Help local customers find and visit you.", icon: "map-pin" },
  { title: "SEO Foundations", description: "Clean structure, titles and descriptions search engines understand.", icon: "search" },
  { title: "Analytics", description: "See how people find and use your website.", icon: "chart" },
  { title: "Search Console", description: "Monitor how your site appears in Google Search.", icon: "radar" },
  { title: "Performance Optimization", description: "Optimised images and code for fast loading.", icon: "gauge" },
  { title: "SSL", description: "A secure HTTPS connection for every visitor.", icon: "lock" },
  { title: "Social Integration", description: "Links to the platforms where your customers follow you.", icon: "share" },
  { title: "Conversion CTAs", description: "Clear calls to action placed where decisions are made.", icon: "cursor" },
];

export const careReasons: { title: string; description: string; icon: IconName }[] = [
  {
    title: "Security",
    description: "Websites are routinely probed for weaknesses. Monitoring and timely updates reduce the risk of a compromise.",
    icon: "shield",
  },
  {
    title: "Backups",
    description: "If something goes wrong, a recent backup means your website can be restored rather than rebuilt.",
    icon: "database",
  },
  {
    title: "Updates",
    description: "Software and plugins need regular updates to stay compatible, stable and secure.",
    icon: "refresh",
  },
  {
    title: "Performance",
    description: "Sites slow down as content and features grow. Keeping an eye on performance keeps pages quick.",
    icon: "gauge",
  },
  {
    title: "Monitoring",
    description: "Uptime and SSL monitoring mean problems are noticed early — often before your customers notice them.",
    icon: "activity",
  },
  {
    title: "Content changes",
    description: "New services, prices, photos or opening hours. Send the change and we'll take care of it.",
    icon: "pen",
  },
];
