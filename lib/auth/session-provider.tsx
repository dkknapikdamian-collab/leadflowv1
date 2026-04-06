"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react"
import type { AuthSession } from "@/lib/auth/session"

type SessionResponse = {
  session: AuthSession | null
}

interface AuthSessionContextValue {
  session: AuthSession | null
  isReady: boolean
  refresh: () => Promise<void>
  clear: () => void
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null)

export function AuthSessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isReady, setIsReady] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      })
      const payload = (await response.json().catch(() => ({ session: null }))) as SessionResponse
      setSession(payload.session ?? null)
    } catch {
      setSession(null)
    } finally {
      setIsReady(true)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      session,
      isReady,
      refresh,
      clear: () => setSession(null),
    }),
    [isReady, refresh, session],
  )

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext)
  if (!context) {
    throw new Error("useAuthSession must be used inside AuthSessionProvider")
  }

  return context
}
