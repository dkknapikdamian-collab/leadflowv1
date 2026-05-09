#!/usr/bin/env node
/* eslint-disable no-console */
/*
CLOSEFLOW_VISUAL_SYSTEM_INVENTORY_STAGE0
Purpose: inventory current visual-system drift before any visual migration.
This script is intentionally read-only except --write generated report/json.
*/
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const WRITE = process.argv.includes('--write');
const TODAY = '2026-05-09';

const OUT_JSON = path.join(repo, 'docs/ui/closeflow-visual-system-inventory.generated.json');
const OUT_MD = path.join(repo, 'docs/ui/CLOSEFLOW_VISUAL_SYSTEM_INVENTORY_2026-05-09.md');

const ACTIVE_PAGE_ALLOWLIST = [
  'TodayStable',
  'Today',
  'Leads',
  'LeadDetail',
  'Clients',
  'ClientDetail',
  'Cases',
  'CaseDetail',
  'Tasks',
  'TasksStable',
  'Calendar',
  'AiDrafts',
  'Activity',
  'Billing',
  'Settings',
  'NotificationsCenter',
  'SupportCenter',
  'ResponseTemplates',
  'Templates',
  'AdminFeedback',
  'Admin',
];

const STANDARD_WRAPPER_MARKERS = [
  '<Layout',
  'from \'../components/Layout\'',
  'from "../components/Layout"',
  'data-closeflow-page-wrapper',
  'closeflow-page-shell',
  'CloseflowPageShell',
  'PageShell',
  'main-page-shell',
  'operator-shell',
  'app-shell',
];

const STANDARD_TILE_MARKERS = [
  'StatShortcutCard',
  'data-today-tile-card',
  'eliteflow-metric',
  'metric-tile',
  'closeflow-metric',
  'UnifiedMetric',
  'MetricCard',
  'StatsCard',
  'StatCard',
];

const STANDARD_HERO_MARKERS = [
  'data-page-hero',
  'closeflow-page-hero',
  'UnifiedPageHead',
  'PageHero',
  'PageHeader',
  'stage37',
  'page-head',
];

function rel(p) {
  return path.relative(repo, p).replace(/\\/g, '/');
}

function exists(file) {
  return fs.existsSync(path.join(repo, file));
}

function read(file) {
  const p = path.join(repo, file);
  if (!fs.existsSync(p)) return '';
  return fs.readFileSync(p, 'utf8');
}

function walk(dir, out = []) {
  const abs = path.join(repo, dir);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const full = path.join(abs, entry.name);
    if (entry.isDirectory()) walk(rel(full), out);
    else out.push(full);
  }
  return out;
}

