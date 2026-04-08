import type { PropsWithChildren, ReactNode } from "react"

export function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: PropsWithChildren<{ title: string; subtitle: string; footer?: ReactNode }>) {
  return (
    <main className="auth-main">
      <section className="auth-card">
        <header className="auth-header">
          <div className="auth-brand">ClientPilot</div>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </header>

        <div className="auth-body">{children}</div>

        {footer ? <footer className="auth-footer">{footer}</footer> : null}
      </section>
    </main>
  )
}
