"use client"

import { useEffect, useId } from "react"

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Usuń",
  cancelLabel = "Anuluj",
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const descriptionId = useId()

  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        onCancel()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="modal-card modal-card-compact"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onCancel} type="button">
            ×
          </button>
        </div>
        <div className="confirm-dialog-body">
          <p id={descriptionId} className="confirm-dialog-description">
            {description}
          </p>
          <div className="confirm-dialog-actions">
            <button type="button" className="ghost-button" onClick={onCancel}>
              {cancelLabel}
            </button>
            <button type="button" className="danger-button" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
