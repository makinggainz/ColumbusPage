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

### 2026-05-30 — Tooling/skill files mention asset names by design

- **Example:** This protocol document references `beach.png` as an example of a false-positive pattern; [scripts/optimize-images.mjs](../../../scripts/optimize-images.mjs) lists `beach.png` in its hero-tier config. Both made `beach.png` look "used" to the source scan.
- **Symptom:** an asset that's truly unused survives because some maintenance/tooling file references it by name.
- **Fix:** `SKIP_DIRS` excludes `scripts/` and `.claude/` from the source scan entirely. Tooling files aren't production code — references inside them shouldn't count as real uses. When adding new tooling directories (e.g., `tools/`, `chore-scripts/`), add them to `SKIP_DIRS` too.

### 2026-05-30 — Markdown documentation references assets by name

- **Examples:** `design-system/navbar.md` documents `CEHQ.png` in a table; `design-system/use-cases-pages.md` lists default video paths `/research-applications-video.mp4` and `/use-cases-video.mp4`; `design-system/business-page.md` describes the `/businessartbackground.png` backdrop. None of these are runtime references — they're docs that describe the design system for humans.
- **Symptom:** truly orphaned assets stay in `/public` because a design-system doc names them.
- **Fix:** Removed `md` and `mdx` from `SRC_EXT`. Markdown files no longer count toward the source scan. If this project ever uses MDX as runtime content (e.g. blog posts at `content/posts/*.mdx` rendered by a route), add a narrow exception for that subtree — don't re-enable markdown globally.
- **Cleanup obligation:** when this fix surfaces an orphan whose only reference was in a design-system doc, update the doc to reflect reality (asset is gone or replaced by something else).

### 2026-05-30 — Path-stem collision with Next.js framework paths

- **Example:** `image.png` (a generic placeholder) was kept in place because its stem `image` matched `/image` inside `next/image` import statements (`from "next/image"`) and inside the Next.js Image optimizer URLs (`/_next/image?url=...`). Both are framework infrastructure, not references to a file literally named `image.png`.
- **Symptom:** assets whose stem matches a Next/web-framework path segment evade quarantine.
- **Fix:** Tightened `containsPathStem()` to require a `.` immediately after the stem — i.e. the stem must look like a filename, not a directory. `/image.` matches; `/image"` or `/image/` does not. This also covers the earlier word-bounded-stem improvements: standalone English words in prose (no `.` after `beach`) and word-internal substrings (no path prefix before `henti` in `Authentic`) are both rejected.
- **Side effect:** a truly dynamic ref of the form `<Image src={\`/${name}\`}>` (no extension on the literal) is no longer caught by the stem rule. But this pattern was always partial-signal at best, and the directory-segment match still catches it whenever the file lives in a subfolder.

### 2026-05-30 — Stem is a common English word used in UI copy

