import posthog from "posthog-js";

// ── Consent mode — change ONE line to switch: ──────────────────────────────
// cookieless_mode: "on_reject"  (CURRENT) Consent banner required. Accept =
//   full cookie-based tracking (session replay, identify, persistent flags).
//   Reject = cookieless mode (no persistent ID, no cross-session cohorts).
//   Best balance of privacy and analytics fidelity.
//
// cookieless_mode: "always"  No banner needed. BUT: loses session replay,
//   identify(), persistent feature flags, and inflates daily user counts
//   because each day creates a new anonymous user.
//
// Omit cookieless_mode entirely  Standard cookies, no banner. Simplest setup,
//   but requires explicit consent in the EU and many other jurisdictions.
//
// NOTE: Legal compliance depends on your jurisdiction and audience.
//   Confirm requirements with counsel before removing the consent banner.
// ──────────────────────────────────────────────────────────────────────────

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  cookieless_mode: "on_reject",
  capture_exceptions: true,
  // Heatmaps — click, scroll, and attention/hover maps per page. Populated
  // automatically once enabled; view them in PostHog › Heatmaps.
  enable_heatmaps: true,
  // Session recording — replay real visits to diagnose drop-off and rage clicks.
  // maskAllInputs redacts every <input> value server-side so PII never lands in
  // PostHog. Add data-ph-no-capture to any element that should be fully hidden.
  session_recording: {
    maskAllInputs: true,
  },
  debug: process.env.NODE_ENV === "development",
});
