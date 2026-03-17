/** @type {import('next').NextConfig} */
const nextConfig = {
  // serverComponentsExternalPackages moved out of experimental in Next.js 15+
  serverExternalPackages: ["pdf-parse", "mammoth"],
};

module.exports = nextConfig;
