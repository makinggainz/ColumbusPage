"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

// Site-wide nav, ported verbatim from MistX (/Users/alexramirezblonski/
// Documents/MistX/components/nav/Nav.tsx) and adapted for ColumbusPage.
// Replaces the legacy <Navbar /> on every route. Adaptations:
//
//   • `bg-background`           → `bg-[#F1F5FE]`   (MistX pale-blue surface)
//   • `text-mistral-black`      → `text-[#1f1f1f]`
//   • `bg-mistral-black`        → `bg-[#1f1f1f]`
//   • `bg-mistral-beige-deep`   → `bg-[#DCE7FB]`
//   • `text-mistral-orange`     → `text-accent` (site accent — see --color-accent)
//   • `border-mistral-orange`   → `border-accent`
//   • `md:container`            → `max-w-[1287px] w-[calc(100%-2.5rem)] mx-auto`
//                                 (matches this project's content bounds; the calc
//                                 trick keeps the row 40px narrower than the viewport
//                                 — i.e. 20px gutter on each side — at every width,
//                                 so the logo / "Try Elio" CTA never touch the
//                                 viewport edge in the 768–1327px range where the
//                                 old `mx-5 → md:mx-auto` flip collapsed to a zero
//                                 gutter)
// Behavior, markup, ARIA semantics, hover/scroll dynamics are unchanged.
// Internal link `/business` is repointed to `/products/business` (the
// actual route on this project — a Next.js redirect would normalize the
// original but the direct link avoids a 308 hop).

// Flat top-level nav links — no submenus. The previous Products /
// Research / Blog / Company dropdowns were collapsed into direct
// destinations. The only remaining dropdown lives on the right-side
// "Try Elio" CTA below.
const navLinks: { label: string; href: string }[] = [
  { label: "Consumer", href: "/products/consumer" },
  { label: "Business", href: "/products/business" },
  // Points at the Technology page — the LGM / research content lives there.
  { label: "Research", href: "/research" },
  { label: "Blog", href: "/blog" },
  { label: "Company", href: "/company" },
];

// Mobile drawer adds Contact to the desktop set — Contact has its own
// page (app/contact/page.tsx) and is a key destination on mobile where
// the desktop "contact@columbus.earth" mailto link in the footer is
// further off-screen. Keeps every entry pointed at a real route in
// /app so the drawer never advertises a 404.
const MOBILE_NAV: { label: string; href: string }[] = [
  ...navLinks,
  { label: "Contact", href: "/contact" },
];

// "Try Elio" launcher items. Each row renders name + one-line
// description — the content (labels / descriptions / hrefs) is
// unchanged. The dropdown UI + animation below is modelled on
// todesktop.com's "Products" nav menu: a dark glassy translucent
// panel (rgba(15,7,29,0.78) + backdrop-blur), 14px radius, a layered
// shadow with inset white top-edge highlights, light text on dark,
// and a fade + scale-from-top entrance with a per-row stagger.
export const elioMenuItems: { label: string; href: string; desc: string }[] = [
  { label: "Try Elio", href: "/products/consumer", desc: "Consumer travel reasoning" },
  { label: "Try Columbus", href: "/products/business", desc: "Business geospatial intelligence" },
];

/**
 * The double-stacked arrow icon MistX uses on every nav item — slides up
 * on hover (the chevron column rotates inside an h-3 overflow-hidden box).
 */
export function NavArrowStack({ className = "" }: { className?: string }) {
  return (
    <div className={"h-3 overflow-hidden relative " + className}>
      <div className="h-6 flex flex-col transition-transform duration-200 group-hover:-translate-y-3">
        <ArrowDot className="rotate-90" />
        <ArrowDot className="-rotate-90" />
      </div>
    </div>
  );
}

