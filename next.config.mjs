/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'mosaic.scdn.co',
        }],
    },
};
  
export default nextConfig;
  