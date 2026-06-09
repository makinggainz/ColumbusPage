#!/usr/bin/env node
// Find every image file in /public that no source file references, and
// optionally move them into /public/_unused/ (preserving relative paths).
//
// Detection rules — a file is treated as USED if any of these match
// across all .ts/.tsx/.js/.jsx/.mjs/.cjs/.css/.scss/.html/.md/.mdx/.json
// outside node_modules / .next / .git / design-extract-output:
//   1. Basename literal match (`comm.png`)
//   2. Stem-only match (`comm`), length >= 4
//   3. URL-encoded basename (`HK%20Map.png`)
//   4. Parent directory name appears as a path segment in source
//      (catches dynamic refs like `/use-cases/${id}.png`)
// Also reads /public/**/*.json for additional cross-references.
//
// A file is UNUSED only if none match (strict mode), or stems are
// excluded with --include-stems.
//
// Flags:
//   --dry-run         Print summary + write MANIFEST.txt, no moves. (default)
//   --apply           Actually move files via git mv (or plain mv for untracked).
//   --include-stems   Treat stem-only matches as unused (NOT recommended).
//
// Output:
//   public/_unused/MANIFEST.txt  one line per unused file.
//
// Usage:
//   node scripts/find-unused-images.mjs              # dry run
//   node scripts/find-unused-images.mjs --apply      # move files

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const REPO = path.resolve('.');
const PUBLIC_DIR = path.join(REPO, 'public');
const QUARANTINE = path.join(PUBLIC_DIR, '_unused');

const IMG_EXT = /\.(png|jpe?g|webp|avif|svg|gif)$/i;
const SRC_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|css|scss|html|md|mdx|json)$/i;
const SKIP_DIR = new Set(['node_modules', '.next', '.git', 'design-extract-output', '_unused']);

