"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useAuthSession } from "@/lib/auth/session-provider"
import { postJson } from "@/lib/supabase/browser"
import {
  canChangeLocalPassword,
  getAccountProviderLabel,
  getLocalPasswordLabel,
  getPasswordChangeUnavailableMessage,
  validateAccountEmailChange,
  validateNewPassword,
} from "@/lib/account/account-settings"

type AccountMutationState = {
  isSubmitting: boolean
  error: string | null
  success: string | null
}

function createIdleState(): AccountMutationState {
  return {
    isSubmitting: false,
    error: null,
    success: null,
  }
}

function InlineMessage({ error, success }: { error: string | null; success: string | null }) {
  if (error) {
    return <div className="danger-text">{error}</div>
  }

  if (success) {
    return <div className="muted-small">{success}</div>
  }

  return null
}

export function AccountSettingsPanel() {
  const { session, refresh } = useAuthSession()
  const user = session?.user ?? null

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pendingEmail, setPendingEmail] = useState("")
  const [passwordState, setPasswordState] = useState<AccountMutationState>(createIdleState)
  const [emailState, setEmailState] = useState<AccountMutationState>(createIdleState)

  useEffect(() => {
    setPendingEmail("")
  }, [user?.email, user?.emailChangePending])

  if (!user) {
    return null
  }

  const providerLabel = getAccountProviderLabel(user.provider)
  const localPasswordLabel = getLocalPasswordLabel(user.hasPassword)
  const emailStatusLabel = user.emailVerified ? "Potwierdzony" : "Niepotwierdzony"
  const canChangePassword = canChangeLocalPassword(user)
  const passwordUnavailableMessage = getPasswordChangeUnavailableMessage(user)

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = validateNewPassword(password, confirmPassword)
    if (validationError) {
      setPasswordState({
        isSubmitting: false,
        error: validationError,
        success: null,
      })
      return
    }

    setPasswordState({
      isSubmitting: true,
      error: null,
      success: null,
    })

    const result = await postJson<{ message?: string; error?: string }>("/api/auth/update-password", {
      password,
      confirmPassword,
    })

    if (!result.ok) {
      setPasswordState({
        isSubmitting: false,
        error: result.data.error ?? "Nie udało się zmienić hasła.",
        success: null,
      })
      return
    }

    setPassword("")
    setConfirmPassword("")
    setPasswordState({
      isSubmitting: false,
      error: null,
      success: result.data.message ?? "Hasło zostało zmienione.",
    })
    await refresh()
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = validateAccountEmailChange(pendingEmail, user.email)
    if (validationError) {
      setEmailState({
        isSubmitting: false,
        error: validationError,
        success: null,
      })
      return
    }

    setEmailState({
      isSubmitting: true,
      error: null,
      success: null,
    })

    const result = await postJson<{ message?: string; error?: string }>("/api/auth/request-email-change", {
      email: pendingEmail,
    })

    if (!result.ok) {
      setEmailState({
        isSubmitting: false,
        error: result.data.error ?? "Nie udało się rozpocząć zmiany e-maila.",
        success: null,
      })
      return
    }

    setPendingEmail("")
    setEmailState({
      isSubmitting: false,
      error: null,
      success: result.data.message ?? "Wysłaliśmy potwierdzenie zmiany e-maila.",
    })
    await refresh()
  }

  return (
    <section className="single-column-page">
      <div className="panel-card large-card">
        <div className="toolbar-row wrap">
          <div>
            <h2 className="page-title">Konto</h2>
            <p className="page-subtitle">Dane konta, bezpieczeństwo i zmiana adresu e-mail.</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-row">
            <strong>Aktualny e-mail</strong>
            <span>{user.email ?? "—"}</span>
          </div>
          <div className="info-row">
            <strong>Display name</strong>
            <span>{user.displayName || "—"}</span>
          </div>
          <div className="info-row">
            <strong>Provider logowania</strong>
            <span>{providerLabel}</span>
          </div>
          <div className="info-row">
            <strong>Status e-maila</strong>
            <span>{emailStatusLabel}</span>
          </div>
          <div className="info-row">
            <strong>Hasło lokalne</strong>
            <span>{localPasswordLabel}</span>
          </div>
          <div className="info-row">
            <strong>Zmiana e-maila</strong>
            <span>{user.emailChangePending ? `Czekamy na potwierdzenie: ${user.emailChangePending}` : "Brak oczekującej zmiany"}</span>
          </div>
        </div>
      </div>

      <div className="panel-card settings-grid">
        <div className="field-block full-span">
          <strong>Zmień hasło</strong>
          <div className="muted-small">Działa dla kont z lokalnym hasłem. Dla kont Google sekcja pokazuje uczciwy stan bez martwego przycisku.</div>
        </div>

        {canChangePassword ? (
          <form className="full-span" onSubmit={handlePasswordSubmit}>
            <div className="settings-grid">
              <label className="field-block">
                <span>Nowe hasło</span>
                <input
                  className="text-input"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              <label className="field-block">
                <span>Powtórz nowe hasło</span>
                <input
                  className="text-input"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>
              <div className="field-block full-span">
                <InlineMessage error={passwordState.error} success={passwordState.success} />
              </div>
              <div className="field-block full-span">
                <button className="primary-button" type="submit" disabled={passwordState.isSubmitting}>
                  {passwordState.isSubmitting ? "Zapisywanie..." : "Zmień hasło"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="field-block full-span">
            <div className="muted-small">{passwordUnavailableMessage}</div>
          </div>
        )}
      </div>

      <div className="panel-card settings-grid">
        <form className="full-span" onSubmit={handleEmailSubmit}>
          <div className="field-block full-span">
            <strong>Zmień e-mail</strong>
            <div className="muted-small">Po wysłaniu wniosku aplikacja pokaże stan oczekujący na potwierdzenie nowego adresu.</div>
          </div>
          <label className="field-block full-span">
            <span>Nowy e-mail</span>
            <input
              className="text-input"
              type="email"
              autoComplete="email"
              value={pendingEmail}
              onChange={(event) => setPendingEmail(event.target.value)}
            />
          </label>
          <div className="field-block full-span">
            <InlineMessage error={emailState.error} success={emailState.success} />
          </div>
          <div className="field-block full-span">
            <button className="primary-button" type="submit" disabled={emailState.isSubmitting}>
              {emailState.isSubmitting ? "Wysyłanie..." : "Rozpocznij zmianę e-maila"}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
