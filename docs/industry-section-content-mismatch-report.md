# Industry-Section Content Mismatch — Investigation & Remediation Report

_Business page (`/products/business`) → "Tell us where you work" industry block → the
super-feature stack (`BusinessUseCases`). Report covers the investigation into map ↔ prompt ↔ UI
mismatches, the root causes, what was fixed, and what remains._

Last updated: 2026-06-05. **§11 adds a complete cross-industry audit** (all six industries, every
per-industry map surface) and supersedes the "to verify" items in §7.

---

## 1. TL;DR

- The industry sections drifted out of alignment because, over a series of 2026-05-22 commits, the
  **chat prompts/copy were re-localized to new cities while the map image assets were not** (and
  vice-versa). Each industry now spans **multiple geographies** in places.
- A second, separate problem masked the first: the residential first-chat map looked like
  **Villanueva** on screen even though the source file is **Amsterdam** — this was a **stale
  Next.js dev image-optimizer cache** (`.next/dev/cache/images`), not a code/asset bug.
- The visible breadcrumb / city label / POI pins in the chat mockup are **baked into a shared PNG**
  and the per-industry `breadcrumb`/`cityLabel`/`pois` props are **ignored** — so those are *not*
  a real mismatch axis. The only per-industry visible content is the **map image** and the **chat
  text** (query / response / ranked list) plus the sub-feature **cards**.
- Fixed so far: the per-industry forecast title, and the **"Ask, Discover, Understand" (`#chat`)
  section** restored to its last-known-matched (`2f91ab8`) state.
