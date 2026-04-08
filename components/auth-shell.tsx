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
        <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
          <div style={{ fontSize: 26, fontWeight: 800 }}>LeadFlow</div>
          <h1 style={{ margin: 0, fontSize: 28 }}>{title}</h1>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5 }}>{subtitle}</p>
        </div>

        <div className="auth-form">{children}</div>

        {footer ? <div style={{ marginTop: 18 }}>{footer}</div> : null}
      </section>
    </main>
  )
}
