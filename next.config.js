/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/unbundle', destination: '/unbundle/index.html' },
      { source: '/unbundle/thanks', destination: '/unbundle/thanks/index.html' },
    ]
  },
  async redirects() {
    return [
      // Flattened tool/resource pages → top-level
      { source: '/tools/ai-hunter', destination: '/ai-hunter', permanent: true },
      { source: '/tools/ai-native', destination: '/ai-native', permanent: true },
      { source: '/resources/browser-monkey', destination: '/browser-monkey', permanent: true },
      { source: '/resources/ai-hunter-v2', destination: '/ai-hunter-skill', permanent: true },
      // Retired local Snaptastic page → canonical external app
      { source: '/resources/snaptastic', destination: 'https://snaptastic.vercel.app', permanent: true, basePath: false },
      // Buckler (LinkedIn analytics) → standalone gated Vercel app. "For now" (302).
      { source: '/buckler', destination: 'https://buckler-heymitchs-projects.vercel.app', permanent: false, basePath: false },
      // Old Signal mock dashboard superseded by Buckler
      { source: '/signal', destination: 'https://buckler-heymitchs-projects.vercel.app', permanent: false, basePath: false },
      // Redundant index pages → home
      { source: '/tools', destination: '/', permanent: true },
      { source: '/resources', destination: '/', permanent: true },
      { source: '/free', destination: '/', permanent: true },
    ]
  },
}

module.exports = nextConfig
