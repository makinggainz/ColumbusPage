"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";
import { track } from "@/lib/analytics";
import {
  COLUMBUS_SUGGESTIONS,
  INDUSTRY_OPTIONS,
  matchQuestion,
  type Suggestion,
} from "@/lib/columbus-kb";

/* ════ Animation constants ════════════════════════════════════════════ */

const POPOVER_TRANSITION =
  "opacity 300ms cubic-bezier(0.6,0.6,0,1), transform 300ms cubic-bezier(0.6,0.6,0,1)";
const POPOVER_HIDDEN_TRANSFORM = "translateY(8px) scale(0.96)";
const POPOVER_VISIBLE_TRANSFORM = "translateY(0) scale(1)";

const MASCOT_REVEAL_TRANSITION =
  "opacity 360ms cubic-bezier(0.6,0.6,0,1), transform 520ms cubic-bezier(0.22, 1.4, 0.36, 1)";
const MASCOT_REVEAL_MS = 520;
const REVEAL_TRANSITION =
  "opacity 200ms cubic-bezier(0.6,0.6,0,1), transform 240ms cubic-bezier(0.22, 1.4, 0.36, 1)";
const MASCOT_HIDDEN_TRANSFORM = "scale(0.6)";
const MASCOT_VISIBLE_TRANSFORM = "scale(1)";
const GREETING_HIDDEN_TRANSFORM = "scale(0.15)";
const GREETING_VISIBLE_TRANSFORM = "scale(1)";

/* ════ Palette ════════════════════════════════════════════════════════
   Mirrors the "Ask, Discover, Understand" product demo
   (components/business/MapChatPlatform.tsx) plus the navbar CTA navy
   from globals.css (--color-cta). The mini-form's focus/selection states
   use BRAND_ACCENT (--color-accent), matching /contact's form fields so
   it feels of-a-piece with the main contact form. ACCENT is only the
   bright crest of the "Columbus is thinking…" shimmer. */

const MASCOT_SIZE = 72;
const HAIRLINE = "#E5E7EB";
const NAVY = "#0B1B3A";
const SURFACE_TINT = "#F3F4F6";
/* One step darker than SURFACE_TINT — for a control that needs to read as
   raised when it sits ON an already-tinted surface, e.g. the per-chat
   3-dot plate hovering over a hovered (SURFACE_TINT) history row. */
const SURFACE_TINT_DARK = "#E2E5EA";
const CTA_NAVY = "#0B1342";
const ACCENT = "#154ACC";
/* Brand accent — the same light blue (--color-accent in globals.css)
   that paints the chevron-stack arrow on the Try Elio nav CTA. Used on
   the chip strip so the suggestions feel like brand-led calls-to-act
   rather than neutral chat UI. */
const BRAND_ACCENT = "#6094C1";
const MUTED = "#5A6B7B";
const INK = NAVY;

/* ════ Types ══════════════════════════════════════════════════════════ */

type TextMessage = {
  id: string;
  kind: "text";
  role: "user" | "assistant";
  text: string;
  ts: number;
  /* Feedback state, only meaningful on assistant messages that should
     prompt for it:
       undefined → don't show buttons (e.g. initial greeting, post-form
                   thank-you, low-value assistant text).
       null      → buttons shown, user hasn't answered yet.
       "up"|"down" → user already answered; rendered as a collapsed
                   acknowledgement. "down" also spawns a form once. */
  feedback?: "up" | "down" | null;
};
type FormMessage = {
  id: string;
  kind: "form";
  role: "assistant";
  preamble: string;
  prefilledMessage: string;
  submitted: boolean;
  ts: number;
};
type TypingMessage = {
  id: string;
  kind: "typing";
  role: "assistant";
  ts: number;
};
type Message = TextMessage | FormMessage | TypingMessage;

type MiniFormData = {
  email: string;
  name: string;
  industry: string;
  message: string;
};

type Chat = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  /* Suggestions the user has already clicked in this chat — used to
     filter the chip pool so rotation pulls from the unseen set. */
  usedSuggestionIds: string[];
};

type Mode = "closed" | "greeting" | "chat";
type ChatView = "chat" | "history";

/* ════ Helpers ════════════════════════════════════════════════════════ */

let _idCounter = 0;
function nextId(): string {
  _idCounter += 1;
  return `m-${_idCounter}`;
}

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

const INITIAL_GREETING: Omit<TextMessage, "ts" | "id"> = {
  kind: "text",
  role: "assistant",
  text:
    "Hi! Ask me anything about Columbus — what the data layer covers, how it fits your industry, pricing, demos. I'll help you find it.",
  /* No feedback prompt on the boilerplate hello. */
  feedback: undefined,
};

function makeNewChat(): Chat {
  const now = Date.now();
  return {
    id: `c-${now}-${Math.floor(Math.random() * 1e6)}`,
    title: "New chat",
    createdAt: now,
    updatedAt: now,
    messages: [{ ...INITIAL_GREETING, id: nextId(), ts: now }],
    usedSuggestionIds: [],
  };
}

const STORAGE_KEY = "columbus-helper.chats.v1";
const TIME_TICK_MS = 30_000;
/* The user's message lands first and is held on its own for this beat —
   a deliberate "sent ✓" pause — before the thinking indicator appears.
   Short enough to read as immediate, long enough to register the send. */
const THINKING_DELAY_MS = 480;
/* How long the "Columbus is thinking…" shimmer plays before the canned
   response replaces it. Tuned so at least one full colour wave sweeps the
   text, so the thinking state reads as alive rather than a flicker. */
const TYPING_LATENCY_MS = 1300;
/* How long the selected-chip morph plays before the real message flow
   begins: the unpicked chips collapse away, then the chosen chip shrinks
   to the right and recolours into the navy user bubble it's about to
   become. Long enough for that morph to finish before the send hands off
   to the actual user message. */
const CHIP_SELECT_MS = 480;

/* ── AI fallback ──────────────────────────────────────────────────────
   Every typed question is answered by a hosted model (Groq) grounded in our
   knowledge base. The call is server-side (app/api/columbus-chat) so no key
   or model ships to the browser and page load is untouched — it only runs
   when a visitor sends a question. Any miss (model declines, network/timeout,
   no key configured) resolves to null and the chat falls back to the existing
   contact form, never an error. */
const AI_ENDPOINT = "/api/columbus-chat";
/* Sits above the route's own upstream timeout (9s) so the server's
   fallback-to-form fires first; this is the hard client-side ceiling. */
const AI_TIMEOUT_MS = 11000;
/* Floor on how long the "Columbus is thinking…" shimmer stays up on the AI
   path, so a fast model reply doesn't flash the indicator. */
const AI_MIN_THINKING_MS = 700;

type AiTurn = { role: "user" | "assistant"; content: string };

async function fetchColumbusAnswer(turns: AiTurn[]): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), AI_TIMEOUT_MS);
    const res = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: turns }),
      signal: ctrl.signal,
    });
    window.clearTimeout(timer);
    if (!res.ok) return null;
    const data = (await res.json()) as { answer?: unknown };
    const answer = typeof data.answer === "string" ? data.answer.trim() : "";
    return answer.length > 0 ? answer : null;
  } catch {
    /* Network error, abort/timeout, or bad JSON — treat as "no answer" so
       the caller shows the contact form instead of an error. */
    return null;
  }
}

/* The AI master prompt defers pricing and uncovered specifics to "talk to the
   founders". When an answer makes that suggestion, surface the inline contact
   form right after it so the visitor can act on it in one step. Matches
   "founder"/"founders" in any casing. */
function suggestsFounderContact(answer: string): boolean {
  return /\bfounders?\b/i.test(answer);
}

function loadChats(): Chat[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Chat[];
    if (!Array.isArray(parsed)) return [];
    /* Strip any in-flight typing indicators that were persisted by a
       page close mid-response — they'd otherwise hang forever on
       reopen with no scheduled cleanup. */
    const restored = parsed.map((c) => ({
      ...c,
      messages: c.messages.filter((m) => m.kind !== "typing"),
    }));
    /* Advance the id counter past every persisted message id. nextId()'s
       counter resets to 0 on each page load, but restored messages carry
       ids minted in a previous session — without this, the next message a
       returning visitor sends would reuse `m-1`, `m-2`, … and collide with
       restored ids (React key clash → messages duplicated or dropped). */
    let maxId = _idCounter;
    for (const c of restored) {
      for (const m of c.messages) {
        const n = Number(String(m.id).replace(/^m-/, ""));
        if (Number.isFinite(n) && n > maxId) maxId = n;
      }
    }
    _idCounter = maxId;
    return restored;
  } catch {
    return [];
  }
}

