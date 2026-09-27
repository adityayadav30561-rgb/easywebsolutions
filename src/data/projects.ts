/**
 * Portfolio projects.
 *
 * These are design concepts that demonstrate the studio's approach. They are
 * clearly labelled as concepts on the site. Replace or extend them with real
 * client work (with permission) — set `status: "client"`, add a screenshot via
 * `image`, and add verified results. Never add metrics that haven't been measured.
 */

import type { PhotoKey } from "./images";

export const projectCategories = [
  "All",
  "Business",
  "Technology",
  "Services",
  "E-commerce",
] as const;

export type ProjectCategory = Exclude<(typeof projectCategories)[number], "All">;

export type MockupVariant = "corporate" | "local" | "practice" | "store" | "venue" | "community";

export type MockupTheme = {
  /** Backdrop the browser window sits on */
  stage: string;
  /** Website background */
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentSoft: string;
};

export type Project = {
  slug: string;
  /** Licensed photograph used as the art-directed backdrop (src/data/images.ts) */
  cover: PhotoKey;
  coverPosition?: string;
  /** Short editorial line used on the portfolio */
  kicker: string;
  name: string;
  industry: string;
  category: ProjectCategory;
  services: string[];
  description: string;
  status: "concept" | "client";
  /** Optional real screenshot (e.g. "/work/project.webp"). Falls back to the generated mockup. */
  image?: string;
  mockup: { variant: MockupVariant; headline: string; theme: MockupTheme };
  caseStudy: {
    overview: string;
    challenge: string;
    approach: string[];
    designDirection: string;
    solution: string[];
    /** Leave empty until real, measured results exist. */
    results?: string;
  };
};

