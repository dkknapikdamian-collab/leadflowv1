import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { Providers } from "@/app/providers"
import "@/app/globals.css"
import "@/app/clientpilot-overrides.css"
import "@/app/variant-b-overrides.css"
import "@/app/variant-b-surfaces.css"
import "@/app/skins-and-mobile-overrides.css"

export const metadata: Metadata = {
  title: "ClientPilot",
  description: "System do domykania i uruchamiania klienta",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
