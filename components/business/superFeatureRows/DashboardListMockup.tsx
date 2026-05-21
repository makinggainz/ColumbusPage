"use client";

/* Hero mockup for the "Dashboard" super section — a minimalist chat /
   research history list view.

   Design-system rules in play (business-tokens.css):
   • 7px card corner (--ent-radius-card) — strict homepage parity.
   • Hairline border (--ent-border-card) + the homepage card shadow.
   • Typography inherits Funnel Display on headings via .ent-scope; this
     mockup has no <hN> elements, so all text uses the body face. Sizes
     and tracking pull from --ent-text-* and --ent-tracking-* tokens.
   • Spacing on the 4px grid via --ent-space-* tokens. */

type HistoryRow = {
  title: string;
  body: string;
  age: string;
};

const ROWS: HistoryRow[] = [
  {
    title: "Minneapolis Real estate property vacant lots",
    body: "In this chat you asked me to display all vacant lots with independent owners, and by utilities.",
    age: "20 hours ago",
  },
  {
    title: "Minneapolis newly approved construction projects",
    body: "In this chat we discuss newly approved construction projects on existing sites, or vacant lots in Minneapolis.",
    age: "1 day ago",
  },
  {
    title:
      "Is Dilworth neighborhood trending up or down in terms of prices, rent levels, and investor…",
    body: "In this chat, we looked at whether Dilworth is trending up or down by reviewing recent home value…",
    age: "2 days ago",
  },
  {
    title:
      "How have median prices and days-on-market in this zip changed in 12–24 months?",
    body: "In this chat, we analyzed 12–24 months of market data for the zip code, showing trends in median sale price and days-on-market and highlighting whether the market is heating up, cooling, or stable.",
    age: "20 hours ago",
  },
  {
    title:
      "Are there planned developments, zoning changes, or major employers that affect values here?",
    body: "In this chat, we checked for upcoming developments, zoning shifts, and major employers nearby, then summarized how these factors might impact future property values and exit strategies.",
    age: "20 hours ago",
  },
  {
    title: "Kansas Geological recipes for porphyry deposits in greenfield locations",
    body: "In this chat we discuss some geological anomalies in Kansas, Crater county. For copper porphyry deposits. You made customizations to the map is customized as well.",
    age: "20 hours ago",
  },
];

export default function DashboardListMockup() {
  return (
    <div
      className="mx-auto"
      style={{
        width: "100%",
        maxWidth: 1180,
        background: "var(--ent-bg-white)",
        borderRadius: "var(--ent-radius-card)",
        border: "1px solid var(--ent-border-card)",
        boxShadow: "var(--ent-shadow-card)",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "56px 1fr",
        minHeight: "min(72vh, 620px)",
      }}
    >
      <IconRail />
      <div className="flex flex-col">
        <TopBar />
        <Tabs />
        <Controls />
        <List />
        <div style={{ flex: 1 }} />
      </div>
    </div>
  );
}

function IconRail() {
  return (
    <div
      style={{
        borderRight: "1px solid var(--ent-border-card)",
        padding: "var(--ent-space-4) 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--ent-space-3)",
        background: "var(--ent-bg-white)",
      }}
      aria-hidden
    >
      <RailIcon>
        {/* hamburger */}
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
      </RailIcon>
      <RailIcon active>
        {/* grid (dashboard) */}
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </RailIcon>
      <RailIcon>
        {/* chat */}
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </RailIcon>
      <RailIcon>
        {/* edit */}
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
      </RailIcon>
      <RailIcon>
        {/* database */}
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
      </RailIcon>

      <div style={{ flex: 1 }} />

      <RailIcon>
        {/* bell */}
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </RailIcon>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "var(--ent-radius-full)",
          background:
            "linear-gradient(135deg, #FFD58A 0%, #E07A6B 60%, #6D4F3A 100%)",
        }}
      />
      <RailIcon>
        {/* gear */}
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </RailIcon>
    </div>
  );
}

function RailIcon({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: "var(--ent-radius-base)",
        background: active ? "#EEF1F6" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "var(--ent-text-primary)" : "var(--ent-text-secondary)"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </div>
  );
}

function TopBar() {
  return (
    <div
      style={{
        padding: "var(--ent-space-5) var(--ent-space-8) var(--ent-space-4) var(--ent-space-8)",
        display: "flex",
        alignItems: "center",
        gap: "var(--ent-space-4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ent-space-2)" }}>
        <ColumbusGlyph />
        <span
          style={{
            color: "var(--ent-text-primary)",
            fontSize: "var(--ent-text-body-s)",
            fontWeight: "var(--ent-weight-semibold)",
            letterSpacing: "var(--ent-tracking-body)",
          }}
        >
          Columbus
        </span>
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          minWidth: 280,
          maxWidth: 380,
          flex: "0 1 360px",
          height: 36,
          borderRadius: "var(--ent-radius-full)",
          border: "1px solid var(--ent-border-card)",
          background: "var(--ent-bg-white)",
          display: "flex",
          alignItems: "center",
          padding: "0 var(--ent-space-3)",
          gap: "var(--ent-space-2)",
          color: "var(--ent-text-secondary)",
          fontSize: "var(--ent-text-caption)",
          letterSpacing: "var(--ent-tracking-body)",
        }}
      >
        <span style={{ flex: 1 }}>Ask Columbus Chatbot to search history</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ent-text-secondary)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
    </div>
  );
}

