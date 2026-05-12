import "./mistx.css";
import { rubik } from "@/app/fonts";

import { MistxNav } from "@/components/enterprise-mistx/MistxNav";
import { EnterpriseHero } from "@/components/enterprise-mistx/EnterpriseHero";
import { EnterprisePrompts } from "@/components/enterprise-mistx/EnterprisePrompts";
import { DesignPartnersStrip } from "@/components/enterprise-mistx/DesignPartnersStrip";
import { WatchItWork } from "@/components/enterprise-mistx/WatchItWork";
import { EnterpriseSolutions } from "@/components/enterprise-mistx/EnterpriseSolutions";
import { AITrustBand } from "@/components/enterprise-mistx/AITrustBand";
import { ReassuranceForIncumbents } from "@/components/enterprise-mistx/ReassuranceForIncumbents";
import { EnterpriseFinalCTA } from "@/components/enterprise-mistx/EnterpriseFinalCTA";
import { MistxFooter } from "@/components/enterprise-mistx/MistxFooter";
import { RevealOnScroll } from "@/components/enterprise-mistx/RevealOnScroll";

export const metadata = {
  title: "Columbus Pro — Agentic GIS",
  description:
    "An agentic GIS that replaces three weeks of analysis with a single prompt. Conversational map chat, the most accurate geospatial data catalogue, and automated due-diligence reports.",
};

// The /products/enterprise route is the project's only MistX-themed page.
// It overrides the global Material Design 3 system via the .theme-mistx
// scope (see ./mistx.css), so no `--md-sys-*` token is consumed inside this
// page. Section order preserves the original ColumbusPage narrative,
// restyled in MistX's visual language:
//
//   1. Hero               — "An Agentic GIS platform"
//   2. Pain points        — "Legacy GIS slows you down because…"
//   3. Solution banner    — "Its time for a more powerful and intuitive GIS"
//   4. Difference         — Columbus vs Basic AI side-by-side
//   5. Feature deep-dive  — sticky-scroll over 6 product capabilities
//   6. Prompt showcase    — "See prompts you can ask"
//   7. Product banner     — "Columbus Pro — GIS made effortless"
//   8. Final CTA          — "Chat with us now about Columbus Pro"
//
// (Export names of the underlying components are MistX-style — kept stable
// because they are wired to the section visual patterns. Content inside is
// the original ColumbusPage copy.)
export default function EnterprisePage() {
  return (
    <main className={`theme-mistx ${rubik.variable}`}>
      <MistxNav />
      <RevealOnScroll />

      <EnterpriseHero />

      <div id="columbus-showcase">
        <EnterprisePrompts />
      </div>

      <DesignPartnersStrip />
      <WatchItWork />
      <EnterpriseSolutions />
      <AITrustBand />
      <ReassuranceForIncumbents />
      <EnterpriseFinalCTA />

      <MistxFooter />
    </main>
  );
}
