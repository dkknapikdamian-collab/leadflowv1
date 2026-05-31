const fs = require('fs');
const path = require('path');

const supportPath = path.join(process.cwd(), 'src/pages/SupportCenter.tsx');
const cssPath = path.join(process.cwd(), 'src/styles/visual-stage17-support-vnext.css');

function fail(message) {
  console.error('STAGE180L_APPLY_FAIL:', message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function writeIfChanged(file, next) {
  const current = read(file);
  if (current !== next) fs.writeFileSync(file, next, 'utf8');
}

let support = read(supportPath);
let css = read(cssPath);

// Keep the shell dynamic: admin gets the right panel, normal user gets full width.
support = support.replace(
  /<div className=\"support-shell\">/g,
  `<div className={isAdmin ? 'support-shell support-shell-admin' : 'support-shell'}>`
);

// Remove old right rail remnants if any previous partial stage left them in JSX.
let removedRailBlocks = 0;
support = support.replace(/\n\s*<aside className=\"support-right-rail\"[\s\S]*?\n\s*<\/aside>/g, () => {
  removedRailBlocks += 1;
  return '';
});

// Remove the exact copy that Damian marked as "kasujemy".
const forbiddenCopies = [
  'Lista zgłoszeń z aktualnym statusem, kategorią i możliwością odpowiedzi.',
  'Lista zgłoszeń z aktualnym statusem i możliwością odpowiedzi.',
  'Sugerowane zgłoszenia',
  'Kliknij gotowy typ zgłoszenia albo wpisz własny temat.',
  'Nie trzeba zgadywać kategorii. Kliknij gotowy typ i dopisz szczegóły.',
  'Pomoc operacyjna',
  'Co zgłaszać jako problem?',
  'Co zgłaszać jako sugestię?',
  'Jak opisać dobry błąd?',
  'Błędy zapisu, puste widoki, niedziałające przyciski, rozjazdy wyglądu, błędy w danych i wszystko, co blokuje pracę.',
  'Pomysły na skróty, lepszy układ, automatyzacje, brakujące filtry, czytelniejsze teksty i poprawki procesu.',
  'Podaj widok, kroki, oczekiwany efekt, realny efekt, urządzenie i zrzut ekranu, jeśli masz go pod ręką.',
];
for (const copy of forbiddenCopies) {
  support = support.split(copy).join('');
}

// Remove empty paragraph left after copy cleanup in the section head.
support = support.replace(/\n\s*<p>\s*<\/p>/g, '');

const adminRail = `

          {isAdmin ? (
            <aside className="support-admin-rail" aria-label="Panel obsługi zgłoszeń" data-support-admin-rail="true">
              <section className="support-admin-card">
                <div className="support-admin-title">
                  <ShieldCheck className="h-4 w-4" />
                  <h2>Panel obsługi</h2>
                </div>
                <div className="support-admin-stats">
                  <button type="button" onClick={() => setStatusFilter('new')}>
                    <span>Nowe</span>
                    <strong>{ticketCounts.byStatus.get('new') || 0}</strong>
                  </button>
                  <button type="button" onClick={() => setStatusFilter('in_progress')}>
                    <span>W trakcie</span>
                    <strong>{ticketCounts.byStatus.get('in_progress') || 0}</strong>
                  </button>
                  <button type="button" onClick={() => setStatusFilter('answered')}>
                    <span>Odpowiedziane</span>
                    <strong>{ticketCounts.byStatus.get('answered') || 0}</strong>
                  </button>
                </div>
              </section>

              <section className="support-admin-card">
                <div className="support-admin-title">
                  <Clock3 className="h-4 w-4" />
                  <h2>Ostatnia aktywność</h2>
                </div>
                {tickets[0] ? (
                  <article className="support-admin-latest">
                    <strong>{tickets[0].subject || 'Zgłoszenie'}</strong>
                    <span>{kindLabel(tickets[0].kind)}</span>
                    <small>{formatCreatedAt(tickets[0].updatedAt || tickets[0].createdAt)}</small>
                  </article>
                ) : (
                  <p className="support-admin-empty">Brak zgłoszeń w tym workspace.</p>
                )}
              </section>

              <section className="support-admin-card">
                <div className="support-admin-title">
                  <Archive className="h-4 w-4" />
                  <h2>Szybkie filtry</h2>
                </div>
                <div className="support-admin-filter-list">
                  <button type="button" onClick={() => setStatusFilter('all')}>Wszystkie</button>
                  <button type="button" onClick={() => setStatusFilter('new')}>Nowe</button>
                  <button type="button" onClick={() => setStatusFilter('in_progress')}>W trakcie</button>
                  <button type="button" onClick={() => setStatusFilter('answered')}>Odpowiedziane</button>
                  <button type="button" onClick={() => setStatusFilter('closed')}>Zamknięte</button>
                </div>
              </section>
            </aside>
          ) : null}`;

if (!support.includes('data-support-admin-rail="true"')) {
  const shellClose = '\n        </div>\n      </main>';
  const last = support.lastIndexOf(shellClose);
  if (last === -1) {
    fail('could not find final support-shell close marker');
  }
  support = support.slice(0, last) + adminRail + support.slice(last);
}

// CSS: new admin rail, no old right rail dependency.
css = css.replace(/\.support-shell\s*\{[\s\S]*?\n\}/, `.support-shell {
  max-width: 1480px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
  align-items: start;
}`);

if (!css.includes('.support-shell-admin')) {
  css += `

/* STAGE180L_SUPPORT_ADMIN_RAIL_ANCHORLESS */
.support-shell-admin {
  grid-template-columns: minmax(0, 1fr) 320px;
}

.support-admin-rail {
  display: grid;
  gap: 18px;
  align-self: start;
  min-width: 0;
}

.support-admin-card {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid #e4e7ec;
  border-radius: 28px;
  box-shadow: 0 8px 22px rgba(16, 24, 40, 0.05);
  color: #111827;
  padding: 18px;
  display: grid;
  gap: 14px;
}

.support-admin-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2563eb;
}

.support-admin-title h2 {
  margin: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 850;
  letter-spacing: -0.03em;
}

.support-admin-stats {
  display: grid;
  gap: 8px;
}

.support-admin-stats button,
.support-admin-filter-list button {
  border: 1px solid #e4e7ec;
  border-radius: 16px;
  background: #fff;
  color: #475467;
  min-height: 40px;
  padding: 9px 11px;
  text-align: left;
  font-size: 13px;
  font-weight: 800;
}

.support-admin-stats button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.support-admin-stats button strong {
  min-width: 26px;
  min-height: 26px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  display: grid;
  place-items: center;
  font-size: 12px;
}

.support-admin-filter-list {
  display: grid;
  gap: 8px;
}

.support-admin-stats button:hover,
.support-admin-filter-list button:hover {
  border-color: #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
}

.support-admin-latest {
  border: 1px solid #e4e7ec;
  border-radius: 18px;
  background: #f9fafb;
  padding: 12px;
  display: grid;
  gap: 6px;
}

.support-admin-latest strong {
  color: #111827;
  font-size: 13px;
  line-height: 1.35;
}

.support-admin-latest span,
.support-admin-latest small,
.support-admin-empty {
  color: #667085;
  font-size: 12px;
  line-height: 1.45;
}

.support-admin-empty {
  margin: 0;
}

@media (max-width: 1240px) {
  .support-shell-admin {
    grid-template-columns: 1fr;
  }

  .support-admin-rail {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .support-admin-rail {
    grid-template-columns: 1fr;
  }
}
`;
}

writeIfChanged(supportPath, support);
writeIfChanged(cssPath, css);

console.log('STAGE180L_APPLY_PASS');
console.log(`Removed old support-right-rail blocks in this run: ${removedRailBlocks}`);
