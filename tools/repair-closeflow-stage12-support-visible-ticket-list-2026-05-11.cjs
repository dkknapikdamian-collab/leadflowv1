const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function write(file, value) {
  fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, file), value, 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(ROOT, file));
}

function uniq(list) {
  return Array.from(new Set(list.filter(Boolean)));
}

function findSupportPage() {
  const candidates = ['src/pages/SupportCenter.tsx', 'src/pages/Help.tsx'];
  const existing = candidates.filter(exists);
  if (!existing.length) {
    throw new Error('Stage12: no support page found. Checked src/pages/SupportCenter.tsx and src/pages/Help.tsx');
  }
  const ranked = existing.sort((a, b) => {
    const at = read(a);
    const bt = read(b);
    const as = Number(at.includes('Zgłoszenia i status.')) + Number(at.includes('Szybkie linki')) + Number(at.includes('Status aplikacji')) + Number(at.includes('support-right-rail')) + Number(at.includes('support-right-card'));
    const bs = Number(bt.includes('Zgłoszenia i status.')) + Number(bt.includes('Szybkie linki')) + Number(bt.includes('Status aplikacji')) + Number(bt.includes('support-right-rail')) + Number(bt.includes('support-right-card'));
    return bs - as;
  });
  return ranked[0];
}

function removeSupportRightRail(source) {
  let next = source;

  next = next.replace(/\s*<p>\s*Zgłoszenia i status\.\s*<\/p>/g, '');

  next = next.replace(/\s*<aside\b(?=[^>]*className=(?:"[^"]*support-right-rail[^"]*"|'[^']*support-right-rail[^']*'))[\s\S]*?<\/aside>/g, '');

  next = next.replace(/\s*<section\b(?=[^>]*className=(?:"[^"]*support-right-card[^"]*"|'[^']*support-right-card[^']*'))[\s\S]*?<\/section>/g, (block) => {
    if (block.includes('Szybkie linki') || block.includes('Status aplikacji') || block.includes('Kontakt')) {
      return '';
    }
    return block;
  });

  return next;
}

