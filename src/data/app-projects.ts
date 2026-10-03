/**
 * Mobile apps built by EasyWebSolns.
 *
 * Screens are real captures of each app (iPhone 15 Pro size, 1179×2556), stored
 * as high-quality WebP. next/image serves each visitor a resized AVIF/WebP, so
 * the full-resolution files are only downloaded when someone opens one full size.
 * Screens show each app's own sample/demo data.
 */
import type { StaticImageData } from "next/image";

// Event Intelligence India
import eiHeroLight from "@/assets/work/apps/event-intelligence-india/hero-light.webp";
import eiHeroDark from "@/assets/work/apps/event-intelligence-india/hero-dark.webp";
import eiL00a from "@/assets/work/apps/event-intelligence-india/light/00a-sign-in.webp";
import eiL00b from "@/assets/work/apps/event-intelligence-india/light/00b-onboarding-welcome.webp";
import eiL00c from "@/assets/work/apps/event-intelligence-india/light/00c-onboarding-interests.webp";
import eiL01 from "@/assets/work/apps/event-intelligence-india/light/01-home.webp";
import eiL02 from "@/assets/work/apps/event-intelligence-india/light/02-home-for-you.webp";
import eiL03 from "@/assets/work/apps/event-intelligence-india/light/03-explore.webp";
import eiL04 from "@/assets/work/apps/event-intelligence-india/light/04-explore-natural-search.webp";
import eiL04b from "@/assets/work/apps/event-intelligence-india/light/04b-explore-map.webp";
import eiL05 from "@/assets/work/apps/event-intelligence-india/light/05-event-detail.webp";
import eiL05b from "@/assets/work/apps/event-intelligence-india/light/05b-event-detail-why.webp";
import eiL06 from "@/assets/work/apps/event-intelligence-india/light/06-my-events.webp";
import eiL07 from "@/assets/work/apps/event-intelligence-india/light/07-calendar.webp";
import eiL08 from "@/assets/work/apps/event-intelligence-india/light/08-event-day.webp";
import eiL09 from "@/assets/work/apps/event-intelligence-india/light/09-more.webp";
import eiD00a from "@/assets/work/apps/event-intelligence-india/dark/00a-sign-in.webp";
import eiD00b from "@/assets/work/apps/event-intelligence-india/dark/00b-onboarding-welcome.webp";
import eiD00c from "@/assets/work/apps/event-intelligence-india/dark/00c-onboarding-interests.webp";
import eiD01 from "@/assets/work/apps/event-intelligence-india/dark/01-home.webp";
import eiD02 from "@/assets/work/apps/event-intelligence-india/dark/02-home-for-you.webp";
import eiD03 from "@/assets/work/apps/event-intelligence-india/dark/03-explore.webp";
import eiD04 from "@/assets/work/apps/event-intelligence-india/dark/04-explore-natural-search.webp";
import eiD04b from "@/assets/work/apps/event-intelligence-india/dark/04b-explore-map.webp";
import eiD05 from "@/assets/work/apps/event-intelligence-india/dark/05-event-detail.webp";
import eiD05b from "@/assets/work/apps/event-intelligence-india/dark/05b-event-detail-why.webp";
import eiD06 from "@/assets/work/apps/event-intelligence-india/dark/06-my-events.webp";
import eiD07 from "@/assets/work/apps/event-intelligence-india/dark/07-calendar.webp";
import eiD08 from "@/assets/work/apps/event-intelligence-india/dark/08-event-day.webp";
import eiD09 from "@/assets/work/apps/event-intelligence-india/dark/09-more.webp";

