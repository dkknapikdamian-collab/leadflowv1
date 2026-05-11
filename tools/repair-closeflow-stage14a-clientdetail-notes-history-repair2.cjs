#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const tsxPath = path.join(repo, 'src/pages/ClientDetail.tsx');
const cssCandidates = [
  path.join(repo, 'src/styles/visual-stage12-client-detail-vnext.css'),
  path.join(repo, 'src/styles/ClientDetail.css'),
  path.join(repo, 'src/styles/client-detail.css'),
];
const pkgPath = path.join(repo, 'package.json');
const docPath = path.join(repo, 'docs/release/CLOSEFLOW_STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_2026-05-11.md');

function assertFile(file) {
  if (!fs.existsSync(file)) throw new Error(`Brak wymaganego pliku: ${path.relative(repo, file)}`);
}
function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value, 'utf8'); }
function backup(file, backupDir) {
  if (!fs.existsSync(file)) return;
  const rel = path.relative(repo, file).replace(/[\\/]/g, '__');
  fs.copyFileSync(file, path.join(backupDir, rel));
}
function nowStamp() { return new Date().toISOString().replace(/[:.]/g, '-'); }

assertFile(tsxPath);
assertFile(pkgPath);
const backupDir = path.join(repo, '.closeflow-recovery-backups', `stage14a-repair2-clientdetail-${nowStamp()}`);
fs.mkdirSync(backupDir, { recursive: true });
backup(tsxPath, backupDir);
backup(pkgPath, backupDir);
for (const css of cssCandidates) backup(css, backupDir);

let source = read(tsxPath);
const beforeSource = source;
const notes = [];

function replaceSafe(pattern, replacement, label) {
  const next = source.replace(pattern, replacement);
  if (next !== source) {
    source = next;
    notes.push(label);
    return true;
  }
  return false;
}

function addGuard() {
  if (source.includes('STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD')) return;
  const guard = `\nconst STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD = 'STAGE14A Repair2 removes side add-note quick action and hardens visible notes/history';\nvoid STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD;\n`;
  const anchor = "const STAGE14A_CLIENT_DETAIL_NOTES_HISTORY_GUARD =";
  const idx = source.indexOf(anchor);
  if (idx >= 0) {
    const lineEnd = source.indexOf('\n', source.indexOf('\n', idx) + 1);
    source = source.slice(0, lineEnd + 1) + guard + source.slice(lineEnd + 1);
  } else {
    const importEnd = source.indexOf("import '../styles/visual-stage12-client-detail-vnext.css';");
    if (importEnd >= 0) {
      const lineEnd = source.indexOf('\n', importEnd);
      source = source.slice(0, lineEnd + 1) + guard + source.slice(lineEnd + 1);
    } else {
      source = guard + source;
    }
  }
  notes.push('guard: dodano STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD');
}

