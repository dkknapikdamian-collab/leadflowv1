import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Providers } from "@/app/providers"
import "@/app/globals.css"
import "@/app/clientpilot-overrides.css"

export const metadata: Metadata = {
  title: "ClientPilot",
  description: "System do domykania i uruchamiania klienta",
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


