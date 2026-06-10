"use client";

import { Suspense, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";
import styles from "./waitlist.module.css";

type Product = "elio" | "columbus";
type Phase = "idle" | "submitting" | "success" | "error";

/* Per-product copy + imagery. Elio (consumer) uses the crisp homepage
   hero photo; Columbus (business) uses the aerial sky photo softened
   with a blur so the centered stack reads cleanly over it. */
const CONFIG: Record<
  Product,
  {
    heading: string;
    sub: string;
    bgImage: string;
    blur: boolean;
    success: string;
  }
> = {
  elio: {
    heading: "Join the Elio waitlist",
    sub: "Get early access",
    bgImage: "/ConsumerPgMedia/heroBackground.png",
    blur: false,
    success: "We'll email you the moment Elio is ready for you.",
  },
  columbus: {
    heading: "Join the Columbus waitlist",
    sub: "Get early access",
    bgImage: "/ColumbusBackgroundV2Enhanced.png",
    blur: true,
    success: "We'll email you the moment Columbus is ready for you.",
  },
};

/* The dot-arrow icon shared with the site's CTA buttons. */
function ArrowDots() {
  return (
    <svg width="9" height="13" viewBox="0 0 9 13" fill="none" aria-hidden>
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

function WaitlistInner() {
  const searchParams = useSearchParams();
  const product: Product =
    searchParams.get("product") === "columbus" ? "columbus" : "elio";
  const cfg = CONFIG[product];

  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  /* errorKey increments on each failed submit so the shake animation
     reruns even if the user hits Subscribe twice without clearing. */
  const [errorKey, setErrorKey] = useState(0);
  const startedRef = useRef(false);

  const handleFocus = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      track.waitlistStarted(product);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "submitting" || phase === "success") return;

    const emailDomain = email.trim().split("@")[1] ?? "unknown";
    track.waitlistSubmitted(product, emailDomain);
    setPhase("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: `waitlist_${product}`,
          pageUri: typeof window !== "undefined" ? window.location.href : undefined,
          pageName: "Waitlist",
        }),
      });
      if (!res.ok) throw new Error("failed");
      track.waitlistSuccess(product);
      setPhase("success");
      setEmail("");
    } catch {
      track.waitlistError(product, "api_error");
      setPhase("error");
      setErrorKey((k) => k + 1);
      setErrorMsg("Something went wrong — please try again.");
    }
  };

  const isSuccess = phase === "success";

  return (
    <main className={styles.screen}>
      {/* Full-bleed product photo */}
      <div className={`${styles.bg} ${cfg.blur ? styles.bgBlurred : ""}`}>
        <Image
          src={cfg.bgImage}
          alt=""
          aria-hidden
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={80}
          draggable={false}
          className={styles.bgImg}
        />
      </div>
      <div className={styles.scrim} aria-hidden />

      {/* Minimal top bar — wordmark + escape hatch */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.wordmark}>
          Columbus Earth
        </Link>
        <Link href="/" className={styles.close} aria-label="Back to home">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </div>

      {/* Centered sign-up stack */}
      <div className={styles.content}>
        <h1 className={styles.heading}>{cfg.heading}</h1>
        <p className={styles.sub}>{cfg.sub}</p>

        {/* Form — collapses out on success */}
        <div className={styles.transitionWrap} data-open={(!isSuccess).toString()}>
          <div className={styles.transitionInner}>
            <form onSubmit={handleSubmit} onFocus={handleFocus} className={styles.form}>
              <div
                className={`${styles.pill} ${phase === "error" ? styles.pillError : ""}`}
                key={errorKey}
              >
                <input
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
                  aria-label="Join the waitlist"
                >
                  {phase === "submitting" ? (
                    <span className={styles.spinner} aria-hidden />
                  ) : (
                    <>
                      Join waitlist
                      <ArrowDots />
                    </>
                  )}
                </button>
              </div>

              {phase === "error" && (
                <p className={styles.errorText} role="alert">
                  {errorMsg}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Success — expands in on success */}
        <div className={styles.transitionWrap} data-open={isSuccess.toString()}>
          <div className={styles.transitionInner}>
            <div className={styles.successBox} role="status">
              <span className={styles.checkCircle} aria-hidden>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    className={styles.checkPath}
                    d="M3 8.2l3.2 3.2 7-7"
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className={styles.successText}>
                <span className={styles.successPrimary}>You&apos;re on the list!</span>
                <span className={styles.successSecondary}>{cfg.success}</span>
              </span>
            </div>
          </div>
        </div>

        <p className={styles.caption}>
          We&apos;ll only email you about early access — no noise.{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
}

export function WaitlistExperience() {
  /* useSearchParams() requires a Suspense boundary in the App Router. */
  return (
    <Suspense fallback={null}>
      <WaitlistInner />
    </Suspense>
  );
}
