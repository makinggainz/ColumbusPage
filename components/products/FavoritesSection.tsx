/**
 * Favorites CTA band — a centred line that points travellers to the app.
 *
 * Rebuilt on the Columbus homepage design system: a centred `.h2`
 * Funnel Display heading and the homepage signature CTA pill (navy
 * surface, white label → #0081AC on hover, 5-dot ArrowDots glyph),
 * 1287px bounds, the `.section` rhythm. Replaces the prior recolored-
 * emoji + glassmorphism-button implementation.
 */

/* Signature 5-dot diagonal arrow — shared with BentoProducts / Careers. */
function ArrowDots() {
  return (
    <svg width="12" height="13" viewBox="0 0 9 13" fill="none" aria-hidden="true">
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

const CSS = `
.fav-bounds {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .fav-bounds { margin-left: auto; margin-right: auto; }
}

.fav-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.fav-title {
  margin: 0;
  max-width: 22ch;
  text-wrap: balance;
}

/* Homepage signature CTA pill. */
.fav-cta {
  margin-top: 40px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: var(--color-cta);
  color: #FFFFFF;
  border-radius: var(--radius-button-md);
  font-size: var(--typography--p-m);
  line-height: 1;
  font-weight: 500;
  text-decoration: none;
  transition: color 180ms ease;
}
.fav-cta:hover { color: #0081AC; }
.fav-cta-arrow {
  display: inline-block;
  color: #0081AC;
  transition: transform 180ms ease;
}
.fav-cta:hover .fav-cta-arrow { transform: translateX(2px); }
.fav-cta-arrow svg { display: block; }
`;

export default function FavoritesSection() {
  return (
    <section className="section">
      <style>{CSS}</style>
      <div className="fav-bounds">
        <div className="fav-inner">
          <h2 className="h2 tracking-tight text-ink fav-title">
            Let our AI find you the coolest place, faster.
          </h2>
          <a className="fav-cta" href="https://mapsgpt.es">
            Find your favourite spots now
            <span className="fav-cta-arrow">
              <ArrowDots />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
