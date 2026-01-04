import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: "/jastinterview/",
  basePath: "/jastinterview",
  output: "export",
};

export default nextConfig;
