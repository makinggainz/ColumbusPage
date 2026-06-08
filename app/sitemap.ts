import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";

const BASE_URL = "https://columbus.earth";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/products/business`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/products/consumer`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/company`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/research`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/blog`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE_URL}/blog/Engineering`, priority: 0.5, changeFrequency: "weekly" },
    { url: `${BASE_URL}/blog/Product`, priority: 0.5, changeFrequency: "weekly" },
    { url: `${BASE_URL}/blog/CompanyNews`, priority: 0.5, changeFrequency: "weekly" },
    { url: `${BASE_URL}/contact`, priority: 0.5, changeFrequency: "monthly" },
  ];

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
