/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow Next.js <Image> to optimize from these remote domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // Modern formats — browser picks best supported
    formats: ["image/avif", "image/webp"],
    // Hero images on homepage are large, allow up to 1920px
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 3600,
  },
};

module.exports = nextConfig;
