"use client"

export function CasesPageView() {
  const stats = {
    total: 0,
    waiting: 0,
    blocked: 0,
    ready: 0,
  }

  return (
    <section className="single-column-page">
      <div className="hero-row">
        <div>
          <h1 className="page-title">Sprawy</h1>
          <p className="page-subtitle">Zarządzaj realizacją, kompletnością materiałów i gotowością do startu.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="muted-small uppercase">Wszystkie</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="muted-small uppercase">Czekają</div>
          <div className="stat-value" style={{ color: "#d97706" }}>{stats.waiting}</div>
        </div>
        <div className="stat-card">
          <div className="muted-small uppercase">Zablokowane</div>
          <div className="stat-value" style={{ color: "#dc2626" }}>{stats.blocked}</div>
        </div>
        <div className="stat-card">
          <div className="muted-small uppercase">Gotowe do startu</div>
          <div className="stat-value" style={{ color: "#16a34a" }}>{stats.ready}</div>
        </div>
      </div>

      <div className="panel-card large-card">
        <div className="toolbar-row wrap">
          <input className="text-input" placeholder="Szukaj sprawy lub klienta..." disabled />
          <button className="ghost-button" type="button" disabled>
            Filtruj
          </button>
        </div>

        <div className="empty-box">
          Sprawy pojawią się tutaj po przejściu leada do etapu operacyjnego. Ten ekran jest już zablokowany wizualnie pod Fortecę.
        </div>
      </div>
    </section>
  )
}
