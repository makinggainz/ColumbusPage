"use client";

import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import ColumbusMark from "./superFeatureRows/ColumbusMark";
import { useMediaWarm } from "@/components/ui/MediaPrefetcher";
import MockupChrome, { BarDivider, BarPill, EditsNotSaved, GRADIENT_ORANGE } from "./MockupChrome";

/* The Columbus "Ask the Map" mockup. The app chrome (left icon rail + top
   bar with the Columbus logo, "untitled chat" crumb, and the Report View /
   Save Mapshot / Edits-not-saved actions) is drawn programmatically by the
   shared <MockupChrome>. This component supplies the inner pane: a two-column
   split — a coded chat panel on the left (ChatResponse + ChatInputBox) and a
   real map tile on the right with floating search/data buttons and map
   controls drawn in code (these used to be baked into the chrome PNG). */

const NAVY = "#0B1B3A";
const ACCENT = "#154ACC";
const DARK_SURFACE = "#0A0B10";
const HAIRLINE = "#E5E7EB";
const MUTED = "#9CA3AF";
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

/* Horizontal padding inside the chat-response panel. The input box shares
   this padding so its border lines up with the content above it. */
const PANEL_PAD = "clamp(6px, 0.7vw, 10px)";

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
  /* When true, the chrome + map load eagerly at high priority (the hero's
     above-the-fold glass window). Below-fold callers (ComparisonSection,
     ChatSection) leave it false so the assets stay lazy until idle. */
  eager?: boolean;
  /* When true (but not `eager`), the chrome + map load eagerly at LOW
     priority — used by ComparisonSection to preload every pre-mounted demo
     once the section scrolls into view, so switching showcases never reveals
     a half-loaded mockup. Distinct from `eager` (which is high-priority for
     the hero). */
  preload?: boolean;
};

