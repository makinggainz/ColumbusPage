"use client";

import { useState, useEffect } from "react";
import styles from "./article-reading-options.module.css";

export function ArticleReadingOptions() {
  const [open, setOpen] = useState(false);
  const [bgColor, setBgColor] = useState<"default" | "sepia" | "dark">("default");
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dyslexia-mode", dyslexiaMode);
  }, [dyslexiaMode]);

  useEffect(() => {
    document.body.classList.remove("bg-mode-sepia", "bg-mode-dark");
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

  const toggleSpeech = () => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const article = document.querySelector("article") ?? document.querySelector("main");
      if (article) {
        const utterance = new SpeechSynthesisUtterance((article as HTMLElement).innerText);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      document.body.classList.remove("bg-mode-sepia", "bg-mode-dark", "dyslexia-mode");
      document.querySelectorAll<HTMLElement>("[data-theme]").forEach((el) =>
        el.setAttribute("data-theme", "light")
      );
    };
  }, []);

  return (
    <div className={styles.root}>
      {open && (
        <div className={styles.options}>
          <button
            type="button"
            aria-label="Toggle dark mode"
            aria-pressed={bgColor === "dark"}
            className={`${styles.btn} ${bgColor === "dark" ? styles.btnActive : ""}`}
            onClick={() => setBgColor(bgColor === "dark" ? "default" : "dark")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span className={styles.label}>Dark</span>
          </button>

          <button
            type="button"
            aria-label="Toggle sepia mode"
            aria-pressed={bgColor === "sepia"}
            className={`${styles.btn} ${bgColor === "sepia" ? styles.btnActive : ""}`}
            onClick={() => setBgColor(bgColor === "sepia" ? "default" : "sepia")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <span className={styles.label}>Sepia</span>
          </button>

          <button
            type="button"
            aria-label="Toggle dyslexia font"
            aria-pressed={dyslexiaMode}
            className={`${styles.btn} ${dyslexiaMode ? styles.btnActive : ""}`}
            onClick={() => setDyslexiaMode(!dyslexiaMode)}
          >
            <span className={styles.aaGlyph}>Aa</span>
            <span className={styles.label}>Dyslexia</span>
          </button>

          <button
            type="button"
            aria-label={isSpeaking ? "Stop reading aloud" : "Read article aloud"}
            aria-pressed={isSpeaking}
            className={`${styles.btn} ${isSpeaking ? styles.btnActive : ""}`}
            onClick={toggleSpeech}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span className={styles.label}>{isSpeaking ? "Stop" : "Listen"}</span>
          </button>

          <div className={styles.divider} aria-hidden />
        </div>
      )}

      <button
        type="button"
        aria-expanded={open}
        className={`${styles.btn} ${open ? styles.btnActive : ""}`}
        onClick={() => setOpen(!open)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 9.5a4 4 0 1 0 8 0" />
          <line x1="12" y1="14" x2="12" y2="22" />
          <line x1="8" y1="18" x2="16" y2="18" />
        </svg>
        <span className={styles.label}>Accessibility</span>
      </button>
    </div>
  );
}
