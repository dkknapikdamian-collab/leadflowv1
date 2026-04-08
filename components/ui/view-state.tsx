import type { ReactNode } from "react"

export function ViewState({
  kind,
  children,
}: {
  kind: "empty" | "loading" | "error"
  children: ReactNode
}) {
  return <div className={`view-state view-state-${kind}`}>{children}</div>
}
