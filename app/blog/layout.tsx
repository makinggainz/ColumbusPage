export default function BlogLayout({ children }: { children: React.ReactNode }) {
  // No bg-white / text-ink here: the body already provides those in light
  // mode (globals.css), and the accessibility menu's sepia/dark modes set
  // body-level overrides that need to reach the article content. Forcing
  // white at this layer was masking those overrides on article pages.
  return <div className="min-h-screen">{children}</div>;
}
