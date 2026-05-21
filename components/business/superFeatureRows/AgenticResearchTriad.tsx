"use client";

/* Row under the "Agentic Research" hero — three sub-feature cards laid
   out horizontally. Each card carries an IconChip superscript, a clean
   per-feature graphic (no UI mockup, no photo), a heading, and a
   description.

   Design-system rules in play (business-tokens.css):
   • 7px card corner (--ent-radius-card) — strict homepage parity.
   • Hairline border (--ent-border-card #E7E7F1) instead of drop shadow.
   • Heading via <h4> so it inherits Funnel Display from .ent-scope.
   • Body copy in --ent-text-secondary (#5A6B7B).
   • Spacing on the 4px grid via --ent-space-* tokens. */

type TriadItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
  graphic: React.ReactNode;
};

/* Icon chip — mirrors the IconChip used on the parent SuperFeatureSection
   header so all icon glyphs across the page share the same chip chrome
   (36×36, ent-text-primary stroke, 1.8px weight). Defined locally so the
   triad doesn't need to import from the page module. */
function IconChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center"
      style={{
        width: 36,
        height: 36,
        borderRadius: "var(--ent-radius-full)",
        background: "rgba(11,27,43,0.06)",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--ent-text-primary)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  );
}

/* Square graphic plate — transparent so the SVG sits directly on the
   parent card. Padding kept so the graphic doesn't crowd the card's
   edge. */
function GraphicPlate({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "5 / 3",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--ent-space-5)",
      }}
      aria-hidden
    >
      {children}
    </div>
  );
}

/* 1 ▸ Reports — two stacked document tiles with content lines and a small
   accent badge. Reads as "the deliverable you'll receive". */
