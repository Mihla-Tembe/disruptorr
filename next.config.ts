import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence workspace root inference warning by pinning the root
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
