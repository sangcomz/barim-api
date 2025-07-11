/** @type {import('next').NextConfig} */
const nextConfig = {
  // API 전용이므로 정적 최적화 비활성화
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@octokit/rest']
  },
  // API routes만 사용하므로 pages 빌드 스킵
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