function ReportsGraphic() {
  return (
    <svg
      viewBox="0 0 120 80"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      {/* Back page — offset, faded */}
      <rect
        x="44"
        y="14"
        width="42"
        height="54"
        rx="3"
        fill="#FFFFFF"
        stroke="var(--ent-border-card)"
        strokeWidth="1"
      />
      <line x1="50" y1="24" x2="78" y2="24" stroke="var(--ent-border-card)" strokeWidth="1.2" />
      <line x1="50" y1="30" x2="74" y2="30" stroke="var(--ent-border-card)" strokeWidth="1.2" />

      {/* Front page — primary tile */}
      <rect
        x="34"
        y="20"
        width="42"
        height="54"
        rx="3"
        fill="#FFFFFF"
        stroke="var(--ent-text-primary)"
        strokeWidth="1.6"
      />
      {/* Title line — bolder */}
      <rect x="40" y="28" width="22" height="3" rx="1.5" fill="var(--ent-text-primary)" />
      {/* Body lines */}
      <line x1="40" y1="38" x2="70" y2="38" stroke="var(--ent-text-secondary)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="40" y1="44" x2="66" y2="44" stroke="var(--ent-text-secondary)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="40" y1="50" x2="70" y2="50" stroke="var(--ent-text-secondary)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="40" y1="56" x2="62" y2="56" stroke="var(--ent-text-secondary)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="40" y1="64" x2="56" y2="64" stroke="var(--ent-text-secondary)" strokeWidth="1.2" strokeLinecap="round" />

      {/* Accent badge — "review-ready" stamp */}
      <circle cx="74" cy="22" r="6" fill="var(--ent-accent)" />
      <path
        d="m71 22 2 2 4-4"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* 2 ▸ Audits — a checklist with one item being scanned by a magnifying
   glass. Reads as "we're investigating each item on your behalf". */
function AuditsGraphic() {
  return (
    <svg
      viewBox="0 0 120 80"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      {/* Checklist tile */}
      <rect
        x="20"
        y="18"
        width="58"
        height="50"
        rx="3"
        fill="#FFFFFF"
        stroke="var(--ent-text-primary)"
        strokeWidth="1.6"
      />

      {/* Three checklist rows */}
      {[
        { y: 28 },
        { y: 40 },
        { y: 52 },
      ].map((row, i) => (
        <g key={row.y}>
          <rect
            x="26"
            y={row.y - 3}
            width="6"
            height="6"
            rx="1.4"
            fill={i < 2 ? "var(--ent-accent)" : "#FFFFFF"}
            stroke={i < 2 ? "var(--ent-accent)" : "var(--ent-border-card)"}
            strokeWidth="1.2"
          />
          {i < 2 ? (
            <path
              d={`m27.5 ${row.y} 1.5 1.5 3 -3`}
              stroke="#FFFFFF"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
          <line
            x1="38"
            y1={row.y}
            x2={i === 2 ? "58" : "70"}
            y2={row.y}
            stroke="var(--ent-text-secondary)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Magnifying glass — investigating the last (unchecked) row */}
      <circle
        cx="80"
        cy="50"
        r="12"
        fill="#FFFFFF"
        stroke="var(--ent-text-primary)"
        strokeWidth="1.8"
      />
      <line
        x1="89"
        y1="59"
        x2="98"
        y2="68"
        stroke="var(--ent-text-primary)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Tiny data point inside lens — three stacked rows of microcopy */}
      <line x1="74" y1="47" x2="86" y2="47" stroke="var(--ent-text-secondary)" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="74" y1="51" x2="84" y2="51" stroke="var(--ent-text-secondary)" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="74" y1="55" x2="82" y2="55" stroke="var(--ent-text-secondary)" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

/* 3 ▸ Compliance — a shield with a checkmark plus regulator "stamp"
   sparkles. Reads as "your site is verified against the rules". */
function ComplianceGraphic() {
  return (
    <svg
      viewBox="0 0 120 80"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      {/* Backdrop ring — gives the shield something to "sit inside" */}
      <circle
        cx="60"
        cy="42"
        r="28"
        fill="#FFFFFF"
        stroke="var(--ent-border-card)"
        strokeWidth="1"
      />

      {/* Shield */}
      <path
        d="M60 20 L78 26 L78 42 C78 54 70 62 60 66 C50 62 42 54 42 42 L42 26 Z"
        fill="#FFFFFF"
        stroke="var(--ent-text-primary)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Inner checkmark on accent disc */}
      <circle cx="60" cy="42" r="10" fill="var(--ent-accent)" />
      <path
        d="m55 42 4 4 7 -7"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stamp sparkles — small marks around the shield to evoke "approved" */}
      <g stroke="var(--ent-text-secondary)" strokeWidth="1.2" strokeLinecap="round">
        <line x1="28" y1="20" x2="32" y2="20" />
        <line x1="30" y1="18" x2="30" y2="22" />

        <line x1="92" y1="22" x2="96" y2="22" />
        <line x1="94" y1="20" x2="94" y2="24" />

        <line x1="22" y1="56" x2="26" y2="56" />
        <line x1="24" y1="54" x2="24" y2="58" />

        <line x1="94" y1="58" x2="98" y2="58" />
        <line x1="96" y1="56" x2="96" y2="60" />
      </g>
    </svg>
  );
}

const ITEMS: TriadItem[] = [
  {
    title: "Agentic Research Reports",
    description:
      "Hand Columbus your industry project and grab new sites or other industry-relevant findings, review-ready, while you focus on the rest.",
    icon: (
      <IconChip>
        {/* clipboard / report */}
        <rect x="8" y="3" width="8" height="4" rx="1" />
        <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </IconChip>
    ),
    graphic: <ReportsGraphic />,
  },
  {
    title: "Agentic Audits and due diligence",
    description:
      "Need to quickly audit sites or targets? Columbus can do your due diligence, offer a new perspective, and give new insights.",
    icon: (
      <IconChip>
        {/* magnifier with check — audit */}
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
        <path d="m8.5 11 2 2 3.5-3.5" />
      </IconChip>
    ),
    graphic: <AuditsGraphic />,
  },
  {
    title: "Audit Regulatory compliance",
    description:
      "Audits let you check whether your site complies with regulations — fast, transparent, and ready to share.",
    icon: (
      <IconChip>
        {/* shield with check — compliance */}
        <path d="M12 3 4 6v6c0 4.4 3.4 8.4 8 9 4.6-.6 8-4.6 8-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </IconChip>
    ),
    graphic: <ComplianceGraphic />,
  },
];

export default function AgenticResearchTriad() {
  return (
    /* Negative top margin pulls the triad up toward the hero above.
       SuperFeatureSection sets `mt-20 lg:mt-32` (80/128px) on every
       stacked sub-feature; this clamp eats roughly half of that on
       mobile and ~two-thirds on desktop so the triad reads as a tight
       continuation of the hero block rather than a separate section. */
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
      style={{ marginTop: "clamp(-80px, -6vw, -32px)" }}
    >
      {ITEMS.map((item) => (
        <TriadCard key={item.title} item={item} />
      ))}
    </div>
  );
}

function TriadCard({ item }: { item: TriadItem }) {
  return (
    /* Outer card: 24px corner to match the system's overall card radius
       (--ent-radius-2xl is the corner used by the surrounding super-
       section panels and the other on-page cards). No border or shadow —
       minimalist; the GraphicPlate's faint tint carries the structure. */
    <div
      style={{
        /* A touch darker than the surrounding super-section panel
           (#F7F7F7) so each triad card reads as a distinct tile against
           the panel without losing the neutral, quiet tone. */
        background: "#EDEDED",
        borderRadius: "var(--ent-radius-2xl)",
        padding: "var(--ent-space-6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "var(--ent-space-4)",
        height: "100%",
      }}
    >
      {/* Per-feature minimalist graphic — replaces the previous UI mockup. */}
      <GraphicPlate>{item.graphic}</GraphicPlate>

      <h4
        style={{
          margin: 0,
          color: "var(--ent-text-primary)",
          fontSize: "var(--ent-text-heading-m)",
          fontWeight: "var(--ent-weight-semibold)",
          letterSpacing: "var(--ent-tracking-heading)",
          lineHeight: "var(--ent-leading-display)",
        }}
      >
        {item.title}
      </h4>

      <p
        style={{
          margin: 0,
          color: "var(--ent-text-secondary)",
          fontSize: "var(--ent-text-body-s)",
          letterSpacing: "var(--ent-tracking-body)",
          lineHeight: "var(--ent-leading-body-l)",
          maxWidth: "32ch",
        }}
      >
        {item.description}
      </p>
    </div>
  );
}