function persistChats(chats: Chat[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch {
    /* Quota or private-mode failures are silent — chats live in memory. */
  }
}

/* ════ Main component ════════════════════════════════════════════════ */

export default function BusinessHelper() {
  /* Reveal & greeting state — preserved exactly so the existing
     mascot-spring-in + greeting-emerges-from-mascot motion is intact. */
  const [revealed, setRevealed] = useState(false);
  const [mascotShown, setMascotShown] = useState(false);
  const [mode, setMode] = useState<Mode>("closed");

  /* Multi-chat state. activeChatId is null only briefly during the
     first-load hydration; once chats hydrate we either restore the most
     recent or seed a fresh one. */
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatView, setChatView] = useState<ChatView>("chat");
  const [hydrated, setHydrated] = useState(false);

  /* Draft + send-button + form state — flat at top level so the chat
     header (3-dot menu reset) can clear everything in one shot. */
  const [draft, setDraft] = useState("");
  const [sendStatus, setSendStatus] = useState<"idle" | "sending">("idle");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const greetedRef = useRef(false);

  /* The chip the user just clicked, while its short "selected → filled"
     animation plays before the real message flow begins. Null at rest;
     non-null only for ~CHIP_SELECT_MS. Used to lock out double-clicks
     and to drive the SuggestionChips visual transition. */
  const [pendingChipId, setPendingChipId] = useState<string | null>(null);

  /* Hydrate chats from localStorage on first mount. SSR-safe because
     loadChats() guards on window. */
  useEffect(() => {
    const stored = loadChats();
    if (stored.length > 0) {
      setChats(stored);
      /* Restore the most recently updated chat — feels like resuming. */
      const newest = [...stored].sort((a, b) => b.updatedAt - a.updatedAt)[0];
      setActiveChatId(newest.id);
    } else {
      const seed = makeNewChat();
      setChats([seed]);
      setActiveChatId(seed.id);
    }
    setHydrated(true);
  }, []);

  /* Persist on every change after hydration. Throwing during persist is
     swallowed so private-mode tabs still work, just without persistence. */
  useEffect(() => {
    if (!hydrated) return;
    persistChats(chats);
  }, [chats, hydrated]);

  /* Mascot reveal animation — flips on next frame after revealed becomes
     true so the entrance transition plays. */
  useEffect(() => {
    if (!revealed) return;
    const id = requestAnimationFrame(() => setMascotShown(true));
    return () => cancelAnimationFrame(id);
  }, [revealed]);

  /* Scroll-watcher for the white block — same gate as before. */
  useEffect(() => {
    const probe = document.getElementById("problem");
    if (!probe) return;
    const onScroll = () => {
      const r = probe.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.7) {
        setRevealed(true);
        if (!greetedRef.current) {
          greetedRef.current = true;
          window.setTimeout(() => {
            setMode((m) => (m === "closed" ? "greeting" : m));
          }, MASCOT_REVEAL_MS);
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* While the greeting callout is showing, auto-minimize it when either:
       (a) 5s pass without the visitor opening it, or
       (b) the visitor scrolls far enough that the left-side feature index
           (BusinessFeatureIndex — the fixed nav[aria-label="Feature index"])
           appears, so the two don't compete for the visitor's attention.
     The index toggles its own visibility via aria-hidden on a React render,
     which lands a tick after the scroll event — so we watch that attribute
     with a MutationObserver rather than polling on scroll (which would read
     the stale value and miss the flip). Minimizing only closes the callout;
     the mascot stays put to click. */
  useEffect(() => {
    if (mode !== "greeting") return;
    const minimize = () => setMode((m) => (m === "greeting" ? "closed" : m));
    const timer = window.setTimeout(minimize, 5_000);
    const index = document.querySelector('nav[aria-label="Feature index"]');
    const indexShowing = () => index?.getAttribute("aria-hidden") === "false";
    /* Already past the threshold when the callout appears → minimize now. */
    if (indexShowing()) minimize();
    let observer: MutationObserver | null = null;
    if (index) {
      observer = new MutationObserver(() => {
        if (indexShowing()) minimize();
      });
      observer.observe(index, {
        attributes: true,
        attributeFilter: ["aria-hidden"],
      });
    }
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [mode]);

  /* ── Derived: the active chat and its message list. ── */
  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) ?? null,
    [chats, activeChatId],
  );
  const messages: Message[] = activeChat?.messages ?? [];
  /* True from the moment the visitor commits a message until the assistant
     replies — covers both the brief "message sent" beat (last message is
     the user's, thinking indicator not posted yet) AND the thinking beat
     (typing indicator present). SuggestionChips uses this to keep the strip
     collapsed across the whole send→think→answer cycle, then re-reveal it
     once the assistant's response lands. */
  const isResponding = useMemo(() => {
    if (messages.some((m) => m.kind === "typing")) return true;
    const last = messages[messages.length - 1];
    return !!last && last.kind === "text" && last.role === "user";
  }, [messages]);

  /* ── Chat mutation helpers. All mutations go through here so the
       updatedAt stamp + persistence stay in sync. ── */
  const updateActiveChat = useCallback(
    (fn: (c: Chat) => Chat) => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId ? { ...fn(c), updatedAt: Date.now() } : c,
        ),
      );
    },
    [activeChatId],
  );

  const titleFor = useCallback((c: Chat, candidate: string): string => {
    if (c.title !== "New chat") return c.title;
    const trimmed = candidate.trim();
    if (!trimmed) return c.title;
    return trimmed.length > 38 ? trimmed.slice(0, 38) + "…" : trimmed;
  }, []);

  /* ── Sending: chip click flow.
       Adds user bubble + typing indicator, then swaps the typing
       indicator for the canned response after TYPING_LATENCY_MS. The
       clicked suggestion is recorded so SuggestionChips rotates a
       fresh one into its slot. ── */
  const onSuggestionClick = useCallback(
    (s: Suggestion) => {
      if (!activeChatId) return;
      /* Debounce: ignore further clicks while one chip is already in its
         selected-pending animation. */
      if (pendingChipId) return;
      setPendingChipId(s.id);
      /* Wait CHIP_SELECT_MS so the chip strip can play its "siblings
         collapse, clicked chip morphs to filled-navy" beat before the
         normal user-msg + typing-indicator + response flow kicks off. */
      window.setTimeout(() => {
        setPendingChipId(null);
        const now = Date.now();
        const userMsg: TextMessage = {
          id: nextId(),
          kind: "text",
          role: "user",
          text: s.label,
          ts: now,
        };
        /* Phase 1 — the user's message lands on its own. Held for
           THINKING_DELAY_MS so the send registers visually before the
           assistant starts thinking. */
        updateActiveChat((c) => ({
          ...c,
          title: titleFor(c, s.label),
          messages: [...c.messages, userMsg],
          usedSuggestionIds: c.usedSuggestionIds.includes(s.id)
            ? c.usedSuggestionIds
            : [...c.usedSuggestionIds, s.id],
        }));
        /* Phase 2 — the "Columbus is thinking…" shimmer appears. */
        const typingMsg: TypingMessage = {
          id: nextId(),
          kind: "typing",
          role: "assistant",
          ts: Date.now(),
        };
        window.setTimeout(() => {
          updateActiveChat((c) => ({
            ...c,
            messages: [...c.messages, typingMsg],
          }));
          /* Phase 3 — the thinking indicator gives way to the answer. */
          window.setTimeout(() => {
            updateActiveChat((c) => ({
              ...c,
              messages: [
                ...c.messages.filter((m) => m.id !== typingMsg.id),
                {
                  id: nextId(),
                  kind: "text",
                  role: "assistant",
                  text: s.response,
                  ts: Date.now(),
                  feedback: null,
                },
              ],
            }));
          }, TYPING_LATENCY_MS);
        }, THINKING_DELAY_MS);
      }, CHIP_SELECT_MS);
    },
    [activeChatId, pendingChipId, updateActiveChat, titleFor],
  );

  /* ── Sending: free-text submission.
       1. Push the user's message on its own (smooth entrance) — held for
          THINKING_DELAY_MS so the send registers as "sent".
       2. Post the "Columbus is thinking…" shimmer.
       3. Ask the AI (server-side, grounded in our KB + curated Q&A) — this
          replaced the old keyword matcher. A real answer is shown with a
          feedback prompt; on ANY miss (model declines, error, timeout, no
          key) we fall through to the existing flow — a short acknowledgement
          if a form is already open, otherwise the inline Columbus-Pro form.
          Never an error message. ── */
  const sendMessage = useCallback(() => {
    const text = draft.trim();
    if (!text || sendStatus === "sending" || !activeChatId) return;
    posthog.capture("business_helper_message_sent", { chat_id: activeChatId });
    setSendStatus("sending");
    const now = Date.now();
    const userMsg: TextMessage = {
      id: nextId(),
      kind: "text",
      role: "user",
      text,
      ts: now,
    };
    const typingMsg: TypingMessage = {
      id: nextId(),
      kind: "typing",
      role: "assistant",
      ts: now,
    };
    /* Prior conversation (text turns only), captured before the new message
       is pushed, so the AI fallback gets clean follow-up context with the
       new question appended. */
    const aiTurns: AiTurn[] = [
      ...(activeChat?.messages ?? [])
        .filter((m): m is TextMessage => m.kind === "text")
        .slice(-8)
        .map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("assistant" as const),
          content: m.text,
        })),
      { role: "user", content: text },
    ];
    /* Two-phase cleanup of the input field (same as before) — keep the
       textbox in its focused/white state until the send button has
       finished fading away, then blur. */
    window.setTimeout(() => {
      updateActiveChat((c) => ({
        ...c,
        title: titleFor(c, text),
        messages: [...c.messages, userMsg],
      }));
      setDraft("");
      window.setTimeout(() => {
        setSendStatus("idle");
        inputRef.current?.blur();
      }, 260);
      /* Hold the user's message on its own for a beat, then post the
         "Columbus is thinking…" shimmer, then resolve to the answer. */
      window.setTimeout(() => {
        updateActiveChat((c) => ({
          ...c,
          messages: [...c.messages, typingMsg],
        }));

        /* Answer chain: AI (primary) → keyword match (secondary) → contact
           form (last resort). The AI answers every typed question from our KB
           + curated Q&A (server-side). Keep the shimmer up while we ask it
           (with a floor so it doesn't flash). If the AI returns no answer —
           because it declined OR was unavailable (rate-limited, error,
           timeout, no key) — we try the keyword matcher, then fall back to the
           form. Never an error. */
        void (async () => {
          const [answer] = await Promise.all([
            fetchColumbusAnswer(aiTurns),
            new Promise((resolve) =>
              window.setTimeout(resolve, AI_MIN_THINKING_MS),
            ),
          ]);
          updateActiveChat((c) => {
            const withoutTyping = c.messages.filter(
              (m) => m.id !== typingMsg.id,
            );
            if (answer) {
              const next: Message[] = [
                ...withoutTyping,
                {
                  id: nextId(),
                  kind: "text",
                  role: "assistant",
                  text: answer,
                  ts: Date.now(),
                  feedback: null,
                },
              ];
              /* If the answer suggests talking to the founders, surface the
                 contact form right below it (once per chat) so they can act
                 on it immediately. */
              if (
                suggestsFounderContact(answer) &&
                !withoutTyping.some((m) => m.kind === "form")
              ) {
                next.push({
                  id: nextId(),
                  kind: "form",
                  role: "assistant",
                  preamble:
                    "Share a few details below and our founders will get back to you.",
                  prefilledMessage: text,
                  submitted: false,
                  ts: Date.now(),
                });
              }
              return { ...c, messages: next };
            }
            /* Secondary fallback: the keyword matcher. If it recognizes the
               question, answer from the curated canned response before we fall
               back to the contact form. */
            const fallback = matchQuestion(text);
            if (fallback) {
              return {
                ...c,
                messages: [
                  ...withoutTyping,
                  {
                    id: nextId(),
                    kind: "text",
                    role: "assistant",
                    text: fallback.response,
                    ts: Date.now(),
                    feedback: null,
                  },
                ],
                usedSuggestionIds: c.usedSuggestionIds.includes(fallback.id)
                  ? c.usedSuggestionIds
                  : [...c.usedSuggestionIds, fallback.id],
              };
            }
            const hasForm = withoutTyping.some((m) => m.kind === "form");
            if (hasForm) {
              return {
                ...c,
                messages: [
                  ...withoutTyping,
                  {
                    id: nextId(),
                    kind: "text",
                    role: "assistant",
                    text:
                      "Got it — I've added that to your inquiry. Our team will follow up alongside the details you shared.",
                    ts: Date.now(),
                    feedback: undefined,
                  },
                ],
              };
            }
            return {
              ...c,
              messages: [
                ...withoutTyping,
                {
                  id: nextId(),
                  kind: "form",
                  role: "assistant",
                  preamble:
                    "That's a great one for our team. Drop a few details and we'll get back to you with a real answer — your question is pre-filled below.",
                  prefilledMessage: text,
                  submitted: false,
                  ts: Date.now(),
                },
              ],
            };
          });
        })();
      }, THINKING_DELAY_MS);
    }, 520);
  }, [draft, sendStatus, activeChatId, activeChat, updateActiveChat, titleFor]);

  /* ── Form submission. Fires a HubSpot submission in the background
       then marks the inline form done and posts a confirmation bubble. ── */
  const onMiniFormSubmit = useCallback((_data: MiniFormData) => {
    track.contactSubmitted("business", { industry: _data.industry });
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tab: "columbus-pro",
        email: _data.email,
        firstName: _data.name,
        message: _data.message,
        industry: _data.industry,
        pageUri: typeof window !== "undefined" ? window.location.href : "",
        pageName: "Business Helper Chat",
      }),
    }).catch(console.error);

    updateActiveChat((c) => {
      const updated = c.messages.map((m): Message =>
        m.kind === "form" && !m.submitted ? { ...m, submitted: true } : m,
      );
      updated.push({
        id: nextId(),
        kind: "text",
        role: "assistant",
        text:
          "Thanks — we've got your details. Someone from our team will be in touch within one business day.",
        ts: Date.now(),
        feedback: undefined,
      });
      return { ...c, messages: updated };
    });
  }, [updateActiveChat]);

  /* ── Thumbs feedback on an assistant message.
       👍 → mark "up", no further action.
       👎 → mark "down", spawn an inline Columbus-Pro form pre-filled
            with the prior user question. Only spawn once per session
            — if a form already exists, just acknowledge. ── */
  const onFeedback = useCallback(
    (messageId: string, value: "up" | "down") => {
      updateActiveChat((c) => {
        const idx = c.messages.findIndex((m) => m.id === messageId);
        if (idx < 0) return c;
        const updated = c.messages.map((m): Message =>
          m.id === messageId && m.kind === "text"
            ? { ...m, feedback: value }
            : m,
        );
        if (value === "up") return { ...c, messages: updated };
        /* Find the user question that preceded this assistant answer so
           the spawned form can pre-fill it. */
        let priorUser = "";
        for (let i = idx - 1; i >= 0; i--) {
          const m = c.messages[i];
          if (m.kind === "text" && m.role === "user") {
            priorUser = m.text;
            break;
          }
        }
        const hasForm = updated.some((m) => m.kind === "form");
        if (hasForm) {
          updated.push({
            id: nextId(),
            kind: "text",
            role: "assistant",
            text:
              "Sorry that missed the mark — I've added your question to the inquiry above so the team can address it.",
            ts: Date.now(),
            feedback: undefined,
          });
        } else {
          updated.push({
            id: nextId(),
            kind: "form",
            role: "assistant",
            preamble:
              "Sorry that missed. Let's get a real answer from our team — drop a few details and we'll follow up.",
            prefilledMessage: priorUser,
            submitted: false,
            ts: Date.now(),
          });
        }
        return { ...c, messages: updated };
      });
    },
    [updateActiveChat],
  );

  /* ── Chat-history actions ── */
  const startNewChat = useCallback(() => {
    const c = makeNewChat();
    setChats((prev) => [...prev, c]);
    setActiveChatId(c.id);
    setChatView("chat");
  }, []);

  const selectChat = useCallback((id: string) => {
    setActiveChatId(id);
    setChatView("chat");
  }, []);

  const deleteChat = useCallback((id: string) => {
    /* Remove the chat. If we just dropped the last one, seed a fresh
       chat so the visitor never lands in an empty state. The
       active-chat-fallback effect below handles re-pointing
       activeChatId to a valid id when needed. */
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== id);
      return next.length === 0 ? [makeNewChat()] : next;
    });
  }, []);

  /* Keep activeChatId pointing at a real chat after deletions. Runs
     after the chats array has been updated; switches to the most-
     recently-updated remaining chat when the active one disappears. */
  useEffect(() => {
    if (!hydrated || chats.length === 0) return;
    if (chats.some((c) => c.id === activeChatId)) return;
    const newest = [...chats].sort((a, b) => b.updatedAt - a.updatedAt)[0];
    setActiveChatId(newest.id);
  }, [chats, activeChatId, hydrated]);

  const resetActiveChat = useCallback(() => {
    updateActiveChat((c) => {
      const seed = makeNewChat();
      return {
        ...c,
        title: "New chat",
        messages: seed.messages,
        usedSuggestionIds: [],
      };
    });
  }, [updateActiveChat]);

  /* ── UI handlers ── */
  const handleMascotClick = useCallback(() => {
    setMode((m) => {
      const next = m === "chat" ? "closed" : "chat";
      if (next === "chat") posthog.capture("business_helper_opened");
      return next;
    });
  }, []);
  const dismissGreeting = useCallback(() => setMode("closed"), []);
  const goBackToHistory = useCallback(() => setChatView("history"), []);
  const closeChat = useCallback(() => setMode("closed"), []);

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
      }}
    >
      <div
        style={{
          position: "absolute",
          /* Its own popup sitting to the LEFT of the globe and vertically
             centred on it; a tail off the bubble's RIGHT edge points across
             at the earth. Left of the globe with a small gap so the tail
             bridges it. Springs out of the globe via the right-centre
             origin; translateY(-50%) keeps it centred at every scale frame. */
          right: MASCOT_SIZE + 10,
          top: "50%",
          opacity: greetingOpen ? 1 : 0,
          transform: greetingOpen
            ? `translateY(-50%) ${GREETING_VISIBLE_TRANSFORM}`
            : `translateY(-50%) ${GREETING_HIDDEN_TRANSFORM}`,
          transformOrigin: "center right",
          transition: REVEAL_TRANSITION,
          pointerEvents: greetingOpen ? "auto" : "none",
        }}
      >
        <GreetingCard onDismiss={dismissGreeting} onOpen={handleMascotClick} />
      </div>

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
          isOpen={chatOpen}
          chats={chats}
          activeChat={activeChat}
          messages={messages}
          view={chatView}
          draft={draft}
          setDraft={setDraft}
          onSend={sendMessage}
          sendStatus={sendStatus}
          inputRef={inputRef}
          onClose={closeChat}
          onBack={goBackToHistory}
          onSuggestionClick={onSuggestionClick}
          onMiniFormSubmit={onMiniFormSubmit}
          onFeedback={onFeedback}
          onResetChat={resetActiveChat}
          onNewChat={startNewChat}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          onOpenChatView={() => setChatView("chat")}
          pendingChipId={pendingChipId}
          isResponding={isResponding}
        />
      </div>

      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: MASCOT_SIZE,
          height: MASCOT_SIZE,
          opacity: mascotShown ? 1 : 0,
          transform: mascotShown
            ? MASCOT_VISIBLE_TRANSFORM
            : MASCOT_HIDDEN_TRANSFORM,
          transformOrigin: "center",
          transition: MASCOT_REVEAL_TRANSITION,
        }}
      >
        <button
          type="button"
          onClick={handleMascotClick}
          aria-label={chatOpen ? "Close helper" : "Open helper"}
          aria-expanded={chatOpen}
          style={{
            appearance: "none",
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
            filter: "drop-shadow(0 10px 24px rgba(11, 27, 43, 0.20))",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.06)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Image
            src="/BusinessPgMedia/business-helper-mascot.png"
            alt="Helper"
            width={MASCOT_SIZE}
            height={MASCOT_SIZE}
            style={{ display: "block" }}
            priority
          />
        </button>
      </div>
    </div>
  );
}

