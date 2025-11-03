import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // tải hình ảnh từ cms.fortyfive.shop và localhost
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.fortyfive.shop",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "panel.fortyfive.shop",
        pathname: "/**",
      },
    ],
  },
  // i18n: i18n,
};

export default nextConfig;
