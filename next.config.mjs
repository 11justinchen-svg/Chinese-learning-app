/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // No marketing home page — the app opens straight into the lessons.
      { source: "/", destination: "/lessons", permanent: false },
    ];
  },
};

export default nextConfig;
