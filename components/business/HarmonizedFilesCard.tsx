"use client";

/* Mock UI: "Columbus has harmonized your files" card. Pure presentational —
   ONE white rounded card containing the checkmark header, four file rows
   with "Imported" pills, and a chat-input section at the bottom separated
   by a hairline divider. Used inside the "Drop Any File" super-feature row
   as a floating overlay on top of a map backdrop. */

const DEFAULT_FILES = [
  "Portfolio_RentRoll_2011_Master.xlsx",
  "Portfolio_RentRoll_2011_Master.xlsx",
  "Portfolio_RentRoll_2011_Master.xlsx",
  "Portfolio_RentRoll_2011_Master.xlsx",
];

const DEFAULT_FOLLOWUP =
  "now overlay our nearest 2 competitors, and their portfolios. I want to see a easy visual of the comparison";

export type HarmonizedFilesCardProps = {
  files?: string[];
  followUp?: string;
};

export default function HarmonizedFilesCard({
  files = DEFAULT_FILES,
  followUp = DEFAULT_FOLLOWUP,
}: HarmonizedFilesCardProps = {}) {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: "var(--ent-radius-2xl)",
        boxShadow: "var(--ent-shadow-card)",
        color: "var(--ent-text-primary)",
        fontFamily: "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top section — header + file list */}
      <div
        style={{
          padding: "clamp(16px, 2vw, 22px) clamp(16px, 2vw, 24px) clamp(16px, 2vw, 22px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircleHeader />
          <h4
            style={{
              fontSize: "clamp(15px, 1.5vw, 18px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Columbus has harmonized your files
          </h4>
        </div>
        <p
          style={{
            marginTop: 8,
            fontSize: "clamp(12px, 1.1vw, 14px)",
            color: "var(--ent-text-secondary)",
            letterSpacing: "-0.005em",
            lineHeight: 1.5,
          }}
        >
          I&rsquo;ve harmonized the files and displayed them on the map
        </p>

        {/* File list — inside the same card */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "clamp(12px, 1.4vw, 16px) 0 0",
            border: "1px solid #ECECEC",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {files.map((name, i) => (
            <li
              key={`${name}-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "clamp(9px, 1vw, 12px) clamp(10px, 1.2vw, 14px)",
                borderTop: i === 0 ? "none" : "1px solid #ECECEC",
                backgroundColor: "#FFFFFF",
                minWidth: 0,
              }}
            >
              <FileIcon />
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: "clamp(12px, 1.15vw, 14px)",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "var(--ent-text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </span>
              <ImportedPill />
            </li>
          ))}
        </ul>
      </div>

      {/* Hairline divider before chat-input section — keeps everything in
          ONE continuous card while visually separating the input. */}
      <div style={{ height: 1, backgroundColor: "#F0F0F0", margin: "clamp(4px, 0.6vw, 8px) clamp(16px, 2vw, 24px) 0" }} />

      {/* Bottom section — chat input inside the same card */}
      <div
        style={{
          padding: "clamp(14px, 1.6vw, 18px) clamp(16px, 2vw, 24px) clamp(16px, 2vw, 22px)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <p
          style={{
            flex: 1,
            margin: 0,
            fontSize: "clamp(12px, 1.15vw, 14px)",
            lineHeight: 1.5,
            color: "var(--ent-text-primary)",
            letterSpacing: "-0.005em",
          }}
        >
          {followUp}
        </p>
        <button
          type="button"
          aria-label="Stop"
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: "#F2F2F2",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: "#0B1B2B",
              display: "block",
            }}
          />
        </button>
      </div>
    </div>
  );
}

function CheckCircleHeader() {
  /* Pale-blue stroked circle with a matching checkmark inside. Reads as a
     "done" badge for the harmonization status — pale rather than saturated
     so it sits quietly next to the title without competing with it. */
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 28 28"
      fill="none"
      stroke="#A8CFDD"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0 }}
    >
      <circle cx="14" cy="14" r="11" />
      <polyline points="9 14.5 12.5 18 19 11" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0B1B2B"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M4 4a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function ImportedPill() {
  return (
    <span
      style={{
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 10px",
        borderRadius: 9999,
        backgroundColor: "#E4EFE9",
        color: "#2F6B4F",
        fontSize: "clamp(11px, 1vw, 12px)",
        fontWeight: 600,
        letterSpacing: "-0.005em",
      }}
    >
      <svg
        aria-hidden
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2F6B4F"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Imported
    </span>
  );
}
