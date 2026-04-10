/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/reports',
        destination: '/brsr',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
