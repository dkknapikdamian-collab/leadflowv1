"use client"

export function CasesPageView() {
  return (
    <section className="single-column-page">
      <div className="hero-row">
        <div>
          <h1 className="page-title">Sprawy</h1>
          <p className="page-subtitle">
            Moduł po sprzedaży. Tutaj w przyszłych etapach będą checklisty, blokery, kompletność i status uruchomienia klienta.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="muted-small uppercase">Aktywne sprawy</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="muted-small uppercase">Gotowe do startu</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="muted-small uppercase">Zablokowane</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="muted-small uppercase">Czekają na klienta</div>
          <div className="stat-value">0</div>
        </div>
      </div>

      <div className="panel-card large-card">
        <div className="toolbar-row wrap">
          <input className="text-input" placeholder="Szukaj po nazwie sprawy, kliencie albo statusie" disabled />
          <select className="select-input" defaultValue="all" disabled>
            <option value="all">Wszystkie statusy</option>
            <option value="intake">Intake</option>
            <option value="waiting_client">Czekamy na klienta</option>
            <option value="ready">Gotowe do startu</option>
            <option value="blocked">Zablokowane</option>
          </select>
        </div>

        <div className="empty-box">
          Ten ekran jest już gotowy wizualnie pod nową architekturę produktu. W kolejnych etapach podepniemy tu model spraw,
          checklisty kompletności, blokery i przejście lead → sprawa.
        </div>
      </div>
    </section>
  )
}
