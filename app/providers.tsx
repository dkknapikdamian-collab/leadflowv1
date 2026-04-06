"use client"

import { type PropsWithChildren } from "react"
import { AppStoreProvider } from "@/lib/store"

export function Providers({ children }: PropsWithChildren) {
  return <AppStoreProvider>{children}</AppStoreProvider>
}
