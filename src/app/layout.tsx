import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";
import DynamicLayout from "./components/DynamicLayout";

const bogle = Barlow({
  variable: "--font-bogle",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tótem de Juegos D3",
  description: "Sistema de tótem interactivo para selección de juegos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${bogle.variable} antialiased`}
      >
        <DynamicLayout>
          {children}
        </DynamicLayout>
      </body>
    </html>
  );
}
