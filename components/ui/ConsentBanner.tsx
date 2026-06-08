"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { track } from "@/lib/analytics";

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
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "14px 20px",
        backgroundColor: "#0B1342",
        color: "#ffffff",
        fontSize: 13,
        lineHeight: 1.5,
      }}
    >
      <p style={{ margin: 0, maxWidth: "52rem" }}>
        We use cookies to understand how you use this site and improve your experience. Accepting enables session replay and persistent features.{" "}
        <a
          href="/company"
          style={{ color: "inherit", opacity: 0.7, textDecoration: "underline" }}
        >
          Learn more
        </a>
        .{" "}
        <span style={{ opacity: 0.55, fontSize: 11 }}>
          Consent requirements vary by jurisdiction — this is not legal advice.
        </span>
      </p>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button
          onClick={reject}
          style={{
            padding: "8px 18px",
            borderRadius: 9999,
            fontSize: 13,
            fontWeight: 500,
            border: "1px solid rgba(255,255,255,0.35)",
            background: "transparent",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          Reject
        </button>
        <button
          onClick={accept}
          style={{
            padding: "8px 18px",
            borderRadius: 9999,
            fontSize: 13,
            fontWeight: 500,
            border: "none",
            background: "#ffffff",
            color: "#0B1342",
            cursor: "pointer",
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
