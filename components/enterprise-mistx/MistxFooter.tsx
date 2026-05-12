// MistX Rainbow-band footer — the brand signature closer (design-system
// §8.10). The 6-stop blue rainbow above + a short dark footer band with
// columns of links. Don't drop the rainbow — it's the brand signature.

const COLS: Array<{ title: string; items: string[] }> = [
  {
    title: "Product",
    items: ["Columbus Pro", "MapsGPT", "Elio", "Pricing"],
  },
  {
    title: "Company",
    items: ["About", "Mission", "Careers", "Blog"],
  },
  {
    title: "Resources",
    items: ["Documentation", "Research", "Trust centre", "Press kit"],
  },
  {
    title: "Get in touch",
    items: ["Founders", "Sales", "Support", "LinkedIn"],
  },
];

export function MistxFooter() {
  return (
    <footer>
      {/* The brand signature: 6-stop horizontal rainbow. */}
      <div className="mistx-rainbow-band" />

      <div style={{ background: "#091442", color: "#E8EFFD" }}>
        <div className="mistx-container" style={{ paddingTop: 64, paddingBottom: 48 }}>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8"
            data-reveal
          >
            {COLS.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <h4
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: "#154ACC",
                    margin: 0,
                  }}
                >
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-2">
                  {col.items.map((it) => (
                    <li key={it}>
                      <a
                        href="#"
                        className="text-sm transition-opacity"
                        style={{
                          color: "#E8EFFD",
                          opacity: 0.8,
                        }}
                      >
                        {it}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="mt-10 md:mt-16 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
            style={{ borderTop: "1px solid rgba(232,239,253,0.15)" }}
          >
            <p
              style={{
                fontSize: 13,
                color: "rgba(232,239,253,0.6)",
              }}
            >
              © 2026 Columbus, Inc. All rights reserved.
            </p>
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(232,239,253,0.45)",
              }}
            >
              Built in San Francisco.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
