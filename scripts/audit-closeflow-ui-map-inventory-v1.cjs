#!/usr/bin/env node
/* CLOSEFLOW_UI_MAP_INVENTORY_V1
   Inventory only. This script maps icons, metric tiles/cards and layout placement evidence.
   It does not modify runtime UI code.
   CLEAN_SCANNER_V4: lucide parser is statement-bound, so React hooks/types are not counted as icons.
*/
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcDir = path.join(root, 'src');
const outJson = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_MAP.generated.json');
const outMd = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_MAP.generated.md');

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.vercel', 'coverage', 'tmp', 'temp']);
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name), acc);
      continue;
    }
    if (CODE_EXT.has(path.extname(entry.name))) acc.push(path.join(dir, entry.name));
  }
  return acc;
}

function rel(file) { return path.relative(root, file).replace(/\\/g, '/'); }
function lineOf(text, index) { return text.slice(0, index).split(/\r?\n/).length; }
function getLine(lines, n) { return lines[n - 1] || ''; }
function compactSnippet(lines, start, len = 8) { return lines.slice(Math.max(0, start - 1), Math.min(lines.length, start - 1 + len)).join('\n').trim(); }

function stripInlineComments(value) {
  return String(value || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

function parseLucideImports(text) {
  const result = [];
  // Statement-bound parser: import { ... } from 'lucide-react'.
  // The [^}]* part prevents crossing into preceding React/Firebase imports.
  const re = /import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"]\s*;?/g;
  let m;
  while ((m = re.exec(text))) {
    const block = stripInlineComments(m[1]);
    for (const raw of block.split(',')) {
      const item = raw.trim();
      if (!item) continue;
      const parts = item.split(/\s+as\s+/i).map((x) => x.trim()).filter(Boolean);
      const imported = parts[0];
      const local = parts[1] || parts[0];
      if (/^[A-Za-z][A-Za-z0-9_]*$/.test(imported) && /^[A-Za-z][A-Za-z0-9_]*$/.test(local)) {
        result.push({ imported, local, importLine: lineOf(text, m.index) });
      }
    }
  }
  return result;
}

function roleForIcon(name) {
  const n = String(name || '').toLowerCase();
  if (/trash|delete|remove/.test(n)) return 'delete';
  if (/phone|call|smartphone/.test(n)) return 'phone';
  if (/mail|email|inbox/.test(n)) return 'email';
  if (/copy|clipboard/.test(n)) return 'copy';
  if (/pencil|edit/.test(n)) return 'edit';
  if (/plus|add|create/.test(n)) return 'add';
  if (/file|note|text|sticky/.test(n)) return 'note';
  if (/calendar|event/.test(n)) return 'event';
  if (/clock|timer/.test(n)) return 'time';
  if (/check|circlecheck|checkcircle|task|list|badgecheck|shieldcheck/.test(n)) return 'task_status';
  if (/dollar|coin|wallet|credit|payment|bank/.test(n)) return 'finance';
  if (/user|users|person/.test(n)) return 'person';
  if (/briefcase|case/.test(n)) return 'case';
  if (/building|home|house/.test(n)) return 'company_property';
  if (/alert|warning|triangle|shieldalert/.test(n)) return 'risk_alert';
  if (/sparkle|bot|brain|ai/.test(n)) return 'ai';
  if (/target|goal/.test(n)) return 'goal';
  if (/loader|spinner/.test(n)) return 'loading';
  if (/eye|view/.test(n)) return 'view';
  if (/pin/.test(n)) return 'pin';
  if (/arrow|chevron/.test(n)) return 'navigation';
  if (/settings|gear|sliders/.test(n)) return 'settings';
  if (/logout|log/.test(n)) return 'auth';
  if (/refresh|rotate/.test(n)) return 'refresh';
  if (/send/.test(n)) return 'send';
  if (/bell/.test(n)) return 'notification';
  if (/search/.test(n)) return 'search';
  if (/filter/.test(n)) return 'filter';
  if (/x|close/.test(n)) return 'close';
  return 'unclassified';
}

function extractClassTokens(line) {
  const tokens = new Set();
  const classRe = /className\s*=\s*(?:"([^"]+)"|'([^']+)')/g;
  let m;
  while ((m = classRe.exec(line))) {
    String(m[1] || m[2] || '').split(/\s+/).filter(Boolean).forEach((t) => tokens.add(t));
  }
  return [...tokens];
}

function detectDataRegions(text) {
  const found = [];
  const re = /data-(?:ui|cf)-[A-Za-z0-9_-]+\s*=\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(text))) found.push({ value: m[1], line: lineOf(text, m.index) });
  return found;
}

