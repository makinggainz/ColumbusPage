import Link from "next/link";

import { blogHref, BLOG_SLUG, BLOG_POSTS } from "@/lib/blog-posts";
import { WarmTechImage } from "./WarmTechImage";
// Static imports → AVIF via the optimizer (these were raw plain <img> PNG/JPEG)
// + real blur-up where shown large. The model/competitor logos render small,
// so blur-up is omitted there — AVIF + warm-promotion is the win.
import techDiagram from "@/public/ResearchPgMedia/techDiagram.png";
import columbusLogo from "@/public/logobueno.png";
import mapsGptLogo from "@/public/MapsGPT-logo.png";
import voyagerGraphic from "@/public/ResearchPgMedia/VoyagerGraphic.png";
import claudeLogo from "@/public/ResearchPgMedia/LogosTable/Claude_AI_logo.svg.png";
import grokLogo from "@/public/ResearchPgMedia/LogosTable/Grok-feb-2025-logo.svg.png";
import perplexityLogo from "@/public/ResearchPgMedia/LogosTable/Perplexity_AI_logo.svg.png";
import chatgptLogo from "@/public/ResearchPgMedia/LogosTable/ChatGPT-Vertical-Logo-Vector.svg-.png";
import physicalIntelligenceLogo from "@/public/ResearchPgMedia/physical-intelligence-logo.jpeg";
import runwayLogo from "@/public/ResearchPgMedia/runway-logo.jpeg";
import metaLogo from "@/public/ResearchPgMedia/meta-logo.jpeg";
import styles from "../technology.module.css";
import { TechScrollIndex } from "../TechScrollIndex";
import {
  RESEARCH_ARTICLES,
  RESEARCH_CARDS,
} from "./content";
import { CoreResearchArt } from "./CoreResearchArt";
import { CoreResearchCarousel } from "./CoreResearchCarousel";
import { Definition } from "./Definition";
import { ResearchAccordionProvider } from "./ResearchAccordionContext";
import { ResearchGroup } from "./ResearchGroup";
import { ResultsArtFrame } from "./ResultsArtFrame";
import { RevealOnView } from "./RevealOnView";
import { ScaleToFit } from "./ScaleToFit";
import { CareersContactForm } from "./CareersContactForm";
import type { TechnologySectionId } from "./types";