export function ArrowDot({ className = "" }: { className?: string }) {
  return (
    <svg
      className={"size-3 shrink-0 transition-transform duration-300 " + className}
      width="24"
      viewBox="0 0 9 13"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

export function MistxNav({
  heroWhite = false,
  heroLight = false,
  heroTint,
  lightCta = false,
  darkBackdrop = false,
}: {
  heroWhite?: boolean;
  heroLight?: boolean;
  /**
   * Like `heroLight`, but with a caller-supplied scrim colour instead of
   * the MapsGPT stage colour. Set it to the hero's surface colour and the
   * navbar floats transparent at the top of the page, then fades in a
   * masked gradient-opacity scrim of this colour while scrolling over the
   * hero (the Research page uses it — see app/research / TechnologyPage).
   */
  heroTint?: string;
  /**
   * Invert the "Try Elio" CTA to a white pill with black text while the
   * navbar contents are in light mode (lightNav=true) — i.e., while
   * floating over a dark/photo hero. Once the navbar pins with its
   * solid-white backdrop, the CTA reverts to the standard navy fill so
   * it doesn't disappear into the backdrop. Opt-in per page (consumer
   * uses it; other pages keep the default navy CTA). */
  lightCta?: boolean;
  /**
   * Replace the navbar's default white/transparent backdrop with an
   * ALWAYS-visible dark gradient (opaque-ish at the top, fading to
   * transparent at the navbar's bottom edge). When set, the white
   * solid backdrop never paints, the heroWhite/heroLight scrims are
   * suppressed, and nav contents stay in light (white) mode at every
   * scroll position. Consumer page only — paired with a photo hero
   * where the navbar must read on a dark band regardless of scroll. */
  darkBackdrop?: boolean;
} = {}) {
  const [elioOpen, setElioOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // True while the navbar is still in flow (not stuck to the viewport
  // top). While in flow on a hero page, the navbar stays transparent so
  // the hero image reads through. The moment its top edge reaches
  // viewport y=0 the navbar sticks, swaps to a solid white backdrop,
  // and the hairline divider appears. Pages without the hero marker
  // render the white backdrop on every scroll position.
  const [stuck, setStuck] = useState(false);
  // Optimistic default: assume a hero exists so home doesn't flash a
  // white backdrop on first paint. The effect below re-checks on mount
  // and flips this off on non-hero pages.
  const [hasHero, setHasHero] = useState(true);
  // True while the navbar still overlaps the hero section (the hero's
  // bottom edge is below the navbar's, minus a lead offset). Business-
  // only — drives the sky-tinted gradient scrim, which applies only
  // while over the hero.
  const [overHero, setOverHero] = useState(false);
  // MapsGPT-only: the hero's sticky scroll stage swaps its backdrop colour
  // through three scenes (cream → navy → white). Hero broadcasts the active
  // scene via a `mapsgpt-hero-phase` event; the navbar mirrors that colour
  // so it reads as a seamless continuation of the stage behind it. 0 is the
  // cream intro; 1/2/3 are the cream / navy / white scenes.
  const [heroPhase, setHeroPhase] = useState(0);
  // When a takeover-capable IndustryStickyNavbar is visible on the page,
  // it dispatches `industry-sticky-shown` events; this state mirrors
  // those so the main navbar can slide itself out and let the sub-navbar
  // occupy the top slot alone. No-op on pages without that sub-navbar.
  const [industryHidden, setIndustryHidden] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setHasHero(!!document.querySelector("[data-hero-section]"));
    let raf = 0;
    const apply = () => {
      // The #FFFFFF backdrop appears the instant the user scrolls. At the
      // exact top of a hero page (scrollY === 0) the navbar stays
      // transparent so the hero image reads through it to the top of the
      // card; any scroll at all swaps the solid backdrop in.
      setStuck(window.scrollY > 0);
      // Is the navbar still in front of the hero? True while the hero's
      // bottom edge sits below the navbar's lower edge. The +LEAD offset
      // flips this false a little *before* the hero fully clears the
      // navbar, so the classic solid white backdrop takes over sooner.
      const SCRIM_EXIT_LEAD = 80;
      const heroEl = document.querySelector("[data-hero-section]");
      const headerEl = headerRef.current;
      setOverHero(
        !!heroEl &&
          !!headerEl &&
          heroEl.getBoundingClientRect().bottom >
            headerEl.getBoundingClientRect().bottom + SCRIM_EXIT_LEAD,
      );
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        apply();
        raf = 0;
      });
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // MapsGPT-only: track the hero's sticky-stage scene so the navbar
  // backdrop can recolour to match it. Wired up when `heroLight` OR
  // `darkBackdrop` is set — the consumer page uses darkBackdrop in a
  // scene-aware way (dark gradient during phase 0 over the photo header,
  // then scene-color scrim during phases 1–3 in the sticky stage).
  useEffect(() => {
    if (!heroLight && !darkBackdrop) return;
    const onPhase = (e: Event) =>
      setHeroPhase((e as CustomEvent<number>).detail ?? 0);
    window.addEventListener("mapsgpt-hero-phase", onPhase);
    return () => window.removeEventListener("mapsgpt-hero-phase", onPhase);
  }, [heroLight, darkBackdrop]);

  // Listen for the takeover signal from IndustryStickyNavbar (business
  // page). When the sub-navbar is showing, hide the main navbar; when it
  // hides, the main navbar slides back in. Pages without that sub-
  // navbar never fire this event, so this is a no-op everywhere else.
  useEffect(() => {
    const onIndustry = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      setIndustryHidden(!!detail);
    };
    window.addEventListener("industry-sticky-shown", onIndustry);
    return () => window.removeEventListener("industry-sticky-shown", onIndustry);
  }, []);

  // Lock page scroll while the mobile drawer is open. CRITICAL: we lock
  // <html> only, NOT <body>. Setting `overflow: hidden` on <body> turns
  // it into a scroll container per CSS spec, which makes the sticky
  // navbar use <body> instead of the viewport as its scroll context.
  // <body> doesn't actually scroll, so the navbar's stickiness collapses
  // and it falls back to its natural top-of-document position — which
  // is scrolled off-screen when the user is anywhere but page top. That
  // showed up as the navbar (logo + close X) "disappearing" the moment
  // the drawer opened after scrolling.
  useEffect(() => {
    if (!mobileOpen) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Drive the drawer's accent-tinted halo via `data-mobile-menu-open`
  // on <html>. The attribute resolves `--nav-mobile-shadow` to its
  // visible (alpha-non-zero) variant — see globals.css. We flip it
  // on the NEXT frame so the browser commits the alpha-0 starting
  // state first, then the drawer's `transition: box-shadow 1100ms …`
  // eases the halo in. Mirrors the first-paint flow PageFrame uses
  // for `data-page-mounted`.
  useEffect(() => {
    const html = document.documentElement;
    if (!mobileOpen) {
      html.removeAttribute("data-mobile-menu-open");
      return;
    }
    const raf = window.requestAnimationFrame(() => {
      html.setAttribute("data-mobile-menu-open", "");
    });
    return () => {
      window.cancelAnimationFrame(raf);
      html.removeAttribute("data-mobile-menu-open");
    };
  }, [mobileOpen]);

  const showBackdrop = stuck || !hasHero;
  // When `heroWhite` is set (business page), the nav contents render in
  // white while the navbar floats transparently over the hero image, then
  // revert to the default dark colors once the white backdrop pins on
  // scroll — white-on-white would otherwise be invisible. The "Try Elio"
  // CTA keeps its filled navy pill in both states.
  // On the business hero the nav contents stay white the whole time
  // the navbar is in front of the hero — at the top (transparent) and
  // while scrolling over it (sky-tinted gradient scrim below). They
  // revert to the default dark colours only once the hero has scrolled
  // out and the solid white backdrop pins.
  // White nav contents on the business hero (white-on-image), and on the
  // MapsGPT hero while its navy mid-scene sits behind the navbar — dark
  // text would be invisible against #063140.
  // True while the dark-gradient navbar backdrop is actively painted
  // (consumer page). It stays on while the navbar floats over the
  // hero, then fades off once the navbar pins above the next
  // (white-backed) section so the navbar can swap to the normal
  // white backdrop and the dark text returns.
  // The dark navbar gradient now only paints during phase 0 (over the
  // photo hero header). During the sticky stage (phase 1–3) the scene-
  // color scrim takes over so the navbar reads as part of each scene.
  const darkScrimActive = darkBackdrop && (!stuck || overHero) && heroPhase === 0;
  const lightNav =
    (heroWhite && (!stuck || overHero)) ||
    // In darkBackdrop mode the photo-backed scenes (phases 0, 1, 2)
    // get white nav contents so the logo / links / CTA read on the
    // imagery. Phase 3 is a pure-WHITE backdrop on the consumer page,
    // so the navbar flips back to dark contents there for legibility.
    // (heroLight legacy: only phase 2 was navy-dark enough to need
    // light nav contents.)
    (heroLight && overHero && heroPhase === 2) ||
    (darkBackdrop && overHero && heroPhase !== 3) ||
    darkScrimActive;
  // While the mobile drawer is open it paints a full-screen WHITE backdrop
  // behind the (transparent) header, so the header's logo / wordmark / X must
  // render dark to read against it — regardless of the page's lightNav state.
  // mobileOpen can only flip true via the lg:hidden hamburger, so on desktop
  // this is identical to lightNav and desktop behaviour is unchanged.
  const navContentLight = lightNav && !mobileOpen;

  // True exactly when the solid white nav backdrop is what the user sees
  // at the top of the viewport. Drives the iOS Safari Liquid Glass tint
  // (via `body::before` in globals.css) + the `<meta name="theme-color">`
  // so the browser chrome reads as a seamless continuation of the navbar
  // instead of a black slab pinned above a white bar. `darkScrimActive`
  // excludes the consumer-page dark gradient — when that's active the
  // navbar visually isn't white-backdrop even though `showBackdrop` is
  // true. `heroScrim` (business sky-tinted scrim) is intentionally left
  // in because it fades to transparent at the navbar's bottom edge, so
  // the chrome above it still reads white from the solid backdrop.
  const whiteBackdrop = showBackdrop && !darkScrimActive;

  // Mirror `whiteBackdrop` to `<html data-navbar-white>`. CSS in
  // globals.css (inside the mobile `body::before` block) reads this
  // attribute and flips the safe-area overlay from black to white.
  useEffect(() => {
    const html = document.documentElement;
    html.toggleAttribute("data-navbar-white", whiteBackdrop);
    return () => html.removeAttribute("data-navbar-white");
  }, [whiteBackdrop]);

  // Defense-in-depth: also flip the meta theme-color so non-Liquid-Glass
  // iOS (15–17) and Chrome Android — which read this directly instead of
  // sampling page content — get the same swap. The element is added in
  // app/layout.tsx with content="#000000" as the boot default.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", whiteBackdrop ? "#FFFFFF" : "#000000");
  }, [whiteBackdrop]);

  // Business-only: while scrolled ("on movement") AND the navbar still
  // overlaps the hero, the solid white backdrop is replaced by a scrim
  // tinted to the hero image's sky colour — opaque at the top, fading to
  // fully transparent at the navbar's bottom border. Once the hero
  // scrolls out from behind the navbar it reverts to the solid backdrop.
  // `heroLight` (the MapsGPT hero) reuses the float-over-hero mechanic
  // for a LIGHT hero: nav contents stay dark (lightNav stays false) and
  // the scrim is a pale sand tint instead of business' sky blue.
  const heroFloat = heroWhite || heroLight || heroTint != null || darkBackdrop;
  const heroScrim = heroFloat && stuck && overHero;
  const scrimRGB = "4,87,141";
  // MapsGPT sticky-stage scene colour — matches Hero's CREAM / NAVY / LIGHT
  // stops. A single solid that the navbar's masked scrim cross-fades
  // between via `background-color` (see the scrim div below). Phase 1 uses
  // the soft Elio-blue mid-stop (#E3F2FB) so the navbar reads as part of
  // Scene 1's light-blue band without going too saturated.
  // Phase 3 ("Save & share / Local guide") used to wear a pure-black
  // backdrop here; the consumer page now wants no navbar scrim at all over
  // scene 3, so phase 3 is excluded from the scene-scrim opacity below.
  // `heroTint` (Research page) overrides this with a fixed caller colour.
  const heroStageColor =
    heroTint ??
    (heroPhase === 2 ? "#0B1342" : "#E3F2FB");

  // Top-corner radius: matches the PageFrame card (35px) while the navbar
  // is at rest (sitting inside the card's rounded top corners), then
  // flattens to 0 once it pins flush with the viewport top — otherwise
  // the rounded corners would expose the body backdrop at the very top
  // edge while the navbar is stuck.
  const navCornerRadius = stuck ? "0px" : "var(--frame-radius, 35px)";

  return (
    <>
    <header
      ref={headerRef}
      className="sticky z-100 w-full"
      style={{
        // Pins flush with the viewport top when stuck (top: 0). The
        // page-frame's 9px top gutter is covered by the navbar's white
        // backdrop as it slides up — no gap appears between viewport top
        // and the stuck navbar. Top-corner radii still match the
        // PageFrame card while the navbar is at rest, then flatten so
        // the stuck navbar's edges go flush against the viewport.
        top: 0,
        // Inline zIndex + isolation make the navbar's stacking unambiguous
        // against the mobile drawer (z-40) below. Without these two, when
        // the navbar is "stuck" (scrolled) and the drawer animates in,
        // the drawer can paint over it — the morphing of position:sticky
        // and the drawer's transform/scale stacking-context combine in a
        // way the .z-100 utility alone doesn't guarantee. isolation:
        // isolate forces a fresh stacking context for the header so its
        // z-index is the authority over everything below it.
        zIndex: 100,
        isolation: "isolate",
        borderTopLeftRadius: navCornerRadius,
        borderTopRightRadius: navCornerRadius,
        // darkScrimActive owns the navbar's backdrop while the dark
        // gradient is visible (consumer page over the hero). Once the
        // navbar pins above the next section (overHero=false) the
        // dark scrim fades off and the standard backdrop logic kicks
        // back in, so the navbar can wear the white pin over white
        // content beneath.
        backgroundColor: mobileOpen
          ? "transparent"
          : darkScrimActive
            ? "transparent"
            : darkBackdrop && overHero && heroPhase === 3
              ? "#FFFFFF"
              : showBackdrop && !heroScrim
                ? "#FFFFFF"
                : "transparent",
        // Industry-picker takeover: slide up + fade out so the
        // sub-navbar (positioned at the same top slot) reads as a clean
        // replacement, no overlap. Returns to translateY(0) the moment
        // the sticky-zone scrolls out of view.
        transform: industryHidden ? "translateY(-110%)" : "translateY(0)",
        opacity: industryHidden ? 0 : 1,
        pointerEvents: industryHidden ? "none" : undefined,
        transition:
          "background-color 300ms ease, transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease",
      }}
      aria-hidden={industryHidden || undefined}
    >
      {/* Business hero-only backdrop. Sits behind the content row
          (z-0 vs the row's z-10). Tinted to the colour seen IN the navbar
          zone of the hero — the ColumBuzHero sky composited with
          BusinessHero's dark overlay (#04578D = rgb(4,87,141)) — so the
          navbar reads as a continuation of that backdrop. Fully opaque at the
          top, fading to transparent (alpha 0) exactly at the navbar's
          bottom border, so it blends into the real sky below with no
          hard edge. Driven by opacity so it cross-fades with the
          solid-white backdrop as the hero scrolls out. */}
      {heroWhite && !darkBackdrop && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 bottom-0"
          style={{
            zIndex: 0,
            borderTopLeftRadius: navCornerRadius,
            borderTopRightRadius: navCornerRadius,
            background: `linear-gradient(to bottom, rgba(${scrimRGB},1) 0%, rgba(${scrimRGB},0.55) 50%, rgba(${scrimRGB},0) 100%)`,
            opacity: heroScrim && !mobileOpen ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
        />
      )}
      {/* MapsGPT hero-only backdrop. A single solid fill masked to the
          same top-opaque → bottom-transparent fade as the business scrim,
          so it melts into the sticky stage with no hard edge. Its colour
          tracks the stage scene via `background-color` — a solid colour
          IS transitionable (a gradient `background` is not), so the scene
          change cross-fades cleanly with no muddy layer-stacking. The
          700ms cubic-bezier matches Hero's backdrop transition exactly,
          and Hero dispatches the scene change in the same tick as its own
          setState, so the two cross-fades start on the same frame. */}
      {(heroLight || heroTint != null || darkBackdrop) && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 bottom-0"
          style={{
            zIndex: 0,
            borderTopLeftRadius: navCornerRadius,
            borderTopRightRadius: navCornerRadius,
            backgroundColor: heroStageColor,
            maskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 50%, transparent 100%)",
            // In darkBackdrop mode the navbar stays FULLY TRANSPARENT
            // across every scene (consumer page spec) — no scene-color
            // scrim ever paints; the scene's own backdrop image shows
            // straight through. Other modes (heroLight, heroTint) keep
            // the original behaviour.
            opacity:
              !darkBackdrop && heroScrim && !mobileOpen ? 1 : 0,
            transition:
              "opacity 300ms ease, background-color 700ms cubic-bezier(0.44,0,0.56,1)",
          }}
        />
      )}
      {/* darkBackdrop — black gradient behind the navbar while it
          floats over the hero, so the white nav contents read clearly
          against any photo. Fades to transparent at the navbar's
          bottom edge; opacity tracks darkScrimActive so it disappears
          the moment the navbar pins above the next section. */}
      {darkBackdrop && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 bottom-0"
          style={{
            zIndex: 0,
            borderTopLeftRadius: navCornerRadius,
            borderTopRightRadius: navCornerRadius,
            // Halved from the previous 0.32 / 0.18 stops so the dark
            // scrim sits softer behind the navbar — still enough contrast
            // for white nav contents over the consumer hero photo, but
            // not visually heavy on the eye.
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.16) 0%, rgba(0, 0, 0, 0.09) 50%, rgba(0, 0, 0, 0) 100%)",
            opacity: darkScrimActive && !mobileOpen ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
        />
      )}
      {/* Content row — bounds match the page's content sections via
          the `width: calc(100% - 2.5rem)` trick: the row is always
          40px narrower than the viewport (= 20px gutter per side) up
          to a 1287px cap, then mx-auto centers. Holds the logo /
          "Try Elio" CTA off the viewport edge at every width,
          including the 768–1327px range where the old `mx-5
          md:mx-auto` pattern collapsed to a zero gutter. No inner
          padding so the logo's left edge and the CTA's right edge
          sit flush with the page's left/right content-bounds. */}
      <div className="max-w-[1287px] w-[calc(100%-2.5rem)] mx-auto flex items-center py-6 relative z-10">
        {/* Left: logo + wordmark — a single home link wrapping both, so
            the "Columbus Earth" text is clickable alongside the logo. */}
        <div className="flex-1 flex items-center">
          <a
            rel="home"
            aria-label="Home"
            className="relative z-10 flex items-center gap-3"
            href="/"
          >
            <span className="flex size-9.5 items-center justify-center">
              <img
                alt="Columbus Logo"
                width={38}
                height={38}
                decoding="async"
                className="object-contain transition-[filter] duration-300"
                style={{
                  color: "transparent",
                  filter: navContentLight
                    ? "brightness(0) invert(1)"
                    : "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)",
                }}
                src="/logobueno.png"
              />
            </span>
            <span
              className="h7 flex items-center font-semibold leading-none whitespace-nowrap"
              style={{
                fontFamily: "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: "1.25rem",
                fontWeight: 605,
                marginLeft: "-4px",
                position: "relative",
                top: "2px",
                color: navContentLight ? "#FFFFFF" : "#0F173C",
              }}
            >
              Columbus Earth
            </span>
          </a>
        </div>

        {/* Center: flat top-level links. webiaX-style pill hover, no
            submenus — each link goes directly to its destination. */}
        <nav
          className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`flex items-center p-m px-4 py-2 rounded-full transition-colors duration-200 ${
                lightNav
                  ? "text-white hover:bg-white/10"
                  : "text-[#1f1f1f] hover:bg-black/5"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: CTAs */}
        <div className="flex-1 flex items-center justify-end gap-2">
          {/* Contact */}
          <a
            target="_self"
            className={`group rounded-button px-5 py-2 p-m hidden md:flex items-center truncate gap-2 transition-colors bg-transparent ${
              navContentLight
                ? "text-white hover:bg-white/10"
                : "text-[#1f1f1f] hover:bg-black/5 hover:text-accent"
            }`}
            href="/contact"
          >
            Contact
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
              <ArrowDot className={navContentLight ? "text-white" : "text-accent"} />
            </span>
          </a>

          {/* Try Elio dropdown */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() => setElioOpen(true)}
            onMouseLeave={() => setElioOpen(false)}
          >
            <button
              className={`group cursor-pointer rounded-button px-5 py-2 p-m flex items-center gap-2 transition-colors hover:text-accent ${
                lightCta && navContentLight
                  ? "bg-white text-black"
                  : "bg-cta text-white"
              }`}
              aria-haspopup="menu"
              aria-expanded={elioOpen}
            >
              Try Elio
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                <NavArrowStack className="text-accent" />
              </span>
            </button>
            {/* Product picker dropdown — todesktop.com "Products" menu
                pattern. Outer wrapper sits flush with the button's
                bottom (no margin gap) and uses pt-2.5 to fold the
                visual gap into its own hit area — without this the
                cursor would cross dead space between button and panel,
                fire mouseleave on the parent, and snap the menu closed
                before reaching any item. The wrapper drives the panel
                fade + scale-from-top-right entrance; rows fade in with
                a per-row stagger. Always mounted so the transitions
                run on open/close. */}
            <div
              aria-hidden={!elioOpen}
              className="absolute right-0 top-full pt-2.5 w-[320px] z-50"
              style={{
                opacity: elioOpen ? 1 : 0,
                transform: elioOpen
                  ? "translateY(0) scale(1)"
                  : "translateY(-6px) scale(0.96)",
                transformOrigin: "top right",
                pointerEvents: elioOpen ? "auto" : "none",
                transition:
                  "opacity 300ms cubic-bezier(0.6,0.6,0,1), transform 300ms cubic-bezier(0.6,0.6,0,1)",
              }}
            >
              {/* Dark glassy panel — todesktop.com's dropdown surface:
                  translucent near-black fill + backdrop blur, 14px
                  radius, layered drop shadow with inset white highlights
                  along the top edge for the glassy lip. */}
              <div
                role="menu"
                className="p-1.5"
                style={{
                  backgroundColor: "#091345",
                  backdropFilter: "blur(20px) saturate(160%)",
                  WebkitBackdropFilter: "blur(20px) saturate(160%)",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow:
                    "rgba(9,1,20,0.06) 0px 8px 8px -3px, rgba(8,1,20,0.06) 0px 3px 3px -1.5px, rgba(8,1,20,0.04) 0px 2px 2px -1px, rgba(8,1,20,0.03) 0px 1px 1px -0.5px, rgba(8,1,20,0.03) 0px 0.5px 0.5px 0px, rgba(255,255,255,0.08) 0px -4px 12px -4px inset, rgba(255,255,255,0.06) 0px 1px 3px 0px inset, rgba(255,255,255,0.12) 0px 0.5px 0.5px 0px inset",
                }}
              >
                <ul>
                  {elioMenuItems.map((item, i) => (
                    <li key={item.label} role="none">
                      <a
                        role="menuitem"
                        href={item.href}
                        className="group flex items-start gap-3 px-3 py-2.5 rounded-[10px] transition-colors duration-150 hover:bg-white/8"
                        style={{
                          opacity: elioOpen ? 1 : 0,
                          transform: elioOpen
                            ? "translateY(0)"
                            : "translateY(4px)",
                          transition: `opacity 260ms cubic-bezier(0.6,0.6,0,1) ${
                            elioOpen ? 70 + i * 45 : 0
                          }ms, transform 260ms cubic-bezier(0.6,0.6,0,1) ${
                            elioOpen ? 70 + i * 45 : 0
                          }ms`,
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="p-m font-medium leading-snug text-white">{item.label}</div>
                          <div className="p-s leading-snug mt-0.5 text-white/50">{item.desc}</div>
                        </div>
                        <span className="mt-1 shrink-0 text-white/35 transition-transform group-hover:translate-x-0.5">
                          <ArrowDot />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile menu trigger — 2-bar hamburger + clean X swap (no
              morph animation). Bars are pill-shaped <rect>s with
              rx = height/2; opacity steps from 1.0 (top) to 0.7
              (bottom) for a soft visual hierarchy. */}
          <button
            className={`lg:hidden md:px-2 cursor-pointer ${navContentLight ? "text-white" : "text-[#0F173C]"}`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="12"
                viewBox="0 0 75 37.32"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  opacity="0.7"
                  x="0"
                  y="24.88"
                  width="74.64"
                  height="12.44"
                  rx="6.22"
                  fill="currentColor"
                />
                <rect
                  x="0"
                  y="0"
                  width="74.64"
                  height="12.44"
                  rx="6.22"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>

      {/* Mobile drawer — design-system-aligned, full-viewport card:
            • Covers the entire screen (top:0, bottom:0) and inherits the
              page-frame's corner radius via --frame-radius so it reads
              as the same rounded card the rest of the site lives inside.
            • Surface = --color-bg1 (pale page wash), ink = --color-ink.
            • Typography is built from the project's .h4 / .p-l / .p-m /
              .p-s utility classes (font-family, font-size, line-height
              all tokenised in globals.css) so every string in this
              drawer sits on the design-system scale.
            • Primary nav: large Funnel Display links (.h4), no divider
              hairlines — items breathe via vertical padding instead.
              Each row carries the site signature 5-dot ArrowDot in
              --color-accent at the right edge.
            • Two-column Contact + Social block sits below the nav.
            • Pinned bottom CTA reuses the desktop Try Elio styling.
          Routes are sourced from MOBILE_NAV so every entry points at
          a real /app route. Rendered as a SIBLING of <header> (not a
          child) so position:fixed escapes the header's transform-induced
          containing block — see the prior fix on this branch. */}
      {/* Drawer is ALWAYS MOUNTED so opacity/transform transitions run
          on close as well as open — same pattern the desktop Try Elio
          dropdown uses. Visibility is gated via opacity + pointerEvents.
          Animation matches the Try Elio panel: fade + translateY(-6px)
          scale(0.96) → identity, 300ms cubic-bezier(0.6,0.6,0,1),
          transformOrigin top-right (anchored to the hamburger). Inner
          rows fade up with a per-row 45ms stagger. */}
      <div
        className="lg:hidden fixed inset-0 z-40 flex flex-col overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          color: "var(--color-ink)",
          fontFamily: "var(--font-sans)",
          borderRadius: "var(--frame-radius, 35px)",
          // Accent halo — driven by `--nav-mobile-shadow` in globals.css,
          // which resolves to alpha-non-zero values once
          // `html[data-mobile-menu-open]` is set (see the useEffect
          // above). 4 layers (top + bottom + left + right) so the
          // drawer reads as a fully lifted card. Eases in with the same
          // 1100ms cubic-bezier curve as the PageFrame's first-paint
          // bloom so the two halos feel like siblings.
          boxShadow: "var(--nav-mobile-shadow, none)",
          opacity: mobileOpen ? 1 : 0,
          transform: mobileOpen
            ? "translateY(0) scale(1)"
            : "translateY(-6px) scale(0.96)",
          transformOrigin: "top right",
          pointerEvents: mobileOpen ? "auto" : "none",
          // Animation curve + durations mirror the BlogArticleStickyNav
          // sidebar's minimize/expand: 420ms cubic-bezier(0.22, 1, 0.36, 1)
          // on transform, 400ms on opacity, ease-out tail so the panel
          // settles in cleanly (vs. the prior dropdown-style snap).
          transition:
            "opacity 400ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        aria-label="Site navigation"
      >
        {/* Scrollable content area. overscrollBehavior: contain stops
            the inner scroll from chaining to the (locked) page when it
            reaches its top/bottom edge — important on iOS Safari where
            the rubber-band would otherwise tug the locked page. */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ overscrollBehavior: "contain" }}
        >
          <div
            className="mx-auto w-full px-6 pb-8"
            style={{ maxWidth: 1200, paddingTop: 96 }}
          >
            {/* ── Eyebrow + intro ──
                Stagger pattern matches the BlogArticleStickyNav sidebar:
                160ms fade-out on close (no delay), 220ms fade-in delayed
                220ms on open (so the panel itself reaches its final
                state before the content reveals). */}
            <div
              className="mb-10"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "translateY(0)" : "translateY(4px)",
                transition: mobileOpen
                  ? "opacity 220ms cubic-bezier(0.22, 1, 0.36, 1) 220ms, transform 220ms cubic-bezier(0.22, 1, 0.36, 1) 220ms"
                  : "opacity 160ms cubic-bezier(0.22, 1, 0.36, 1), transform 160ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <p
                className="p-l"
                style={{ color: "var(--color-ink)", maxWidth: "34ch" }}
              >
                Building the first Large Geospatial Model to answer the
                most difficult questions about our planet.
              </p>
            </div>

            {/* ── Primary nav — large Funnel Display links (.h4), no
                hairline separators. Reveal stagger matches the article
                sidebar timing: each row fades in at 220ms-delay-base
                plus a 45ms per-row stagger; on close every row fades
                out together over 160ms (no stagger) so the content
                clears quickly before the panel collapses. ── */}
            <nav aria-label="Mobile primary">
              <ul>
                {MOBILE_NAV.map((link, i) => (
                  <li
                    key={link.label}
                    style={{
                      opacity: mobileOpen ? 1 : 0,
                      transform: mobileOpen
                        ? "translateY(0)"
                        : "translateY(4px)",
                      transition: mobileOpen
                        ? `opacity 220ms cubic-bezier(0.22, 1, 0.36, 1) ${
                            260 + i * 45
                          }ms, transform 220ms cubic-bezier(0.22, 1, 0.36, 1) ${
                            260 + i * 45
                          }ms`
                        : "opacity 160ms cubic-bezier(0.22, 1, 0.36, 1), transform 160ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between py-3 transition-colors hover:text-accent"
                    >
                      <span
                        className="h4"
                        style={{ letterSpacing: "-0.015em" }}
                      >
                        {link.label}
                      </span>
                      <span
                        className="shrink-0 text-accent transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      >
                        <ArrowDot />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ── Contact + Social — last in the reveal cascade. ── */}
            <dl
              className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "translateY(0)" : "translateY(4px)",
                transition: mobileOpen
                  ? `opacity 220ms cubic-bezier(0.22, 1, 0.36, 1) ${
                      260 + MOBILE_NAV.length * 45
                    }ms, transform 220ms cubic-bezier(0.22, 1, 0.36, 1) ${
                      260 + MOBILE_NAV.length * 45
                    }ms`
                  : "opacity 160ms cubic-bezier(0.22, 1, 0.36, 1), transform 160ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <div>
                <dt
                  className="p-s font-medium tracking-widest uppercase mb-1.5"
                  style={{ color: "var(--color-muted)" }}
                >
                  Contact
                </dt>
                <dd>
                  <a
                    href="mailto:contact@columbus.earth"
                    className="p-m font-medium break-all hover:text-accent transition-colors"
                    style={{ color: "var(--color-ink)" }}
                  >
                    contact@columbus.earth
                  </a>
                </dd>
              </div>
              <div>
                <dt
                  className="p-s font-medium tracking-widest uppercase mb-1.5"
                  style={{ color: "var(--color-muted)" }}
                >
                  Social
                </dt>
                <dd>
                  <a
                    href="https://www.linkedin.com/company/columbusearth/about/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-m font-medium hover:text-accent transition-colors"
                    style={{ color: "var(--color-ink)" }}
                  >
                    LinkedIn
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* ── Pinned bottom CTA — mirrors the desktop Try Elio pill
            (bg-cta + text-accent are project utilities generated from
            --color-cta / --color-accent). ── */}
        <div
          className="px-6 pt-4 pb-6"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <a
            href="/products/consumer"
            onClick={() => setMobileOpen(false)}
            className="group bg-cta text-white rounded-button p-m flex items-center justify-center gap-3 w-full font-medium transition-colors hover:text-accent"
            style={{ height: 56 }}
          >
            <span>Try Elio</span>
            <span
              className="text-accent transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <ArrowDot />
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
