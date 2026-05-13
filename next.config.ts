import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN devices (phones, tablets, other laptops) to hit the dev server.
  allowedDevOrigins: ["10.0.0.243", "10.0.0.*", "192.168.*.*", "localhost"],
};

export default nextConfig;