/* ════ GreetingCard ═══════════════════════════════════════════════════ */

function GreetingCard({
  onDismiss,
  onOpen,
}: {
  onDismiss: () => void;
  onOpen: () => void;
}) {
  /* Hovering the callout morphs the corner "?" badge into an X close
     button (the badge IS the close affordance — there's no separate ×).
     The "?" and the cross are cross-faded so it reads as one glyph
     transforming rather than two icons swapping. */
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        background: "#FFFFFF",
        /* Generous rounding to match the reference speech-bubble shape. */
        borderRadius: 20,
        boxShadow:
          "0 16px 40px rgba(11, 27, 43, 0.14), 0 4px 12px rgba(11, 27, 43, 0.08)",
        /* Snug, natural height — just enough to wrap the text with a little
           breathing room. */
        padding: "12px 18px",
        width: "max-content",
        maxWidth: 220,
      }}
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label={hover ? "Close" : "Dismiss helper greeting"}
        style={{
          position: "absolute",
          top: -8,
          left: -8,
          width: 22,
          height: 22,
          borderRadius: "9999px",
          background: CTA_NAVY,
          color: "#FFFFFF",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(11, 27, 43, 0.12)",
          transform: hover ? "scale(1.1)" : "scale(1)",
          transition: "transform 200ms cubic-bezier(0.22, 1.4, 0.36, 1)",
        }}
      >
        {/* Cross-faded glyphs — "?" at rest, an X cross on hover. */}
        <span
          aria-hidden
          style={{
            position: "relative",
            width: 13,
            height: 13,
            display: "inline-block",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 13,
              lineHeight: 1,
              opacity: hover ? 0 : 1,
              transform: hover ? "scale(0.6)" : "scale(1)",
              transition:
                "opacity 160ms ease, transform 200ms cubic-bezier(0.22, 1.4, 0.36, 1)",
            }}
          >
            ?
          </span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              position: "absolute",
              inset: 0,
              opacity: hover ? 1 : 0,
              transform: hover ? "scale(1)" : "scale(0.6)",
              transformOrigin: "50% 50%",
              transition:
                "opacity 160ms ease, transform 200ms cubic-bezier(0.22, 1.4, 0.36, 1)",
            }}
          >
            <path d="M4 4l6 6" />
            <path d="M10 4l-6 6" />
          </svg>
        </span>
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
      {/* Speech-bubble tail — a curved teardrop on the bubble's RIGHT edge,
          vertically centred, tapering to a soft point that reaches across at
          the globe (iMessage-style, not a flat triangle). Its left edge
          overlaps a few px into the white body so the seam is invisible;
          the drop-shadow lets it cast the same soft shadow as the bubble. */}
      <svg
        aria-hidden
        width="22"
        height="22"
        viewBox="0 0 22 22"
        style={{
          position: "absolute",
          top: "50%",
          right: -18,
          transform: "translateY(-50%)",
          display: "block",
          filter: "drop-shadow(0 5px 5px rgba(11, 27, 43, 0.06))",
        }}
      >
        <path d="M0 2 C8 2 16 4 21 11 C16 18 8 20 0 20 Z" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

