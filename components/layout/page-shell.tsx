import type { ReactNode } from "react"

export function PageShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="single-column-page">
      <div className="hero-row split">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="header-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}
