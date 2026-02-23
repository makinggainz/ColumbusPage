"use client";

import { useEffect, useState } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function ScrambleText({
  text,
  isActive,
  delay = 0,
  className = "",
}: {
  text: string;
  isActive: boolean;
  delay?: number;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState(text);

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
      }, 20);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [delay, isActive, text]);

  return (
  <span className={className}>
    {isActive ? displayText : text}
  </span>
);
}
