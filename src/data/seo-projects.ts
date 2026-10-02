/**
 * SEO client projects.
 *
 * Every figure below is copied exactly from the client's own Google Analytics 4
 * and Google Search Console accounts (screenshots supplied by EasyWebSolns,
 * reproduced unedited on each case study page as evidence). "Trend" notes are
 * read from the charts in those screenshots and are deliberately approximate.
 * Do not add numbers that don't appear in a screenshot.
 */
import type { StaticImageData } from "next/image";

import badowlDesktop from "@/assets/work/badowl/home-desktop.webp";
import badowlMobile from "@/assets/work/badowl/home-mobile.webp";
import badowlGa from "@/assets/work/badowl/proof-ga.webp";
import badowlGsc from "@/assets/work/badowl/proof-gsc.webp";
import badowlAi from "@/assets/work/badowl/proof-ai.webp";

import kamaDesktop from "@/assets/work/kama-health-india/home-desktop.webp";
import kamaMobile from "@/assets/work/kama-health-india/home-mobile.webp";
import kamaGa from "@/assets/work/kama-health-india/proof-ga.webp";
import kamaGsc from "@/assets/work/kama-health-india/proof-gsc.webp";
import kamaAi from "@/assets/work/kama-health-india/proof-ai.webp";

import khadiDesktop from "@/assets/work/khadi-organique/home-desktop.webp";
import khadiMobile from "@/assets/work/khadi-organique/home-mobile.webp";
import khadiGa from "@/assets/work/khadi-organique/proof-ga.webp";
import khadiGsc from "@/assets/work/khadi-organique/proof-gsc.webp";
import khadiAi from "@/assets/work/khadi-organique/proof-ai.webp";

import sevenDesktop from "@/assets/work/7-seas-matrix/home-desktop.webp";
import sevenMobile from "@/assets/work/7-seas-matrix/home-mobile.webp";
import sevenGa from "@/assets/work/7-seas-matrix/proof-ga.webp";
import sevenGsc from "@/assets/work/7-seas-matrix/proof-gsc.webp";
import sevenAi from "@/assets/work/7-seas-matrix/proof-ai.webp";

import freshDesktop from "@/assets/work/fresh-light-photography/home-desktop.webp";
import freshMobile from "@/assets/work/fresh-light-photography/home-mobile.webp";
import freshGsc from "@/assets/work/fresh-light-photography/proof-gsc.webp";
import freshAi from "@/assets/work/fresh-light-photography/proof-ai.webp";

export type Metric = { label: string; value: string; change?: string };

export type SeoProject = {
  kind: "seo";
  slug: string;
  name: string;
  url: string;
  domain: string;
  industry: string;
  location: string;
  /** One-line summary used on cards */
  kicker: string;
  /** What the business does (from its website) */
  about: string;
  /** Shown in the home page "Selected work" reel */
  featured: boolean;
  /** Brand-ish colour used to tint the card */
  accent: string;
  shots: { desktop: StaticImageData; mobile: StaticImageData };
  /** The single number that tells the story on the card */
  headline: { value: string; label: string; period: string };
  analytics?: { period: string; metrics: Metric[]; note?: string };
  search: { period: string; clicks: string; impressions: string; ctr: string; position: string };
  ai: { impressions: string; period: string };
  trends: string[];
  proof: { image: StaticImageData; title: string; caption: string }[];
};

const GA = "Google Analytics 4";
const GSC = "Google Search Console";

