#!/usr/bin/env node
// One-shot PNG downsizer for /public.
//
// Walks public/, picks every PNG larger than MIN_BYTES, and resizes it down to
// a tier cap (preserving aspect ratio) with sharp. Writes to a temp file then
// atomic-renames over the source.
//
// Originals are expected to already be in
//   /Users/alexramirezblonski/Documents/ColumbusPage-image-backup/
// (created by the safety-net step). This script does NOT make its own backups.
//
// Flags:
//   --dry-run        Report planned actions, change nothing.
//   --only <glob>    Only process files whose path contains this substring.
//                    Example: --only TechnologyPageImages
//   --min-mb <N>     Override MIN_BYTES (default 2).
//
// Usage:
//   node scripts/optimize-images.mjs --dry-run
//   node scripts/optimize-images.mjs --only TechnologyPageImages
//   node scripts/optimize-images.mjs

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve('public');
const MIN_BYTES_DEFAULT = 2 * 1024 * 1024;

// Tier order matters — first matching prefix wins. All paths are relative
// to /public and use forward slashes.
const TIERS = [
  // Full-bleed hero backdrops — bigger cap because they cover the viewport.
  { prefix: 'beach.png',                 maxWidth: 3200, name: 'hero' },
  { prefix: 'companyhero.png',           maxWidth: 3200, name: 'hero' },
  { prefix: 'terra.png',                 maxWidth: 3200, name: 'hero' },
  { prefix: 'consumer/',                 maxWidth: 3200, name: 'hero' },
  { prefix: 'product/',                  maxWidth: 3200, name: 'hero' },
  { prefix: 'use-cases/hero',            maxWidth: 3200, name: 'hero' },

  // Avatars / icons / logos — small.
  { prefix: 'profiles/',                 maxWidth: 512,  name: 'avatar' },
  { prefix: 'team/',                     maxWidth: 512,  name: 'avatar' },
  { prefix: 'emoji/',                    maxWidth: 512,  name: 'avatar' },
  { prefix: 'Icon/',                     maxWidth: 512,  name: 'avatar' },
  { prefix: 'MapsGPTLogos/',             maxWidth: 512,  name: 'avatar' },

  // Default: content tiles, map screenshots, cards. 1920 fits any modern viewport.
];

const DEFAULT_TIER = { maxWidth: 1920, name: 'content' };

function tierFor(relPath) {
  for (const t of TIERS) {
    if (relPath.startsWith(t.prefix)) return t;
  }
  return DEFAULT_TIER;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.png$/i.test(e.name)) out.push(p);
  }
  return out;
}

function parseArgs(argv) {
  const args = { dryRun: false, only: null, minBytes: MIN_BYTES_DEFAULT };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--only') args.only = argv[++i];
    else if (a === '--min-mb') args.minBytes = Number(argv[++i]) * 1024 * 1024;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

const all = walk(PUBLIC_DIR);
const targets = [];
for (const abs of all) {
  const size = fs.statSync(abs).size;
  if (size < args.minBytes) continue;
  const rel = path.relative(PUBLIC_DIR, abs).split(path.sep).join('/');
  if (args.only && !rel.includes(args.only)) continue;
  targets.push({ abs, rel, size });
}

targets.sort((a, b) => b.size - a.size);

let totalBefore = 0;
let totalAfter = 0;
let resized = 0;
let skipped = 0;

console.log(`[optimize-images] scanning ${PUBLIC_DIR}`);
console.log(`[optimize-images] ${targets.length} PNG(s) over ${(args.minBytes / 1024 / 1024).toFixed(1)} MB`);
if (args.dryRun) console.log('[optimize-images] DRY RUN — no files will be written');
console.log('');

for (const { abs, rel, size } of targets) {
  const tier = tierFor(rel);
  let meta;
  try {
    meta = await sharp(abs).metadata();
  } catch (e) {
    console.log(`SKIP (unreadable) ${rel}: ${e.message}`);
    skipped++;
    continue;
  }

  totalBefore += size;

  if (!meta.width || meta.width <= tier.maxWidth) {
    // Already small enough pixel-wise. Try recompressing at level 9 in case
    // the file was saved uncompressed — but only if it actually shrinks.
    if (args.dryRun) {
      console.log(`would recompress  ${(size / 1024 / 1024).toFixed(1)}MB  ${meta.width}x${meta.height}  [${tier.name}]  ${rel}`);
      totalAfter += size;
      continue;
    }
    try {
      const tmp = abs + '.tmp.png';
      await sharp(abs).png({ compressionLevel: 9 }).toFile(tmp);
      const newSize = fs.statSync(tmp).size;
      if (newSize < size * 0.95) {
        fs.renameSync(tmp, abs);
        console.log(`recompressed      ${(size / 1024 / 1024).toFixed(1)}MB → ${(newSize / 1024 / 1024).toFixed(1)}MB  ${rel}`);
        totalAfter += newSize;
        resized++;
      } else {
        fs.unlinkSync(tmp);
        console.log(`skip recompress   ${(size / 1024 / 1024).toFixed(1)}MB  (no improvement)  ${rel}`);
        totalAfter += size;
        skipped++;
      }
    } catch (e) {
      console.log(`ERROR recompress ${rel}: ${e.message}`);
      totalAfter += size;
      skipped++;
    }
    continue;
  }

  const targetWidth = tier.maxWidth;

  if (args.dryRun) {
    console.log(`would resize      ${(size / 1024 / 1024).toFixed(1)}MB  ${meta.width}x${meta.height} → ${targetWidth}w  [${tier.name}]  ${rel}`);
    // Estimate ~ scale-factor^2 reduction in pixels, plus compression headroom.
    const est = size * Math.pow(targetWidth / meta.width, 2) * 0.85;
    totalAfter += est;
    continue;
  }

  try {
    const tmp = abs + '.tmp.png';
    await sharp(abs)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(tmp);
    const newSize = fs.statSync(tmp).size;
    if (newSize >= size) {
      // Re-encode made the file larger (common for photographs stored as PNG).
      // Keep the original and warn — let a manual JPEG/WebP conversion handle these.
      fs.unlinkSync(tmp);
      console.log(`skip resize       ${(size / 1024 / 1024).toFixed(1)}MB  (re-encode bloated to ${(newSize / 1024 / 1024).toFixed(1)}MB)  ${rel}`);
      totalAfter += size;
      skipped++;
      continue;
    }
    fs.renameSync(tmp, abs);
    console.log(`resized           ${(size / 1024 / 1024).toFixed(1)}MB → ${(newSize / 1024 / 1024).toFixed(1)}MB  ${meta.width}→${targetWidth}w  [${tier.name}]  ${rel}`);
    totalAfter += newSize;
    resized++;
  } catch (e) {
    console.log(`ERROR resize ${rel}: ${e.message}`);
    totalAfter += size;
    skipped++;
  }
}

console.log('');
console.log(`[optimize-images] done. ${resized} written, ${skipped} skipped/errored`);
console.log(`[optimize-images] total ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(1)} MB${args.dryRun ? ' (estimated)' : ''}`);
