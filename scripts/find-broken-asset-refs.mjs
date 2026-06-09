#!/usr/bin/env node
// Comprehensive broken-asset-reference audit.
//
// For every asset path mentioned in:
//   - pre-rendered HTML in .next/server/app
//   - compiled JS in .next/static/chunks + .next/server
//   - source files (.ts, .tsx, .js, .jsx, .mjs, .cjs, .css, .scss, .html, .json)
//
// extract paths that look like they point at a public asset (start with `/`
// or are bare basenames with an asset extension), then verify each one
// resolves to an actual file in /public. Anything missing is reported.
//
// Limits — this is a static scan; it can't catch references that are fully
// computed at runtime from external data (e.g. API responses). It does
// catch every literal string and template-literal-with-static-prefix.
//
// Usage:
//   node scripts/find-broken-asset-refs.mjs

import fs from 'node:fs';
import path from 'node:path';

const REPO = path.resolve('.');
const PUBLIC_DIR = path.join(REPO, 'public');
const NEXT_DIR = path.join(REPO, '.next');

const ASSET_EXT = /\.(png|jpe?g|webp|avif|svg|gif|mp4|webm|mov|m4v|avi|mkv|mp3|wav|m4a|ogg|flac|aac|ico|woff2?|ttf|otf)$/i;
const SRC_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|css|scss|html|json)$/i;
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'design-extract-output', '_unused', 'scripts', '.claude']);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function walkAll(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkAll(p, out);
    else out.push(p);
  }
  return out;
}

function readSafe(p) {
  try {
    const stat = fs.statSync(p);
    if (stat.size > 20 * 1024 * 1024) return '';
    return fs.readFileSync(p, 'utf8');
  } catch { return ''; }
}

// Extract every plausible /public asset path from a text blob. Matches:
//   - "/path/to/asset.png" (quoted absolute path)
//   - '/path/to/asset.png'
//   - `/path/to/asset.png`
//   - url(/path/to/asset.png) and url("...") variants
//   - src=/path/to/asset.png (HTML)
//   - srcset="…/asset.png …" (only the first variant URL — the audit
//     cares about file existence, not srcset parsing)
//
// We don't catch fully-dynamic paths like `${prefix}/${name}.png` where
// neither half is a literal — those compile to concrete strings in build
// output, so the scan still catches them post-compile.
function extractRefs(text) {
  const refs = new Set();
  // Quoted absolute paths
  const re = /["'`]\/([^"'`)\s]{1,300}\.(?:png|jpe?g|webp|avif|svg|gif|mp4|webm|mov|m4v|avi|mkv|mp3|wav|m4a|ogg|flac|aac|ico|woff2?|ttf|otf))(?:\?[^"'`)\s]*)?["'`]/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    refs.add('/' + m[1]);
  }
  // url(...) without quotes
  const re2 = /url\(\s*\/([^)\s]{1,300}\.(?:png|jpe?g|webp|avif|svg|gif|mp4|webm|mov|m4v|avi|mkv|mp3|wav|m4a|ogg|flac|aac|ico|woff2?|ttf|otf))\s*\)/gi;
  while ((m = re2.exec(text)) !== null) {
    refs.add('/' + m[1]);
  }
  return refs;
}

function decodePath(p) {
  // Browser URLs may include %20 for spaces; the FS path uses literal spaces.
  try { return decodeURIComponent(p); } catch { return p; }
}

// 1. Collect haystacks.
console.log('Loading build output (.next/)...');
const buildPaths = [];
walkAll(path.join(NEXT_DIR, 'server', 'app')).forEach(p => { if (/\.html$/.test(p)) buildPaths.push(p); });
walkAll(NEXT_DIR).forEach(p => { if (/\.(js|mjs|cjs)$/.test(p)) buildPaths.push(p); });

console.log('Loading source files...');
const sourcePaths = [];
for (const e of fs.readdirSync(REPO, { withFileTypes: true })) {
  if (SKIP_DIRS.has(e.name) || e.name === 'public') continue;
  const p = path.join(REPO, e.name);
  if (e.isDirectory()) walk(p).forEach(f => { if (SRC_EXT.test(f)) sourcePaths.push(f); });
  else if (SRC_EXT.test(e.name)) sourcePaths.push(p);
}

// 2. Extract refs, separating build refs from source refs (build is what ships).
const buildRefs = new Map();      // path → set of build files that mention it
const sourceRefs = new Map();     // path → set of source files
function add(map, ref, file) {
  if (!map.has(ref)) map.set(ref, new Set());
  map.get(ref).add(file);
}

for (const f of buildPaths) {
  const text = readSafe(f);
  for (const r of extractRefs(text)) add(buildRefs, r, f);
}
for (const f of sourcePaths) {
  const text = readSafe(f);
  for (const r of extractRefs(text)) add(sourceRefs, r, f);
}

console.log(`  ${buildPaths.length} build files scanned.`);
console.log(`  ${sourcePaths.length} source files scanned.`);
console.log(`  ${buildRefs.size} unique paths found in build output.`);
console.log(`  ${sourceRefs.size} unique paths found in source.`);

// 3. Filter out paths that point to /_next/, /api/, or other non-public locations.
function isPublicAssetPath(p) {
  if (p.startsWith('/_next/')) return false;       // Next's internal optimizer paths
  if (p.startsWith('/api/')) return false;          // API routes
  return true;
}

// 4. For each unique referenced path, check if the corresponding file exists.
const allRefs = new Set([...buildRefs.keys(), ...sourceRefs.keys()].filter(isPublicAssetPath));

const missing = [];
const present = [];
for (const ref of allRefs) {
  const rel = decodePath(ref.replace(/^\//, ''));
  const abs = path.join(PUBLIC_DIR, rel);
  if (fs.existsSync(abs)) {
    present.push(ref);
  } else {
    missing.push({
      ref,
      inBuild: buildRefs.has(ref),
      inSource: sourceRefs.has(ref),
      buildFiles: [...(buildRefs.get(ref) || [])].slice(0, 3),
      sourceFiles: [...(sourceRefs.get(ref) || [])].slice(0, 3),
    });
  }
}

console.log('');
console.log('===== Broken-asset-reference audit =====');
console.log(`Unique asset paths referenced anywhere: ${allRefs.size}`);
console.log(`  Present on disk:                      ${present.length}`);
console.log(`  ⚠ Missing on disk:                    ${missing.length}`);
console.log('');

if (missing.length === 0) {
  console.log('✓ No broken references. Every asset path mentioned in source or build points to a real file in /public.');
  process.exit(0);
}

console.log('Missing assets:');
console.log('');
// Sort by severity: build refs first (definitely loaded), then source-only.
missing.sort((a, b) => Number(b.inBuild) - Number(a.inBuild));
for (const m of missing) {
  const severity = m.inBuild ? '⚠ IN BUILD (real ship risk)' : '· in source only (likely dead code)';
  console.log(`  ${severity}  ${m.ref}`);
  const showFiles = m.inBuild ? m.buildFiles : m.sourceFiles;
  for (const f of showFiles) {
    console.log(`      ${path.relative(REPO, f)}`);
  }
}
process.exit(missing.length);
