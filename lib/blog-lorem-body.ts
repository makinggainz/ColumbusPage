/**
 * Long placeholder copy for blog article bodies (Lorem-style sections + headings).
 */

export type BlogBodyBlock = { type: "h2"; text: string } | { type: "p"; text: string };

const P =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const P2 =
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi.";

const P3 =
  "Fusce convallis metus id felis luctus adipiscing. Pellentesque egestas neque sit amet ante mattis maximus. Integer pellentesque massa sed nibh vehicula, vitae feugiat quam aliquam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed vitae diam vel nisl rhoncus dignissim. Phasellus at nunc non lectus tristique condimentum. Morbi nec metus vel nunc interdum venenatis.";

/** Appended to every post’s real intro paragraphs for a long scrollable article. */
export const EXTENDED_LOREM_BODY: BlogBodyBlock[] = [
  { type: "h2", text: "Achieving presence in long-form notes" },
  { type: "p", text: `${P} ${P2}` },
  { type: "p", text: P3 },
  { type: "h2", text: "Why structure matters at planetary scale" },
  { type: "p", text: `${P2} ${P}` },
  { type: "p", text: `${P3} ${P2}` },
  { type: "h2", text: "Latency, tiling, and the illusion of continuity" },
  { type: "p", text: `${P} ${P3}` },
  { type: "p", text: `${P2} ${P} ${P3}` },
  { type: "h2", text: "Evaluation without ground truth theater" },
  { type: "p", text: `${P3} ${P}` },
  { type: "p", text: P2 },
  { type: "h2", text: "Interfaces that respect the operator" },
  { type: "p", text: `${P} ${P2} ${P3}` },
  { type: "p", text: P },
  { type: "h2", text: "Closing thoughts (still placeholder)" },
  { type: "p", text: `${P2} ${P3} ${P}` },
  { type: "p", text: `${P} ${P2}` },
  { type: "p", text: P3 },
];

export function mergeBlogBody(introParagraphs: string[]): BlogBodyBlock[] {
  const intro: BlogBodyBlock[] = introParagraphs.map((text) => ({ type: "p", text }));
  return [...intro, ...EXTENDED_LOREM_BODY];
}

export type BlogBodyBlockWithSectionId =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string };

/** Stable `id`s on each H2 for in-page anchors (sticky nav). */
export function blogBodyWithSectionIds(blocks: BlogBodyBlock[]): BlogBodyBlockWithSectionId[] {
  let n = 0;
  return blocks.map((b) =>
    b.type === "h2" ? { type: "h2", text: b.text, id: `blog-sec-${n++}` } : b
  );
}
