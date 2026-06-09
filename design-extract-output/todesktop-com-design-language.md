# Design Language: ToDesktop

> Extracted from `https://www.todesktop.com/` on May 19, 2026
> 2002 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#e1ecff` | rgb(225, 236, 255) | hsl(218, 100%, 94%) | 1 |
| Secondary | `#148fff` | rgb(20, 143, 255) | hsl(209, 100%, 54%) | 1 |
| Accent | `#f79942` | rgb(247, 153, 66) | hsl(29, 92%, 61%) | 5 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#e5e7eb` | hsl(220, 13%, 91%) | 1924 |
| `#000000` | hsl(0, 0%, 0%) | 1240 |
| `#ffffff` | hsl(0, 0%, 100%) | 145 |
| `#707070` | hsl(0, 0%, 44%) | 47 |
| `#161616` | hsl(0, 0%, 9%) | 25 |
| `#384642` | hsl(163, 11%, 25%) | 15 |
| `#656565` | hsl(0, 0%, 40%) | 12 |
| `#474747` | hsl(0, 0%, 28%) | 12 |
| `#f1f1f1` | hsl(0, 0%, 95%) | 11 |
| `#999999` | hsl(0, 0%, 60%) | 11 |
| `#c2c2c2` | hsl(0, 0%, 76%) | 6 |
| `#2d2d2d` | hsl(0, 0%, 18%) | 5 |

### Background Colors

Used on large-area elements: `#05061c`, `#05061b`, `#373737`, `#ffffff`, `#e6fff7`, `#fff4f4`

### Text Colors

Text color palette: `#000000`, `#ffffff`, `#b3b3b3`, `#05898b`, `#148fff`, `#384642`, `#3d3d3d`, `#1f6af2`, `#fba61f`, `#0335fc`

### Gradients

```css
background-image: linear-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0.8));
```

```css
background-image: linear-gradient(0deg, rgb(255, 255, 255), rgb(230, 244, 247) 6.29%, rgb(128, 191, 239) 15.02%, rgb(68, 164, 233) 19.39%, rgb(48, 157, 231), rgb(16, 150, 229) 21.57%, color(xyz-d65 0.241 0.261 0.773), color(xyz-d65 0.23 0.248 0.764) 22.66%, color(xyz-d65 0.21 0.222 0.745) 23.75%, color(xyz-d65 0.188 0.157 0.764) 33.2%, color(xyz-d65 0.178 0.128 0.772), rgb(16, 70, 233) 42.64%, rgb(6, 29, 182) 53.09%, rgb(7, 11, 107) 66.19%, rgb(19, 2, 58) 75.33%, rgb(15, 7, 29) 86.09%, rgb(15, 7, 29));
```

```css
background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.75));
```

```css
background-image: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
```

```css
background-image: linear-gradient(rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0)), none;
```

```css
background-image: linear-gradient(rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0)), linear-gradient(0deg, rgba(5, 6, 27, 0.72), rgba(5, 6, 27, 0.72));
```

```css
background-image: linear-gradient(to right, color(display-p3 0.08 0.08 0.08) 40%, color(display-p3 0.6444 0.6444 0.6444) 50%, color(display-p3 0.08 0.08 0.08) 60%);
```

```css
background-image: linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06)), none;
```

```css
background-image: linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.12));
```

```css
background-image: linear-gradient(155deg, rgb(247, 247, 247) 26.97%, rgb(214, 214, 214) 69.83%);
```

```css
background-image: linear-gradient(rgb(247, 247, 247), rgb(166, 166, 166));
```

```css
background-image: linear-gradient(rgb(242, 242, 242), rgb(237, 237, 237));
```

```css
background-image: linear-gradient(rgb(239, 239, 239), rgb(217, 217, 217) 98.41%), none;
```

```css
background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.06), rgba(212, 212, 212, 0.06), rgba(212, 212, 212, 0.06), rgba(212, 212, 212, 0.06), rgba(212, 212, 212, 0.06), rgba(212, 212, 212, 0.06), rgba(0, 0, 0, 0.06)), none;
```

```css
background-image: linear-gradient(rgba(255, 255, 255, 0.88), rgba(245, 245, 245, 0.88));
```

```css
background-image: linear-gradient(353deg, rgb(255, 255, 255) -30.77%, rgb(230, 244, 247) -9.89%, rgb(128, 191, 239) 0.54%, rgb(68, 164, 233) 5.76%, rgb(48, 157, 231), rgb(16, 150, 229) 8.37%, color(xyz-d65 0.241 0.261 0.773), color(xyz-d65 0.23 0.248 0.764) 9.68%, color(xyz-d65 0.21 0.222 0.745) 10.98%, color(xyz-d65 0.188 0.157 0.764) 21.42%, color(xyz-d65 0.178 0.128 0.772), rgb(16, 70, 233) 31.86%, rgb(6, 29, 182) 52.73%, rgb(21, 14, 117), rgb(19, 2, 58) 73.61%, rgb(15, 7, 29) 94.48%);
```

```css
background-image: linear-gradient(114.58deg, rgb(209, 233, 255) -1.34%, rgba(255, 222, 253, 0.56) 24.05%, rgb(247, 247, 247) 74.82%);
```

```css
background-image: linear-gradient(to left, rgb(247, 247, 247), rgba(247, 247, 247, 0.9), rgba(0, 0, 0, 0));
```

```css
background-image: linear-gradient(to top, rgb(247, 247, 247), rgba(247, 247, 247, 0.9), rgba(0, 0, 0, 0));
```

```css
background-image: linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)), none;
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#e5e7eb` | border, background | 1924 |
| `#000000` | text, background, border | 1240 |
| `#ffffff` | text, background, border | 145 |
| `#707070` | text | 47 |
| `#161616` | background, text | 25 |
| `#384642` | text | 15 |
| `#656565` | background, text | 12 |
| `#474747` | background | 12 |
| `#f1f1f1` | background | 11 |
| `#999999` | text | 11 |
| `#c2c2c2` | background | 6 |
| `#2d2d2d` | background | 5 |
| `#f79942` | background | 5 |
| `#a4a4a4` | text | 5 |
| `#05061c` | background | 4 |
| `#373737` | background, text | 4 |
| `#e6fffb` | background | 3 |
| `#1f6af2` | text | 3 |
| `#fba61f` | text | 3 |
| `#b3b3b3` | text, background | 2 |
| `#22293f` | background | 1 |
| `#05898b` | text | 1 |
| `#428df7` | background | 1 |
| `#148fff` | text | 1 |
| `#ef4444` | background | 1 |
| `#22c55e` | background | 1 |
| `#0d0d0d` | background | 1 |
| `#d4d4d4` | background | 1 |
| `#0335fc` | text | 1 |
| `#e1ecff` | background | 1 |