// Maharishi Ayurveda
import maHero from "@/assets/work/apps/maharishi-ayurveda/hero.webp";
import maHero2 from "@/assets/work/apps/maharishi-ayurveda/hero-2.webp";
import ma01 from "@/assets/work/apps/maharishi-ayurveda/01-onboarding-1.webp";
import ma02 from "@/assets/work/apps/maharishi-ayurveda/02-onboarding-2.webp";
import ma03 from "@/assets/work/apps/maharishi-ayurveda/03-onboarding-3.webp";
import ma04 from "@/assets/work/apps/maharishi-ayurveda/04-onboarding-interests.webp";
import ma05 from "@/assets/work/apps/maharishi-ayurveda/05-login.webp";
import ma06 from "@/assets/work/apps/maharishi-ayurveda/06-otp.webp";
import ma07 from "@/assets/work/apps/maharishi-ayurveda/07-home.webp";
import ma08 from "@/assets/work/apps/maharishi-ayurveda/08-home-profile-ritual.webp";
import ma09 from "@/assets/work/apps/maharishi-ayurveda/09-home-recommended.webp";
import ma10 from "@/assets/work/apps/maharishi-ayurveda/10-order-tracking.webp";
import ma11 from "@/assets/work/apps/maharishi-ayurveda/11-explore.webp";
import ma12 from "@/assets/work/apps/maharishi-ayurveda/12-explore-more.webp";
import ma13 from "@/assets/work/apps/maharishi-ayurveda/13-product-detail.webp";
import ma14 from "@/assets/work/apps/maharishi-ayurveda/14-product-detail-more.webp";
import ma15 from "@/assets/work/apps/maharishi-ayurveda/15-consult.webp";
import ma16 from "@/assets/work/apps/maharishi-ayurveda/16-my-wellness.webp";
import ma17 from "@/assets/work/apps/maharishi-ayurveda/17-my-wellness-more.webp";
import ma18 from "@/assets/work/apps/maharishi-ayurveda/18-account.webp";
import ma19 from "@/assets/work/apps/maharishi-ayurveda/19-search.webp";

// Toys Cartel
import tcHero from "@/assets/work/apps/toys-cartel/hero.webp";
import tcHero2 from "@/assets/work/apps/toys-cartel/hero-2.webp";
import tc01 from "@/assets/work/apps/toys-cartel/01-onboarding-1.webp";
import tc02 from "@/assets/work/apps/toys-cartel/02-onboarding-2.webp";
import tc04 from "@/assets/work/apps/toys-cartel/04-home.webp";
import tc05 from "@/assets/work/apps/toys-cartel/05-home-bestsellers.webp";
import tc06 from "@/assets/work/apps/toys-cartel/06-home-more.webp";
import tc07 from "@/assets/work/apps/toys-cartel/07-search.webp";
import tc08 from "@/assets/work/apps/toys-cartel/08-search-results.webp";
import tc09 from "@/assets/work/apps/toys-cartel/09-categories.webp";
import tc10 from "@/assets/work/apps/toys-cartel/10-category-listing.webp";
import tc11 from "@/assets/work/apps/toys-cartel/11-product-detail.webp";
import tc12 from "@/assets/work/apps/toys-cartel/12-product-detail-more.webp";
import tc13 from "@/assets/work/apps/toys-cartel/13-wishlist.webp";
import tc14 from "@/assets/work/apps/toys-cartel/14-cart.webp";
import tc15 from "@/assets/work/apps/toys-cartel/15-account.webp";

export type AppScreen = {
  title: string;
  caption: string;
  image: StaticImageData;
  /** Same screen in the app's dark theme, when it has one */
  dark?: StaticImageData;
};

export type AppProject = {
  kind: "app";
  slug: string;
  name: string;
  /** One-line summary used on cards */
  kicker: string;
  /** Longer description for the case study */
  about: string;
  category: string;
  platforms: string;
  stack: string;
  liveUrl: string;
  liveLabel: string;
  featured: boolean;
  /** Colour sampled from the hero collage, used behind images while they load */
  accent: string;
  hero: StaticImageData;
  /** Second collage (or the dark-theme collage) */
  heroAlt: StaticImageData;
  heroAltLabel: string;
  highlights: { title: string; text: string }[];
  /** The app walked through in the order a user meets it */
  flows: { title: string; screens: AppScreen[] }[];
  hasDarkMode: boolean;
};