- Remaining: the **data-catalogue** maps (Villanueva) vs their Chevy-Chase prompts, a global
  **Madrid-vs-Chevy-Chase decision** for residential, and a verification pass on the other
  industries. Any geography change needs **new map tiles** (image assets can't be code-generated).

---

## 2. Symptom (as reported)

> On Residential → "Ask, Discover, Understand", the first chat prompt is
> *"Show me which neighborhoods in Amsterdam have seen the largest rent increases over the past 5
> years"* but the map shows **Villanueva** (a different place). There are other map/UI/prompt
> mismatches too. "Originally they all used to match and be correct."

---

## 3. How the chat mockup actually works (architecture facts)

Findings from reading `components/business/MapChatPlatform.tsx` and `BusinessUseCases.tsx`:

- The chat demo is `MapChatPlatform`. It composites three layers: a **map tile** (`map` prop) on
  the right, a **baked chrome PNG** (`public/business/ConversationalMapChat.png`) on top, and live
  React UI (chat bubble, response, ranked list, input) over that.
- **`breadcrumb`, `cityLabel`, `pois`, `filterLabel`, `dataCard*` props are accepted but IGNORED** —
  the chrome PNG owns that text. (This is stated verbatim in the component.) So "Manhattan vs
  London breadcrumb"-type observations are **not** real mismatches; the breadcrumb text is generic
  and baked.
- The **only per-industry visible content**:
  - **Map tile** = `bg.chatMainMap` (per-industry backdrop asset).
  - **Chat text** = `userQuery`, `responseIntro`, `listTitle`, `listItems`, `keyTakeaway`.
- Per-industry copy lives in `RESIDENTIAL_COPY`, `COMMERCIAL_COPY`, … (`IndustryCopy` objects),
  selected by `copyFor(industryId)`. Map assets come from `backdropsFor(industryId)`.
- Sub-feature cards (`PatternsDetectedCard`, `ForecastCard`, `ColumbusReasoningCard`,
  `HarmonizedFilesCard`) each have their own map (`chatSubMaps[]`) + their own copy
  (`copy.cards.*`). The **forecast** card's ranked list is meant to correspond 1:1 to the numbered
  districts drawn on its map.

---

## 4. Investigation methodology

- **git pickaxe** (`git log -S`) to find when specific strings were introduced/changed.
- **blob hashing** (`git rev-parse <commit>:<path>`, `git hash-object`) to detect when an image
  asset's *content* changed, independent of filename.
- **Direct asset viewing** — extracting blobs (`git cat-file -p`) and viewing the PNGs to identify
  the depicted city (Amsterdam canals/IJ vs Villanueva radial grid vs Madrid labelled districts vs
  London Thames).
- **Live DOM + canvas pixel sampling** in the running app to read the *actually rendered* `<img>`
  source and classify it (blue-dot Villanueva vs red/orange Amsterdam choropleth).
- **Image-cache forensics** — comparing `curl` responses (PNG vs the browser's AVIF Accept header),
  reading `X-Nextjs-Cache` headers, and locating the dev cache at `.next/dev/cache/images`.

---

## 5. Root causes

### 5a. Stale dev image cache (the "Villanueva" the user saw)

- `public/ResidentialMaps/chat-platform-map.png` **on disk is the Amsterdam choropleth**
  (blob `0f13e864`), and has been since **2026-06-03** (commit `8674d41`).
- But the running dev server served a **stale AVIF** for that URL (`X-Nextjs-Cache: HIT`) that was
  generated back when the source was Villanueva (blob `f49c037f`). Next's dev image optimizer
  (`.next/dev/cache/images`) did not invalidate when the source file changed.
- Proof: a PNG `curl` returned Amsterdam, but the browser's AVIF request returned Villanueva for the
  *same URL*. After `rm -rf .next/dev/cache/images` + dev restart → `X-Nextjs-Cache: MISS` →
  regenerated → **Amsterdam** (verified by canvas pixel sampling: 26% red/orange vs 8% blue).
- **Implication:** this is environmental. Anyone whose dev server cached the pre-Jun-3 image keeps
  seeing Villanueva until they clear `.next/dev/cache/images` and restart. No code edit fixes it.

### 5b. Copy re-localized without updating maps (and vice-versa)

The genuine, code-level mismatches trace to a cluster of 2026-05-22 commits:

| Commit | Date (local) | What it did | Effect |
|---|---|---|---|
| `ba554ff` | ≤ 05-22 | baseline | each industry had one consistent city in its mockup; chat had no query thread yet |
| `2f91ab8` | 05-22 02:56 | "…refresh maps and business sections" | **added chat query threads** using new cities (residential → Amsterdam, CRE → London, academic → Chicago/Atlanta/Detroit…) that didn't always match the existing breadcrumb/maps |
| `f4f8d3c` | 05-22 13:11 | "Restore residential chat-platform-map to **Villanueva**" | residential chat map → Villanueva (now ≠ the Amsterdam query) |
| `f2b0dea` | 05-22 13:38 | "swap residential to **Chevy Chase**" | rewrote residential **prompts/copy** Madrid → Chevy Chase but **left every map asset Spanish** → all sub-features mismatched |
| `8674d41` | 06-03 | "refresh residential chat-platform map asset" | residential chat map → **Amsterdam** again (matches the Amsterdam query) |

Net: the residential industry ended up spanning **three** geographies — Amsterdam (chat hero),
Chevy Chase (cards/prompts), and Madrid/Villanueva (sub-feature map assets).

### 5c. (Related) Hardcoded forecast sub-feature title

- The sub-feature heading was a hardcoded literal `"Like weather forecasts for real-estate"` from
  the moment the forecast sub-feature was created (`0f7d47e`, 2026-05-20). It rendered "real-estate"
  for *every* industry. (Fixed — see §6.)

---

## 6. What was fixed this session

### 6a. Per-industry forecast title
- Added `sub2Title` to `IndustryCopy` and to all six industry copy blocks; the render now uses
  `copy.sub2Title`.
- Result: Academic shows "Like weather forecasts for **spatial research outcomes**", CRE "…for
  **CRE**", residential "…for **real estate**", etc. (Verified.)
- File: `components/business/BusinessUseCases.tsx`.

### 6b. `#chat` ("Ask, Discover, Understand") section restored to its matched (`2f91ab8`) state
The last commit where this section's prompts matched their maps was `2f91ab8` (Amsterdam hero +
Amsterdam hero-map; Madrid cards + Madrid card-maps). Restored that state:

- **Restored asset:** `public/ResidentialMaps/like-weather-forecasts.png` → its `2f91ab8` version
  (blob `e53c178b`) — the Madrid map whose numbered districts 1–4 are Chamberí / Salamanca /
  Alcobendas / Pozuelo.
- **Forecast card** → Madrid: `questionRecap`, the four ranked districts (Chamberí / Salamanca /
  Alcobendas / Pozuelo), and the takeaway. (Card list now lines up 1:1 with the map's numbered
  districts.)
- **Reasoning card** prompt → "…12,000 m² parcel in **Alcobendas**…".
- **Patterns card** area label → "Across the **Madrid metro area**". (Kept the newer **solar**
  patterns content + red/blue rooftop map — those already match each other; only the geo label was
  wrong.)
- **Hero left untouched** — already Amsterdam query + Amsterdam map (correct after the cache clear).
- Cleared `.next/dev/cache/images` + restarted the dev server.

**Verification (live):** the chat section has no Chevy-Chase remnants, shows the Madrid districts,
keeps the Amsterdam hero, and every map matches its prompt; console clean (0 errors). The section
now reads as **Amsterdam hero + Madrid cards** — which is exactly the matched `2f91ab8` state.

---

## 7. Current per-industry status (map ↔ prompt)

Reminder: breadcrumb/cityLabel/POIs are baked & ignored, so the axis that matters is **map image vs
chat query / card text**.

### Residential — `#chat`: ✅ fixed (matched)
| Sub-feature | Map asset | Depicts | Text | Match |
|---|---|---|---|---|
| Hero | `chat-platform-map.png` | Amsterdam | query: Amsterdam | ✅ |
| See what others can't | `pattern-detection.png` | leafy suburb (neutral) | solar / "Madrid metro" | ✅ |
| Like weather forecasts | `like-weather-forecasts.png` | Madrid (numbered districts) | Madrid (Chamberí/Salamanca/Alcobendas/Pozuelo) | ✅ |
| AI critically thinks | (no map) | — | Alcobendas | n/a |
| Drop any file | `import-files.png` | generic US town | generic | ✅ |

### Residential — other sections: ❌ still mismatched (next up)
- **data-catalogue**: `smart-layers.png` and `survey-model.png` are **Villanueva** (blobs
  `d0e225a8`, `3f0c16e3`) but their prompts were rewritten to **Chevy Chase** (`f2b0dea`).

### Other industries (chat) — verified / to verify
- **CRE**: chat map `/CREMaps/chat-platform-map.png` = **London** (Thames, City Core, Canary Wharf,
  Stratford), query = London. ✅ Verified matching.
- **Urban Infrastructure**: query = greater Munich; breadcrumb Munich. Map content **to verify**.
- **Environmental**: query = Sierra Nevada; breadcrumb Sierra Nevada. Map content **to verify**.
- **Academic**: query = Chicago/Atlanta/Detroit; breadcrumb (baked) = Tokyo. Chat map
  `/AcademicMaps/chat-platform-map.png` content **to verify** — likely a mismatch.
- **Geomarketing**: query = generic "European cities"; breadcrumb (baked) = Lisbon. **To verify**.

---

## 8. Outstanding work

1. **Decision needed — residential target geography.** The `#chat` section is now Amsterdam (hero) +
   Madrid (cards). The other residential sections are Chevy Chase (copy) + Villanueva (maps). Pick
   one city for the whole industry:
   - **Madrid** (consistent with the just-restored chat cards + existing Spanish map tiles) →
     mostly copy reverts, minimal new assets.
   - **Chevy Chase / DC** (consistent with the f2b0dea intent) → needs **new DC map tiles** for
     chat-platform, like-weather-forecasts, smart-layers, survey-model, and a copy change to the
     Amsterdam hero.
2. **data-catalogue maps** (`smart-layers.png`, `survey-model.png`) vs their prompts — fix per the
   chosen geography.
3. **Audit + fix the other industries' chat maps** (Academic especially; Urban/Env/Geo verify).
4. **Map-tile regeneration** is required for any geography that lacks existing tiles — these are
   image assets and **cannot be code-generated**; they must be supplied/rendered externally.

---

## 9. Key references

- Component: `components/business/MapChatPlatform.tsx` (note the "ignored props" block).
- Copy + backdrops + sub-feature wiring: `components/business/BusinessUseCases.tsx`.
- Map assets: `public/ResidentialMaps/`, `public/CREMaps/`, `public/AcademicMaps/`,
  `public/EnvironmentalMaps/`, etc.
- Asset identities (residential): `chat-platform-map.png` → `0f13e864` Amsterdam / `f49c037f`
  Villanueva; `like-weather-forecasts.png` → `e53c178b` Madrid(numbered) / `be433aa8` Madrid(alt);
  `smart-layers.png` `d0e225a8` Villanueva; `survey-model.png` `3f0c16e3` Villanueva;
  `import-files.png` `0c05ed82` generic-US; `pattern-detection.png` leafy-suburb.
- Dev cache gotcha: `rm -rf .next/dev/cache/images` + restart `npm run dev` after swapping any image
  asset, or the optimizer may serve the stale version.

---

## 10. Status of changes

All edits from this session are **local / uncommitted**: `BusinessUseCases.tsx` (sub2Title +
`#chat` Madrid copy) and the restored `like-weather-forecasts.png`. The dev image cache was cleared
and the dev server restarted.

---

## 11. Full cross-industry audit (2026-06-05)

A complete map ↔ copy audit across **all six industries** and **every per-industry map surface**:
the chat hero (`MapChatPlatform`, `chatMainMap`), the three chat sub-feature maps
(`chatSubMaps[0,1,3]` → Patterns / Forecast / Harmonized cards), and the two data-catalogue row
maps (`smartLayerMap`, `surveyEarthMap`). Method: viewed each committed PNG blob directly and
compared to the rendered copy; traced every mismatch with `git log --follow` + per-commit blob
hashing + pickaxe on the prompt strings.

**Scope note — surfaces NOT on the per-industry match axis:** the `DataManagerMockup`,
`AgenticResearchMockup`, `DashboardMockup` chrome-frame mockups, and `BetterPricesRow`
(`/business/map2.png`, `/business/map3.png`) render generic visuals shared across every industry,
so they can't "match" per-industry copy and were excluded. `SurveyEarthRow` also has a hardcoded
secondary `/business/SuperModelback.png` backdrop (generic); only its `mapSrc` is per-industry.

**Render fact (relevant to CRE/Academic):** `MapChatPlatform` draws the map tile at `MAP_LEFT 47%`
→ right edge, `object-cover object-center` (see `MapChatPlatform.tsx`). The map's **center is
shown directly beside the live chat list**, so any district names/percentages baked into the map
PNG are visible and *will* visibly contradict a non-matching list.

### 11a. Per-industry result

✅ = map matches copy. ❌ = mismatch.

| Industry | chat hero (`chatMainMap`) | Patterns (`sub0`) | Forecast (`sub1`) | Harmonized (`sub3`) | smart-layer | survey-earth |
|---|---|---|---|---|---|---|
| **Residential** | ✅ Amsterdam (fixed §6) | ✅ red/blue solar roofs | ✅ Madrid districts (fixed §6) | ✅ generic US town | ❌ Spanish terrain vs Chevy Chase | ❌ Spanish terrain vs Chevy Chase |
| **CRE** | ❌ map City Core/Kings Cross/Southbank/Stratford vs list Mayfair/Kings Cross/Paddington/City Core | ✅ Manhattan | ✅ London | ✅ London | — (default) | — (default) |
| **Urban** | 🟡 Munich congestion (outer towns) vs list inner Stadtbezirke | ✅ Paris 7th (exact) | 🟡 same as hero | ✅ Chicago transit 3D | ✅ Havana coastal | ✅ night-safety streets |
| **Environmental** | ❌ Andalucía/Spain rivers vs Sierra Nevada wildfire | ✅ N. Atlantic whales | ✅ Sierra Nevada wildfire | ✅ Brighton offshore wind | ✅ Central Portugal | ✅ Maasai Mara |
| **Academic** | ❌ Chicago-only (Pilsen/Logan Sq/West Loop/South Shore) vs list Chicago+**Atlanta**+**Detroit** | ✅ Tokyo 23 wards | 🟡 London boroughs (minor rank drift) | ✅ Nairobi+Kampala (two cities) | ✅ N. Ontario grocery | ✅ Spain cities jobs |
| **Geomarketing** | ❌ Los Angeles OOH billboards vs European cities forecast | ✅ Canada 580 branches | ❌ UK (London + SE England) vs Milan/Madrid/Berlin/Lisbon | ✅ Greater Toronto dealers | ✅ France EV OOH | ✅ Germany PLZ |

### 11b. Git verdict per mismatch — *why most can't be "reverted"*

| Mismatch | Map blob history | Verdict |
|---|---|---|
| **Environmental hero** | `EnvironmentalMaps/map-chat.png` — single blob, added `2f91ab8`, never changed | **Baked-in.** Sierra Nevada query predates the map (`4211eab`); the Andalucía map was wired to the Sierra query at `2f91ab8`. No matched version. *(A correct Sierra wildfire map already exists as `predict-future.png`.)* |
| **Geomarketing hero** | `GeomarketingMaps/conversational.png` — single blob, added `9a78ab9`, never changed | **Baked-in.** LA OOH map + European-cities query committed together; never matched. |
| **Geomarketing forecast** | `GeomarketingMaps/predict-future.png` — single blob, added `9a78ab9`, never changed | **Baked-in.** UK trade-area map + continental-Europe list; never matched. |
| **Academic hero** | `AcademicMaps/chat-platform-map.png` — single blob, added `2f91ab8`, never changed | **Baked-in.** Chicago map + 3-city list committed together at `2f91ab8`. Map ranks 1/3 (Pilsen +18.2%, Logan Sq +14.3%) *do* match list 1/3; list 2/4 (Old Fourth Ward / Corktown) were authored as Atlanta/Detroit. |
| **CRE hero** | `CREMaps/chat-platform-map.png` — 2 blobs (`902fe5d`→`7538c83`) but the change was **colour-only**; districts identical | **Baked-in.** Map was always City Core/Kings Cross/Southbank/Stratford; the `Mayfair/Paddington` list never matched it. No matched version. |
| **Residential smart-layers / survey-model** | `smart-layers.png` / `survey-model.png` — 2 blobs each (`af95a15`→`07c2dce`) but both blobs are the **same Spanish terrain**, only re-rendered | **Broke later (the one true revert case).** Maps always Spanish; the copy was switched Madrid→Chevy Chase at `f2b0dea`. Reverting the copy to Madrid/Spanish restores the match. |

**`2f91ab8` ("…refresh maps and business sections", 2026-05-22) is the common culprit** — it added
the chat query threads and several `chatMainMap` wirings, pairing prompts with maps that didn't
align (Environmental, Geomarketing, Academic). The premise "originally they all matched" does not
hold for these chat heroes — they were mismatched the moment the chat threads were introduced.

### 11c. Remediation options (for whoever picks this up)

For each ❌ there are two ways to make map and chat UI agree; **no prior commit can be reverted to**
(except Residential data-catalogue):

- **Path A — align copy to the existing maps (code-only, no new art):**
  - CRE hero list → `City Core +11.8% · Kings Cross +10.3% · Southbank +9.7% · Stratford +8.7%`
    (the map's own numbered districts/percentages).
  - Academic hero → Chicago-only (`Pilsen +18.2% · Logan Square Edge +14.3% · West Loop +13.1% ·
    South Shore +11.8%`); keep the 3-city framing only on the *Reasoning* card (no map).
  - Environmental hero → southern-Spain shrinking-rivers prompt (matches the Andalucía map **and**
    the existing dashboard row "Southern Spain shrinking rivers"); leave Sierra wildfire on the
    Forecast card.
  - Geomarketing hero → LA OOH-network prompt; Geomarketing forecast → UK (London + South East)
    trade-area list (Central London / Reading / Guildford / Brighton …).
- **Path B — keep the copy, supply new map tiles** (cannot be code-generated): Environmental hero =
  Sierra Nevada wildfire; Geomarketing hero = European target-customer choropleth; Geomarketing
  forecast = Milan/Madrid/Berlin/Lisbon submarkets; CRE hero = Mayfair/Kings Cross/Paddington/City
  Core; Academic hero = a Chicago+Atlanta+Detroit composite.

### 11d. Decision recorded (2026-06-05)

User reviewed this audit and chose **audit-only for now** for all six chat-hero / forecast
mismatches (no copy changes, no asset swaps), and **leave-as-is** for the Residential
data-catalogue (the two Spanish-terrain maps carry no visible city labels, so the mismatch is
terrain-vibe only — lowest priority). **No code or assets were changed in this audit pass.** The
🟡 Urban and Academic-forecast items are same-metro/same-theme sub-region drift and were judged
acceptable.
