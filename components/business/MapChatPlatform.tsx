"use client";

import Image from "next/image";
import ColumbusMark from "./superFeatureRows/ColumbusMark";

const FLOATING_SHADOW =
  "0 1px 2px rgba(0,0,0,0.10), 0 6px 14px rgba(0,0,0,0.10), 0 28px 56px rgba(0,0,0,0.22), 0 56px 96px rgba(0,0,0,0.18)";
const PANEL_SHADOW = "0 1px 2px rgba(0,0,0,0.10), 0 6px 14px rgba(0,0,0,0.12)";
const PILL_SHADOW = "0 1px 2px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.10)";

const NAVY = "#0B1B3A";
const ACCENT = "#154ACC";
const DARK_SURFACE = "#0A0B10";
const ACTIVE_PILL = "#0F2A66";
const HAIRLINE = "#E5E7EB";
const MUTED = "#9CA3AF";
const MID = "#374151";
const PANEL_BG = "#FFFFFF";

export type MapChatPoi = {
  top: string;
  left: string;
  label: string;
  tone: "accent" | "dark";
};

export type MapChatPlatformProps = {
  breadcrumb?: string;
  cityLabel?: string;
  pois?: [MapChatPoi, MapChatPoi];
  filterLabel?: string;
  filterHelp?: string;
  dataCardTitle?: string;
  dataCardMin?: string;
  dataCardMax?: string;
  dataCardSecondary?: string;
};

const DEFAULT_BREADCRUMB = "Minneapolis Real Estate property flips";
const DEFAULT_CITY_LABEL = "Minneapolis";
const DEFAULT_POIS: [MapChatPoi, MapChatPoi] = [
  { top: "28%", left: "55%", label: "Boom Island", tone: "accent" },
  { top: "78%", left: "46%", label: "Minneapolis Institute of Art", tone: "dark" },
];
const DEFAULT_FILTER_LABEL = "Income data";
const DEFAULT_FILTER_HELP = "Filter by median income levels (dollar amounts)";
const DEFAULT_DATA_CARD_TITLE = "Households Median Income";
const DEFAULT_DATA_CARD_MIN = "$2,490";
const DEFAULT_DATA_CARD_MAX = "$20,490";
const DEFAULT_DATA_CARD_SECONDARY = "Gen Z Average Consumption";

