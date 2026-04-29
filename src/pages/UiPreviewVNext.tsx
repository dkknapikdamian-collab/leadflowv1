import React from 'react';

export default function UiPreviewVNext() {
  return (
    <div className="cfv-app-shell">
      <div className="cfv-layout">
        <aside className="cfv-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--cfv-line)' }}>
            <div className="cfv-avatar" style={{ width: 44, height: 44 }}>CF</div>
            <div><div className="cfv-name">CloseFlow</div><div className="cfv-sub">Lead → klient → sprawa</div></div>
          </div>
          <div className="cfv-stack">
            {['Dziś', 'Leady', 'Klienci', 'Sprawy', 'Zadania', 'Kalendarz', 'Szkice AI', 'Ustawienia'].map((item, index) => (
              <button key={item} type="button" className={`cfv-btn ${index === 0 ? 'cfv-btn-soft' : ''}`} style={{ justifyContent: 'flex-start', boxShadow: 'none' }}>{item}</button>
            ))}
          </div>
        </aside>
        <main className="cfv-main">
          <div className="cfv-global-bar">
            <div className="cfv-sub"><span className="cfv-pill cfv-pill-blue">Globalne akcje</span> AI i szybkie akcje zawsze w tym samym miejscu.</div>
            <div className="cfv-actions"><button type="button" className="cfv-btn cfv-btn-soft">✦ Zapytaj AI</button><button type="button" className="cfv-btn">Szybki szkic</button><button type="button" className="cfv-btn cfv-btn-primary">+ Lead</button></div>
          </div>
          <div className="cfv-page-head">
            <div><span className="cfv-kicker">Preview w formacie repo</span><h1 className="cfv-title">CloseFlow VNext UI</h1><p className="cfv-lead">Układ z HTML-a pokazany jako React/TSX + CSS, czyli w formacie prostszym do przeniesienia do aplikacji.</p></div>
            <div className="cfv-actions"><button type="button" className="cfv-btn cfv-btn-soft">✦ Zapytaj AI</button><button type="button" className="cfv-btn cfv-btn-primary">+ Lead</button></div>
          </div>
          <div className="cfv-grid-5">
            <div className="cfv-metric"><label>Wszystkie</label><strong>9</strong><div className="hint">pełna baza</div></div>
            <div className="cfv-metric cfv-metric-active"><label>Aktywne</label><strong>2</strong><div className="hint">do prowadzenia</div></div>
            <div className="cfv-metric"><label>Wartość</label><strong>37 488</strong><div className="hint">PLN w lejku</div></div>
            <div className="cfv-metric"><label>Zagrożone</label><strong style={{ color: 'var(--cfv-red)' }}>1</strong><div className="hint">ryzyko utraty</div></div>
            <div className="cfv-metric"><label>Historia</label><strong style={{ color: 'var(--cfv-green)' }}>7</strong><div className="hint">w obsłudze</div></div>
          </div>
          <div className="cfv-layout-list">
            <div className="cfv-stack">
              <div className="cfv-search"><span>⌕</span><input placeholder="Szukaj: nazwa, telefon, e-mail, firma, źródło albo sprawa..." /></div>
              <div className="cfv-card">
                {[
                  ['Pytał o gnojnik', 'Inne · 791785879 · ms.ikora952@gmail.com', '1 PLN', 'Brak działań'],
                  ['Alfred Panek', 'Telefon · 00 1 813-812-7000 · alpol2@ymail.pl', '20 625 PLN', '09.05.2026'],
                  ['Damian Maciejczyk', 'Formularz · kontakt z www', '5 000 PLN', 'Jutro'],
                ].map((row, index) => (
                  <div className="cfv-row" key={row[0]}><div className="cfv-index">{index + 1}</div><div><div className="cfv-name">{row[0]}</div><div className="cfv-sub">{row[1]}</div><div className="cfv-statusline"><span className="cfv-pill cfv-pill-blue">Aktywny</span><span className="cfv-pill">Sprawa</span></div></div><div><div className="cfv-sub">Wartość</div><strong>{row[2]}</strong></div><div><div className="cfv-sub">Najbliższa akcja</div><strong>{row[3]}</strong></div><button type="button" className="cfv-btn">›</button></div>
                ))}
              </div>
            </div>
            <aside className="cfv-right-card"><div className="cfv-name">Najcenniejsze relacje</div><div className="cfv-quick-list" style={{ marginTop: 12 }}><button type="button">Alfred Panek <strong>20 625 PLN</strong></button><button type="button">Damian Maciejczyk <strong>5 000 PLN</strong></button></div></aside>
          </div>
          <div className="cfv-layout-detail" style={{ marginTop: 28 }}>
            <aside className="cfv-card cfv-person-card"><div className="cfv-avatar-line"><div className="cfv-avatar">AP</div><div><h2>Alfred Panek</h2><p>Klient · główna sprawa aktywna</p></div></div><div className="cfv-kv"><div className="cfv-kv-row"><label>Telefon</label><strong>00 1 813-812-7000</strong></div><div className="cfv-kv-row"><label>Email</label><strong>alpol2@ymail.pl</strong></div><div className="cfv-kv-row"><label>Ostatni kontakt</label><strong>28.04.2026</strong></div></div></aside>
            <div className="cfv-stack"><div className="cfv-hero-grid"><div className="cfv-hero"><div><label>Następna akcja</label><h2>09.05.2026</h2><p>Najbliższa akcja: pobrać 3500 dla panka.</p></div><button className="cfv-btn cfv-btn-primary" type="button">Otwórz sprawę</button></div><div className="cfv-hero cfv-hero-light"><label>Kompletność</label><h2>0%</h2><p>Główna sprawa nie ma kompletu elementów.</p></div></div></div>
            <aside className="cfv-right-card"><div className="cfv-name">Szybkie akcje</div><div className="cfv-quick-list" style={{ marginTop: 12 }}><button type="button">Nowy temat <span>+</span></button><button type="button">Eksportuj historię <span>↗</span></button></div></aside>
          </div>
        </main>
      </div>
    </div>
  );
}
