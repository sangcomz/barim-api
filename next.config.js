/** @type {import('next').NextConfig} */
const nextConfig = {
  // API 전용이므로 정적 최적화 비활성화
  output: 'standalone',
  serverExternalPackages: ['@octokit/rest'],
  // API routes만 사용하므로 pages 빌드 스킵
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://barim-app.vercel.app',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Authorization, Content-Type',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