const DEFAULT_MAP = "/BusinessPgMedia/UrbanInfrastructureUseCases/MapVisuals/map-chat.png";

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
  eager = false,
  preload = false,
}: MapChatPlatformProps = {}) {
  const warm = useMediaWarm();
  /* Eager-but-low-priority once the section is warm OR has been preloaded. */
  const soon = warm || preload;
  return (
    <MockupChrome
      className="biz-product-display biz-mockup-frame"
      railIcons={["grid", "search-star", "edit", "database"]}
      activeRailIndex={1}
      crumbs={["untitled chat"]}
      actions={
        // +5px per gap over the shared wrapper's default → ~10px more
        // horizontal space between Report View ↔ Save Mapshot ↔ Edits not saved
        // (a divider sits in each gap).
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "calc(clamp(6px, 0.8cqw, 12px) + 5px)",
          }}
        >
          {/* The shared actions wrapper is nudged down to align action TEXT
              with the Columbus title; that pushes the bordered Report View
              rectangle ~1px below the bar's centre, so counter-shift it up 1px
              to keep the rectangle itself vertically centred. */}
          <span style={{ display: "inline-flex", transform: "translateY(-1px)" }}>
          <BarPill
            gradient={GRADIENT_ORANGE}
            fontSize="14px"
            fontWeight={500}
            radius={10}
            paddingY="calc(clamp(4px, 0.7cqw, 9px) - 1.5px)"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              style={{ width: "clamp(11px, 1.3cqw, 16px)", height: "clamp(11px, 1.3cqw, 16px)" }}
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            Report View
          </BarPill>
          </span>
          <BarDivider height="20px" color="#D5D5D5" />
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "clamp(4px, 0.6cqw, 8px)",
              color: NAVY,
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "-0.005em",
              whiteSpace: "nowrap",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              style={{ width: "clamp(12px, 1.4cqw, 17px)", height: "clamp(12px, 1.4cqw, 17px)" }}
            >
              <path d="M15 3h6v6" />
              <path d="M9 21H3v-6" />
              <path d="M21 3l-7 7" />
              <path d="M3 21l7-7" />
            </svg>
            Save Mapshot
          </span>
          <BarDivider height="20px" color="#D5D5D5" />
          <EditsNotSaved fontSize="14px" fontWeight={400} />
        </div>
      }
    >
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* ── Left: coded chat panel ── */}
        <div
          style={{
            width: "44%",
            flexShrink: 0,
            height: "100%",
            backgroundColor: PANEL_BG,
            borderRight: `1px solid ${HAIRLINE}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Conversation — keeps its inset padding. */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              // Horizontal inset matches the Reports view exactly so the
              // answer content's left/right edges line up across both
              // showcases (cqw resolves against the shared MockupChrome
              // frame). Top/bottom keep this panel's own PANEL_PAD rhythm.
              padding: `${PANEL_PAD} max(0px, calc(clamp(14px, 2.2cqw, 28px) - 8px))`,
              overflow: "hidden",
            }}
          >
            <ChatResponse
              userQuery={userQuery}
              responseIntro={responseIntro}
              listTitle={listTitle}
              listSubtitle={listSubtitle}
              listItems={listItems}
              keyTakeaway={keyTakeaway}
            />
          </div>
          {/* Input + disclaimer dock — flush to the panel's left/right/bottom
              edges; only a top hairline separates it from the conversation. */}
          <div
            className="shrink-0"
            style={{
              backgroundColor: "#FFFFFF",
              borderTop: `1px solid ${HAIRLINE}`,
              paddingBottom: "clamp(5px, 0.7cqw, 9px)",
            }}
          >
            <ChatInputBox />
            <p
              style={{
                margin: 0,
                textAlign: "center",
                color: MUTED,
                fontSize: TYPE.meta,
                letterSpacing: "-0.005em",
                padding: "0 clamp(8px, 1cqw, 16px)",
              }}
            >
              Columbus Pro is an LGM and can get things wrong.
            </p>
          </div>
        </div>

        {/* ── Right: live map tile + floating controls ── */}
        <MapImage map={map} eager={eager} warm={soon} />
      </div>
    </MockupChrome>
  );
}

function MapImage({ map, eager, warm }: { map: string; eager?: boolean; warm?: boolean }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        flex: 1,
        minWidth: 0,
        height: "100%",
        /* Vibrancy lift — same recipe as MapThumb / MapLayeredVisual,
           applied to the wrapper so the next/image below inherits it. */
        filter: "saturate(1.2) contrast(1.08)",
      }}
    >
      {/* ImageWithFallback: shimmer skeleton + fade-in on load, plus
          automatic src-change reset so switching industries fades the
          new map in rather than snapping it in. */}
      <ImageWithFallback
        src={map}
        alt=""
        fill
        sizes="(max-width: 1180px) 55vw, 650px"
        className="object-cover object-center"
        aria-hidden
        fallbackStyle={{ borderRadius: 0 }}
        {...(eager
          ? { priority: true }
          : { loading: warm ? "eager" : "lazy", fetchPriority: warm ? "low" : undefined })}
      />

      <Marker top="32%" left="38%" tone="accent" />

      <MapFloatingButtons />
      <MapControls />
    </div>
  );
}

/* Floating action buttons over the map — a search and a data (database)
   circle, matching the pair baked into the source chrome PNG. Anchored 20px
   in from the map's left edge (i.e. 20px from the chat area's right edge). */
function MapFloatingButtons() {
  return (
    <div
      aria-hidden
      className="absolute"
      style={{
        top: "clamp(8px, 1.4cqw, 18px)",
        left: 20,
        display: "flex",
        flexDirection: "column",
        gap: "clamp(5px, 0.7cqw, 9px)",
      }}
    >
      <CircleButton>
        <svg viewBox="0 0 24 24" fill="none" stroke={DARK_SURFACE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "52%", height: "52%" }}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </CircleButton>
      <CircleButton>
        <svg viewBox="0 0 24 24" fill="none" stroke={DARK_SURFACE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "52%", height: "52%" }}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </svg>
      </CircleButton>
    </div>
  );
}

/* Right-edge map controls — zoom box, 3D toggle, draw/edit, and a compass,
   matching the control stack baked into the source chrome PNG. */
function MapControls() {
  return (
    <div
      aria-hidden
      className="absolute"
      style={{
        right: "clamp(8px, 1.2cqw, 18px)",
        /* Anchor the stack's bottom 10px above the Earth helper mascot's top
           edge. The mascot (drawn by MockupChrome at the frame's bottom-right)
           sits clamp(8px,1.1cqw,18px) up from the bottom and is
           clamp(26px,3cqw,44px) tall, so its top edge is the sum of those. */
        bottom:
          "calc(clamp(8px, 1.1cqw, 18px) + clamp(26px, 3cqw, 44px) + 10px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(6px, 0.9cqw, 12px)",
      }}
    >
      {/* Zoom +/- */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "clamp(6px, 0.7cqw, 9px)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ZoomGlyph kind="plus" />
        <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.10)" }} />
        <ZoomGlyph kind="minus" />
      </div>
      <CircleButton size="small">
        <span style={{ color: ACCENT, fontSize: "clamp(7px, 0.85cqw, 11px)", fontWeight: 700, letterSpacing: "-0.02em" }}>3D</span>
      </CircleButton>
      <CircleButton size="small">
        <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "50%", height: "50%" }}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </CircleButton>
      <CircleButton size="small">
        <svg viewBox="0 0 24 24" fill={ACCENT} stroke="none" style={{ width: "46%", height: "46%" }}>
          <path d="M12 3l5 16-5-4-5 4z" />
        </svg>
      </CircleButton>
    </div>
  );
}

function CircleButton({ children, size = "normal" }: { children: React.ReactNode; size?: "normal" | "small" }) {
  const dim = size === "small" ? "clamp(20px, 2.4cqw, 34px)" : "clamp(24px, 2.9cqw, 40px)";
  return (
    <div
      style={{
        width: dim,
        height: dim,
        borderRadius: "50%",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

function ZoomGlyph({ kind }: { kind: "plus" | "minus" }) {
  const dim = "clamp(20px, 2.4cqw, 34px)";
  return (
    <div style={{ width: dim, height: dim, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 24 24" fill="none" stroke={DARK_SURFACE} strokeWidth="2" strokeLinecap="round" style={{ width: "44%", height: "44%" }}>
        <path d="M5 12h14" />
        {kind === "plus" && <path d="M12 5v14" />}
      </svg>
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
      className="flex items-center shrink-0"
      style={{
        height: "clamp(46px, 5.6cqw, 76px)",
        // Border + background live on the dock wrapper; this row only lays
        // out the field + send button, flush to the panel's side edges.
        padding: "0 clamp(6px, 0.8cqw, 12px) 0 clamp(10px, 1.2cqw, 20px)",
        gap: 10,
      }}
    >
      <input
        type="text"
        placeholder="Ask Columbus anything"
        aria-label="Ask Columbus anything"
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
          width: "clamp(24px, 2.7cqw, 36px)",
          height: "clamp(24px, 2.7cqw, 36px)",
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
      className="flex flex-col"
      style={{
        flex: 1,
        minHeight: 0,
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
