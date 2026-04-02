"use client";

import Image from "next/image";

// ── inline DatasetCard ──────────────────────────────────────────────────────
function DatasetCard({
  image,
  title,
  rows,
  desc,
}: {
  image: string;
  title: string;
  rows: string;
  desc: string;
}) {
  return (
    <div className="w-full rounded-[10px] border border-[#E6E6E6] bg-white overflow-hidden">
      <div className="relative w-full h-[200px]">
        <Image src={image} alt="" fill className="object-cover" />
      </div>
      <div className="p-4">
        <h4 className="text-[15px] font-medium text-[#111]">{title}</h4>
        <p className="text-[12px] text-[#6B7280] mt-1">{rows}</p>
        <p className="text-[13px] text-[#6B7280] mt-2 leading-[1.6]">{desc}</p>
      </div>
    </div>
  );
}

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
    label: "Data",
    description:
      "Through our proprietary innovations we have accrued the most expansive data collection available for geospatial research.",
    content: (
      <div>
        <div className="relative mb-10">
          <span className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-[11px] font-bold text-white" aria-hidden>g2.1</span>
          <h2 className="text-[32px] md:text-[40px] font-light text-[#111] leading-[1.1] tracking-[-0.03em] opacity-[0.62]">
            Can't find relevant datasets for your research?
          </h2>
          <h3 className="text-[32px] md:text-[40px] font-medium text-[#111] leading-[1.1] tracking-[-0.03em]">
            Columbus has it.
          </h3>
        </div>

        <div className="relative flex flex-wrap gap-6 text-[14px] text-[#6B7280] border-b border-[#E5E7EB] pb-3 mb-6">
          <span className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-[11px] font-bold text-white" aria-hidden>g2.2</span>
          <span>Suggested</span>
          <span>Base Maps</span>
          <span>Overlays</span>
          <span>Packs</span>
          <span>Environmental</span>
          <span>Infrastructure</span>
          <span className="text-[#111] border-b-2 border-[#111] pb-2">Smart Layers</span>
          <span>Demographic</span>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <span className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-[11px] font-bold text-white" aria-hidden>g2.3</span>
          <DatasetCard
            image="/enterprise/mp1.png"
            title="Future Appreciation Zones"
            rows="55,010 rows"
            desc="Predicts 2–5 year property value growth using migration, job forecasts, and permit trends."
          />
          <DatasetCard
            image="/enterprise/mp2.png"
            title="Future Turnover Hotspots"
            rows="40,206 rows"
            desc="Predicts high-flip areas from sales velocity, investor inflows, and economic cycles."
          />
          <DatasetCard
            image="/enterprise/mp3.png"
            title="Future Displacement Risk Overlay"
            rows="33,520 rows"
            desc="Flags areas at risk of resident displacement from rising costs and affordable housing changes."
          />
          <DatasetCard
            image="/enterprise/mp3.png"
            title="Future Displacement Risk Overlay"
            rows="33,520 rows"
            desc="Flags areas at risk of resident displacement from rising costs and affordable housing changes."
          />
        </div>

        <div className="relative max-w-[900px] mb-10">
          <span className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-[11px] font-bold text-white" aria-hidden>g2.4</span>
          <p className="text-[24px] md:text-[28px] leading-[1.55] tracking-[-0.01em] text-[#111]">
            The <span className="font-semibold">highest quality</span>, and most versatile
            data-sets for your critical research and decisions.
          </p>
          <a className="text-[14px] text-[#0A1344] mt-4 inline-flex items-center gap-2">
            Learn about our Data Collection →
          </a>
        </div>

        <div className="relative bg-white border border-[#E6E6E6] rounded-[10px] p-10">
          <span className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-[11px] font-bold text-white" aria-hidden>g2.5</span>
          <h3 className="text-center text-[24px] font-medium tracking-[-0.02em] mb-2">
            Vetted, high-fidelity, and smart datasets
          </h3>
          <p className="text-center text-[#6B7280] text-[14px] mb-8">
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
      "Work with your map through natural language inputs like if you're having a conversation. Our powerful technology allows you to do XYZ (WOWzers!)",
    content: (
      <div className="relative w-full bg-white rounded-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.08)] overflow-hidden">
        <span className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-[11px] font-bold text-white" aria-hidden>g3.1</span>
        <img src="/enterprise/mapchat.png" alt="Map Chat" className="w-full h-auto block" />
      </div>
    ),
  },
  {
    id: "research-reports",
    label: "Research Reports",
    description:
      "Work with your map through natural language inputs like if you're having a conversation. Our powerful technology allows you to do XYZ (WOWzers!)",
    content: (
      <div className="relative w-full h-[500px] bg-white rounded-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.08)] flex items-center justify-center">
        <span className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-[11px] font-bold text-white" aria-hidden>g4.1</span>
        <span className="text-[#9CA3AF] text-[14px]">Coming soon</span>
      </div>
    ),
  },
  {
    id: "generated-layers",
    label: "Generated Layers",
    description:
      "Work with your map through natural language inputs like if you're having a conversation. Our powerful technology allows you to do XYZ (WOWzers!)",
    content: (
      <div className="relative w-full h-[500px] bg-white rounded-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.08)] flex items-center justify-center">
        <span className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-[11px] font-bold text-white" aria-hidden>g5.1</span>
        <span className="text-[#9CA3AF] text-[14px]">Coming soon</span>
      </div>
    ),
  },
  {
    id: "human-support",
    label: "Human Customer Support",
    description:
      "Work with your map through natural language inputs like if you're having a conversation. Our powerful technology allows you to do XYZ (WOWzers!)",
    content: (
      <div className="relative w-full bg-white rounded-[10px] p-[64px] shadow-[0_30px_80px_rgba(0,0,0,0.08)] flex flex-col lg:flex-row items-center gap-[80px]">
        <span className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-[11px] font-bold text-white" aria-hidden>g6.1</span>
        <div className="max-w-[520px]">
          <h2 className="text-[28px] font-medium tracking-[-0.02em] mb-6">24/7 Help &amp; Columbus Bot</h2>
          <ul className="space-y-3 text-[18px] text-[#333]">
            <li>• Find relevant data sets,</li>
            <li>• Show you tips to use our platform,</li>
            <li>• Connect you to a live human agent.</li>
            <li>• A human agent is available 24/7</li>
          </ul>
        </div>
        <div className="relative w-[570px] h-[605px] rounded-[23px] overflow-hidden shadow-lg flex-shrink-0">
          <img
            src="/enterprise/humanbg.png"
            alt="Support Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/enterprise/bot.png" alt="Bot Chat" className="w-[454px] h-[499px]" />
          </div>
        </div>
      </div>
    ),
  },
];

