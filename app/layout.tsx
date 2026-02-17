import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ESGtech.ai - GHG Dashboard',
  description: 'Monitor your greenhouse gas emissions across all scopes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
