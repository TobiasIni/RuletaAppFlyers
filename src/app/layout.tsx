import type { Metadata } from "next";
import "./globals.css";
import DynamicLayout from "./components/DynamicLayout";

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
      <body className="antialiased">
        <DynamicLayout>
          {children}
        </DynamicLayout>
      </body>
    </html>
  );
}
