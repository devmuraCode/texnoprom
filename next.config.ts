import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `$var: red;`,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "back-texnoprom.uz",
        port: "",
      },
    ],
  },
};

export default nextConfig;
