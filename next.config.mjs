/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // firebase-admin depends on `jose`, which is ESM-only in recent versions.
  // Webpack bundling it for the Node.js serverless runtime causes
  // ERR_REQUIRE_ESM at runtime. Marking it external makes Next.js load it
  // via Node's native require at runtime instead, which resolves ESM/CJS
  // correctly.
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin"],
  },
};

export default nextConfig;
