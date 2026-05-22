"use client";

import Image from "next/image";
import ColumbusMark from "./superFeatureRows/ColumbusMark";

/* Layered composite of the Columbus chat platform mockup. Three z-stacked
   layers, deepest first:

     1. MapImage — covers the right column with a real map tile
     2. /business/ConversationalMapChat.png — chrome PNG (transparent in
        the chat panel and right-side button area, so the map shows
        through while the sidebar, top bar, and baked controls remain)
     3. Coded UI on top: ChatResponse (industry-specific query bubble +
        Columbus forecast answer) and ChatInputBox (typeable "Ask
        Columbus" field) */

const FLOATING_SHADOW =
  "0 1px 2px rgba(0,0,0,0.10), 0 6px 14px rgba(0,0,0,0.10), 0 28px 56px rgba(0,0,0,0.22), 0 56px 96px rgba(0,0,0,0.18)";

const NAVY = "#0B1B3A";
const ACCENT = "#154ACC";
const DARK_SURFACE = "#0A0B10";
const HAIRLINE = "#E5E7EB";
const MUTED = "#9CA3AF";
const MID = "#374151";
const PANEL_BG = "#FFFFFF";
const SURFACE_TINT = "#F3F4F6";

/* Typography scale — fluid sizes scoped to the platform mockup. Headings
   and box body text both use this scale so "Top 4 …" and "Key takeaway"
   stay aligned, and every body block (response paragraph, list rows,
   takeaway body, input) reads at the same size. */
const TYPE = {
  body: "clamp(10.5px, 1.05vw, 13.5px)",
  heading: "clamp(10.5px, 1vw, 13px)",
  caption: "clamp(9.5px, 0.88vw, 11.5px)",
  meta: "clamp(8.5px, 0.8vw, 10.5px)",
};

/* Chrome PNG layout — these % values are relative to the card, which
   uses the PNG's native aspect (5190/3030) so no object-cover cropping. */
const CHAT_TOP = 9;
const CHAT_BOTTOM = 11;
const CHAT_LEFT = 6;
const CHAT_RIGHT = 47;

const INPUT_TOP = 89;
const INPUT_BOTTOM = 96;
const INPUT_LEFT = CHAT_LEFT;
const INPUT_RIGHT = CHAT_RIGHT;

const MAP_LEFT = 47;
const MAP_TOP = 5.5;

export type MapChatPoi = {
  top: string;
  left: string;
  label: string;
  tone: "accent" | "dark";
};

export type MapChatListItem = {
  rank: number;
  name: string;
  pct: string;
};

export type MapChatPlatformProps = {
  /* Accepted but ignored — the chrome PNG owns the breadcrumb, city
     label, POI text, and right-side controls. Kept on the type so the
     per-industry `copy.mapChat` data in BusinessUseCases stays
     compatible. */
  breadcrumb?: string;
  cityLabel?: string;
  pois?: [MapChatPoi, MapChatPoi];
  filterLabel?: string;
  filterHelp?: string;
  dataCardTitle?: string;
  dataCardMin?: string;
  dataCardMax?: string;
  dataCardSecondary?: string;
  /* Map tile rendered as the deepest layer behind the chrome. */
  map?: string;
  /* Industry-specific chat content. Defaults to the Munich traffic-
     congestion forecast (Urban Planning & Infrastructure) so legacy
     callers without these props still render meaningfully. */
  userQuery?: string;
  responseIntro?: string;
  listTitle?: string;
  listSubtitle?: string;
  listItems?: ReadonlyArray<MapChatListItem>;
  keyTakeaway?: string;
};

const DEFAULT_MAP = "/MapChatbackgroundimg.png";
const CHROME_BACKGROUND = "/business/ConversationalMapChat.png";

const DEFAULT_USER_QUERY =
  "Forecast the districts in greater Munich most at risk of traffic-congestion growth over the next 2–3 years";
