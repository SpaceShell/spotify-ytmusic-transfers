/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'mosaic.scdn.co',
        }],
    },
    allowedDevOrigins: ['http://127.0.0.1:3000', 'http://localhost:3000',],
};
  
export default nextConfig;
  