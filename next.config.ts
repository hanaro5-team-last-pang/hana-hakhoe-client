import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'lastpang-file-bucket.s3.ap-northeast-2.amazonaws.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;