- **Example:** `beach.png` was kept in place because the word "beach" appears standalone in UI copy: `"secret beach"`, `"Tulum beach club"`, `"Thai beach resort"`. A word-bounded stem check correctly excludes substrings inside longer words (`Authentic` rejecting `henti`) but cannot tell a standalone English word apart from a file-stem reference.
- **Symptom:** files named after common English words remained in `/public` even though never referenced by path.
- **Fix:** Stem matching now requires the stem to appear in a **path position** — preceded by `/`, `"/`, `'/`, `` `/ ``, `(/`, or `=/`. This catches dynamic refs like `` `/${name}.png` `` (real path interpolation) and rejects "secret beach" (standalone word). See `containsPathStem()` and `STEM_PREFIX` in [scripts/find-unused-assets.mjs](../../../scripts/find-unused-assets.mjs).
- **Trade-off:** a hypothetical `import beach from "./foo"` style reference would no longer hit the stem rule — but the basename rule (full filename match) runs first and would catch that case anyway. Net: strictly tighter, no false negatives on real path refs.

### 2026-05-30 — Dead data field: assigned but never read

- **Example:** `HK Map-2.png` and `use-cases/havana.png` were kept because they were assigned to a `mapImageSrc` field in `components/use-cases/industry/content.ts` — but **no TSX component ever read `.mapImageSrc`**. The interface `RowChatContent` in `industry/types.ts` declared the field; data objects in `content.ts` set values; but the consuming components (BusinessUseCases, DataManagerMockup, etc.) never destructured or accessed it. The path strings sat inside the bundled JS data object, so basename match said "used".
- **Symptom:** the asset shows up in compiled JS bundles (via the data object) but never in any rendered HTML, never as a `src=`/`url(...)`. The audit script can't tell "value in JS data structure" apart from "actually rendered".
- **Detection (manual, for now):** when in doubt about a file that shows in build but not in pre-rendered HTML, grep for the field name (e.g. `mapImageSrc`) across `.tsx` files — if zero hits read it (only assignments / type definitions), the data is dead.
- **Fix in this case:** removed the `mapImageSrc` field from `industry/types.ts` and the 4 assignment sites in `industry/content.ts`. Now the audit naturally surfaces the orphan PNGs because no string literal references them anymore.
- **Future work:** routinize the detection by parsing `.ts`/`.tsx` files for interface/type fields that have no `.field` read sites. Skipped for now — TypeScript AST work is heavy and this pattern is rare in this codebase.

## Patterns NOT yet handled (watch list)

- **Asset filename in a `//` line comment.** Stripping `//` comments would create false positives from URLs (`https://`), so it's not done. If a miss is found that traces to a `//` comment, write a context-aware stripper that only kills `//` when not preceded by `:`.
- **Asset name as a label or string visible in UI.** If the *visible UI* literally says "Old file was foo.png", `foo.png` will be flagged as used even if the file isn't loaded as a resource. Rare; review manually if encountered.
- **Server-only file reads via `fs.readFileSync('/public/...')` or `fs.readdirSync`.** Currently checked manually (Phase 1). If routinized, add it to the script.
- **Externally referenced assets** (e.g. URLs sent via email, hardcoded in a CMS). Out of scope — there's no static signal for these.
- **Type-defined data fields assigned but never read** (see "Dead data field" above). Manual check: grep the field name across `.tsx` for any access pattern (`.fieldName`, destructuring with the field name). If zero, the field is dead and any path values it holds are orphans.

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
| 2026-05-30 | 4 (tighter path-stem + tooling exclusion) | 35 | 58.3 | `beach.png` and 34 others surfaced after two fixes: (a) stem-matching now requires a path prefix (`/`, `"/`, `'/`, etc.) so standalone English words like `beach` in UI copy stop matching, and (b) `scripts/` + `.claude/` are excluded from the source scan so audit/skill files don't self-reference assets. Wins included `use-cases/hero.png` (8.6 MB), `terra.png` (8.3 MB), `forest.png` (5 MB), `beach.png` (5 MB), `companyhero.png` (2.9 MB). Final state: 0 unused, 0 ghost refs. |
| 2026-05-30 | 5 (markdown exclusion + drop stem matching) | 19 | 58.4 | Three new false-positive classes surfaced. (a) `design-system/*.md` and `docs/*.md` reference assets by name as documentation, not real uses — fixed by dropping `md`/`mdx` from `SRC_EXT`. (b) `image.png`'s stem `image` collided with `next/image.js` and `/_next/image?url=...` framework paths — added strict `.<ext>` requirement, then realized stem-matching had now caused three classes of false positives (substring-in-word, English-word-in-prose, framework-path-collision) for marginal real-ref recall, so dropped it entirely. `containsPathStem()` now always returns false; basename + URL-encoded basename + build-output scan remain. Biggest wins: `research-applications-video.mp4` (30 MB), `use-cases-video.mp4` (16 MB), `Blogs/MapsGPT.png`, `Blogs/elio.png`, `CEHQ.png`, `businessartbackground.png`, `image.png`. Final state: 0 unused, 0 ghost refs, build clean. Skill file renamed from `SKILL.md` to `unused-assets-audit-protocol.md` per user. |
| 2026-05-30 | 6 (manual dead-data-field cleanup) | 2 + 1 deletion | ~12 | User asked specifically about `HK Map-2.png` and `footerbackground.jpeg`. Investigation found two distinct stories: (a) `footerbackground.jpeg` was a legitimate `<video poster>` reference in `Footer.tsx`, but user wanted it gone — file deleted + `poster` prop removed + dead surrounding comments cleaned. (b) `HK Map-2.png` (and `use-cases/havana.png`) were assigned to a `mapImageSrc` field in `industry/content.ts` but no TSX read that field. Dead data, not dead code. Removed the field from `types.ts` + 4 assignment sites; both PNGs then surfaced naturally in the next audit. NEW false-positive pattern added: "Type-defined data fields assigned but never read". |

— end —