function Slide({
  id,
  className,
  children,
}: {
  id: TechnologySectionId;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={[styles.section, className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}

/* Static wireframe globe (cards 2–4, for now). */
function ResultsGlobeStatic() {
  return (
    <svg viewBox="0 0 100 100" fill="none" preserveAspectRatio="xMidYMid meet">
      {/* Wireframe globe — outer rim, latitudes, longitudes, surface marker. */}
      <circle cx="50" cy="50" r="34" stroke="rgba(255,255,255,0.85)" strokeWidth="0.9" />
      <ellipse cx="50" cy="50" rx="34" ry="9" stroke="rgba(255,255,255,0.7)" strokeWidth="0.7" />
      <ellipse cx="50" cy="50" rx="32" ry="22" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
      <ellipse cx="50" cy="50" rx="28" ry="32" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
      <line x1="50" y1="16" x2="50" y2="84" stroke="rgba(255,255,255,0.85)" strokeWidth="0.8" />
      <line x1="34" y1="22" x2="66" y2="22" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
      <line x1="28" y1="34" x2="72" y2="34" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
      <line x1="28" y1="66" x2="72" y2="66" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
      <line x1="34" y1="78" x2="66" y2="78" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
      <circle cx="61" cy="40" r="3" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}

/* Card 1 — a true 3D wireframe globe (meridians + parallels assembled in 3D
   space) spinning on its polar axis. Built from HTML layers because SVG can't
   render real 3D rotation; the parent .resultsCardArt supplies the blue tile.
   GLOBE_R is the sphere radius in px and must match --globe-d (= 2·R) in the
   stylesheet so the parallel rings' translateZ math lines up with the
   meridian circles. */
const GLOBE_R = 81;
// Longitude great circles every 20° (0–160°; 180° duplicates 0°).
const GLOBE_MERIDIANS = [0, 20, 40, 60, 80, 100, 120, 140, 160];
// Latitude rings every 20° north + south of the equator.
const GLOBE_PARALLELS = [-60, -40, -20, 0, 20, 40, 60];
// Projection rays — emitted from a node near the BOTTOM interior of the sphere
// up toward surface points in the upper region. Each target is [theta, phi]
// in degrees: theta = angle from the top pole, phi = azimuth. Because both the
// origin (inside) and every target (on the surface) lie within the sphere, the
// ray segments — and their 2D projection — always stay within the circle.
const RAY_ORIGIN_Y = 1; // = R: the node sits on the sphere's bottom point
const GLOBE_RAY_TARGETS: [number, number][] = [
  [0, 0],
  [52, 0], [52, 60], [52, 120], [52, 180], [52, 240], [52, 300],
  [98, 30], [98, 90], [98, 150], [98, 210], [98, 270], [98, 330],
];

/* Card 4 — "Deep spatial reasoning at scale": a 3D multilayer network — three
   stacked dashed planes (layers), each scattered with nodes, and projection
   rays linking each layer's nodes to the layer above. The rays animate as
   flowing dashes (data projecting up through the layers). */
const NET_PLANE_SIZE = [124, 160, 124];  // bottom, middle, top — middle largest
const NET_LAYER_Y = [50, 0, -50];        // bottom, middle, top (y is down-positive)
// Node positions per layer as [x, z] within the plane (local px).
const NET_NODES: [number, number][][] = [
  // Layer 0 — bottom (densest)
  [[-52, -26], [-22, -50], [8, -22], [40, -44], [-40, 18], [-8, 42], [30, 26], [54, 2]],
  // Layer 1 — middle
  [[-42, -18], [-6, -36], [26, -12], [46, 24], [-20, 32]],
  // Layer 2 — top
  [[-46, -24], [-16, -46], [14, -30], [42, -34], [0, 12], [30, 30], [-26, 34]],
];

function ResultsGlobe3D({
  spin = false,
  rays = false,
  reveal = false,
  grow = false,
}: {
  spin?: boolean;
  rays?: boolean;
  reveal?: boolean;
  grow?: boolean;
}) {
  // Layer-by-layer (card 2) build order: latitude rings stack top→bottom
  // first, then the meridians draw in. STAGGER is the per-layer delay step.
  const STAGGER = 0.12;
  const inner = (
    <div className={styles.globe}>
        <div
          className={[
            styles.globeRotor,
            spin ? styles.globeRotorSpin : "",
            reveal ? styles.globeRotorLayered : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {GLOBE_MERIDIANS.map((deg, mi) => (
            <span
              key={`m${deg}`}
              className={`${styles.globeMeridian}${grow ? ` ${styles.globeGrow}` : ""}`}
              style={{
                transform: `rotateY(${deg}deg)`,
                // Stagger only drives the reveal mode; grow sweeps in unison.
                animationDelay: reveal
                  ? `${(GLOBE_PARALLELS.length + mi) * STAGGER}s`
                  : undefined,
              }}
            />
          ))}
          {GLOBE_PARALLELS.map((lat, pi) => {
            const rad = (lat * Math.PI) / 180;
            const size = 2 * GLOBE_R * Math.cos(rad);
            const z = GLOBE_R * Math.sin(rad);
            // Vertical position 0 (top pole) → 1 (bottom). In grow mode each
            // ring fades in when the meridian fill-front (which sweeps top→
            // bottom over the first half of the 4s cycle) reaches it.
            const p = (1 - Math.sin(rad)) / 2;
            return (
              <span
                key={`p${lat}`}
                className={`${styles.globeParallel}${grow ? ` ${styles.globeGrowParallel}` : ""}`}
                style={{
                  width: size,
                  height: size,
                  transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${z}px)`,
                  animationDelay: grow
                    ? `${p * 2}s`
                    : reveal
                      ? `${(GLOBE_PARALLELS.length - 1 - pi) * STAGGER}s`
                      : undefined,
                }}
              />
            );
          })}
          {/* 3D projection rays from a bottom-interior node, contained in the
              sphere. Each ray is a thin bar anchored (transform-origin 0 50%)
              at the globe centre, translated to the origin node, then oriented
              toward its surface target via rotateZ (in-plane) + rotateY (depth). */}
          {rays && (() => {
            const sx = 0;
            const sy = GLOBE_R * RAY_ORIGIN_Y;
            const sz = 0;
            return (
              <>
                {GLOBE_RAY_TARGETS.map(([th, ph], i) => {
                  const t = (th * Math.PI) / 180;
                  const p = (ph * Math.PI) / 180;
                  const ex = GLOBE_R * Math.sin(t) * Math.cos(p);
                  const ey = -GLOBE_R * Math.cos(t);
                  const ez = GLOBE_R * Math.sin(t) * Math.sin(p);
                  const dx = ex - sx;
                  const dy = ey - sy;
                  const dz = ez - sz;
                  const len = Math.hypot(dx, dy, dz);
                  const angleZ = (Math.atan2(dy, dx) * 180) / Math.PI;
                  const angleY = (Math.asin(-dz / len) * 180) / Math.PI;
                  return (
                    <span
                      key={`ray${i}`}
                      className={styles.globeRay}
                      style={{
                        width: len,
                        transform: `translate3d(${sx}px, ${sy}px, ${sz}px) rotateZ(${angleZ}deg) rotateY(${angleY}deg)`,
                      }}
                    />
                  );
                })}
                <span
                  className={styles.globeRayNode}
                  style={{ transform: `translate3d(${sx}px, ${sy}px, ${sz}px)` }}
                />
              </>
            );
          })()}
        </div>
        {/* Sphere silhouette. Omitted in grow mode — the rotateY(0) meridian
            already traces the outer circle and draws in sync with the others,
            so a separate (static) rim would read as out of step. */}
        {!grow && <span className={styles.globeRim} />}
      </div>
  );

  return (
    <div className={styles.globeScene} aria-hidden>
      {inner}
    </div>
  );
}

/* Card 4 — 3D multilayer network. Three stacked dashed planes with nodes,
   linked by projection rays (flowing dashes) from each layer to the next. */
function ResultsLayers() {
  // Projection rays — connect each lower-layer node to two upper-layer nodes
  // (different per layer, so the web converges upward). Built with the same
  // 3D line-as-bar math as the globe's rays.
  const edges: {
    key: string;
    len: number;
    sx: number;
    sy: number;
    sz: number;
    angleZ: number;
    angleY: number;
  }[] = [];
  for (let L = 0; L < NET_NODES.length - 1; L++) {
    const lower = NET_NODES[L];
    const upper = NET_NODES[L + 1];
    const yl = NET_LAYER_Y[L];
    const yu = NET_LAYER_Y[L + 1];
    lower.forEach(([lx, lz], i) => {
      for (const tIdx of [i % upper.length, (i + 2) % upper.length]) {
        const [ux, uz] = upper[tIdx];
        const dx = ux - lx;
        const dy = yu - yl;
        const dz = uz - lz;
        const len = Math.hypot(dx, dy, dz);
        edges.push({
          key: `e${L}-${i}-${tIdx}`,
          len,
          sx: lx,
          sy: yl,
          sz: lz,
          angleZ: (Math.atan2(dy, dx) * 180) / Math.PI,
          angleY: (Math.asin(-dz / len) * 180) / Math.PI,
        });
      }
    });
  }

  return (
    <div className={styles.netScene} aria-hidden>
      <div className={styles.netStack}>
        {NET_LAYER_Y.map((y, li) => (
          <span
            key={`plane${li}`}
            className={styles.netPlane}
            style={{
              width: NET_PLANE_SIZE[li],
              height: NET_PLANE_SIZE[li],
              transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${-y}px)`,
            }}
          />
        ))}
        {edges.map((e) => (
          <span
            key={e.key}
            className={styles.netEdge}
            style={{
              width: e.len,
              transform: `translate3d(${e.sx}px, ${e.sy}px, ${e.sz}px) rotateZ(${e.angleZ}deg) rotateY(${e.angleY}deg)`,
            }}
          />
        ))}
        {NET_NODES.map((layer, li) =>
          layer.map(([x, z], ni) => (
            <span
              key={`node${li}-${ni}`}
              className={styles.netNode}
              style={{ transform: `translate3d(${x}px, ${NET_LAYER_Y[li]}px, ${z}px)` }}
            >
              <span className={styles.netNodeDot} />
            </span>
          )),
        )}
      </div>
    </div>
  );
}

/* Card 3 — "Generalist model, with access to wide catalogue": a meridian-only
   wireframe globe with dashed crosshairs that roam, plus a small target circle
   (with its own crosshair) drifting around the globe — a scanning/lookup feel. */
function ResultsCatalogue() {
  return (
    <div className={styles.catScene} aria-hidden>
      <div className={styles.globe}>
        <div className={styles.globeRotor}>
          {GLOBE_MERIDIANS.map((deg) => (
            <span
              key={`m${deg}`}
              className={styles.globeMeridian}
              style={{ transform: `rotateY(${deg}deg)` }}
            />
          ))}
        </div>
        <span className={styles.globeRim} />
      </div>
      {/* Roaming dashed crosshairs (different periods → wandering intersection). */}
      <span className={styles.catCrossH} />
      <span className={styles.catCrossV} />
      {/* Target reticle — pinned to the crosshair intersection: the outer span
          shares the vertical crosshair's horizontal roam, the inner span shares
          the horizontal crosshair's vertical roam. */}
      <span className={styles.catTarget}>
        <span className={styles.catTargetInner}>
          <span className={styles.catTargetH} />
          <span className={styles.catTargetV} />
        </span>
      </span>
    </div>
  );
}

function ResultsGlobe({ num }: { num: string }) {
  if (num === "1") return <ResultsGlobe3D spin rays />;
  // Card 3 — meridian globe with roaming crosshairs + drifting target.
  if (num === "3") return <ResultsCatalogue />;
  // Card 2 — "Generative geospatial data": static globe whose meridians grow
  // from the top pole down to the bottom pole, on a loop.
  if (num === "2") return <ResultsGlobe3D grow />;
  // Card 4 — "Deep spatial reasoning at scale": 3D multilayer network.
  if (num === "4") return <ResultsLayers />;
  return <ResultsGlobeStatic />;
}


export function TechnologySections() {
  return (
    <>
      {/* Sidebar panel with scroll index */}
      <div className={styles.sidebarPanel}>
        <div className={styles.sidebarPanelSticky}>
          <TechScrollIndex />
        </div>
      </div>

      {/* Main content column. z-index stays low (1) — below the sidebar
          panel (2) and, crucially, below the sticky navbar (z-100) so the
          nav always paints over the page content. */}
      <div style={{ position: "relative", zIndex: 1 }}>
      {/* ── 1. What's an LGM ── */}
      <Slide id="foundationmodel">
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>

            <div className={styles.lgmCompareLayout}>
              <div className={styles.lgmCompareText}>
                <h2 className={styles.sectionTitle}>
                  Large Geospatial Model vs Large Language Model.
                </h2>
                <div className={styles.editorialBody}>
                  <p>
                    If an LLM is for the digital world, our LGM is for the
                    physical world.
                    <br />
                    We&rsquo;re personifying earth with physical AI. Instead of
                    words, we process data about our surroundings and the
                    anthropology in them.
                  </p>
                  <p>
                    A new foundational model is needed.
                  </p>
                </div>
                <Link href={blogHref(BLOG_SLUG.foundingLgmsInDepth)} className={styles.lgmInlineCta}>
                  <span>Read our in-depth article</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              <div className={styles.lgmCompareArt} aria-hidden>
                <WarmTechImage
                  src={techDiagram}
                  alt=""
                  sizes="(max-width: 1011px) 100vw, 1011px"
                  placeholder="blur"
                  className={styles.lgmCompareArtImg}
                />
              </div>
            </div>

            {/* ── How an LGM is different — comparison table ──
                Wrapped in ScaleToFit so the 4-column layout shrinks
                proportionally (instead of reflowing) below ~900px. */}
            <ScaleToFit designWidth={900} className={`${styles.lgmCompareScale} ${styles.fullBleedMobile}`}>
            <div className={styles.lgmCompareTable}>
              <div className={styles.dimBranding}>
                <WarmTechImage src={columbusLogo} alt="" width={32} height={32} className={styles.dimBrandingLogo} aria-hidden />
                <span>Columbus Earth</span>
              </div>

              <h3 className={styles.lgmCompareTableTitle}>An LGM vs other foundation models</h3>

              {/* Comparison grid — labels column + 3 model columns */}
              <div className={styles.dimTableGrid}>

                {/* ── Header row: empty cell + 3 model headers ── */}
                <div />
                <div className={styles.dimModelHeader}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/ResearchPgMedia/llm-text-icon.png" alt="" className={`${styles.dimModelHeaderIcon} ${styles.dimModelHeaderIconLlm}`} aria-hidden loading="lazy" decoding="async" />
                  <div className={styles.dimModelHeaderText}>
                    <h4 className={styles.dimModelHeaderName}>LLM</h4>
                    <p className={styles.dimModelHeaderSubtitle}>Large-Language-model</p>
                  </div>
                </div>
                <div className={styles.dimModelHeader}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/ResearchPgMedia/vlm-image-icon.png" alt="" className={`${styles.dimModelHeaderIcon} ${styles.dimModelHeaderIconVlm}`} aria-hidden loading="lazy" decoding="async" />
                  <div className={styles.dimModelHeaderText}>
                    <h4 className={styles.dimModelHeaderName}>VLM</h4>
                    <p className={styles.dimModelHeaderSubtitle}>Vision-Language-model</p>
                  </div>
                </div>
                <div className={styles.dimModelHeader}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/ResearchPgMedia/lgm-globe-icon.png" alt="" className={styles.dimModelHeaderIcon} aria-hidden loading="lazy" decoding="async" />
                  <div className={styles.dimModelHeaderText}>
                    <h4 className={`${styles.dimModelHeaderName} ${styles.dimModelHeaderNameLgm}`}>LGM</h4>
                    <p className={styles.dimModelHeaderSubtitle}>Large-Geospatial-model</p>
                  </div>
                </div>

                {/* ── Row 1: Trained on ── */}
                <div className={styles.dimRowLabel}>Trained on</div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellTop}`}>
                  <h4 className={styles.dimCellHeading}>Text</h4>
                  <p className={styles.dimCellNote}>e.g. &ldquo;The grass is&rdquo; → &ldquo;green&rdquo;</p>
                </div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellTop}`}>
                  <h4 className={styles.dimCellHeading}>Text &amp; Image</h4>
                  <p className={styles.dimCellNote}>e.g. dog photo → &ldquo;a border collie&rdquo;</p>
                </div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellTop} ${styles.dimGridCellLgm}`}>
                  <h4 className={styles.dimCellHeading}>Physical reality</h4>
                  <p className={styles.dimCellNote}>e.g. public data + urban imagery + GIS → crime risk map</p>
                </div>

                {/* ── Row 2: What it outputs ── */}
                <div className={styles.dimRowLabel}>What it<br />outputs</div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellMid}`}>
                  <h4 className={styles.dimCellHeading}>Predictive words</h4>
                  <p className={styles.dimCellNote}>&ldquo;What word comes next?&rdquo;</p>
                </div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellMid}`}>
                  <h4 className={styles.dimCellHeading}>Visual reasoning</h4>
                  <p className={styles.dimCellNote}>&ldquo;What&rsquo;s in this image?&rdquo;</p>
                </div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellMid} ${styles.dimGridCellLgm}`}>
                  <h4 className={styles.dimCellHeading}>Ground truths</h4>
                  <p className={styles.dimCellNote}>&ldquo;What&rsquo;s in this physical space?&rdquo;</p>
                </div>

                {/* ── Row 3: Who's building it ── */}
                <div className={styles.dimRowLabel}>Who&rsquo;s<br />building it</div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellBottom}`}>
                  <div className={styles.dimLogos}>
                    <div className={styles.dimLogoItem}>
                      <WarmTechImage src={chatgptLogo} alt="ChatGPT" sizes="100px" className={styles.dimLogoImg} />
                    </div>
                    <div className={styles.dimLogoItem}>
                      <WarmTechImage src={claudeLogo} alt="Claude" sizes="100px" className={styles.dimLogoImg} />
                    </div>
                    <div className={styles.dimLogoItem}>
                      <WarmTechImage src={grokLogo} alt="Grok" sizes="100px" className={styles.dimLogoImg} />
                    </div>
                    <div className={styles.dimLogoItem}>
                      <WarmTechImage src={perplexityLogo} alt="Perplexity" sizes="100px" className={styles.dimLogoImg} />
                    </div>
                  </div>
                </div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellBottom}`}>
                  <div className={styles.dimLogos} style={{ gridTemplateColumns: "1fr" }}>
                    <div className={styles.dimLogoItem}>
                      <WarmTechImage src={physicalIntelligenceLogo} alt="Physical Intelligence" sizes="135px" className={styles.dimLogoImg} style={{ maxWidth: 135 }} />
                    </div>
                    <div className={styles.dimLogoItem}>
                      <WarmTechImage src={runwayLogo} alt="Runway" sizes="100px" className={styles.dimLogoImg} />
                    </div>
                    <div className={styles.dimLogoItem}>
                      <WarmTechImage src={metaLogo} alt="Meta" sizes="100px" className={styles.dimLogoImg} />
                    </div>
                  </div>
                </div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellBottom} ${styles.dimGridCellLgm}`}>
                  <div className={styles.dimBrand}>
                    <WarmTechImage src={columbusLogo} alt="" width={64} height={64} className={styles.dimBrandLogo} aria-hidden />
                    <span className={styles.dimBrandName}>Columbus Earth</span>
                  </div>
                </div>

              </div>
            </div>
            </ScaleToFit>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 2. A New Foundational Model ── */}
      <Slide id="timeline" className={`${styles.lgmSlide} ${styles.dotGrid}`}>
        <div className={styles.slideFrame}>
          <RevealOnView className={`${styles.editorialSlide} ${styles.lgmFoundationalSlide}`}>
            <h2 className={styles.lgmFoundationalTitle}>
              A Large Geospatial Model is the next frontier in AI
            </h2>
            <p className={styles.lgmFoundationalLead}>The path forward</p>

            {(() => {
              // Timeline spans 2022 → 2028 inclusive (7 years) with a
              // 4%/4% gutter. yearMid(y) positions a milestone at mid-year.
              const yearAt = (y: number) =>
                `${(4 + ((y - 2022) / 7) * 92).toFixed(2)}%`;
              const yearMid = (y: number) => yearAt(y + 0.5);

              // 2025 + 2026 sit only one year apart — shift 2025 left and
              // 2026 right so their labels have breathing room.
              const x2025 = `calc(${yearMid(2025)} - clamp(140px, 16vw, 220px))`;
              const x2026 = `calc(${yearMid(2026)} + clamp(40px, 5vw, 80px))`;

              // Columbus "now" marker — its own dot/stem/date, sitting
              // between 2025 and 2026 on the TOP side of the track.
              const now = new Date();
              const nowFrac =
                now.getFullYear() +
                now.getMonth() / 12 +
                (now.getDate() - 1) / (12 * 30);
              const nowLabel = now.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              });
              const xColumbus = `calc(${yearAt(nowFrac)} - clamp(20px, 2.5vw, 40px))`;

              // Single source for the milestone content — drives both the
              // mobile/tablet vertical timeline and the screen-reader outline
              // below, so neither drifts from the horizontal layout above.
              const milestones: {
                year: string;
                label: string;
                full?: string;
                now?: boolean;
                cta?: { text: string; href: string };
              }[] = [
                { year: "2022", label: "LLM", full: "LLM (Large Language Model)" },
                { year: "2025", label: "Geo-tuned LLM & Vision Models" },
                { year: nowLabel, label: "Columbus", now: true },
                {
                  year: "2026",
                  label: "Generalist LGM",
                  full: "Generalist LGM (Large Geospatial Model)",
                  cta: { text: "Read our Paper", href: blogHref(BLOG_SLUG.timelineGeneralistLgm) },
                },
                {
                  year: "2028",
                  label: "UGM",
                  full: "UGM (Universal Geospatial Model)",
                  cta: { text: "Our Game Plan", href: blogHref(BLOG_SLUG.ugmRoadmapGamePlan) },
                },
              ];

              return (
              <>
            <div className={styles.lgmTimeline}>
              <div className={styles.lgmTimelineHalo} aria-hidden />
              <div id="lgm-timeline-track" className={styles.lgmTimelineTrack} aria-hidden />

              {/* (No major milestone dots — only the subtle minor rhythm dots
                  and the Columbus logo above the line remain.) */}

              {/* Minor rhythm dots at the in-between years so the line reads as
                  a continuous, lived-in track rather than a strict 1-per-year
                  grid — plus one before 2022 and one past UGM to bookend it. */}
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotMinor}`} style={{ left: "3%" }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotMinor}`} style={{ left: yearMid(2023) }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotMinor}`} style={{ left: yearMid(2024) }} aria-hidden />
              {/* Just left of the Columbus "now" logo (tracks the live marker). */}
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotMinor}`} style={{ left: `calc(${yearAt(nowFrac)} - clamp(60px, 7vw, 110px))` }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotMinor}`} style={{ left: yearMid(2027) }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotMinor}`} style={{ left: "94%" }} aria-hidden />

              {/* ─── 2022 — year above the line (no stem); LLM below ─── */}
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop}`} style={{ left: yearMid(2022) }}>
                <span className={styles.lgmTimelineLabel}>LLM</span>
                <span className={styles.lgmTimelineStem} aria-hidden />
              </div>
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom} ${styles.lgmTimelineMilestoneCompact}`} style={{ left: yearMid(2022) }}>
                <span className={styles.lgmTimelineYear}>2022</span>
              </div>

              {/* ─── 2025 — Geo-tuned label above; year below ─── */}
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop}`} style={{ left: x2025 }}>
                <span className={styles.lgmTimelineLabel}>
                  Geo-tuned LLM<br />&amp; Vision Models
                </span>
                <span className={styles.lgmTimelineStem} aria-hidden />
              </div>
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom} ${styles.lgmTimelineMilestoneCompact}`} style={{ left: x2025 }}>
                <span className={styles.lgmTimelineYear}>2025</span>
              </div>

              {/* ─── Columbus — separate "now" marker between 2025 and 2026 ─── */}
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop} ${styles.lgmTimelineColumbus}`} style={{ left: xColumbus }}>
                <WarmTechImage
                  src={columbusLogo}
                  alt="Columbus"
                  width={64}
                  height={64}
                  className={styles.lgmTimelineColumbusLogo}
                />
                <span className={styles.lgmTimelineStem} aria-hidden />
              </div>

              {/* ─── 2026 — Generalist LGM label above; year + CTA below ─── */}
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop}`} style={{ left: x2026 }}>
                <span className={styles.lgmTimelineLabel}>Generalist<br />LGM</span>
                <span className={styles.lgmTimelineStem} aria-hidden />
              </div>
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom}`} style={{ left: x2026 }}>
                <span className={styles.lgmTimelineYear}>2026</span>
                <Link href={blogHref(BLOG_SLUG.timelineGeneralistLgm)} className={styles.lgmTimelineCta}>
                  <span>Read our Paper</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              {/* ─── 2028 — UGM label above; year + CTA below ─── */}
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop}`} style={{ left: yearMid(2028) }}>
                <span className={styles.lgmTimelineLabel}>UGM</span>
                <span className={styles.lgmTimelineStem} aria-hidden />
              </div>
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom}`} style={{ left: yearMid(2028) }}>
                <span className={styles.lgmTimelineYear}>2028</span>
                <Link href={blogHref(BLOG_SLUG.ugmRoadmapGamePlan)} className={styles.lgmTimelineCta}>
                  <span>Our Game Plan</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              {/* SEO / a11y — crawler-friendly outline of the timeline */}
              <div className={styles.srOnly}>
                <h3>Timeline of foundational AI models</h3>
                <ul>
                  {milestones
                    .filter((m) => !m.now)
                    .map((m) => (
                      <li key={m.year}>
                        {m.year} — {m.full ?? m.label}
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Mobile / tablet (≤1024px): the horizontal track above can't
                fit its labels at narrow widths, so the same milestones
                reflow into this vertical timeline. Hidden on desktop (and
                the horizontal one is hidden here) via CSS. */}
            <ol
              className={styles.lgmTimelineVertical}
              aria-label="Timeline of foundational AI models"
            >
              {milestones.map((m) => (
                <li
                  key={m.year}
                  className={`${styles.lgmTimelineVRow}${m.now ? ` ${styles.lgmTimelineVRowNow}` : ""}`}
                >
                  {m.now ? (
                    <>
                      <WarmTechImage
                        src={columbusLogo}
                        alt="Columbus"
                        width={48}
                        height={48}
                        className={styles.lgmTimelineVLogo}
                      />
                      <span className={styles.lgmTimelineColumbusDate}>Now — {m.year}</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.lgmTimelineVYear}>{m.year}</span>
                      <span className={styles.lgmTimelineVLabel}>{m.label}</span>
                      {m.cta && (
                        <Link href={m.cta.href} className={styles.lgmTimelineCta}>
                          <span>{m.cta.text}</span>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                            <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ol>
            </>
              );
            })()}

            <Link
              href={blogHref(BLOG_SLUG.lgmVsLlmVision)}
              className={`${styles.lgmArticleCard} ${styles.lgmArticleCardGlass} ${styles.lgmArticleCardBgRadiance} ${styles.fullBleedMobile}`}
            >
              <span className={styles.lgmArticleKicker}>Read our article on</span>
              <p className={styles.lgmArticleHeadline}>
                the drawbacks of LLMs &amp; vision models.
              </p>
              <p className={styles.lgmArticleHeadlineStrong}>
                How the LGM innovates.
              </p>
            </Link>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 3. Core Reasoning / Our Research ── */}
      <Slide id="reasoning" className={styles.coreReasoningSlide}>
        <div className={styles.slideFrame}>
          <RevealOnView className={`${styles.editorialSlide} ${styles.coreResearchSlide}`}>
            <div className={styles.coreResearchHero}>
              {/* Voyager pulsar-map starburst — traced as inline SVG.
                  Spans the full hero so the long horizontal arm extends across
                  the gap between the intro paragraph and the aside, visually
                  splitting them. Center sits on the right side of the layout. */}
              <div className={styles.coreResearchStarburst} aria-hidden>
                <WarmTechImage
                  src={voyagerGraphic}
                  alt=""
                  fill
                  sizes="100vw"
                  placeholder="blur"
                  style={{ objectFit: "contain", objectPosition: "right center" }}
                />
              </div>

              <div className={styles.coreResearchIntroRow}>
                <div className={styles.coreResearchIntroText}>
                  <h2 className={styles.sectionTitle}>Our Reasoning</h2>
                  <div className={styles.editorialBody}>
                    <p>
                      We&apos;ve come up with several innovations within data
                      collection, fusion, and core reasoning. We combine several
                      innovations in unique ways in our research.
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.coreResearchAside}>
                <div className={styles.editorialBody}>
                  <p>
                    We learned first-hand how LLMs are not built for geospatial
                    needs. We set out to fix every technical issue that came with
                    GPT architecture and it converged into a new foundational
                    model, the LGM.
                  </p>
                </div>
                <Link href={blogHref(BLOG_SLUG.llmsGeospatialQueries)} className={styles.lgmInlineCta}>
                  <span>Why LLMs didn&apos;t work</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            <p className={styles.coreResearchIntroLine}>
              Our proprietary architecture is comprised of 3 parts. Within each
              are several innovations built during our practical research.
            </p>

            <ResearchAccordionProvider>
            <div className={styles.coreResearchGrid}>
              <CoreResearchArt />

              <div className={styles.coreResearchBody}>
                <ResearchGroup title={"1. Data Collection"}>
                  <p>
                    The most extensive data collection in the industry. Versatile
                    methods ranging from drones, car data, human data, public data
                    and more.
                  </p>
                  <p>
                    We&apos;ve achieved the cheapest{" "}
                    <Definition
                      term="P/POI."
                      title="P/POI — Price per Point of Interest"
                    >
                      The cost to capture a single geospatial data point. Lower
                      P/POI means richer, more affordable training data — a key
                      economic metric for any geospatial foundation model.
                    </Definition>
                  </p>
                  <Link href="/blog" className={styles.coreResearchGroupLink}>
                    Read our blog
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                      <path d="M2 8l6-6M3.5 2H8v4.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </ResearchGroup>

                <ResearchGroup title={"2. Fusion"}>
                  <p>
                    Accurate, automatic data filtering{" "}
                    <Definition
                      term="& labeling."
                      title="Automatic labeling"
                    >
                      The process of tagging raw, unstructured geospatial data
                      with structured metadata so a model can reason about it.
                      Our pipeline does this without human annotation.
                    </Definition>
                  </p>
                  <p>
                    We care about{" "}
                    <Definition
                      term="Ground Truths."
                      title="Ground truth"
                    >
                      A verified, real-world observation confirmed at a specific
                      X, Y, Z coordinate and time. Ground truths are the
                      reference signal we use to validate every layer of the
                      model.
                    </Definition>{" "}
                    We make sure each data point is the truth at that specific
                    X,Y,Z point at that given time.
                  </p>
                  <p>
                    Data scarcity is one of the hardest parts about the LGM
                    endeavor. To solve this, we have built innovative methods to
                    universally digest data. Meaning we are able to fuse data
                    together that our model then trains on. Cheaper and more
                    data &rarr; smarter model.
                  </p>
                </ResearchGroup>

                <ResearchGroup title={`3.${" "}Core Reasoning`}>
                  <p>
                    Our reasoning model considers temporal data, and sifts
                    through vast amounts of aggregated geospatial data &mdash;
                    including anthropologic data.
                  </p>
                  <p>
                    It continuously learns and creates new patterns through our
                    relational architecture.
                  </p>
                  <p>
                    Our core reasoning is comprised of a new permutation of
                    Reverse Diffusion and RAG architecture.
                  </p>
                  <Link href={blogHref(BLOG_SLUG.generativeGeospatialLayers)} className={styles.coreResearchGroupLink}>
                    Read our Paper
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                      <path d="M2 8l6-6M3.5 2H8v4.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </ResearchGroup>

                <ResearchGroup title={`4.${" "}Answers, insights, patterns`}>
                  <p>One model, innumerable granular ground truths.</p>
                  <div className={styles.coreResearchProducts}>
                    <a href="/business" className={styles.coreResearchProduct}>
                      <span className={styles.coreResearchProductGlyph} aria-hidden>
                        <WarmTechImage src={columbusLogo} alt="" width={36} height={36} />
                      </span>
                      <span>Columbus</span>
                    </a>
                    <a
                      href="https://mapsgpt.es"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.coreResearchProduct}
                    >
                      <span className={styles.coreResearchProductGlyph} aria-hidden>
                        <WarmTechImage src={mapsGptLogo} alt="" width={36} height={36} />
                      </span>
                      <span>Elio</span>
                    </a>
                    <span
                      className={`${styles.coreResearchProduct} ${styles.coreResearchProductSoon}`}
                      aria-disabled="true"
                    >
                      <span>More Soon</span>
                    </span>
                  </div>
                </ResearchGroup>
              </div>
            </div>
            </ResearchAccordionProvider>

            <div className={styles.coreResearchCarousel}>
              <CoreResearchCarousel />
            </div>

            <Link
              href={blogHref(BLOG_SLUG.foundingLgmsInDepth)}
              className={`${styles.lgmArticleCard} ${styles.lgmArticleCardGlass} ${styles.lgmArticleCardFlush} ${styles.lgmArticleCardBgWave} ${styles.fullBleedMobile}`}
            >
              <span className={styles.lgmArticleKicker}>Read our articles on</span>
              <p className={styles.lgmArticleHeadlineStrong}>
                our foundational model research
              </p>
            </Link>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 4. Results / Model Columbus-01 + Gen Layers + The Grid ── */}
      <Slide id="results" className={styles.dataCollectionSection}>
        <div className={styles.slideFrame}>
          <div className={styles.researchBlogWrap}>
          <RevealOnView className={`${styles.editorialSlide} ${styles.resultsSlide}`}>
            <h2 className={styles.resultsTitle}>Our Model: Magellan-1.0</h2>
            <p className={styles.resultsLead}>The latest results from our development of the LGM.</p>

            <div className={styles.resultsGrid}>
              {[
                {
                  num: "1",
                  text: "Contextually enriched reasoning over the semantics of urban space",
                },
                {
                  num: "2",
                  text: "Generative Geospatial data",
                },
                {
                  num: "3",
                  text: "A generalist model, grounded on a living data catalogue",
                },
                {
                  num: "4",
                  text: "Granular reasoning at scale",
                },
              ].map((item) => (
                <div key={item.num} className={styles.resultsCard}>
                  <ResultsArtFrame>
                    <ResultsGlobe num={item.num} />
                  </ResultsArtFrame>
                  <h3 className={styles.resultsCardText}>{item.text}</h3>
                </div>
              ))}
            </div>

            <div className={`${styles.resultsArticlesRow} ${styles.fullBleedMobile}`}>
              <Link href={blogHref(BLOG_SLUG.mappingUnknownGenLayers)} className={`${styles.lgmArticleCard} ${styles.lgmArticleCardBgUnknownLayers}`}>
                <p>
                  Mapping the unknown:<br />
                  <strong>Generative Geospatial layers</strong>
                </p>
              </Link>
              <Link href={blogHref(BLOG_SLUG.firePredictonModel)} className={`${styles.lgmArticleCard} ${styles.lgmArticleCardBgFirePrediction}`}>
                <p>
                  Research demonstration:<br />
                  <strong>Fire Prediction Model</strong>
                </p>
              </Link>
            </div>
          </RevealOnView>

          </div>
        </div>
      </Slide>

      {/* ── 5. Research Blog ── */}
      <Slide id="blog">
        <div className={styles.slideFrame}>
          <div className={styles.researchBlogWrap}>
            <RevealOnView className={`${styles.editorialSlide} ${styles.researchEditorial}`}>
              <h2 className={styles.sectionTitle}>Read our latest releases</h2>
              <p className={styles.sectionLead}>
                Explore the innovative research and recent papers from our team.
              </p>

              {/* Blog cards grid — responsive 3 → 2 → 1 columns, mirroring the
                  homepage BlogSection card system. */}
              <div className={styles.blogGrid}>
                {(() => {
                  const engineeringPosts = BLOG_POSTS.filter((p) => p.category === "ENGINEERING");
                  const joinUsPost = BLOG_POSTS.find((p) => p.slug === "join-us-research-opportunities");
                  const shuffled = [...engineeringPosts].sort(() => Math.random() - 0.5);
                  const selectedPosts = joinUsPost ? [joinUsPost, ...shuffled.slice(0, 2)] : shuffled.slice(0, 3);
                  return selectedPosts.map((post) => (
                    <Link key={post.slug} href={blogHref(post.slug)} className={styles.blogCard}>
                      <div className={styles.blogCardMedia}>
                        {post.image ? (
                          <WarmTechImage
                            src={post.image}
                            alt=""
                            fill
                            className={styles.blogCardImg}
                            sizes="(min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw"
                          />
                        ) : (
                          <div className={styles.blogCardFallback} aria-hidden="true" />
                        )}
                      </div>

                      <div className={styles.blogCardBody}>
                        <div className={styles.blogCardMeta}>
                          <span className={styles.blogCardTag}>{post.category}</span>
                          <span className={styles.blogCardDot} aria-hidden="true">·</span>
                          <span className={styles.blogCardTag}>{post.date}</span>
                        </div>
                        <h3 className={`h5 ${styles.blogCardTitle}`}>{post.title}</h3>
                        <p className={`p-m ${styles.blogCardDescription}`}>{post.description}</p>
                      </div>
                    </Link>
                  ));
                })()}
              </div>

              {/* Engineering articles from /Blog page — clean list rows */}
              <div className={styles.articleList}>
                {BLOG_POSTS.filter((p) => p.category === "ENGINEERING").map((post) => (
                  <Link
                    key={post.slug}
                    href={blogHref(post.slug)}
                    className={styles.articleRow}
                  >
                    <span className={styles.articleRowTitle}>{post.title}</span>
                    <div className={styles.articleRowRight}>
                      <span className={styles.articleRowDate}>{post.date}</span>
                      <span className={styles.articleRowArrow}>&rarr;</span>
                    </div>
                    <span className={styles.articleRowHoverLine} />
                  </Link>
                ))}
              </div>
            </RevealOnView>
          </div>
        </div>
      </Slide>

      {/* ── 6. Careers ── */}
      <Slide id="inquiries" className={styles.noSnapSection}>
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>

            <div className={styles.careersFormShell}>
              <CareersContactForm
                intro={
                  <div className={styles.careersIntro}>
                    <h2 className={styles.sectionTitle}>Careers</h2>
                    <p className={styles.sectionLead}>
                      If you&apos;re excited about creating paradigm shifts in physical
                      world understanding.
                    </p>
                  </div>
                }
              />
            </div>
          </RevealOnView>
        </div>
      </Slide>
      </div>
    </>
  );
}
