"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  PRIMARY_ADMIN_EMAIL,
  isPrimaryAdminEmail,
  normalizeEmail,
  type AccessDiagnosticsPayload,
} from "@/lib/access/diagnostics"
import { useAuthSession } from "@/lib/auth/session-provider"
import { postJson } from "@/lib/supabase/browser"

function DiagnosticRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ color: "var(--muted)", fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, textAlign: "right", wordBreak: "break-word" }}>{value}</div>
    </div>
  )
}

function DiagnosticSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 16,
        background: "var(--card)",
        padding: 16,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{title}</div>
      <div>{children}</div>
    </div>
  )
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—"
  if (typeof value === "boolean") return value ? "true" : "false"
  return String(value)
}

export function AdminAccessDiagnostics() {
  const { session } = useAuthSession()
  const sessionEmail = normalizeEmail(session?.user.email)
  const isAdmin = isPrimaryAdminEmail(sessionEmail)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRepairing, setIsRepairing] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<(AccessDiagnosticsPayload & { repaired?: boolean; repairedWorkspaceId?: string | null }) | null>(null)

  useEffect(() => {
    if (!email && sessionEmail) {
      setEmail(sessionEmail)
    }
  }, [email, sessionEmail])

  const normalizedTargetEmail = useMemo(() => normalizeEmail(email), [email])

  if (!isAdmin) {
    return null
  }

  async function handleCheck() {
    if (!normalizedTargetEmail) {
      setError("Wpisz adres e-mail do diagnozy.")
      setResult(null)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/access-diagnostics?email=${encodeURIComponent(normalizedTargetEmail)}`, {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      })

      const payload = (await response.json().catch(() => ({}))) as AccessDiagnosticsPayload & { error?: string }

      if (!response.ok) {
        setError(payload.error || "Nie udało się pobrać diagnostyki.")
        setResult(null)
        return
      }

      setResult(payload)
    } catch {
      setError("Nie udało się połączyć z diagnostyką dostępu.")
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRepair() {
    if (!normalizedTargetEmail) {
      setError("Wpisz adres e-mail do naprawy.")
      return
    }

    setIsRepairing(true)
    setError("")

    const repairResult = await postJson<AccessDiagnosticsPayload & { repaired?: boolean; repairedWorkspaceId?: string | null }>(
      "/api/admin/access-repair",
      { email: normalizedTargetEmail },
    )

    if (!repairResult.ok) {
      setError((repairResult.data as { error?: string }).error || "Nie udało się naprawić core state.")
      setResult(null)
      setIsRepairing(false)
      return
    }

    setResult(repairResult.data)
    setIsRepairing(false)
  }

  return (
    <section className="panel-card large-card" style={{ marginTop: 16 }}>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Diagnostyka dostępu</div>
      <div style={{ color: "var(--muted)", lineHeight: 1.6, marginBottom: 12 }}>
        Panel widoczny tylko dla głównego admina. Sprawdza stan dostępu dla wskazanego maila i pozwala odpalić repair core state bez wchodzenia do SQL.
      </div>

      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        <input
          className="text-input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="np. user@example.com"
        />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="ghost-button" onClick={handleCheck} disabled={isLoading}>
            {isLoading ? "Sprawdzam..." : "Sprawdź"}
          </button>
          <button type="button" className="primary-button" onClick={handleRepair} disabled={isRepairing}>
            {isRepairing ? "Naprawiam..." : "Napraw core state"}
          </button>
        </div>
      </div>

      <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
        Główny admin: {PRIMARY_ADMIN_EMAIL}
      </div>

      {error ? <div style={{ color: "#f87171", marginBottom: 12 }}>{error}</div> : null}

      {result ? (
        <div style={{ display: "grid", gap: 16 }}>
          <DiagnosticSection title="Sesja">
            <DiagnosticRow label="Session user id" value={formatValue(result.sessionUserId)} />
            <DiagnosticRow label="Session email" value={formatValue(result.sessionEmail)} />
            <DiagnosticRow label="Target email" value={formatValue(result.targetEmail)} />
            <DiagnosticRow label="Email verified" value={formatValue(result.isEmailVerified)} />
            <DiagnosticRow label="Diagnostic timestamp" value={formatValue(result.diagnosticTimestamp)} />
          </DiagnosticSection>

          <DiagnosticSection title="Rekord dostępu">
            <DiagnosticRow label="User found" value={formatValue(result.userFound)} />
            <DiagnosticRow label="Profile found" value={formatValue(result.profileFound)} />
            <DiagnosticRow label="Access status found" value={formatValue(result.accessStatusFound)} />
            <DiagnosticRow label="Subject user id" value={formatValue(result.subjectUserId)} />
            <DiagnosticRow label="Access status" value={formatValue(result.accessStatus)} />
            <DiagnosticRow label="Trial start" value={formatValue(result.trialStart)} />
            <DiagnosticRow label="Trial end" value={formatValue(result.trialEnd)} />
            <DiagnosticRow label="Paid until" value={formatValue(result.paidUntil)} />
            <DiagnosticRow label="Grace period end" value={formatValue(result.gracePeriodEnd)} />
          </DiagnosticSection>

          <DiagnosticSection title="Override">
            <DiagnosticRow label="Is admin email" value={formatValue(result.isAdminEmail)} />
            <DiagnosticRow label="Override mode" value={formatValue(result.accessOverrideMode)} />
            <DiagnosticRow label="Override expires at" value={formatValue(result.accessOverrideExpiresAt)} />
            <DiagnosticRow label="Override active" value={formatValue(result.isOverrideActive)} />
            <DiagnosticRow label="Override note" value={formatValue(result.accessOverrideNote)} />
          </DiagnosticSection>

          <DiagnosticSection title="Decyzja końcowa">
            <DiagnosticRow label="canUseApp" value={formatValue(result.resolvedCanUseApp)} />
            <DiagnosticRow label="mustSeeBillingWall" value={formatValue(result.resolvedMustSeeBillingWall)} />
            <DiagnosticRow label="mustVerifyEmail" value={formatValue(result.resolvedMustVerifyEmail)} />
            <DiagnosticRow label="reason" value={formatValue(result.resolvedReason)} />
            {typeof result.repaired !== "undefined" ? (
              <>
                <DiagnosticRow label="repair executed" value={formatValue(result.repaired)} />
                <DiagnosticRow label="repair workspace id" value={formatValue(result.repairedWorkspaceId)} />
              </>
            ) : null}
          </DiagnosticSection>
        </div>
      ) : null}
    </section>
  )
}