const DEFAULT_RESPONSE_INTRO =
  "Here are the districts in greater Munich forecasted to experience the worst traffic-congestion growth over the next 2–3 years";
const DEFAULT_LIST_TITLE = "Top 4 Districts by Forecasted Congestion Growth";
const DEFAULT_LIST_SUBTITLE = "Next 24–36 Months";
const DEFAULT_LIST_ITEMS: ReadonlyArray<MapChatListItem> = [
  { rank: 1, name: "Schwabing-West", pct: "+14.2%" },
  { rank: 2, name: "Bogenhausen", pct: "+12.8%" },
  { rank: 3, name: "Sendling-Westpark", pct: "+11.1%" },
  { rank: 4, name: "Riem", pct: "+9.7%" },
];
const DEFAULT_KEY_TAKEAWAY =
  "Congestion growth concentrates on residential pipelines feeding the BMW / Siemens employment ring, with S-Bahn capacity ceilings amplifying spill-over.";

export default function MapChatPlatform({
  map = DEFAULT_MAP,
  userQuery = DEFAULT_USER_QUERY,
  responseIntro = DEFAULT_RESPONSE_INTRO,
  listTitle = DEFAULT_LIST_TITLE,
  listSubtitle = DEFAULT_LIST_SUBTITLE,
  listItems = DEFAULT_LIST_ITEMS,
  keyTakeaway = DEFAULT_KEY_TAKEAWAY,
}: MapChatPlatformProps = {}) {
  return (
    <div
      className="mx-auto w-full"
      style={{
        maxWidth: 1180,
        borderRadius: "var(--ent-radius-2xl)",
        overflow: "hidden",
        boxShadow: FLOATING_SHADOW,
        backgroundColor: PANEL_BG,
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "5190 / 3030" }}>
        <MapImage map={map} />

        <Image
          src={CHROME_BACKGROUND}
          alt=""
          fill
          sizes="(max-width: 1180px) 100vw, 1180px"
          className="object-cover object-center"
          aria-hidden
          priority
        />

        <ChatResponse
          userQuery={userQuery}
          responseIntro={responseIntro}
          listTitle={listTitle}
          listSubtitle={listSubtitle}
          listItems={listItems}
          keyTakeaway={keyTakeaway}
        />
        <ChatInputBox />
      </div>
    </div>
  );
}

function MapImage({ map }: { map: string }) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        top: `${MAP_TOP}%`,
        bottom: 0,
        left: `${MAP_LEFT}%`,
        right: 0,
      }}
    >
      <Image
        src={map}
        alt=""
        fill
        sizes="(max-width: 1180px) 55vw, 650px"
        className="object-cover object-center"
        aria-hidden
      />

      <Marker top="32%" left="38%" tone="accent" />
      <Marker top="58%" left="56%" tone="dark" />
      <Marker top="46%" left="22%" tone="accent" />
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

function ChatInputBox() {
  return (
    <div
      className="absolute flex items-center"
      style={{
        top: `${INPUT_TOP}%`,
        bottom: `${100 - INPUT_BOTTOM}%`,
        left: `${INPUT_LEFT}%`,
        right: `${100 - INPUT_RIGHT}%`,
        backgroundColor: PANEL_BG,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 10,
        padding: "0 8px 0 16px",
        gap: 10,
      }}
    >
      <input
        type="text"
        placeholder="Ask Columbus"
        aria-label="Ask Columbus"
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          color: NAVY,
          fontSize: TYPE.body,
          fontFamily: "inherit",
          padding: 0,
        }}
      />
      <button
        type="button"
        aria-label="Send"
        className="flex items-center justify-center shrink-0"
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: NAVY,
          color: "#FFFFFF",
          border: "none",
          cursor: "pointer",
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}