const LINE = "linear-gradient(to bottom, transparent 0px, rgba(120,120,200,0.35) 72px, rgba(120,120,200,0.35) calc(100% - 72px), transparent 100%)";

// ── component ───────────────────────────────────────────────────────────────
export default function StickyScrollSection() {
  const [g1, ...rest] = features;

  return (
    <div className="w-full bg-[#F4F3EB]">
      {/* Gradient transition from white (section E) to #F4F3EB */}
      <div className="h-24 w-full" style={{ background: "linear-gradient(to bottom, #ffffff 0%, #F4F3EB 100%)" }} />

      {/* G1 — technology-page style: sidebar left of grid line, content fills the rest */}
      <div className="relative flex w-full">
        <span className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-sm font-bold text-white" aria-hidden>g1</span>

        {/* Left sidebar — outside the grid line */}
        <div className="hidden lg:block flex-shrink-0 w-[355px] bg-[#F4F3EB]">
          <div className="sticky top-20 px-8 py-[94px]">
            <div className="max-w-[270px]">
              <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#9CA3AF] mb-3">{g1.label}</p>
              <p className="text-[22px] font-normal leading-[1.6] tracking-[-0.01em] text-[#111] opacity-60">{g1.description}</p>
            </div>
          </div>
        </div>

        {/* Grid line */}
        <div className="hidden lg:block flex-shrink-0 w-px self-stretch" style={{ background: LINE }} />

        {/* Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {g1.content}
        </div>
      </div>

      {/* G2–G6 — inside constraint wrapper */}
      <div
        className="section-lines-light w-full max-w-[1287px] mx-auto"
        style={{
          backgroundImage: LINE,
          backgroundSize: "1px 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left top",
        }}
      >
        {rest.map((feature, i) => (
          <div
            key={feature.id}
            className="relative grid grid-cols-1 lg:grid-cols-[355px_1fr_99px]"
          >
            <span className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-sm font-bold text-white" aria-hidden>
              g{i + 2}
            </span>

            {/* Left column */}
            <div className="bg-[#F4F3EB]">
              <div className="sticky top-20 px-8 py-[94px]">
                <div className="max-w-[270px]">
                  <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#9CA3AF] mb-3">{feature.label}</p>
                  <p className="text-[22px] font-normal leading-[1.6] tracking-[-0.01em] text-[#111] opacity-60">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Center */}
            {feature.fullBleedTop ? (
              <div className="bg-white rounded-[14px] overflow-hidden">
                {feature.content}
              </div>
            ) : (
              <div className="bg-white py-[74px] px-6 lg:px-12 flex justify-center">
                <div className="w-full max-w-[1274px]">{feature.content}</div>
              </div>
            )}

            {/* Right accent bar */}
            <div className="hidden lg:block bg-[#F4F3EB]" />
          </div>
        ))}
      </div>
    </div>
  );
}
