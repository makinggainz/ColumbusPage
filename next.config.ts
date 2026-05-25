// Trigger Vercel rebuild (2)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  async redirects() {
    return [
      { source: "/products",    destination: "/products/consumer",   permanent: true },
      { source: "/business",  destination: "/products/business", permanent: true },
      // Back-compat: the page was formerly branded "enterprise" — keep old URLs alive.
      { source: "/enterprise", destination: "/products/business", permanent: true },
      { source: "/products/enterprise", destination: "/products/business", permanent: true },
      { source: "/mapsgpt",     destination: "/products/consumer",   permanent: true },
      { source: "/products/mapsgpt", destination: "/products/consumer", permanent: true },
      { source: "/maps-gpt",    destination: "/products/maps-gpt",   permanent: true },
      // The Company page was formerly routed at /mission (and earlier /our-mission).
      { source: "/our-mission", destination: "/company",             permanent: true },
      { source: "/mission",     destination: "/company",             permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