## Typography

### Font Families

- **Inter** — used for all (1897 elements)
- **Geist Mono** — used for body (66 elements)
- **Aeonik Pro** — used for all (39 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 74px | 4.625rem | 500 | 84px | -1.11px | h1, span, img, div |
| 64px | 4rem | 500 | 72px | -0.96px | h2, br |
| 48px | 3rem | 500 | 52px | -0.72px | h2, span, br, div |
| 36px | 2.25rem | 400 | 44px | -1% | h2, img |
| 24px | 1.5rem | 500 | 32px | -0.24px | div |
| 18px | 1.125rem | 500 | 32px | -0.18px | span |
| 16px | 1rem | 400 | 24px | normal | html, head, title, link |
| 14px | 0.875rem | 500 | 15px | -0.14px | span, div, button, svg |
| 13px | 0.8125rem | 400 | 20px | normal | div |
| 12px | 0.75rem | 400 | 18px | normal | div, span, svg, path |
| 11px | 0.6875rem | 500 | 16px | 0.33px | div, svg, path, defs |
| 10px | 0.625rem | 500 | 24px | -0.1px | div, pre |
| 9px | 0.5625rem | 600 | 16px | normal | button, span |

### Heading Scale

```css
h1 { font-size: 74px; font-weight: 500; line-height: 84px; }
h2 { font-size: 64px; font-weight: 500; line-height: 72px; }
h2 { font-size: 48px; font-weight: 500; line-height: 52px; }
h2 { font-size: 36px; font-weight: 400; line-height: 44px; }
h2 { font-size: 14px; font-weight: 500; line-height: 15px; }
```

### Body Text

```css
body { font-size: 14px; font-weight: 500; line-height: 15px; }
```

### Font Weights in Use

`400` (1690x), `500` (293x), `600` (12x), `700` (7x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-1 | 1px | 0.0625rem |
| spacing-31 | 31px | 1.9375rem |
| spacing-48 | 48px | 3rem |
| spacing-56 | 56px | 3.5rem |
| spacing-60 | 60px | 3.75rem |
| spacing-64 | 64px | 4rem |
| spacing-67 | 67px | 4.1875rem |
| spacing-72 | 72px | 4.5rem |
| spacing-76 | 76px | 4.75rem |
| spacing-80 | 80px | 5rem |
| spacing-90 | 90px | 5.625rem |
| spacing-96 | 96px | 6rem |
| spacing-109 | 109px | 6.8125rem |
| spacing-116 | 116px | 7.25rem |
| spacing-120 | 120px | 7.5rem |
| spacing-125 | 125px | 7.8125rem |
| spacing-140 | 140px | 8.75rem |
| spacing-160 | 160px | 10rem |
| spacing-164 | 164px | 10.25rem |
| spacing-172 | 172px | 10.75rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| xs | 1px | 1 |
| sm | 4px | 14 |
| md | 8px | 20 |
| lg | 11px | 2 |
| lg | 14px | 35 |
| xl | 18px | 1 |
| xl | 24px | 13 |
| full | 32px | 6 |
| full | 999px | 103 |

## Box Shadows

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
```

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.04) 0px 8px 8px -3px, rgba(255, 255, 255, 0.04) 0px 3px 3px -1.5px, rgba(255, 255, 255, 0.03) 0px 2px 2px -1px, rgba(255, 255, 255, 0.03) 0px 1px 1px -0.5px, rgba(255, 255, 255, 0.04) 0px 0px 0px 1px;
```

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.08) 0px 1px 2px 0px, rgba(0, 0, 0, 0.08) 0px 4px 16px 0px, rgba(0, 0, 0, 0.08) 0px 16px 56px 0px;
```

**xs (inset)** — blur: 0.5px
```css
box-shadow: rgba(255, 255, 255, 0.06) 0px 0.5px 0.5px 0px inset, rgba(5, 6, 27, 0.88) 0px 16px 56px 0px, rgba(5, 6, 27, 0.16) 0px 2px 4px 0px, rgba(5, 6, 27, 0.12) 0px 1px 2px 0px, rgba(5, 6, 27, 0.88) 0px 0px 0px 1px;
```

**xs (inset)** — blur: 1px
```css
box-shadow: rgba(255, 255, 255, 0.7) 0px 0px 1px 0.1px inset, rgba(255, 255, 255, 0.32) 0px 0px 8px 0px;
```

**xs** — blur: 1px
```css
box-shadow: rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.02) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.04) 0px 6px 6px -3px, rgba(0, 0, 0, 0.06) 0px 12px 12px -3px;
```

**xs (inset)** — blur: 0.5px
```css
box-shadow: rgba(0, 0, 0, 0.04) 0px -2px 0.5px 0px inset, rgba(0, 0, 0, 0.04) 0px 12px 12px -3px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
```

**xs (inset)** — blur: 2px
```css
box-shadow: rgba(255, 255, 255, 0.12) 0px 1px 2px -0.5px inset, rgba(255, 255, 255, 0.16) 0px 0.5px 0.5px 0px inset, rgba(255, 255, 255, 0.16) 0px 8px 24px -4px inset, rgba(9, 1, 20, 0.03) 0px 8px 8px -3px, rgba(9, 1, 20, 0.03) 0px 5px 5px -2.5px, rgba(8, 1, 20, 0.03) 0px 3px 3px -1.5px, rgba(8, 1, 20, 0.03) 0px 2px 2px -1px, rgba(8, 1, 20, 0.03) 0px 1px 1px -0.5px, rgba(8, 1, 20, 0.03) 0px 0.5px 0.5px 0px;
```

**xs (inset)** — blur: 2px
```css
box-shadow: rgba(0, 0, 0, 0.04) 0px -1px 2px 0px inset, rgba(0, 0, 0, 0.04) 0px -0.5px 0.5px 0px inset;
```

**xs (inset)** — blur: 2px
```css
box-shadow: rgba(255, 255, 255, 0.36) 0px 1px 2px -0.5px inset, rgba(255, 255, 255, 0.18) 0px 0.5px 0.5px 0px inset, rgba(255, 255, 255, 0.25) 0px 8px 24px -4px inset, rgba(0, 0, 0, 0.1) 0px 8px 8px -3px, rgba(0, 0, 0, 0.1) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.08) 0px 2px 2px -1px, rgba(0, 0, 0, 0.06) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.06) 0px 0.5px 0.5px 0px;
```

**sm** — blur: 1.833px
```css
box-shadow: rgba(4, 8, 34, 0.16) 0px 1.375px 1.833px -0.687px, rgba(3, 8, 35, 0.16) 0px 0.917px 1.375px -0.458px, rgba(3, 8, 35, 0.16) 0px 0.458px 0.687px -0.229px, rgba(3, 8, 35, 0.16) 0px 0.229px 0.458px -0.115px, rgba(3, 8, 35, 0.16) 0px 0.115px 0.229px -0.057px, rgba(0, 0, 0, 0.12) 0px 0.057px 0.115px 0px;
```

**sm** — blur: 2px
```css
box-shadow: rgba(4, 8, 34, 0.06) 0px 1.5px 2px -0.75px, rgba(3, 8, 35, 0.12) 0px 1px 1.5px -0.5px, rgba(3, 8, 35, 0.12) 0px 0.5px 0.75px -0.25px, rgba(3, 8, 35, 0.12) 0px 0.25px 0.5px -0.125px, rgba(3, 8, 35, 0.12) 0px 0.125px 0.25px -0.062px, rgba(0, 0, 0, 0.12) 0px 0.062px 0.125px 0px;
```

**sm (inset)** — blur: 2px
```css
box-shadow: rgba(8, 1, 20, 0.03) 0px 2px 2px -1px, rgba(8, 1, 20, 0.03) 0px 1px 1px -0.5px, rgba(8, 1, 20, 0.03) 0px 0.5px 0.5px 0px, rgba(255, 255, 255, 0.04) 0px 2px 8px 0px inset, rgba(255, 255, 255, 0.1) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.12) 0px 0.5px 0.5px 0px inset;
```

**sm (inset)** — blur: 3px
```css
box-shadow: rgba(255, 255, 255, 0.06) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.06) 0px 0.5px 0.5px 0px inset, rgba(2, 9, 44, 0.24) 0px 16px 56px 0px, rgba(1, 9, 44, 0.24) 0px 4px 16px 0px, rgba(2, 9, 44, 0.24) 0px 1px 2px 0px, rgba(5, 6, 27, 0.52) 0px 0px 0px 1px;
```

**sm (inset)** — blur: 3px
```css
box-shadow: rgba(255, 255, 255, 0.06) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.06) 0px 0.5px 0.5px 0px inset, rgba(1, 9, 44, 0.24) 0px 4px 8px 0px, rgba(2, 9, 44, 0.24) 0px 1px 2px 0px, rgba(5, 6, 27, 0.74) 0px 0px 0px 1px;
```

**sm (inset)** — blur: 3px
```css
box-shadow: rgba(255, 255, 255, 0.06) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.06) 0px 0.5px 0.5px 0px inset, rgba(0, 0, 0, 0.24) 0px 16px 56px 0px, rgba(0, 0, 0, 0.24) 0px 4px 16px 0px, rgba(0, 0, 0, 0.24) 0px 1px 2px 0px, rgba(0, 0, 0, 0.52) 0px 0px 0px 1px;
```

**sm (inset)** — blur: 3px
```css
box-shadow: rgba(255, 255, 255, 0.12) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.12) 0px 0.5px 0.5px 0px inset, rgba(101, 101, 101, 0.16) 0px 4px 8px -2px, rgba(101, 101, 101, 0.12) 0px 2px 4px -1px, rgba(101, 101, 101, 0.12) 0px 1px 2px -0.5px, rgba(101, 101, 101, 0.12) 0px 0.5px 0.5px 0px;
```

**sm** — blur: 2.75px
```css
box-shadow: rgba(4, 8, 34, 0.16) 0px 2.062px 2.75px -1.031px, rgba(3, 8, 35, 0.16) 0px 1.375px 2.062px -0.687px, rgba(3, 8, 35, 0.16) 0px 0.687px 1.031px -0.344px, rgba(3, 8, 35, 0.16) 0px 0.344px 0.687px -0.172px, rgba(3, 8, 35, 0.16) 0px 0.172px 0.344px -0.086px, rgba(0, 0, 0, 0.12) 0px 0.086px 0.172px 0px;
```

**sm** — blur: 4px
```css
box-shadow: rgba(255, 255, 255, 0.32) 0px 2px 4px 0px, rgba(255, 255, 255, 0.32) 0px 1px 2px 0px, rgba(255, 255, 255, 0.32) 0px 0.5px 0.5px 0px;
```

**sm** — blur: 3.765px
```css
box-shadow: rgba(4, 8, 34, 0.06) 0px 2.824px 3.765px -1.412px, rgba(3, 8, 35, 0.12) 0px 1.882px 2.824px -0.941px, rgba(3, 8, 35, 0.12) 0px 0.941px 1.412px -0.471px, rgba(3, 8, 35, 0.12) 0px 0.471px 0.941px -0.235px, rgba(3, 8, 35, 0.12) 0px 0.235px 0.471px -0.118px, rgba(0, 0, 0, 0.12) 0px 0.118px 0.235px 0px;
```

**md (inset)** — blur: 8px
```css
box-shadow: rgba(0, 0, 0, 0.02) 0px 4px 8px 0px inset, rgba(0, 0, 0, 0.02) 0px 3px 6px 0px inset, rgba(0, 0, 0, 0.02) 0px 2px 4px 0px inset, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px inset, rgba(0, 0, 0, 0.04) 0px 0.5px 0.5px 0px inset;
```

**md** — blur: 6px
```css
box-shadow: rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.04) 0px 12px 12px -3px;
```

**md (inset)** — blur: 8px
```css
box-shadow: rgba(255, 255, 255, 0.04) 0px 4px 8px 0px inset, rgba(255, 255, 255, 0.04) 0px 2px 4px 0px inset, rgba(255, 255, 255, 0.04) 0px 1px 1px 0px inset, rgba(255, 255, 255, 0.06) 0px 0.5px 0.5px 0px inset;
```

**md (inset)** — blur: 12px
```css
box-shadow: rgba(255, 255, 255, 0.08) 0px -4px 12px -4px inset, rgba(255, 255, 255, 0.06) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.12) 0px 0.5px 0.5px 0px inset, rgba(9, 1, 20, 0.06) 0px 8px 8px -3px, rgba(8, 1, 20, 0.06) 0px 3px 3px -1.5px, rgba(8, 1, 20, 0.04) 0px 2px 2px -1px, rgba(8, 1, 20, 0.03) 0px 1px 1px -0.5px, rgba(8, 1, 20, 0.03) 0px 0.5px 0.5px 0px;
```

**md** — blur: 16px
```css
box-shadow: rgba(255, 255, 255, 0.72) 0px 0px 16px 0px, rgba(255, 255, 255, 0.32) 0px 0px 12px 0px, rgba(255, 255, 255, 0.32) 0px 0px 6px 0px, rgba(255, 255, 255, 0.32) 0px 0px 2px 0px;
```

**md** — blur: 8px
```css
box-shadow: rgba(0, 0, 0, 0.04) 0px 8px 8px -3px, rgba(0, 0, 0, 0.04) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 2px 2px -1px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.03) 0px 0.5px 0.5px 0px, rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
```

**md (inset)** — blur: 8px
```css
box-shadow: rgba(9, 1, 20, 0.06) 0px 8px 8px -3px, rgba(8, 1, 20, 0.06) 0px 3px 3px -1.5px, rgba(8, 1, 20, 0.04) 0px 2px 2px -1px, rgba(8, 1, 20, 0.03) 0px 1px 1px -0.5px, rgba(8, 1, 20, 0.03) 0px 0.5px 0.5px 0px, rgba(255, 255, 255, 0.08) 0px -4px 12px -4px inset, rgba(255, 255, 255, 0.06) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.12) 0px 0.5px 0.5px 0px inset;
```

**lg** — blur: 12px
```css
box-shadow: rgba(0, 0, 0, 0.04) 0px 12px 12px -3px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
```

**lg** — blur: 12px
```css
box-shadow: rgba(0, 0, 0, 0.06) 0px 12px 12px -3px, rgba(0, 0, 0, 0.04) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
```

**lg** — blur: 12px
```css
box-shadow: rgba(0, 0, 0, 0.04) 0px 12px 12px -3px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
```

**xl** — blur: 24px
```css
box-shadow: rgba(0, 0, 0, 0.05) 0px 12px 24px -3px, rgba(0, 0, 0, 0.03) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
```

**xl** — blur: 24px
```css
box-shadow: rgba(0, 0, 0, 0.08) 0px 12px 24px -3px, rgba(0, 0, 0, 0.04) 0px 6px 6px -3px, rgba(0, 0, 0, 0.04) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
```

**xl** — blur: 24px
```css
box-shadow: rgba(0, 0, 0, 0.12) 0px 12px 24px -3px, rgba(0, 0, 0, 0.06) 0px 6px 6px -3px, rgba(0, 0, 0, 0.06) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.06) 0px 1px 1px -0.5px;
```

**xl** — blur: 32px
```css
box-shadow: rgba(0, 0, 0, 0.06) 0px 16px 32px -6px, rgba(0, 0, 0, 0.08) 0px 8px 12px -6px, rgba(0, 0, 0, 0.04) 0px 4px 4px -2px, rgba(0, 0, 0, 0.06) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 2px 2px -1px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
```

**xl** — blur: 32px
```css
box-shadow: rgba(0, 0, 0, 0.04) 0px 24px 32px -3px, rgba(0, 0, 0, 0.06) 0px 12px 24px -3px, rgba(0, 0, 0, 0.04) 0px 6px 6px -3px, rgba(0, 0, 0, 0.04) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
```

**xl (inset)** — blur: 40px
```css
box-shadow: rgba(102, 102, 102, 0.03) 0px -32px 40px 0px inset, rgba(102, 102, 102, 0.12) 0px -2px 2px 0px inset, rgba(255, 255, 255, 0.64) 0px -1px 0.5px 0px inset, rgba(255, 255, 255, 0.5) 0px 1px 0.25px 0px inset, rgba(102, 102, 102, 0.04) 0px -8px 56px 0px inset;
```

**xl (inset)** — blur: 40px
```css
box-shadow: rgba(102, 102, 102, 0.03) 0px -32px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 24px 24px 0px, rgba(0, 0, 0, 0.06) 0px 4px 4px 0px, rgba(0, 0, 0, 0.02) 0px 2px 3px 0px, rgba(0, 0, 0, 0.08) 0px 1px 1px 0px, rgba(0, 0, 0, 0.08) 0px 0.5px 0.5px -0.5px;
```

**xl (inset)** — blur: 105px
```css
box-shadow: rgba(1, 1, 32, 0.08) 0px 262px 105px -72px, rgba(1, 1, 32, 0.16) 0px 147px 88px -40px, rgba(1, 1, 32, 0.2) 0px 64px 80px -32px, rgba(1, 1, 32, 0.24) 0px 16px 36px -12px, rgba(255, 255, 255, 0.06) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.12) 0px 0.5px 0.5px 0px inset;
```

## CSS Custom Properties

### Colors

```css
--tw-ring-offset-shadow: 0 0 #0000;
--tw-ring-shadow: 0 0 #0000;
--body-light-bg-ghost: color(display-p3 0.2157 0.2157 0.2157 / 0.04);
--body-dark-muted: color(display-p3 1 1 1 / 0.60);
--tw-ring-inset: ;
--tw-ring-offset-width: 0px;
--tw-border-spacing-x: 0;
--tw-shadow-colored: 0 0 #0000;
--tw-border-spacing-y: 0;
--body-light-muted: color(display-p3 0.3961 0.3961 0.3961);
--tw-ring-color: rgb(59 130 246 / .5);
--body-stroke-muted: color(display-p3 0.0863 0.0863 0.0863 / 0.12);
--body-light-bg-muted: color(display-p3 0.2157 0.2157 0.2157 / 0.12);
--tw-ring-offset-color: #fff;
```

### Spacing

```css
--tw-contain-size: ;
--tw-numeric-spacing: ;
```

### Shadows

```css
--tw-shadow: 0 0 #0000;
--tw-drop-shadow: ;
```

### Other

```css
--scrollbar-width: 6px;
--tw-contrast: ;
--body-dark-loud: color(display-p3 1 1 1 / 0.80);
--tw-backdrop-sepia: ;
--tw-sepia: ;
--tw-skew-x: 0;
--tw-ordinal: ;
--tw-backdrop-saturate: ;
--body-stroke-lighter: color(display-p3 0.0863 0.0863 0.0863 / 0.06);
--tw-backdrop-blur: ;
--tw-contain-style: ;
--body-light-ghost: color(display-p3 0.6444 0.6444 0.6444);
--tw-translate-x: 0;
--tw-gradient-via-position: ;
--tw-backdrop-invert: ;
--tw-saturate: ;
--tw-scroll-snap-strictness: proximity;
--tw-grayscale: ;
--tw-scale-x: 1;
--tw-backdrop-hue-rotate: ;
--tw-gradient-to-position: ;
--tw-brightness: ;
--tw-numeric-fraction: ;
--tw-backdrop-grayscale: ;
--tw-hue-rotate: ;
--tw-scale-y: 1;
--tw-pan-y: ;
--tw-backdrop-contrast: ;
--tw-skew-y: 0;
--tw-backdrop-brightness: ;
--tw-slashed-zero: ;
--tw-blur: ;
--tw-invert: ;
--tw-pan-x: ;
--tw-translate-y: 0;
--tw-backdrop-opacity: ;
--body-light-loud: color(display-p3 0.08 0.08 0.08);
--tw-gradient-from-position: ;
--tw-numeric-figure: ;
--tw-rotate: 0;
--tw-pinch-zoom: ;
--tw-contain-layout: ;
--tw-contain-paint: ;
```

### Semantic

```css
success: [object Object];
warning: [object Object];
error: [object Object];
info: [object Object];
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| 400px | 400px | min-width |
| 575px | 575px | max-width |
| sm | 576px | min-width |
| md | 767px | max-width |
| md | 768px | min-width |
| 956px | 956px | max-width |
| 957px | 957px | min-width |
| lg | 996px | max-width |
| lg | 1040px | min-width |
| 1200px | 1200px | min-width |
| 2xl | 1536px | min-width |