export const seoProjects: SeoProject[] = [
  {
    kind: "seo",
    slug: "badowl",
    name: "Badowl",
    url: "https://badowl.in/",
    domain: "badowl.in",
    industry: "E-commerce · Riding & sports gear",
    location: "India",
    kicker: "311K users and 6.2K purchases in eight months.",
    about:
      "Badowl is an Indian online store for riding and sports protection gear: riding gloves, arm sleeves, UV jackets, balaclavas and support gear for cyclists, motorcyclists and active people.",
    featured: true,
    accent: "#5b3df5",
    shots: { desktop: badowlDesktop, mobile: badowlMobile },
    headline: { value: "+7,245%", label: "more active users", period: "Feb – Sep 2026 vs. previous period" },
    analytics: {
      period: "1 Feb – 25 Sep 2026, compared with the previous period of the same length",
      metrics: [
        { label: "Active users", value: "311K", change: "+7,245.2%" },
        { label: "Purchases", value: "6.2K", change: "+6,537.2%" },
        { label: "Page views", value: "1.6M", change: "+17,064.1%" },
        { label: "Events", value: "3.5M", change: "+14,023.9%" },
      ],
    },
    search: { period: "Last 6 months (Mar – Sep 2026)", clicks: "5.33K", impressions: "61.3K", ctr: "8.7%", position: "7.5" },
    ai: { impressions: "3.64K", period: "May – Sep 2026" },
    trends: [
      "Purchases grew alongside traffic: 6.2K orders in the period, up 6,537% on the previous one.",
      "Daily search impressions climbed from roughly 150 a day in spring to around 500 a day by September.",
      "An 8.7% click-through rate at an average position of 7.5: when Badowl appears, people click.",
      "Appearances in Google's AI features grew from a handful a day in May to 40–60 a day by September.",
    ],
    proof: [
      { image: badowlGa, title: "Google Analytics 4", caption: "Active users, events, views and purchases, 1 Feb – 25 Sep 2026 vs. the previous period." },
      { image: badowlGsc, title: "Google Search Console: Performance", caption: "Clicks, impressions, CTR and average position over the last 6 months." },
      { image: badowlAi, title: "Search Console: Generative AI features", caption: "Impressions in Google's AI-generated results." },
    ],
  },
  {
    kind: "seo",
    slug: "kama-health-india",
    name: "Kama Health India",
    url: "https://kamahealthindia.com/",
    domain: "kamahealthindia.com",
    industry: "Healthcare · Online therapy",
    location: "India",
    kicker: "A sensitive subject, now reaching 104K people.",
    about:
      "Kama Health India is an online sex and relationship therapy practice led by a licensed clinical psychologist, offering individual and couple sessions, courses and educational content.",
    featured: true,
    accent: "#e2554f",
    shots: { desktop: kamaDesktop, mobile: kamaMobile },
    headline: { value: "+1,484%", label: "more active users", period: "Mar – Sep 2026 vs. previous period" },
    analytics: {
      period: "1 Mar – 25 Sep 2026, compared with the previous period of the same length",
      metrics: [
        { label: "Active users", value: "104K", change: "+1,483.8%" },
        { label: "Sessions", value: "115K", change: "+1,356.0%" },
        { label: "Engaged sessions", value: "50K", change: "+1,983.3%" },
        { label: "Events", value: "828K", change: "+1,796.0%" },
      ],
    },
    search: { period: "Last 6 months (Mar – Sep 2026)", clicks: "3.87K", impressions: "66.9K", ctr: "5.8%", position: "7.8" },
    ai: { impressions: "10.3K", period: "May – Sep 2026" },
    trends: [
      "Engaged sessions grew fastest of all (+1,983%): visitors weren't just arriving, they were reading.",
      "Daily clicks from Google rose from single digits in March to around 30–40 a day by September.",
      "An average position of 7.8 means the practice typically appears on the first page of Google.",
      "10.3K appearances in Google's AI results, rising from about 25 a day in May to around 100 a day.",
    ],
    proof: [
      { image: kamaGa, title: "Google Analytics 4", caption: "Active users, events, engaged sessions and sessions, 1 Mar – 25 Sep 2026 vs. the previous period." },
      { image: kamaGsc, title: "Google Search Console: Performance", caption: "Clicks, impressions, CTR and average position over the last 6 months." },
      { image: kamaAi, title: "Search Console: Generative AI features", caption: "Impressions in Google's AI-generated results." },
    ],
  },
  {
    kind: "seo",
    slug: "khadi-organique",
    name: "Khadi Organique",
    url: "https://khadiorganique.com/",
    domain: "khadiorganique.com",
    industry: "E-commerce · Natural beauty",
    location: "India",
    kicker: "1.19M search impressions and conversions up 9,517%.",
    about:
      "Khadi Organique sells natural, plant-based skincare, hair care, body care, sun protection and aromatherapy products to customers in India and internationally.",
    featured: true,
    accent: "#a0632b",
    shots: { desktop: khadiDesktop, mobile: khadiMobile },
    headline: { value: "+9,517%", label: "more key events (conversions)", period: "Mar – Jul 2026 vs. previous period" },
    analytics: {
      period: "1 Mar – 31 Jul 2026, compared with the previous period of the same length",
      metrics: [
        { label: "Key events (conversions)", value: "63K", change: "+9,517.3%" },
        { label: "Engagement rate", value: "73.5%", change: "+182.3%" },
        { label: "Page views", value: "116K", change: "+46.4%" },
        { label: "Events", value: "284K", change: "+4.2%" },
      ],
      note: "From May the engagement rate held well above Google's peer median for clean-beauty sites.",
    },
    search: { period: "Last 6 months (Mar – Sep 2026)", clicks: "10.3K", impressions: "1.19M", ctr: "0.9%", position: "9.5" },
    ai: { impressions: "59.4K", period: "May – Sep 2026" },
    trends: [
      "Conversions (key events) rose 9,517% while page views grew 46%: the right visitors, doing the right things.",
      "Engagement rate jumped from around 40% to about 95% in May and stayed there, well above the clean-beauty peer median.",
      "Over 1.19 million appearances in Google Search in six months, at an average position of 9.5.",
      "59.4K appearances in Google's AI results, roughly doubling from about 250 a day to 500+ a day.",
    ],
    proof: [
      { image: khadiGa, title: "Google Analytics 4", caption: "Engagement rate, events, key events and views, 1 Mar – 31 Jul 2026 vs. the previous period and the clean-beauty peer median." },
      { image: khadiGsc, title: "Google Search Console: Performance", caption: "Clicks, impressions, CTR and average position over the last 6 months." },
      { image: khadiAi, title: "Search Console: Generative AI features", caption: "Impressions in Google's AI-generated results." },
    ],
  },
  {
    kind: "seo",
    slug: "7-seas-matrix",
    name: "7 Seas Matrix Logistics",
    url: "https://www.7seasmatrix.com/",
    domain: "7seasmatrix.com",
    industry: "B2B · Logistics & freight",
    location: "Dubai, UAE",
    kicker: "A Dubai logistics firm, now reaching 5x more visitors.",
    about:
      "7 Seas Matrix is a logistics company based in Dubai and JAFZA, offering air and ocean freight, land transport, warehousing, customs brokerage and project cargo to businesses worldwide.",
    featured: false,
    accent: "#0f6b78",
    shots: { desktop: sevenDesktop, mobile: sevenMobile },
    headline: { value: "+418%", label: "more active users", period: "Jan – Sep 2026 vs. previous period" },
    analytics: {
      period: "1 Jan – 25 Sep 2026, compared with the previous period of the same length",
      metrics: [
        { label: "Active users", value: "5.6K", change: "+417.9%" },
        { label: "New users", value: "5.8K", change: "+413.6%" },
        { label: "Sessions", value: "7K", change: "+292.4%" },
        { label: "First visits", value: "5.8K", change: "+413.6%" },
      ],
    },
    search: { period: "Last 12 months (Sep 2025 – Sep 2026)", clicks: "2.38K", impressions: "161K", ctr: "1.5%", position: "19.2" },
    ai: { impressions: "7.37K", period: "May – Sep 2026" },
    trends: [
      "New users up 414%: thousands of people discovering the company for the first time.",
      "Daily search impressions grew from near zero in late 2025 to roughly 500–750 a day by August and September 2026.",
      "161K appearances in Google Search over 12 months in a competitive B2B market.",
      "7.37K appearances in Google's AI results since May 2026.",
    ],
    proof: [
      { image: sevenGa, title: "Google Analytics 4", caption: "Sessions, new users, first visits and active users, 1 Jan – 25 Sep 2026 vs. the previous period." },
      { image: sevenGsc, title: "Google Search Console: Performance", caption: "Clicks, impressions, CTR and average position over the last 12 months." },
      { image: sevenAi, title: "Search Console: Generative AI features", caption: "Impressions in Google's AI-generated results." },
    ],
  },
  {
    kind: "seo",
    slug: "fresh-light-photography",
    name: "Fresh Light Photography",
    url: "https://fresh-light-photography.com/",
    domain: "fresh-light-photography.com",
    industry: "Local services · Photography studio",
    location: "Houston, Texas, USA",
    kicker: "A Houston studio seen 503K times on Google in a year.",
    about:
      "Fresh Light Photography is a luxury newborn and maternity photography studio in Houston Heights, Texas, serving families across Greater Houston.",
    featured: false,
    accent: "#9a8a7a",
    shots: { desktop: freshDesktop, mobile: freshMobile },
    headline: { value: "503K", label: "Google search impressions", period: "Last 12 months" },
    search: { period: "Last 12 months (Sep 2025 – Sep 2026)", clicks: "1.76K", impressions: "503K", ctr: "0.3%", position: "14.3" },
    ai: { impressions: "19.3K", period: "May – Sep 2026" },
    trends: [
      "Over half a million appearances in Google Search in 12 months for a single local studio.",
      "Consistent visibility all year, at around 1,000–1,500 impressions a day.",
      "19.3K appearances in Google's AI results, growing from about 80 a day in May to around 200 a day.",
    ],
    proof: [
      { image: freshGsc, title: "Google Search Console: Performance", caption: "Clicks, impressions, CTR and average position over the last 12 months." },
      { image: freshAi, title: "Search Console: Generative AI features", caption: "Impressions in Google's AI-generated results." },
    ],
  },
];

export const sources = { GA, GSC };
