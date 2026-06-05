"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/* Chat panel — Try Elio dropdown entrance feel: opacity + translateY + scale,
   state-driven, todesktop.com's cubic-bezier, 300ms. Anchored bottom-right so
   the popover grows out of the mascot's corner. See MistxNav.tsx ~L594. */
const POPOVER_TRANSITION =
  "opacity 300ms cubic-bezier(0.6,0.6,0,1), transform 300ms cubic-bezier(0.6,0.6,0,1)";
/* Greeting card uses the same snappy curve as the textbox focus-in (see the
   Ask Columbus input below) so the pop-in feels like the input's snap. */
const GREETING_TRANSITION =
  "opacity 140ms cubic-bezier(0.32, 0.72, 0, 1), transform 140ms cubic-bezier(0.32, 0.72, 0, 1)";
const POPOVER_HIDDEN_TRANSFORM = "translateY(8px) scale(0.96)";
const POPOVER_VISIBLE_TRANSFORM = "translateY(0) scale(1)";

/* Palette mirrors the "Ask, Discover, Understand" product demo
   (MapChatPlatform.tsx) so the chat UI reads as the same product:
     • NAVY        — primary ink + user-message bubble fill
     • SURFACE_TINT — assistant bubble fill, idle input fill, X-button
                      hover plate (all the soft greys in one token)
     • HAIRLINE    — input border in the focused state
   CTA_NAVY is the navbar Try-Elio pill colour (--color-cta in globals.css);
   the greeting "?" badge uses it so the helper feels of-a-piece with the
   site's primary CTA. */
const MASCOT_SIZE = 72;
const HAIRLINE = "#E5E7EB";
const NAVY = "#0B1B3A";
const SURFACE_TINT = "#F3F4F6";
const CTA_NAVY = "#0B1342";
const MUTED = "#5A6B7B";
const INK = NAVY;

type Message = { role: "user" | "assistant"; text: string; ts: number };

/* Per-message meta line — relative time. "Just now" up to a minute,
   then "Xm ago" / "Xh ago" / "Xd ago", then locale date past a week. */