function fixTabs() {
  replaceSafe(/type\s+ClientTab\s*=\s*'summary'\s*\|\s*'cases'\s*\|\s*'contact'\s*\|\s*'history'\s*;/, "type ClientTab = 'cases' | 'summary' | 'contact' | 'history';", 'tabs: typ ClientTab zaczyna się od cases');
  replaceSafe(/useState<ClientTab>\(\s*(['"])summary\1\s*\)/g, "useState<ClientTab>('cases')", 'tabs: domyślna zakładka useState ustawiona na cases');
  replaceSafe(/(as\s+ClientTab\s*\)\s*:\s*)(['"])summary\2/g, "$1'cases'", 'tabs: fallback po walidacji URL ustawiony na cases');
  replaceSafe(/(\?\s*nextTab\s*:\s*)(['"])summary\2/g, "$1'cases'", 'tabs: fallback nextTab ustawiony na cases');
  replaceSafe(/(\?\s*tab\s*:\s*)(['"])summary\2/g, "$1'cases'", 'tabs: fallback tab ustawiony na cases');

  // Safe reorder for literal tab arrays: summary object immediately before cases object.
  source = source.replace(/(\[\s*)(\{\s*id:\s*['"]summary['"][\s\S]*?\}\s*,\s*)(\{\s*id:\s*['"]cases['"][\s\S]*?\}\s*,?)/m, (match, start, summary, cases) => {
    notes.push('tabs: przesunięto obiekt cases przed summary w bezpiecznym tab array');
    return `${start}${cases}${cases.endsWith(',') ? '' : ','}\n  ${summary}`;
  });
}

function findSectionAroundMarker(text, markers) {
  for (const marker of markers) {
    const markerIndex = text.indexOf(marker);
    if (markerIndex < 0) continue;
    const sectionStart = text.lastIndexOf('<section', markerIndex);
    const divStart = text.lastIndexOf('<div', markerIndex);
    const start = Math.max(sectionStart, divStart);
    const sectionClose = text.indexOf('</section>', markerIndex);
    const divClose = text.indexOf('</div>', markerIndex);
    const closeCandidates = [sectionClose >= 0 ? sectionClose + '</section>'.length : -1, divClose >= 0 ? divClose + '</div>'.length : -1].filter(v => v >= 0);
    const end = closeCandidates.length ? Math.min(...closeCandidates.filter(v => v > markerIndex)) : -1;
    if (start >= 0 && end > start) return { start, end, marker };
  }
  return null;
}

function removeJsxElementContaining(section, phrase) {
  let changed = false;
  let safety = 0;
  const tagNames = ['EntityActionButton', 'Button', 'button', 'Link', 'a'];
  while (section.includes(phrase) && safety < 20) {
    safety += 1;
    const phraseIndex = section.indexOf(phrase);
    let best = null;
    for (const tag of tagNames) {
      const start = section.lastIndexOf(`<${tag}`, phraseIndex);
      if (start < 0) continue;
      if (!best || start > best.start) best = { tag, start };
    }
    if (!best) break;
    const selfClose = section.indexOf('/>', best.start);
    const closeTag = `</${best.tag}>`;
    const close = section.indexOf(closeTag, best.start);
    let end = -1;
    if (selfClose >= 0 && (close < 0 || selfClose < close)) end = selfClose + 2;
    else if (close >= 0) end = close + closeTag.length;
    if (end < 0 || end <= best.start) break;
    const lineStart = section.lastIndexOf('\n', best.start) + 1;
    const lineEnd = section.indexOf('\n', end);
    const removeStart = lineStart >= 0 ? lineStart : best.start;
    const removeEnd = lineEnd >= 0 ? lineEnd + 1 : end;
    section = section.slice(0, removeStart) + section.slice(removeEnd);
    changed = true;
  }
  return { section, changed };
}

function fixSideQuickActions() {
  const side = findSectionAroundMarker(source, ['data-client-side-quick-actions', 'client-detail-side-quick-actions-card']);
  if (side) {
    const originalSection = source.slice(side.start, side.end);
    const result = removeJsxElementContaining(originalSection, 'Dodaj notatkę');
    if (result.changed) {
      source = source.slice(0, side.start) + result.section + source.slice(side.end);
      notes.push(`quick-actions: usunięto Dodaj notatkę z bocznej sekcji (${side.marker})`);
      return;
    }
  }

  // Fallback: remove only an element containing Dodaj notatkę inside a nearby Szybkie akcje/right-card/side block.
  const idx = source.indexOf('Dodaj notatkę');
  if (idx >= 0) {
    const windowStart = Math.max(0, idx - 2500);
    const windowEnd = Math.min(source.length, idx + 2500);
    const window = source.slice(windowStart, windowEnd);
    const isProbablySideQuickAction = /Szybkie akcje|side-quick-actions|right-card|quick-actions|data-client-side-quick-actions/.test(window);
    if (isProbablySideQuickAction) {
      const result = removeJsxElementContaining(window, 'Dodaj notatkę');
      if (result.changed) {
        source = source.slice(0, windowStart) + result.section + source.slice(windowEnd);
        notes.push('quick-actions: fallback usunął JSX akcji Dodaj notatkę z pobliskiego bloku szybkich akcji');
      }
    }
  }
}

function inferActivityVar() {
  const preferred = ['activities', 'clientActivities', 'activityItems', 'allActivities'];
  for (const name of preferred) {
    const re = new RegExp(`const\\s+\\[${name}\\s*,\\s*set[A-Z]`);
    if (re.test(source) || new RegExp(`const\\s+${name}\\s*=`).test(source)) return name;
  }
  const stateMatch = source.match(/const\s+\[(\w*activities\w*|\w*Activities\w*)\s*,\s*set\w+\]\s*=\s*useState/);
  return stateMatch ? stateMatch[1] : null;
}
function inferClientIdExpression() {
  if (/const\s+\{\s*clientId\s*\}\s*=\s*useParams/.test(source) || /clientId\s*=/.test(source)) return "String(client?.id || clientId || '')";
  if (/const\s+\{\s*id\s*\}\s*=\s*useParams/.test(source)) return "String(client?.id || id || '')";
  return "String(client?.id || '')";
}
function addClientNotesMemo() {
  if (source.includes('clientNotesStage14A')) return true;
  const activityVar = inferActivityVar();
  if (!activityVar) return false;
  const clientIdExpr = inferClientIdExpression();
  const memo = `\n  const clientNotesStage14A = useMemo(() => {\n    const sourceActivities = Array.isArray(${activityVar}) ? ${activityVar} : [];\n    const safeClientId = ${clientIdExpr};\n    return sourceActivities\n      .filter((activity: any) => isClientNoteActivityStage14A(activity, safeClientId))\n      .sort((left: any, right: any) => {\n        const leftTime = asDate(formatClientActivityDateStage14A(left))?.getTime() || asDate(getActivityTime(left))?.getTime() || 0;\n        const rightTime = asDate(formatClientActivityDateStage14A(right))?.getTime() || asDate(getActivityTime(right))?.getTime() || 0;\n        return rightTime - leftTime;\n      });\n  }, [${activityVar}, client?.id${clientIdExpr.includes('clientId') ? ', clientId' : ''}${clientIdExpr.includes('id ||') ? ', id' : ''}]);\n`;

  const anchors = [
    /\n\s*if\s*\(\s*loading\s*\)/,
    /\n\s*if\s*\(\s*!client\s*\)/,
    /\n\s*return\s*\(/,
  ];
  for (const anchor of anchors) {
    const match = source.match(anchor);
    if (match && typeof match.index === 'number') {
      source = source.slice(0, match.index) + memo + source.slice(match.index);
      notes.push(`notes: dodano clientNotesStage14A na podstawie ${activityVar}`);
      return true;
    }
  }
  return false;
}

function fixNotesList() {
  const hasMemo = source.includes('clientNotesStage14A') || addClientNotesMemo();
  if (!hasMemo) {
    notes.push('notes: UWAGA nie udało się bezpiecznie wywnioskować zmiennej aktywności do clientNotesStage14A');
    return;
  }
  if (source.includes('client-detail-note-row') && source.includes('data-client-notes-list="true"')) return;
  const list = `<div className="client-detail-note-list" data-client-notes-list="true">\n                    {clientNotesStage14A.length > 0 ? (\n                      clientNotesStage14A.slice(0, 5).map((note: any) => (\n                        <article className="client-detail-note-row" key={String(note.id || note.createdAt || note.created_at || getClientActivityBodyStage14A(note))}>\n                          <strong>{formatClientActivityTitleStage14A(note)}</strong>\n                          <p title={getClientActivityBodyStage14A(note)}>{getClientActivityBodyStage14A(note)}</p>\n                        </article>\n                      ))\n                    ) : (\n                      <p>Brak zapisanych notatek dla klienta.</p>\n                    )}\n                  </div>`;

  const fallbackPatterns = [
    /<p[^>]*>\s*Brak zapisanych notatek dla klienta\.\s*<\/p>/,
    /<div[^>]*className=\{?['"][^'"]*empty[^'"]*['"]\}?[^>]*>\s*Brak zapisanych notatek dla klienta\.\s*<\/div>/,
  ];
  for (const pattern of fallbackPatterns) {
    if (pattern.test(source)) {
      source = source.replace(pattern, list);
      notes.push('notes: fallback pustej listy zastąpiono realną listą clientNotesStage14A');
      return;
    }
  }

  // If the empty copy is absent, add only a marker comment and fail in check instead of guessing JSX placement.
  notes.push('notes: UWAGA nie znaleziono tekstu pustej listy notatek do bezpiecznej zamiany');
}

function fixHistoryRecentCopy() {
  replaceSafe(/Roadmapa/g, 'Ostatnie ruchy', 'recent-moves: Roadmapa -> Ostatnie ruchy');
  replaceSafe(/Lekka oś ostatnich ruchów powiązanych z klientem, leadami i sprawami\.?/g, '', 'history: usunięto generyczny opis lekkiej osi');
  replaceSafe(/title \|\| 'Aktywność klienta'/g, "title || formatClientActivityTitleStage14A(activity)", 'history: usunięto fallback Aktywność klienta');
}

addGuard();
fixTabs();
fixSideQuickActions();
fixNotesList();
fixHistoryRecentCopy();

if (source !== beforeSource) write(tsxPath, source);

let cssPath = cssCandidates.find(fs.existsSync) || cssCandidates[0];
let css = fs.existsSync(cssPath) ? read(cssPath) : '';
const cssBlock = `\n/* STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY */\n.client-detail-note-list,\n.client-detail-note-row,\n.client-detail-activity-row,\n.client-detail-recent-move-row {\n  min-width: 0;\n}\n\n.client-detail-note-row p,\n.client-detail-activity-row p,\n.client-detail-recent-move-row p {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n`;
if (!css.includes('STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY')) {
  css += cssBlock;
  write(cssPath, css);
  notes.push(`css: dodano ellipsis do ${path.relative(repo, cssPath)}`);
}

const checkPath = path.join(repo, 'scripts/check-closeflow-stage14a-clientdetail-notes-history-repair2.cjs');
let pkg = JSON.parse(read(pkgPath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:stage14a-clientdetail-notes-history-repair2'] = 'node scripts/check-closeflow-stage14a-clientdetail-notes-history-repair2.cjs';
write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

write(docPath, `# CloseFlow Stage 14A Repair2 — ClientDetail notes/history\n\n## Cel\n\nDomknięcie czerwonego checka po Stage14A. Poprzednia komenda przepuściła commit mimo błędu checka, bo PowerShell nie zatrzymał się na niezerowym exit code z npm.\n\n## Zakres\n\n- ClientDetail: zakładka Sprawy jako domyślna i pierwsza w kontrakcie typu.\n- ClientDetail: usunięcie akcji Dodaj notatkę z bocznych szybkich akcji.\n- ClientDetail: realna lista notatek klienta pod kartą notatki, z jednowierszowym skrótem i title.\n- ClientDetail: historia i ostatnie ruchy bez technicznego bełkotu typu client_note / Aktywność klienta / Brak daty.\n- PowerShell: komenda Repair2 ma zatrzymywać się po każdym nieudanym checku/buildzie przez $LASTEXITCODE.\n\n## Nie zmieniać\n\n- Nie usuwać karty Krótka notatka.\n- Nie zmieniać modelu klienta.\n- Nie przenosić pracy operacyjnej ze sprawy do klienta.\n- Nie dodawać nowych statusów klienta.\n\n## Weryfikacja\n\n- npm.cmd run check:stage14a-clientdetail-notes-history-repair2\n- npm.cmd run check:stage14a-clientdetail-notes-history\n- npm.cmd run build\n- test ręczny /clients/:id\n`);

console.log('STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_REPAIR_DONE');
console.log(`Backup: ${path.relative(repo, backupDir)}`);
for (const note of notes) console.log(`- ${note}`);
