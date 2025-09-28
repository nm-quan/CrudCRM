import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* your other config options */
  turbopack: {
    // ensures Next.js uses this folder as the workspace root
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
