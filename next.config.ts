import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Headers de seguridad
  async headers() {
    return [
      {
        // Aplicar a todas las rutas
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },

  // Configuración de imágenes (seguridad en remote patterns)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io', // UploadThing
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Modo estricto de React para mejor detección de problemas
  reactStrictMode: true,

  // Minimizar código en producción
  swcMinify: true,
};

export default nextConfig;
