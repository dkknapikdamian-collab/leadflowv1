"use client"

import { useEffect, useState } from "react"
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
}

type PortalPayload = {
  case: {
    id: string
    title: string
    message: string
    missingText: string
    completenessPercent: number
  }
  items: PortalItem[]
  summary: {
    done: number
    underReview: number
    waitingForClient: number
  }
  token: {
    expiresAt: string
    revokedAt: string | null
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

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/client-portal/${token}`, { method: "GET", cache: "no-store" })
      .then(async (response) => {
        const json = (await response.json().catch(() => null)) as { error?: string } | PortalPayload | null
        if (!response.ok) {
          setError((json as { error?: string } | null)?.error || "Nie udało się załadować panelu.")
          setData(null)
          return
        }
        setData(json as PortalPayload)
      })
      .catch(() => {
        setError("Nie udało się połączyć z panelem.")
      })
      .finally(() => setIsLoading(false))
  }, [token])

  async function runAction(item: PortalItem, body: Record<string, unknown>) {
    setBusyItemId(item.id)
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
      setError(json?.error || "Nie udało się zapisać akcji.")
      setBusyItemId(null)
      return
    }
    setData(json?.payload ?? null)
    setBusyItemId(null)
  }

  if (isLoading) {
    return <div className="client-portal-shell">Ładuję panel klienta...</div>
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
          <strong>{data.case.completenessPercent}% kompletności</strong>
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
                  <button
                    className="primary-button"
                    type="button"
                    disabled={!fileDrafts[item.id] || busyItemId === item.id}
                    onClick={() =>
                      runAction(item, {
                        action: "upload_file",
                        fileName: fileDrafts[item.id]?.name,
                        fileType: fileDrafts[item.id]?.type,
                        fileSizeBytes: fileDrafts[item.id]?.size,
                      })
                    }
                  >
                    {item.actionLabel}
                  </button>
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
                    disabled={busyItemId === item.id}
                    onClick={() => runAction(item, { action: "choose_option", option: decisionDrafts[item.id] ?? "Opcja A" })}
                  >
                    {item.actionLabel}
                  </button>
                </>
              ) : null}

              {item.kind === "approval" ? (
                <button
                  className="primary-button"
                  type="button"
                  disabled={busyItemId === item.id}
                  onClick={() => runAction(item, { action: "accept" })}
                >
                  {item.actionLabel}
                </button>
              ) : null}

              {item.kind === "response" ? (
                <>
                  <textarea
                    className="text-area"
                    placeholder="Twoja odpowiedź..."
                    value={responseDrafts[item.id] ?? ""}
                    onChange={(event) => setResponseDrafts((current) => ({ ...current, [item.id]: event.target.value }))}
                  />
                  <button
                    className="primary-button"
                    type="button"
                    disabled={busyItemId === item.id || !(responseDrafts[item.id] ?? "").trim()}
                    onClick={() => runAction(item, { action: "reply", responseText: responseDrafts[item.id] ?? "" })}
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
        <div className="info-card"><strong>Już gotowe</strong><div>{data.summary.done}</div></div>
        <div className="info-card"><strong>Czeka na weryfikację</strong><div>{data.summary.underReview}</div></div>
        <div className="info-card"><strong>Potrzebujemy od Ciebie</strong><div>{data.summary.waitingForClient}</div></div>
      </section>
    </main>
  )
}
