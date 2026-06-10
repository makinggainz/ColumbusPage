"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import styles from "./blog-subscribe.module.css";

type Phase = "idle" | "submitting" | "success" | "error";

/* The dot-arrow icon shared with the site's CTA buttons — same glyph
   used in the navbar and the contact page CtaButton. */
function ArrowDots() {
  return (
    <svg width="9" height="13" viewBox="0 0 9 13" fill="none" aria-hidden>
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46"  r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

interface Props {
  /** Which surface this form lives on — used to tag analytics events so
      you can compare conversion rates across placements in PostHog. */
  source: "blog_index" | "article_bottom";
  /** Slug of the current article, if rendered inside an article page. */
  articleSlug?: string;
  /** Extra Tailwind classes applied to the outer section wrapper —
      use to scope breakpoint visibility (e.g. "min-[1315px]:hidden"). */
  className?: string;
}

export function BlogSubscribeSection({ source, articleSlug, className = "" }: Props) {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  /* errorKey increments on each failed submit so the shake animation
     reruns even if the user hits Subscribe twice without clearing. */
  const [errorKey, setErrorKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const startedRef = useRef(false);

  const handleFocus = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      track.subscribeStarted(source, articleSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "submitting" || phase === "success") return;

    const emailDomain = email.trim().split("@")[1] ?? "unknown";
    track.subscribeSubmitted(source, emailDomain, articleSlug);
    setPhase("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source,
          pageUri: typeof window !== "undefined" ? window.location.href : undefined,
          pageName: "Blog",
        }),
      });
      if (!res.ok) throw new Error("failed");
      track.subscribeSuccess(source, articleSlug);
      setPhase("success");
      setEmail("");
    } catch {
      track.subscribeError(source, "api_error", articleSlug);
      setPhase("error");
      setErrorKey((k) => k + 1);
      setErrorMsg("Something went wrong — please try again.");
    }
  };

  const isSuccess = phase === "success";

  return (
    <section
      className={`mx-auto w-full max-w-[760px] px-5 md:px-6 pt-2 pb-16 md:pb-24 text-center ${className}`}
    >
      {/* Heading */}
      <h2 className={styles.bigHeading}>Stay in the loop</h2>

      {/* Form area — collapses out when success */}
      <div
        className={styles.transitionWrap}
        data-open={(!isSuccess).toString()}
      >
        <div className={styles.transitionInner}>
          <form
            onSubmit={handleSubmit}
            onFocus={handleFocus}
            className={styles.formCentered}
          >
            <div
              className={`${styles.pill} ${phase === "error" ? styles.pillError : ""}`}
              key={errorKey}
            >
              <input
                ref={inputRef}
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (phase === "error") setPhase("idle");
                }}
                className={styles.pillInput}
                placeholder="Enter your email"
                aria-label="Email address"
                disabled={phase === "submitting"}
                autoComplete="email"
              />
              <button
                type="submit"
                className={styles.pillBtn}
                disabled={phase === "submitting"}
                aria-label="Subscribe"
              >
                {phase === "submitting" ? (
                  <span className={styles.spinner} aria-hidden />
                ) : (
                  <>
                    Subscribe
                    <ArrowDots />
                  </>
                )}
              </button>
            </div>

            {phase === "error" && (
              <p
                className={`${styles.errorText} ${styles.errorTextCentered}`}
                role="alert"
              >
                {errorMsg}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Success area — expands in when success */}
      <div className={styles.transitionWrap} data-open={isSuccess.toString()}>
        <div className={styles.transitionInner}>
          <div
            className={`${styles.successBox} ${styles.successBoxCentered}`}
            role="status"
          >
            <span className={styles.checkCircle} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  className={styles.checkPath}
                  d="M3 8.2l3.2 3.2 7-7"
                  stroke="var(--color-accent)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className={`${styles.successText} ${styles.successTextCentered}`}>
              <span className={styles.successPrimary}>You&apos;re in!</span>
              <span className={styles.successSecondary}>
                Watch for updates from Columbus Earth in your inbox.
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Caption — value prop + legal, folded into one quiet line below
          the pill, mirroring the reference's single sub-caption. */}
      <p className={styles.caption}>
        New articles, research notes, and product updates — no noise.{" "}
        <Link href="/privacy">Privacy Policy</Link>. Unsubscribe anytime.
      </p>
    </section>
  );
}
