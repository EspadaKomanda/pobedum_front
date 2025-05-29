/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      }
    ]
  },
  webpack: (config, { dev, isServer }) => {
    // Disable webpack caching to avoid file system issues
    config.cache = false;
    
    return config;
  }
};

module.exports = nextConfig;