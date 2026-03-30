"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

/* ── Timing ─────────────────────────────────────────────── */
const WIPE_IN_MS = 800;    // overlay wipes up from bottom
const TYPE_DELAY_MS = 300;  // pause before typing starts
const CHAR_MS = 50;         // ms between each typed character
const HOLD_AFTER_MS = 400;  // hold after typing completes
const WIPE_OUT_MS = 800;    // overlay wipes up to exit

const EASE_WIPE = "cubic-bezier(0.77, 0, 0.175, 1)"; // smooth wipe (Quart in-out)

/* ── Route → transition quotes ───────────────────────────── */
const ROUTE_QUOTES: Record<string, string[]> = {
  "/": [
    "Mapping the future of our planet.",
    "Where frontier AI meets the real world.",
    "Every location tells a story.",
  ],
  "/mapsgpt": [
    "Your intelligent travel copilot awaits.",
    "The world, understood by AI.",
    "Every journey starts with a question.",
  ],
  "/maps-gpt": [
    "Your intelligent travel copilot awaits.",
    "The world, understood by AI.",
    "Every journey starts with a question.",
  ],
  "/use-cases": [
    "See what spatial intelligence can do.",
    "From insight to action, across industries.",
    "Real problems. Real answers. Real places.",
  ],
  "/enterprise": [
    "Spatial intelligence, enterprise-grade.",
    "Built for the questions that matter most.",
    "The geospatial model, at your service.",
  ],
  "/our-mission": [
    "Understanding our planet, one layer at a time.",
    "The frontier is spatial.",
    "AI with a sense of place.",
  ],
  "/technology": [
    "Inside the Large Geospatial Model.",
    "The architecture behind spatial reasoning.",
    "Where research becomes reality.",
  ],
  "/contact": [
    "Let's build something together.",
    "The best ideas start with a conversation.",
    "We'd love to hear from you.",
  ],
  "/mission": [
    "Why we do what we do.",
    "Purpose-driven intelligence.",
  ],
  "/market-spy": [
    "Intelligence, on every corner.",
    "See the market like never before.",
  ],
};

const FALLBACK_QUOTES = [
  "Exploring new territory.",
  "Charting the unknown.",
];

