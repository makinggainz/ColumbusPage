"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

/* ── Timing ─────────────────────────────────────────────── */
const WIPE_IN_MS = 400;     // overlay wipes up from bottom
const LOGO_HOLD_MS = 500;   // logo on screen
const WIPE_OUT_MS = 400;    // overlay wipes up to exit

const EASE_WIPE = "cubic-bezier(0.77, 0, 0.175, 1)"; // smooth wipe (Quart in-out)

function isMapsGptRoute(href: string): boolean {
  const path = href.split("?")[0].split("#")[0];
  return path === "/products/maps-gpt" || path === "/products/mapsgpt";
}

/* ── Transition states ──────────────────────────────────── */
type Phase = "idle" | "wipe-in" | "holding" | "wipe-out" | "done";

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
  const pendingHref = useRef<string | null>(null);
  const prevPathname = useRef(pathname);

  const useMapsLogo = isMapsGptRoute(targetHref);

  // ── Navigate with transition ──
  const navigate = useCallback((href: string) => {
    if (phase !== "idle") return;
    if (href === pathname) return;

    pendingHref.current = href;
    setTargetHref(href);
    setPhase("wipe-in");
  }, [phase, pathname]);

  // ── Phase machine ──
  useEffect(() => {
    if (phase === "wipe-in") {
      const timer = setTimeout(() => setPhase("holding"), WIPE_IN_MS);
      return () => clearTimeout(timer);
    }

    if (phase === "holding") {
      // Push the route during hold
      if (pendingHref.current) {
        router.push(pendingHref.current);
        pendingHref.current = null;
      }
      const timer = setTimeout(() => setPhase("wipe-out"), LOGO_HOLD_MS);
      return () => clearTimeout(timer);
    }

    if (phase === "wipe-out") {
      const timer = setTimeout(() => setPhase("done"), WIPE_OUT_MS);
      return () => clearTimeout(timer);
    }

    if (phase === "done") {
      setPhase("idle");
      setTargetHref("");
    }
  }, [phase, router]);

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
  const isVisible = phase !== "idle" && phase !== "done";
  const isFullScreen = phase === "holding";
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

  // Content opacity (logo visible only when fully covering)
  const contentVisible = phase === "holding";

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

      </div>
    </PageTransitionContext.Provider>
  );
}
