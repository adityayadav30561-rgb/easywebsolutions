/**
 * Licensed photography (see docs/IMAGE-SOURCES.md for source and licence of each file).
 * All photos are colour images of web design and development work, from Unsplash (Unsplash License).
 * Static imports give Next.js intrinsic sizes and blur placeholders.
 */
import type { StaticImageData } from "next/image";

import heroDesignStudio from "@/assets/images/hero-design-studio.jpg";
import introLaptopDesk from "@/assets/images/intro-laptop-desk.jpg";
import serviceDesignDev from "@/assets/images/service-design-dev.jpg";
import serviceCare from "@/assets/images/service-care.jpg";
import serviceOptimization from "@/assets/images/service-optimization.jpg";
import processDiscover from "@/assets/images/process-discover.jpg";
import processDesign from "@/assets/images/process-design.jpg";
import processBuild from "@/assets/images/process-build.jpg";
import processLaunch from "@/assets/images/process-launch.jpg";
import processCare from "@/assets/images/process-care.jpg";
import whyTeam from "@/assets/images/why-team.jpg";
import aboutCollaboration from "@/assets/images/about-collaboration.jpg";
import aboutWorkspace from "@/assets/images/about-workspace.jpg";
import ctaWorkspace from "@/assets/images/cta-workspace.jpg";
import careMonitoring from "@/assets/images/care-monitoring.jpg";
import careSupport from "@/assets/images/care-support.jpg";
import websitesDesk from "@/assets/images/websites-desk.jpg";
import contactConversation from "@/assets/images/contact-conversation.jpg";
import workTech from "@/assets/images/work-tech.jpg";
import workProfessional from "@/assets/images/work-professional.jpg";
import workStore from "@/assets/images/work-store.jpg";
import workVenue from "@/assets/images/work-venue.jpg";
import workLocalBusiness from "@/assets/images/work-local-business.jpg";
import workCommunity from "@/assets/images/work-community.jpg";

export type Photo = { src: StaticImageData; alt: string; credit: string; url: string };

export const photos = {
  heroDesignStudio: { src: heroDesignStudio, alt: "Designer's desk with a monitor, tablet and phone showing website designs", credit: "Daniel Korpai", url: "https://unsplash.com/photos/pKRNxEguRgM" },
  introLaptopDesk: { src: introLaptopDesk, alt: "Laptop and desktop screen showing a website on a bright desk", credit: "Domenico Loia", url: "https://unsplash.com/photos/hGV2TfOh0ns" },
  serviceDesignDev: { src: serviceDesignDev, alt: "Monitor displaying a website design system", credit: "Balázs Kétyi", url: "https://unsplash.com/photos/_x335IZXxfc" },
  serviceCare: { src: serviceCare, alt: "Laptop showing colourful code in an editor", credit: "Mohammad Rahmani", url: "https://unsplash.com/photos/8qEB0fTe9Vw" },
  serviceOptimization: { src: serviceOptimization, alt: "Website performance analytics graphs on a screen", credit: "Luke Chesser", url: "https://unsplash.com/photos/JKUTrJ4vK00" },
  processDiscover: { src: processDiscover, alt: "Wall of colourful sticky notes from a planning session", credit: "Hugo Rocha", url: "https://unsplash.com/photos/qFpnvZ_j9HU" },
  processDesign: { src: processDesign, alt: "Watercolour wireframe sketches of website layouts", credit: "Hal Gatewood", url: "https://unsplash.com/photos/tZc3vjPCk-Q" },
  processBuild: { src: processBuild, alt: "Laptop with website code on a developer's desk", credit: "Christopher Gower", url: "https://unsplash.com/photos/m_HRfLhgABo" },
  processLaunch: { src: processLaunch, alt: "Hand holding a smartphone showing a live website", credit: "David Liceaga", url: "https://unsplash.com/photos/NqNDfVTohvM" },
  processCare: { src: processCare, alt: "Dashboard of website metrics on a laptop", credit: "Stephen Dawson", url: "https://unsplash.com/photos/qwtCeJ5cLYs" },
  whyTeam: { src: whyTeam, alt: "Three people laughing while working on laptops together", credit: "Brooke Cagle", url: "https://unsplash.com/photos/g1Kr4Ozfoac" },
  aboutCollaboration: { src: aboutCollaboration, alt: "Team reviewing a design on a laptop around a table", credit: "Jud Mackrill", url: "https://unsplash.com/photos/Of_m3hMsoAA" },
  aboutWorkspace: { src: aboutWorkspace, alt: "Developer typing code on a laptop beside a plant", credit: "Nubelson Fernandes", url: "https://unsplash.com/photos/UcYBL5V0xWQ" },
  ctaWorkspace: { src: ctaWorkspace, alt: "Web designer working on a website across two screens", credit: "Campaign Creators", url: "https://unsplash.com/photos/iEiUITs149M" },
  careMonitoring: { src: careMonitoring, alt: "Laptop showing website analytics and statistics", credit: "Lukas Blazek", url: "https://unsplash.com/photos/mcSDtbWXUZU" },
  careSupport: { src: careSupport, alt: "Two people discussing a website on a laptop", credit: "KOBU Agency", url: "https://unsplash.com/photos/7okkFhxrxNw" },
  websitesDesk: { src: websitesDesk, alt: "Laptop showing an online store website on a desk", credit: "Igor Miske", url: "https://unsplash.com/photos/Px3iBXV-4TU" },
  contactConversation: { src: contactConversation, alt: "Two people pointing at a laptop while planning a website", credit: "Mimi Thian", url: "https://unsplash.com/photos/ZKBzlifgkgw" },
  workTech: { src: workTech, alt: "Two developers working on code at monitors", credit: "Compagnons", url: "https://unsplash.com/photos/Im_cQ6hQo10" },
  workProfessional: { src: workProfessional, alt: "Professional working on a business website at her desk", credit: "Campaign Creators", url: "https://unsplash.com/photos/ARW7Ic7MSAM" },
  workStore: { src: workStore, alt: "Smartphone showing a shop's mobile website", credit: "Sarah Dorweiler", url: "https://unsplash.com/photos/eNE1rUBItAk" },
  workVenue: { src: workVenue, alt: "Hand holding a phone showing a mobile site, laptop behind", credit: "Daniel Korpai", url: "https://unsplash.com/photos/mxPiMiz7KCo" },
  workLocalBusiness: { src: workLocalBusiness, alt: "Designer using a drawing tablet with colour swatches and a laptop", credit: "Theme Photos", url: "https://unsplash.com/photos/CGpifH3FjOA" },
  workCommunity: { src: workCommunity, alt: "Designer sketching website wireframes at a desk", credit: "UX Indonesia", url: "https://unsplash.com/photos/pqzRfBhd9r0" },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
