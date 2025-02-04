/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cy-asset-files.codeyoung.com",
      },
      {
        protocol: "https",
        hostname: "demoscheduling.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "user-assets.codeyoung.com",
      },
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
