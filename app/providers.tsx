"use client"

import { type PropsWithChildren } from "react"
import { AuthSessionProvider } from "@/lib/auth/session-provider"
import { AppStoreProvider } from "@/lib/store"

export function Providers({ children }: PropsWithChildren) {
  return (
    <AuthSessionProvider>
      <AppStoreProvider>{children}</AppStoreProvider>
    </AuthSessionProvider>
  )
}