/* ════ ChatPanel ══════════════════════════════════════════════════════ */

type ChatPanelProps = {
  isOpen: boolean;
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  view: ChatView;
  draft: string;
  setDraft: (s: string) => void;
  onSend: () => void;
  sendStatus: "idle" | "sending";
  inputRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onBack: () => void;
  onSuggestionClick: (s: Suggestion) => void;
  onMiniFormSubmit: (data: MiniFormData) => void;
  onFeedback: (messageId: string, value: "up" | "down") => void;
  onResetChat: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onOpenChatView: () => void;
  pendingChipId: string | null;
  isResponding: boolean;
};

function ChatPanel(props: ChatPanelProps) {
  const {
    isOpen,
    chats,
    messages,
    view,
    draft,
    setDraft,
    onSend,
    sendStatus,
    inputRef,
    onClose,
    onBack,
    onSuggestionClick,
    onMiniFormSubmit,
    onFeedback,
    onResetChat,
    onNewChat,
    onSelectChat,
    onDeleteChat,
  } = props;

  const scrollerRef = useRef<HTMLDivElement>(null);
  /* Latest-at-top scroll: position the newest message so its TOP edge is
     near the top of the scroller (with a small peek of the previous
     message above it). Custom rAF-driven smoothing — browser-default
     `behavior: "smooth"` varies wildly across engines and tends to feel
     snappy. A 620ms cubic ease-out gives the calm, glide-into-place
     feel the chat asks for. */
  /* Auto-scroll is driven by the last *real* message (text or form), never
     the typing indicator. The "Columbus is thinking…" bubble should fade in
     where it sits — only the user's send and Columbus's actual answer
     reposition the conversation. (The thinking bubble lands just below the
     already-positioned last message, so it stays in view without a jump.) */
  let lastMessageId: string | null = null;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].kind !== "typing") {
      lastMessageId = messages[i].id;
      break;
    }
  }
  const scrollAnimRef = useRef<number | null>(null);
  useEffect(() => {
    if (view !== "chat") return;
    const scroller = scrollerRef.current;
    if (!scroller || !lastMessageId) return;
    /* Take the LAST element carrying this id. querySelector returns the
       *first* match, so a stray duplicate id would let it lock onto an
       earlier message and glide up to it — exactly the "scrolled back to
       previous messages" glitch. The latest occurrence is always the real
       newest message. */
    const matches = scroller.querySelectorAll(
      `[data-message-id="${lastMessageId}"]`,
    );
    const el = matches[matches.length - 1] as HTMLElement | undefined;
    if (!el) return;

    const PEEK = 28; // px of prior message left visible above the new one
    /* Desired scrollTop to sit the newest message's top at PEEK — recomputed
       live each frame rather than locked in once. The suggestion strip
       collapses/expands (≈320ms) and the message plays its entrance (≈300ms)
       *after* this effect fires, both finishing inside the 620ms glide. A
       one-shot target measured mid-transition gets clamped by the browser as
       the content height shifts and can strand the view on the previous
       message. Reading offsetTop (scroll-independent) keeps the aim stable
       while we animate, and clamping to the *live* max means shrinking
       content can never park us above the latest. */
    const desired = () => {
      const top =
        el.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop;
      const max = scroller.scrollHeight - scroller.clientHeight;
      return Math.max(0, Math.min(top - PEEK, max));
    };

    const start = scroller.scrollTop;
    /* Already in place (within a px) — skip to avoid jitter on near-zero
       deltas (e.g. the typing → answer swap). */
    if (Math.abs(desired() - start) < 1) return;

    const duration = 620;
    const t0 = performance.now();
    if (scrollAnimRef.current !== null) {
      cancelAnimationFrame(scrollAnimRef.current);
    }
    const step = (nowTs: number) => {
      const t = Math.min(1, (nowTs - t0) / duration);
      /* Cubic ease-out: snaps in then settles. Reads as "calm". */
      const eased = 1 - Math.pow(1 - t, 3);
      /* Re-read the target each frame so the final frames land on the
         settled layout, not the transient one measured at t0. */
      scroller.scrollTop = start + (desired() - start) * eased;
      if (t < 1) {
        scrollAnimRef.current = requestAnimationFrame(step);
      } else {
        scrollAnimRef.current = null;
      }
    };
    scrollAnimRef.current = requestAnimationFrame(step);
    return () => {
      if (scrollAnimRef.current !== null) {
        cancelAnimationFrame(scrollAnimRef.current);
        scrollAnimRef.current = null;
      }
    };
  }, [lastMessageId, view]);

  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!isOpen) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), TIME_TICK_MS);
    return () => window.clearInterval(id);
  }, [isOpen]);

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
        /* Notably taller than the previous 540px — capped against the
           viewport so the panel never bleeds past the top edge on short
           windows. ~108px reserved for the mascot stack + gap + the
           24px bottom inset, plus a 20px breathing margin at the top. */
        height: "min(680px, calc(100dvh - 128px))",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Scoped CSS — entry animations + typing-dot bounce. Kept inline
          so the component is self-contained. */}
      <style>{CHAT_KEYFRAMES}</style>

      <ChatHeader
        view={view}
        onBack={onBack}
        onClose={onClose}
        onResetChat={onResetChat}
      />

      {view === "history" ? (
        <ChatHistoryView
          chats={chats}
          now={now}
          onNewChat={onNewChat}
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
        />
      ) : (
        <>
          <div
            ref={scrollerRef}
            style={{
              flex: 1,
              overflowY: "auto",
              /* The chat only ever scrolls vertically — clip any horizontal
                 overflow so a long word / wide child can never produce a
                 left-right scrollbar. */
              overflowX: "hidden",
              minWidth: 0,
              padding: "8px 16px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.map((m) => (
              <MessageItem
                key={m.id}
                message={m}
                now={now}
                onMiniFormSubmit={onMiniFormSubmit}
                onFeedback={onFeedback}
              />
            ))}
            {/* Suggestion chips — only when conversation hasn't escalated
                to a form. They rotate as the user clicks them. */}
            {!messages.some((m) => m.kind === "form") && (
              <SuggestionChips
                usedIds={props.activeChat?.usedSuggestionIds ?? []}
                onPick={onSuggestionClick}
                pendingChipId={props.pendingChipId}
                isResponding={props.isResponding}
              />
            )}
            {/* Tail spacer — guarantees there's always enough scrollable
                runway below the message list so the auto-scroll can put
                the newest message at the top of the visible area, even
                in short conversations. Without this, when total content
                is shorter than the scroller, scrollTop max is 0 and the
                latest message can't be pushed up. */}
            <ScrollTailSpacer scrollerRef={scrollerRef} />
          </div>

          <ChatInput
            draft={draft}
            setDraft={setDraft}
            onSend={onSend}
            sendStatus={sendStatus}
            inputRef={inputRef}
          />
        </>
      )}
    </div>
  );
}

