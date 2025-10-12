/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: false, // Enable Next.js image optimization
    formats: ['image/avif', 'image/webp']
  },
  // Enable compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'gsap']
  }
}

module.exports = nextConfig
