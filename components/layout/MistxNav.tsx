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
//   • `text-mistral-orange`     → `text-[#0081AC]` (rebrand blue, not orange)
//   • `border-mistral-orange`   → `border-[#0081AC]`
//   • `md:container`            → `max-w-[1287px] mx-5 md:mx-auto`  (matches this
//                                 project's content bounds; no inner padding so the
//                                 logo / "Try Elio" CTA sit flush with those bounds)
//   • Logo `/images/Columbo.png` → `/logobueno.png` (same asset, this project's
//     filename — verified ~149KB on both)
//
// Behavior, markup, ARIA semantics, hover/scroll dynamics are unchanged.
// Internal link `/business` is repointed to `/products/business` (the
// actual route on this project — a Next.js redirect would normalize the
// original but the direct link avoids a 308 hop).

// Flat top-level nav links — no submenus. The previous Products /
// Research / Blog / Company dropdowns were collapsed into direct
// destinations. The only remaining dropdown lives on the right-side
// "Try Elio" CTA below.
const navLinks: { label: string; href: string }[] = [
  // "Consumer" has no dedicated /elio route yet — pointed at /products/mapsgpt
  // for now (per product owner). Repoint to /elio once that page exists.
  { label: "Consumer", href: "/products/mapsgpt" },
  { label: "Business", href: "/products/business" },
  // Points at the Technology page — the LGM / research content lives there.
  { label: "Research", href: "/research" },
  { label: "Blog", href: "/blog" },
  { label: "Company", href: "/mission" },
];

// "Try Elio" launcher items. Each row renders name + one-line
// description + chevron — the product-picker dropdown pattern lifted
// from Mobbin samples (Patreon "Create" CTA dropdown, Hers product-row
// menu, Fibery grouped select). Visual: white rounded-2xl card,
// hairline border, subtle shadow, bg-black/5 row hover matching the
// navbar pill hover one screen over.
const elioMenuItems: { label: string; href: string; desc: string }[] = [
  // No /elio route yet — temporarily points to /products/mapsgpt.
  { label: "Try Elio", href: "/products/mapsgpt", desc: "Consumer travel reasoning" },
  { label: "Try Mapsurf", href: "/products/mapsgpt", desc: "Lightweight map workspace" },
  { label: "Try Columbus", href: "/products/business", desc: "Business geospatial intelligence" },
];

/**
 * The double-stacked arrow icon MistX uses on every nav item — slides up
 * on hover (the chevron column rotates inside an h-3 overflow-hidden box).
 */
function NavArrowStack({ className = "" }: { className?: string }) {
  return (
    <div className={"h-3 overflow-hidden relative " + className}>
      <div className="h-6 flex flex-col transition-transform duration-200 group-hover:-translate-y-3">
        <ArrowDot className="rotate-90" />
        <ArrowDot className="-rotate-90" />
      </div>
    </div>
  );
}

