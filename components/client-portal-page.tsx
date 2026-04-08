"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { isPortalTokenActive, sha256Hex } from "@/lib/client-portal-token"
import { checkSecurityRateLimit } from "@/lib/security/rate-limit"
import { useAppStore } from "@/lib/store"
import { createId, formatDateTime, getItemPrimaryDate, nowIso } from "@/lib/utils"
import { formatFileSize, validateUploadMeta } from "@/lib/storage/upload-policy"
import type { WorkItem } from "@/lib/types"

type PortalActionKind = "file" | "choice" | "approval" | "reply"

function getPortalActionKind(item: WorkItem): PortalActionKind {
  if (item.type === "call" || item.type === "meeting") return "choice"
  if (item.type === "deadline") return "approval"
  if (item.type === "follow_up" || item.type === "reply") return "reply"
  return "file"
}

export function ClientPortalPage({ token }: { token: string }) {
  const {
    snapshot,
    isReady,
    updateItem,
    addFileAttachment,
    addApproval,
    addNotification,
    registerPortalOpened,
    registerPortalTokenFailure,
  } = useAppStore()
  const [tokenHash, setTokenHash] = useState<string>("")
  const [info, setInfo] = useState("")
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({})
  const [selectedOption, setSelectedOption] = useState<Record<string, "A" | "B" | "C">>({})
  const portalOpenedRef = useRef(false)
  const portalFailureMarkedRef = useRef(false)

  useEffect(() => {
    let mounted = true
    void sha256Hex(token).then((hash) => {
      if (!mounted) return
      setTokenHash(hash)
    })
    return () => {
      mounted = false
    }
  }, [token])

  const tokenRecord = useMemo(() => {
    if (!tokenHash) return null
    return snapshot.clientPortalTokens.find((entry) => entry.tokenHash === tokenHash) ?? null
  }, [snapshot.clientPortalTokens, tokenHash])

  const isValidToken = Boolean(tokenRecord && isPortalTokenActive(tokenRecord))
  const lead = useMemo(() => {
    if (!tokenRecord) return null
    return snapshot.leads.find((entry) => entry.caseId === tokenRecord.caseId) ?? null
  }, [snapshot.leads, tokenRecord])

  const items = useMemo(
    () =>
      lead
        ? snapshot.items
            .filter((item) => item.leadId === lead.id)
            .sort((a, b) => getItemPrimaryDate(a).localeCompare(getItemPrimaryDate(b)))
        : [],
    [lead, snapshot.items],
  )

  const attachmentsByItem = useMemo(() => {
    if (!tokenRecord) return new Map<string, typeof snapshot.fileAttachments>()
    const grouped = new Map<string, typeof snapshot.fileAttachments>()
    snapshot.fileAttachments
      .filter((entry) => entry.caseId === tokenRecord.caseId && entry.caseItemId)
      .forEach((entry) => {
        const key = entry.caseItemId as string
        const list = grouped.get(key) ?? []
        list.push(entry)
        grouped.set(key, list)
      })
    return grouped
  }, [snapshot.fileAttachments, tokenRecord])

  const metrics = useMemo(() => {
    const total = Math.max(items.length, 1)
    const done = items.filter((item) => item.status === "done").length
    const waitingReview = items.filter((item) => item.status === "snoozed").length
    const needed = items.filter((item) => item.status !== "done" && item.status !== "snoozed").length
    const completeness = Math.round((done / total) * 100)
    return { done, waitingReview, needed, completeness }
  }, [items])
  const portalReadOnly = !snapshot.billing.canCreate

  useEffect(() => {
    if (!isReady || !tokenHash) return
    if (!tokenRecord) {
      if (!portalFailureMarkedRef.current) {
        registerPortalTokenFailure(tokenHash)
        portalFailureMarkedRef.current = true
      }
      return
    }
    portalFailureMarkedRef.current = false
    if (!isPortalTokenActive(tokenRecord)) return
    if (portalOpenedRef.current) return

    const limiter = checkSecurityRateLimit("public-portal-open", tokenHash)
    if (!limiter.ok) {
      setInfo(`Za duzo prob otwarcia panelu. Sprobuj ponownie za okolo ${limiter.retryAfterSeconds}s.`)
      registerPortalTokenFailure(tokenHash)
      return
    }

    portalOpenedRef.current = true
    registerPortalOpened(tokenRecord.id)
  }, [isReady, registerPortalOpened, registerPortalTokenFailure, tokenHash, tokenRecord])

  function markItem(itemId: string, status: WorkItem["status"]) {
    if (portalReadOnly) return
    updateItem(itemId, { status })
  }

  function logClientActivity(message: string) {
    if (portalReadOnly) return
    if (!lead || !tokenRecord) return
    addNotification({
      userId: "client_portal",
      channel: "in_app",
      kind: "client_portal_activity",
      dedupeKey: `client-activity:${tokenRecord.caseId}:${createId("evt")}`,
      title: "Aktywnosc klienta",
      message,
      relatedLeadId: lead.id,
      relatedCaseId: tokenRecord.caseId,
      recipient: lead.email || "client@example.com",
    })
  }

  function handleUploadFile(item: WorkItem, file: File | null) {
    if (portalReadOnly) {
      setInfo("Panel klienta jest tymczasowo w trybie podgladu. Operator musi odnowic dostep.")
      return
    }
    if (!tokenRecord || !lead || !file) return
    const limiter = checkSecurityRateLimit("public-upload", `${tokenRecord.id}:${item.id}`)
    if (!limiter.ok) {
      setInfo(`Limit uploadu osiagniety. Sprobuj ponownie za okolo ${limiter.retryAfterSeconds}s.`)
      return
    }

    const validation = validateUploadMeta({
      fileName: file.name,
      mimeType: file.type,
      fileSizeBytes: file.size,
    })

    if (!validation.ok || !validation.safeFileName) {
      setInfo(validation.error ?? "Nie mozna dodac pliku.")
      return
    }

    addFileAttachment({
      caseId: tokenRecord.caseId,
      caseItemId: item.id,
      fileName: validation.safeFileName,
      mimeType: file.type,
      fileSizeBytes: file.size,
      uploadedByRole: "client",
      uploadedByLabel: lead.name || "Klient",
    })

    addApproval({
      caseId: tokenRecord.caseId,
      caseItemId: item.id,
      requestedToEmail: lead.email || "klient@example.com",
      status: "responded",
      decision: "submitted",
      actorRole: "client",
      actorLabel: lead.name || "Klient",
      note: `Doslano plik: ${validation.safeFileName}`,
      decidedAt: nowIso(),
    })

    markItem(item.id, "snoozed")
    logClientActivity(`Klient doslal plik: ${validation.safeFileName}.`)
    setInfo(`Plik ${validation.safeFileName} przeslany. Czeka na weryfikacje.`)
  }

  function handleReply(item: WorkItem) {
    if (portalReadOnly) {
      setInfo("Panel klienta jest tymczasowo w trybie podgladu. Operator musi odnowic dostep.")
      return
    }
    if (!tokenRecord || !lead) return
    const limiter = checkSecurityRateLimit("public-acceptance", `${tokenRecord.id}:${item.id}`)
    if (!limiter.ok) {
      setInfo(`Za duzo akcji na tym elemencie. Sprobuj za okolo ${limiter.retryAfterSeconds}s.`)
      return
    }
    const value = replyDraft[item.id]?.trim()
    if (!value) {
      setInfo("Wpisz odpowiedz przed wyslaniem.")
      return
    }

    addApproval({
      caseId: tokenRecord.caseId,
      caseItemId: item.id,
      requestedToEmail: lead.email || "klient@example.com",
      status: "responded",
      decision: "answered",
      actorRole: "client",
      actorLabel: lead.name || "Klient",
      note: value,
      decidedAt: nowIso(),
    })

    markItem(item.id, "snoozed")
    setReplyDraft((current) => ({ ...current, [item.id]: "" }))
    logClientActivity("Klient odpowiedzial na prosbe.")
    setInfo("Odpowiedz zapisana. Czeka na weryfikacje.")
  }

  function handleApproval(item: WorkItem, decision: "accepted" | "rejected" | "needs_changes") {
    if (portalReadOnly) {
      setInfo("Panel klienta jest tymczasowo w trybie podgladu. Operator musi odnowic dostep.")
      return
    }
    if (!tokenRecord || !lead) return
    const limiter = checkSecurityRateLimit("public-acceptance", `${tokenRecord.id}:${item.id}`)
    if (!limiter.ok) {
      setInfo(`Za duzo akcji na tym elemencie. Sprobuj za okolo ${limiter.retryAfterSeconds}s.`)
      return
    }

    addApproval({
      caseId: tokenRecord.caseId,
      caseItemId: item.id,
      requestedToEmail: lead.email || "klient@example.com",
      status: "responded",
      decision,
      actorRole: "client",
      actorLabel: lead.name || "Klient",
      note:
        decision === "accepted"
          ? "Klient zaakceptowal."
          : decision === "needs_changes"
            ? "Klient wskazal, ze potrzeba zmian."
            : "Klient odrzucil.",
      decidedAt: nowIso(),
    })

    markItem(item.id, decision === "accepted" ? "done" : "snoozed")
    logClientActivity(`Klient wykonal decyzje: ${decision}.`)
    setInfo("Decyzja zapisana.")
  }

  function handleChoice(item: WorkItem) {
    if (portalReadOnly) {
      setInfo("Panel klienta jest tymczasowo w trybie podgladu. Operator musi odnowic dostep.")
      return
    }
    if (!tokenRecord || !lead) return
    const limiter = checkSecurityRateLimit("public-acceptance", `${tokenRecord.id}:${item.id}`)
    if (!limiter.ok) {
      setInfo(`Za duzo akcji na tym elemencie. Sprobuj za okolo ${limiter.retryAfterSeconds}s.`)
      return
    }
    const option = selectedOption[item.id] ?? "A"

    addApproval({
      caseId: tokenRecord.caseId,
      caseItemId: item.id,
      requestedToEmail: lead.email || "klient@example.com",
      status: "responded",
      decision: option === "A" ? "option_a" : option === "B" ? "option_b" : "option_c",
      optionValue: option,
      actorRole: "client",
      actorLabel: lead.name || "Klient",
      note: `Wybrano opcje ${option}.`,
      decidedAt: nowIso(),
    })

    markItem(item.id, "snoozed")
    logClientActivity(`Klient wybral opcje ${option}.`)
    setInfo(`Opcja ${option} zapisana. Czeka na weryfikacje.`)
  }

  function renderActions(item: WorkItem) {
    if (portalReadOnly) {
      return <span className="badge">Tylko podglad</span>
    }

    const kind = getPortalActionKind(item)

    if (kind === "file") {
      return (
        <label className="primary-button client-file-label">
          Dodaj plik
          <input
            type="file"
            className="client-file-input"
            onChange={(event) => handleUploadFile(item, event.target.files?.[0] ?? null)}
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.docx"
          />
        </label>
      )
    }

    if (kind === "reply") {
      return (
        <div className="client-action-stack">
          <textarea
            className="text-area"
            placeholder="Wpisz odpowiedz"
            value={replyDraft[item.id] ?? ""}
            onChange={(event) => setReplyDraft((current) => ({ ...current, [item.id]: event.target.value }))}
          />
          <button className="primary-button" type="button" onClick={() => handleReply(item)}>
            Odpowiedz
          </button>
        </div>
      )
    }

    if (kind === "choice") {
      return (
        <div className="client-action-stack">
          <div className="client-choice-row">
            {(["A", "B", "C"] as const).map((option) => (
              <button
                key={option}
                className={selectedOption[item.id] === option ? "secondary-button small" : "ghost-button small"}
                type="button"
                onClick={() => setSelectedOption((current) => ({ ...current, [item.id]: option }))}
              >
                {option}
              </button>
            ))}
          </div>
          <button className="primary-button" type="button" onClick={() => handleChoice(item)}>
            Wybierz opcje
          </button>
        </div>
      )
    }

    return (
      <div className="client-action-stack">
        <button className="primary-button" type="button" onClick={() => handleApproval(item, "accepted")}>
          Zaakceptuj
        </button>
        <button className="ghost-button" type="button" onClick={() => handleApproval(item, "needs_changes")}>
          Wymaga zmian
        </button>
        <button className="ghost-button" type="button" onClick={() => handleApproval(item, "rejected")}>
          Odrzuc
        </button>
      </div>
    )
  }

  if (!isReady || !tokenHash) {
    return (
      <main className="client-portal-shell">
        <section className="client-portal-card">Ladowanie panelu klienta...</section>
      </main>
    )
  }

  if (!isValidToken || !lead || !tokenRecord) {
    const inactiveReason = tokenRecord
      ? tokenRecord.revokedAt
        ? "Link zostal odwolany przez operatora."
        : tokenRecord.lockedUntil && Date.parse(tokenRecord.lockedUntil) > Date.now()
          ? "Link zostal tymczasowo zablokowany po zbyt wielu probach."
          : "Link wygasl."
      : "Link jest niepoprawny albo nie istnieje."
    return (
      <main className="client-portal-shell">
        <section className="client-portal-card">
          <h1>Link jest nieaktywny</h1>
          <p>{inactiveReason} Popros o nowy link do sprawy.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="client-portal-shell">
      <section className="client-portal-card">
        <header className="client-portal-header">
          <h1>{lead.company ? `${lead.company} - sprawa` : `${lead.name} - sprawa`}</h1>
          <p>To prosty panel: uzupelnij brakujace elementy i gotowe.</p>
          <div className="client-portal-progress-row">
            <span>Brakuje {metrics.needed} rzeczy do startu</span>
            <strong>{metrics.completeness}% kompletnosci</strong>
          </div>
          {portalReadOnly ? (
            <div className="client-portal-info">
              Link pozostaje aktywny dla istniejacej sprawy do czasu wygasniecia tokenu, ale akcje klienta sa tymczasowo zablokowane.
            </div>
          ) : null}
        </header>

        <div className="client-portal-list">
          {items.length === 0 ? <div className="client-portal-empty">Na ten moment nie ma nic do uzupelnienia.</div> : null}
          {items.map((item) => {
            const lastAttachment = (attachmentsByItem.get(item.id) ?? []).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]

            return (
              <article key={item.id} className="client-portal-row">
                <div>
                  <div className="client-portal-title">{item.title}</div>
                  <div className="client-portal-desc">{item.description || "Bez dodatkowego opisu"}</div>
                  <div className="client-portal-meta">
                    <span>Wymagane: {item.priority === "high" ? "tak" : "opcjonalne"}</span>
                    <span>Termin: {formatDateTime(getItemPrimaryDate(item), { timeZone: snapshot.settings.timezone })}</span>
                    {lastAttachment ? (
                      <span>
                        Ostatni plik: {lastAttachment.fileName} ({formatFileSize(lastAttachment.fileSizeBytes)})
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="client-portal-action">{item.status === "done" ? <span className="badge">Gotowe</span> : renderActions(item)}</div>
              </article>
            )
          })}
        </div>

        <footer className="client-portal-footer">
          <div>Juz gotowe: {metrics.done}</div>
          <div>Czeka na weryfikacje: {metrics.waitingReview}</div>
          <div>Potrzebujemy od Ciebie: {metrics.needed}</div>
        </footer>

        {info ? <div className="client-portal-info">{info}</div> : null}
      </section>
    </main>
  )
}