function formatRelativeTime(ts: number, now: number): string {
  if (!ts) return "";
  const diffMs = Math.max(0, now - ts);
  const sec = diffMs / 1000;
  if (sec < 60) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;
  try {
    return new Date(ts).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

/* Tick cadence — refresh while the chat is open. 30s gives sub-minute
   precision on the "Just now → 1m ago" handoff without burning render
   budget; closed chats never tick at all. */
const TIME_TICK_MS = 30_000;
type Mode = "closed" | "greeting" | "chat";

export default function BusinessHelper() {
  const [revealed, setRevealed] = useState(false);
  const [mode, setMode] = useState<Mode>("closed");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      role: "assistant",
      text:
        "Hi! Ask me anything about Columbus — what the data layer covers, how it fits your industry, pricing, demos. I'll help you find it.",
      /* ts populated on client after mount so the initial timestamp isn't
         frozen at render time and won't drift between SSR + hydration. */
      ts: 0,
    },
  ]);

  /* Stamp the initial assistant message once we're on the client. */
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) => (m.ts === 0 ? { ...m, ts: Date.now() } : m)),
    );
  }, []);
  const greetedRef = useRef(false);

  /* Reveal once the user scrolls into the white background block. The block
     starts at <section id="problem"> on the business page — we wait until its
     top crosses ~70% of the viewport, then fade the mascot in and (once per
     session) pop the greeting card. */
  useEffect(() => {
    const probe = document.getElementById("problem");
    if (!probe) return;
    const onScroll = () => {
      const r = probe.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.7) {
        setRevealed(true);
        if (!greetedRef.current) {
          greetedRef.current = true;
          /* Pop the greeting every time the mascot appears — reloads count
             as fresh appearances, so the suggestion is offered each visit
             rather than gated by sessionStorage. Flip on the next frame so
             the popover mounts in its hidden state first and the transition
             actually plays. */
          requestAnimationFrame(() => {
            setMode((m) => (m === "closed" ? "greeting" : m));
          });
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMascotClick = useCallback(() => {
    setMode((m) => (m === "chat" ? "closed" : "chat"));
  }, []);

  const dismissGreeting = useCallback(() => {
    setMode("closed");
  }, []);

  const [sendStatus, setSendStatus] = useState<"idle" | "sending">("idle");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const sendMessage = useCallback(() => {
    const text = draft.trim();
    if (!text || sendStatus === "sending") return;
    setSendStatus("sending");
    /* Two-phase cleanup so the field doesn't snap back to its filled state
       the instant the button is "sent":
         t=520ms — clear the draft + post the messages. hasText becomes
                   false, so the send button starts its fade-out. sendStatus
                   stays "sending" though, which keeps the field in its
                   white/border (focused) appearance.
         t=520+260 — send the field back to idle: flip status to "idle" and
                   blur the input. The field transitions from white→filled
                   only now, well after the button has finished animating
                   away. Blurring also fixes the Enter-to-send case where
                   focus would otherwise stay on the input. */
    window.setTimeout(() => {
      const now = Date.now();
      setMessages((prev) => [
        ...prev,
        { role: "user", text, ts: now },
        {
          role: "assistant",
          text:
            "Thanks — passing this to the team. Live answers from our product assistant are coming soon.",
          ts: now,
        },
      ]);
      setDraft("");
      window.setTimeout(() => {
        setSendStatus("idle");
        inputRef.current?.blur();
      }, 260);
    }, 520);
  }, [draft, sendStatus]);

  if (!revealed) return null;

  const greetingOpen = mode === "greeting";
  const chatOpen = mode === "chat";

  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        right: "var(--ent-space-6, 24px)",
        bottom: "var(--ent-space-6, 24px)",
        width: MASCOT_SIZE,
        height: MASCOT_SIZE,
        zIndex: 60,
        fontFamily: "var(--ent-font-sans, var(--font-sans))",
        opacity: revealed ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Greeting popover — anchored to the mascot's left, slight overlap.
          Always mounted; opacity + transform driven by state. Uses the
          snappier textbox-focus curve so the first pop-in feels brisk. */}
      <div
        style={{
          position: "absolute",
          right: MASCOT_SIZE * 0.55,
          bottom: 4,
          opacity: greetingOpen ? 1 : 0,
          transform: greetingOpen
            ? POPOVER_VISIBLE_TRANSFORM
            : POPOVER_HIDDEN_TRANSFORM,
          transformOrigin: "bottom right",
          transition: GREETING_TRANSITION,
          pointerEvents: greetingOpen ? "auto" : "none",
        }}
      >
        <GreetingCard onDismiss={dismissGreeting} onOpen={handleMascotClick} />
      </div>

      {/* Chat panel — anchored above the mascot. Always mounted; same
          state-driven transitions. */}
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: MASCOT_SIZE + 12,
          opacity: chatOpen ? 1 : 0,
          transform: chatOpen
            ? POPOVER_VISIBLE_TRANSFORM
            : POPOVER_HIDDEN_TRANSFORM,
          transformOrigin: "bottom right",
          transition: POPOVER_TRANSITION,
          pointerEvents: chatOpen ? "auto" : "none",
        }}
      >
        <ChatPanel
          messages={messages}
          draft={draft}
          setDraft={setDraft}
          onSend={sendMessage}
          sendStatus={sendStatus}
          inputRef={inputRef}
          isOpen={chatOpen}
          onClose={() => setMode("closed")}
        />
      </div>

      <button
        type="button"
        onClick={handleMascotClick}
        aria-label={chatOpen ? "Close helper" : "Open helper"}
        aria-expanded={chatOpen}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          appearance: "none",
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
          filter: "drop-shadow(0 10px 24px rgba(11, 27, 43, 0.20))",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Image
          src="/business-helper-mascot.png"
          alt="Helper"
          width={MASCOT_SIZE}
          height={MASCOT_SIZE}
          style={{ display: "block" }}
          priority
        />
      </button>
    </div>
  );
}

function GreetingCard({
  onDismiss,
  onOpen,
}: {
  onDismiss: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: "#FFFFFF",
        borderRadius: "var(--ent-radius-lg, 14px)",
        boxShadow:
          "0 16px 40px rgba(11, 27, 43, 0.14), 0 4px 12px rgba(11, 27, 43, 0.08)",
        padding: "12px 22px 12px 22px",
        width: "max-content",
        maxWidth: 260,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: -8,
          left: -8,
          width: 22,
          height: 22,
          borderRadius: "9999px",
          background: CTA_NAVY,
          color: "#FFFFFF",
          fontWeight: 700,
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(11, 27, 43, 0.12)",
        }}
      >
        ?
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss helper greeting"
        style={{
          position: "absolute",
          top: 8,
          right: 10,
          appearance: "none",
          border: "none",
          background: "transparent",
          padding: 4,
          cursor: "pointer",
          color: MUTED,
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        ×
      </button>
      <button
        type="button"
        onClick={onOpen}
        style={{
          appearance: "none",
          border: "none",
          background: "transparent",
          padding: 0,
          textAlign: "left",
          cursor: "pointer",
          color: MUTED,
          fontFamily: "inherit",
          fontSize: 15,
          fontWeight: 400,
          lineHeight: 1.4,
          letterSpacing: "-0.005em",
        }}
      >
        Got a question about Columbus? Ask me.
      </button>
    </div>
  );
}

