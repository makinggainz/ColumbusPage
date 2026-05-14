import { MistxNav } from "@/components/layout/MistxNav";
import { HeroV2 } from "@/components/home/heroV2/HeroV2";
import { ProductCardV2 } from "@/components/home/heroV2/ProductCardV2";
import { HiringCardV2 } from "@/components/home/heroV2/HiringCardV2";
import { Footer } from "@/components/layout/Footer";

/**
 * V2 homepage — entity-card stack. Each section is a near-full-viewport
 * rounded card with a hairline border. The cards represent, top to bottom:
 *
 *   1. Company        — HeroV2 (MistX-style boat / grid bg + headline + CTAs)
 *   2. Columbus       — Enterprise GIS product card
 *   3. Elio           — Consumer-maps product card
 *   4. Research       — Geospatial research card (dark tone)
 *   5. Hiring         — Open roles card
 *   6. Footer         — wrapped in the same .cardv2 chrome
 *
 * The existing components (OurProductsSection, ColumbusFeatureCell, the
 * Elio super-section, StickyScrollFeatures, Careers, etc.) are still on
 * disk on this branch but no longer rendered; this page is a clean-slate
 * V2 layout.
 */
export default function Home() {
  return (
    <main
      className="min-h-screen pb-12"
      style={{ backgroundColor: "#FDFCFC" }}
    >
      <MistxNav />

      <HeroV2 />

      <ProductCardV2
        name="Columbus"
        logo="/logobueno.png"
        tagline="The agentic GIS platform for professionals."
        description="Query, generate, and reason over any location on Earth in plain English. Columbus turns raw geographic complexity into clear, grounded answers — buildings, terrain, traffic, climate, and more."
        primaryCta={{ label: "Try Columbus", href: "/products/enterprise" }}
        secondaryCta={{ label: "View capabilities", href: "/products/enterprise" }}
        image="/ColumbusProductImg.png"
      />

      <ProductCardV2
        name="Elio"
        logo="/MapsGPT-logo.png"
        tagline="Smart, social maps for every spot on your list."
        description="Find your next anything — ranked by vibe, crowd, value, and time of day. Elio makes maps feel alive again, with conversational chat, shared plans, and surprise picks for when you don't know what you want."
        primaryCta={{ label: "Try Elio", href: "/elio" }}
        secondaryCta={{ label: "Download apps", href: "/elio" }}
        image="/MapsGPTDesktop.png"
      />

      <ProductCardV2
        name="Research"
        logo="/TechnologyPageImages/lgm-globe-icon.png"
        tagline="Our journey to the Large Geospatial Model."
        description="Open research on geospatial foundation models, point clouds, and terrain reasoning. Read papers, follow the model line, and explore the foundations we're laying for spatially aware AI."
        primaryCta={{ label: "Read research", href: "/research" }}
        secondaryCta={{ label: "View models", href: "/research" }}
        image="/Researchimg.png"
        tone="dark"
      />

      <HiringCardV2 />

      <section className="cardv2" aria-label="Site footer">
        <Footer />
      </section>
    </main>
  );
}
