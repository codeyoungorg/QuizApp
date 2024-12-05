"use strict";

/** @type {import('next').NextConfig} */

import nrExternals from "newrelic/load-externals.js";

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
    ],
  },
  webpack: (config) => {
    nrExternals(config);
    return config;
  },
};

export default nextConfig;
