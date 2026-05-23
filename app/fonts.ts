/**
 * Font loading is handled via Google Fonts `<link>` tags in
 * `app/layout.tsx` rather than `next/font/google`. The two fonts the
 * site uses (Funnel Display, Opening Hours Sans) aren't all present
 * in the running Next.js version's font map — going through the CDN
 * directly bypasses that lookup entirely.
 *
 * The font-family references live in `app/globals.css`:
 *   - `--font-display` → "Funnel Display"
 *   - `--font-sans`    → "Opening Hours Sans"
 *
 * Axiforma (used only for the "Columbus Earth" wordmark in the navbar)
 * is self-hosted via @font-face in globals.css.
 */

export {};
