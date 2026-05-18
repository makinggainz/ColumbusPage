/* eslint-disable @next/next/no-img-element */

/**
 * "See what people are asking" — real traveller questions and the spots
 * MapsGPT matched them to.
 *
 * Rebuilt on the Columbus homepage design system: a centred `.h2`
 * Funnel Display heading and a grid of hairline cards (1px
 * var(--color-gridline), 13px radius, white fill, 7px inner-image
 * radius), 1287px bounds, the `.section` rhythm. Replaces the prior
 * 8-column scaled-masonry / glassmorphic-overlay implementation.
 */

const spot = (n: number) => `/FavoriteSpots/${encodeURIComponent(`(${n}).jpeg`)}`;

type QA = { photo: string; query: string; place: string; response: string };

const QUESTIONS: QA[] = [
  {
    photo: spot(20),
    query:
      "Coolest members club or rooftop lounge in New York for a summer evening?",
    place: "The Ned NYC",
    response: "Rooftop bar, skyline views, a buzzing summer atmosphere.",
  },
  {
    photo: spot(14),
    query:
      "Most secluded luxury resort in Bali with rice terrace views and a private villa pool?",
    place: "Four Seasons Bali",
    response: "A secluded villa compound with a private pool and terrace views.",
  },
  {
    photo: spot(17),
    query: "Best spot in Santorini to watch the sunset?",
    place: "Oia Village",
    response: "The island's best sunset, over iconic whitewashed clifftops.",
  },
  {
    photo: spot(19),
    query: "Where can I experience authentic Italian fine dining in Modena?",
    place: "Osteria Francescana",
    response: "Three Michelin stars, zero tourist energy, deeply local soul.",
  },
  {
    photo: spot(21),
    query: "Best nightlife in Miami for dancing with an incredible atmosphere?",
    place: "LIV Miami",
    response: "World-class DJs, an electric crowd, the best dance floor in Miami.",
  },
  {
    photo: spot(23),
    query:
      "Best time to visit Fushimi Inari in Kyoto to avoid the tourist crowds?",
    place: "Fushimi Inari",
    response: "Arrive before 7am for empty torii gates and zero crowds.",
  },
];

const CSS = `
.swp-bounds {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .swp-bounds { margin-left: auto; margin-right: auto; }
}

.swp-head { text-align: center; padding-bottom: 48px; }

.swp-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 640px) {
  .swp-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .swp-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
}

/* Q&A card — hairline, 13px corner, white fill (homepage card family). */
.swp-card {
  border: 1px solid var(--color-gridline);
  border-radius: 13px;
  background: #FFFFFF;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

/* Place photo — 7px radius, the in-card visual corner. */
.swp-media {
  border-radius: 7px;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: #ECEFF3;
}
.swp-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* The traveller's question — the card's lead content. */
.swp-query {
  margin: 18px 0 0;
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.45;
  font-weight: 500;
  color: var(--color-ink);
}

/* MapsGPT's match — place name + one-line reason, divided by a hairline. */
.swp-foot {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-gridline);
}
.swp-place {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-ink);
}
.swp-response {
  margin: 4px 0 0;
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.45;
  font-weight: 400;
  color: var(--color-muted);
}
`;

export default function SeeWhatPeopleSection() {
  return (
    <section className="section">
      <style>{CSS}</style>
      <div className="swp-bounds">
        <div className="swp-head">
          <h2 className="h2 tracking-tight text-ink">
            See what people are asking
          </h2>
        </div>
        <div className="swp-grid">
          {QUESTIONS.map((q) => (
            <div key={q.place} className="swp-card">
              <div className="swp-media">
                <img src={q.photo} alt={q.place} />
              </div>
              <p className="swp-query">{q.query}</p>
              <div className="swp-foot">
                <span className="swp-place">{q.place}</span>
                <p className="swp-response">{q.response}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
