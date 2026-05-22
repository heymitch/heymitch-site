/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/unbundle', destination: '/unbundle/index.html' },
      { source: '/unbundle/thanks', destination: '/unbundle/thanks/index.html' },
    ]
  },
}

module.exports = nextConfig
