"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./ValuesTeam.module.css";

export type Cofounder = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

/**
 * "Our values" interactive team row.
 *
 * Four cofounder heads sit side by side. Hovering (or keyboard-focusing)
 * one draws a stick-figure body in beneath it — the circular photo reads
 * as the head, the freshly-sketched lines as the body — and swaps the
 * content above the row to that cofounder's quote. With nothing hovered
 * the content area shows the values `image` (the default state).
 */
export function ValuesTeam({
  cofounders,
  image,
}: {
  cofounders: Cofounder[];
  image: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const current = active === null ? null : cofounders[active];

  return (
    <div className={styles.team}>
      {/* Content above — the values image by default; a cofounder's quote
          while one is hovered/focused. */}
      <div className={styles.content}>
        {current ? (
          <>
            <svg
              className={styles.quoteMark}
              viewBox="0 0 40 31"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M11 2C15.97 2 20 6.03 20 11C20 15.97 15.97 20 11 20C9 23 7 26 3 29C6 24 4 18 2 11C2 6.03 6.03 2 11 2Z" />
              <path d="M31 2C35.97 2 40 6.03 40 11C40 15.97 35.97 20 31 20C29 23 27 26 23 29C26 24 24 18 22 11C22 6.03 26.03 2 31 2Z" />
            </svg>
            <p className={styles.quote}>{current.quote}</p>
          </>
        ) : (
          <div className={styles.valueImage}>
            <Image src={image} alt="" fill sizes="280px" />
          </div>
        )}
      </div>

      {/* Row of cofounder figures. */}
      <ul className={styles.row} onMouseLeave={() => setActive(null)}>
        {cofounders.map((c, i) => (
          <li key={c.name}>
            <button
              type="button"
              className={styles.figure}
              aria-label={`${c.name}, ${c.role}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              {/* Quiet name + role caption, revealed above the head on
                  hover/focus. */}
              <span className={styles.label}>
                <span className={styles.labelName}>{c.name}</span>
                <span className={styles.labelRole}>{c.role}</span>
              </span>
              <span className={styles.head}>
                <Image src={c.avatar} alt={c.name} fill sizes="140px" />
              </span>
              {/* Stick-figure body — strokes are dash-hidden until the
                  figure is hovered/focused, then they draw in. */}
              <svg
                className={styles.body}
                viewBox="0 0 90 96"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M45 0V20" />
                <path d="M45 20V56" />
                <path d="M45 28L16 46" />
                <path d="M45 28L74 46" />
                <path d="M45 56L23 94" />
                <path d="M45 56L67 94" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ValuesTeam;
