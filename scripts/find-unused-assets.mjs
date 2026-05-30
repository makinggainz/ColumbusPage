#!/usr/bin/env node
// Deeper audit: find images / videos / audio in /public that are NOT
// actually shipped by the build. Replaces find-unused-images.mjs for
// future runs.
//
// Strategy — trust what the build produced, not what source says.
//
//   1. Pre-rendered HTML in .next/server/app/**/*.html  ← every URL
//      that statically renders ends up here.
//   2. Compiled JS in .next/static/chunks/**/*.js +
//      .next/server/**/*.js  ← every client-bundled string literal
//      that survived tree-shaking ends up here, including paths
//      referenced inside React components.
//
// If a file's basename appears anywhere in either of those, it is
// genuinely loaded by something that ships. If it doesn't, it is
// almost certainly dead code's leftover asset.
//
// A weaker source-tree pass is kept as a fallback to catch refs
// that the build pipeline doesn't capture (e.g. refs inside a
// JSON file served verbatim or inside docs).
//
// Stem matching is now WORD-BOUNDED — the stem must be surrounded
// by delimiters (quote, slash, dot, hyphen, space, etc.) so e.g.
// "henti" no longer matches inside "Authentic".
//
// Usage:
//   node scripts/find-unused-assets.mjs               # dry run
//   node scripts/find-unused-assets.mjs --apply       # move to _unused/

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const REPO = path.resolve('.');
const PUBLIC_DIR = path.join(REPO, 'public');
const QUARANTINE = path.join(PUBLIC_DIR, '_unused');
const NEXT_DIR = path.join(REPO, '.next');

const ASSET_EXT = /\.(png|jpe?g|webp|avif|svg|gif|mp4|webm|mov|m4v|avi|mkv|mp3|wav|m4a|ogg|flac|aac)$/i;
const SRC_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|css|scss|html|md|mdx|json)$/i;
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'design-extract-output', '_unused']);
const STEM_BOUNDARY = /[/"'`(){}<>\[\],\s.\-]/; // chars that legitimately delimit a path stem

function parseArgs(argv) {
  const args = { dryRun: true };
  for (const a of argv) {
    if (a === '--apply') args.dryRun = false;
    else if (a === '--dry-run') args.dryRun = true;
  }
  return args;
}

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
  // Like walk but doesn't skip — for traversing .next/.
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkAll(p, out);
    else out.push(p);
  }
  return out;
}

function readSafe(p, maxBytes = 10 * 1024 * 1024) {
  try {
    const stat = fs.statSync(p);
    if (stat.size > maxBytes) return '';
    return fs.readFileSync(p, 'utf8');
  } catch { return ''; }
}

// Strip /* ... */ block comments before matching. These can mention old
// asset names in stale documentation lines that survived a refactor — and
// they're particularly insidious in CSS-in-JS template literals
// (e.g. `const CSS = \`/* old (/foo.png) replaced */ .x{...}\``) because
// Next bundles the entire string verbatim, comments included. Stripping
// them here keeps the audit honest about what code actually loads.
//
// Why only block comments and not line comments: `//` appears in real URLs
// (`https://`), inside JS strings, and inside CSS `content` declarations.
// Stripping it would create new false positives. Block comments don't
// share that ambiguity — `/*` essentially never appears in real data.
//
// Past misses fixed by this preprocessor (append when extending):
//   - 2026-05-30  Colbackgroundcard.png  (CSS comment in
//                 components/home/BentoProducts.tsx CSS-in-JS literal)
function stripBlockComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, ' ');
}

function isTracked(absPath) {
  try {
    execSync(`git ls-files --error-unmatch "${absPath}"`, { stdio: 'ignore' });
    return true;
  } catch { return false; }
}

