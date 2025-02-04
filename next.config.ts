import { SESSION_COOKIE_NAME } from '@/constant';
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
      {
        protocol: 'https',
        hostname: 'cdn.fetimes.co.kr',
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/mypage/:path*',
        missing: [{ type: 'cookie', key: 'access' }],
        permanent: false,
        destination: '/login',
      },
      {
        source: '/classrooms/:path*',
        missing: [{ type: 'cookie', key: 'access' }],
        permanent: false,
        destination: '/login',
      },
    ];
  },
};

export default nextConfig;
