import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  async redirects() {
    return [
      { source: "/products",    destination: "/products/mapsgpt",    permanent: true },
      { source: "/enterprise",  destination: "/products/enterprise", permanent: true },
      { source: "/mapsgpt",     destination: "/products/mapsgpt",    permanent: true },
      { source: "/maps-gpt",    destination: "/products/maps-gpt",   permanent: true },
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