## Transitions & Animations

**Easing functions:** `[object Object]`, `[object Object]`, `[object Object]`

**Durations:** `0.2s`, `0.45s`, `0.25s`, `1s`, `0.05s`, `0.6s`, `0.4s`, `0.3s`

### Common Transitions

```css
transition: all;
transition: 0.2s cubic-bezier(0.6, 0.6, 0, 1);
transition: transform 0.45s cubic-bezier(0.6, 0.6, 0, 1);
transition: 0.45s cubic-bezier(0.6, 0.6, 0, 1);
transition: 0.45s cubic-bezier(0.6, 0.6, 0, 1) 0.25s;
transition: opacity 1s cubic-bezier(0.76, 0, 0.24, 1);
transition: color 0.05s cubic-bezier(0.6, 0.6, 0, 1), background-color 0.05s cubic-bezier(0.6, 0.6, 0, 1), border-color 0.05s cubic-bezier(0.6, 0.6, 0, 1), text-decoration-color 0.05s cubic-bezier(0.6, 0.6, 0, 1), fill 0.05s cubic-bezier(0.6, 0.6, 0, 1), stroke 0.05s cubic-bezier(0.6, 0.6, 0, 1), opacity 0.05s cubic-bezier(0.6, 0.6, 0, 1), box-shadow 0.05s cubic-bezier(0.6, 0.6, 0, 1), transform 0.05s cubic-bezier(0.6, 0.6, 0, 1), filter 0.05s cubic-bezier(0.6, 0.6, 0, 1), backdrop-filter 0.05s cubic-bezier(0.6, 0.6, 0, 1);
transition: color 0.45s cubic-bezier(0.6, 0.6, 0, 1), background-color 0.45s cubic-bezier(0.6, 0.6, 0, 1), border-color 0.45s cubic-bezier(0.6, 0.6, 0, 1), text-decoration-color 0.45s cubic-bezier(0.6, 0.6, 0, 1), fill 0.45s cubic-bezier(0.6, 0.6, 0, 1), stroke 0.45s cubic-bezier(0.6, 0.6, 0, 1), opacity 0.45s cubic-bezier(0.6, 0.6, 0, 1), box-shadow 0.45s cubic-bezier(0.6, 0.6, 0, 1), transform 0.45s cubic-bezier(0.6, 0.6, 0, 1), filter 0.45s cubic-bezier(0.6, 0.6, 0, 1), backdrop-filter 0.45s cubic-bezier(0.6, 0.6, 0, 1);
transition: color 0.6s cubic-bezier(0.6, 0.6, 0, 1), background-color 0.6s cubic-bezier(0.6, 0.6, 0, 1), border-color 0.6s cubic-bezier(0.6, 0.6, 0, 1), text-decoration-color 0.6s cubic-bezier(0.6, 0.6, 0, 1), fill 0.6s cubic-bezier(0.6, 0.6, 0, 1), stroke 0.6s cubic-bezier(0.6, 0.6, 0, 1), opacity 0.6s cubic-bezier(0.6, 0.6, 0, 1), box-shadow 0.6s cubic-bezier(0.6, 0.6, 0, 1), transform 0.6s cubic-bezier(0.6, 0.6, 0, 1), filter 0.6s cubic-bezier(0.6, 0.6, 0, 1), backdrop-filter 0.6s cubic-bezier(0.6, 0.6, 0, 1);
transition: color 0.2s cubic-bezier(0.6, 0.6, 0, 1), background-color 0.2s cubic-bezier(0.6, 0.6, 0, 1), border-color 0.2s cubic-bezier(0.6, 0.6, 0, 1), text-decoration-color 0.2s cubic-bezier(0.6, 0.6, 0, 1), fill 0.2s cubic-bezier(0.6, 0.6, 0, 1), stroke 0.2s cubic-bezier(0.6, 0.6, 0, 1), opacity 0.2s cubic-bezier(0.6, 0.6, 0, 1), box-shadow 0.2s cubic-bezier(0.6, 0.6, 0, 1), transform 0.2s cubic-bezier(0.6, 0.6, 0, 1), filter 0.2s cubic-bezier(0.6, 0.6, 0, 1), backdrop-filter 0.2s cubic-bezier(0.6, 0.6, 0, 1);
```

