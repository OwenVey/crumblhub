/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'crumbl.video',
      },
      {
        protocol: 'https',
        hostname: 'friconix.com',
      },
    ],
  },
};

export default nextConfig;
