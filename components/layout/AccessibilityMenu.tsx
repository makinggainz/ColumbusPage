"use client";

import { useState, useEffect } from "react";
import styles from "./accessibility-menu.module.css";

export const AccessibilityMenu = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [bgColor, setBgColor] = useState<"default" | "sepia" | "dark">("default");

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
      const article = document.querySelector("article") || document.querySelector("main");
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
    <ul className={styles.optionList}>
      <Option
        label="Dark mode"
        active={bgColor === "dark"}
        onClick={() => setBgColor(bgColor === "dark" ? "default" : "dark")}
      />
      <Option
        label="Sepia"
        active={bgColor === "sepia"}
        onClick={() => setBgColor(bgColor === "sepia" ? "default" : "sepia")}
      />
      <Option
        label="Dyslexia font"
        active={dyslexiaMode}
        onClick={() => setDyslexiaMode(!dyslexiaMode)}
      />
      <Option
        label={isSpeaking ? "Stop reading" : "Read aloud"}
        active={isSpeaking}
        onClick={toggleSpeech}
      />
    </ul>
  );
};

function Option({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={styles.option}
        data-active={active}
        aria-pressed={active}
      >
        <span className={styles.optionDot} aria-hidden>·</span>
        {label}
      </button>
    </li>
  );
}
