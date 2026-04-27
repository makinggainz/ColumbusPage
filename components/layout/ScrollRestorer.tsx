"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollRestorer() {
  const pathname = usePathname();
  const prev = useRef(pathname);

  // Scroll to top on route change
  useEffect(() => {
    if (pathname === prev.current) return;
    prev.current = pathname;
    const html = document.documentElement;
    const saved = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => { html.style.scrollBehavior = saved; });
  }, [pathname]);

  // Scroll to top when clicking the current page's link
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      let el = e.target as HTMLElement | null;
      while (el && el.tagName !== "A") el = el.parentElement;
      if (!el) return;
      const href = (el as HTMLAnchorElement).getAttribute("href");
      if (!href || href === "#") return;
      if (href === pathname || href === window.location.pathname) {
        e.preventDefault();
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [pathname]);

  return null;
}
