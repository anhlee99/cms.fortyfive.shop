import type { NextConfig } from "next";
import { i18n } from "./next-i18next.config";

const nextConfig: NextConfig = {
  /* config options here */
  // tải hình ảnh từ cms.fortyfive.shop và localhost
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.fortyfive.shop',
        pathname: '/**',
      },
    ]
  },
  i18n: i18n,
};

export default nextConfig;