function Tabs() {
  const tabs = [
    { label: "Research Reports", active: false },
    { label: "Audits", active: false },
    { label: "Chats", active: true },
    { label: "Mapshots", active: false },
  ];
  return (
    <div
      style={{
        padding: "0 var(--ent-space-8)",
        display: "flex",
        alignItems: "center",
        gap: "var(--ent-space-8)",
        borderBottom: "1px solid var(--ent-border-card)",
      }}
    >
      {tabs.map((t) => (
        <div
          key={t.label}
          style={{
            position: "relative",
            padding: "var(--ent-space-3) 0",
            fontSize: "var(--ent-text-caption)",
            letterSpacing: "var(--ent-tracking-body)",
            color: t.active ? "var(--ent-text-primary)" : "var(--ent-text-secondary)",
            fontWeight: t.active ? "var(--ent-weight-semibold)" : "var(--ent-weight-medium)",
          }}
        >
          {t.label}
          {t.active ? (
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -1,
                height: 2,
                background: "var(--ent-text-primary)",
                borderRadius: 1,
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function Controls() {
  return (
    <div
      style={{
        padding: "var(--ent-space-4) var(--ent-space-8) var(--ent-space-1) var(--ent-space-8)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <button
        type="button"
        style={{
          padding: "6px 12px",
          borderRadius: "var(--ent-radius-base)",
          border: "1px solid var(--ent-border-card)",
          background: "var(--ent-bg-white)",
          color: "var(--ent-text-primary)",
          fontSize: "var(--ent-text-caption)",
          fontWeight: "var(--ent-weight-medium)",
          letterSpacing: "var(--ent-tracking-body)",
          cursor: "pointer",
        }}
      >
        Select
      </button>
      <div style={{ flex: 1 }} />
      <button
        type="button"
        style={{
          padding: "6px 12px",
          borderRadius: "var(--ent-radius-base)",
          border: "1px solid var(--ent-border-card)",
          background: "var(--ent-bg-white)",
          color: "var(--ent-text-primary)",
          fontSize: "var(--ent-text-caption)",
          fontWeight: "var(--ent-weight-medium)",
          letterSpacing: "var(--ent-tracking-body)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        Sort by: Newest
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ent-text-primary)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}

function List() {
  return (
    <div
      style={{
        padding: "var(--ent-space-1) var(--ent-space-8) var(--ent-space-3) var(--ent-space-8)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {ROWS.map((row, i) => (
        <ListRow key={row.title + i} row={row} last={i === ROWS.length - 1} />
      ))}
    </div>
  );
}

function ListRow({ row, last }: { row: HistoryRow; last: boolean }) {
  return (
    <div
      style={{
        padding: "var(--ent-space-4) 0",
        borderBottom: last ? "none" : "1px solid var(--ent-border-card)",
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--ent-space-3)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: "var(--ent-text-primary)",
            fontSize: "var(--ent-text-caption)",
            fontWeight: "var(--ent-weight-semibold)",
            letterSpacing: "var(--ent-tracking-body)",
            lineHeight: 1.35,
          }}
        >
          {row.title}
        </div>
        <div
          style={{
            marginTop: "var(--ent-space-1)",
            color: "var(--ent-text-secondary)",
            fontSize: "var(--ent-text-caption)",
            lineHeight: "var(--ent-leading-body)",
            letterSpacing: "var(--ent-tracking-body)",
          }}
        >
          {row.body}
        </div>
        <div
          style={{
            marginTop: "var(--ent-space-2)",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            color: "var(--ent-text-secondary)",
            fontSize: 11.5,
            letterSpacing: "var(--ent-tracking-body)",
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--ent-text-secondary)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {row.age}
        </div>
      </div>
      <button
        type="button"
        aria-label="Row actions"
        style={{
          flexShrink: 0,
          width: 24,
          height: 24,
          borderRadius: "var(--ent-radius-base)",
          background: "transparent",
          border: "none",
          color: "var(--ent-text-secondary)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>
    </div>
  );
}

function ColumbusGlyph() {
  return (
    <span
      aria-hidden
      style={{
        width: 22,
        height: 22,
        borderRadius: "var(--ent-radius-full)",
        background: "var(--ent-text-primary)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#FFFFFF" strokeWidth="1.4" />
        <path d="M12 3l1.4 8.6L12 21l-1.4-9.4L12 3z" fill="#FFFFFF" />
        <path d="M3 12l8.6 1.4L21 12l-9.4-1.4L3 12z" fill="#FFFFFF" />
      </svg>
    </span>
  );
}
