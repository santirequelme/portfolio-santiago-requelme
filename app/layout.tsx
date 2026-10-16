import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { GeistPixelSquare } from "geist/font/pixel"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { SkipLink } from "@/components/skip-link"

// Geist (variable, 100–900): fallback for titles and body. Titles use Geist Pixel.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: "variable",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const siteUrl = "https://www.santirequelme.dev"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Santiago Requelme - Product Engineer",
    template: "%s | Santiago Requelme",
  },
  description: "Product engineer with a frontend and design background. I design, prototype and build product features end to end, from the first idea to production code.",
  keywords: ["Product Engineer", "Design Engineer", "Frontend Engineer", "UI Developer", "React", "Next.js", "TypeScript", "Santiago Requelme", "Portfolio", "Web Developer", "Frontend Developer"],
  authors: [{ name: "Santiago Requelme", url: siteUrl }],
  creator: "Santiago Requelme",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_ES",
    url: siteUrl,
    siteName: "Santiago Requelme Portfolio",
    title: "Santiago Requelme - Product Engineer",
    description: "Product engineer with a frontend and design background, building product features end to end.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Santiago Requelme - Product Engineer",
    description: "Product engineer with a frontend and design background, building product features end to end.",
    creator: "@santirequelme",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1714" },
  ],
}

const themeScript = `
  (function() {
    // Light mode is the default; dark only when the visitor picked it.
    const theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  })();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preload" href="/fonts/Satoshi-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} ${GeistPixelSquare.variable} font-sans antialiased`}>
        <LanguageProvider>
          <SkipLink />
          {children}
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
