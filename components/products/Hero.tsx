"use client";

import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import glassStyles from "@/components/ui/GlassButton.module.css";
import { ConsumerEnterpriseToggle } from "@/components/enterprise/ConsumerEnterpriseToggle";
import ShowcaseSection from "@/components/products/ShowcaseSection";

const CANVAS_W     = 1728;
const CANVAS_H     = 1756;


export default function Hero() {
  const [heroReady,      setHeroReady]      = useState(false);
  const [logoVisible,    setLogoVisible]    = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [bgExpanded,     setBgExpanded]     = useState(false);
  const [phoneVisible,   setPhoneVisible]   = useState(false);
  const [isLg,           setIsLg]           = useState(true); // SSR default: desktop

  const phoneRef              = useRef<HTMLDivElement>(null);
  const phoneSpringWrapperRef = useRef<HTMLDivElement>(null);
  const phoneSpringRef        = useRef({ offset: 0, velocity: 0 });
  const lastScrollYRef        = useRef(0);
  const scrollYRef            = useRef(0);

  // Transition refs
  const outerContainerRef       = useRef<HTMLDivElement>(null);
  const sectionRef              = useRef<HTMLElement>(null);
  const bgRef                   = useRef<HTMLDivElement>(null);
  const toggleRef               = useRef<HTMLDivElement>(null);
  const badgeTitleRef           = useRef<HTMLDivElement>(null);
  const transitionPhoneRef      = useRef<HTMLDivElement>(null);
  const showcaseOverlayRef      = useRef<HTMLDivElement>(null);
  const phoneStartCapturedRef   = useRef(false);
  const phoneStartXRef          = useRef(0);
  const phoneStartYRef          = useRef(0);
  const phoneDisplayWRef        = useRef(0);
  const phoneDisplayHRef        = useRef(0);
  const phoneEndCapturedRef     = useRef(false);
  const phoneEndXRef            = useRef(0);
  const phoneEndYRef            = useRef(0);
  const phoneEndWRef            = useRef(0);
  const phoneEndHRef            = useRef(0);
  const phoneEndElRef           = useRef<HTMLElement | null>(null);
  const scrollStopTimerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollDeltaRef      = useRef(0);
  const peakRawRef              = useRef(0);
  const mountedRef              = useRef(true);
  const isSnappingRef           = useRef(false);

  // Responsive breakpoint — conditional render for mobile vs desktop
  useEffect(() => {
    const check = () => setIsLg(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Staged entrance animation sequence
  useEffect(() => {
    const t0 = setTimeout(() => setHeroReady(true),      80);
    const t1 = setTimeout(() => setLogoVisible(true),    500);
    const t2 = setTimeout(() => setTaglineVisible(true), 900);
    const t3 = setTimeout(() => setBgExpanded(true),     1300);
    const t4 = setTimeout(() => setPhoneVisible(true),   1500);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  // Click phone → scroll to product display (transition endpoint)
  const handlePhoneClick = useCallback(() => {
    const el = outerContainerRef.current;
    if (!el) return;
    const isMobile = window.innerWidth < 1024;
    const extraPx = window.innerHeight * (isMobile ? 1 : 2);
    const target = el.offsetTop + extraPx;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  // Phone floating spring loop
  useEffect(() => {
    const STIFFNESS = 0.055;
    const DAMPING   = 0.80;
    let raf: number;
    const loop = () => {
      const s = phoneSpringRef.current;
      s.velocity += (0 - s.offset) * STIFFNESS;
      s.velocity *= DAMPING;
      s.offset   += s.velocity;
      if (phoneSpringWrapperRef.current) {
        phoneSpringWrapperRef.current.style.transform = `translateY(${s.offset}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);


  // Merged scroll handler: physics impulse + transition animation
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      const y     = window.scrollY;
      const delta = y - lastScrollYRef.current;
      lastScrollYRef.current      = y;
      scrollYRef.current          = y;
      lastScrollDeltaRef.current  = delta;
      phoneSpringRef.current.velocity += delta * 0.28;

      // Transition progress
      const el = outerContainerRef.current;
      if (!el) return;
      const rect    = el.getBoundingClientRect();
      const isMobile = window.innerWidth < 1024;
      const extraPx = window.innerHeight * (isMobile ? 1 : 2);
      const raw     = Math.max(0, Math.min(1, -rect.top / extraPx));

      const origPhone = phoneRef.current;

      // Track peak transition progress for scroll-back intent detection
      if (raw > peakRawRef.current) peakRawRef.current = raw;

      const nearZero = raw < 0.005;

      // Reset when user scrolls back to top
      if (nearZero) {
        peakRawRef.current = 0;
        phoneStartCapturedRef.current = false;
        phoneEndCapturedRef.current   = false;
        if (phoneEndElRef.current) { phoneEndElRef.current.style.opacity = "0"; phoneEndElRef.current = null; }
        if (phoneSpringWrapperRef.current) phoneSpringWrapperRef.current.style.opacity = "1";
        const tp = transitionPhoneRef.current;
        if (tp) tp.style.display = "none";
        if (toggleRef.current)    toggleRef.current.style.opacity    = "1";
        if (badgeTitleRef.current) badgeTitleRef.current.style.opacity = "1";
        const so = showcaseOverlayRef.current;
        if (so) { so.style.opacity = "0"; so.style.display = "none"; }
        return;
      }

      // Capture phone starting position (once, first frame of transition)
      if (!phoneStartCapturedRef.current && origPhone) {
        const pr = origPhone.getBoundingClientRect();
        phoneStartXRef.current    = pr.left;
        phoneStartYRef.current    = pr.top;
        phoneDisplayWRef.current  = pr.width;
        phoneDisplayHRef.current  = pr.height;
        phoneStartCapturedRef.current = true;
      }

      // Fade out toggle + title
      const contentFade = Math.max(0, 1 - raw * 3.5);
      if (toggleRef.current)     toggleRef.current.style.opacity     = String(contentFade);
      if (badgeTitleRef.current) badgeTitleRef.current.style.opacity  = String(contentFade);

      // Hide original phone spring wrapper
      if (phoneSpringWrapperRef.current) phoneSpringWrapperRef.current.style.opacity = "0";

      // Ensure showcase overlay is in DOM (display:block) early enough for position capture.
      // Opacity stays 0 until raw=0.60; display switches at raw=0.40 so getBoundingClientRect works.
      const so = showcaseOverlayRef.current;
      if (so) {
        if (raw >= 0.40 && so.style.display === "none") so.style.display = "block";
      }

      // Move + fade transition phone — 3-phase smooth movement
      const tp = transitionPhoneRef.current;
      if (tp && phoneStartCapturedRef.current) {
        // Capture final phone position from ShowcaseSection (once, after overlay is block)
        if (!phoneEndCapturedRef.current && raw >= 0.40) {
          const endEl = document.querySelector<HTMLElement>('[data-showcase-phone]');
          if (endEl) {
            const r = endEl.getBoundingClientRect();
            if (r.width > 0) {
              phoneEndXRef.current = r.left;
              phoneEndYRef.current = r.top;
              phoneEndWRef.current = r.width;
              phoneEndHRef.current = r.height;
              phoneEndElRef.current = endEl;
              phoneEndCapturedRef.current = true;
            }
          }
        }

        const startX = phoneStartXRef.current;
        const startY = phoneStartYRef.current;
        const startW = phoneDisplayWRef.current;
        const startH = phoneDisplayHRef.current;
        const midX   = window.innerWidth  / 2 - startW / 2;
        const midY   = window.innerHeight / 2 - startH / 2;
        const endX   = phoneEndXRef.current;
        const endY   = phoneEndYRef.current;
        const endW   = phoneEndWRef.current;
        const endH   = phoneEndHRef.current;

        let curX: number, curY: number, curW: number, curH: number, curRadius: number;

        // Border radius: hero phone = 55px, final showcase phone = 38px in canvas coords
        const startRadius = 55;
        const endRadius   = endW > 0 ? 38 * (endW / 275) : startRadius;

        if (raw <= 0.45 || endW === 0) {
          // Phase 1: hero → center (size and radius hold at hero values)
          // Also stay in phase 1 if end position hasn't been captured yet (endW === 0)
          const t = Math.min(1, raw / 0.45);
          const e = 1 - Math.pow(1 - t, 3);
          curX = startX + (midX - startX) * e;
          curY = startY + (midY - startY) * e;
          curW = startW;
          curH = startH;
          curRadius = startRadius;
        } else {
          // Phase 2: center → final canvas position, shrinking + corner radius matching
          const t = Math.min(1, (raw - 0.45) / 0.35);
          const e = 1 - Math.pow(1 - t, 3);
          curX = midX + (endX - midX) * e;
          curY = midY + (endY - midY) * e;
          curW = startW + (endW - startW) * e;
          curH = startH + (endH - startH) * e;
          curRadius = startRadius + (endRadius - startRadius) * e;
        }

        // Phase 3: instant hide once phone reaches final position
        const phoneOpacity = raw >= 0.80 ? 0 : 1;

        tp.style.display   = "block";
        tp.style.width     = `${curW}px`;
        tp.style.height    = `${curH}px`;
        tp.style.left      = `${curX}px`;
        tp.style.top       = `${curY}px`;
        tp.style.opacity   = String(phoneOpacity);
        tp.style.transform = "none";

        // Animate corner radius on image and glass border
        const phoneImg = tp.querySelector<HTMLElement>('img');
        if (phoneImg) phoneImg.style.borderRadius = `${curRadius}px`;
        const glassBorder = tp.querySelector<HTMLElement>(':scope > div');
        if (glassBorder) glassBorder.style.borderRadius = `${curRadius + 12}px`;
      }

      // Showcase overlay fades in (60%–80%)
      if (so) {
        const showcaseT = Math.max(0, Math.min(1, (raw - 0.60) / 0.20));
        so.style.opacity       = String(showcaseT);
        // Enable pointer events once overlay is mostly visible (raw >= 0.75)
        // so users can tap pills before transition is 100% complete.
        // Touch-action: pan-y ensures vertical scrolling still works through the overlay.
        so.style.pointerEvents = raw >= 0.75 ? "auto" : "none";
        so.style.touchAction   = "pan-y";
      }

      // Reveal static showcase phone once transition phone reaches final position (raw >= 0.80)
      const staticPhone = phoneEndElRef.current;
      if (staticPhone) {
        staticPhone.style.opacity = raw >= 0.80 ? "1" : "0";
      }

      // ── Snap: never leave user stranded mid-transition ──
      // Any time the user stops scrolling between raw=0 and raw=1, snap to the
      // nearest end state. Direction is chosen by intent:
      //   Desktop: peak-raw scroll-back distance (< 0.15 = forward, else backward)
      //   Mobile:  past halfway + last delta forward = forward, else backward
      if (scrollStopTimerRef.current) clearTimeout(scrollStopTimerRef.current);
      if (raw > 0.005 && raw < 0.995 && !isSnappingRef.current) {
        const snapDelay = isMobile ? 400 : 350;
        scrollStopTimerRef.current = setTimeout(() => {
          scrollStopTimerRef.current = null;
          if (!mountedRef.current) return;
          const container = outerContainerRef.current;
          if (!container) return;
          const r2     = container.getBoundingClientRect();
          const extra  = window.innerHeight * (isMobile ? 1 : 2);
          const curRaw = Math.max(0, Math.min(1, -r2.top / extra));
          if (curRaw <= 0.005 || curRaw >= 0.995) return; // already at an end state

          // Strong bias toward forward (showcase). Only snap backward if
          // the user has very deliberately scrolled most of the way back.
          let snapForward: boolean;
          if (isMobile) {
            snapForward = curRaw >= 0.25;
          } else {
            // Desktop: only snap backward if user is back below 20% raw
            // (i.e. nearly all the way back to the hero)
            snapForward = curRaw >= 0.20;
          }

          isSnappingRef.current = true;
          const elementDocTop = window.scrollY + r2.top;
          if (snapForward) {
            window.scrollTo({ top: elementDocTop + extra, behavior: "smooth" });
          } else {
            window.scrollTo({ top: elementDocTop, behavior: "smooth" });
          }
          // Clear snapping flag after smooth scroll completes
          setTimeout(() => { isSnappingRef.current = false; }, 600);
        }, snapDelay);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Invalidate cached positions on resize so they're recaptured at the new viewport size
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        phoneStartCapturedRef.current = false;
        phoneEndCapturedRef.current   = false;
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      if (scrollStopTimerRef.current) clearTimeout(scrollStopTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={outerContainerRef}
      data-hero-outer
      className="lg:h-[calc(100dvh+200dvh)] h-[calc(100dvh+100dvh)]"
      style={{ marginTop: -32 }}
    >
      {/* Mobile safe-area fill — beach bg behind entire viewport, fades in with hero expansion */}
      <div
        className="fixed inset-0 lg:hidden pointer-events-none"
        style={{
          backgroundImage: "url('/BeachLanding.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
          opacity: bgExpanded ? 1 : 0,
          transition: "opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      <section
        ref={sectionRef}
        className="sticky top-0 overflow-hidden flex justify-center"
        style={{
          height: "100dvh",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        {/* Background div — expands on scroll to push white borders outside overflow */}
        <div
          ref={bgRef}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/BeachLanding.png')",
            backgroundSize: bgExpanded ? "130% 130%" : "100% 100%",
            backgroundPosition: "center",
            clipPath: bgExpanded
              ? "inset(0px 0% 0px 0% round 0px)"
              : "inset(clamp(0px, 5vw, 100px) clamp(0px, 2vw, 5%) clamp(0px, 5vw, 100px) clamp(0px, 2vw, 5%) round clamp(0px, 3vw, 55px))",
            willChange: "clip-path, background-size",
            zIndex: 0,
            opacity: heroReady ? 1 : 0,
            transition: "opacity 0.8s ease-out, clip-path 0.9s cubic-bezier(0.4, 0, 0.2, 1), background-size 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* ═══ DESKTOP: Scaled canvas (lg+) ═══ */}
        {isLg && (
        <div
          className="origin-top"
          style={{
            width: 1728,
            height: 1756,
            transform: "scale(min(1, 100vw / 1728))",
            transformOrigin: "top center",
            flexShrink: 0,
          }}
        >
          <div className="relative w-[1728px] h-[1756px]">
            <div
              className="absolute top-[100px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[200px]"
              style={{ zIndex: 2 }}
            >
              <div ref={toggleRef} style={{
                opacity:   bgExpanded ? 1 : 0,
                transform: bgExpanded ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>
                <ConsumerEnterpriseToggle variant="light" active="consumer" />
              </div>
              <div ref={badgeTitleRef} className="flex flex-col items-center gap-[21px]">
                <div className={glassStyles.btn} style={{
                  width: 266, height: 43, padding: 0,
                  opacity:   bgExpanded ? 1 : 0,
                  transform: bgExpanded ? "translateY(0)" : "translateY(16px)",
                  transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
                }}>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>Only Available on Earth</span>
                </div>
                <div className="text-center">
                  <h1
                    className="flex items-center justify-center gap-3"
                    style={{
                      fontFamily: '"SF Compact", -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: 48,
                      fontWeight: 600,
                      opacity:   logoVisible ? 1 : 0,
                      filter:    logoVisible ? "blur(0px)" : "blur(8px)",
                      transform: logoVisible ? "translateY(0)" : "translateY(16px)",
                      transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <Image src="/MapsGPT-logo.png" alt="MapsGPT Logo" width={67} height={67} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }} />
                    <span style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(180,156,83,0.75) 40%, rgba(140,120,60,0.6) 100%)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                    }}>MapsGPT</span>
                  </h1>
                  <h2
                    className="text-[64px] font-bold leading-[140%] tracking-[-0.02em] flex items-center justify-center"
                    style={{
                      backgroundImage: "linear-gradient(to bottom, #00B1D4 40%, #F9C795 95%)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                      filter: taglineVisible ? "drop-shadow(0 0 100px rgba(255,255,255,1)) blur(0px)" : "blur(8px)",
                      opacity: taglineVisible ? 1 : 0,
                      transform: taglineVisible ? "translateY(0)" : "translateY(16px)",
                      transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >Travel Like a Boss</h2>
                </div>
              </div>
              <div className="mt-[100px]">
                <div ref={phoneSpringWrapperRef}>
                  <div ref={phoneRef} style={{
                    opacity: phoneVisible ? 1 : 0,
                    transform: phoneVisible ? "translateY(0)" : "translateY(60px)",
                    transition: "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}>
                    <div className="phone-clickable" style={{ position: "relative", display: "inline-block", cursor: "pointer", transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"} onPointerDown={(e) => { e.currentTarget.style.transition = "transform 0.12s cubic-bezier(0.22, 1, 0.36, 1)"; e.currentTarget.style.transform = "scale(0.95)"; }} onPointerUp={(e) => { e.currentTarget.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"; e.currentTarget.style.transform = "scale(1.06)"; setTimeout(() => { if (e.currentTarget) e.currentTarget.style.transform = "scale(1)"; }, 400); }} onClick={handlePhoneClick}>
                      <div style={{ position: "absolute", inset: -12, borderRadius: 67, background: "rgba(150, 225, 255, 0.20)", boxShadow: "0 -2px 10px rgba(0,0,0,0.15)", zIndex: -1 }} />
                      <Image src="/MapsGPTMobile.png" width={404} height={778} alt="Phone" priority style={{ borderRadius: 55, display: "block" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ═══ MOBILE: Flow layout (<lg) ═══ */}
        {!isLg && (
        <div className="relative z-[2] flex flex-col items-center text-center w-full h-full px-6" style={{ overflow: "visible" }}>
          {/* Toggle — pinned near top */}
          <div className="pt-24" ref={toggleRef} style={{
            opacity: bgExpanded ? 1 : 0,
            transform: bgExpanded ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            <ConsumerEnterpriseToggle variant="light" active="consumer" />
          </div>
          {/* Logo + tagline — positioned ~25% from top */}
          <div className="absolute left-0 right-0 flex flex-col items-center" style={{ top: "25%" }}>
            <div ref={badgeTitleRef} className="flex flex-col items-center gap-4">
              <div className="text-center">
                <h1
                  className="flex flex-col items-center justify-center gap-2"
                  style={{
                    fontFamily: '"SF Compact", -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: 36,
                    fontWeight: 600,
                    opacity: logoVisible ? 1 : 0,
                    filter: logoVisible ? "blur(0px)" : "blur(8px)",
                    transform: logoVisible ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Image src="/MapsGPT-logo.png" alt="MapsGPT Logo" width={60} height={60} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }} />
                  <span style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(180,156,83,0.75) 40%, rgba(140,120,60,0.6) 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                  }}>MapsGPT</span>
                </h1>
                <h2
                  className="text-[36px] sm:text-[48px] font-bold leading-[140%] tracking-[-0.02em]"
                  style={{
                    backgroundImage: "linear-gradient(to bottom, #00B1D4 40%, #F9C795 95%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    filter: taglineVisible ? "drop-shadow(0 0 80px rgba(255,255,255,1)) blur(0px)" : "blur(8px)",
                    opacity: taglineVisible ? 1 : 0,
                    transform: taglineVisible ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >Travel Like a Boss</h2>
              </div>
            </div>
          </div>
          {/* Phone — absolutely positioned at bottom center, only top peeks out */}
          <div className="absolute bottom-0 left-1/2" style={{ transform: "translateX(-50%)" }}>
            <div ref={phoneSpringWrapperRef}>
              <div ref={phoneRef} style={{
                opacity: phoneVisible ? 1 : 0,
                transform: phoneVisible ? "translateY(60%)" : "translateY(calc(60% + 40px))",
                transition: "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}>
                <div className="phone-clickable" style={{ position: "relative", display: "inline-block", cursor: "pointer", transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"} onPointerDown={(e) => { e.currentTarget.style.transition = "transform 0.12s cubic-bezier(0.22, 1, 0.36, 1)"; e.currentTarget.style.transform = "scale(0.95)"; }} onPointerUp={(e) => { e.currentTarget.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"; e.currentTarget.style.transform = "scale(1.06)"; setTimeout(() => { if (e.currentTarget) e.currentTarget.style.transform = "scale(1)"; }, 400); }} onClick={handlePhoneClick}>
                  <div style={{ position: "absolute", inset: -10, borderRadius: 50, background: "rgba(150, 225, 255, 0.20)", boxShadow: "0 -2px 10px rgba(0,0,0,0.15)", zIndex: -1 }} />
                  <Image src="/MapsGPTMobile.png" width={220} height={424} alt="Phone" priority className="sm:w-[280px] sm:h-auto" style={{ borderRadius: 42, display: "block" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Showcase overlay — fades in as phone fades out, inside sticky section */}
        <div
          ref={showcaseOverlayRef}
          style={{
            position: "absolute",
            top: -100,
            left: 0,
            right: 0,
            bottom: 0,
            display: "none",
            opacity: 0,
            zIndex: 10,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <ShowcaseSection onInteraction={() => {
            const container = outerContainerRef.current;
            if (!container) return;
            const r = container.getBoundingClientRect();
            const isMob = window.innerWidth < 1024;
            const extra = window.innerHeight * (isMob ? 1 : 2);
            const curRaw = Math.max(0, Math.min(1, -r.top / extra));
            if (curRaw >= 0.995) return; // already done
            const elementDocTop = window.scrollY + r.top;
            window.scrollTo({ top: elementDocTop + extra, behavior: "smooth" });
          }} />
        </div>
      </section>

      {/* Fixed transition phone — shown during scroll animation */}
      <div
        ref={transitionPhoneRef}
        style={{
          position: "fixed",
          display: "none",
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        {/* Glass border */}
        <div style={{
          position: "absolute",
          inset: -12,
          borderRadius: 67,
          background: "rgba(150, 225, 255, 0.20)",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.15)",
        }} />
        <Image
          src="/MapsGPTMobile.png"
          fill
          alt=""
          style={{ objectFit: "contain", borderRadius: 55 }}
        />
      </div>

    </div>
  );
}