export const appProjects: AppProject[] = [
  {
    kind: "app",
    slug: "event-intelligence-india",
    name: "Event Intelligence India",
    kicker: "Find the conferences and expos worth attending across India, then plan every visit in one app.",
    about:
      "An internal tool for a small team that travels to professional events. It gathers conferences, expos and summits from across India, scores each one against the team's interests, and carries them from discovery to the day itself, with directions, an agenda and a checklist.",
    category: "Productivity · Events",
    platforms: "iOS, Android and web (installable PWA)",
    stack: "Expo, React Native Web, Node/Express, PostgreSQL",
    liveUrl: "https://event-intelligence-india.expo.app",
    liveLabel: "event-intelligence-india.expo.app",
    featured: true,
    accent: "#1a2f7a",
    hero: eiHeroLight,
    heroAlt: eiHeroDark,
    heroAltLabel: "Dark theme",
    hasDarkMode: true,
    highlights: [
      { title: "Search in plain English", text: "Type “SAP events in Delhi next month” and the app turns it into topic, city and date filters." },
      { title: "Relevance you can read", text: "Every event is rated against your interests, with a “Why it matches you” explanation." },
      { title: "A map of India", text: "Events cluster by city so you can see where the action is at a glance." },
      { title: "Track and plan", text: "Save, follow, plan and mark visits, then see everything on a calendar." },
      { title: "Event Day mode", text: "The next session, directions, a checklist, notes and the agenda on one screen." },
      { title: "Light and dark", text: "Every screen is designed for both themes and follows the phone's setting." },
    ],
    flows: [
      {
        title: "Getting started",
        screens: [
          { title: "Sign in", caption: "A calm, focused sign-in.", image: eiL00a, dark: eiD00a },
          { title: "Welcome", caption: "Discover events across India.", image: eiL00b, dark: eiD00b },
          { title: "Your interests", caption: "Pick technologies and topics to personalise results.", image: eiL00c, dark: eiD00c },
        ],
      },
      {
        title: "Discover",
        screens: [
          { title: "Home", caption: "Coming up next, with search always at hand.", image: eiL01, dark: eiD01 },
          { title: "For you", caption: "Personal picks, this week and newly discovered events.", image: eiL02, dark: eiD02 },
          { title: "Explore", caption: "Filters and relevance badges on every event.", image: eiL03, dark: eiD03 },
          { title: "Natural search", caption: "A plain-English query becomes filter chips.", image: eiL04, dark: eiD04 },
          { title: "Map", caption: "Clustered event counts across India.", image: eiL04b, dark: eiD04b },
        ],
      },
      {
        title: "Plan and attend",
        screens: [
          { title: "Event detail", caption: "Register, website, directions and share up front.", image: eiL05, dark: eiD05 },
          { title: "Why it matches", caption: "Tracking status and the reasons it fits you.", image: eiL05b, dark: eiD05b },
          { title: "My events", caption: "Saved, following, planned, visited and past.", image: eiL06, dark: eiD06 },
          { title: "Calendar", caption: "The month at a glance with the day's events below.", image: eiL07, dark: eiD07 },
          { title: "Event Day", caption: "Next session, checklist, notes and agenda.", image: eiL08, dark: eiD08 },
          { title: "More", caption: "Profile, settings and admin tools.", image: eiL09, dark: eiD09 },
        ],
      },
    ],
  },
  {
    kind: "app",
    slug: "maharishi-ayurveda",
    name: "Maharishi Ayurveda",
    kicker: "An Ayurvedic wellness store with a personal profile, daily rituals and doctor consultations built in.",
    about:
      "A shopping app that starts with the customer rather than the catalogue. It learns their goals and Ayurvedic constitution, suggests a daily routine, and recommends products for how they want to feel, with order tracking and paid consultations with an Ayurvedic doctor in the same place.",
    category: "E-commerce · Health & wellness",
    platforms: "iOS, Android and web",
    stack: "Expo, React Native",
    liveUrl: "https://maharishi-ayurveda.expo.app",
    liveLabel: "maharishi-ayurveda.expo.app",
    featured: true,
    accent: "#4a3322",
    hero: maHero,
    heroAlt: maHero2,
    heroAltLabel: "More screens",
    hasDarkMode: false,
    highlights: [
      { title: "A wellness profile", text: "Goals and Ayurvedic constitution (Dosha) shape everything the app suggests." },
      { title: "Daily rituals", text: "A morning, midday and evening routine with a simple progress tracker." },
      { title: "Shop by how you feel", text: "Browse by wellness need, benefit or ingredient, not just product type." },
      { title: "Search that teaches", text: "Ingredient guides and articles appear alongside the products." },
      { title: "Order tracking", text: "A clear timeline from order placed to delivered, with courier details." },
      { title: "Consult a Vaidya", text: "Book a video or phone consultation with an Ayurvedic doctor." },
    ],
    flows: [
      {
        title: "Welcome",
        screens: [
          { title: "Onboarding", caption: "Ayurveda for modern life.", image: ma01 },
          { title: "Onboarding", caption: "Wellness that starts with you.", image: ma02 },
          { title: "Onboarding", caption: "Learn, choose, consult.", image: ma03 },
          { title: "Your goals", caption: "“What brings you here today?”", image: ma04 },
          { title: "Sign in", caption: "Mobile number sign-in.", image: ma05 },
          { title: "Verify", caption: "One-time passcode verification.", image: ma06 },
        ],
      },
      {
        title: "Everyday wellness",
        screens: [
          { title: "Home", caption: "A greeting, the active order and wellness needs.", image: ma07 },
          { title: "Profile and ritual", caption: "Constitution and today's ritual tracker.", image: ma08 },
          { title: "My Wellness", caption: "Goals, constitution and today's routine.", image: ma16 },
          { title: "Routine", caption: "Daily checklist and recommendations.", image: ma17 },
        ],
      },
      {
        title: "Shop",
        screens: [
          { title: "Recommended", caption: "Bestsellers and offers by wellness need.", image: ma09 },
          { title: "Explore", caption: "Browse by wellness need.", image: ma11 },
          { title: "Explore more", caption: "Benefits and ingredients.", image: ma12 },
          { title: "Search", caption: "An ingredient guide, articles and products.", image: ma19 },
          { title: "Product", caption: "Pack choice, price and ratings.", image: ma13 },
          { title: "Product details", caption: "How to use, reviews and add to cart.", image: ma14 },
          { title: "Track order", caption: "Timeline, courier and items.", image: ma10 },
        ],
      },
      {
        title: "Care and account",
        screens: [
          { title: "Consult", caption: "Book a session with an Ayurvedic Vaidya.", image: ma15 },
          { title: "Account", caption: "Orders, wishlist, consultations and preferences.", image: ma18 },
        ],
      },
    ],
  },
  {
    kind: "app",
    slug: "toys-cartel",
    name: "Toys Cartel",
    kicker: "A bright, quick toy store for Indian families: shop by age, catch the deals, check out in a few taps.",
    about:
      "A kids' toy shop designed for busy parents. Toys are organised by age and category, offers apply themselves in the cart, and every product page answers the real questions up front: price, delivery to your pincode, age range and what other parents thought.",
    category: "E-commerce · Toys",
    platforms: "iOS, Android and web",
    stack: "Expo, React Native",
    liveUrl: "https://toyscartel.expo.app",
    liveLabel: "toyscartel.expo.app",
    featured: true,
    accent: "#173a7a",
    hero: tcHero,
    heroAlt: tcHero2,
    heroAltLabel: "More screens",
    hasDarkMode: false,
    highlights: [
      { title: "Shop by age", text: "From 0–6 months upward, so parents see only what fits their child." },
      { title: "Deals that apply themselves", text: "Offers are added automatically, with a progress bar to the next saving." },
      { title: "Fast search", text: "Recent and trending searches, then sort and filter the results." },
      { title: "Product pages that answer questions", text: "Gallery, offers, delivery check by pincode, highlights and reviews." },
      { title: "Wishlist and save for later", text: "Keep ideas for birthdays, with suggestions alongside." },
      { title: "No sign-up wall", text: "Browse, wishlist and fill the cart as a guest; sign in with a mobile number when ready." },
    ],
    flows: [
      {
        title: "Welcome and home",
        screens: [
          { title: "Onboarding", caption: "Toys picked for every age.", image: tc01 },
          { title: "Onboarding", caption: "Real deals, no coupon hunting.", image: tc02 },
          { title: "Home", caption: "Deals, shop by age, categories and bestsellers.", image: tc04 },
          { title: "Bestsellers", caption: "Bestsellers and new arrivals.", image: tc05 },
          { title: "More to explore", caption: "Trending picks and trust badges.", image: tc06 },
        ],
      },
      {
        title: "Find the right toy",
        screens: [
          { title: "Search", caption: "Recent and trending searches.", image: tc07 },
          { title: "Results", caption: "“Dinosaur” with sort and filter.", image: tc08 },
          { title: "Browse", caption: "Age chips and category tiles.", image: tc09 },
          { title: "Category", caption: "Remote control toys.", image: tc10 },
        ],
      },
      {
        title: "Buy",
        screens: [
          { title: "Product", caption: "Gallery, price, offers and age range.", image: tc11 },
          { title: "Product details", caption: "Delivery check, highlights and reviews.", image: tc12 },
          { title: "Wishlist", caption: "Saved toys and “You might also like”.", image: tc13 },
          { title: "Cart", caption: "Offer progress and a clear price breakdown.", image: tc14 },
          { title: "Account", caption: "Orders, addresses and settings, even as a guest.", image: tc15 },
        ],
      },
    ],
  },
];

export function screenCount(p: AppProject) {
  return p.flows.reduce((n, f) => n + f.screens.length, 0);
}