function lineNo(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function collectMatches(file, regex, kind, classifier) {
  const text = read(file);
  const results = [];
  let match;
  while ((match = regex.exec(text))) {
    results.push({
      kind,
      file,
      line: lineNo(text, match.index),
      match: match[0].slice(0, 220),
      decision: classifier ? classifier(match[0], file, text) : 'migrujemy',
    });
    if (match.index === regex.lastIndex) regex.lastIndex++;
  }
  return results;
}

function decisionForCssImport(importPath) {
  if (/tailwindcss/.test(importPath)) return 'zostaje';
  if (/closeflow-(action|entity-type)-tokens/.test(importPath)) return 'zostaje';
  if (/closeflow-vnext-ui-contract|visual-html-theme/.test(importPath)) return 'zostaje';
  if (/eliteflow|visual-stage|hotfix|stage\d|stage[A-Z]\d|stage[A-Z]/.test(importPath)) return 'migrujemy';
  if (/case-detail-stage2|case-detail-simplified/.test(importPath)) return 'legacy';
  return 'migrujemy';
}

function decisionForCssFile(file) {
  const name = path.basename(file);
  if (/tailwindcss/.test(name)) return 'zostaje';
  if (/closeflow-(action|entity-type)-tokens|closeflow-vnext-ui-contract|visual-html-theme/.test(name)) return 'zostaje';
  if (/hotfix|visual-stage|eliteflow|stage\d|stage[A-Z]\d/i.test(name)) return 'migrujemy';
  return 'legacy';
}

function decisionForLocalSurface(match, file) {
  const lower = `${file} ${match}`.toLowerCase();
  if (lower.includes('legacy') || lower.includes('inactive')) return 'legacy';
  if (lower.includes('todo') || lower.includes('temporary')) return 'usunąć później';
  return 'migrujemy';
}

function hasAny(text, markers) {
  return markers.some((m) => text.includes(m));
}

function fileNameNoExt(file) {
  return path.basename(file).replace(/\.(tsx|jsx|ts|js)$/, '');
}

function resolveActivePages() {
  const appText = read('src/App.tsx') + '\n' + read('src/main.tsx');
  const pageFiles = walk('src/pages').filter((p) => /\.(tsx|jsx)$/.test(p)).map(rel);

  const active = [];
  const inactive = [];

  for (const file of pageFiles) {
    const name = fileNameNoExt(file);
    const text = read(file);
    const routeLikely = appText.includes(`./pages/${name}`) || appText.includes(`pages/${name}`) || appText.includes(`<${name}`) || ACTIVE_PAGE_ALLOWLIST.includes(name);
    const explicitLegacy = /LEGACY_.*INACTIVE|INACTIVE_UI_SURFACE|Do not refactor this file inside active/i.test(text);
    const item = { file, page: name, routeEvidence: routeLikely ? 'App/import/name heuristic' : 'not found in App heuristic' };
    if (routeLikely && !explicitLegacy) active.push(item);
    else inactive.push({ ...item, reason: explicitLegacy ? 'legacy/inactive marker' : 'not active by heuristic' });
  }

  return { active, inactive };
}

function classifyActiveScreen(file) {
  const text = read(file);
  const wrapper = hasAny(text, STANDARD_WRAPPER_MARKERS);
  const tiles = hasAny(text, STANDARD_TILE_MARKERS);
  const hero = hasAny(text, STANDARD_HERO_MARKERS);

  return {
    file,
    page: fileNameNoExt(file),
    hasStandardWrapper: wrapper,
    hasStandardTiles: tiles,
    hasStandardPageHero: hero,
    missing: [
      !wrapper ? 'standard wrapper' : null,
      !tiles ? 'standard tiles' : null,
      !hero ? 'standard page hero' : null,
    ].filter(Boolean),
    decision: (!wrapper || !tiles || !hero) ? 'migrujemy' : 'zostaje',
  };
}

function makeDecisionSummary(items) {
  const summary = { zostaje: 0, migrujemy: 0, legacy: 0, 'usunąć później': 0 };
  for (const item of items) {
    if (summary[item.decision] === undefined) summary[item.decision] = 0;
    summary[item.decision]++;
  }
  return summary;
}

function buildInventory() {
  const indexCssText = read('src/index.css');
  const cssImports = [];
  const importRegex = /@import\s+(?:url\()?['"]?([^'";)]+)['"]?\)?\s*;/g;
  let m;
  while ((m = importRegex.exec(indexCssText))) {
    cssImports.push({
      kind: 'src/index.css import',
      file: 'src/index.css',
      line: lineNo(indexCssText, m.index),
      import: m[1],
      decision: decisionForCssImport(m[1]),
    });
  }

  const styleFiles = walk('src/styles').filter((p) => /\.css$/.test(p)).map(rel).sort();
  const namedCssFamilies = styleFiles
    .filter((file) => /visual-stage|hotfix-|eliteflow-|stage.*\.css/i.test(path.basename(file)))
    .map((file) => ({
      kind: 'named CSS family',
      file,
      family: /visual-stage/i.test(file) ? 'visual-stage*'
        : /hotfix-/i.test(file) ? 'hotfix-*'
        : /eliteflow-/i.test(file) ? 'eliteflow-*'
        : /stage.*\.css/i.test(file) ? 'stage*.css'
        : 'other',
      decision: decisionForCssFile(file),
    }));

  const sourceFiles = [
    ...walk('src/pages'),
    ...walk('src/components'),
  ].filter((p) => /\.(tsx|jsx|ts|js)$/.test(p)).map(rel).sort();

  const localTiles = [];
  const localHeaders = [];
  const localRows = [];
  const localForms = [];

  for (const file of sourceFiles) {
    const text = read(file);
    const snippets = [
      ...collectMatches(file, /\bfunction\s+[A-Z][A-Za-z0-9]*(?:Tile|Card|Metric|Stat)[A-Za-z0-9]*\b/g, 'local tile/card component', decisionForLocalSurface),
      ...collectMatches(file, /\bconst\s+[A-Z][A-Za-z0-9]*(?:Tile|Card|Metric|Stat)[A-Za-z0-9]*\s*=/g, 'local tile/card component', decisionForLocalSurface),
    ];
    localTiles.push(...snippets);

    localHeaders.push(
      ...collectMatches(file, /\bfunction\s+[A-Z][A-Za-z0-9]*(?:Header|Hero|PageHead)[A-Za-z0-9]*\b/g, 'local page header/hero', decisionForLocalSurface),
      ...collectMatches(file, /\bconst\s+[A-Z][A-Za-z0-9]*(?:Header|Hero|PageHead)[A-Za-z0-9]*\s*=/g, 'local page header/hero', decisionForLocalSurface),
    );

    localRows.push(
      ...collectMatches(file, /\bfunction\s+[A-Z][A-Za-z0-9]*(?:Row|ListItem|Entry)[A-Za-z0-9]*\b/g, 'local list row', decisionForLocalSurface),
      ...collectMatches(file, /\bconst\s+[A-Z][A-Za-z0-9]*(?:Row|ListItem|Entry)[A-Za-z0-9]*\s*=/g, 'local list row', decisionForLocalSurface),
    );

    localForms.push(
      ...collectMatches(file, /<(form|Form)\b/g, 'local form surface', decisionForLocalSurface),
      ...collectMatches(file, /\bfunction\s+[A-Z][A-Za-z0-9]*(?:Form|Dialog|Modal)[A-Za-z0-9]*\b/g, 'local form/dialog component', decisionForLocalSurface),
      ...collectMatches(file, /\bconst\s+[A-Z][A-Za-z0-9]*(?:Form|Dialog|Modal)[A-Za-z0-9]*\s*=/g, 'local form/dialog component', decisionForLocalSurface),
    );

    if (text.includes('LOCAL_VISUAL_SYSTEM_EXCEPTION')) {
      localHeaders.push({
        kind: 'local visual system exception marker',
        file,
        line: 1,
        match: 'LOCAL_VISUAL_SYSTEM_EXCEPTION',
        decision: 'legacy',
      });
    }
  }

  const routes = resolveActivePages();
  const activeScreenContracts = routes.active.map((p) => classifyActiveScreen(p.file));

  const allDecisions = [
    ...cssImports,
    ...namedCssFamilies,
    ...localTiles,
    ...localHeaders,
    ...localRows,
    ...localForms,
    ...activeScreenContracts,
  ];

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      stage: 'Etap 0 — Visual system inventory freeze',
      branchExpected: 'dev-rollout-freeze',
      purpose: 'Freeze visual-system inventory before visual cleanup/migration.',
      rules: ['zostaje', 'migrujemy', 'legacy', 'usunąć później'],
      note: 'This is an audit inventory, not a UI migration.',
    },
    cssImports,
    namedCssFamilies,
    localSurfaces: {
      localTiles,
      localPageHeaders: localHeaders,
      localListRows: localRows,
      localForms,
    },
    routes,
    activeScreenContracts,
    summary: {
      cssImports: cssImports.length,
      namedCssFamilies: namedCssFamilies.length,
      localTiles: localTiles.length,
      localPageHeaders: localHeaders.length,
      localListRows: localRows.length,
      localForms: localForms.length,
      activeScreens: routes.active.length,
      inactiveOrLegacyScreens: routes.inactive.length,
      activeScreensWithoutStandardWrapper: activeScreenContracts.filter((x) => !x.hasStandardWrapper).length,
      activeScreensWithoutStandardTiles: activeScreenContracts.filter((x) => !x.hasStandardTiles).length,
      activeScreensWithoutStandardPageHero: activeScreenContracts.filter((x) => !x.hasStandardPageHero).length,
      decisions: makeDecisionSummary(allDecisions),
    },
  };
}

