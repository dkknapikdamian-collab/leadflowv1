import type { PropsWithChildren, ReactNode } from "react"

export function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: PropsWithChildren<{ title: string; subtitle: string; footer?: ReactNode }>) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 480,
          border: "1px solid var(--border)",
          borderRadius: 24,
          background: "var(--card)",
          padding: 24,
          boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
        }}
      >
        <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
          <div style={{ fontSize: 26, fontWeight: 800 }}>LeadFlow</div>
          <h1 style={{ margin: 0, fontSize: 28 }}>{title}</h1>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5 }}>{subtitle}</p>
        </div>

        <div style={{ display: "grid", gap: 14 }}>{children}</div>

        {footer ? <div style={{ marginTop: 18 }}>{footer}</div> : null}
      </section>
    </main>
  )
}
