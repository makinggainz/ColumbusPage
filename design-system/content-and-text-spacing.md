# Content & Text Spacing

> Imported from MistX (`~/Documents/MistX/design-system/design-system.md`, §2.5, §2.7, §4, §4.1).
> Scope is intentionally narrow: **content spacing** (page rhythm, section gaps, padding) and **text spacing** (tracking, leading, line-height). Everything else from MistX (type scale, weights, colors, radii, fonts) is **not** imported — those continue to be governed by `fonts-typescale.md` and the per-page docs.
>
> When MistX rules conflict with values in `fonts-typescale.md`, this document wins for spacing; `fonts-typescale.md` continues to win for type sizes, weights, and colors.

---

## 0. Prime directive — adherence by default

**Always follow the design-system rules in this document (and the other docs in `design-system/`) unless the user explicitly asks you to deviate for a specific case.**

- The rules below — spacing scale, section rhythm, tracking, leading, line-height — are the default for every new UI change and every existing-UI edit.
- "Looks fine to me" or "let's just hardcode it" are not reasons to break the system. If a value doesn't appear in the scale (e.g. `5px`, `6px`, `7px`, `11px`, `13px`, `18px`), do not introduce it.
- When the user asks for a change that conflicts with a rule here, **ask before deviating**: "this rule says X — do you want me to follow it, or break the rule for this one case?" Don't silently override the system.
- One-off overrides must be explicit and scoped. If the user says "I want this specific element to use 7px here," apply it only to that element and call out the deviation in the commit message or PR description.
- If the rule itself is wrong, **update this document in the same change** so the system stays the source of truth — don't let drift accumulate.
- Page-scoped docs (`enterprise-page.md`, `products-page.md`, etc.) may narrow these rules but never silently contradict them; flag conflicts when you spot them.

This rule applies to every assistant working in this repo. It overrides defaults like "match the surrounding code" — surrounding code may itself be a pre-system artifact that needs migration, not duplication.

---

## 1. Text spacing

### 1.1 Tracking + leading tokens

Four tracking tokens and three leading tokens — these are the only letter-spacing / line-height values to reach for.

| Token | Value | Usage |
|---|---|---|
| `--tracking-tight` | `-0.025em` | Display headings |
| `--tracking-wide` | `0.025em` | Eyebrows, small caps |
| `--tracking-wider` | `0.05em` | Emphasis labels |
| `--tracking-widest` | `0.1em` | Uppercase micro-text |
| `--leading-tight` | `1.25` | Headlines |
| `--leading-normal` | `1.5` | Default body |
| `--leading-relaxed` | `1.625` | Long-form prose |

Use the Tailwind utility classes directly: `tracking-tight`, `tracking-wide`, `tracking-wider`, `tracking-widest`, `leading-tight`, `leading-normal`, `leading-relaxed`.

### 1.2 Display heading rule

For the hero / display heading (largest size on the page):

- **Letter-spacing:** `tracking-tight` (`-0.025em`). At ~72px this is the MistX-validated `-1.8px`.
- **Line-height:** `1.0` (tight). Multi-line display headings should read as dense compact blocks. Drop in `leading-none` or an explicit `leading-[1]`.
- At smaller heading sizes (~48px), line-height opens slightly to ~0.95× the font size — still tight (think `leading-[0.95]` or `leading-tight`).

### 1.3 Per-size line-height defaults (body + UI text)

Computed from Tailwind's defaults that MistX adopts (§2.3). Use these unless a specific component spec overrides:

| Class | Size | Line-height |
|---|---|---|
| `text-xs` | 12px | `1.333` |
| `text-sm` | 14px | `1.429` |
| `text-base` | 16px | `1.5` |
| `text-lg` | 18px | `1.556` |
| `text-xl` | 20px | `1.4` |
| `text-2xl` | 24px | `1.333` |
| `text-3xl` | 30px | `1.2` |
| `text-4xl` | 36px | `1.111` |
| `text-5xl` / `text-6xl` / `text-7xl` | 48 / 60 / 72 | `1.0` |

Rule of thumb: as type scales up, leading tightens; as type scales down, leading loosens.

---

## 2. Content spacing

### 2.1 Base scale (4px grid, 16 tokens)

MistX uses two parallel scales that resolve to the same values: `--spacing-*` (padding-style) and `--gap-*` (flex/grid-gap-style). Always 4px multiples.

| Tokens | px | Semantic use |
|---|---|---|
| `--spacing-sm` | 12 | Tight padding, icon gaps |
| `--spacing-md` / `--gap-md` | 16 | Standard padding |
| `--spacing-xl` / `--gap-xl` | 24 | Component padding, between cards in a grid |
| `--spacing-2xl` / `--gap-2xl` | 32 | Section content gaps |
| `--spacing-2xl-2` / `--gap-2xl-2` | 40 | Larger between-block gaps |
| `--spacing-3xl` / `--gap-3xl` | 48 | Vertical rhythm between blocks |
| `--spacing-4xl` / `--gap-4xl` | 64 | Major section vertical gap |
| `--spacing-5xl` | 96 | (no `--gap-*` twin) |
| `--spacing-6xl` / `--gap-6xl` | 128 | Hero / above-the-fold spacing |

**Touch targets:** buttons 40–44px tall minimum; inputs 44px; pill tabs 32px desktop / 44px mobile.

**Responsive overrides** (set inline on a layout wrapper when a section needs to override the default vertical rhythm):

```tsx
style={{ '--space-mobile': '32px', '--space-desktop': '96px' }}
```

Defaults: `--space-mobile: 64px`, `--space-desktop: 64px`.

### 2.2 Section rhythm

The page reads as a series of contained moments — each section gets a generous breathing gap before the next begins. **Do not collapse section margins to save vertical space.**

| Gap location | px range | How to write it |
|---|---|---|
| Between major sections | 200px desktop / 80px mobile | `py-10 md:py-[100px]` — use padding (not margin) so adjacent section gaps add rather than collapse. 100px top + 100px bottom = 200px total gap between content areas. |
| Between a section heading and the content grid below it | 80px desktop / 40px mobile | `mb-10 md:mb-20` — consistent across all sections |
| Between an `<h2>` and its subtitle paragraph in the same heading block | 24px mobile / 48px desktop | `mt-6 md:mt-12` — matches `--gap-xl` / `--gap-3xl` |
| Between individual cards in a grid | ~24px | `gap-6` (24px = `--gap-xl`) |

### 2.3 Horizontal discipline

Cap content width at ~1280px (`max-w-7xl`) on wide screens. Visible side margins on large viewports are intentional — newspaper-column discipline keeps lines short enough to read comfortably.

---

## 3. Quick rules

- Spacing values must come from the scale above. Never introduce `5px`, `7px`, `11px` etc. for layout spacing — only 4px multiples.
- Section vertical gaps are **padding, not margin**, so they don't collapse.
- Tight leading (`leading-none` / `1.0`) is for display headings only. Body and long-form text stay at `leading-normal` (`1.5`) or `leading-relaxed` (`1.625`).
- Tracking-tight is for display headings; tracking-wide/wider/widest are reserved for eyebrows, emphasis labels, and uppercase micro-text.
