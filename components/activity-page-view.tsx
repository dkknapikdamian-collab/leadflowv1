"use client"

export function ActivityPageView() {
  return (
    <section className="single-column-page">
      <div className="hero-row">
        <div>
          <h1 className="page-title">Aktywność</h1>
          <p className="page-subtitle">
            Wspólna oś działań dla sprzedaży i spraw operacyjnych. Ten ekran jest przygotowany jako część nowego systemu.
          </p>
        </div>
      </div>

      <div className="panel-card large-card">
        <div className="toolbar-row wrap">
          <input className="text-input" placeholder="Filtruj po typie aktywności, leadzie albo sprawie" disabled />
          <select className="select-input" defaultValue="all" disabled>
            <option value="all">Wszystkie typy</option>
            <option value="sales">Sprzedaż</option>
            <option value="operations">Operacyjne</option>
            <option value="system">Systemowe</option>
          </select>
        </div>

        <div className="stack-list">
          <div className="empty-box">
            Tu w kolejnych etapach pojawi się wspólna historia zmian statusu, notatek, follow-upów, zadań, przejścia lead → sprawa
            i aktywności operacyjnych.
          </div>
        </div>
      </div>
    </section>
  )
}
