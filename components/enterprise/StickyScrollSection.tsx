"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image";

// ── feature definitions ─────────────────────────────────────────────────────
const features: {
  id: string;
  label: string;
  description: string;
  content: React.ReactNode;
  fullBleedTop?: boolean;
}[] = [
  {
    id: "data-collection",
    label: "Data Collection",
    description:
      "Columbus enables anyone to be super-explorers. Let us help you find answers faster.",
    fullBleedTop: true,
    content: (
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[694px]">
        <span className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-[11px] font-bold text-white" aria-hidden>g1.1</span>
        <Image
          src="/enterprise/sunbg.png"
          alt="background"
          fill
          className="object-cover blur-[6px] scale-110"
        />
        <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]" />
        <Image
          src="/enterprise/desk.png"
          alt="desktop"
          width={849}
          height={476}
          className="absolute left-[8%] bottom-[8%] rounded-xl shadow-2xl"
        />
        <Image
          src="/enterprise/mob.png"
          alt="mobile"
          width={266}
          height={579}
          className="absolute right-[8%] bottom-[8%] shadow-2xl"
        />
      </div>
    ),
  },
  {
    id: "data",
    label: "Proprietary Data",
    description:
      "The most expansive geospatial data catalogue available — vetted, high-fidelity datasets that no one else has.",
    content: (
      <div>
        <div className="mb-10">
          <h2 className="text-[32px] md:text-[40px] font-light text-white leading-[1.1] tracking-[-0.03em] opacity-[0.62]">
            Can&apos;t find relevant datasets for your research?
          </h2>
          <h3 className="text-[32px] md:text-[40px] font-medium text-white leading-[1.1] tracking-[-0.03em]">
            Columbus has it.
          </h3>
        </div>

        <div
          className="w-full rounded-[10px] border border-white/8 overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: "16 / 9", background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)" }}
        >
          <span className="text-white/20 text-[14px] font-medium tracking-[0.06em] uppercase">Video Demo</span>
        </div>

        <div className="max-w-[900px] mt-10 mb-10">
          <p className="text-[24px] md:text-[28px] leading-[1.55] tracking-[-0.01em] text-white">
            The <span className="font-semibold">highest quality</span>, and most versatile
            data-sets for your critical research and decisions.
          </p>
          <a className="text-[14px] text-white/70 mt-4 inline-flex items-center gap-2">
            Learn about our Data Collection →
          </a>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[10px] p-10">
          <h3 className="text-center text-[24px] font-medium tracking-[-0.02em] text-white mb-2">
            Vetted, high-fidelity, and smart datasets
          </h3>
          <p className="text-center text-white/40 text-[14px] mb-8">
            We vet our data with partner organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            <Image src="/enterprise/logo1.png" width={70} height={40} alt="" />
            <Image src="/enterprise/logo2.png" width={90} height={40} alt="" />
            <Image src="/enterprise/logo3.png" width={90} height={40} alt="" />
            <Image src="/enterprise/logo4.png" width={90} height={40} alt="" />
            <Image src="/enterprise/logo5.png" width={90} height={40} alt="" />
            <Image src="/enterprise/logo6.png" width={70} height={40} alt="" />
            <Image src="/enterprise/logo7.png" width={90} height={40} alt="" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "map-chat",
    label: "Map Chat",
    description:
      "Query any location on Earth in natural language. Ask questions, get maps and spatial answers instantly.",
    content: (
      <div>
        <h2 className="text-[36px] md:text-[48px] font-medium text-white leading-[1.1] tracking-[-0.03em]">
          Chat with Earth
        </h2>
        <p className="mt-4 text-[18px] md:text-[22px] text-white/50 leading-[1.5] tracking-[-0.01em] max-w-[600px]">
          Query any location in natural language. Ask questions, get maps and spatial answers instantly.
        </p>
        <div
          className="mt-10 w-full rounded-[10px] border border-white/8 overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: "16 / 9", background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)" }}
        >
          <span className="text-white/20 text-[14px] font-medium tracking-[0.06em] uppercase">Video Demo</span>
        </div>
      </div>
    ),
  },
  {
    id: "research-reports",
    label: "Research Reports",
    description:
      "Generate full site-selection and due diligence reports from a single prompt. What took weeks now takes minutes.",
    content: (
      <div>
        <h2 className="text-[36px] md:text-[48px] font-medium text-white leading-[1.1] tracking-[-0.03em]">
          Research Reports
        </h2>
        <p className="mt-4 text-[18px] md:text-[22px] text-white/50 leading-[1.5] tracking-[-0.01em] max-w-[600px]">
          Generate full site-selection and due diligence reports from a single prompt.
        </p>
        <div
          className="mt-10 w-full rounded-[10px] border border-white/8 overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: "16 / 9", background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)" }}
        >
          <span className="text-white/20 text-[14px] font-medium tracking-[0.06em] uppercase">Video Demo</span>
        </div>
      </div>
    ),
  },
  {
    id: "generated-layers",
    label: "Generative Geodata",
    description:
      "AI-generated geospatial datasets that fill gaps where traditional surveying is too expensive or unavailable.",
    content: (
      <div>
        <h2 className="text-[36px] md:text-[48px] font-medium text-white leading-[1.1] tracking-[-0.03em]">
          Generative Geodata
        </h2>
        <p className="mt-4 text-[18px] md:text-[22px] text-white/50 leading-[1.5] tracking-[-0.01em] max-w-[600px]">
          AI-generated datasets that fill gaps where traditional surveying is too expensive or unavailable.
        </p>
        <div
          className="mt-10 w-full rounded-[10px] border border-white/8 overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: "16 / 9", background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)" }}
        >
          <span className="text-white/20 text-[14px] font-medium tracking-[0.06em] uppercase">Video Demo</span>
        </div>
      </div>
    ),
  },
  {
    id: "human-support",
    label: "24/7 Human Support",
    description:
      "Real humans available around the clock — find datasets, get platform tips, or connect with a live agent instantly.",
    content: (
      <div>
        <h2 className="text-[36px] md:text-[48px] font-medium text-white leading-[1.1] tracking-[-0.03em]">
          24/7 Human Support
        </h2>
        <p className="mt-4 text-[18px] md:text-[22px] text-white/50 leading-[1.5] tracking-[-0.01em] max-w-[600px]">
          Real humans available around the clock — find datasets, get platform tips, or connect with a live agent.
        </p>
        <div
          className="mt-10 w-full rounded-[10px] border border-white/8 overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: "16 / 9", background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)" }}
        >
          <span className="text-white/20 text-[14px] font-medium tracking-[0.06em] uppercase">Video Demo</span>
        </div>
      </div>
    ),
  },
];

