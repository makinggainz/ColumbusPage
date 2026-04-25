"use client";

import { useState, useEffect, useRef } from "react";
import glassStyles from "@/components/ui/GlassButton.module.css";

export const AccessibilityMenu = ({ isDark = false }: { isDark?: boolean }) => {
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
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center p-2 rounded-full transition-colors ${
          isDark ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-[#0A1344]"
        }`}
        aria-label="Accessibility Options"
        title="Accessibility Options"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
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
          className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg border overflow-hidden z-50 ${
            isDark ? "bg-[#0A1344] border-white/10 text-white" : "bg-white border-black/10 text-[#0A1344]"
          }`}
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="p-4 space-y-1">
            {/* Dark Mode */}
            <button
              onClick={() => setBgColor(bgColor === "dark" ? "default" : "dark")}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                bgColor === "dark"
                  ? "bg-[#1e2235] text-[#a8c8ff]"
                  : isDark
                  ? "hover:bg-white/8 text-white"
                  : "hover:bg-black/5 text-[#0A1344]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${bgColor === "dark" ? "bg-blue-500" : isDark ? "bg-white/20" : "bg-black/15"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${bgColor === "dark" ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
            </button>

            <div className={`h-px mx-1 my-1 ${isDark ? "bg-white/10" : "bg-black/8"}`} />

            {/* Sepia */}
            <button
              onClick={() => setBgColor(bgColor === "sepia" ? "default" : "sepia")}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                bgColor === "sepia"
                  ? "bg-[#f4ecd8] text-[#433422]"
                  : isDark
                  ? "hover:bg-white/8 text-white"
                  : "hover:bg-black/5 text-[#0A1344]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <span className="text-sm font-medium">Sepia</span>
              </div>
              <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${bgColor === "sepia" ? "bg-[#b8936a]" : isDark ? "bg-white/20" : "bg-black/15"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${bgColor === "sepia" ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
            </button>

            <div className={`h-px mx-1 my-1 ${isDark ? "bg-white/10" : "bg-black/8"}`} />

            {/* Dyslexia Font */}
            <button
              onClick={() => setDyslexiaMode(!dyslexiaMode)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                dyslexiaMode
                  ? isDark ? "bg-white/10 text-white" : "bg-blue-50 text-blue-700"
                  : isDark
                  ? "hover:bg-white/8 text-white"
                  : "hover:bg-black/5 text-[#0A1344]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                  <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
                </svg>
                <span className="text-sm font-medium">Dyslexia Font</span>
              </div>
              <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${dyslexiaMode ? "bg-blue-500" : isDark ? "bg-white/20" : "bg-black/15"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${dyslexiaMode ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
            </button>

            <div className={`h-px mx-1 my-1 ${isDark ? "bg-white/10" : "bg-black/8"}`} />

            {/* Text to Speech */}
            <button
              onClick={toggleSpeech}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isSpeaking
                  ? isDark ? "bg-red-900/40 text-red-300" : "bg-red-50 text-red-600"
                  : isDark
                  ? "hover:bg-white/8 text-white"
                  : "hover:bg-black/5 text-[#0A1344]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                  {isSpeaking
                    ? <><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>
                    : <><polygon points="5 3 19 12 5 21 5 3" /></>}
                </svg>
                <span className="text-sm font-medium">{isSpeaking ? "Stop Reading" : "Read Aloud"}</span>
              </div>
              {isSpeaking && (
                <span className="text-xs font-medium opacity-60">●●●</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
