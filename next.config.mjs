/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // firebase-admin depends on `jose`, which is ESM-only in recent versions.
  // Webpack bundling it for the Node.js serverless runtime causes
  // ERR_REQUIRE_ESM at runtime. Marking it external makes Next.js load it
  // via Node's native require at runtime instead, which resolves ESM/CJS
  // correctly.
  experimental: {
    // firebase-admin pulls in jwks-rsa, which requires jose@^6 (ESM-only).
    // Externalizing just "firebase-admin" wasn't enough — webpack still
    // bundled jose via that transitive chain. List the whole chain
    // explicitly so none of it gets pulled into the webpack bundle.
    serverComponentsExternalPackages: [
      "firebase-admin",
      "jose",
      "jwks-rsa",
      "google-auth-library",
      "gaxios",
      "gcp-metadata",
      "gtoken",
    ],
  },
};

export default nextConfig;
