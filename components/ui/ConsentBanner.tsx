"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { track } from "@/lib/analytics";
import styles from "./consent-banner.module.css";

const STORAGE_KEY = "ph_consent_choice";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function accept() {
    posthog.opt_in_capturing();
    // Fire after opt_in so the event is attributed to the full-cookie identity.
    track.consentChosen("accepted");
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function reject() {
    // Fire before opt_out — this is the last event PostHog will capture for
    // this visitor. After opt_out, all capture calls are silently dropped.
    track.consentChosen("rejected");
    posthog.opt_out_capturing();
    localStorage.setItem(STORAGE_KEY, "rejected");
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className={styles.banner}
    >
      <div className={styles.content}>
        <p className={styles.body}>
          We use optional analytics cookies to understand how you use our site
          so we can improve it.{" "}
          <Link href="/privacy" className={styles.link}>
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      <div className={styles.buttons}>
        <button onClick={accept} className={styles.btnAccept}>
          Accept all
        </button>
        <button onClick={reject} className={styles.btnReject}>
          Reject
        </button>
      </div>
    </div>
  );
}
