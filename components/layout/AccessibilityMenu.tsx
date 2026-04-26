"use client";

import { useState, useEffect, useRef } from "react";
import glassStyles from "@/components/ui/GlassButton.module.css";

type PanelPlacement =
  | "below-right"
  | "below-left"
  | "above-right"
  | "above-left"
  /* Inline mode: panel renders in normal flow directly below the trigger
     (no absolute positioning, no own backdrop). Use when the surrounding
     container should expand to contain the panel — e.g. inside the blog
     article dock. */
  | "inline-below";

export const AccessibilityMenu = ({
  isDark = false,
  placement = "below-right",
  triggerSize = 24,
}: {
  isDark?: boolean;
  placement?: PanelPlacement;
  /* Size of the trigger icon (px). Defaults to 24px to match the navbar. */
  triggerSize?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [bgColor, setBgColor] = useState<"default" | "sepia" | "dark">("default");
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync state with body classes
  useEffect(() => {
    if (dyslexiaMode) {
      document.body.classList.add("dyslexia-mode");
    } else {
      document.body.classList.remove("dyslexia-mode");
    }
  }, [dyslexiaMode]);

  useEffect(() => {
    document.body.classList.remove("bg-mode-sepia", "bg-mode-dark");

    // The blog layout uses data-theme="light" on a wrapping div to scope
    // design-system tokens. Toggle that attribute too so the token cascade
    // picks up the correct palette instead of the body-level overrides being
    // cancelled out by the child div re-asserting "light".
    const themedEls = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]"));

    if (bgColor === "sepia") {
      document.body.classList.add("bg-mode-sepia");
      themedEls.forEach((el) => el.setAttribute("data-theme", "light"));
    } else if (bgColor === "dark") {
      document.body.classList.add("bg-mode-dark");
      themedEls.forEach((el) => el.setAttribute("data-theme", "dark"));
    } else {
      themedEls.forEach((el) => el.setAttribute("data-theme", "light"));
    }
  }, [bgColor]);

  // Text to speech
  const toggleSpeech = () => {
    if (!window.speechSynthesis) {
      alert("Text to speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Find the main article content (typically inside an <article> or <main>)
      const article = document.querySelector("article") || document.querySelector("main");
      if (article) {
        // Simple extraction of text, trying to exclude navbar elements if in main
        const textToRead = article.innerText;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  // Cleanup on unmount — restore body classes and data-theme attributes
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      document.body.classList.remove("bg-mode-sepia", "bg-mode-dark");
      document.querySelectorAll<HTMLElement>("[data-theme]").forEach((el) =>
        el.setAttribute("data-theme", "light")
      );
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        data-accessibility-trigger
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center p-2 rounded-full transition-colors ${
          isDark ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-[#0A1344]"
        }`}
        aria-label="Accessibility Options"
        title="Accessibility Options"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={triggerSize}
          height={triggerSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 9.5a4 4 0 1 0 8 0" />
          <line x1="12" y1="14" x2="12" y2="22" />
          <line x1="8" y1="18" x2="16" y2="18" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={
            placement === "inline-below"
              ? "w-full overflow-hidden mt-2 z-10"
              : `absolute w-60 overflow-hidden z-50 ${
                  placement === "below-right" ? "right-0 top-full mt-2" :
                  placement === "below-left"  ? "left-0 top-full mt-2"  :
                  placement === "above-right" ? "right-0 bottom-full mb-2" :
                  "left-0 bottom-full mb-2"
                }`
          }
          style={
            placement === "inline-below"
              ? { color: "#0A1344" }
              : {
                  background: "rgba(255, 255, 255, 0.72)",
                  backdropFilter: "blur(24px) saturate(0.55)",
                  WebkitBackdropFilter: "blur(24px) saturate(0.55)",
                  border: "1px solid rgba(10, 19, 68, 0.08)",
                  boxShadow: "0 12px 40px rgba(10, 19, 68, 0.08), 0 2px 6px rgba(10, 19, 68, 0.04)",
                  color: "#0A1344",
                }
          }
        >
          <div className="p-2">
            {/* Dark Mode */}
            <AccessibilityRow
              active={bgColor === "dark"}
              onClick={() => setBgColor(bgColor === "dark" ? "default" : "dark")}
              label="Dark Mode"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              }
              right={<Toggle on={bgColor === "dark"} />}
            />
            <Divider />

            {/* Sepia */}
            <AccessibilityRow
              active={bgColor === "sepia"}
              onClick={() => setBgColor(bgColor === "sepia" ? "default" : "sepia")}
              label="Sepia"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              }
              right={<Toggle on={bgColor === "sepia"} />}
            />
            <Divider />

            {/* Dyslexia Font */}
            <AccessibilityRow
              active={dyslexiaMode}
              onClick={() => setDyslexiaMode(!dyslexiaMode)}
              label="Dyslexia Font"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
                  <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
                </svg>
              }
              right={<Toggle on={dyslexiaMode} />}
            />
            <Divider />

            {/* Text to Speech */}
            <AccessibilityRow
              active={isSpeaking}
              onClick={toggleSpeech}
              label={isSpeaking ? "Stop Reading" : "Read Aloud"}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
                  {isSpeaking
                    ? <><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>
                    : <><polygon points="5 3 19 12 5 21 5 3" /></>}
                </svg>
              }
              right={isSpeaking ? <span className="text-xs font-medium" style={{ color: "#0066CC" }}>●●●</span> : null}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   Internal building blocks — mirror the homepage hero Products popup
   visual language (sharp corners, navy-on-glass with brand-blue hover).
   ───────────────────────────────────────────────────────────────────── */

function AccessibilityRow({
  active,
  onClick,
  label,
  icon,
  right,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  right: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const tinted = active || hovered;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="w-full flex items-center justify-between gap-3 px-3 py-2.5"
      style={{
        background: active
          ? "rgba(0, 102, 204, 0.10)"
          : hovered
          ? "rgba(0, 102, 204, 0.06)"
          : "transparent",
        color: tinted ? "#0066CC" : "#0A1344",
        transition: "background-color 200ms ease, color 200ms ease",
      }}
    >
      <span className="flex items-center gap-2.5">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </span>
      <span className="flex items-center">{right}</span>
    </button>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className="relative inline-block"
      style={{
        width: 36,
        height: 20,
        background: on ? "#0066CC" : "rgba(10, 19, 68, 0.18)",
        transition: "background-color 200ms ease",
      }}
      aria-hidden
    >
      <span
        className="absolute"
        style={{
          top: 2,
          left: on ? 18 : 2,
          width: 16,
          height: 16,
          background: "#FFFFFF",
          boxShadow: "0 1px 2px rgba(10, 19, 68, 0.2)",
          transition: "left 200ms ease",
        }}
      />
    </span>
  );
}

function Divider() {
  return (
    <div
      aria-hidden
      style={{
        height: 1,
        margin: "2px 8px",
        background: "linear-gradient(to right, rgba(0, 102, 204, 0.3), transparent)",
      }}
    />
  );
}
