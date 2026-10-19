const ONE_YEAR = 60 * 60 * 24 * 365;
const ONE_DAY = 60 * 60 * 24;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // WebP encodes far faster than AVIF, so the first view of an image never waits on the encoder.
    formats: ['image/webp'],
    // Optimized variants are cached on disk for 30 days (the default is 4 hours).
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async headers() {
    return [
      // Uploads get a unique name every time, so they can be cached forever.
      { source: '/uploads/:path*', headers: [{ key: 'Cache-Control', value: `public, max-age=${ONE_YEAR}, immutable` }] },
      // Bundled assets keep their names, so revalidate daily in the background.
      { source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: `public, max-age=${ONE_DAY}, stale-while-revalidate=${ONE_DAY * 7}` }] },
    ];
  },
};

export default nextConfig;
