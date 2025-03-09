import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CamPy - Camera Security System",
  description: "Advanced camera security system with real-time monitoring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark:bg-gray-900 dark:text-gray-100`}>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Header />
          <main className="container mx-auto px-6 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
