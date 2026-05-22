/** @type {import('next').NextConfig} */
const appName = process.env.APP_NAME || "Starter App";
const baseUrl = process.env.BASE_URL || "http://localhost:8000";
const apiPrefix = process.env.API_PREFIX || "/api";

const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_NAME: appName,
    NEXT_PUBLIC_API_PREFIX: apiPrefix,
  },
  async rewrites() {
    return [
      {
        source: `${apiPrefix}/:path*`,
        destination: `${baseUrl}${apiPrefix}/:path*`,
      },
    ];
  },
};

export default nextConfig;
