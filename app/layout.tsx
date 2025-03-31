import type React from "react"
import type { Metadata } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ReduxProvider from "@/lib/redux/provider"
import Header from "@/components/layout/header"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "CryptoWeather Nexus",
  description: "Dashboard combining weather data, cryptocurrency information, and real-time notifications",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ReduxProvider>
            <div className="relative min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 container mx-auto py-6 px-4 md:px-6 lg:px-8">{children}</main>
            </div>
            <Toaster
              position="bottom-right"
              expand={false}
              richColors
              closeButton
              theme="system"
              toastOptions={{
                duration: 5000,
                classNames: {
                  toast: "sonner-toast-custom",
                  title: "sonner-title-custom",
                  description: "sonner-description-custom",
                  actionButton: "sonner-action-button",
                  cancelButton: "sonner-cancel-button",
                  closeButton: "sonner-close-button",
                },
              }}
            />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'