#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const STAGE = 'STAGE14A_CLIENT_DETAIL_NOTES_HISTORY';
const repoRoot = process.cwd();
const tsxPath = path.join(repoRoot, 'src/pages/ClientDetail.tsx');
const styleCandidates = [
  'src/styles/ClientDetail.css',
  'src/styles/visual-stage12-client-detail-vnext.css',
  'src/styles/client-detail.css',
].map((entry) => path.join(repoRoot, entry));
const packagePath = path.join(repoRoot, 'package.json');
const backupRoot = path.join(repoRoot, '.closeflow-recovery-backups', `stage14a-clientdetail-notes-history-${new Date().toISOString().replace(/[:.]/g, '-')}`);

function fail(message) {
  console.error(`\n[${STAGE}] ${message}`);
  process.exit(1);
}
function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}
function write(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, 'utf8');
}
function backup(filePath) {
  if (!fs.existsSync(filePath)) return;
  const relative = path.relative(repoRoot, filePath);
  const target = path.join(backupRoot, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(filePath, target);
}
function normalizeSlashes(value) {
  return String(value || '').replace(/\\/g, '/');
}
function sectionAroundMarker(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return null;
  const sectionStart = source.lastIndexOf('<section', markerIndex);
  if (sectionStart < 0) return null;
  const sectionEnd = source.indexOf('</section>', markerIndex);
  if (sectionEnd < 0) return null;
  return { start: sectionStart, end: sectionEnd + '</section>'.length, block: source.slice(sectionStart, sectionEnd + '</section>'.length) };
}
function removeJsxActionByVisibleLabel(block, label) {
  let next = block;
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const patterns = [
    new RegExp(`\\n?[ \\t]*<EntityActionButton\\b[\\s\\S]{0,1600?>[\\s\\S]{0,400?${escaped}[\\s\\S]{0,400?</EntityActionButton>`, 'g'),
    new RegExp(`\\n?[ \\t]*<button\\b[\\s\\S]{0,1600?>[\\s\\S]{0,400?${escaped}[\\s\\S]{0,400?</button>`, 'g'),
    new RegExp(`\\n?[ \\t]*<Link\\b[\\s\\S]{0,1600?>[\\s\\S]{0,400?${escaped}[\\s\\S]{0,400?</Link>`, 'g'),
    new RegExp(`\\n?[ \\t]*<li\\b[\\s\\S]{0,1800?${escaped}[\\s\\S]{0,800?</li>`, 'g'),
    new RegExp(`\\n?[ \\t]*<div\\b[^>]*className={[^}]*quick[^}]*}[\\s\\S]{0,1800?${escaped}[\\s\\S]{0,800?</div>`, 'g'),
    new RegExp(`\\n?[ \\t]*<div\\b[^>]*className=\"[^\"]*quick[^\"]*\"[\\s\\S]{0,1800?${escaped}[\\s\\S]{0,800?</div>`, 'g'),
  ];

  for (const pattern of patterns) {
    next = next.replace(pattern, '');
  }
  return next;
}
function patchTabs(source, report) {
  let next = source;
  const before = next;

  next = next.replace(/useState<ClientTab>\(\s*['"]summary['"]\s*\)/g, "useState<ClientTab>('cases')");
  next = next.replace(/useState<\s*ClientTab\s*>\(\s*['"]summary['"]\s*\)/g, "useState<ClientTab>('cases')");
  next = next.replace(/(fallbackTab\s*[=:]\s*)['"]summary['"]/g, "$1'cases'");
  next = next.replace(/(defaultTab\s*[=:]\s*)['"]summary['"]/g, "$1'cases'");
  next = next.replace(/(activeTab\s*\|\|\s*)['"]summary['"]/g, "$1'cases'");

  // Reorder simple tab arrays if the code has a literal array with cases + summary + history.
  next = next.replace(/(const\s+(?:CLIENT_TABS|clientTabs|tabs)\s*=\s*\[)([\s\S]*?)(\];)/g, (full, open, body, close) => {
    if (!/label:\s*['"]Sprawy['"]/.test(body) || !/label:\s*['"]Podsumowanie['"]/.test(body)) return full;
    const objectMatches = body.match(/\{[\s\S]*?\}\s*,?/g) || [];
    if (objectMatches.length < 2) return full;
    const cases = objectMatches.find((item) => /id:\s*['"]cases['"]/.test(item) || /label:\s*['"]Sprawy['"]/.test(item));
    const summary = objectMatches.find((item) => /id:\s*['"]summary['"]/.test(item) || /label:\s*['"]Podsumowanie['"]/.test(item));
    const history = objectMatches.find((item) => /id:\s*['"]history['"]/.test(item) || /label:\s*['"]Historia['"]/.test(item));
    const contact = objectMatches.find((item) => /id:\s*['"]contact['"]/.test(item) || /label:\s*['"]Kontakt['"]/.test(item));
    if (!cases || !summary) return full;
    const ordered = [cases, summary, contact, history].filter(Boolean);
    const seen = new Set(ordered);
    for (const item of objectMatches) if (!seen.has(item)) ordered.push(item);
    return `${open}\n  ${ordered.map((item) => item.replace(/,\s*$/, '')).join(',\n  ')}\n${close}`;
  });

  if (next !== before) report.push('tabs: ustawiono cases jako domyślną zakładkę / przesunięto Sprawy na początek tam, gdzie wzorzec był bezpieczny');
  else report.push('tabs: nie znaleziono prostego wzorca do automatycznej zmiany, sprawdź ręcznie kolejność zakładek w JSX');
  return next;
}
function patchSideQuickActions(source, report) {
  const marker = 'data-client-side-quick-actions';
  const section = sectionAroundMarker(source, marker);
  if (!section) {
    report.push('quick-actions: nie znaleziono sekcji data-client-side-quick-actions, brak automatycznego usuwania akcji Dodaj notatkę');
    return source;
  }
  const cleaned = removeJsxActionByVisibleLabel(section.block, 'Dodaj notatkę');
  const becameEmpty = !/(Dodaj zadanie|Dodaj wydarzenie|Finanse w sprawie|Otwórz sprawę|Nowa sprawa)/.test(cleaned) && !/<button|<EntityActionButton|<Link/.test(cleaned);
  const replacement = becameEmpty ? '' : cleaned;
  if (replacement !== section.block) {
    report.push('quick-actions: usunięto Dodaj notatkę z bocznych szybkich akcji');
    return `${source.slice(0, section.start)}${replacement}${source.slice(section.end)}`;
  }
  report.push('quick-actions: sekcja istnieje, ale nie znalazłem bezpiecznego JSX akcji Dodaj notatkę do usunięcia');
  return source;
}
function helperBlock() {
  return `
const ${STAGE}_GUARD = 'ClientDetail shows cases first, real client notes, readable history and recent moves';
void ${STAGE}_GUARD;

type Stage14AActivityLike = Record<string, any>;

function getClientActivityPayloadStage14A(activity: Stage14AActivityLike) {
  return activity?.payload && typeof activity.payload === 'object' ? activity.payload : {};
}

function getClientActivityTypeStage14A(activity: Stage14AActivityLike) {
  const payload = getClientActivityPayloadStage14A(activity);
  return String(
    activity?.type ||
    activity?.activityType ||
    activity?.activity_type ||
    activity?.eventType ||
    activity?.event_type ||
    payload?.type ||
    payload?.activityType ||
    payload?.eventType ||
    ''
  ).trim().toLowerCase();
}

function isTechnicalActivityFallbackStage14A(value: string) {
  const normalized = String(value || '').trim().toLowerCase();
  return !normalized || normalized === 'client_note' || normalized === 'activity' || normalized === 'aktywność klienta' || normalized === 'brak daty';
}

function getClientActivityBodyStage14A(activity: Stage14AActivityLike) {
  const payload = getClientActivityPayloadStage14A(activity);
  const candidates = [
    payload?.note,
    payload?.content,
    payload?.body,
    payload?.message,
    payload?.description,
    payload?.summary,
    activity?.body,
    activity?.message,
    activity?.note,
    activity?.content,
    activity?.description,
    activity?.summary,
    payload?.title,
    activity?.title,
  ];
  for (const candidate of candidates) {
    const text = asText(candidate);
    if (text && !isTechnicalActivityFallbackStage14A(text)) return text;
  }
  return 'Brak treści aktywności';
}

function formatClientActivityTitleStage14A(activity: Stage14AActivityLike) {
  const payload = getClientActivityPayloadStage14A(activity);
  const type = getClientActivityTypeStage14A(activity);
  const explicitTitle = asText(activity?.title) || asText(payload?.title);

  if (explicitTitle && !isTechnicalActivityFallbackStage14A(explicitTitle)) return explicitTitle;
  if (type.includes('note')) return 'Notatka';
  if (type.includes('task')) return 'Zadanie';
  if (type.includes('event') || type.includes('calendar') || type.includes('meeting')) return 'Wydarzenie';
  if (type.includes('payment') || type.includes('finance')) return 'Płatność';
  if (type.includes('case')) return 'Sprawa';
  if (type.includes('lead')) return 'Lead';
  if (type.includes('status')) return 'Zmiana statusu';
  return 'Aktywność';
}

function formatClientActivityDateStage14A(activity: Stage14AActivityLike) {
  const payload = getClientActivityPayloadStage14A(activity);
  const value = activity?.happenedAt || activity?.happened_at || activity?.createdAt || activity?.created_at || activity?.updatedAt || activity?.updated_at || payload?.happenedAt || payload?.createdAt;
  const formatted = formatDateTime(value);
  return formatted && formatted !== 'Brak daty' ? formatted : '';
}

function formatClientActivitySourceStage14A(activity: Stage14AActivityLike) {
  const payload = getClientActivityPayloadStage14A(activity);
  const raw = String(
    activity?.source ||
    activity?.sourceType ||
    activity?.source_type ||
    activity?.recordType ||
    activity?.record_type ||
    activity?.entityType ||
    activity?.entity_type ||
    payload?.source ||
    payload?.sourceType ||
    payload?.recordType ||
    payload?.entityType ||
    ''
  ).trim().toLowerCase();

  if (raw === 'client' || raw === 'klient') return 'klient';
  if (raw === 'case' || raw === 'sprawa') return 'sprawa';
  if (raw === 'lead') return 'lead';
  return '';
}

function isClientRelatedActivityStage14A(activity: Stage14AActivityLike, clientId: string) {
  const payload = getClientActivityPayloadStage14A(activity);
  const safeClientId = String(clientId || '').trim();
  if (!safeClientId) return false;
  return [
    activity?.clientId,
    activity?.client_id,
    activity?.entityId,
    activity?.entity_id,
    activity?.recordId,
    activity?.record_id,
    payload?.clientId,
    payload?.client_id,
    payload?.entityId,
    payload?.entity_id,
    payload?.recordId,
    payload?.record_id,
  ].some((value) => String(value || '').trim() === safeClientId) || String(payload?.recordType || payload?.entityType || '').trim().toLowerCase() === 'client';
}

function isClientNoteActivityStage14A(activity: Stage14AActivityLike, clientId: string) {
  const type = getClientActivityTypeStage14A(activity);
  const body = getClientActivityBodyStage14A(activity);
  return isClientRelatedActivityStage14A(activity, clientId) && (type.includes('note') || type === 'client_note' || Boolean(body && body !== 'Brak treści aktywności'));
}
`;
}
function patchHelpers(source, report) {
  let next = source;
  if (!next.includes(`${STAGE}_GUARD`)) {
    const marker = 'function activityLabel(activity: any) {';
    if (next.includes(marker)) {
      next = next.replace(marker, `${helperBlock()}\n${marker}`);
      report.push('helpers: dodano formattery Stage14A przed activityLabel');
    } else {
      next = next.replace(/type ClientTab[\s\S]*?;\n/, (match) => `${match}\n${helperBlock()}\n`);
      report.push('helpers: dodano formattery Stage14A po typie ClientTab');
    }
  }

  next = next.replace(/if \(!parsed\) return 'Brak daty';/g, "if (!parsed) return '';");
  next = next.replace(/if \(!parsed\) return \"Brak daty\";/g, "if (!parsed) return '';");
  next = next.replace(/return title \|\| 'Aktywność klienta';/g, "return title || formatClientActivityTitleStage14A(activity);");
  next = next.replace(/return title \|\| \"Aktywność klienta\";/g, "return title || formatClientActivityTitleStage14A(activity);");

  // Make explicit client note labels human-readable when activityLabel is still used.
  next = next.replace(/(switch \(eventType\) \{\n)/, `$1    case 'client_note':\n    case 'client_note_added':\n    case 'client_note_dictated':\n    case 'dictated_note':\n    case 'note_added':\n      return 'Notatka';\n`);
  return next;
}
function patchCopyAndFallbacks(source, report) {
  let next = source;
  const before = next;
  next = next.replace(/Lekka oś ostatnich ruchów powiązanych z klientem, leadami i sprawami\./g, 'Realne ruchy powiązane z klientem, leadami i sprawami.');
  next = next.replace(/Roadmapa/g, 'Ostatnie ruchy');
  next = next.replace(/Brak aktywności klienta\./g, 'Brak ostatnich ruchów.');
  next = next.replace(/Brak aktywności\./g, 'Brak ostatnich ruchów.');
  if (next !== before) report.push('copy: usunięto techniczne/generic copy z historii i panelu ruchów');
  return next;
}
function patchPackageJson(report) {
  if (!fs.existsSync(packagePath)) return;
  backup(packagePath);
  const pkg = JSON.parse(read(packagePath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:stage14a-clientdetail-notes-history'] = 'node scripts/check-closeflow-stage14a-clientdetail-notes-history.cjs';
  write(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
  report.push('package.json: dodano check:stage14a-clientdetail-notes-history');
}
function appendCss(report) {
  let stylePath = styleCandidates.find((candidate) => fs.existsSync(candidate));
  if (!stylePath) {
    stylePath = path.join(repoRoot, 'src/styles/ClientDetail.css');
    write(stylePath, '');
  }
  backup(stylePath);
  let css = read(stylePath);
  const block = `

/* ${STAGE}: readable one-line note/history/recent-move content */
.client-detail-note-row p,
.client-detail-activity-row p,
.client-detail-recent-move-row p {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.client-detail-note-row,
.client-detail-activity-row,
.client-detail-recent-move-row {
  min-width: 0;
}

.client-detail-note-list {
  display: grid;
  gap: 8px;
  min-width: 0;
}
`;
  if (!css.includes(`${STAGE}: readable one-line`)) {
    css += block;
    write(stylePath, css);
    report.push(`css: dodano reguły ellipsis do ${normalizeSlashes(path.relative(repoRoot, stylePath))}`);
  } else {
    report.push(`css: reguły Stage14A już istnieją w ${normalizeSlashes(path.relative(repoRoot, stylePath))}`);
  }
}

if (!fs.existsSync(tsxPath)) fail('Nie znaleziono src/pages/ClientDetail.tsx. Uruchom skrypt z katalogu repo CloseFlow.');
if (!fs.existsSync(packagePath)) fail('Nie znaleziono package.json. Uruchom skrypt z katalogu repo CloseFlow.');

fs.mkdirSync(backupRoot, { recursive: true });
backup(tsxPath);

const report = [];
let source = read(tsxPath);
source = patchHelpers(source, report);
source = patchTabs(source, report);
source = patchSideQuickActions(source, report);
source = patchCopyAndFallbacks(source, report);
write(tsxPath, source);
appendCss(report);
patchPackageJson(report);

console.log(`\n${STAGE}_REPAIR_DONE`);
console.log(`Backup: ${normalizeSlashes(path.relative(repoRoot, backupRoot))}`);
for (const item of report) console.log(`- ${item}`);
console.log('\nUruchom teraz: npm.cmd run check:stage14a-clientdetail-notes-history');
