"use client"

import { useEffect, useState } from "react"
import { formatFileSize } from "@/lib/storage/upload-policy"
import { formatDateTime } from "@/lib/utils"

type PortalItem = {
  id: string
  title: string
  description: string
  required: boolean
  dueAt: string | null
  status: string
  kind: string
  actionLabel: string
  latestAttachment: {
    id: string
    fileName: string
    fileType: string
    fileSizeBytes: number
    addedAt: string
    addedBy: string
    access: {
      attachmentId: string
      expiresAt: string
      sig: string
    }
  } | null
  latestApproval: {
    id: string
    status: string
    decidedAt: string | null
    decisionNote: string
  } | null
}

type PortalPayload = {
  case: {
    id: string
    title: string
    message: string
    missingText: string
    completenessPercent: number
    status: string
  }
  items: PortalItem[]
  summary: {
    done: number
    underReview: number
    waitingForClient: number
  }
  uploads: {
    maxUploadSizeBytes: number
    allowedMimeTypes: string[]
  }
  token: {
    expiresAt: string
    revokedAt: string | null
  }
  policy: {
    mode: "active" | "read_only" | "disabled"
    allowActions: boolean
    message: string
  }
}

export function ClientPortalView({ token }: { token: string }) {
  const [data, setData] = useState<PortalPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyItemId, setBusyItemId] = useState<string | null>(null)
  const [decisionDrafts, setDecisionDrafts] = useState<Record<string, string>>({})
  const [responseDrafts, setResponseDrafts] = useState<Record<string, string>>({})
  const [fileDrafts, setFileDrafts] = useState<Record<string, File | null>>({})
  const [itemErrors, setItemErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/client-portal/${token}`, { method: "GET", cache: "no-store" })
      .then(async (response) => {
        const json = (await response.json().catch(() => null)) as { error?: string } | PortalPayload | null
        if (!response.ok) {
          setError((json as { error?: string } | null)?.error || "Nie udalo sie zaladowac panelu.")
          setData(null)
          return
        }
        setData(json as PortalPayload)
      })
      .catch(() => {
        setError("Nie udalo sie polaczyc z panelem.")
      })
      .finally(() => setIsLoading(false))
  }, [token])

  async function runAction(item: PortalItem, body: Record<string, unknown>) {
    setBusyItemId(item.id)
    setError(null)
    const response = await fetch(`/api/client-portal/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseItemId: item.id,
        ...body,
      }),
    })

    const json = (await response.json().catch(() => null)) as { error?: string; payload?: PortalPayload } | null
    if (!response.ok) {
      setError(json?.error || "Nie udalo sie zapisac akcji.")
      setBusyItemId(null)
      return
    }
    setData(json?.payload ?? null)
    setBusyItemId(null)
  }

  if (isLoading) {
    return <div className="client-portal-shell">Laduje panel klienta...</div>
  }

  if (error || !data) {
    return <div className="client-portal-shell">{error || "Brak danych panelu."}</div>
  }

  return (
    <main className="client-portal-shell">
      <section className="client-portal-top">
        <h1 className="client-portal-title">{data.case.title}</h1>
        <p className="client-portal-message">{data.case.message}</p>
        <div className="client-portal-progress">
          <span>{data.case.missingText}</span>
          <strong>{data.case.completenessPercent}% kompletnosci</strong>
        </div>
      </section>

      <section className="client-portal-list">
        {data.items.map((item) => (
          <article key={item.id} className="client-portal-row">
            <div className="client-portal-row-main">
              <h2>{item.title}</h2>
              <p>{item.description || "Brak dodatkowego opisu."}</p>
              <div className="client-portal-row-meta">
                <span>{item.required ? "Wymagane" : "Opcjonalne"}</span>
                <span>Termin: {item.dueAt ? formatDateTime(item.dueAt) : "Brak terminu"}</span>
                <span>Status: {item.status}</span>
              </div>
            </div>

            <div className="client-portal-row-action">
              {item.kind === "file" ? (
                <>
                  <input
                    type="file"
                    className="text-input"
                    onChange={(event) =>
                      setFileDrafts((current) => ({ ...current, [item.id]: event.target.files?.[0] ?? null }))
                    }
                  />
                  <div className="muted-small">
                    Limit: {formatFileSize(data.uploads.maxUploadSizeBytes)} | Dozwolone: {data.uploads.allowedMimeTypes.join(", ")}
                  </div>
                  {item.latestAttachment ? (
                    <div className="muted-small">
                      Ostatni plik: <strong>{item.latestAttachment.fileName}</strong> ({item.latestAttachment.fileType}, {formatFileSize(item.latestAttachment.fileSizeBytes)})
                      <br />
                      Dodano: {formatDateTime(item.latestAttachment.addedAt)} przez {item.latestAttachment.addedBy}
                      <br />
                      <a
                        href={`/api/client-portal/${token}/attachments/${item.latestAttachment.id}?expiresAt=${encodeURIComponent(item.latestAttachment.access.expiresAt)}&sig=${encodeURIComponent(item.latestAttachment.access.sig)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Bezpieczny podglad metadanych
                      </a>
                    </div>
                  ) : null}
                  <button
                    className="primary-button"
                    type="button"
                    disabled={!data.policy.allowActions || !fileDrafts[item.id] || busyItemId === item.id}
                    onClick={() => {
                      const selected = fileDrafts[item.id]
                      if (!selected) return

                      if (selected.size > data.uploads.maxUploadSizeBytes) {
                        setItemErrors((current) => ({ ...current, [item.id]: "Plik jest za duzy." }))
                        return
                      }

                      if (!data.uploads.allowedMimeTypes.includes(selected.type)) {
                        setItemErrors((current) => ({ ...current, [item.id]: "Typ pliku nie jest dozwolony." }))
                        return
                      }

                      setItemErrors((current) => ({ ...current, [item.id]: "" }))
                      void runAction(item, {
                        action: "upload_file",
                        fileName: selected.name,
                        fileType: selected.type,
                        fileSizeBytes: selected.size,
                      })
                    }}
                  >
                    {item.actionLabel}
                  </button>
                  {itemErrors[item.id] ? <div className="danger-text">{itemErrors[item.id]}</div> : null}
                </>
              ) : null}

              {item.kind === "decision" || item.kind === "access" ? (
                <>
                  <select
                    className="select-input"
                    value={decisionDrafts[item.id] ?? "Opcja A"}
                    onChange={(event) => setDecisionDrafts((current) => ({ ...current, [item.id]: event.target.value }))}
                  >
                    <option>Opcja A</option>
                    <option>Opcja B</option>
                    <option>Opcja C</option>
                  </select>
                  <button
                    className="primary-button"
                    type="button"
                    disabled={!data.policy.allowActions || busyItemId === item.id}
                    onClick={() => void runAction(item, { action: "choose_option", option: decisionDrafts[item.id] ?? "Opcja A" })}
                  >
                    {item.actionLabel}
                  </button>
                  {item.latestApproval ? (
                    <div className="muted-small">
                      Ostatnia decyzja: {item.latestApproval.decisionNote}
                      {item.latestApproval.decidedAt ? ` | ${formatDateTime(item.latestApproval.decidedAt)}` : ""}
                    </div>
                  ) : null}
                </>
              ) : null}

              {item.kind === "approval" ? (
                <>
                  <button
                    className="primary-button"
                    type="button"
                    disabled={!data.policy.allowActions || busyItemId === item.id}
                    onClick={() => void runAction(item, { action: "approval_decision", decision: "accepted" })}
                  >
                    Zaakceptowano
                  </button>
                  <button
                    className="ghost-button small"
                    type="button"
                    disabled={!data.policy.allowActions || busyItemId === item.id}
                    onClick={() => void runAction(item, { action: "approval_decision", decision: "rejected" })}
                  >
                    Odrzucono
                  </button>
                  <button
                    className="ghost-button small"
                    type="button"
                    disabled={!data.policy.allowActions || busyItemId === item.id}
                    onClick={() => void runAction(item, { action: "approval_decision", decision: "needs_changes" })}
                  >
                    Wymaga zmian
                  </button>
                  {item.latestApproval ? (
                    <div className="muted-small">
                      Ostatnia decyzja: {item.latestApproval.status}
                      {item.latestApproval.decidedAt ? ` | ${formatDateTime(item.latestApproval.decidedAt)}` : ""}
                      {item.latestApproval.decisionNote ? ` | ${item.latestApproval.decisionNote}` : ""}
                    </div>
                  ) : null}
                </>
              ) : null}

              {item.kind === "response" ? (
                <>
                  <textarea
                    className="text-area"
                    placeholder="Twoja odpowiedz..."
                    value={responseDrafts[item.id] ?? ""}
                    onChange={(event) => setResponseDrafts((current) => ({ ...current, [item.id]: event.target.value }))}
                  />
                  <button
                    className="primary-button"
                    type="button"
                    disabled={!data.policy.allowActions || busyItemId === item.id || !(responseDrafts[item.id] ?? "").trim()}
                    onClick={() => void runAction(item, { action: "reply", responseText: responseDrafts[item.id] ?? "" })}
                  >
                    {item.actionLabel}
                  </button>
                </>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <section className="client-portal-bottom">
        {!data.policy.allowActions ? (
          <div className="info-card" style={{ gridColumn: "1 / -1" }}>
            <strong>Polityka dostępu</strong>
            <div>{data.policy.message}</div>
          </div>
        ) : null}
        <div className="info-card"><strong>Juz gotowe</strong><div>{data.summary.done}</div></div>
        <div className="info-card"><strong>Czeka na weryfikacje</strong><div>{data.summary.underReview}</div></div>
        <div className="info-card"><strong>Potrzebujemy od Ciebie</strong><div>{data.summary.waitingForClient}</div></div>
      </section>
    </main>
  )
}
