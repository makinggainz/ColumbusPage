import { BLOG_POSTS } from "@/lib/blog-posts";

const BASE_URL = "https://columbus.earth";

export function GET() {
  const engineering = BLOG_POSTS.filter((p) => p.category === "ENGINEERING");
  const product = BLOG_POSTS.filter((p) => p.category === "PRODUCT");
  const companyNews = BLOG_POSTS.filter((p) => p.category === "COMPANY NEWS");

  const articleLines = (posts: typeof BLOG_POSTS) =>
    posts
      .map((p) => `- [${p.title}](${BASE_URL}/blog/${p.slug}): ${p.description}`)
      .join("\n");

  const body = `# Columbus Earth

> Columbus Earth is a spatial frontier AI company building the first production Large Geospatial Model (LGM) — an AI that understands the physical world. Products include Columbus Pro (enterprise geospatial intelligence) and Elio (consumer travel and city exploration).

Columbus Earth's mission is to bring a paradigm shift in the relationship between AI and the physical world. The company collects the world's data and builds AI that comprehends it all — from satellite imagery and temporal patterns to public and private geospatial datasets.

## Core Pages
- [Home](${BASE_URL}/): Columbus Earth overview — the Large Geospatial Model, Columbus Pro, and Elio
- [Company](${BASE_URL}/company): Mission, vision, founders, and what Columbus Earth is building
- [Research](${BASE_URL}/research): An interactive thesis on building the Large Geospatial Model

## Products
- [Columbus Pro](${BASE_URL}/products/business): Agentic GIS platform for site selection, due diligence, and location research — for real estate, urban infrastructure, geomarketing, and more
- [Elio](${BASE_URL}/products/consumer): The social super map — AI-powered city and travel exploration for consumers

## Engineering
${articleLines(engineering)}

## Product Articles
${articleLines(product)}

## Company News
${articleLines(companyNews)}

## Optional
- [Blog](${BASE_URL}/blog): All research notes, product releases, and company updates from Columbus Earth
- [Contact](${BASE_URL}/contact): Contact form for demos, investor relations, careers, and general inquiries
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
