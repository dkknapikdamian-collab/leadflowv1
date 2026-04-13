"use client"

import { type PropsWithChildren } from "react"
import { AuthSessionProvider } from "@/lib/auth/session-provider"
import { AppStoreProvider } from "@/lib/store"
import { UiShellEffects } from "@/components/ui-shell-effects"

export function Providers({ children }: PropsWithChildren) {
  return (
    <AuthSessionProvider>
      <AppStoreProvider>
        <UiShellEffects />
        {children}
      </AppStoreProvider>
    </AuthSessionProvider>
  )
}
