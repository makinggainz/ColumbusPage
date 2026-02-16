"use client";

import { useEffect, useState } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function scrambled(text: string): string {
  return text
    .split("")
    .map((char) =>
      char === " "
        ? " "
        : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    )
    .join("");
}

export function ScrambleText({
  text,
  isActive,
  delay = 0,
  className = "",
  letterDelayMs = 20,
}: {
  text: string;
  isActive: boolean;
  delay?: number;
  className?: string;
  /** Delay between revealing each letter (higher = more typewriter-like). */
  letterDelayMs?: number;
}) {
  const [displayText, setDisplayText] = useState(() =>
    isActive ? scrambled(text) : text
  );

  useEffect(() => {
    if (!isActive) return;

    let iteration = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) return text[index];
              return SCRAMBLE_CHARS[
                Math.floor(Math.random() * SCRAMBLE_CHARS.length)
              ];
            })
            .join("")
        );

        iteration += 1;

        if (iteration >= text.length) {
          if (interval) clearInterval(interval);
          setDisplayText(text);
        }
      }, letterDelayMs);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [delay, isActive, text, letterDelayMs]);

  return (
    <span className={className || "font-mono"}>
      {isActive ? displayText : text}
    </span>
  );
}
