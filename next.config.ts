import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  async redirects() {
    return [
      { source: "/products",    destination: "/products/mapsgpt",    permanent: true },
      { source: "/business",  destination: "/products/business", permanent: true },
      // Back-compat: the page was formerly branded "enterprise" — keep old URLs alive.
      { source: "/enterprise", destination: "/products/business", permanent: true },
      { source: "/products/enterprise", destination: "/products/business", permanent: true },
      { source: "/mapsgpt",     destination: "/products/mapsgpt",    permanent: true },
      { source: "/maps-gpt",    destination: "/products/maps-gpt",   permanent: true },
      { source: "/our-mission", destination: "/mission",             permanent: true },
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
