import type { PhotoKey } from "./images";

export const services = [
  {
    number: "01",
    title: "Website Design & Development",
    short: "Design & Development",
    description:
      "Custom websites designed around your brand, your audience and the action you want visitors to take — then built to be fast, responsive and easy to manage.",
    items: ["Custom UI", "Responsive design", "Service pages", "Contact forms", "SEO foundations", "Analytics", "Performance"],
    photo: "serviceDesignDev" as PhotoKey,
    cta: { label: "Explore Websites", href: "/websites" },
  },
  {
    number: "02",
    title: "Website Care",
    short: "Care",
    description:
      "Monitoring, backups, updates, security and content changes after launch, so your website stays healthy without becoming your job.",
    items: ["Monitoring", "Backups", "Updates", "Security", "Performance", "Content changes"],
    photo: "serviceCare" as PhotoKey,
    cta: { label: "Explore Care Plans", href: "/care-plans" },
  },
  {
    number: "03",
    title: "SEO & Optimization",
    short: "SEO",
    description:
      "Search engine optimisation and continuous improvements to speed, content and user journeys, so more of the right people find you and more of them get in touch.",
    items: ["SEO", "Search Console", "Analytics", "Content improvements", "Conversion optimization", "Performance optimization"],
    photo: "serviceOptimization" as PhotoKey,
    cta: { label: "See SEO results", href: "/work#seo" },
  },
] as const;



export const processSteps: { number: string; title: string; description: string; detail: string; photo: PhotoKey }[] = [
  {
    number: "01",
    title: "Discover",
    description: "We understand your business, audience, goals and what the website needs to achieve.",
    detail: "Goals · Audience · Content · Competitors",
    photo: "processDiscover",
  },
  {
    number: "02",
    title: "Design",
    description: "We create a visual direction and user experience tailored to your brand.",
    detail: "Structure · Typography · Visual direction · Prototypes",
    photo: "processDesign",
  },
  {
    number: "03",
    title: "Build",
    description: "We turn the approved design into a fast, responsive and functional website.",
    detail: "Development · Responsive layouts · Forms · Performance",
    photo: "processBuild",
  },
  {
    number: "04",
    title: "Launch",
    description: "We test across devices, connect analytics and search tools, and take the website live carefully.",
    detail: "Testing · SSL · Analytics · Search Console",
    photo: "processLaunch",
  },
  {
    number: "05",
    title: "Care",
    description: "We can continue maintaining, protecting and improving your website after launch.",
    detail: "Monitoring · Backups · Updates · Improvements",
    photo: "processCare",
  },
];


export const buildSteps: { title: string; description: string; photo: PhotoKey }[] = [
  {
    title: "Strategy",
    description: "We clarify your goals, your audience and the actions you want visitors to take, then plan every page around them.",
    photo: "processDiscover",
  },
  {
    title: "UX",
    description: "We map structure and user journeys so each page has a purpose and every visitor has an obvious next step.",
    photo: "serviceDesignDev",
  },
  {
    title: "Design",
    description: "A visual direction built from your brand: typography, spacing, imagery and detail that feel considered.",
    photo: "processDesign",
  },
  {
    title: "Development",
    description: "The approved design becomes a fast, responsive website with clean, maintainable code and working forms.",
    photo: "processBuild",
  },
  {
    title: "Performance",
    description: "Optimised images, lean code and careful loading so pages feel quick on real phones and real connections.",
    photo: "serviceOptimization",
  },
  {
    title: "Launch",
    description: "Testing across devices, SSL, analytics and search setup where your package includes it — then a careful go-live.",
    photo: "processLaunch",
  },
];

export const includedFeatures: { title: string; description: string }[] = [
  { title: "Responsive Design", description: "Layouts designed for phones, tablets and desktops." },
  { title: "Contact Forms", description: "Simple forms that make it easy to send an enquiry." },
  { title: "WhatsApp", description: "Let customers message you directly in one tap." },
  { title: "Click-to-Call", description: "Phone numbers that call straight from a mobile." },
  { title: "Google Maps", description: "Help local customers find and visit you." },
  { title: "SEO Foundations", description: "Clean structure, titles and descriptions search engines understand." },
  { title: "Analytics", description: "See how people find and use your website." },
  { title: "Search Console", description: "Monitor how your site appears in Google Search." },
  { title: "Performance Optimization", description: "Optimised images and code for fast loading." },
  { title: "SSL", description: "A secure HTTPS connection for every visitor." },
  { title: "Social Integration", description: "Links to the platforms where your customers follow you." },
  { title: "Conversion CTAs", description: "Clear calls to action placed where decisions are made." },
];

export const careReasons: { title: string; description: string }[] = [
  {
    title: "Security",
    description: "Websites are routinely probed for weaknesses. Monitoring and timely updates reduce the risk of a compromise.",
  },
  {
    title: "Backups",
    description: "If something goes wrong, a recent backup means your website can be restored rather than rebuilt.",
  },
  {
    title: "Updates",
    description: "Software and plugins need regular updates to stay compatible, stable and secure.",
  },
  {
    title: "Performance",
    description: "Sites slow down as content and features grow. Keeping an eye on performance keeps pages quick.",
  },
  {
    title: "Monitoring",
    description: "Uptime and SSL monitoring mean problems are noticed early — often before your customers notice them.",
  },
  {
    title: "Content changes",
    description: "New services, prices, photos or opening hours. Send the change and we'll take care of it.",
  },
];