function parseArgs(argv) {
  const args = { dryRun: true, includeStems: false };
  for (const a of argv) {
    if (a === '--apply') args.dryRun = false;
    else if (a === '--include-stems') args.includeStems = true;
    else if (a === '--dry-run') args.dryRun = true;
  }
  return args;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function isTracked(absPath) {
  try {
    execSync(`git ls-files --error-unmatch "${absPath}"`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const args = parseArgs(process.argv.slice(2));

// 1. Inventory all images in /public (excluding the quarantine itself).
const allImages = walk(PUBLIC_DIR).filter(p => IMG_EXT.test(p));

// 2. Collect source files outside /public.
const sourceFiles = [];
for (const e of fs.readdirSync(REPO, { withFileTypes: true })) {
  if (SKIP_DIR.has(e.name) || e.name === 'public') continue;
  const p = path.join(REPO, e.name);
  if (e.isDirectory()) {
    walk(p).forEach(f => { if (SRC_EXT.test(f)) sourceFiles.push(f); });
  } else if (SRC_EXT.test(e.name)) {
    sourceFiles.push(p);
  }
}

// 3. Also pull .json from inside /public (manifests etc).
walk(PUBLIC_DIR).forEach(f => {
  if (/\.json$/i.test(f)) sourceFiles.push(f);
});

console.log(`Indexed ${sourceFiles.length} source files. Concatenating for search...`);
let bigText = '';
for (const f of sourceFiles) {
  try { bigText += fs.readFileSync(f, 'utf8') + '\n'; } catch {}
}

// 4. Classify each image.
const used = [];
const ambiguous = [];   // stem or dir-segment hit only
const unused = [];

for (const imgPath of allImages) {
  const rel = path.relative(PUBLIC_DIR, imgPath).split(path.sep).join('/');
  const base = path.basename(imgPath);
  const stem = path.basename(imgPath, path.extname(imgPath));
  const parentDir = path.basename(path.dirname(rel));

  const basenameHit = bigText.includes(base);
  const encodedHit = base.includes(' ') || /[%()&+]/.test(base)
    ? bigText.includes(encodeURIComponent(base))
    : false;
  const stemHit = stem.length >= 4 && bigText.includes(stem);
  const dirHit = parentDir && parentDir !== '.' && bigText.includes('/' + parentDir + '/');

  if (basenameHit || encodedHit) {
    used.push(imgPath);
  } else if (stemHit || dirHit) {
    ambiguous.push({ path: imgPath, stemHit, dirHit, parentDir });
  } else {
    unused.push(imgPath);
  }
}

// 5. Per user's strict-mode choice, "ambiguous" files are kept (treated as used).
// Only the `unused` list is the quarantine target unless --include-stems.
const moveList = args.includeStems
  ? [...unused, ...ambiguous.map(a => a.path)]
  : unused;

function size(p) { try { return fs.statSync(p).size; } catch { return 0; } }
const totalBytes = moveList.reduce((s, p) => s + size(p), 0);

// 6. Summary by top-level subfolder.
const byFolder = {};
for (const p of moveList) {
  const rel = path.relative(PUBLIC_DIR, p).split(path.sep);
  const top = rel.length > 1 ? rel[0] : '(root)';
  if (!byFolder[top]) byFolder[top] = { count: 0, bytes: 0 };
  byFolder[top].count++;
  byFolder[top].bytes += size(p);
}

console.log('');
console.log('===== Image audit =====');
console.log(`Total /public images:               ${allImages.length}`);
console.log(`Used (basename or URL-encoded hit): ${used.length}`);
console.log(`Ambiguous (stem-only or dir-only):  ${ambiguous.length}    (kept in place)`);
console.log(`Unused (no match at all):           ${unused.length}    (${(unused.reduce((s,p)=>s+size(p),0)/1024/1024).toFixed(1)} MB)`);
console.log('');
console.log(`Move target: ${moveList.length} file(s), ${(totalBytes/1024/1024).toFixed(1)} MB total`);
console.log('');
console.log('Breakdown by top-level subfolder:');
const folderRows = Object.entries(byFolder).sort((a, b) => b[1].bytes - a[1].bytes);
for (const [folder, { count, bytes }] of folderRows) {
  console.log(`  ${(bytes/1024/1024).toFixed(1).padStart(7)} MB  ${String(count).padStart(4)} files  ${folder}`);
}

// 7. Write MANIFEST.txt
const manifestLines = [
  `# Quarantined unused images — generated ${new Date().toISOString()}`,
  `# Total: ${moveList.length} files, ${(totalBytes/1024/1024).toFixed(1)} MB`,
  `# Format: <bytes>\t<original-relative-path>`,
  '',
];
const manifestRows = moveList
  .map(p => ({ p, size: size(p), rel: path.relative(PUBLIC_DIR, p).split(path.sep).join('/') }))
  .sort((a, b) => b.size - a.size);
for (const { size, rel } of manifestRows) {
  manifestLines.push(`${size}\t${rel}`);
}

if (args.dryRun) {
  console.log('');
  console.log('[DRY RUN] No files moved.');
  console.log('[DRY RUN] Manifest preview (would be written to public/_unused/MANIFEST.txt):');
  console.log('');
  // Print only first 20 lines so console isn't flooded.
  for (const line of manifestLines.slice(0, 30)) console.log('  ' + line);
  if (manifestLines.length > 30) console.log(`  ... +${manifestLines.length - 30} more rows`);
  console.log('');
  console.log('Re-run with --apply to actually move files.');
  process.exit(0);
}

// 8. Apply moves.
console.log('');
console.log(`Moving ${moveList.length} file(s) into ${path.relative(REPO, QUARANTINE)}/ ...`);
fs.mkdirSync(QUARANTINE, { recursive: true });
fs.writeFileSync(path.join(QUARANTINE, 'MANIFEST.txt'), manifestLines.join('\n') + '\n');

let movedTracked = 0, movedUntracked = 0, errors = 0;
for (const src of moveList) {
  const rel = path.relative(PUBLIC_DIR, src).split(path.sep).join('/');
  const dest = path.join(QUARANTINE, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    if (isTracked(src)) {
      execSync(`git mv "${src}" "${dest}"`, { stdio: 'pipe' });
      movedTracked++;
    } else {
      fs.renameSync(src, dest);
      movedUntracked++;
    }
  } catch (e) {
    console.log(`ERROR moving ${rel}: ${e.message}`);
    errors++;
  }
}

console.log('');
console.log(`Done. ${movedTracked} tracked + ${movedUntracked} untracked moved. ${errors} errors.`);
console.log(`Manifest at: ${path.relative(REPO, path.join(QUARANTINE, 'MANIFEST.txt'))}`);
