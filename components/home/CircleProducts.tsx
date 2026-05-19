"use client";

/* eslint-disable @next/next/no-img-element */

/**
 * CircleProducts — the section that follows the hero in the "circleUI"
 * concept. Three product portals (Columbus / Elio / Research), each a
 * circle that holds a media backdrop with a real product screenshot
 * floating at its base. The screenshot card is clipped by the circle's
 * round edge, so its bottom corners curve away with the portal.
 *
 * Each portal is a link to that product's page.
 */

const ITEMS: {
  label: string;
  href: string;
  bg: string;
  card: string;
  cardAlt: string;
}[] = [
  {
    label: "Columbus",
    href: "/products/business",
    bg: "/blog-moonlit-peaks.jpg",
    card: "/ColumbusProductImg.png",
    cardAlt: "Columbus data manager interface",
  },
  {
    label: "Elio",
    href: "/products/mapsgpt",
    bg: "/amazonia.jpg",
    card: "/mapsgptdesktopimg.png",
    cardAlt: "Elio map workspace interface",
  },
  {
    label: "Research",
    href: "/research",
    bg: "/forest.png",
    card: "/dataCataSm.png",
    cardAlt: "Research data catalog interface",
  },
];

const CSS = `
.cp-section {
  background: #FFFFFF;
  padding: clamp(64px, 10vh, 150px) 0;
  font-family: var(--font-sans);
}

.cp-row {
  max-width: 1287px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(20px, 3vw, 56px);
}

.cp-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
}

.cp-label {
  font-size: clamp(22px, 2.1vw, 36px);
  font-weight: 500;
  letter-spacing: -0.015em;
  color: #0B1B2B;
  margin-bottom: clamp(16px, 2.2vw, 36px);
}

/* The portal. overflow: hidden + the 50% radius is what clips the
   floating screenshot card to the circle's curve. */
.cp-circle {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  background: #0a1730;
  box-shadow: 0 24px 60px -28px rgba(11, 27, 43, 0.40);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.35s ease;
}
.cp-item:hover .cp-circle {
  transform: translateY(-8px);
  box-shadow: 0 38px 84px -30px rgba(11, 27, 43, 0.50);
}

.cp-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* The product screenshot, floating at the base of the portal. Its lower
   edge sits just past the circle's bottom so the round clip shaves the
   bottom corners — the card reads as if it lives inside the portal. */
.cp-card {
  position: absolute;
  left: 50%;
  bottom: -1%;
  transform: translateX(-50%);
  width: 82%;
  border-radius: 12px;
  box-shadow: 0 16px 36px -12px rgba(11, 27, 43, 0.45);
  display: block;
}

@media (max-width: 860px) {
  .cp-row {
    grid-template-columns: 1fr;
    gap: clamp(44px, 8vw, 64px);
    max-width: 440px;
  }
}
`;

export function CircleProducts() {
  return (
    <section className="cp-section" aria-label="Columbus products">
      <style>{CSS}</style>
      <div className="cp-row">
        {ITEMS.map((item) => (
          <a key={item.label} href={item.href} className="cp-item">
            <span className="cp-label">{item.label}</span>
            <div className="cp-circle">
              <img className="cp-bg" src={item.bg} alt="" aria-hidden />
              <img className="cp-card" src={item.card} alt={item.cardAlt} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default CircleProducts;
