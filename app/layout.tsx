import type { Metadata } from "next";
import "./globals.css";
import { TicketProvider } from "@/context/TicketContext";
import { CartProvider } from "@/context/CartContext";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "FastFood - Sistema de Gestión para Restaurantes",
    template: "%s | FastFood"
  },
  description: "Sistema integral de gestión para restaurantes de comida rápida. Incluye pedidos en línea, gestión de productos, tickets de soporte con chat en tiempo real, panel administrativo completo y más.",
  keywords: [
    "sistema de gestión",
    "restaurante",
    "comida rápida",
    "pedidos en línea",
    "punto de venta",
    "POS",
    "gestión de pedidos",
    "delivery",
    "soporte al cliente"
  ],
  authors: [{ name: "FastFood Team" }],
  creator: "FastFood",
  publisher: "FastFood",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://fastfood.com',
    title: 'FastFood - Sistema de Gestión para Restaurantes',
    description: 'Sistema integral de gestión para restaurantes de comida rápida con pedidos en línea, chat en tiempo real y panel administrativo completo.',
    siteName: 'FastFood',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FastFood - Sistema de Gestión para Restaurantes',
    description: 'Sistema integral de gestión para restaurantes de comida rápida.',
    creator: '@fastfood',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    // Agregar códigos de verificación cuando estén disponibles
    // google: 'google-verification-code',
    // yandex: 'yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50">
        <SessionProvider>
          <CartProvider>
            <TicketProvider>
              {children}
            </TicketProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
