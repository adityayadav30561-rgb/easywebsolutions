/**
 * Licensed photography (see docs/IMAGE-SOURCES.md for source and licence of each file).
 * Static imports give Next.js intrinsic sizes and blur placeholders.
 */
import type { StaticImageData } from "next/image";

import heroModernistFacade from "@/assets/images/hero-modernist-facade.jpg";
import firstSaleSoloBuilding from "@/assets/images/first-sale-solo-building.jpg";
import serviceGridFacade from "@/assets/images/service-grid-facade.jpg";
import serviceLaptopNight from "@/assets/images/service-laptop-night.jpg";
import serviceGalaxySoho from "@/assets/images/service-galaxy-soho.jpg";
import processDiscoverConcrete from "@/assets/images/process-discover-concrete.jpg";
import processDesignLetterpress from "@/assets/images/process-design-letterpress.jpg";
import processBuildBrutalist from "@/assets/images/process-build-brutalist.jpg";
import processLaunchCity from "@/assets/images/process-launch-city.jpg";
import processCareUnderground from "@/assets/images/process-care-underground.jpg";
import whyConcreteBlocks from "@/assets/images/why-concrete-blocks.jpg";
import aboutStoneArtisan from "@/assets/images/about-stone-artisan.jpg";
import aboutWoodCarving from "@/assets/images/about-wood-carving.jpg";
import ctaBuildingsNight from "@/assets/images/cta-buildings-night.jpg";
import careNightStreet from "@/assets/images/care-night-street.jpg";
import careDeskDark from "@/assets/images/care-desk-dark.jpg";
import websitesCurvedMuseum from "@/assets/images/websites-curved-museum.jpg";
import contactReflection from "@/assets/images/contact-reflection.jpg";
import workTechTower from "@/assets/images/work-tech-tower.jpg";
import workProfessionalWindows from "@/assets/images/work-professional-windows.jpg";
import workStoreLamp from "@/assets/images/work-store-lamp.jpg";
import workVenueTram from "@/assets/images/work-venue-tram.jpg";
import workLocalCraft from "@/assets/images/work-local-craft.jpg";
import workCommunityStudio from "@/assets/images/work-community-studio.jpg";

export type Photo = { src: StaticImageData; alt: string; credit: string; url: string };

export const photos = {
  heroModernistFacade: { src: heroModernistFacade, alt: "Black and white photo of a modernist building", credit: "Maxence Ambert", url: "https://unsplash.com/photos/xUCYN4GPePI" },
  firstSaleSoloBuilding: { src: firstSaleSoloBuilding, alt: "Concrete tower against a pale sky (Solo-building series)", credit: "Pierre Châtel-Innocenti", url: "https://unsplash.com/photos/VO7HVshBK5Y" },
  serviceGridFacade: { src: serviceGridFacade, alt: "Grid facade looking up, Washington D.C.", credit: "Christophe Laurenceau", url: "https://unsplash.com/photos/MPWbGMrZ6eo" },
  serviceLaptopNight: { src: serviceLaptopNight, alt: "Laptop on a desk at night", credit: "Ankit Singh", url: "https://unsplash.com/photos/vw_y__9mKl8" },
  serviceGalaxySoho: { src: serviceGalaxySoho, alt: "Curved facade of Galaxy SOHO, Beijing", credit: "Sam Balye", url: "https://unsplash.com/photos/t0nojyPGbok" },
  processDiscoverConcrete: { src: processDiscoverConcrete, alt: "Heiligkreuzkirche concrete interior, Chur", credit: "Ricardo Gomez Angel", url: "https://unsplash.com/photos/9AjwOAIdsII" },
  processDesignLetterpress: { src: processDesignLetterpress, alt: "Letterpress type being arranged, Taichung", credit: "Raymond Yeung", url: "https://unsplash.com/photos/98ZZnRQKISM" },
  processBuildBrutalist: { src: processBuildBrutalist, alt: "Brutalist balconies, Mériadeck, Bordeaux", credit: "Alexander Psiuk", url: "https://unsplash.com/photos/4frZSdcZaE0" },
  processLaunchCity: { src: processLaunchCity, alt: "New York City at night from above", credit: "dominik hofbauer", url: "https://unsplash.com/photos/AaceTp_LRAM" },
  processCareUnderground: { src: processCareUnderground, alt: "Underground car park in dim light, Bergen", credit: "David Werbrouck", url: "https://unsplash.com/photos/VsejBFGkeyM" },
  whyConcreteBlocks: { src: whyConcreteBlocks, alt: "Brutalist concrete blocks, Salamanca", credit: "uve sanchez", url: "https://unsplash.com/photos/9DRX_cW48RQ" },
  aboutStoneArtisan: { src: aboutStoneArtisan, alt: "Artisan carving stone, Mount Qingcheng", credit: "Quan-You Zhang", url: "https://unsplash.com/photos/XChuTe9LR6s" },
  aboutWoodCarving: { src: aboutWoodCarving, alt: "Chisel carving wood, close-up", credit: "Dominik Scythe", url: "https://unsplash.com/photos/3cIvvzjE6Lk" },
  ctaBuildingsNight: { src: ctaBuildingsNight, alt: "Low angle view of two buildings at night", credit: "Viktor Talashuk", url: "https://unsplash.com/photos/53McvMr9sjo" },
  careNightStreet: { src: careNightStreet, alt: "Empty Toronto street at night", credit: "Patrick Tomasso", url: "https://unsplash.com/photos/D6Bk1A3-gMA" },
  careDeskDark: { src: careDeskDark, alt: "Dark minimal desk with monitor", credit: "Kevin Canlas", url: "https://unsplash.com/photos/EJPzqPYZgvI" },
  websitesCurvedMuseum: { src: websitesCurvedMuseum, alt: "Curved architecture, Canadian Museum of History", credit: "Zachary McSween Manickchand", url: "https://unsplash.com/photos/I-tis7ZFIVI" },
  contactReflection: { src: contactReflection, alt: "Brutalist building reflected in water", credit: "William Priess", url: "https://unsplash.com/photos/1jyHQxBAE7A" },
  workTechTower: { src: workTechTower, alt: "Tall building against dark sky, Tokyo", credit: "mos design", url: "https://unsplash.com/photos/CvocCBtUdfE" },
  workProfessionalWindows: { src: workProfessionalWindows, alt: "Repeating window pattern of a tall building", credit: "Michael Cochran", url: "https://unsplash.com/photos/jtkDOOIl2uE" },
  workStoreLamp: { src: workStoreLamp, alt: "Yellow desk lamp on a glass trestle table", credit: "Brecht Corbeel", url: "https://unsplash.com/photos/BPmgWWtwcuQ" },
  workVenueTram: { src: workVenueTram, alt: "Red tram at night, Queens Quay West, Toronto", credit: "Filip Mroz", url: "https://unsplash.com/photos/023T4jyCRqA" },
  workLocalCraft: { src: workLocalCraft, alt: "Grayscale photo of a person cutting a slab", credit: "Benjamin Thomas", url: "https://unsplash.com/photos/idEEZ-wQkfA" },
  workCommunityStudio: { src: workCommunityStudio, alt: "Hands working on a project at a table", credit: "gomi", url: "https://unsplash.com/photos/HPF5e282XCc" },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
