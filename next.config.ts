import type { NextConfig } from "next";

// A server, not a static export: each page load reads the live Kalshi price.
const nextConfig: NextConfig = {
  // Stop `next dev` from writing its own rules into the tracked AGENTS.md.
  agentRules: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