function tableRows(rows, cols, limit = 250) {
  if (!rows.length) return '\n_Brak wykrytych pozycji._\n';
  const head = `| ${cols.join(' | ')} |\n| ${cols.map(() => '---').join(' | ')} |`;
  const body = rows.slice(0, limit).map((row) => `| ${cols.map((col) => String(row[col] ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')).join(' | ')} |`).join('\n');
  const tail = rows.length > limit ? `\n\n_Pokazano ${limit} z ${rows.length}. Pełna lista w JSON._` : '';
  return `${head}\n${body}${tail}\n`;
}

function toMd(inv) {
  const activeMissing = inv.activeScreenContracts
    .filter((x) => x.missing.length)
    .map((x) => ({
      file: x.file,
      page: x.page,
      missing: x.missing.join(', '),
      decision: x.decision,
    }));

  return `# CloseFlow — Visual System Inventory Freeze

**Data:** ${TODAY}  
**Etap:** 0  
**Tryb:** audyt / freeze, bez migracji UI  
**Źródło JSON:** \`docs/ui/closeflow-visual-system-inventory.generated.json\`

## Werdykt

Ten dokument jest stop-klatką obecnego systemu wizualnego. Celem jest policzyć rozjazdy przed porządkowaniem, nie poprawiać wygląd.

## Legenda decyzji

| Decyzja | Znaczenie |
|---|---|
| zostaje | Element jest częścią bazowego kontraktu albo tokenów i nie migrujemy go w najbliższym cleanupie. |
| migrujemy | Element jest aktywny albo wpływa na aktywne UI, ale powinien zostać przeniesiony do standardowego komponentu/kontraktu. |
| legacy | Element wygląda na historyczny, kompatybilnościowy albo wyłączony z aktywnej ścieżki. Nie ruszać bez osobnego etapu. |
| usunąć później | Element wygląda na tymczasowy/zbędny, ale usuwanie wymaga osobnego, bezpiecznego etapu. |

## Podsumowanie liczb

| Obszar | Liczba |
|---|---:|
| Importy CSS z src/index.css | ${inv.summary.cssImports} |
| Pliki CSS rodzin visual-stage/hotfix/eliteflow/stage | ${inv.summary.namedCssFamilies} |
| Lokalne kafelki / cardy | ${inv.summary.localTiles} |
| Lokalne page headery / hero | ${inv.summary.localPageHeaders} |
| Lokalne list rows / entry rows | ${inv.summary.localListRows} |
| Lokalne formularze / dialogi | ${inv.summary.localForms} |
| Aktywne ekrany | ${inv.summary.activeScreens} |
| Aktywne ekrany bez standardowego wrappera | ${inv.summary.activeScreensWithoutStandardWrapper} |
| Aktywne ekrany bez standardowych kafelków | ${inv.summary.activeScreensWithoutStandardTiles} |
| Aktywne ekrany bez standardowego page hero | ${inv.summary.activeScreensWithoutStandardPageHero} |

## Decyzje zbiorcze

| Decyzja | Liczba |
|---|---:|
| zostaje | ${inv.summary.decisions.zostaje || 0} |
| migrujemy | ${inv.summary.decisions.migrujemy || 0} |
| legacy | ${inv.summary.decisions.legacy || 0} |
| usunąć później | ${inv.summary.decisions['usunąć później'] || 0} |

## Importy CSS z src/index.css

${tableRows(inv.cssImports.map((x) => ({ line: x.line, import: x.import, decision: x.decision })), ['line', 'import', 'decision'])}

## Rodziny CSS do opanowania

${tableRows(inv.namedCssFamilies.map((x) => ({ family: x.family, file: x.file, decision: x.decision })), ['family', 'file', 'decision'])}

## Aktywne ekrany bez pełnego kontraktu wrapper / tiles / hero

${tableRows(activeMissing, ['file', 'page', 'missing', 'decision'])}

## Lokalne kafelki / cardy

${tableRows(inv.localSurfaces.localTiles.map((x) => ({ file: x.file, line: x.line, match: x.match, decision: x.decision })), ['file', 'line', 'match', 'decision'], 120)}

## Lokalne page headery / hero

${tableRows(inv.localSurfaces.localPageHeaders.map((x) => ({ file: x.file, line: x.line, match: x.match, decision: x.decision })), ['file', 'line', 'match', 'decision'], 120)}

## Lokalne list rows / entries

${tableRows(inv.localSurfaces.localListRows.map((x) => ({ file: x.file, line: x.line, match: x.match, decision: x.decision })), ['file', 'line', 'match', 'decision'], 120)}

## Lokalne formularze / dialogi

${tableRows(inv.localSurfaces.localForms.map((x) => ({ file: x.file, line: x.line, match: x.match, decision: x.decision })), ['file', 'line', 'match', 'decision'], 120)}

## Co wolno dalej

1. Najpierw migrować aktywne ekrany bez standardowego wrappera.
2. Potem migrować aktywne ekrany bez standardowych kafelków.
3. Potem migrować lokalne page hero/headery.
4. Dopiero na końcu usuwać legacy/hotfix CSS.

## Czego nie wolno robić po tym etapie

- Nie usuwać hurtowo \`visual-stage*\`, \`hotfix-*\`, \`eliteflow-*\` ani \`stage*.css\`.
- Nie przepinać UI bez sprawdzenia aktywnego routingu.
- Nie robić „ładniejszego” cleanupu bez checka i aktualizacji tego inventory.
`;
}

const inventory = buildInventory();

if (WRITE) {
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(inventory, null, 2) + '\n', 'utf8');
  fs.writeFileSync(OUT_MD, toMd(inventory), 'utf8');
}

console.log('CLOSEFLOW_VISUAL_SYSTEM_INVENTORY_STAGE0_AUDIT_OK');
console.log(`css_imports=${inventory.summary.cssImports}`);
console.log(`named_css_families=${inventory.summary.namedCssFamilies}`);
console.log(`active_screens=${inventory.summary.activeScreens}`);
console.log(`active_without_wrapper=${inventory.summary.activeScreensWithoutStandardWrapper}`);
console.log(`active_without_tiles=${inventory.summary.activeScreensWithoutStandardTiles}`);
console.log(`active_without_page_hero=${inventory.summary.activeScreensWithoutStandardPageHero}`);