function collectDeclaredNames(source) {
  const names = [];
  const declaration = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g;
  let match;
  while ((match = declaration.exec(source))) names.push(match[1]);
  const stateDeclaration = /\bconst\s*\[\s*([A-Za-z_$][\w$]*)\s*,/g;
  while ((match = stateDeclaration.exec(source))) names.push(match[1]);
  return uniq(names);
}

function pickTicketSourceExpression(source) {
  const names = collectDeclaredNames(source);
  const preferred = [
    'tickets',
    'supportTickets',
    'supportRequests',
    'requests',
    'userTickets',
    'myTickets',
    'supportItems',
    'submissions',
  ];

  for (const name of preferred) {
    if (names.includes(name)) return name;
  }

  const supportLike = names.find((name) => /(ticket|support|request|zgłosz|zglosz|submission)/i.test(name));
  return supportLike || '[]';
}

function supportHelperBlock() {
  return `
function formatSupportStatus(status: unknown) {
  const value = String(status || '').toLowerCase();
  if (value === 'open' || value === 'new') return 'Nowe';
  if (value === 'in_progress' || value === 'pending') return 'W trakcie';
  if (value === 'answered' || value === 'resolved') return 'Odpowiedziane';
  if (value === 'closed') return 'Zamknięte';
  return 'Status nieznany';
}

function formatSupportTicketDate(value: unknown) {
  if (!value) return 'Brak daty';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function asSupportTicketList(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}
`;
}

function ensureHelpers(source) {
  let next = source;
  if (next.includes('function formatSupportStatus(')) return next;

  const imports = Array.from(next.matchAll(/^import[\s\S]*?;\s*$/gm));
  if (imports.length) {
    const last = imports[imports.length - 1];
    const index = Number(last.index) + last[0].length;
    return next.slice(0, index) + supportHelperBlock() + next.slice(index);
  }

  return supportHelperBlock() + next;
}

function ticketListSection(sourceExpression) {
  return `

        <section className="support-ticket-list-card" data-support-ticket-list="true">
          <header>
            <h2>Moje zgłoszenia</h2>
            <p>Status, odpowiedź i ostatnia aktualizacja.</p>
          </header>

          {asSupportTicketList(${sourceExpression}).length > 0 ? (
            <div className="support-ticket-list">
              {asSupportTicketList(${sourceExpression}).map((ticket: any) => {
                const title = ticket.title || ticket.subject || 'Zgłoszenie';
                const message = ticket.message || ticket.description || ticket.body || '';
                const answer = ticket.answer || ticket.response || ticket.reply || ticket.adminResponse || ticket.lastReply || '';
                const updatedAt = ticket.updatedAt || ticket.updated_at || ticket.createdAt || ticket.created_at;
                return (
                  <article className="support-ticket-row" key={ticket.id || title || updatedAt}>
                    <div className="support-ticket-main">
                      <strong>{title}</strong>
                      {message ? <p>{message}</p> : null}
                    </div>
                    <div className="support-ticket-meta">
                      <span className="support-ticket-status">{formatSupportStatus(ticket.status)}</span>
                      <small>{formatSupportTicketDate(updatedAt)}</small>
                    </div>
                    {answer ? (
                      <div className="support-ticket-answer">
                        <strong>Odpowiedź</strong>
                        <p>{answer}</p>
                      </div>
                    ) : (
                      <p className="support-ticket-no-answer">Brak odpowiedzi.</p>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="support-ticket-empty">
              <strong>Nie masz jeszcze zgłoszeń.</strong>
              <p>Po wysłaniu formularza zgłoszenie pojawi się tutaj ze statusem.</p>
            </div>
          )}
        </section>`;
}

function insertTicketList(source) {
  if (source.includes('data-support-ticket-list="true"')) return source;

  const sourceExpression = pickTicketSourceExpression(source);
  const section = ticketListSection(sourceExpression);

  const formCloseIndex = source.indexOf('</form>');
  if (formCloseIndex !== -1) {
    const insertAt = formCloseIndex + '</form>'.length;
    return source.slice(0, insertAt) + section + source.slice(insertAt);
  }

  const mainCloseIndex = source.lastIndexOf('</main>');
  if (mainCloseIndex !== -1) {
    return source.slice(0, mainCloseIndex) + section + '\n' + source.slice(mainCloseIndex);
  }

  const divCloseIndex = source.lastIndexOf('</div>');
  if (divCloseIndex !== -1) {
    return source.slice(0, divCloseIndex) + section + '\n' + source.slice(divCloseIndex);
  }

  throw new Error('Stage12: could not find a safe JSX insertion point for support ticket list.');
}

function updateSupportPage(file) {
  let source = read(file);
  source = removeSupportRightRail(source);
  source = ensureHelpers(source);
  source = insertTicketList(source);
  write(file, source);
  console.log(`Stage12: updated ${file}`);
}

function findSupportStyleFile() {
  const candidates = ['src/styles/SupportCenter.css'];
  for (const file of candidates) if (exists(file)) return file;

  const stylesRoot = path.join(ROOT, 'src/styles');
  if (fs.existsSync(stylesRoot)) {
    const match = fs.readdirSync(stylesRoot).find((name) => /^support.*\.css$/i.test(name));
    if (match) return `src/styles/${match}`;
  }

  return 'src/styles/SupportCenter.css';
}

function updateSupportStyles() {
  const file = findSupportStyleFile();
  let css = exists(file) ? read(file) : '';
  if (css.includes('.support-ticket-list-card')) {
    console.log(`Stage12: styles already present in ${file}`);
    return;
  }

  css += `

.support-ticket-list-card {
  display: grid;
  gap: 14px;
  border: 1px solid var(--cf-border, rgba(148, 163, 184, 0.18));
  border-radius: var(--cf-radius-xl, 24px);
  background: var(--cf-surface, rgba(15, 23, 42, 0.72));
  padding: clamp(18px, 2vw, 24px);
  box-shadow: var(--cf-shadow-card, 0 18px 44px rgba(2, 6, 23, 0.18));
}

.support-ticket-list-card > header {
  display: grid;
  gap: 4px;
}

.support-ticket-list-card h2 {
  margin: 0;
  font-size: clamp(18px, 2vw, 22px);
  line-height: 1.15;
}

.support-ticket-list-card p {
  margin: 0;
}

.support-ticket-list {
  display: grid;
  gap: 12px;
}

.support-ticket-row,
.support-ticket-empty {
  display: grid;
  gap: 10px;
  border: 1px solid var(--cf-border-soft, rgba(148, 163, 184, 0.14));
  border-radius: var(--cf-radius-lg, 18px);
  background: var(--cf-surface-soft, rgba(15, 23, 42, 0.52));
  padding: 14px;
}

.support-ticket-main {
  display: grid;
  gap: 4px;
}

.support-ticket-main strong,
.support-ticket-empty strong,
.support-ticket-answer strong {
  color: var(--cf-text-strong, #f8fafc);
}

.support-ticket-main p,
.support-ticket-empty p,
.support-ticket-answer p,
.support-ticket-no-answer {
  color: var(--cf-text-muted, #94a3b8);
  font-size: 14px;
  line-height: 1.45;
}

.support-ticket-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.support-ticket-status {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border: 1px solid var(--cf-border, rgba(148, 163, 184, 0.18));
  border-radius: 999px;
  padding: 5px 10px;
  color: var(--cf-text-strong, #f8fafc);
  background: var(--cf-surface-raised, rgba(30, 41, 59, 0.72));
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.support-ticket-answer {
  display: grid;
  gap: 4px;
  border-radius: var(--cf-radius-md, 14px);
  background: var(--cf-surface-raised, rgba(30, 41, 59, 0.58));
  padding: 12px;
}

.support-ticket-no-answer {
  border-radius: var(--cf-radius-md, 14px);
  background: var(--cf-surface-raised, rgba(30, 41, 59, 0.46));
  padding: 12px;
}
`;

  write(file, css);
  console.log(`Stage12: updated ${file}`);
}

function updatePackageJson() {
  const file = 'package.json';
  if (!exists(file)) throw new Error('Stage12: package.json not found');
  const pkg = JSON.parse(read(file));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:support-visible-ticket-list'] = 'node scripts/check-closeflow-support-visible-ticket-list.cjs';
  write(file, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log('Stage12: updated package.json');
}

function main() {
  const page = findSupportPage();
  updateSupportPage(page);
  updateSupportStyles();
  updatePackageJson();
  console.log('Stage12: support visible ticket list cleanup finished.');
}

main();
