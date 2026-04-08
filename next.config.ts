import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.maisonsouquet.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
