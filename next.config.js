/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "droper-media.us-southeast-1.linodeobjects.com",
      "droper-lapse.us-southeast-1.linodeobjects.com", // ✅ adicionado
      "static.droper.app",
      "droper.s3.amazonaws.com",
      "images.stockx.com",
      "images.vans.com"
    ],
  },
};

module.exports = nextConfig;
