import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Providers } from "@/app/providers"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "LeadFlow",
  description: "Lead follow-up + kalendarz + przypomnienia",
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