export default function MapChatPlatform({
  breadcrumb = DEFAULT_BREADCRUMB,
  cityLabel = DEFAULT_CITY_LABEL,
  pois = DEFAULT_POIS,
  filterLabel = DEFAULT_FILTER_LABEL,
  filterHelp = DEFAULT_FILTER_HELP,
  dataCardTitle = DEFAULT_DATA_CARD_TITLE,
  dataCardMin = DEFAULT_DATA_CARD_MIN,
  dataCardMax = DEFAULT_DATA_CARD_MAX,
  dataCardSecondary = DEFAULT_DATA_CARD_SECONDARY,
}: MapChatPlatformProps = {}) {
  return (
    <div
      className="mx-auto w-full"
      style={{
        maxWidth: 1180,
        borderRadius: "var(--ent-radius-2xl)",
        overflow: "hidden",
        boxShadow: FLOATING_SHADOW,
        backgroundColor: "#FFFFFF",
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}>
        <div className="absolute inset-0 flex">
          <LeftColumn />
          <div className="flex flex-col flex-1 min-w-0">
            <TopBar breadcrumb={breadcrumb} />
            <div className="flex flex-1 min-h-0">
              <ChatPanel />
              <MapPanel
                cityLabel={cityLabel}
                pois={pois}
                filterLabel={filterLabel}
                filterHelp={filterHelp}
                dataCardTitle={dataCardTitle}
                dataCardMin={dataCardMin}
                dataCardMax={dataCardMax}
                dataCardSecondary={dataCardSecondary}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftColumn() {
  return (
    <div
      className="flex flex-col shrink-0"
      style={{
        width: 56,
        backgroundColor: PANEL_BG,
        borderRight: `1px solid ${HAIRLINE}`,
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{ height: 48, backgroundColor: ACTIVE_PILL }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
      <div className="flex flex-col items-center flex-1 pt-2">
        <SideIcon active>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </SideIcon>
        <SideIcon>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            <path d="m12 8.5 1 2 2.2.3-1.6 1.6.4 2.2L12 13.6l-2 1 .4-2.2-1.6-1.6 2.2-.3z" />
          </svg>
        </SideIcon>
        <SideIcon>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4z" />
          </svg>
        </SideIcon>
        <SideIcon>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
            <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
          </svg>
        </SideIcon>
        <div className="mt-auto flex flex-col items-center pb-2.5 gap-1.5">
          <SideIcon>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
          </SideIcon>
          <div
            aria-hidden
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #FFD6A0 0%, #C97A3F 40%, #234B82 100%)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          />
          <SideIcon>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </SideIcon>
        </div>
      </div>
    </div>
  );
}

function SideIcon({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: 34,
        height: 34,
        marginBottom: 8,
        borderRadius: 7,
        backgroundColor: active ? ACTIVE_PILL : "transparent",
        color: active ? "#FFFFFF" : "#4B5563",
      }}
    >
      {children}
    </div>
  );
}

function TopBar({ breadcrumb }: { breadcrumb: string }) {
  return (
    <div
      className="flex items-center justify-between shrink-0 px-3"
      style={{
        height: 48,
        borderBottom: `1px solid ${HAIRLINE}`,
        backgroundColor: PANEL_BG,
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <ColumbusMark size={22} />
        <span style={{ color: NAVY, fontSize: 17, fontWeight: 700, letterSpacing: "-0.015em" }}>Columbus</span>
        <span style={{ color: MUTED, fontSize: 14, margin: "0 6px" }}>/</span>
        <span style={{ color: NAVY, fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", letterSpacing: "-0.005em" }}>
          {breadcrumb}
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <span
          className="inline-flex items-center gap-1.5"
          style={{
            height: 28,
            padding: "0 11px",
            borderRadius: 7,
            border: `1px solid ${HAIRLINE}`,
            color: MID,
            fontSize: 12.5,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4z" />
          </svg>
          Report View
        </span>
        <span className="inline-flex items-center gap-1.5" style={{ color: MID, fontSize: 12.5, whiteSpace: "nowrap" }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 22v-6h6" />
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 2v6h-6" />
          </svg>
          Save Mapshot
        </span>
        <span className="inline-flex items-center gap-1.5" style={{ color: MUTED, fontSize: 12.5, whiteSpace: "nowrap" }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19a4.5 4.5 0 1 0 0-9h-1.4A7 7 0 1 0 4 14.9" />
            <line x1="2" y1="2" x2="22" y2="22" />
          </svg>
          Edits not saved
        </span>
      </div>
    </div>
  );
}

function ChatPanel() {
  return (
    <div
      className="flex flex-col shrink-0"
      style={{
        width: "34%",
        minWidth: 0,
        backgroundColor: PANEL_BG,
        borderRight: `1px solid ${HAIRLINE}`,
      }}
    >
      <div
        className="flex items-center justify-between shrink-0"
        style={{ height: 38, padding: "0 14px", borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-5">
          <Tab label="Chat" active />
          <Tab label="Map Filters" />
        </div>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={MID} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      </div>

      <div className="flex-1 grid place-items-center px-4">
        <div
          style={{
            color: MUTED,
            fontSize: "clamp(13px, 1.5vw, 17px)",
            fontWeight: 400,
            letterSpacing: "-0.005em",
            textAlign: "center",
          }}
        >
          Ask anything or explore data
        </div>
      </div>

      <div className="px-3 pb-3">
        <div
          className="flex items-center justify-between"
          style={{
            height: 40,
            padding: "0 5px 0 12px",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 7,
            backgroundColor: PANEL_BG,
          }}
        >
          <span style={{ color: MUTED, fontSize: 13 }}>
            Ask Columbus or type &ldquo;/&rdquo;
          </span>
          <button
            type="button"
            aria-label="Send"
            className="flex items-center justify-center"
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              backgroundColor: NAVY,
              color: "#FFFFFF",
              border: "none",
              cursor: "default",
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        </div>
        <div className="text-center mt-1.5" style={{ color: MUTED, fontSize: 10.5 }}>
          Columbus Pro is an LGM and can get things wrong.
        </div>
      </div>
    </div>
  );
}

function Tab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        color: active ? NAVY : MUTED,
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        paddingBottom: 8,
      }}
    >
      {label}
      {active ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -1,
            height: 2,
            backgroundColor: ACCENT,
            borderRadius: 1,
          }}
        />
      ) : null}
    </div>
  );
}

function MapPanel({
  cityLabel,
  pois,
  filterLabel,
  filterHelp,
  dataCardTitle,
  dataCardMin,
  dataCardMax,
  dataCardSecondary,
}: {
  cityLabel: string;
  pois: [MapChatPoi, MapChatPoi];
  filterLabel: string;
  filterHelp: string;
  dataCardTitle: string;
  dataCardMin: string;
  dataCardMax: string;
  dataCardSecondary: string;
}) {
  return (
    <div className="relative flex-1 overflow-hidden" style={{ minWidth: 0 }}>
      <Image
        src="/MapChatbackgroundimg.png"
        alt=""
        fill
        sizes="(max-width: 1180px) 60vw, 720px"
        className="object-cover object-center"
        aria-hidden
      />

      <div
        className="absolute flex flex-col items-center"
        style={{ top: 12, left: 12, gap: 6 }}
      >
        <RoundCtrl>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke={MID} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </RoundCtrl>
        <div
          className="flex flex-col"
          style={{
            backgroundColor: PANEL_BG,
            borderRadius: 999,
            boxShadow: PILL_SHADOW,
            overflow: "hidden",
          }}
        >
          <ZoomBtn>+</ZoomBtn>
          <div style={{ height: 1, backgroundColor: HAIRLINE, margin: "0 5px" }} />
          <ZoomBtn>−</ZoomBtn>
        </div>
        <RoundCtrl>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke={MID} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
            <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
          </svg>
        </RoundCtrl>
      </div>

      <div
        className="absolute"
        style={{
          left: "38%",
          top: "55%",
          color: "#1F2937",
          fontSize: "clamp(16px, 2.6vw, 32px)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          textShadow: "0 1px 2px rgba(255,255,255,0.9)",
          pointerEvents: "none",
        }}
      >
        {cityLabel}
      </div>

      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          left: "32%",
          top: "20%",
          width: 28,
          height: 32,
          color: "#FFFFFF",
          background: "#1F2937",
          borderRadius: "4px 4px 12px 12px / 4px 4px 16px 16px",
          fontWeight: 700,
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 5.5, letterSpacing: "0.05em" }}>INTERSTATE</div>
        <div style={{ fontSize: 12, marginTop: 2 }}>94</div>
      </div>

      <PoiLabel top={pois[0].top} left={pois[0].left} label={pois[0].label} tone={pois[0].tone} />
      <PoiLabel top={pois[1].top} left={pois[1].left} label={pois[1].label} tone={pois[1].tone} />
      <Marker top="36%" left="34%" tone="accent" />
      <Marker top="62%" left="62%" tone="dark" />

      <DrawnAreaPanel
        filterLabel={filterLabel}
        filterHelp={filterHelp}
        dataCardTitle={dataCardTitle}
        dataCardMin={dataCardMin}
        dataCardMax={dataCardMax}
        dataCardSecondary={dataCardSecondary}
      />

      <div
        className="absolute flex flex-col items-center"
        style={{ right: 12, bottom: 12, gap: 7 }}
      >
        <RoundCtrl tone="accent">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4z" />
          </svg>
        </RoundCtrl>
        <RoundCtrl>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke={MID} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </RoundCtrl>
        <RoundCtrl>
          <svg viewBox="0 0 24 24" width="12" height="12" fill={MID} stroke="none">
            <path d="M5 4v16l14-8z" />
          </svg>
        </RoundCtrl>
        <RoundCtrl>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M2 12h20" />
          </svg>
        </RoundCtrl>
      </div>
    </div>
  );
}

function PoiLabel({
  top,
  left,
  label,
  tone,
}: {
  top: string;
  left: string;
  label: string;
  tone: "accent" | "dark";
}) {
  const color = tone === "accent" ? ACCENT : NAVY;
  return (
    <div
      className="absolute flex items-center gap-1"
      style={{
        top,
        left,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          backgroundColor: color,
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9 12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      </div>
      <span
        style={{
          color,
          fontSize: 10.5,
          fontWeight: 600,
          textShadow: "0 1px 2px rgba(255,255,255,0.9)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Marker({ top, left, tone }: { top: string; left: string; tone: "accent" | "dark" }) {
  const fill = tone === "accent" ? ACCENT : DARK_SURFACE;
  return (
    <div
      aria-hidden
      className="absolute"
      style={{
        top,
        left,
        width: 14,
        height: 14,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: 2.5,
          boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: fill }} />
      </div>
    </div>
  );
}

function ZoomBtn({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: 26,
        height: 24,
        color: MID,
        fontSize: 14,
        lineHeight: 1,
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}

function RoundCtrl({ children, tone }: { children: React.ReactNode; tone?: "accent" }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: 26,
        height: 26,
        borderRadius: "50%",
        backgroundColor: tone === "accent" ? ACCENT : PANEL_BG,
        boxShadow: PILL_SHADOW,
      }}
    >
      {children}
    </div>
  );
}

function DrawnAreaPanel({
  filterLabel,
  filterHelp,
  dataCardTitle,
  dataCardMin,
  dataCardMax,
  dataCardSecondary,
}: {
  filterLabel: string;
  filterHelp: string;
  dataCardTitle: string;
  dataCardMin: string;
  dataCardMax: string;
  dataCardSecondary: string;
}) {
  return (
    <div
      className="absolute flex flex-col"
      style={{
        right: 10,
        top: 10,
        bottom: 10,
        width: "30%",
        maxWidth: 270,
        minWidth: 190,
        backgroundColor: PANEL_BG,
        borderRadius: 9,
        boxShadow: PANEL_SHADOW,
        overflow: "hidden",
        border: `1px solid ${HAIRLINE}`,
      }}
    >
      <div
        className="flex items-center justify-between shrink-0"
        style={{ padding: "9px 11px", borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4z" />
          </svg>
          <span style={{ color: NAVY, fontSize: 11.5, fontWeight: 600 }}>Drawn area</span>
        </div>
        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke={MUTED} strokeWidth="2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </div>

      <div className="flex-1 overflow-hidden" style={{ padding: "9px 11px" }}>
        <p style={{ color: MID, fontSize: 9.5, lineHeight: 1.4, margin: 0 }}>
          Click points on the map to measure distances and research areas.
        </p>

        <div style={{ color: NAVY, fontSize: 10.5, fontWeight: 600, marginTop: 9 }}>
          Selection 1 Information
        </div>

        <PanelRow label="Advanced Measurements" />
        <div style={{ color: NAVY, fontSize: 9.5, fontWeight: 600, marginTop: 6 }}>Elevation Estimate</div>
        <div style={{ color: MID, fontSize: 8.5, marginTop: 2, lineHeight: 1.35 }}>
          Min: 456.34 m | Median: 356.23 m | Max: 1345.35 m
        </div>

        <PanelRow label={filterLabel} />
        <div style={{ color: MUTED, fontSize: 8.5, marginTop: 2, lineHeight: 1.3 }}>
          {filterHelp}
        </div>

        <DataCard title={dataCardTitle} min={dataCardMin} max={dataCardMax} />
        <DataCard title={dataCardSecondary} />
      </div>

      <div className="shrink-0" style={{ padding: "6px 11px 11px" }}>
        <div
          className="flex items-center justify-center gap-1"
          style={{
            height: 24,
            borderRadius: 6,
            border: `1px dashed ${HAIRLINE}`,
            color: MID,
            fontSize: 9.5,
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: 11, lineHeight: 1 }}>+</span> Ask for new data point
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            height: 28,
            borderRadius: 6,
            backgroundColor: NAVY,
            color: "#FFFFFF",
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          Add to Chat
        </div>
      </div>
    </div>
  );
}

function PanelRow({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        marginTop: 9,
        paddingBottom: 5,
        borderBottom: `1px solid ${HAIRLINE}`,
        color: NAVY,
      }}
    >
      <span style={{ fontSize: 10.5, fontWeight: 600 }}>{label}</span>
      <div className="flex items-center gap-1">
        <span style={{ color: MUTED, fontSize: 9 }}>?</span>
        <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke={MUTED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

function DataCard({ title, min, max }: { title: string; min?: string; max?: string }) {
  return (
    <div
      style={{
        marginTop: 6,
        padding: 7,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 6,
      }}
    >
      <div className="flex items-center justify-between">
        <span style={{ color: NAVY, fontSize: 9.5, fontWeight: 600, lineHeight: 1.2 }}>{title}</span>
        <div className="flex items-center gap-1">
          <span style={{ color: MUTED, fontSize: 8 }}>?</span>
          <svg viewBox="0 0 24 24" width="8" height="8" fill="none" stroke={MUTED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
      {min && max ? (
        <>
          <div
            style={{
              position: "relative",
              height: 4,
              marginTop: 8,
              borderRadius: 999,
              backgroundColor: HAIRLINE,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                borderRadius: 999,
                backgroundColor: NAVY,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                width: 9,
                height: 9,
                marginTop: -4.5,
                marginLeft: -4.5,
                borderRadius: "50%",
                backgroundColor: PANEL_BG,
                border: `2px solid ${NAVY}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                width: 9,
                height: 9,
                marginTop: -4.5,
                marginRight: -4.5,
                borderRadius: "50%",
                backgroundColor: PANEL_BG,
                border: `2px solid ${NAVY}`,
              }}
            />
          </div>
          <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
            <span style={{ color: MID, fontSize: 8.5 }}>{min}</span>
            <span style={{ color: MID, fontSize: 8.5 }}>{max}</span>
          </div>
        </>
      ) : null}
    </div>
  );
}
