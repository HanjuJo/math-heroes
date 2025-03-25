/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/math-heroes',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true
}

module.exports = nextConfig 