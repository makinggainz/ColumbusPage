import posthog from "posthog-js";

function capture(event: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  posthog.capture(event, props);
}

export const track = {
  // ── Conversion events ──────────────────────────────────────────────────────
  // Which CTA was clicked and on which page. Use `cta` values as the stable
  // identifier in PostHog funnels — change the label copy freely without
  // breaking historical data.
  ctaClicked: (cta: string, page: string) =>
    capture("cta_clicked", { cta, page }),

  // A visitor clicks "Book a demo" / "Talk to Founders" / similar. Fires on
  // the business page CTAs and on the contact form columbus-pro tab submit.
  demoRequested: (page?: string) =>
    capture("demo_requested", page ? { page } : undefined),

  // Contact form submitted (all tabs). `page` is the form's host page
  // ("contact" or "research"). Add extras for attribution properties
  // like heard_from or industry.
  contactSubmitted: (page: string, extras?: Record<string, unknown>) =>
    capture("contact_submitted", { page, ...extras }),

  // ── Engagement ────────────────────────────────────────────────────────────
  // Fires at 25 / 50 / 75 / 90% scroll depth — once per checkpoint per page
  // load. Use `percent` as the filter in PostHog funnels to build cohorts
  // like "reached the bottom" (percent = 90) or "scrolled past halfway".
  scrollDepth: (page: string, percent: 25 | 50 | 75 | 90) =>
    capture("scroll_depth", { page, percent }),

  // Fires when a user first focuses any field in a form. Pair with
  // contact_submitted in a PostHog funnel to measure form abandonment rate.
  formStarted: (form: string, page: string) =>
    capture("form_started", { form, page }),

  // ── Navigation & errors ───────────────────────────────────────────────────
  // Fires on every 404. A spike = broken deploy or dead inbound link.
  pageNotFound: (path: string) =>
    capture("page_not_found", { path }),

  // ── Consent ───────────────────────────────────────────────────────────────
  // Fire BEFORE opt_out on reject (last event PostHog sees from that visitor).
  // Fire AFTER opt_in on accept. Measures consent acceptance rate (spec §10).
  consentChosen: (choice: "accepted" | "rejected") =>
    capture("consent_chosen", { choice }),

  // ── Blog subscribe ────────────────────────────────────────────────────────
  // `source` identifies which surface the form lives on so you can compare
  // conversion rates across placements in PostHog.
  // `emailDomain` is the part after @ — never the full address.
  subscribeStarted: (source: "blog_index" | "article_bottom" | "article_sidebar", articleSlug?: string) =>
    capture("subscribe_started", { source, ...(articleSlug ? { article_slug: articleSlug } : {}) }),

  subscribeSubmitted: (source: "blog_index" | "article_bottom" | "article_sidebar", emailDomain: string, articleSlug?: string) =>
    capture("subscribe_submitted", { source, email_domain: emailDomain, ...(articleSlug ? { article_slug: articleSlug } : {}) }),

  subscribeSuccess: (source: "blog_index" | "article_bottom" | "article_sidebar", articleSlug?: string) =>
    capture("subscribe_success", { source, ...(articleSlug ? { article_slug: articleSlug } : {}) }),

  subscribeError: (source: "blog_index" | "article_bottom" | "article_sidebar", errorReason: string, articleSlug?: string) =>
    capture("subscribe_error", { source, error_reason: errorReason, ...(articleSlug ? { article_slug: articleSlug } : {}) }),

  // ── Waitlist ──────────────────────────────────────────────────────────────
  // Full-screen waitlist landing reached from the navbar "Try Elio" popout.
  // `product` distinguishes the Elio (consumer) and Columbus (business) flows.
  // `emailDomain` is the part after @ — never the full address.
  waitlistStarted: (product: "elio" | "columbus") =>
    capture("waitlist_started", { product }),

  waitlistSubmitted: (product: "elio" | "columbus", emailDomain: string) =>
    capture("waitlist_submitted", { product, email_domain: emailDomain }),

  waitlistSuccess: (product: "elio" | "columbus") =>
    capture("waitlist_success", { product }),

  waitlistError: (product: "elio" | "columbus", errorReason: string) =>
    capture("waitlist_error", { product, error_reason: errorReason }),

  // ── Outbound links ────────────────────────────────────────────────────────
  // PostHog autocapture records all clicks automatically, but this named event
  // lets you filter cleanly in funnels without parsing $current_url. Use for
  // external CTAs (app store, mapsgpt.es, social) when you want a purpose-named
  // event. Wire per-component as needed.
  outboundLinkClicked: (href: string, text: string, page: string) =>
    capture("outbound_link_clicked", { href, text, page }),
};
