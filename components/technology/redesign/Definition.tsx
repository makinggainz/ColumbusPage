"use client";

import { ReactNode, useId, useState } from "react";
import styles from "../technology.module.css";

type Props = {
  /** The visible highlighted phrase. */
  term: ReactNode;
  /** Title shown at the top of the popup. Defaults to `term`. */
  title?: string;
  /** Definition/explanation body. */
  children: ReactNode;
};

/**
 * Inline highlighted term with an on-brand definition popup.
 * Popup opens on hover (mouse) or focus (keyboard), matching the surrounding
 * frosted-glass treatment used throughout the technology page.
 */
export function Definition({ term, title, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span className={styles.definitionWrap}>
      <mark
        role="button"
        tabIndex={0}
        aria-describedby={isOpen ? tooltipId : undefined}
        className={styles.definitionTerm}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        {term}
      </mark>
      <span
        id={tooltipId}
        role="tooltip"
        className={`${styles.definitionPopup} ${
          isOpen ? styles.definitionPopupOpen : ""
        }`}
        aria-hidden={!isOpen}
      >
        <span className={styles.definitionPopupTitle}>
          {title ?? (typeof term === "string" ? term : "Definition")}
        </span>
        <span className={styles.definitionPopupBody}>{children}</span>
      </span>
    </span>
  );
}