export const projects: Project[] = [
  {
    slug: "brand-business-website",
    cover: "workTechTower",
    coverPosition: "50% 30%",
    kicker: "Clarity for a company that sells complexity.",
    name: "Brand & Business Website",
    industry: "Technology",
    category: "Technology",
    services: ["Web design", "Development", "SEO foundations"],
    description: "Modern corporate website focused on clarity and lead generation.",
    status: "concept",
    mockup: {
      variant: "corporate",
      headline: "Technology that feels simple.",
      theme: {
        stage: "linear-gradient(145deg,#101522 0%,#221a44 60%,#3b2a7a 100%)",
        bg: "#ffffff",
        surface: "#f4f3fb",
        text: "#101522",
        muted: "#94a3b8",
        accent: "#7c3aed",
        accentSoft: "#ede7fe",
      },
    },
    caseStudy: {
      overview:
        "A concept website for a growing technology company that needs to explain what it does quickly and give decision-makers a clear reason to get in touch.",
      challenge:
        "Technology businesses often describe their work in language only insiders understand. Visitors arrive curious but leave unsure what the company actually does, who it's for, or what to do next.",
      approach: [
        "Lead with a plain-language statement of the problem the company solves.",
        "Organise services around customer outcomes rather than internal product names.",
        "Place a consistent, low-pressure call to action at natural decision points.",
      ],
      designDirection:
        "A confident navy and violet palette, generous whitespace and large geometric type. Interface fragments are used sparingly to hint at the product without turning the site into a dashboard.",
      solution: [
        "A focused homepage that answers what, who and why within the first screen.",
        "Service pages with a repeatable structure that is easy to scan.",
        "A short enquiry form that asks only what is needed to start a conversation.",
      ],
    },
  },
  {
    slug: "local-services-website",
    cover: "workLocalCraft",
    coverPosition: "50% 50%",
    kicker: "Built for the customer holding a phone and a problem.",
    name: "Local Services Website",
    industry: "Home Services",
    category: "Services",
    services: ["Web design", "Development", "Click-to-call & WhatsApp"],
    description: "A mobile-first website that makes it easy for local customers to call, message or request a quote.",
    status: "concept",
    mockup: {
      variant: "local",
      headline: "Reliable help, right when you need it.",
      theme: {
        stage: "linear-gradient(145deg,#f3efe6 0%,#e7dfcf 100%)",
        bg: "#fffdf8",
        surface: "#f2ede2",
        text: "#1f2a24",
        muted: "#a3a89f",
        accent: "#2f6b4f",
        accentSoft: "#dfeae3",
      },
    },
    caseStudy: {
      overview:
        "A concept website for a local service business whose customers are usually searching on a phone and want to get help quickly.",
      challenge:
        "Local customers compare a few options in minutes. If they can't see the services offered, the area covered and a way to get in touch immediately, they move on to the next result.",
      approach: [
        "Design mobile-first, assuming most visitors arrive on a phone.",
        "Keep call, WhatsApp and quote actions visible without being intrusive.",
        "Make service areas and services scannable at a glance.",
      ],
      designDirection:
        "Warm, grounded colours and friendly typography that feel trustworthy and approachable, with clear contrast for readability outdoors on a phone screen.",
      solution: [
        "A homepage structured around the most common jobs customers need done.",
        "Click-to-call and WhatsApp buttons on every page.",
        "A simple quote request form and an embedded map of the service area.",
      ],
    },
  },
  {
    slug: "professional-practice-website",
    cover: "workProfessionalWindows",
    coverPosition: "50% 40%",
    kicker: "Calm, credible and easy to act on.",
    name: "Professional Practice Website",
    industry: "Professional Services",
    category: "Services",
    services: ["Web design", "Content structure", "Development"],
    description: "A calm, credible website for a professional practice, structured around services and consultations.",
    status: "concept",
    mockup: {
      variant: "practice",
      headline: "Clear advice for important decisions.",
      theme: {
        stage: "linear-gradient(145deg,#e9edf3 0%,#d7dee9 100%)",
        bg: "#ffffff",
        surface: "#f1f4f8",
        text: "#14213d",
        muted: "#9aa5b8",
        accent: "#1d3a6e",
        accentSoft: "#e3e9f3",
      },
    },
    caseStudy: {
      overview:
        "A concept website for a professional practice — such as accountants, consultants or advisors — where trust and clarity matter more than flashy visuals.",
      challenge:
        "Prospective clients need to feel confident before they make contact. Dense text and generic stock imagery make practices look interchangeable.",
      approach: [
        "Structure the site around the questions prospective clients actually ask.",
        "Introduce the people behind the practice early to build familiarity.",
        "Make booking a consultation the obvious next step.",
      ],
      designDirection:
        "An editorial layout with restrained navy tones, generous margins and careful typographic hierarchy that feels calm and authoritative.",
      solution: [
        "Service pages that explain who each service is for and what to expect.",
        "A team section that presents expertise without jargon.",
        "A consultation request flow with clear expectations about next steps.",
      ],
    },
  },
  {
    slug: "online-store-concept",
    cover: "workStoreLamp",
    coverPosition: "50% 60%",
    kicker: "A storefront that gets out of the product’s way.",
    name: "Online Store Concept",
    industry: "Retail",
    category: "E-commerce",
    services: ["Web design", "Product pages", "Performance"],
    description: "A product-led storefront concept designed around browsing, clarity and a simple path to purchase.",
    status: "concept",
    mockup: {
      variant: "store",
      headline: "Everyday pieces, thoughtfully made.",
      theme: {
        stage: "linear-gradient(145deg,#f5f1ff 0%,#e9e1fd 100%)",
        bg: "#ffffff",
        surface: "#f6f3ee",
        text: "#1c1917",
        muted: "#a8a29e",
        accent: "#1c1917",
        accentSoft: "#efe9df",
      },
    },
    caseStudy: {
      overview:
        "A storefront concept for a small retail brand that wants its products to feel considered and its checkout path to feel effortless.",
      challenge:
        "Small online stores compete with large marketplaces. They need to communicate brand and quality quickly while keeping browsing fast on mobile.",
      approach: [
        "Let product photography lead, with minimal interface competing for attention.",
        "Keep category navigation shallow and filters simple.",
        "Remove friction between product discovery and the basket.",
      ],
      designDirection:
        "A neutral, gallery-like palette with a single dark accent, soft product backgrounds and precise grid alignment.",
      solution: [
        "A homepage that introduces the brand and surfaces key collections.",
        "Product cards designed for quick comparison on small screens.",
        "Product pages with clear pricing, details and a prominent add-to-basket action.",
      ],
    },
  },
  {
    slug: "hospitality-venue-website",
    cover: "workVenueTram",
    coverPosition: "50% 55%",
    kicker: "Atmosphere first. Bookings one tap away.",
    name: "Hospitality & Venue Website",
    industry: "Hospitality",
    category: "Business",
    services: ["Web design", "Development", "Google Maps"],
    description: "An atmospheric website that shows off the venue, menu and bookings in a few taps.",
    status: "concept",
    mockup: {
      variant: "venue",
      headline: "An evening worth remembering.",
      theme: {
        stage: "linear-gradient(145deg,#1b1511 0%,#2d2119 100%)",
        bg: "#15110e",
        surface: "#231b16",
        text: "#f5ede3",
        muted: "#7d6f63",
        accent: "#d8a15b",
        accentSoft: "#3a2b1f",
      },
    },
    caseStudy: {
      overview:
        "A concept website for a restaurant or venue where atmosphere sells the experience and visitors mostly want the menu, opening hours and a way to book.",
      challenge:
        "Hospitality websites often hide essential information behind PDFs and slow galleries, frustrating guests who are deciding where to go tonight.",
      approach: [
        "Put opening hours, location and booking within one tap from every page.",
        "Present menus as fast, readable pages instead of downloads.",
        "Use imagery to set the mood without slowing the page down.",
      ],
      designDirection:
        "A warm, low-light palette with brass accents and elegant spacing that captures the feel of an evening out.",
      solution: [
        "A homepage that leads with atmosphere and quick access to bookings.",
        "Mobile-friendly menu pages.",
        "An embedded map and clear contact details for guests on the move.",
      ],
    },
  },
  {
    slug: "community-organisation-website",
    cover: "workCommunityStudio",
    coverPosition: "50% 50%",
    kicker: "Accessible by default, easy to keep current.",
    name: "Community Organisation Website",
    industry: "Non-profit",
    category: "Business",
    services: ["Web design", "Accessibility", "Content structure"],
    description: "An accessible, content-friendly website that helps a community organisation share its work and invite involvement.",
    status: "concept",
    mockup: {
      variant: "community",
      headline: "Stronger together, closer to home.",
      theme: {
        stage: "linear-gradient(145deg,#fff4ec 0%,#fde3d3 100%)",
        bg: "#ffffff",
        surface: "#fff5ef",
        text: "#2b1d16",
        muted: "#b5a197",
        accent: "#d9582b",
        accentSoft: "#fde6da",
      },
    },
    caseStudy: {
      overview:
        "A concept website for a community organisation that needs to explain its work, share updates and make it easy to volunteer or donate.",
      challenge:
        "Community organisations serve a broad audience with different needs, often with limited time to update their website.",
      approach: [
        "Design for accessibility first: clear contrast, readable type and simple navigation.",
        "Create a content structure volunteers can keep updated.",
        "Give each audience — supporters, volunteers and people seeking help — a clear path.",
      ],
      designDirection:
        "A warm, optimistic palette with friendly shapes and plenty of space, balancing approachability with credibility.",
      solution: [
        "Audience-based navigation that surfaces the right information quickly.",
        "A news section that is easy to keep up to date.",
        "Prominent, simple ways to get involved.",
      ],
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Order used by the homepage editorial grid: large, small, small, large. */
export const featuredProjectSlugs = [
  "brand-business-website",
  "local-services-website",
  "professional-practice-website",
  "online-store-concept",
];