/* ════ ChatHeader (with 3-dot menu) ═══════════════════════════════════ */

function ChatHeader({
  view,
  onBack,
  onClose,
  onResetChat,
}: {
  view: ChatView;
  onBack: () => void;
  onClose: () => void;
  onResetChat: () => void;
}) {
  const [closeHover, setCloseHover] = useState(false);
  const [backHover, setBackHover] = useState(false);
  const [menuHover, setMenuHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Reset every header hover state on view change. Without this, clicking
     the back button leaves backHover=true (because mouseleave never fires
     — the button unmounts). When the user later comes back to the chat
     view, the back button re-renders with a stale hover fill. Resetting
     on view change also covers the close + menu buttons. */
  useEffect(() => {
    setBackHover(false);
    setCloseHover(false);
    setMenuHover(false);
    setMenuOpen(false);
  }, [view]);

  /* Close the dropdown on any outside click — guards against the menu
     getting stranded if the user clicks somewhere else inside the chat. */
  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = () => setMenuOpen(false);
    window.addEventListener("mousedown", onDocClick);
    return () => window.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const iconBtnStyle = (hover: boolean): React.CSSProperties => ({
    appearance: "none",
    border: "none",
    background: hover ? SURFACE_TINT : "transparent",
    borderRadius: "var(--ent-radius-md, 10px)",
    padding: 0,
    width: 36,
    height: 36,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: MUTED,
    lineHeight: 0,
    transition: "background-color 180ms cubic-bezier(0.32, 0.72, 0, 1)",
    flexShrink: 0,
  });

  return (
    <header
      style={{
        padding: "16px 14px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          minWidth: 0,
        }}
      >
        {view === "chat" && (
          <button
            type="button"
            onClick={onBack}
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
            onFocus={() => setBackHover(true)}
            onBlur={() => setBackHover(false)}
            aria-label="Back to chat history"
            style={iconBtnStyle(backHover)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              style={{ display: "block" }}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: INK,
            letterSpacing: "-0.01em",
            display: "inline-flex",
            alignItems: "center",
            gap: 0,
          }}
        >
          {view === "history" ? (
            "Your chats"
          ) : (
            <>
              Ask about
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logobueno.png"
                alt=""
                width={22}
                height={22}
                decoding="async"
                style={{
                  objectFit: "contain",
                  marginLeft: 6,
                  marginRight: 2,
                  filter:
                    "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)",
                }}
              />
              Columbus
            </>
          )}
        </span>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          position: "relative",
        }}
      >
        {view === "chat" && (
          <>
            <button
              type="button"
              /* Stop mousedown here so the window outside-click listener
                 (which fires on mousedown, before click) doesn't pre-close
                 the menu — otherwise clicking the dots while open would
                 close-then-reopen and the toggle could never shut it. */
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              onMouseEnter={() => setMenuHover(true)}
              onMouseLeave={() => setMenuHover(false)}
              onFocus={() => setMenuHover(true)}
              onBlur={() => setMenuHover(false)}
              aria-label="Chat options"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              style={iconBtnStyle(menuHover || menuOpen)}
            >
              {/* Vertical 3-dot SVG. Hand-placed circles for crisp render
                  at small sizes vs. relying on font glyph metrics. */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="currentColor"
                aria-hidden
                style={{ display: "block" }}
              >
                <circle cx="7" cy="2.5" r="1.4" />
                <circle cx="7" cy="7" r="1.4" />
                <circle cx="7" cy="11.5" r="1.4" />
              </svg>
            </button>
            {menuOpen && (
              <div
                role="menu"
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 40,
                  background: "#FFFFFF",
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 12,
                  boxShadow:
                    "0 16px 40px rgba(11, 27, 43, 0.14), 0 4px 12px rgba(11, 27, 43, 0.08)",
                  minWidth: 160,
                  padding: 4,
                  zIndex: 5,
                  animation:
                    "ch-popover 190ms cubic-bezier(0.32, 0.72, 0, 1) both",
                }}
              >
                <MenuItem
                  label="Reset chat"
                  onClick={() => {
                    setMenuOpen(false);
                    onResetChat();
                  }}
                  iconPath="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"
                />
              </div>
            )}
          </>
        )}
        <button
          type="button"
          onClick={onClose}
          onMouseEnter={() => setCloseHover(true)}
          onMouseLeave={() => setCloseHover(false)}
          onFocus={() => setCloseHover(true)}
          onBlur={() => setCloseHover(false)}
          aria-label="Close helper"
          style={iconBtnStyle(closeHover)}
        >
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
      </div>
    </header>
  );
}

function MenuItem({
  label,
  onClick,
  iconPath,
}: {
  label: string;
  onClick: () => void;
  iconPath: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "8px 10px",
        background: hover ? SURFACE_TINT : "transparent",
        border: "none",
        borderRadius: 8,
        color: INK,
        fontSize: 14,
        fontFamily: "inherit",
        cursor: "pointer",
        textAlign: "left",
        transition: "background-color 160ms ease",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        style={{ flexShrink: 0 }}
      >
        <path d={iconPath} />
      </svg>
      <span>{label}</span>
    </button>
  );
}

/* ════ ChatHistoryView ═══════════════════════════════════════════════ */

