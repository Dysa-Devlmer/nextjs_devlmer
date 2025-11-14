import type { Metadata } from "next";
import "./globals.css";
import { TicketProvider } from "@/context/TicketContext";
import { CartProvider } from "@/context/CartContext";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "FastFood - Sistema de Gestión",
  description: "Sistema completo de gestión para restaurantes de comida rápida",
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
