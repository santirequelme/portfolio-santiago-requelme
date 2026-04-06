import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono, Syne } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Santiago Requelme - Frontend Engineer & UI Specialist",
    template: "%s | Santiago Requelme",
  },
  description: "Frontend Engineer & UI Specialist crafting beautiful, reliable interfaces. From design vision to robust, scalable, clean code that solves real problems.",
  keywords: ["Frontend Engineer", "UI Developer", "React", "Next.js", "TypeScript", "Santiago Requelme", "Portfolio", "Web Developer", "Frontend Developer"],
  authors: [{ name: "Santiago Requelme", url: "https://santiagorequelme.dev" }],
  creator: "Santiago Requelme",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_ES",
    url: "https://santiagorequelme.dev",
    siteName: "Santiago Requelme Portfolio",
    title: "Santiago Requelme - Frontend Engineer & UI Specialist",
    description: "Frontend Engineer & UI Specialist crafting beautiful, reliable interfaces.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Santiago Requelme Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Santiago Requelme - Frontend Engineer & UI Specialist",
    description: "Frontend Engineer & UI Specialist crafting beautiful, reliable interfaces.",
    images: ["/og-image.png"],
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
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

const themeScript = `
  (function() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
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
      </head>
      <body className={`${inter.variable} ${syne.variable} ${geistMono.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        <LanguageProvider>
          {children}
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
