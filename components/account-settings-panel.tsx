"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useAuthSession } from "@/lib/auth/session-provider"
import { postJson } from "@/lib/supabase/browser"
import {
  canChangeLocalPassword,
  getAccountModeDescription,
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

  const currentUser = user
  const providerLabel = getAccountProviderLabel(currentUser.provider)
  const localPasswordLabel = getLocalPasswordLabel(currentUser.hasPassword)
  const emailStatusLabel = currentUser.emailVerified ? "Tak" : "Nie"
  const canChangePassword = canChangeLocalPassword(currentUser)
  const passwordUnavailableMessage = getPasswordChangeUnavailableMessage(currentUser)
  const accountModeDescription = getAccountModeDescription(currentUser)
  const emailChangeStatusLabel = currentUser.emailChangePending
    ? `Tak, czeka potwierdzenie dla: ${currentUser.emailChangePending}`
    : "Nie"
  const emailChangeBlocked = Boolean(currentUser.emailChangePending)

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
      passwordConfirm: confirmPassword,
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

    const validationError = validateAccountEmailChange(pendingEmail, currentUser.email)
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
            <p className="page-subtitle">Tu widzisz stan logowania, bezpieczeństwo konta i zmianę adresu e-mail.</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-row">
            <strong>Aktualny e-mail</strong>
            <span>{currentUser.email ?? "—"}</span>
          </div>
          <div className="info-row">
            <strong>E-mail potwierdzony</strong>
            <span>{emailStatusLabel}</span>
          </div>
          <div className="info-row">
            <strong>Nazwa użytkownika</strong>
            <span>{currentUser.displayName || "—"}</span>
          </div>
          <div className="info-row">
            <strong>Typ konta</strong>
            <span>{providerLabel}</span>
          </div>
          <div className="info-row">
            <strong>Hasło w aplikacji</strong>
            <span>{localPasswordLabel}</span>
          </div>
          <div className="info-row">
            <strong>Trwa zmiana e-maila</strong>
            <span>{emailChangeStatusLabel}</span>
          </div>
        </div>

        <div className="muted-small" style={{ marginTop: 12 }}>
          {accountModeDescription}
        </div>
      </div>

      <div className="panel-card settings-grid">
        <div className="field-block full-span">
          <strong>Zmień hasło</strong>
          <div className="muted-small">
            Zmiana hasła działa tutaj, bez wychodzenia do osobnego ekranu logowania.
          </div>
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
            <div className="muted-small">
              Zmiana e-maila nie tworzy nowego konta. Po potwierdzeniu nadal jesteś tym samym użytkownikiem.
            </div>
          </div>

          {currentUser.emailChangePending ? (
            <div className="field-block full-span">
              <div className="muted-small">
                Najpierw dokończ trwającą zmianę e-maila albo poczekaj, aż wygaśnie poprzednia próba.
              </div>
            </div>
          ) : null}

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
            <button className="primary-button" type="submit" disabled={emailState.isSubmitting || emailChangeBlocked}>
              {emailState.isSubmitting ? "Wysyłanie..." : "Rozpocznij zmianę e-maila"}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
