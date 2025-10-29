import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import DynamicLayout from "./components/DynamicLayout";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
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
      <body className={`${montserrat.variable} antialiased`}>
        <DynamicLayout>
          {children}
        </DynamicLayout>
      </body>
    </html>
  );
}