const LINE = "linear-gradient(to bottom, transparent 0px, rgba(120,120,200,0.35) 72px, rgba(120,120,200,0.35) calc(100% - 72px), transparent 100%)";

// ── component ───────────────────────────────────────────────────────────────
export default function StickyScrollSection() {
  const [, ...rest] = features;

  return (
    <div className="relative w-full" style={{ "--grid-line": "rgba(255,255,255,0.10)", backgroundColor: "#060810", backgroundImage: "linear-gradient(rgba(255,255,255,0.04), rgba(255,255,255,0.04))" } as React.CSSProperties}>

      {/* Noise grain texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1, opacity: 0.40, mixBlendMode: "multiply" }}>
        <filter id="sectionGNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#sectionGNoise)" />
      </svg>

      {/* G2–G6 — inside constraint wrapper */}
      <div
        className="relative z-10 w-full max-w-[1287px] mx-auto"
        style={{
          borderLeft: "1px solid var(--grid-line)",
          borderRight: "1px solid var(--grid-line)",
        }}
      >
        {rest.map((feature, i) => (
          <div
            key={feature.id}
            className="relative grid grid-cols-1 lg:grid-cols-[355px_1fr]"
          >
            <span className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-sm font-bold text-white" aria-hidden>
              g{i + 2}
            </span>

            {/* Left column */}
            <div className="bg-transparent">
              <div className="sticky top-20 px-8 py-[94px]">
                <div className="max-w-[270px]">
                  <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/30 mb-3">{feature.label}</p>
                  <p className="text-[22px] font-normal leading-[1.6] tracking-[-0.01em] text-white/50">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Center */}
            {feature.fullBleedTop ? (
              <div className="bg-transparent rounded-[14px] overflow-hidden">
                {feature.content}
              </div>
            ) : (
              <div className="bg-transparent py-[74px] px-6 lg:px-12 flex justify-center">
                <div className="w-full">{feature.content}</div>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Bottom horizontal line */}
      <div className="w-full" style={{ height: 1, backgroundColor: "var(--grid-line)" }} />
    </div>
  );
}
