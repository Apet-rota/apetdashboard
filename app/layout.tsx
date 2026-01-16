import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APET Analytics Dashboard",
  description: "Dashboard de análise de dados e vendas da APET",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} antialiased`}
      >
        <DashboardShell>
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}
