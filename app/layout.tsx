import type { Metadata } from "next";
import "./globals.css";
import { TicketProvider } from "@/context/TicketContext";

export const metadata: Metadata = {
  title: "Sistema Posventa - FastFood",
  description: "Sistema de atención posventa para restaurantes de comida rápida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50">
        <TicketProvider>
          {children}
        </TicketProvider>
      </body>
    </html>
  );
}
