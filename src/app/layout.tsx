import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fergusson College Virtual Tour',
  description: 'Explore Fergusson College campus with our immersive virtual tour',
  keywords: ['Fergusson College', 'virtual tour', '360 degree', 'campus', 'education'],
  authors: [{ name: 'Fergusson College' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"> */}
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
          
          {children}
        </div>
      </body>
    </html>
  )
}