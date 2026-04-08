import type { PropsWithChildren, ReactNode } from "react"

export function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: PropsWithChildren<{ title: string; subtitle: string; footer?: ReactNode }>) {
  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">
            <span className="auth-brand-mark">•</span>
            <span>ClientPilot</span>
          </div>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </div>

        <div className="auth-stack">{children}</div>

        {footer ? <div className="auth-footer">{footer}</div> : null}
      </section>
    </main>
  )
}
