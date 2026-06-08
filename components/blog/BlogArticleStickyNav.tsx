"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

import { track } from "@/lib/analytics";
import styles from "./blog-sticky-nav.module.css";
import subStyles from "./blog-subscribe.module.css";

export type BlogStickySection = {
  id: string;
  label: string;
};

type Props = {
  sections: BlogStickySection[];
  articleSlug?: string;
};

type SubPhase = "idle" | "submitting" | "success" | "error";

export function BlogArticleStickyNav({ sections, articleSlug }: Props) {
  const [logoHovered, setLogoHovered] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [pastEnd, setPastEnd] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dockHovered, setDockHovered] = useState(false);

  /* Compact subscribe widget state */
  const [subEmail, setSubEmail] = useState("");
  const [subPhase, setSubPhase] = useState<SubPhase>("idle");
  const [subErrorKey, setSubErrorKey] = useState(0);
  const subStartedRef = useRef(false);

  const handleSubFocus = () => {
    if (!subStartedRef.current) {
      subStartedRef.current = true;
      track.subscribeStarted("article_sidebar", articleSlug);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subPhase === "submitting" || subPhase === "success") return;
    const emailDomain = subEmail.trim().split("@")[1] ?? "unknown";
    track.subscribeSubmitted("article_sidebar", emailDomain, articleSlug);
    setSubPhase("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: subEmail.trim(),
          source: "article_sidebar",
          pageUri: typeof window !== "undefined" ? window.location.href : undefined,
          pageName: "Blog Article",
        }),
      });
      if (!res.ok) throw new Error("failed");
      track.subscribeSuccess("article_sidebar", articleSlug);
      setSubPhase("success");
      setSubEmail("");
    } catch {
      track.subscribeError("article_sidebar", "api_error", articleSlug);
      setSubPhase("error");
      setSubErrorKey((k) => k + 1);
    }
  };

  useEffect(() => {
    // Scope to the article's own footer, which lives inside <main>. A
    // plain `querySelector("footer")` instead matches the global reveal
    // footer (layout.tsx) — a position:fixed, full-height element pinned
    // to the viewport, so it reads as "intersecting" the moment this
    // effect runs and hides the dock on load.
    const footer = document.querySelector("main footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastEnd(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-10% 0% -80% 0%" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      className={`${styles.dock} ${pastEnd ? styles.dockHidden : ""} ${minimized ? styles.dockMinimized : ""}`}
      aria-label="Article navigation"
      style={{ opacity: scrolled && !dockHovered ? 0.5 : 1 }}
      onMouseEnter={() => setDockHovered(true)}
      onMouseLeave={() => setDockHovered(false)}
    >
      {/* Minimize/restore toggle — single button sitting in the top-right
          of the panel. When minimized the panel shrinks to a small circle
          centred on this button so clicking it (or the bubble itself)
          re-expands the panel. */}
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={() => setMinimized((m) => !m)}
        aria-label={minimized ? "Show table of contents" : "Minimize table of contents"}
        aria-expanded={!minimized}
      >
        {/* PanelLeftClose / PanelLeftOpen — a rounded sidebar rectangle
            with a vertical divider near the left and an inset chevron
            pointing the direction the panel will move. Matches the
            collapse/expand glyph used in chat-app sidebars. */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={styles.toggleBtnIcon}
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 3v18" />
          {minimized ? (
            <path d="m14 9 3 3-3 3" />
          ) : (
            <path d="m16 15-3-3 3-3" />
          )}
        </svg>
      </button>

      {/* All content lives inside .dockContent so it can be faded out
          atomically when the panel collapses. */}
      <div className={styles.dockContent} aria-hidden={minimized || undefined}>

      {/* Logo */}
      <Link
        href="/"
        className={styles.homeLink}
        onMouseEnter={() => setLogoHovered(true)}
        onMouseLeave={() => setLogoHovered(false)}
        onFocus={() => setLogoHovered(true)}
        onBlur={() => setLogoHovered(false)}
      >
        <span className={styles.logoGlyph}>
          <Image src="/logobueno.png" alt="Columbus Earth" fill sizes="32px" className="object-contain" priority />
        </span>
        <span className={styles.wordmarkClip} style={{ maxWidth: logoHovered ? 240 : 0 }}>
          <span
            className={styles.wordmarkText}
            style={{
              fontFamily: "var(--font-hero)",
              opacity: logoHovered ? 1 : 0,
            }}
          >
            Columbus Earth
          </span>
        </span>
      </Link>

      {/* Back */}
      <Link href="/blog" className={styles.back}>
        <svg className={styles.backArrow} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M10 4l-4 4 4 4" />
        </svg>
        Back to Blog
      </Link>

      {/* TOC — a vertical stepper: each section is a circle indicator
          on a continuous guide rail, with the section title to its right.
          Sections above the current reading position read as completed
          (filled accent circle + check), the current section is active
          (filled accent + inner dot), and sections below are pending
          (hollow circle). Visually mirrors the multi-step onboarding
          pattern but rendered on the page's neutral panel palette. */}
      {sections.length > 0 && (() => {
        // Before the scroll-spy observer fires, treat the first section
        // as active so the stepper isn't all-pending on initial paint.
        const matchIndex = sections.findIndex((x) => x.id === activeId);
        const activeIndex = matchIndex === -1 ? 0 : matchIndex;
        return (
        <div className={styles.tocSection}>
          <span className={styles.tocHeading}>On this page</span>
          <ul className={styles.tocList}>
            {sections.map((s, i) => {
              const status =
                i < activeIndex
                  ? "completed"
                  : i === activeIndex
                    ? "active"
                    : "pending";
              return (
                <li key={s.id} className={styles.tocStep}>
                  <a
                    href={`#${s.id}`}
                    className={`${styles.tocItem} ${status === "active" ? styles.tocItemActive : ""} ${status === "completed" ? styles.tocItemCompleted : ""}`}
                    aria-current={status === "active" ? "location" : undefined}
                  >
                    <span className={styles.tocCircle} data-status={status}>
                      {status === "completed" && (
                        <svg
                          className={styles.tocCheck}
                          viewBox="0 0 10 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M2 5.2l2 2 4-4.4" />
                        </svg>
                      )}
                      {status === "active" && (
                        <span className={styles.tocActiveDot} aria-hidden />
                      )}
                    </span>
                    <span className={styles.tocItemLabel}>{s.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        );
      })()}

      {/* ── Compact subscribe widget ─────────────────────────────────────
          Pinned to the bottom of the content column via margin-top:auto
          in .compactWidget. Fades out with the rest of dockContent when
          the panel is minimised. */}
      <div className={subStyles.compactWidget}>
        {subPhase !== "success" ? (
          <form className={subStyles.compactForm} onSubmit={handleSubscribe}>
            <input
              type="email"
              required
              value={subEmail}
              onChange={(e) => {
                setSubEmail(e.target.value);
                if (subPhase === "error") setSubPhase("idle");
              }}
              onFocus={handleSubFocus}
              className={`${subStyles.compactInput} ${subPhase === "error" ? subStyles.pillError : ""}`}
              key={subErrorKey}
              placeholder="your@email.com"
              aria-label="Email address for blog updates"
              disabled={subPhase === "submitting"}
              autoComplete="email"
            />
            <button
              type="submit"
              className={subStyles.compactBtn}
              disabled={subPhase === "submitting"}
            >
              {subPhase === "submitting" ? (
                <span className={subStyles.spinner} aria-hidden />
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        ) : (
          <div className={subStyles.compactSuccess} role="status">
            <span className={subStyles.checkCircle} aria-hidden>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  className={subStyles.checkPath}
                  d="M3 8.2l3.2 3.2 7-7"
                  stroke="var(--color-accent)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className={subStyles.compactSuccessText}>You&apos;re in!</span>
          </div>
        )}
      </div>

      </div>
    </nav>
  );
}
