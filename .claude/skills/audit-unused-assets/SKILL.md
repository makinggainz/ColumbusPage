---
name: audit-unused-assets
description: Find and quarantine images, videos, and audio in /public that no active production code loads. Cross-checks against compiled .next/ output, not just source-grep. Self-improving — every missed file extends this doc with a new rule.
---

# audit-unused-assets

Find and quarantine media files in `/public` that are not actually loaded by any production code path. Designed to be **paranoid** about false positives — stale code, dead comments, retired branches, and refactored-out features all leave behind orphan files that source-grep alone misses.

## Trigger

User says any of: "audit assets", "find unused images", "clean up /public", "audit unused media", "/audit-unused-assets", "quarantine orphans".

## SELF-IMPROVING RULE (read first)

**Every time a file is missed by this audit — i.e. it gets quarantined later, or the user points it out — you MUST update this `SKILL.md` before moving on.** Add:

1. A new entry to the "Known false-positive patterns" section below describing what slipped through and why.
2. Either an automated fix in [scripts/find-unused-assets.mjs](../../../scripts/find-unused-assets.mjs) (preferred), or a manual-check step in the workflow.
3. A line in the "Audit history" section at the bottom with the date, what was missed, and what was fixed.

The audit gets sharper with each pass. **Do not skip this step.** A miss without a doc update means the same class of file will get missed next time.

## How it works

The implementation lives in [scripts/find-unused-assets.mjs](../../../scripts/find-unused-assets.mjs). It classifies every asset in `/public` (excluding `_unused/`) into five buckets:

| Bucket | Signal | Action |
|---|---|---|
| `inBuild` | Basename appears literally in compiled `.next/` output (HTML or JS bundle) | Used |
| `sourceOnly` | Basename appears literally in source files but not in build | Used (build hasn't picked it up but reference exists) |
| `stemInBuild` | Stem appears word-bounded in build output | Ambiguous — kept in place |
| `stemInSource` | Stem appears word-bounded in source only | Ambiguous — kept in place |
| `unused` | No match anywhere | **Quarantine** |

### Why cross-check against compiled `.next/` output

Source-grep alone fooled by:
- Code that exists but isn't reachable from any route (Next won't bundle it).
- References behind feature flags that compile out.
- Files that import but never render the asset.
- Files that the bundler tree-shakes.

If a basename is in `.next/server/app/**/*.html` or `.next/static/chunks/**/*.js`, the asset is genuinely shipped. Otherwise, source code might reference it but the user will never see it.

### Why word-bounded stem matching