function ChatResponse({
  userQuery,
  responseIntro,
  listTitle,
  listSubtitle,
  listItems,
  keyTakeaway,
}: {
  userQuery: string;
  responseIntro: string;
  listTitle: string;
  listSubtitle: string;
  listItems: ReadonlyArray<MapChatListItem>;
  keyTakeaway: string;
}) {
  return (
    <div
      className="absolute flex flex-col"
      style={{
        top: `${CHAT_TOP}%`,
        bottom: `${CHAT_BOTTOM}%`,
        left: `${CHAT_LEFT}%`,
        right: `${100 - CHAT_RIGHT}%`,
        backgroundColor: PANEL_BG,
        padding: "clamp(6px, 0.7vw, 10px)",
        gap: "clamp(4px, 0.5vw, 7px)",
        justifyContent: "flex-start",
        overflow: "hidden",
        fontFamily: "inherit",
      }}
    >
      {/* User query — right-aligned chat bubble */}
      <div
        className="self-end shrink-0"
        style={{
          maxWidth: "88%",
          backgroundColor: SURFACE_TINT,
          color: NAVY,
          padding: "clamp(5px, 0.55vw, 8px) clamp(9px, 0.95vw, 13px)",
          borderRadius: 12,
          fontSize: TYPE.body,
          fontWeight: 500,
          lineHeight: 1.4,
        }}
      >
        {userQuery}
      </div>

      {/* Columbus answer header — logo + small caption */}
      <div className="flex items-center gap-1.5 shrink-0">
        <ColumbusMark size={14} />
        <span style={{ color: MUTED, fontSize: TYPE.caption, fontWeight: 500 }}>
          Columbus forecasted your question
        </span>
      </div>

      <p
        style={{
          color: NAVY,
          fontSize: TYPE.body,
          fontWeight: 500,
          lineHeight: 1.45,
          letterSpacing: "-0.005em",
          margin: 0,
        }}
      >
        {responseIntro}
      </p>

      {/* Districts list */}
      <div
        className="shrink-0"
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 8,
          padding: "clamp(6px, 0.65vw, 9px)",
        }}
      >
        <div
          style={{
            color: NAVY,
            fontSize: TYPE.heading,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            lineHeight: 1.25,
          }}
        >
          {listTitle}
        </div>
        <div style={{ color: MUTED, fontSize: TYPE.meta, marginTop: 2 }}>{listSubtitle}</div>
        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: "clamp(5px, 0.5vw, 7px) 0 0",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(3px, 0.35vw, 5px)",
          }}
        >
          {listItems.map((d) => (
            <li key={d.rank} className="flex items-center" style={{ gap: "clamp(5px, 0.55vw, 8px)" }}>
              <span
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: NAVY,
                  color: "#FFFFFF",
                  fontSize: TYPE.meta,
                  fontWeight: 700,
                }}
              >
                {d.rank}
              </span>
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  color: NAVY,
                  fontSize: TYPE.body,
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {d.name}
              </span>
              <span style={{ color: ACCENT, fontSize: TYPE.body, fontWeight: 700 }}>{d.pct}</span>
            </li>
          ))}
        </ol>
      </div>

      <div
        className="shrink-0"
        style={{
          backgroundColor: SURFACE_TINT,
          borderRadius: 8,
          padding: "clamp(6px, 0.65vw, 9px)",
        }}
      >
        <div
          style={{
            color: NAVY,
            fontSize: TYPE.heading,
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          Key takeaway
        </div>
        <p style={{ color: NAVY, fontSize: TYPE.body, lineHeight: 1.4, margin: "3px 0 0" }}>
          {keyTakeaway}
        </p>
      </div>

      <button
        type="button"
        className="shrink-0 inline-flex items-center justify-center gap-1.5 self-start"
        style={{
          height: "clamp(22px, 2.2vw, 28px)",
          padding: "0 clamp(9px, 0.9vw, 12px)",
          borderRadius: 7,
          backgroundColor: NAVY,
          color: "#FFFFFF",
          border: "none",
          fontSize: TYPE.meta,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "inherit",
          letterSpacing: "-0.005em",
        }}
      >
        View Full Report
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
