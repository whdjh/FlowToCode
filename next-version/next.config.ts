import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/, // SVG 파일을 찾습니다.
      use: [
        {
          loader: '@svgr/webpack', // SVGR 로더 사용
          options: {
            icon: true, // 기본적으로 SVG를 아이콘 크기로 조정
          },
        },
      ],
    });

    return config;
  },

  trailingSlash: true,
  images: {
    domains: ['sprint-fe-project.s3.ap-northeast-2.amazonaws.com'], // 외부 이미지 도메인 추가
    unoptimized: true, // 이미지 최적화 비활성화
  },
};

export default nextConfig;