// Test: does `haystack` contain `needle` as a word-bounded substring?
// "henti" should NOT match inside "Authentic"; "/use-cases/henti.png"
// or "henti" or "'henti'" should match.
function containsBounded(haystack, needle) {
  let idx = 0;
  while (true) {
    const i = haystack.indexOf(needle, idx);
    if (i === -1) return false;
    const before = i === 0 ? '' : haystack[i - 1];
    const after = i + needle.length >= haystack.length ? '' : haystack[i + needle.length];
    const okBefore = before === '' || STEM_BOUNDARY.test(before);
    const okAfter = after === '' || STEM_BOUNDARY.test(after);
    if (okBefore && okAfter) return true;
    idx = i + 1;
  }
}

const args = parseArgs(process.argv.slice(2));

// ── 1. Inventory all assets in /public (excluding the existing _unused). ──
const allAssets = walk(PUBLIC_DIR).filter(p => ASSET_EXT.test(p));

// ── 2. Build the haystack ──
//   2a. Compiled output from .next/ (definitive: what ships)
//   2b. Source files (fallback: catches refs the build pipeline drops)
console.log('Loading build output from .next/...');
let buildText = '';
let buildFiles = 0;
if (fs.existsSync(NEXT_DIR)) {
  // Pre-rendered HTML
  const htmlPaths = walkAll(path.join(NEXT_DIR, 'server', 'app')).filter(p => /\.html$/.test(p));
  for (const f of htmlPaths) { buildText += readSafe(f) + '\n'; buildFiles++; }
  // Compiled JS (client + server)
  const jsPaths = walkAll(NEXT_DIR).filter(p => /\.(js|mjs|cjs)$/.test(p));
  for (const f of jsPaths) { buildText += readSafe(f) + '\n'; buildFiles++; }
}
buildText = stripBlockComments(buildText);
console.log(`  ${buildFiles} build files loaded (block comments stripped).`);

console.log('Loading source files (fallback)...');
const sourceFiles = [];
for (const e of fs.readdirSync(REPO, { withFileTypes: true })) {
  if (SKIP_DIRS.has(e.name) || e.name === 'public') continue;
  const p = path.join(REPO, e.name);
  if (e.isDirectory()) walk(p).forEach(f => { if (SRC_EXT.test(f)) sourceFiles.push(f); });
  else if (SRC_EXT.test(e.name)) sourceFiles.push(p);
}
walk(PUBLIC_DIR).forEach(f => { if (/\.json$/i.test(f)) sourceFiles.push(f); });
// Exclude this script + the older find-unused-images script from the source
// scan — their own comments reference example filenames and would otherwise
// self-mark those files as "used".
const SELF_SCRIPTS = new Set([
  path.join(REPO, 'scripts', 'find-unused-assets.mjs'),
  path.join(REPO, 'scripts', 'find-unused-images.mjs'),
]);
const filteredSourceFiles = sourceFiles.filter(f => !SELF_SCRIPTS.has(f));
let sourceText = '';
for (const f of filteredSourceFiles) sourceText += readSafe(f) + '\n';
sourceText = stripBlockComments(sourceText);
console.log(`  ${filteredSourceFiles.length} source files loaded (excluding self, block comments stripped).`);

// ── 3. Classify each asset. ──
const buckets = {
  inBuild: [],         // basename present in compiled output → DEFINITELY used
  sourceOnly: [],      // basename absent in build but present in source → still used (build hasn't caught it, but reference exists)
  stemInBuild: [],     // only the stem appears (word-bounded) in build → probably used dynamically
  stemInSource: [],    // only the stem appears (word-bounded) in source → ambiguous
  unused: [],          // no match anywhere → quarantine target
};

