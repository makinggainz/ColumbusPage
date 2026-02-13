This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# ColumbusPage

---

## Working in this project (beginner guide)

### How the project is organized

- **`app/`** – Routes (URLs). For example, `app/technology/page.tsx` is what you see at `/technology`. Each `page.tsx` is the “entry” for that URL.
- **`components/`** – Reusable UI pieces. The Technology page uses everything under `components/technology/`.
- **`*.module.css`** – Styles scoped to a component. The Technology page’s look is in `components/technology/technology.module.css`.

So for the Technology page:

1. **URL** `/technology` → **Route** `app/technology/page.tsx` → **Page component** `components/technology/TechnologyPage.tsx` → **Styles** `components/technology/technology.module.css`.

### Changing text color on the Technology page

Text color is controlled by **CSS**. The main file for the Technology page is:

**`components/technology/technology.module.css`**

- **Whole page default text color:** the `.page` rule at the top sets `color: #0a1628` (dark blue‑black). Change that value to change the default text color for the page.
- **Specific sections** have their own rules. For example:
  - `.indexCopy p` – paragraph text in the first “Building a brain for Earth” section (e.g. `color: rgba(0, 0, 0, 0.82)`).
  - `.sidebarLink` – sidebar nav links (`color: rgba(10, 22, 40, 0.86)`).
  - `.sectionTitle` – big section titles.
  - `.lgmTitle`, `.fusingTitle`, etc. – titles in other sections.

**Steps to change a color:**

1. Run the dev server: `npm run dev`.
2. Open [http://localhost:3000/technology](http://localhost:3000/technology).
3. Open `components/technology/technology.module.css` in your editor.
4. Find the class that styles the text you want (e.g. `.indexCopy p` for the first section paragraphs).
5. Change the `color:` value (e.g. to `#1a365d` for blue, or `#0d9488` for teal).
6. Save the file; the browser will refresh and show the new color.

**Color format tips:**  
- `#1a365d` = hex color.  
- `rgba(0, 0, 0, 0.82)` = black at 82% opacity.  
- Named colors like `rebeccapurple` or `coral` also work.
