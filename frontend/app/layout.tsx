import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CamPy - Camera Management System',
  description: 'A modern camera management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
