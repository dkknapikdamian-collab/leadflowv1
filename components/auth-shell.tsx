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
        <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
          <div className="auth-brand">
            <span className="auth-brand-mark">•</span>
            <span>Forteca</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 28 }}>{title}</h1>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{subtitle}</p>
        </div>

        <div className="auth-stack">{children}</div>

        {footer ? <div style={{ marginTop: 18 }}>{footer}</div> : null}
      </section>
    </main>
  )
}