function ChatPanel({
  messages,
  draft,
  setDraft,
  onSend,
  sendStatus,
  inputRef,
  isOpen,
  onClose,
}: {
  messages: Message[];
  draft: string;
  setDraft: (s: string) => void;
  onSend: () => void;
  sendStatus: "idle" | "sending";
  inputRef: React.RefObject<HTMLInputElement | null>;
  isOpen: boolean;
  onClose: () => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  /* Single shared "now" for every relative-time label in the panel. The
     interval only runs while isOpen — closed chats hold their last value
     and incur zero per-second work. On reopen, we resync immediately so
     labels are correct without waiting for the next tick. */
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!isOpen) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), TIME_TICK_MS);
    return () => window.clearInterval(id);
  }, [isOpen]);

  const hasText = draft.trim().length > 0;
  const showSend = hasText || sendStatus === "sending";
  const [inputFocused, setInputFocused] = useState(false);
  /* During the send animation we keep the field in its "focused" look — even
     after the input has actually blurred — so it doesn't flash back to the
     filled state under the still-animating button. */
  const showFocused = inputFocused || sendStatus === "sending";
  const [closeHover, setCloseHover] = useState(false);

  return (
    <div
      role="dialog"
      aria-label="Helper chat"
      style={{
        background: "#FFFFFF",
        borderRadius: "var(--ent-radius-xl, 18px)",
        boxShadow:
          "0 24px 60px rgba(11, 27, 43, 0.20), 0 6px 20px rgba(11, 27, 43, 0.08)",
        width: 400,
        height: 540,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <header
        style={{
          padding: "20px 20px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: INK,
            letterSpacing: "-0.01em",
          }}
        >
          Ask Columbus about Columbus
        </span>
        <button
          type="button"
          onClick={onClose}
          onMouseEnter={() => setCloseHover(true)}
          onMouseLeave={() => setCloseHover(false)}
          onFocus={() => setCloseHover(true)}
          onBlur={() => setCloseHover(false)}
          aria-label="Close helper"
          style={{
            appearance: "none",
            border: "none",
            /* Hover plate matches the assistant-bubble grey (#F4F4F5) so the
               affordance reads as part of the chat surface, with the same
               10px corner radius the send button uses. */
            background: closeHover ? SURFACE_TINT : "transparent",
            borderRadius: "var(--ent-radius-md, 10px)",
            padding: 0,
            width: 40,
            height: 40,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: MUTED,
            lineHeight: 0,
            transition:
              "background-color 140ms cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        >
          {/* SVG cross instead of the ×/× unicode glyph: those characters
              sit slightly above the baseline in most fonts, so even with
              flex centering they read as visually high. A symmetric SVG
              path centres on geometry, not font metrics. */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
            style={{ display: "block" }}
          >
            <path d="M3 3l8 8" />
            <path d="M11 3l-8 8" />
          </svg>
        </button>
      </header>

      <div
        ref={scrollerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          const time = formatRelativeTime(m.ts, now);
          return (
            <div
              key={i}
              style={{
                alignSelf: isUser ? "flex-end" : "flex-start",
                display: "flex",
                flexDirection: "column",
                alignItems: isUser ? "flex-end" : "flex-start",
                gap: 4,
                maxWidth: "85%",
              }}
            >
              <div
                style={{
                  background: isUser ? INK : SURFACE_TINT,
                  color: isUser ? "#FFFFFF" : INK,
                  padding: "10px 14px",
                  borderRadius: 14,
                  fontSize: 15,
                  lineHeight: 1.45,
                }}
              >
                {m.text}
              </div>
              {/* Meta line — who + when. Small, muted, hugs the bubble's
                  outer edge so it reads as caption rather than UI chrome. */}
              <div
                style={{
                  fontSize: 11,
                  color: MUTED,
                  letterSpacing: "0.01em",
                  padding: "0 4px",
                }}
              >
                {isUser ? "You" : "Columbus"}
                {time ? ` · ${time}` : ""}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ask Columbus input — mirrors the product-screenshot pill
          (MapChatPlatform / AgenticResearchMockup): white field, hairline
          border, navy square send button with white arrow. */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        style={{
          padding: "8px 16px 16px",
        }}
      >
        {/* Two-state field:
            • idle  → filled tint background, no visible border (border is
                       transparent so the layout doesn't shift on focus).
            • focus → flips to white with the same hairline border the
                       product-screenshot inputs use. */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            background: showFocused ? "#FFFFFF" : SURFACE_TINT,
            border: `1px solid ${showFocused ? HAIRLINE : "transparent"}`,
            borderRadius: 14,
            padding: "8px 8px 8px 16px",
            paddingRight: showSend ? 8 : 16,
            /* Asymmetric: focus-in snaps in ~120ms so the click feels
               responsive; the post-send fade back to filled eases at 220ms
               so the field doesn't flash. */
            transition: showFocused
              ? "background-color 120ms cubic-bezier(0.32, 0.72, 0, 1), border-color 120ms cubic-bezier(0.32, 0.72, 0, 1), padding-right 220ms cubic-bezier(0.6,0.6,0,1)"
              : "background-color 220ms cubic-bezier(0.6,0.6,0,1), border-color 220ms cubic-bezier(0.6,0.6,0,1), padding-right 220ms cubic-bezier(0.6,0.6,0,1)",
          }}
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Ask Columbus"
            aria-label="Ask Columbus"
            /* readOnly (not disabled) — disabled would yank focus mid-send,
               causing the field to flash back to its filled state under the
               still-animating button. readOnly blocks typing without
               affecting focus. */
            readOnly={sendStatus === "sending"}
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              color: INK,
              fontSize: 15,
              fontFamily: "inherit",
              padding: "6px 8px 6px 0",
            }}
          />
          {/* Three-state send button:
              • empty input → hidden (opacity 0, scale 0.6, pointer-events none)
              • text typed   → visible navy square with arrow glyph
              • sending      → check glyph + scale pulse, then the input clears
                                and the button collapses back to hidden. */}
          <button
            type="submit"
            aria-label="Send"
            aria-hidden={!showSend}
            tabIndex={showSend ? 0 : -1}
            disabled={!hasText || sendStatus === "sending"}
            style={{
              appearance: "none",
              border: "none",
              width: 38,
              height: 38,
              borderRadius: 10,
              background: NAVY,
              color: "#FFFFFF",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: showSend && sendStatus !== "sending" ? "pointer" : "default",
              flexShrink: 0,
              opacity: showSend ? 1 : 0,
              transform: showSend
                ? sendStatus === "sending"
                  ? "scale(1.08)"
                  : "scale(1)"
                : "scale(0.6)",
              pointerEvents: showSend ? "auto" : "none",
              transition:
                "opacity 200ms cubic-bezier(0.6,0.6,0,1), transform 240ms cubic-bezier(0.22, 1.4, 0.36, 1), background-color 200ms ease",
            }}
          >
            <span
              style={{
                position: "relative",
                width: 16,
                height: 16,
                display: "inline-block",
              }}
            >
              {/* Arrow glyph — fades out as status flips to sending. SVGs
                  need an explicit transform-origin: default differs across
                  browsers (some use 0,0) and was making the icon scale from
                  the top-left instead of the centre. */}
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  transformOrigin: "50% 50%",
                  transformBox: "fill-box",
                  opacity: sendStatus === "sending" ? 0 : 1,
                  transform:
                    sendStatus === "sending" ? "scale(0.6)" : "scale(1)",
                  transition:
                    "opacity 160ms cubic-bezier(0.6,0.6,0,1), transform 200ms cubic-bezier(0.22, 1.4, 0.36, 1)",
                }}
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
              {/* Check glyph — fades in for the "sending" beat. Path is
                  re-centred (bounding box (6,7)→(18,17), midpoint 12,12) so
                  the visual mass scales out from the centre of the button. */}
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  transformOrigin: "50% 50%",
                  transformBox: "fill-box",
                  opacity: sendStatus === "sending" ? 1 : 0,
                  transform:
                    sendStatus === "sending" ? "scale(1)" : "scale(0.6)",
                  transition:
                    "opacity 200ms cubic-bezier(0.6,0.6,0,1) 60ms, transform 240ms cubic-bezier(0.22, 1.4, 0.36, 1) 60ms",
                }}
              >
                <path d="M6 12.5l4 4L18 7.5" />
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
