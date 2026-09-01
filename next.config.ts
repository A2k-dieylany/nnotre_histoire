import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Défaut Next.js : 1 Mo, trop bas pour une photo de téléphone (souvent 3-8 Mo).
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