function getQuote(href: string): string {
  const path = href.split("?")[0].split("#")[0];
  const quotes = ROUTE_QUOTES[path] || FALLBACK_QUOTES;
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function isMapsGptRoute(href: string): boolean {
  const path = href.split("?")[0].split("#")[0];
  return path === "/maps-gpt" || path === "/mapsgpt";
}

/* ── Transition states ──────────────────────────────────── */
type Phase = "idle" | "wipe-in" | "typing" | "holding" | "wipe-out" | "done";

const PageTransitionContext = createContext<{
  navigate: (href: string) => void;
}>({ navigate: () => {} });

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

/* ── Provider ───────────────────────────────────────────── */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [targetHref, setTargetHref] = useState("");
  const [quote, setQuote] = useState("");
  const [typedChars, setTypedChars] = useState(0);
  const pendingHref = useRef<string | null>(null);
  const prevPathname = useRef(pathname);

  const useMapsLogo = isMapsGptRoute(targetHref);

  // ── Navigate with transition ──
  const navigate = useCallback((href: string) => {
    if (phase !== "idle") return;
    if (href === pathname) return;

    pendingHref.current = href;
    setTargetHref(href);
    setQuote(getQuote(href));
    setTypedChars(0);
    setPhase("wipe-in");
  }, [phase, pathname]);

  // ── Phase machine ──
  useEffect(() => {
    if (phase === "wipe-in") {
      const timer = setTimeout(() => setPhase("typing"), WIPE_IN_MS + TYPE_DELAY_MS);
      return () => clearTimeout(timer);
    }

    if (phase === "typing") {
      if (typedChars < quote.length) {
        const timer = setTimeout(() => setTypedChars(c => c + 1), CHAR_MS);
        return () => clearTimeout(timer);
      }
      // Typing done → hold
      const timer = setTimeout(() => {
        setPhase("holding");
      }, HOLD_AFTER_MS);
      return () => clearTimeout(timer);
    }

    if (phase === "holding") {
      // Push the route, then start wipe-out
      if (pendingHref.current) {
        router.push(pendingHref.current);
        pendingHref.current = null;
      }
      // Small delay to let Next.js start rendering
      const timer = setTimeout(() => setPhase("wipe-out"), 100);
      return () => clearTimeout(timer);
    }

    if (phase === "wipe-out") {
      const timer = setTimeout(() => setPhase("done"), WIPE_OUT_MS);
      return () => clearTimeout(timer);
    }

    if (phase === "done") {
      setPhase("idle");
      setTargetHref("");
      setQuote("");
      setTypedChars(0);
    }
  }, [phase, typedChars, router]);

  // ── Scroll to top on route change ──
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // ── Intercept all internal link clicks ──
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== "A") {
        target = target.parentElement;
      }
      if (!target) return;

      const anchor = target as HTMLAnchorElement;
      const href = anchor.getAttribute("href");
      if (!href) return;

      if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return;
      if (anchor.target === "_blank") return;
      if (anchor.hasAttribute("download")) return;

      e.preventDefault();
      navigate(href);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [navigate]);

  // ── Clip-path for the wipe overlay ──
  // idle/done: collapsed at bottom (hidden)
  // wipe-in: animate from bottom to full screen
  // typing/holding: full screen
  // wipe-out: animate from full screen to collapsed at top
  const isVisible = phase !== "idle" && phase !== "done";
  const isFullScreen = phase === "typing" || phase === "holding";
  const isWipingIn = phase === "wipe-in";
  const isWipingOut = phase === "wipe-out";

  let clipPath: string;
  if (isWipingIn) {
    // Animate to full screen (CSS transition handles it)
    clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
  } else if (isFullScreen) {
    clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
  } else if (isWipingOut) {
    // Collapse upward
    clipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
  } else {
    // idle/done: collapsed at bottom
    clipPath = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
  }

  // Content opacity (logo + text visible only when fully covering)
  const contentVisible = phase === "typing" || phase === "holding";

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      {children}

      {/* ── Transition overlay ── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          backgroundColor: "#F9F9F9",
          clipPath,
          transition: isVisible
            ? `clip-path ${isWipingOut ? WIPE_OUT_MS : WIPE_IN_MS}ms ${EASE_WIPE}`
            : "none",
          pointerEvents: isVisible ? "all" : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 64,
            height: 64,
            position: "relative",
            opacity: contentVisible ? 1 : 0,
            transition: contentVisible ? "opacity 300ms ease 100ms" : "opacity 200ms ease",
          }}
        >
          <Image
            src={useMapsLogo ? "/MapsGPT-logo.png" : "/logobueno.png"}
            alt=""
            fill
            sizes="64px"
            className="object-contain"
            priority
          />
        </div>

        {/* Typed quote */}
        <div
          className="brand-wordmark"
          style={{
            fontFamily: "var(--md-sys-typescale-display-medium-font)",
            fontSize: 45,
            fontWeight: "var(--md-sys-typescale-display-medium-weight)",
            lineHeight: "var(--md-sys-typescale-display-medium-line-height)",
            letterSpacing: "var(--md-sys-typescale-display-medium-tracking)",
            color: "#0A1344",
            opacity: contentVisible ? 0.8 : 0,
            transition: contentVisible ? "opacity 300ms ease 200ms" : "opacity 200ms ease",
            minHeight: 52,
            maxWidth: "80vw",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
          }}
        >
          <span>{quote.slice(0, typedChars)}</span>
          {/* Blinking cursor during typing */}
          {phase === "typing" && typedChars < quote.length && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: "1em",
                backgroundColor: "#0A1344",
                marginLeft: 2,
                animation: "transitionCursorBlink 0.8s step-end infinite",
              }}
            />
          )}
        </div>
      </div>

      {/* Cursor blink keyframes */}
      <style jsx global>{`
        @keyframes transitionCursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </PageTransitionContext.Provider>
  );
}