A bare-substring stem match treated `henti.png` as used because `henti` is a substring of `Authentic` in unrelated UI copy. The fix: require delimiters (`/`, `"`, `'`, ` ``, `.`, `-`, etc.) on both sides of the stem before counting it as a real reference.

### Why block-comment stripping

CSS-in-JS template literals are shipped verbatim by Next. A comment inside that template literal (e.g. `/* Replaces /Colbackgroundcard.png */`) survives bundling and ends up in the compiled JS as a string literal. Without preprocessing, the asset name from the comment looks like a real reference.

Fix: `/\*[\s\S]*?\*/` is stripped from both source and build haystacks before any matching runs.

## Workflow

### Phase 1 — Plan (always)

1. Ask whether to include `_unused/` files in the recheck this pass (default: no — those were already vetted).
2. Confirm scope: images only, or +video, +audio? Default is all three.
3. Confirm destination folder: `public/_unused/` mirroring relative paths.
4. Note any allowlist (files known to be dynamically loaded that the audit might mis-flag).

### Phase 2 — Safety net

1. `git tag pre-image-quarantine-<date>` at HEAD.
2. Update `/Users/alexramirezblonski/Documents/ColumbusPage-image-backup/REVERT.md` with the new tag + restore command (or skip if running on a different machine).

### Phase 3 — Build + audit (dry run)

```sh
npm run build                              # produces fresh .next/
node scripts/find-unused-assets.mjs        # dry run, prints summary + top 25
```

The dry-run output lists the unused candidates with sizes. Skim it for anything that *looks* load-bearing (`favicon*`, `manifest*`, `robots*`, anything in a folder you know is alive). If suspicious, manually grep the basename to verify before applying.

### Phase 4 — Apply

```sh
node scripts/find-unused-assets.mjs --apply
```

This `git mv`s tracked files (preserves history) and plain-`mv`s untracked files into `public/_unused/<original-rel-path>`. Manifest at `public/_unused/MANIFEST.txt` is appended each pass.

### Phase 5 — Verify

1. `npm run build` — must succeed cleanly, zero missing-asset warnings.
2. Scan pre-rendered HTML for ghost references to quarantined basenames:
   ```sh
   node -e "/* see verification snippet below */"
   ```
3. Browser spot-check: load home, products/business, products/consumer, technology, company, blog, blog/[slug], research. Watch DevTools Network for 404s.
4. If any 404 surfaces: `git mv public/_unused/<rel> public/<rel>`, **then go to "SELF-IMPROVING RULE" above and document the miss.**

### Phase 6 — Commit

Commit message format:
```
Quarantine N unreferenced /public assets into public/_unused/

Pass N+1 of the audit. Adds <count> files (<MB> MB) beyond prior passes.
Biggest wins: <three heaviest>.

<short note on whether this pass surfaced a new false-positive class
and how SKILL.md was updated to catch it next time.>
```

## Known false-positive patterns

Append to this list any time a miss is identified.

### 2026-05-30 — Substring stem-match inside unrelated word

- **Example:** `henti.png` matched `henti` inside "Authentic" in UI copy.
- **Symptom:** orphan file kept in place after first audit pass.
- **Fix:** Word-boundary check on stem matches. Stem must be delimited by `/`, `"`, `'`, ` ``, `.`, `-`, `,`, whitespace, or punctuation on both sides. See `containsBounded()` in [scripts/find-unused-assets.mjs](../../../scripts/find-unused-assets.mjs).

### 2026-05-30 — Asset name in a CSS-in-JS comment

- **Example:** `Colbackgroundcard.png` referenced only in a comment inside a CSS template literal in `BentoProducts.tsx` that survived bundling.
- **Symptom:** basename appeared in compiled `.next/` JS chunks, so the asset was classified as `inBuild` and never quarantined.
- **Fix:** Strip `/* */` block comments from both source and build haystacks before any matching. See `stripBlockComments()` in [scripts/find-unused-assets.mjs](../../../scripts/find-unused-assets.mjs).
- **Cleanup obligation:** when you quarantine a file because of a stale comment, also delete the comment from source so the next audit doesn't have to relearn it.

### 2026-05-30 — Script self-reference via filename in code comment

- **Example:** The audit script's own comment mentioned `henti.png` as a demo, causing the script to think the file was referenced.
- **Symptom:** specific filenames in script comments evaded quarantine.
- **Fix:** [scripts/find-unused-assets.mjs](../../../scripts/find-unused-assets.mjs) excludes itself + `find-unused-images.mjs` from the source scan via `SELF_SCRIPTS`. When adding new audit-related scripts, add them to that set.

## Patterns NOT yet handled (watch list)

- **Asset filename in a `//` line comment.** Stripping `//` comments would create false positives from URLs (`https://`), so it's not done. If a miss is found that traces to a `//` comment, write a context-aware stripper that only kills `//` when not preceded by `:`.
- **Asset name as a label or string visible in UI.** If the *visible UI* literally says "Old file was foo.png", `foo.png` will be flagged as used even if the file isn't loaded as a resource. Rare; review manually if encountered.
- **Server-only file reads via `fs.readFileSync('/public/...')` or `fs.readdirSync`.** Currently checked manually (Phase 1). If routinized, add it to the script.
- **Externally referenced assets** (e.g. URLs sent via email, hardcoded in a CMS). Out of scope — there's no static signal for these.

## Allowlist (assets that must NEVER be quarantined)

Add to `scripts/find-unused-assets.mjs` `ALLOWLIST` if you discover one (not currently implemented — add the set when first needed).

Conventional Next/web files that should be left alone even if unused-looking:
- `favicon.*`, `apple-touch-icon*`, `manifest.json`, `site.webmanifest`, `robots.txt`, `sitemap.xml`
- Anything inside `app/**/icon.*`, `app/**/opengraph-image.*`, `app/**/twitter-image.*` — these are Next.js convention files, not in `/public`, so should be naturally out of scope; double-check before quarantining anything in `app/`.

## Verification snippet (Phase 5, step 2)

```js
// node -e '<this>'
import fs from 'fs';
import path from 'path';
const Q = 'public/_unused';
const NEXT = '.next/server/app';
function walk(d, o=[]) {
  for (const e of fs.readdirSync(d, {withFileTypes:true})) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, o); else o.push(p);
  }
  return o;
}
const html = walk(NEXT).filter(p => /\.html$/.test(p));
const quarantined = new Set();
function collect(d) {
  for (const e of fs.readdirSync(d, {withFileTypes:true})) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) collect(p);
    else if (/\.(png|jpe?g|webp|avif|svg|gif|mp4|webm|mov|mp3)$/i.test(e.name)) quarantined.add(e.name);
  }
}
collect(Q);
let hits = 0;
for (const f of html) {
  const text = fs.readFileSync(f, 'utf8');
  for (const b of quarantined) if (text.includes(b)) { console.log(b, '→', f); hits++; }
}
console.log(hits === 0 ? '✓ clean' : `⚠ ${hits} ghost references`);
```

## Audit history

| Date | Pass | Files quarantined | MB | Notes / new rules added |
|---|---|---|---|---|
| 2026-05-30 | 1 (source-grep only) | 205 | 150 | Initial pass with stem-and-dir-segment heuristic. |
| 2026-05-30 | 2 (deep, .next/ cross-check) | 159 | 304 | Added word-boundary stem matching; added build-output haystack. Found `henti.png`, 42-MB `mesh-animation.mp4`, all `use-cases/* 2.png` duplicates. |
| 2026-05-30 | 3 (fix CSS-in-JS comment leak) | 11 | 4.9 | `Colbackgroundcard.png` plus 10 more (`save-globe.png`, `minimalistCity.png`, `techDiagram2.png`, `elioName.png`, etc.) all surfaced after adding `stripBlockComments()` to both source + build preprocessing. This `SKILL.md` initialized. Dead-comment cleanup in `BentoProducts.tsx`, `DestinationsSection.tsx`, `company.module.css`, `MissionScrollIntro.tsx`, `technology.module.css`, `Hero.tsx`, `BusinessUseCases.tsx` so the same patterns can't re-poison the next pass. Final state: 0 unused, 0 raw ghost refs in HTML, 0 stripped ghost refs. |

— end —