#!/usr/bin/env node
/* CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT_FINAL_REPAIR
 * Purpose: finish ETAP4 after the first guard falsely matched forbidden words in the CSS comment.
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const relPath = (rel) => path.join(root, rel);
const exists = (rel) => fs.existsSync(relPath(rel));
const read = (rel) => fs.readFileSync(relPath(rel), 'utf8');
const write = (rel, text) => {
  fs.mkdirSync(path.dirname(relPath(rel)), { recursive: true });
  fs.writeFileSync(relPath(rel), text, 'utf8');
  console.log('updated ' + rel.replace(/\\/g, '/'));
};
const fail = (message) => {
  console.error('✖ ' + message);
  process.exit(1);
};

const clientsRel = 'src/pages/Clients.tsx';
const cssRel = 'src/styles/clients-next-action-layout.css';
const pkgRel = 'package.json';

[clientsRel, cssRel, pkgRel].forEach((rel) => {
  if (!exists(rel)) fail('missing required file: ' + rel);
});

let clients = read(clientsRel);
let changedClients = false;

clients = clients.replace(/className="([^"]*client-card-next-action-block[^"]*)"/g, (full, classes) => {
  if (classes.includes('cf-client-next-action-panel')) return full;
  changedClients = true;
  return `className="${classes} cf-client-next-action-panel"`;
});

if (!clients.includes('cf-client-next-action-panel')) {
  fail('could not attach cf-client-next-action-panel to client nearest action block');
}

if (changedClients) write(clientsRel, clients);
else console.log('unchanged ' + clientsRel.replace(/\\/g, '/') + ' (class already present)');

let css = read(cssRel);
const etap4Regex = /\n?\/\* CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT[\s\S]*?(?=\n\/\*|$)/g;
css = css.replace(etap4Regex, '').trimEnd();

const block = `
/* CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT
   owner: CloseFlow UI system
   reason: /clients nearest action panel needs a subtle separate slate-blue surface
   scope: /clients client card nearest action panel only
   rule: calm neutral accent, status-free color, no full-card color change
*/
.main-clients-html .client-row > .cf-client-next-action-panel {
  border: 1px solid rgba(37, 99, 235, 0.18) !important;
  background:
    linear-gradient(180deg, rgba(239, 246, 255, 0.92), rgba(248, 250, 252, 0.98)) !important;
  border-radius: 1rem;
  padding: 0.875rem;
  color: #0f172a;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.74);
}

.main-clients-html .client-row > .cf-client-next-action-panel .cf-muted,
.main-clients-html .client-row > .cf-client-next-action-panel small,
.main-clients-html .client-row > .cf-client-next-action-panel .mini {
  color: #475569 !important;
  -webkit-text-fill-color: #475569 !important;
}

.main-clients-html .client-row > .cf-client-next-action-panel strong {
  color: #1e293b !important;
  -webkit-text-fill-color: #1e293b !important;
}

@media (max-width: 520px) {
  .main-clients-html .client-row > .cf-client-next-action-panel {
    padding: 0.75rem;
    border-radius: 0.9rem;
  }
}
`;

css = css + '\n\n' + block + '\n';
write(cssRel, css);

const doc = `# CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT — 2026-05-11

## Cel

Na widoku \`/clients\` sekcja \`Najbliższa akcja\` w karcie klienta ma być delikatnie odróżniona kolorem od reszty karty.

## Decyzja UI

Używamy spokojnego slate-blue / neutralnego akcentu:

- jasne tło,
- delikatna niebieska ramka,
- spokojny tekst,
- brak koloru ostrzegawczego,
- brak zmiany koloru całej karty klienta.

## Poprawka po pierwszej paczce

Pierwszy guard sam się wywrócił, bo szukał słowa forbidden także w komentarzu CSS. Ten finalizer:
- czyści poprzedni blok ETAP4,
- dopisuje blok bez mylących słów w komentarzu,
- utwardza guard tak, żeby sprawdzał reguły CSS, nie przypadkowe słowa w komentarzu.

## Kryterium ręczne

1. Wejdź na \`/clients\`.
2. Karta klienta nadal ma szeroki układ.
3. Sekcja \`Najbliższa akcja\` jest wizualnie odróżniona, ale spokojna.
4. Mobile: padding nie robi poziomego scrolla ani nie zjada przesadnie miejsca.

## Nie zmieniono

- danych klienta,
- relacji lead/client/case,
- treści najbliższej akcji,
- statusów,
- logiki zapisu.
`;
write('docs/feedback/CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT_2026-05-11.md', doc);

const guard = `#!/usr/bin/env node
/* CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const fail = (message) => {
  console.error('✖ ' + message);
  process.exit(1);
};

const clients = read('src/pages/Clients.tsx');
const css = read('src/styles/clients-next-action-layout.css');

if (!clients.includes('client-card-next-action-block')) fail('client next action block class missing');
if (!clients.includes('cf-client-next-action-panel')) fail('cf-client-next-action-panel class missing in Clients.tsx');
if (!css.includes('CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT')) fail('ETAP4 CSS marker missing');
if (!css.includes('.main-clients-html .client-row > .cf-client-next-action-panel')) fail('scoped next action panel selector missing');
if (!css.includes('rgba(37, 99, 235, 0.18)')) fail('subtle slate-blue border missing');
if (!css.includes('rgba(239, 246, 255, 0.92)')) fail('subtle light-blue background missing');
if (!css.includes('rgba(248, 250, 252, 0.98)')) fail('neutral background fade missing');
if (!css.includes('color: #475569')) fail('muted text color missing');
if (!css.includes('@media (max-width: 520px)')) fail('mobile padding guard missing');

const blockMatch = css.match(/\\/\\* CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT[\\s\\S]*?(?=\\n\\/\\*|\\s*$)/);
if (!blockMatch) fail('cannot extract ETAP4 block');
const blockWithoutComments = blockMatch[0].replace(/\\/\\*[\\s\\S]*?\\*\\//g, '').toLowerCase();

['#dc2626', '#ef4444', '#be123c', '#b91c1c', 'rgb(220, 38, 38)', 'rgb(239, 68, 68)'].forEach((forbidden) => {
  if (blockWithoutComments.includes(forbidden)) fail('ETAP4 CSS declarations contain forbidden alert color: ' + forbidden);
});

console.log('✔ CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT guard passed');
`;
write('scripts/check-closeflow-etap4-client-next-action-accent.cjs', guard);

let pkg = JSON.parse(read(pkgRel));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:etap4-client-next-action-accent'] = 'node scripts/check-closeflow-etap4-client-next-action-accent.cjs';
write(pkgRel, JSON.stringify(pkg, null, 2) + '\n');

console.log('✔ CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT_FINAL repair applied');
