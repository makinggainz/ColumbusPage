import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  async redirects() {
    return [
      // Canonical host: send www.columbus.earth → apex columbus.earth (308).
      // Without this both hosts return 200 and serve duplicate content, so
      // search engines index them separately (Google indexed the apex, Bing/
      // DuckDuckGo the www) and never consolidate onto one URL.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.columbus.earth" }],
        destination: "https://columbus.earth/:path*",
        permanent: true,
      },
      { source: "/products",    destination: "/products/consumer",   permanent: true },
      { source: "/business",  destination: "/products/business", permanent: true },
      // Back-compat: the page was formerly branded "enterprise" — keep old URLs alive.
      { source: "/enterprise", destination: "/products/business", permanent: true },
      { source: "/products/enterprise", destination: "/products/business", permanent: true },
      { source: "/mapsgpt",     destination: "/products/consumer",   permanent: true },
      { source: "/products/mapsgpt", destination: "/products/consumer", permanent: true },
      // Was pointing at /products/maps-gpt, which doesn't exist (404). The
      // consumer product (formerly MapsGPT) now lives at /products/consumer.
      { source: "/maps-gpt",    destination: "/products/consumer",   permanent: true },
      { source: "/products/maps-gpt", destination: "/products/consumer", permanent: true },
      // Old business product ("Market Spy") URL → current business product.
      { source: "/market-spy",  destination: "/products/business",   permanent: true },
      // Blog post renamed MapsGPT → Elio; keep the old indexed URL alive.
      { source: "/blog/mapsgpt-building-useful", destination: "/blog/elio-building-useful", permanent: true },
      // The Company page was formerly routed at /mission (and earlier /our-mission).
      { source: "/our-mission", destination: "/company",             permanent: true },
      { source: "/mission",     destination: "/company",             permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
    // AVIF first (best compression), then WebP fallback; the browser
    // picks whichever it can decode. Cuts our heavy PNGs (some 10-40 MB
    // on disk) down to a few hundred KB at most served sizes.
    formats: ["image/avif", "image/webp"],
    // Match the default sizes the Image component picks; keeping the
    // list tight reduces the number of cached derivatives the optimizer
    // has to keep on disk.
    deviceSizes: [640, 750, 828, 1080, 1200, 1287, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 1 year — the optimizer fingerprints by source bytes, so a longer
    // TTL is safe and avoids re-encoding the same source repeatedly.
    minimumCacheTTL: 60 * 60 * 24 * 365,
    // Allow downshifting quality on heavier images via `quality={…}`.
    qualities: [50, 60, 70, 75, 80, 85, 90, 100],
  },
};

export default nextConfig;
