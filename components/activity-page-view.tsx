"use client"

export function ActivityPageView() {
  return (
    <section className="single-column-page">
      <div className="hero-row">
        <div>
          <h1 className="page-title">Aktywność</h1>
          <p className="page-subtitle">Wspólna oś działań dla sprzedaży, spraw operacyjnych i zmian systemowych.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="muted-small uppercase">Sprzedaż</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="muted-small uppercase">Operacyjne</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="muted-small uppercase">Systemowe</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="muted-small uppercase">Dzisiaj</div>
          <div className="stat-value">0</div>
        </div>
      </div>

      <div className="panel-card large-card">
        <div className="toolbar-row wrap">
          <input className="text-input" placeholder="Filtruj po typie aktywności, leadzie albo sprawie..." disabled />
          <button className="ghost-button" type="button" disabled>
            Filtruj
          </button>
        </div>

        <div className="empty-box">
          Tu pojawi się pełna historia zmian statusów, notatek, follow-upów, przejścia lead → sprawa i działań operacyjnych.
        </div>
      </div>
    </section>
  )
}