### Keyframe Animations

**rotate-1turn**
```css
@keyframes rotate-1turn {
  100% { rotate: 360deg; }
}
```

**rotate-1turn**
```css
@keyframes rotate-1turn {
  100% { rotate: 360deg; }
}
```

**rotate-1turn**
```css
@keyframes rotate-1turn {
  100% { rotate: 360deg; }
}
```

**rotate-1turn**
```css
@keyframes rotate-1turn {
  100% { rotate: 360deg; }
}
```

**rotate-1turn**
```css
@keyframes rotate-1turn {
  100% { rotate: 360deg; }
}
```

**rotate-1turn**
```css
@keyframes rotate-1turn {
  100% { rotate: 360deg; }
}
```

**rotate-1turn**
```css
@keyframes rotate-1turn {
  100% { rotate: 360deg; }
}
```

**rotate-1turn**
```css
@keyframes rotate-1turn {
  100% { rotate: 360deg; }
}
```

**rotate-1turn**
```css
@keyframes rotate-1turn {
  100% { rotate: 360deg; }
}
```

**rotate-1turn**
```css
@keyframes rotate-1turn {
  100% { rotate: 360deg; }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (55 instances)

```css
.button {
  background-color: rgba(255, 255, 255, 0.04);
  color: rgb(0, 0, 0);
  font-size: 16px;
  font-weight: 400;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 0px;
}
```

### Cards (55 instances)

```css
.card {
  background-color: rgb(255, 255, 255);
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Links (55 instances)

```css
.link {
  color: rgb(0, 0, 0);
  font-size: 14px;
  font-weight: 400;
}
```

### Navigation (27 instances)

```css
.navigatio {
  background-color: rgba(0, 0, 0, 0.12);
  color: rgb(0, 0, 0);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
  box-shadow: rgba(255, 255, 255, 0.12) 0px 1px 2px -0.5px inset, rgba(255, 255, 255, 0.16) 0px 0.5px 0.5px 0px inset, rgba(255, 255, 255, 0.16) 0px 8px 24px -4px inset, rgba(9, 1, 20, 0.03) 0px 8px 8px -3px, rgba(9, 1, 20, 0.03) 0px 5px 5px -2.5px, rgba(8, 1, 20, 0.03) 0px 3px 3px -1.5px, rgba(8, 1, 20, 0.03) 0px 2px 2px -1px, rgba(8, 1, 20, 0.03) 0px 1px 1px -0.5px, rgba(8, 1, 20, 0.03) 0px 0.5px 0.5px 0px;
}
```

### Footer (44 instances)

```css
.foote {
  background-color: rgba(22, 22, 22, 0.04);
  color: rgb(0, 0, 0);
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 14px;
}
```

### Modals (32 instances)

```css
.modal {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 0px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px -2px 0.5px 0px inset, rgba(0, 0, 0, 0.04) 0px 12px 12px -3px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Dropdowns (3 instances)

```css
.dropdown {
  background-color: rgba(15, 7, 29, 0.78);
  border-radius: 0px;
  box-shadow: rgba(9, 1, 20, 0.06) 0px 8px 8px -3px, rgba(8, 1, 20, 0.06) 0px 3px 3px -1.5px, rgba(8, 1, 20, 0.04) 0px 2px 2px -1px, rgba(8, 1, 20, 0.03) 0px 1px 1px -0.5px, rgba(8, 1, 20, 0.03) 0px 0.5px 0.5px 0px, rgba(255, 255, 255, 0.08) 0px -4px 12px -4px inset, rgba(255, 255, 255, 0.06) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.12) 0px 0.5px 0.5px 0px inset;
  border-color: rgb(229, 231, 235);
  padding-top: 0px;
}
```

### Tables (3 instances)

```css
.table {
  border-color: rgb(229, 231, 235);
  cell-style: [object Object];
}
```

### Badges (65 instances)

```css
.badge {
  background-color: rgba(255, 255, 255, 0.08);
  color: color(display-p3 0.3961 0.3961 0.3961);
  font-size: 14px;
  font-weight: 400;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 0px;
}
```

### Tabs (1 instances)

```css
.tab {
  background-color: color(display-p3 1 1 1);
  color: rgb(0, 0, 0);
  font-size: 16px;
  font-weight: 400;
  padding-top: 4px;
  padding-right: 12px;
  border-color: rgb(229, 231, 235);
  border-radius: 8px;
}
```

### Tooltips (18 instances)

```css
.tooltip {
  color: rgb(255, 255, 255);
  font-size: 14px;
  border-radius: 6px;
  padding-top: 4px;
  padding-right: 14px;
  box-shadow: rgba(255, 255, 255, 0.06) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.06) 0px 0.5px 0.5px 0px inset, rgba(1, 9, 44, 0.24) 0px 4px 8px 0px, rgba(2, 9, 44, 0.24) 0px 1px 2px 0px, rgba(5, 6, 27, 0.74) 0px 0px 0px 1px;
}
```

### ProgressBars (6 instances)

```css
.progressBar {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgb(0, 0, 0);
  border-radius: 999px;
  font-size: 16px;
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 14 instances, 4 variants

**Variant 1** (6 instances)

```css
  background: rgba(255, 255, 255, 0.04);
  color: rgb(0, 0, 0);
  padding: 7px 16px 7px 16px;
  border-radius: 999px;
  border: 0px solid rgb(229, 231, 235);
  font-size: 16px;
  font-weight: 400;
```

**Variant 2** (6 instances)

```css
  background: color(display-p3 0.0118 0.2067 0.9861);
  color: rgb(0, 0, 0);
  padding: 7px 16px 7px 16px;
  border-radius: 999px;
  border: 0px solid rgb(229, 231, 235);
  font-size: 16px;
  font-weight: 400;
```

**Variant 3** (1 instance)

```css
  background: rgb(39, 39, 39);
  color: rgb(255, 255, 255);
  padding: 1px 8px 1px 8px;
  border-radius: 999px;
  border: 0px solid rgb(229, 231, 235);
  font-size: 9px;
  font-weight: 600;
```

**Variant 4** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: color(display-p3 0.08 0.08 0.08);
  padding: 10px 12px 10px 12px;
  border-radius: 12px;
  border: 0px solid rgb(229, 231, 235);
  font-size: 14px;
  font-weight: 500;
```

### Button — 3 instances, 1 variant

**Variant 1** (3 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(0, 0, 0);
  padding: 16px 20px 16px 20px;
  border-radius: 0px;
  border: 0px solid rgb(229, 231, 235);
  font-size: 16px;
  font-weight: 400;
```

### Button — 18 instances, 1 variant

**Variant 1** (18 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(0, 0, 0);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px solid rgb(229, 231, 235);
  font-size: 16px;
  font-weight: 400;
```

### Button — 5 instances, 1 variant

**Variant 1** (5 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(0, 0, 0);
  padding: 7px 8px 7px 10px;
  border-radius: 6px;
  border: 0px none rgba(0, 0, 0, 0.06);
  font-size: 12px;
  font-weight: 400;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: color(display-p3 0.3961 0.3961 0.3961);
  padding: 10px 12px 10px 12px;
  border-radius: 12px;
  border: 0px solid rgb(229, 231, 235);
  font-size: 14px;
  font-weight: 400;
```

### Button — 9 instances, 1 variant

**Variant 1** (9 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: color(display-p3 0.08 0.08 0.08);
  padding: 23px 15px 23px 23px;
  border-radius: 14px;
  border: 0px solid rgb(229, 231, 235);
  font-size: 14px;
  font-weight: 500;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: color(display-p3 0.2157 0.2157 0.2157 / 0.04);
  color: rgb(0, 0, 0);
  padding: 0px 5px 0px 5px;
  border-radius: 6px;
  border: 0px solid rgb(229, 231, 235);
  font-size: 16px;
  font-weight: 400;
```

## Layout System

**14 grid containers** and **311 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 1128px | 16px |
| 968px | 0px |
| 640px | 0px |
| calc(100% - 96px) | 0px |
| 992px | 0px |
| calc(100% + 80px) | 0px |
| 960px | 12px |
| 1152px | 12px |
| 936px | 0px |
| 686px | 32px |
| 952px | 14px |
| 576px | 60px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 2-column | 4x |
| 3-column | 2x |
| 1-column | 1x |
| 4-column | 1x |

### Grid Templates

```css
grid-template-columns: 456px 456px;
gap: 24px;
grid-template-columns: 360px 360px 360px;
gap: 24px;
grid-template-columns: 456px 456px;
gap: 24px;
grid-template-columns: 312px 312px 312px;
grid-template-columns: 264px 264px 264px 264px;
gap: 24px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 272x |
| column/nowrap | 36x |
| row/wrap | 3x |

**Gap values:** `10px`, `12px`, `14px`, `15px`, `16px`, `16px 4px`, `20px`, `24px`, `28px`, `2px`, `36px`, `3px`, `40px`, `4px`, `6px`, `80px`, `8px`, `9px`

## Accessibility (WCAG 2.1)

**Overall Score: 50%** — 2 passing, 2 failing color pairs

### Failing Color Pairs

| Foreground | Background | Ratio | Level | Used On |
|------------|------------|-------|-------|---------|
| `#ffffff` | `#ef4444` | 3.76:1 | FAIL | span (1x) |
| `#ffffff` | `#22c55e` | 2.28:1 | FAIL | span (1x) |

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#ffffff` | `#272727` | 14.94:1 | AAA |
| `#0335fc` | `#e1ecff` | 6.04:1 | AA |

## Design System Score

**Overall: 73/100 (Grade: C)**

| Category | Score |
|----------|-------|
| Color Discipline | 80/100 |
| Typography Consistency | 80/100 |
| Spacing System | 85/100 |
| Shadow Consistency | 50/100 |
| Border Radius Consistency | 80/100 |
| Accessibility | 50/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Well-defined spacing scale, Good CSS variable tokenization

**Issues:**
- 38 unique shadows — consider a 3-level elevation scale (sm/md/lg)
- 2 WCAG contrast failures
- 30 !important rules — prefer specificity over overrides
- 919 duplicate CSS declarations

## Gradients

**20 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| linear | — | 2 | brand |
| linear | 0deg | 17 | complex |
| linear | — | 2 | brand |
| linear | — | 2 | brand |
| linear | — | 2 | brand |
| linear | 0deg | 2 | brand |
| linear | to right | 3 | bold |
| linear | — | 2 | brand |
| linear | 0deg | 2 | brand |
| linear | 155deg | 2 | brand |
| linear | — | 2 | brand |
| linear | — | 2 | brand |
| linear | — | 2 | brand |
| linear | 90deg | 7 | complex |
| linear | — | 2 | brand |

```css
background: linear-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0.8));
background: linear-gradient(0deg, rgb(255, 255, 255), rgb(230, 244, 247) 6.29%, rgb(128, 191, 239) 15.02%, rgb(68, 164, 233) 19.39%, rgb(48, 157, 231), rgb(16, 150, 229) 21.57%, color(xyz-d65 0.241 0.261 0.773), color(xyz-d65 0.23 0.248 0.764) 22.66%, color(xyz-d65 0.21 0.222 0.745) 23.75%, color(xyz-d65 0.188 0.157 0.764) 33.2%, color(xyz-d65 0.178 0.128 0.772), rgb(16, 70, 233) 42.64%, rgb(6, 29, 182) 53.09%, rgb(7, 11, 107) 66.19%, rgb(19, 2, 58) 75.33%, rgb(15, 7, 29) 86.09%, rgb(15, 7, 29));
background: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.75));
background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
background: linear-gradient(rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0));
```

## Z-Index Map

**7 unique z-index values** across 4 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| modal | 3000,9999 | div.h.e.a.d.e.r. .a.b.s.o.l.u.t.e. .l.e.f.t.-.0. .w.-.f.u.l.l. .t.o.p.-.0. .m.d.:.t.o.p.-.2.4. .z.-.[.3.0.0.0.], div, div.h.e.a.d.e.r.-.p.r.o.d.u.c.t.s.-.d.r.o.p.d.o.w.n.-.p.o.r.t.a.l. .m.d.:.b.l.o.c.k. .h.i.d.d.e.n. .f.i.x.e.d. .z.-.[.9.9.9.9.]. .p.o.i.n.t.e.r.-.e.v.e.n.t.s.-.n.o.n.e |
| dropdown | 100,100 | div.t.o.p.-.1.1.5. .a.b.s.o.l.u.t.e. .i.n.s.e.t.-.x.-.5.1. .b.g.-.w.h.i.t.e./.8.8. .z.-.[.1.0.0.]. .r.o.u.n.d.e.d.-.1.4. .h.-.1.5.6. .f.e.a.t.u.r.e.s.-.p.e.r.f.o.r.m.a.n.c.e.-.a.p.p |
| sticky | 10,11 | a.f.l.e.x. .g.a.p.-.1.4. .i.t.e.m.s.-.c.e.n.t.e.r. .c.u.r.s.o.r.-.p.o.i.n.t.e.r. .r.e.l.a.t.i.v.e. .z.-.1.0. .w.-.m.a.x, span.z.-.1.0. .a.b.s.o.l.u.t.e. .f.o.n.t.-.5.0.0. .t.o.p.-.1.0. .l.e.f.t.-.5.0. .t.e.x.t.-.1.2./.2.0. .t.e.x.t.-.w.h.i.t.e./.6.4. .t.r.a.n.s.i.t.i.o.n, div.w.-.f.u.l.l. .m.a.x.-.w.-.6.4.0. .h.-.4.3.1. .f.o.n.t.-.m.o.n.o. .z.-.1.0. .h.e.r.o.-.a.p.p.-.u.p.l.o.a.d.-.t.e.r.m.i.n.a.l. .r.e.l.a.t.i.v.e. .b.e.f.o.r.e.:.i.n.s.i.d.e.-.b.o.r.d.e.r. .b.e.f.o.r.e.:.b.o.r.d.e.r.-.w.h.i.t.e./.1.2. .r.o.u.n.d.e.d.-.1.2. .b.a.c.k.d.r.o.p.-.b.l.u.r.-.1.2. .t.r.a.n.s.i.t.i.o.n |
| base | -10,2 | div.p.a.g.e.-.b.a.c.k.g.r.o.u.n.d. .h.-.[.2.3.0.0.p.x.]. .m.d.:.h.-.[.2.8.5.0.p.x.]. .w.-.f.u.l.l. .o.v.e.r.f.l.o.w.-.h.i.d.d.e.n. .a.b.s.o.l.u.t.e. .t.o.p.-.0. .l.e.f.t.-.0. .-.z.-.1.0. .s.e.l.e.c.t.-.n.o.n.e. .p.o.i.n.t.e.r.-.e.v.e.n.t.s.-.n.o.n.e, span.s.e.c.t.i.o.n.-.t.i.t.l.e.-.s.h.a.d.o.w. .o.v.e.r.l.a.y. .-.z.-.1.0, span.f.o.o.t.e.r.-.s.t.a.t.u.s.-.d.o.t |

## SVG Icons

**106 unique SVG icons** detected. Dominant style: **filled**.

| Size Class | Count |
|------------|-------|
| xs | 8 |
| sm | 22 |
| md | 67 |
| lg | 2 |
| xl | 7 |

**Icon colors:** `white`, `url(#paint0_linear_191_185)`, `url(#paint0_linear_640_2086)`, `url(#paint1_linear_640_2086)`, `url(#paint0_linear_640_2189)`, `url(#paint0_linear_640_2213)`, `url(#paint1_linear_640_2213)`, `url(#paint2_linear_640_2213)`, `url(#paint3_linear_640_2213)`, `url(#paint4_linear_640_2213)`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| Inter | self-hosted | 400, 500, 600 | normal |
| Aeonik Pro | self-hosted | 500 | normal |
| Geist Mono | self-hosted | 400, 500 | normal |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 78 | objectFit: fill, borderRadius: 6px, shape: rounded |
| general | 9 | objectFit: fill, borderRadius: 0px, shape: square |
| gallery | 3 | objectFit: fill, borderRadius: 0px, shape: square |
| hero | 2 | objectFit: cover, borderRadius: 20px, shape: pill |
| avatar | 2 | objectFit: fill, borderRadius: 999px, shape: circular |

**Aspect ratios:** 1:1 (73x), 4:3 (4x), 16:9 (3x), 3:4 (2x), 2.96:1 (2x), 2.14:1 (2x), 3.78:1 (2x), 3:2 (2x)

## Motion Language

**Feel:** mixed · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `instant` | `50ms` | 50 |
| `sm` | `200ms` | 200 |
| `md` | `300ms` | 300 |
| `lg` | `450ms` | 450 |
| `xl` | `1s` | 1000 |

### Easing Families

- **custom** (247 uses) — `cubic-bezier(0.6, 0.6, 0, 1)`, `cubic-bezier(0.76, 0, 0.24, 1)`, `cubic-bezier(0.4, 0, 0.2, 1)`

## Component Anatomy

### button — 51 instances

**Slots:** label
**Variants:** primary · ghost
**Sizes:** sm · small · medium

| variant | count | sample label |
|---|---|---|
| default | 45 | Log in |
| primary | 5 | Sign up |
| ghost | 1 | send us a message |

## Brand Voice

**Tone:** neutral · **Pronoun:** you-only · **Headings:** Title Case (tight)

### Top CTA Verbs

- **start** (5)
- **read** (2)
- **perplexity** (2)
- **comfyui** (2)
- **clickup** (2)
- **moises** (2)
- **grain** (2)
- **letta** (2)

### Button Copy Patterns

- "start free trial" (5×)
- "read docs" (2×)
- "perplexity" (2×)
- "comfyui" (2×)
- "clickup" (2×)
- "moises" (2×)
- "grain" (2×)
- "letta desktop" (2×)
- "sunsama" (2×)
- "delta by etoro" (2×)

### Sample Headings

> Release, Secure and
Scale your Electron
App
> Release, Secure and Scale your ElectronApp
> Powering the world's
most popular Electron apps
Powering the world's
most popular Electron apps
> The Electron ops stack
> Streamline your
Electron
App Infrastructure
> Choose a plan
that fits your needs
> Questions & answers
> Want something simpler?
> Convert your web app into a desktop app with
> ToDesktop Builder

## Page Intent

**Type:** `landing` (confidence 0.29)
**Description:** ToDesktop is your end-to-end Electron partner — offering effortless deployment, robust security and seamless auto-updates.

Alternates: legal (0.4), blog-post (0.35)

## Section Roles

Reading order (top→bottom): cta → nav → cta → hero → testimonial → cta → pricing-table → faq → content → footer → nav → nav → nav → nav

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | cta | — | 0.75 |
| 1 | nav | — | 0.9 |
| 2 | cta | Release, Secure and
Scale your Electron
App | 0.75 |
| 3 | hero | Powering the world's
most popular Electron apps
Powering the world's
most popula | 0.4 |
| 4 | testimonial | The Electron ops stack | 0.8 |
| 5 | cta | Streamline your
Electron
App Infrastructure | 0.75 |
| 6 | pricing-table | Choose a plan
that fits your needs | 0.9 |
| 7 | faq | Questions & answers | 0.85 |
| 8 | content | Want something simpler? | 0.3 |
| 9 | footer | Products | 0.95 |
| 10 | nav | Products | 0.9 |
| 11 | nav | Docs & Resources | 0.9 |
| 12 | nav | Security & Legal | 0.9 |
| 13 | nav | Company & Contact | 0.9 |

## Material Language

**Label:** `material-you` (confidence 0.45)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.33 |
| Shadow profile | soft |
| Avg shadow blur | 0px |
| Max radius | 999px |
| backdrop-filter in use | no |
| Gradients | 20 |

## Imagery Style

**Label:** `screenshot` (confidence 0.34)
**Counts:** total 94, svg 0, icon 65, screenshot-like 24, photo-like 1
**Dominant aspect:** square-ish
**Radius profile on images:** rounded

## Component Library

**Detected:** `tailwindcss` (confidence 0.699)

Evidence:
- tailwind-like class density 68%

## Component Screenshots

16 retina crops written to `screenshots/`. Index: `*-screenshots.json`.

| Cluster | Variant | Size (px) | File |
|---------|---------|-----------|------|
| button--default | 0 | 72 × 36 | `screenshots/button-default-0.png` |
| button--default | 1 | 72 × 72 | `screenshots/button-default-1.png` |
| button--default | 2 | 72 × 72 | `screenshots/button-default-2.png` |
| button--primary | 0 | 81 × 36 | `screenshots/button-primary-0.png` |
| button--primary | 1 | 280 × 48 | `screenshots/button-primary-1.png` |
| button--primary | 2 | 170 × 40 | `screenshots/button-primary-2.png` |
| button--primary--sm | 0 | 140 × 36 | `screenshots/button-primary-sm-0.png` |
| button--primary--sm | 1 | 140 × 36 | `screenshots/button-primary-sm-1.png` |
| button--default--sm | 0 | 99 × 36 | `screenshots/button-default-sm-0.png` |
| button--default--sm | 1 | 319 × 154 | `screenshots/button-default-sm-1.png` |
| button--default--sm | 2 | 319 × 154 | `screenshots/button-default-sm-2.png` |
| button--default--small | 0 | 208 × 32 | `screenshots/button-default-small-0.png` |
| button--default--small | 1 | 208 × 32 | `screenshots/button-default-small-1.png` |
| button--default--small | 2 | 208 × 32 | `screenshots/button-default-small-2.png` |
| button--default--medium | 0 | 160 × 41 | `screenshots/button-default-medium-0.png` |
| button--ghost | 0 | 136 × 22 | `screenshots/button-ghost-0.png` |

Full-page: `screenshots/full-page.png`

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Inter` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