for (const absPath of allAssets) {
  const base = path.basename(absPath);
  const stem = path.basename(absPath, path.extname(absPath));
  const encoded = base.includes(' ') || /[%()&+]/.test(base) ? encodeURIComponent(base) : null;

  // Strongest signal: build output contains the literal basename.
  if (buildText.includes(base) || (encoded && buildText.includes(encoded))) {
    buckets.inBuild.push(absPath);
    continue;
  }

  // Next strongest: source contains the literal basename.
  if (sourceText.includes(base) || (encoded && sourceText.includes(encoded))) {
    buckets.sourceOnly.push(absPath);
    continue;
  }

  // Weaker: stem appears word-bounded in build output.
  if (stem.length >= 4 && containsBounded(buildText, stem)) {
    buckets.stemInBuild.push(absPath);
    continue;
  }

  // Weakest: stem appears word-bounded in source.
  if (stem.length >= 4 && containsBounded(sourceText, stem)) {
    buckets.stemInSource.push(absPath);
    continue;
  }

  buckets.unused.push(absPath);
}

function size(p) { try { return fs.statSync(p).size; } catch { return 0; } }
function mb(n) { return (n / 1024 / 1024).toFixed(1); }

console.log('');
console.log('===== Deep asset audit =====');
console.log(`Total assets in /public (excluding _unused):  ${allAssets.length}`);
console.log(`  Used — basename in build output:           ${buckets.inBuild.length}`);
console.log(`  Used — basename in source only:            ${buckets.sourceOnly.length}`);
console.log(`  Ambiguous — stem (bounded) in build:       ${buckets.stemInBuild.length}`);
console.log(`  Ambiguous — stem (bounded) in source:      ${buckets.stemInSource.length}`);
console.log(`  UNUSED — no match anywhere:                ${buckets.unused.length}    (${mb(buckets.unused.reduce((s,p)=>s+size(p),0))} MB)`);

// ── 4. Write manifest of unused ──
const manifestLines = [
  `# Deep audit — generated ${new Date().toISOString()}`,
  `# Strategy: cross-check against .next/ compiled build output, not source-grep.`,
  `# Total: ${buckets.unused.length} files, ${mb(buckets.unused.reduce((s,p)=>s+size(p),0))} MB`,
  `# Format: <bytes>\t<original-relative-path>`,
  '',
];
const rows = buckets.unused
  .map(p => ({ p, sz: size(p), rel: path.relative(PUBLIC_DIR, p).split(path.sep).join('/') }))
  .sort((a, b) => b.sz - a.sz);
for (const { sz, rel } of rows) manifestLines.push(`${sz}\t${rel}`);

if (args.dryRun) {
  console.log('');
  console.log('[DRY RUN] Top 25 candidates:');
  for (const r of rows.slice(0, 25)) console.log(`  ${mb(r.sz).padStart(6)} MB  ${r.rel}`);
  if (rows.length > 25) console.log(`  ... +${rows.length - 25} more`);
  console.log('');
  console.log('Re-run with --apply to move them.');
  process.exit(0);
}

// ── 5. Move into quarantine ──
console.log('');
console.log(`Moving ${buckets.unused.length} file(s) into public/_unused/ ...`);
fs.mkdirSync(QUARANTINE, { recursive: true });
// Append to existing MANIFEST.txt instead of overwriting
const existing = fs.existsSync(path.join(QUARANTINE, 'MANIFEST.txt'))
  ? fs.readFileSync(path.join(QUARANTINE, 'MANIFEST.txt'), 'utf8')
  : '';
fs.writeFileSync(
  path.join(QUARANTINE, 'MANIFEST.txt'),
  existing + '\n' + manifestLines.join('\n') + '\n',
);

let moved = 0, errors = 0;
for (const src of buckets.unused) {
  const rel = path.relative(PUBLIC_DIR, src).split(path.sep).join('/');
  const dest = path.join(QUARANTINE, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    if (isTracked(src)) execSync(`git mv "${src}" "${dest}"`, { stdio: 'pipe' });
    else fs.renameSync(src, dest);
    moved++;
  } catch (e) {
    console.log(`ERROR ${rel}: ${e.message}`);
    errors++;
  }
}

console.log(`Done. ${moved} moved, ${errors} errors.`);
console.log(`Manifest appended: public/_unused/MANIFEST.txt`);