function ArrowDot({ className = "" }: { className?: string }) {
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

export function MistxNav({ heroWhite = false }: { heroWhite?: boolean } = {}) {
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
  const lightNav = heroWhite && (!stuck || overHero);
  // Business-only: while scrolled ("on movement") AND the navbar still
  // overlaps the hero, the solid white backdrop is replaced by a scrim
  // tinted to the hero image's sky colour — opaque at the top, fading to
  // fully transparent at the navbar's bottom border. Once the hero
  // scrolls out from behind the navbar it reverts to the solid backdrop.
  const heroScrim = heroWhite && stuck && overHero;

  return (
    <header
      ref={headerRef}
      className="sticky z-100 w-full transition-[background-color] duration-300"
      style={{
        // Sticks at the card's top edge (= the 16px top gutter), so the
        // gutter stays visible above the navbar instead of getting
        // covered when the navbar pins. Top-corner radii match the
        // PageFrame card so the navbar's white backdrop curves with it.
        top: "var(--frame-margin, 16px)",
        borderTopLeftRadius: "var(--frame-radius, 20px)",
        borderTopRightRadius: "var(--frame-radius, 20px)",
        backgroundColor: showBackdrop && !heroScrim ? "#FFFFFF" : "transparent",
      }}
    >
      {/* Business hero-only backdrop. Sits behind the content row
          (z-0 vs the row's z-10). Tinted to the hero image's dominant
          sky colour (#018ADE = rgb(1,138,222) — the same value the
          BentoProducts Columbus tile uses for /ColumbusBackgroundbento
          .png), so the navbar reads as a continuation of the sky. Fully
          opaque at the top, fading to transparent (alpha 0) exactly at
          the navbar's bottom border, so it blends into the real sky
          below with no hard edge. Driven by opacity so it cross-fades
          with the solid-white backdrop as the hero scrolls out. */}
      {heroWhite && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 bottom-0"
          style={{
            zIndex: 0,
            borderTopLeftRadius: "var(--frame-radius, 20px)",
            borderTopRightRadius: "var(--frame-radius, 20px)",
            background:
              "linear-gradient(to bottom, rgba(1,138,222,1) 0%, rgba(1,138,222,0.55) 50%, rgba(1,138,222,0) 100%)",
            opacity: heroScrim ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
        />
      )}
      {/* Content row — bounds match the page's content sections
          (max-w-[1287px] mx-5 md:mx-auto), no inner padding, so the logo's
          left edge and the "Try Elio" CTA's right edge sit flush with the
          page's left/right content bounds. */}
      <div className="max-w-[1287px] mx-5 md:mx-auto flex items-center py-6 relative z-10">
        {/* Left: logo + wordmark */}
        <div className="flex-1 flex items-center gap-3">
          <a
            rel="home"
            aria-label="Home"
            className="relative z-10 flex size-[34px] items-center justify-center"
            href="/"
          >
            <img
              alt="Columbus Logo"
              width={34}
              height={34}
              decoding="async"
              className="object-contain transition-[filter] duration-300"
              style={{
                color: "transparent",
                filter: lightNav
                  ? "brightness(0) invert(1)"
                  : "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)",
              }}
              src="/logobueno.png"
            />
          </a>
          <span
            className="h7 hidden lg:flex items-center font-semibold leading-none whitespace-nowrap"
            style={{
              fontFamily: "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
              position: "relative",
              top: "3px",
              color: lightNav ? "#FFFFFF" : "#0F173C",
            }}
          >
            Columbus Earth
          </span>
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
              lightNav
                ? "text-white hover:bg-white/10"
                : "text-[#1f1f1f] hover:bg-black/5 hover:text-[#0081AC]"
            }`}
            href="/contact"
          >
            Contact
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
              <ArrowDot className={lightNav ? "text-white" : "text-[#0081AC]"} />
            </span>
          </a>

          {/* Try Elio dropdown */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() => setElioOpen(true)}
            onMouseLeave={() => setElioOpen(false)}
          >
            <button
              className="group cursor-pointer rounded-button px-5 py-2 p-m flex items-center gap-2 transition-colors bg-cta text-white hover:text-[#0081AC]"
              aria-haspopup="menu"
              aria-expanded={elioOpen}
            >
              Try Elio
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                <NavArrowStack className="text-[#0081AC]" />
              </span>
            </button>
            {/* Product picker dropdown — Mobbin pattern (Patreon "Create"
                CTA dropdown / Hers product rows). Outer wrapper sits
                flush with the button's bottom (no margin gap) and uses
                pt-2 to fold the visual 8px gap into its own hit area —
                without this the cursor would cross dead space between
                button and panel, fire mouseleave on the parent, and
                snap the menu closed before reaching any item. Inner
                div carries the white rounded-card visuals. Always
                mounted so opacity + translateY drive the open/close. */}
            <div
              aria-hidden={!elioOpen}
              className="absolute right-0 top-full pt-2 w-[300px] z-50 transition-all duration-200"
              style={{
                opacity: elioOpen ? 1 : 0,
                transform: elioOpen ? "translateY(0)" : "translateY(-4px)",
                pointerEvents: elioOpen ? "auto" : "none",
              }}
            >
              <div
                role="menu"
                className="bg-white text-[#1f1f1f] rounded-2xl p-1.5"
                style={{
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 12px 32px -8px rgba(15, 22, 36, 0.12), 0 4px 12px -4px rgba(15, 22, 36, 0.08)",
                }}
              >
                <ul>
                  {elioMenuItems.map((item) => (
                    <li key={item.label} role="none">
                      <a
                        role="menuitem"
                        href={item.href}
                        className="group flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-black/5"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="p-m font-medium leading-snug">{item.label}</div>
                          <div className="p-s leading-snug mt-0.5 text-[#1f1f1f]/55">{item.desc}</div>
                        </div>
                        <span className="mt-1.5 shrink-0 transition-transform group-hover:translate-x-0.5">
                          <ArrowDot className="text-[#0081AC]" />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <button
            className={`lg:hidden md:px-2 cursor-pointer ${lightNav ? "text-white" : "text-[#1f1f1f]"}`}
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
                height="20"
                viewBox="0 0 75 63"
                fill="none"
                aria-hidden="true"
              >
                <path
                  opacity="0.5"
                  d="M49.76 49.76H0V62.20H49.76V49.76Z"
                  fill="currentColor"
                />
                <path
                  opacity="0.7"
                  d="M74.64 24.88H0V37.32H74.64V24.88Z"
                  fill="currentColor"
                />
                <path d="M74.64 0H0V12.44H74.64V0Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer — flat list of top-level links, then the Try Elio
          product picker mirrored as a grouped block at the bottom. */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#F1F5FE] text-[#1f1f1f] z-20 px-6 py-6 shadow-lg max-h-[calc(100vh-100px)] overflow-y-auto">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="p-m py-2 block font-medium hover:text-[#0081AC] transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-4 pt-4 border-t border-[rgba(0,0,0,0.08)]">
              <div className="p-s text-[#1f1f1f]/55 mb-2 uppercase tracking-wide">Try</div>
              <ul className="flex flex-col">
                {elioMenuItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="block py-2 hover:text-[#0081AC] transition-colors"
                    >
                      <span className="p-m font-medium block">{item.label}</span>
                      <span className="p-s text-[#1f1f1f]/55 block">{item.desc}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
