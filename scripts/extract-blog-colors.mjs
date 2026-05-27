/**
 * Extract a representative, readable-on-white accent color from each blog
 * post image. Picks the dominant hue (saturation-weighted) and renders it
 * at a fixed dark luminance so contrast against the white notch passes.
 *
 * Run: node scripts/extract-blog-colors.mjs
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "..", "public");

const IMAGES = [
  "/Blogs/EngineeringCover.png",
  "/Blogs/firePredictionBlog.png",
  "/Blogs/mapsgptBlog.png",
  "/Blogs/chooseCitiesBlog.png",
  "/Blogs/madridBlog.png",
  "/Blogs/europeGuideBlog.png",
  "/Blogs/spainGuideBlog.png",
  "/Blogs/funResearchBlog.png",
  "/Blogs/preOrdersBlog.png",
  "/Blogs/siteSelectionBlog.png",
  "/Blogs/elioV2Blog.png",
  "/Blogs/joinUs.png",
];

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h, s;
  if (max === min) { h = 0; s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  h /= 360;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

const toHex = (n) => n.toString(16).padStart(2, "0");
const rgbToHex = (r, g, b) => `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();

// WCAG relative luminance
function relLum(r, g, b) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrastVsWhite(r, g, b) {
  const L = relLum(r, g, b);
  return (1 + 0.05) / (L + 0.05);
}

// Snap hues in the purple/magenta/violet/indigo range over to blue.
// Project rule: no purple anywhere.
function clampHueAwayFromPurple(h) {
  // Purple-ish band: roughly 250..330deg (indigo→violet→magenta→pink-mag).
  if (h >= 250 && h <= 330) return 215; // settle on a vivid blue
  return h;
}

async function extract(imagePath) {
  const abs = path.join(PUBLIC, imagePath);
  // Resize for speed; raw pixels include alpha if present.
  const { data, info } = await sharp(abs)
    .resize(64, 64, { fit: "cover" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels; // 3 after removeAlpha
  // 12 hue bins, saturation-weighted; ignore near-grey + near-black/white.
  const bins = new Array(12).fill(0);
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const [h, s, l] = rgbToHsl(r, g, b);
    if (s < 0.18) continue;          // too grey to count as a hue
    if (l < 0.08 || l > 0.92) continue; // near-black / near-white
    const bin = Math.floor(h / 30) % 12;
    bins[bin] += s; // weight by saturation
  }
  let bestBin = 0;
  for (let i = 1; i < 12; i++) if (bins[i] > bins[bestBin]) bestBin = i;

  // Refine: average hue within the winning bin
  let hueSum = 0, hueW = 0, satSum = 0, satW = 0;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const [h, s, l] = rgbToHsl(r, g, b);
    if (s < 0.18 || l < 0.08 || l > 0.92) continue;
    const bin = Math.floor(h / 30) % 12;
    if (bin !== bestBin) continue;
    hueSum += h * s; hueW += s;
    satSum += s;     satW += 1;
  }
  let hue = hueW > 0 ? hueSum / hueW : bestBin * 30 + 15;
  hue = clampHueAwayFromPurple(hue);
  const sat = satW > 0 ? Math.min(0.75, Math.max(0.55, satSum / satW + 0.15)) : 0.6;

  // Pick a lightness that yields contrast vs white ≥ 4.5 (WCAG AA body text).
  let light = 0.35;
  let [r, g, b] = hslToRgb(hue, sat, light);
  while (contrastVsWhite(r, g, b) < 4.5 && light > 0.12) {
    light -= 0.02;
    [r, g, b] = hslToRgb(hue, sat, light);
  }
  return { imagePath, hex: rgbToHex(r, g, b), hue: Math.round(hue), sat: +sat.toFixed(2), light: +light.toFixed(2), contrast: +contrastVsWhite(r, g, b).toFixed(2) };
}

const results = [];
for (const img of IMAGES) {
  try {
    results.push(await extract(img));
  } catch (e) {
    results.push({ imagePath: img, error: e.message });
  }
}
for (const r of results) console.log(JSON.stringify(r));