function selectorBefore(lines, index) {
  const picked = [];
  for (let i = index; i >= 0 && picked.length < 8; i -= 1) {
    const line = lines[i].trim();
    if (!line) continue;
    picked.unshift(line);
    if (line.includes('{')) break;
  }
  return picked.join(' ').replace(/\s+/g, ' ');
}

const files = walk(srcDir);
const inventory = {
  generatedAt: new Date().toISOString(),
  inventoryVersion: 'CLOSEFLOW_UI_MAP_INVENTORY_V1',
  scannerVersion: 'CLEAN_SCANNER_V4',
  filesScanned: files.length,
  directLucideIconImports: [],
  semanticIconRoles: {},
  metricTileUsages: [],
  entityActionContracts: [],
  infoRowImplementations: [],
  noteSurfaceEvidence: [],
  placementRegions: [],
  layoutEvidence: [],
  cssHotfixAndImportantEvidence: [],
  classEvidence: [],
};

for (const file of files) {
  const relative = rel(file);
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  const ext = path.extname(file);

  const lucideImports = parseLucideImports(text);
  for (const icon of lucideImports) {
    const usageRe = new RegExp('<' + icon.local.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\s|>|/)', 'g');
    const usages = [];
    let m;
    while ((m = usageRe.exec(text))) {
      const line = lineOf(text, m.index);
      usages.push({ line, snippet: getLine(lines, line).trim() });
    }
    const entry = { file: relative, imported: icon.imported, local: icon.local, role: roleForIcon(icon.imported), importLine: icon.importLine, usages };
    inventory.directLucideIconImports.push(entry);
    if (!inventory.semanticIconRoles[entry.role]) inventory.semanticIconRoles[entry.role] = [];
    inventory.semanticIconRoles[entry.role].push({ file: relative, icon: icon.imported, local: icon.local, importLine: icon.importLine, usageCount: usages.length });
  }

  const statRe = /<StatShortcutCard\b/g;
  let statMatch;
  while ((statMatch = statRe.exec(text))) {
    const startLine = lineOf(text, statMatch.index);
    inventory.metricTileUsages.push({ file: relative, line: startLine, component: 'StatShortcutCard', snippet: compactSnippet(lines, startLine, 12) });
  }

  const contractRe = /CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT[A-Z0-9_]*\s*=\s*\{/g;
  let contractMatch;
  while ((contractMatch = contractRe.exec(text))) {
    const startLine = lineOf(text, contractMatch.index);
    inventory.entityActionContracts.push({ file: relative, line: startLine, snippet: compactSnippet(lines, startLine, 28) });
  }

  const infoFunctionRe = /function\s+(InfoRow|InfoLine|StatCell|LeadActionButton|ClientMultiContactField)\b/g;
  let infoMatch;
  while ((infoMatch = infoFunctionRe.exec(text))) {
    const startLine = lineOf(text, infoMatch.index);
    inventory.infoRowImplementations.push({ file: relative, line: startLine, name: infoMatch[1], snippet: compactSnippet(lines, startLine, 18) });
  }

  const regions = detectDataRegions(text);
  for (const region of regions) inventory.placementRegions.push({ file: relative, ...region });

  lines.forEach((line, idx) => {
    const lineNo = idx + 1;
    if (/(note|notat|activity|history|contact|info-row|info-line|payment|billing|finance)/i.test(line)) {
      const classes = extractClassTokens(line).filter((x) => /(note|activity|history|contact|info|payment|billing|finance)/i.test(x));
      if (classes.length || /(note|activity|history|contact|payment|billing|finance)/i.test(line)) {
        inventory.noteSurfaceEvidence.push({ file: relative, line: lineNo, classes, snippet: line.trim().slice(0, 240) });
      }
    }
    if (/(shell|rail|grid|header|section|panel|tabs|top-card|summary-card|metric|tile|kafel|right-card)/i.test(line)) {
      const classes = extractClassTokens(line).filter((x) => /(shell|rail|grid|header|section|panel|tabs|top|summary|metric|tile|card)/i.test(x));
      if (classes.length) inventory.classEvidence.push({ file: relative, line: lineNo, classes, snippet: line.trim().slice(0, 260) });
    }
    if (ext === '.css' && /(grid-template-columns|grid-column|order:|@media|max-width|min-width|position:|display:\s*grid|display:\s*flex)/i.test(line)) {
      inventory.layoutEvidence.push({ file: relative, line: lineNo, selector: selectorBefore(lines, idx), rule: line.trim() });
    }
    if (ext === '.css' && /(hotfix|repair|!important|#[0-9a-f]{3,8})/i.test(line)) {
      inventory.cssHotfixAndImportantEvidence.push({ file: relative, line: lineNo, snippet: line.trim().slice(0, 260) });
    }
  });
}

function sortByFileLine(list) {
  return list.sort((a, b) => String(a.file).localeCompare(String(b.file)) || Number(a.line || a.importLine || 0) - Number(b.line || b.importLine || 0));
}

inventory.directLucideIconImports = sortByFileLine(inventory.directLucideIconImports);
inventory.metricTileUsages = sortByFileLine(inventory.metricTileUsages);
inventory.entityActionContracts = sortByFileLine(inventory.entityActionContracts);
inventory.infoRowImplementations = sortByFileLine(inventory.infoRowImplementations);
inventory.noteSurfaceEvidence = sortByFileLine(inventory.noteSurfaceEvidence).slice(0, 500);
inventory.placementRegions = sortByFileLine(inventory.placementRegions);
inventory.layoutEvidence = sortByFileLine(inventory.layoutEvidence).slice(0, 800);
inventory.cssHotfixAndImportantEvidence = sortByFileLine(inventory.cssHotfixAndImportantEvidence).slice(0, 800);
inventory.classEvidence = sortByFileLine(inventory.classEvidence).slice(0, 800);

fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(inventory, null, 2) + '\n', 'utf8');

function mdEscape(value) { return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>'); }

const roleRows = Object.entries(inventory.semanticIconRoles)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([role, entries]) => {
    const filesList = entries.slice(0, 12).map((e) => e.icon + ' (' + e.file + ':' + e.importLine + ', użycia: ' + e.usageCount + ')').join('<br>');
    return '| ' + mdEscape(role) + ' | ' + entries.length + ' | ' + mdEscape(filesList) + ' |';
  });
const metricRows = inventory.metricTileUsages.slice(0, 80).map((e) => '| ' + mdEscape(e.file) + ' | ' + e.line + ' | ' + mdEscape(e.snippet.slice(0, 420)) + ' |');
const contractRows = inventory.entityActionContracts.map((e) => '| ' + mdEscape(e.file) + ' | ' + e.line + ' | ' + mdEscape(e.snippet.slice(0, 520)) + ' |');
const infoRows = inventory.infoRowImplementations.map((e) => '| ' + mdEscape(e.name) + ' | ' + mdEscape(e.file) + ' | ' + e.line + ' |');
const layoutRows = inventory.layoutEvidence.slice(0, 160).map((e) => '| ' + mdEscape(e.file) + ' | ' + e.line + ' | ' + mdEscape(e.selector.slice(0, 220)) + ' | ' + mdEscape(e.rule) + ' |');
const regionRows = inventory.placementRegions.slice(0, 140).map((e) => '| ' + mdEscape(e.file) + ' | ' + e.line + ' | ' + mdEscape(e.value) + ' |');

const md = '# CloseFlow UI Map Inventory v1\n\n' +
'Generated: ' + inventory.generatedAt + '\n\n' +
'Scanner: **' + inventory.scannerVersion + '**\n\n' +
'Status: **mapa/inwentaryzacja, nie refactor UI**. Ten plik ma pokazać, gdzie dziś żyją ikony, kafelki, sekcje, notatki, akcje i położenia. Dopiero po tej mapie wolno robić przepięcie na wspólne komponenty.\n\n' +
'## Wynik skanowania\n\n' +
'- Pliki przeskanowane: **' + inventory.filesScanned + '**\n' +
'- Bezpośrednie importy ikon z lucide-react: **' + inventory.directLucideIconImports.length + '**\n' +
'- Użycia StatShortcutCard: **' + inventory.metricTileUsages.length + '**\n' +
'- Lokalne implementacje InfoRow/InfoLine/StatCell/ActionButton: **' + inventory.infoRowImplementations.length + '**\n' +
'- Kontrakty akcji encji: **' + inventory.entityActionContracts.length + '**\n' +
'- Dowody położenia/layoutu CSS: **' + inventory.layoutEvidence.length + '**\n\n' +
'## Decyzja architektoniczna\n\n' +
'Następny etap UI nie powinien naprawiać pojedynczych kolorów. Najpierw trzeba zatwierdzić mapę:\n\n' +
'1. każda ikona standardowa ma dostać rolę semantyczną,\n' +
'2. każdy kafelek/metrika ma zostać przypisana do wspólnego typu,\n' +
'3. każda sekcja detail view ma dostać data-ui-region,\n' +
'4. LeadDetail i ClientDetail mają mieć wspólny układ regionów,\n' +
'5. dopiero później przepinamy kod na SemanticIcon, EntityInfoRow, EntityNoteCard i EntityDetailShell.\n\n' +
'## Mapa ikon według roli\n\n' +
'| Rola | Liczba importów | Przykłady |\n|---|---:|---|\n' + (roleRows.join('\n') || '| brak | 0 | - |') + '\n\n' +
'## Użycia kafelków / StatShortcutCard\n\n' +
'| Plik | Linia | Fragment |\n|---|---:|---|\n' + (metricRows.join('\n') || '| brak | - | - |') + '\n\n' +
'## Kontrakty akcji encji\n\n' +
'| Plik | Linia | Fragment |\n|---|---:|---|\n' + (contractRows.join('\n') || '| brak | - | - |') + '\n\n' +
'## Lokalne implementacje do przepięcia\n\n' +
'Te elementy są kandydatami do przeniesienia do wspólnego UI systemu.\n\n' +
'| Nazwa | Plik | Linia |\n|---|---|---:|\n' + (infoRows.join('\n') || '| brak | - | - |') + '\n\n' +
'## Regiony / data attributes\n\n' +
'| Plik | Linia | Wartość |\n|---|---:|---|\n' + (regionRows.join('\n') || '| brak | - | - |') + '\n\n' +
'## Położenie / layout CSS\n\n' +
'| Plik | Linia | Selektor/kontekst | Reguła |\n|---|---:|---|---|\n' + (layoutRows.join('\n') || '| brak | - | - | - |') + '\n\n' +
'## Następny krok po zatwierdzeniu mapy\n\n' +
'Pakiet UI-2 powinien zrobić dopiero wtedy:\n\n' +
'- SemanticIcon jako jedyne źródło ikon standardowych,\n' +
'- EntityInfoRow dla telefonu, maila, źródła i danych kontaktowych,\n' +
'- EntityNoteCard / EntityNoteComposer / EntityNoteList,\n' +
'- EntityDetailShell z regionami dla LeadDetail i ClientDetail,\n' +
'- guard blokujący nowe lokalne style ikon/notatek/kontaktów.\n';

fs.writeFileSync(outMd, md, 'utf8');
console.log('CLOSEFLOW_UI_MAP_INVENTORY_V1_OK');
console.log('scannerVersion=' + inventory.scannerVersion);
console.log('filesScanned=' + inventory.filesScanned);
console.log('directLucideIconImports=' + inventory.directLucideIconImports.length);
console.log('metricTileUsages=' + inventory.metricTileUsages.length);
console.log('layoutEvidence=' + inventory.layoutEvidence.length);
console.log('written=' + rel(outJson) + ' ' + rel(outMd));