function ChatHistoryView({
  chats,
  now,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: {
  chats: Chat[];
  now: number;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}) {
  const ordered = useMemo(
    () => [...chats].sort((a, b) => b.updatedAt - a.updatedAt),
    [chats],
  );

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "8px 14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        /* Gentle fade-up on entrance so switching from a chat to the
           history list reads as a soft transition rather than a hard cut.
           (The chat view gets its own entrance for free — its messages
           replay ch-msg-in when the view remounts.) */
        animation: "ch-view-in 260ms cubic-bezier(0.22, 1, 0.36, 1) both",
      }}
    >
      <button
        type="button"
        onClick={onNewChat}
        style={{
          appearance: "none",
          border: `1px solid ${HAIRLINE}`,
          background: "#FFFFFF",
          padding: "12px 14px",
          borderRadius: 12,
          color: INK,
          fontSize: 14,
          fontFamily: "inherit",
          fontWeight: 600,
          letterSpacing: "-0.005em",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 10,
          transition: "background-color 180ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = SURFACE_TINT)
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
      >
        <span
          aria-hidden
          style={{
            width: 22,
            height: 22,
            borderRadius: "9999px",
            background: CTA_NAVY,
            color: "#FFFFFF",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        New chat
      </button>

      {ordered.length === 0 ? (
        <div
          style={{
            color: MUTED,
            fontSize: 13,
            padding: "16px 4px",
            textAlign: "center",
          }}
        >
          No chats yet — start a new one above.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {ordered.map((c) => (
            <ChatHistoryItem
              key={c.id}
              chat={c}
              now={now}
              onSelect={() => onSelectChat(c.id)}
              onDelete={() => onDeleteChat(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ChatHistoryItem({
  chat,
  now,
  onSelect,
  onDelete,
}: {
  chat: Chat;
  now: number;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHover, setMenuHover] = useState(false);

  /* Close any open per-item menu on outside click — same pattern as the
     chat-header 3-dot menu. */
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [menuOpen]);

  /* Preview = last assistant or user text message in the chat. Forms
     and typing indicators are skipped so previews always read as
     human-friendly content. */
  const preview = useMemo(() => {
    for (let i = chat.messages.length - 1; i >= 0; i--) {
      const m = chat.messages[i];
      if (m.kind === "text") return m.text;
    }
    return "";
  }, [chat.messages]);

  /* The dots reveal on hover OR while the menu is open (so the cursor
     can move from the dots into the dropdown without the icon
     disappearing). Same reveal mechanic chat platforms use. */
  const dotsVisible = hover || menuOpen;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        border: `1px solid ${hover || menuOpen ? HAIRLINE : "transparent"}`,
        background: hover || menuOpen ? SURFACE_TINT : "transparent",
        borderRadius: 10,
        transition:
          "background-color 180ms ease, border-color 180ms ease",
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        style={{
          appearance: "none",
          border: "none",
          background: "transparent",
          padding: "10px 12px",
          /* Reserve room on the right for the (now larger, further-left)
             3-dot plate so it never overlaps the title/timestamp. */
          paddingRight: 50,
          color: INK,
          fontFamily: "inherit",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
          >
            {chat.title}
          </span>
          <span
            style={{
              fontSize: 11,
              color: MUTED,
              flexShrink: 0,
            }}
          >
            {formatRelativeTime(chat.updatedAt, now)}
          </span>
        </div>
        {preview && (
          <span
            style={{
              fontSize: 12,
              color: MUTED,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {preview}
          </span>
        )}
      </button>

      {/* 3-dot button — absolutely positioned over the right side of
          the row, fades in on hover. Same visual treatment as the
          chat-header 3-dot (size, radius, hover fill, icon path). */}
      <button
        type="button"
        aria-label="Chat options"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((v) => !v);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseEnter={() => setMenuHover(true)}
        onMouseLeave={() => setMenuHover(false)}
        style={{
          position: "absolute",
          /* Centred vertically; right inset chosen so the gap on the right
             matches the gap above/below for the ~65px history row
             ((65 − 30) / 2 ≈ 17). Reads as a balanced, evenly-inset plate
             rather than one crammed against the right edge. */
          top: "50%",
          right: 17,
          transform: "translateY(-50%)",
          appearance: "none",
          border: "none",
          /* Darker than the row's SURFACE_TINT hover fill so the plate
             reads as raised on the hovered row. */
          background: menuHover || menuOpen ? SURFACE_TINT_DARK : "transparent",
          borderRadius: "var(--ent-radius-md, 10px)",
          width: 30,
          height: 30,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: MUTED,
          cursor: "pointer",
          opacity: dotsVisible ? 1 : 0,
          pointerEvents: dotsVisible ? "auto" : "none",
          transition:
            "background-color 180ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="currentColor"
          aria-hidden
          style={{ display: "block" }}
        >
          <circle cx="7" cy="2.5" r="1.4" />
          <circle cx="7" cy="7" r="1.4" />
          <circle cx="7" cy="11.5" r="1.4" />
        </svg>
      </button>

      {menuOpen && (
        <div
          role="menu"
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "calc(100% - 4px)",
            right: 4,
            background: "#FFFFFF",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 12,
            boxShadow:
              "0 16px 40px rgba(11, 27, 43, 0.14), 0 4px 12px rgba(11, 27, 43, 0.08)",
            minWidth: 150,
            padding: 4,
            zIndex: 5,
            animation:
              "ch-popover 190ms cubic-bezier(0.32, 0.72, 0, 1) both",
          }}
        >
          <MenuItem
            label="Delete chat"
            onClick={() => {
              setMenuOpen(false);
              onDelete();
            }}
            iconPath="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14M10 11v6M14 11v6"
          />
        </div>
      )}
    </div>
  );
}

/* ════ ScrollTailSpacer ══════════════════════════════════════════════
   Invisible block at the bottom of the message list whose height tracks
   the scroller's viewport height (minus a small reserve). Guarantees
   the scroller can always be moved far enough to place the newest
   message at the top of view — even in a 2-message chat. ResizeObserver
   re-measures on container resize so it stays in sync with the panel's
   responsive height. */

function ScrollTailSpacer({
  scrollerRef,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [h, setH] = useState(0);
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const measure = () => {
      /* Leave ~120px so the very-bottom of the scroll still shows the
         latest message + a hint of meta line; everything above scrolls
         comfortably. */
      setH(Math.max(0, el.clientHeight - 120));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollerRef]);
  return (
    <div
      aria-hidden
      style={{ flexShrink: 0, height: h, pointerEvents: "none" }}
    />
  );
}

/* ════ MessageItem ════════════════════════════════════════════════════ */

function MessageItem({
  message,
  now,
  onMiniFormSubmit,
  onFeedback,
}: {
  message: Message;
  now: number;
  onMiniFormSubmit: (data: MiniFormData) => void;
  onFeedback: (id: string, value: "up" | "down") => void;
}) {
  const isUser = message.role === "user";
  const time = formatRelativeTime(message.ts, now);
  const isFullWidth = message.kind === "form";

  /* Show inline feedback row when this is an assistant text message that
     opted into feedback (feedback === null) OR was just answered (so the
     buttons can collapse with a CSS transition). undefined means "no
     prompt"; for those, the wrapper isn't rendered at all. */
  const wantsFeedback =
    message.kind === "text" &&
    message.role === "assistant" &&
    message.feedback !== undefined;
  const feedbackOpen =
    wantsFeedback &&
    message.kind === "text" &&
    message.feedback === null;

  return (
    <div
      data-message-id={message.id}
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: isFullWidth ? 8 : 4,
        maxWidth: isFullWidth ? "100%" : "85%",
        width: isFullWidth ? "100%" : "auto",
        minWidth: 0,
        animation: "ch-msg-in 300ms cubic-bezier(0.22, 1, 0.36, 1) both",
      }}
    >
      {message.kind === "text" && (
        <div
          style={{
            background: isUser ? INK : SURFACE_TINT,
            color: isUser ? "#FFFFFF" : INK,
            padding: "10px 14px",
            borderRadius: 14,
            fontSize: 15,
            lineHeight: 1.45,
            /* Wrap long unbroken tokens (URLs, etc.) so the bubble can't
               grow past its 85% cap and force horizontal scroll. */
            overflowWrap: "anywhere",
          }}
        >
          {message.text}
        </div>
      )}

      {message.kind === "form" && (
        <MiniContactForm
          preamble={message.preamble}
          prefilledMessage={message.prefilledMessage}
          submitted={message.submitted}
          onSubmit={onMiniFormSubmit}
        />
      )}

      {message.kind === "typing" && <ThinkingIndicator />}

      {/* Meta line — "Columbus · Just now" on the left, inline 👍 / 👎
          feedback buttons on the right. The feedback wrapper transitions
          max-width + opacity, so on click the buttons collapse away to
          the right and leave only the meta caption behind. Skipped for the
          thinking indicator, which carries its own "Columbus is thinking…"
          label. */}
      {message.kind !== "typing" && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          width: "100%",
          padding: "0 4px",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: MUTED,
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
          }}
        >
          {isUser ? "You" : "Columbus"}
          {time ? ` · ${time}` : ""}
        </span>
        {wantsFeedback && (
          <div
            aria-hidden={!feedbackOpen}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              overflow: "hidden",
              maxWidth: feedbackOpen ? 80 : 0,
              opacity: feedbackOpen ? 1 : 0,
              transition:
                "max-width 280ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms cubic-bezier(0.32, 0.72, 0, 1)",
            }}
          >
            <InlineFeedbackButton
              kind="up"
              onClick={() => onFeedback(message.id, "up")}
            />
            <InlineFeedbackButton
              kind="down"
              onClick={() => onFeedback(message.id, "down")}
            />
          </div>
        )}
      </div>
      )}
    </div>
  );
}

function InlineFeedbackButton({
  kind,
  onClick,
}: {
  kind: "up" | "down";
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  /* On click, play the confirmation pop in place, THEN run the real handler
     (which collapses the feedback row away) — so the animation is visible
     before the row slides out. Guard against double taps. */
  const handleClick = () => {
    if (confirmed) return;
    setConfirmed(true);
    window.setTimeout(onClick, 340);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={
        kind === "up" ? "Yes, it answered my question" : "No, route to the team"
      }
      style={{
        position: "relative",
        appearance: "none",
        border: "none",
        background: confirmed
          ? `color-mix(in srgb, ${ACCENT} 14%, transparent)`
          : hover
            ? SURFACE_TINT
            : "transparent",
        padding: 0,
        width: 22,
        height: 22,
        borderRadius: 6,
        color: confirmed ? ACCENT : hover ? INK : MUTED,
        cursor: confirmed ? "default" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition:
          "background-color 180ms cubic-bezier(0.32, 0.72, 0, 1), color 180ms cubic-bezier(0.32, 0.72, 0, 1)",
        flexShrink: 0,
      }}
    >
      {/* Accent ring that bursts outward on confirm. */}
      {confirmed && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: 9999,
            border: `1.5px solid ${ACCENT}`,
            animation: "ch-thumb-ring 460ms cubic-bezier(0.32, 0.72, 0, 1) forwards",
            pointerEvents: "none",
          }}
        />
      )}
      <span
        style={{
          display: "inline-flex",
          animation: confirmed
            ? "ch-thumb-pop 360ms cubic-bezier(0.34, 1.56, 0.64, 1)"
            : undefined,
        }}
      >
        <ThumbIcon up={kind === "up"} filled={confirmed} />
      </span>
    </button>
  );
}

/* ════ ThinkingIndicator ══════════════════════════════════════════════
   Replaces the old three-dot bubble. The Earth mascot bobs gently beside
   a "Columbus is thinking…" label whose letters are filled by a wave of
   colour that sweeps across the text on a loop (a gradient clipped to the
   glyphs, animated via background-position — see .ch-thinking-text in
   CHAT_KEYFRAMES). The wave keeps moving until the response replaces it. */

function ThinkingIndicator() {
  return (
    <div
      aria-label="Columbus is thinking"
      role="status"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        padding: "4px 2px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/BusinessPgMedia/business-helper-mascot.png"
        alt=""
        width={24}
        height={24}
        decoding="async"
        style={{
          display: "block",
          flexShrink: 0,
          animation: "ch-think-bob 1.8s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        }}
      />
      <span className="ch-thinking-text">Columbus is thinking…</span>
    </div>
  );
}

/* Lucide-derived thumbs glyphs. We render up vs down from distinct paths
   rather than rotating one — SVG transform-origin defaults to (0,0) in
   several engines, which was throwing the rotated "down" icon off the
   canvas (the "glitched" appearance). Two paths sidesteps that entirely
   and lets each glyph sit naturally inside its 24-unit viewBox. */
function ThumbIcon({ up, filled = false }: { up: boolean; filled?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ display: "block", flexShrink: 0 }}
    >
      {up ? (
        <>
          <path d="M7 10v12" />
          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
        </>
      ) : (
        <>
          <path d="M17 14V2" />
          <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
        </>
      )}
    </svg>
  );
}

/* ════ SuggestionChips (rotating) ════════════════════════════════════ */

function SuggestionChips({
  usedIds,
  onPick,
  pendingChipId,
  isResponding,
}: {
  usedIds: string[];
  onPick: (s: Suggestion) => void;
  pendingChipId: string | null;
  isResponding: boolean;
}) {
  /* Rotation policy: hide any suggestion the visitor has already
     clicked, then show the first three of the remaining pool. The
     pendingChipId override keeps the just-clicked chip in the visible
     list during its "selected → filled" beat even though it's already
     in usedIds. */
  const visible = useMemo(() => {
    const used = new Set(usedIds);
    return COLUMBUS_SUGGESTIONS.filter(
      (s) => !used.has(s.id) || s.id === pendingChipId,
    ).slice(0, 3);
  }, [usedIds, pendingChipId]);
  const [hoverId, setHoverId] = useState<string | null>(null);
  if (visible.length === 0 && pendingChipId === null) return null;
  /* Whole strip collapses while the assistant is replying — gives the
     reader an uncluttered view of the response, then the strip re-reveals
     when typing finishes. The pendingChipId override keeps it visible
     during the chip's select-pending beat. */
  const stripHidden = isResponding && pendingChipId === null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        /* No row-gap here — per-row marginTop instead (see each row below).
           A gap would survive even when a sibling row collapses to height 0,
           leaving phantom spacing during the pick morph; collapsible margins
           let the unpicked rows take their spacing with them. */
        marginTop: 4,
        overflow: "hidden",
        /* flex-shrink:0 is load-bearing. This strip is a flex child of the
           message scroller (a flex column). overflow:hidden here makes the
           item's flex `min-height: auto` resolve to 0, so the tall
           ScrollTailSpacer's negative free space would otherwise collapse
           the whole strip to height 0 — the chips silently vanish. Pinning
           flex-shrink keeps the strip at its content height; the maxHeight
           transition below still drives the collapse/expand animation. */
        flexShrink: 0,
        maxHeight: stripHidden ? 0 : 600,
        opacity: stripHidden ? 0 : 1,
        transition:
          "max-height 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms cubic-bezier(0.22, 1, 0.36, 1), margin-top 320ms cubic-bezier(0.22, 1, 0.36, 1)",
        marginBottom: stripHidden ? -4 : 0,
      }}
      role="group"
      aria-label="Suggested questions"
    >
      {visible.map((s, i) => {
        const isHover = hoverId === s.id;
        const isPending = s.id === pendingChipId;
        const isOther = pendingChipId !== null && !isPending;
        return (
          /* Row wrapper. It does two jobs:
             1. Right-anchors its chip (justify-content:flex-end) so when the
                picked chip releases its flex-grow it collapses toward the
                right edge — sliding into the user-bubble alignment.
             2. Collapses away (height + spacing + lift) when its chip is an
                unpicked sibling, so the alternatives clear out cleanly and
                the chosen chip is left standing alone. */
          <div
            key={s.id}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              overflow: "hidden",
              /* Spacing collapses to 0 the moment a pick is in flight, so the
                 lone chosen chip rises flush to the top of the strip. */
              marginTop: i === 0 ? 0 : pendingChipId !== null ? 0 : 6,
              maxHeight: isOther ? 0 : 240,
              opacity: isOther ? 0 : 1,
              transform: isOther ? "translateY(-4px)" : "translateY(0)",
              pointerEvents: isOther ? "none" : "auto",
              transition:
                "max-height 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms cubic-bezier(0.22, 1, 0.36, 1), margin-top 280ms cubic-bezier(0.22, 1, 0.36, 1), transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <button
              type="button"
              disabled={pendingChipId !== null}
              aria-hidden={isOther}
              onClick={() => onPick(s)}
              onMouseEnter={() => setHoverId(s.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{
                appearance: "none",
                /* flex-grow is the morph engine. Idle chips grow to fill the
                   row (full width, left-reading list). The picked chip drops
                   its grow share to 0, so — anchored right by the row — it
                   shrinks horizontally into a content-width bubble. Paired
                   with the colour/radius shift below, the chip visibly turns
                   into the navy user message it's about to send. */
                flexGrow: isPending ? 0 : 1,
                flexShrink: 1,
                flexBasis: "auto",
                minWidth: 0,
                maxWidth: isPending ? "85%" : "100%",
                /* pending — morphs to the user bubble (navy fill, white text,
                   message radius). Others fade+collapse via the row above.
                   idle — brand accent border + text, low-alpha hover. */
                border: `1px solid ${isPending ? NAVY : BRAND_ACCENT}`,
                background: isPending
                  ? NAVY
                  : isHover
                    ? `color-mix(in srgb, ${BRAND_ACCENT} 10%, transparent)`
                    : "#FFFFFF",
                color: isPending ? "#FFFFFF" : BRAND_ACCENT,
                padding: "10px 14px",
                borderRadius: isPending ? 14 : 12,
                fontSize: isPending ? 15 : 14,
                fontFamily: "inherit",
                fontWeight: isPending ? 400 : 500,
                lineHeight: 1.45,
                letterSpacing: "-0.005em",
                cursor: pendingChipId !== null ? "default" : "pointer",
                textAlign: "left",
                /* Entry only while at rest. During a pick we hand the chip
                   over to the transitions below, so the held entry frame
                   doesn't fight the morph. */
                animation:
                  pendingChipId === null
                    ? `ch-chip-in 480ms cubic-bezier(0.22, 1, 0.36, 1) ${
                        300 + i * 80
                      }ms both`
                    : "none",
                /* flex-grow eases out slightly behind the colour shift so the
                   chip reads "selected", then glides to the right. */
                transition:
                  "flex-grow 320ms cubic-bezier(0.22, 1, 0.36, 1) 120ms, background-color 280ms cubic-bezier(0.32, 0.72, 0, 1), color 240ms cubic-bezier(0.32, 0.72, 0, 1), border-color 240ms cubic-bezier(0.32, 0.72, 0, 1), border-radius 260ms cubic-bezier(0.32, 0.72, 0, 1), font-size 240ms cubic-bezier(0.32, 0.72, 0, 1)",
              }}
            >
              {s.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ════ ChatInput ══════════════════════════════════════════════════════ */

function ChatInput({
  draft,
  setDraft,
  onSend,
  sendStatus,
  inputRef,
}: {
  draft: string;
  setDraft: (s: string) => void;
  onSend: () => void;
  sendStatus: "idle" | "sending";
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const hasText = draft.trim().length > 0;
  const showSend = hasText || sendStatus === "sending";
  const [inputFocused, setInputFocused] = useState(false);
  const showFocused = inputFocused || sendStatus === "sending";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      style={{ padding: "8px 16px 16px" }}
    >
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
          transition: showFocused
            ? "background-color 160ms cubic-bezier(0.32, 0.72, 0, 1), border-color 160ms cubic-bezier(0.32, 0.72, 0, 1), padding-right 220ms cubic-bezier(0.6,0.6,0,1)"
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
  );
}

/* ════ MiniContactForm ════════════════════════════════════════════════
   Field set + visual styling mirror the Columbus Pro tab of the main
   /contact form (see app/contact/page.tsx ~L364-L388 for the .cf-input
   / .cf-textarea / .cf-select css this borrows): white field, hairline
   idle border, focus border + soft glow ring in the brand accent. */

function MiniContactForm({
  preamble,
  prefilledMessage,
  submitted,
  onSubmit,
}: {
  preamble: string;
  prefilledMessage: string;
  submitted: boolean;
  onSubmit: (data: MiniFormData) => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [message, setMessage] = useState(prefilledMessage);

  /* Card chrome shared by the live form + the submitted confirmation.
     A soft elevation (same shadow vocabulary as the greeting card and
     chat panel) lifts the card off the white chat surface, and the border
     is tinted with BRAND_ACCENT — the site-wide design-system accent
     (--color-accent #6094C1 in globals.css, the same blue the suggestion
     chips use) — so the form reads as a deliberate, on-brand standout
     contact card rather than a flat white block. */
  const CARD_BORDER = `1px solid color-mix(in srgb, ${BRAND_ACCENT} 60%, ${HAIRLINE})`;
  const CARD_SHADOW =
    "0 10px 28px rgba(11, 27, 43, 0.12), 0 2px 8px rgba(11, 27, 43, 0.06)";

  if (submitted) {
    return (
      <div
        style={{
          width: "100%",
          background: "#FFFFFF",
          border: CARD_BORDER,
          borderRadius: 16,
          padding: 14,
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: INK,
          fontSize: 14,
          boxShadow: CARD_SHADOW,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 22,
            height: 22,
            borderRadius: 9999,
            background: CTA_NAVY,
            color: "#FFFFFF",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: "block" }}
          >
            <path d="M6 12.5l4 4L18 7.5" />
          </svg>
        </span>
        <span>Sent. We&apos;ll be in touch soon.</span>
      </div>
    );
  }

  const canSubmit =
    email.trim().length > 0 &&
    name.trim().length > 0 &&
    industry !== "" &&
    message.trim().length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          email: email.trim(),
          name: name.trim(),
          industry,
          message: message.trim(),
        });
      }}
      style={{
        width: "100%",
        background: "#FFFFFF",
        border: CARD_BORDER,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: CARD_SHADOW,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header band — an accent badge + the assistant's preamble on a faint
          accent wash. Folds what used to be a separate grey message bubble
          into the card so the whole thing reads as one prominent unit and
          the form gains a clear "contact us" identity. */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          padding: "12px 14px",
          background: `color-mix(in srgb, ${BRAND_ACCENT} 14%, #FFFFFF)`,
          borderBottom: `1px solid color-mix(in srgb, ${BRAND_ACCENT} 32%, ${HAIRLINE})`,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 26,
            height: 26,
            borderRadius: 9999,
            background: BRAND_ACCENT,
            color: "#FFFFFF",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: "block" }}
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
        </span>
        <p style={{ margin: 0, color: INK, fontSize: 14, lineHeight: 1.45 }}>
          {preamble}
        </p>
      </div>

      {/* Body — the fields + submit, on white so they read cleanly under
          the tinted header. */}
      <div
        style={{
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
      <Field label="Email">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          className="ch-field"
        />
      </Field>
      <Field label="Your name">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          className="ch-field"
        />
      </Field>
      <Field label="Industry">
        <select
          required
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="ch-field ch-select"
        >
          <option value="" disabled>
            Please select
          </option>
          {INDUSTRY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="What are you hoping to get out of Columbus?">
        <textarea
          required
          rows={3}
          maxLength={500}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="ch-field ch-textarea"
        />
      </Field>
      <button
        type="submit"
        disabled={!canSubmit}
        style={{
          appearance: "none",
          border: "none",
          background: canSubmit ? CTA_NAVY : SURFACE_TINT,
          color: canSubmit ? "#FFFFFF" : MUTED,
          padding: "10px 14px",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: canSubmit ? "pointer" : "not-allowed",
          transition:
            "background-color 180ms cubic-bezier(0.32, 0.72, 0, 1), color 180ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        Submit
      </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        fontSize: 13,
        fontWeight: 500,
        color: MUTED,
      }}
    >
      {label}
      {children}
    </label>
  );
}

/* ════ Scoped CSS — entry animations + field styling ═════════════════
   One <style> block keeps the component self-contained. The .ch-field
   rules replicate the /contact form's .cf-input / .cf-textarea /
   .cf-select styling so the inline mini-form feels like the main
   contact form. The custom select chevron is lifted verbatim. */

const CHAT_KEYFRAMES = `
  @keyframes ch-msg-in {
    0% { opacity: 0; transform: translateY(6px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes ch-chip-in {
    0% { opacity: 0; transform: translateY(6px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes ch-view-in {
    0% { opacity: 0; transform: translateY(5px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes ch-popover {
    0% { opacity: 0; transform: translateY(-4px) scale(0.96); transform-origin: top right; }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  /* Thumb confirmation — a springy pop on the glyph (overshoot, then
     settle) paired with an accent ring that bursts outward and fades.
     Same accent blue + snappy feel as the rest of the chat. */
  @keyframes ch-thumb-pop {
    0% { transform: scale(1); }
    35% { transform: scale(1.4); }
    62% { transform: scale(0.9); }
    100% { transform: scale(1); }
  }
  @keyframes ch-thumb-ring {
    0% { transform: scale(0.55); opacity: 0.5; }
    100% { transform: scale(2.3); opacity: 0; }
  }
  /* Earth bob — a gentle rock + float while Columbus is thinking. The
     translateY swings symmetrically (+1.5px ↔ −1.5px) around the rest
     position so the globe's time-average stays vertically centred on the
     "Columbus is thinking…" text beside it, rather than drifting upward. */
  @keyframes ch-think-bob {
    0%, 100% { transform: translateY(1.5px) rotate(-5deg); }
    50% { transform: translateY(-1.5px) rotate(5deg); }
  }
  /* Colour wave — the bright crest (accent blue) sweeps across the muted
     base text on a loop. The gradient is 220% wide (wider than the text)
     and no-repeat, so animating background-position only within 0%→100%
     keeps the glyphs fully painted at every frame (the oversized image
     always covers the box) while the crest at the gradient's centre
     travels edge-to-edge. Going outside that range would leave part of
     the text with no gradient — and a text-clipped fill with no paint is
     transparent, which would make letters vanish mid-sweep. */
  @keyframes ch-shimmer {
    0% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .ch-thinking-text {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.005em;
    background-image: linear-gradient(
      100deg,
      ${MUTED} 0%,
      ${MUTED} 32%,
      ${BRAND_ACCENT} 44%,
      ${ACCENT} 50%,
      ${BRAND_ACCENT} 56%,
      ${MUTED} 68%,
      ${MUTED} 100%
    );
    background-size: 220% 100%;
    background-repeat: no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    animation: ch-shimmer 1.3s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .ch-thinking-text { animation: none; color: ${MUTED}; -webkit-text-fill-color: ${MUTED}; }
    [style*="ch-think-bob"] { animation: none !important; }
  }
  .ch-field {
    width: 100%;
    border: 1px solid ${HAIRLINE};
    background: #FFFFFF;
    color: ${INK};
    font-size: 14px;
    font-family: inherit;
    outline: none;
    padding: 10px 12px;
    border-radius: 10px;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    box-sizing: border-box;
  }
  .ch-field::placeholder { color: color-mix(in srgb, ${INK} 32%, transparent); }
  .ch-field:focus {
    /* Brand accent (--color-accent / #6094C1) — identical to /contact's
       .cf-input:focus, so the mini-form's selection state matches the main
       contact form rather than the off-brand cobalt it used before. */
    border-color: ${BRAND_ACCENT};
    box-shadow: 0 0 0 3px color-mix(in srgb, ${BRAND_ACCENT} 14%, transparent);
  }
  .ch-textarea { resize: vertical; min-height: 72px; line-height: 1.45; }
  .ch-select {
    appearance: none;
    cursor: pointer;
    padding-right: 36px;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%235A6B7B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }
`;
