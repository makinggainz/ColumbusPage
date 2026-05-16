"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

/**
 * Renders the site Footer with route-specific theming.
 *
 * Homepage ("/") uses the experimentV6-Gdesign white treatment — a light
 * footer on a pure-white surface, matching the homepage's white backdrop
 * and floating PageFrame card (see the scoped <style> in app/page.tsx).
 * Every other route keeps the dark "earth-from-space" footer
 * (theme="dark" + footerbackground.jpeg).
 *
 * Both keep `reveal` mode (fixed, z-index 0, revealed as the card scrolls
 * up). PageFrame measures the live footer height via ResizeObserver, so
 * the two variants' differing heights are handled automatically.
 */
export function RouteAwareFooter() {
  const pathname = usePathname();

  if (pathname === "/") {
    return <Footer reveal theme="light" bg="#FFFFFF" />;
  }

  return (
    <Footer
      reveal
      theme="dark"
      bg="#000000"
      bgImage="/footerbackground.jpeg"
    />
  );
}
