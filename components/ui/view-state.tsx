import type { ReactNode } from "react"

type ViewStateTone = "empty" | "loading" | "error"

export function ViewState({
  tone = "empty",
  title,
  description,
  action,
}: {
  tone?: ViewStateTone
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className={`view-state view-state-${tone}`} role={tone === "error" ? "alert" : "status"}>
      <div className="view-state-title">{title}</div>
      {description ? <div className="view-state-description">{description}</div> : null}
      {action ? <div className="view-state-action">{action}</div> : null}
    </div>
  )
}
