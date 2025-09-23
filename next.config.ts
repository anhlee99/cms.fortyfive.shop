import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // tải hình ảnh từ cms.fortyfive.shop và localhost
  images: {
    domains: ['cms.fortyfive.shop', 'localhost'],
  },
};

export default nextConfig;
