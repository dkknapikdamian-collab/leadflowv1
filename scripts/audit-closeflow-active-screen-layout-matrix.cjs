#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const marker = 'CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_VS4';
const outJsonRel = 'docs/ui/closeflow-active-screen-layout-matrix.generated.json';
const outDocRel = 'docs/ui/CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_2026-05-09.md';

const uiKeys = [
  'PageShell',
  'PageHero',
  'MetricGrid',
  'MetricTile',
  'EntityIcon',
  'ActionIcon',
  'SurfaceCard',
  'ListRow',
  'ActionCluster',
  'FormFooter',
  'FinanceSnapshot',
];

function repoPath(rel) {
  return path.join(repo, rel);
}

function exists(rel) {
  return fs.existsSync(repoPath(rel));
}

function read(rel) {
  return fs.readFileSync(repoPath(rel), 'utf8');
}

function write(rel, content) {
  const target = repoPath(rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
}

function normalizeImportPath(importPath) {
  if (!importPath || !importPath.startsWith('./')) return null;
  const relBase = 'src/' + importPath.slice(2);
  const candidates = [
    relBase + '.tsx',
    relBase + '.ts',
    relBase + '.jsx',
    relBase + '.js',
    path.join(relBase, 'index.tsx').replace(/\\/g, '/'),
    path.join(relBase, 'index.ts').replace(/\\/g, '/'),
  ];
  return candidates.find(exists) || candidates[0];
}

function extractLazyImports(appText) {
  const lazy = new Map();
  const re = /const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)\);/g;
  let match;
  while ((match = re.exec(appText))) {
    lazy.set(match[1], normalizeImportPath(match[2]));
  }
  return lazy;
}

function extractRoutes(appText, lazyMap) {
  const routes = [];
  const lineRe = /<Route\s+path="([^"]+)"\s+element=\{(.+?)\}\s*\/>/g;
  let match;
  while ((match = lineRe.exec(appText))) {
    const route = match[1];
    const element = match[2];
    let component = null;
    let status = 'unknown';

    const componentMatch = element.match(/<([A-Z][A-Za-z0-9_]*)\s*\/?/);
    if (componentMatch) component = componentMatch[1];

    if (/Navigate\s+to=/.test(element) && !component) status = 'redirect';
    if (/Navigate\s+to=/.test(element) && component === 'Navigate') status = 'redirect';
    if (/isLoggedIn\s*\?/.test(element)) status = 'protected';
    if (component === 'ClientPortal') status = 'public_portal';
    if (route === '/login') status = 'public_auth';
    if (route.startsWith('/ui-preview')) status = 'public_preview';
    if (route === '*') status = 'fallback_redirect';
    if (status === 'unknown' && component && lazyMap.has(component)) status = 'active';

    const file = component && lazyMap.has(component) ? lazyMap.get(component) : null;
    routes.push({ route, component, file, status, element });
  }
  return routes;
}

function extractCssImports(fileText) {
  const imports = [];
  const re = /import\s+['"]([^'"]+\.css)['"];?/g;
  let match;
  while ((match = re.exec(fileText))) imports.push(match[1]);
  return imports;
}

function countRegex(text, regex) {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function analyzeLocalOverrides(text) {
  const reasons = [];
  if (/style=\{\{/.test(text)) reasons.push('inline_style');
  if (/<style[\s>]/i.test(text)) reasons.push('style_tag');
  if (/className=\{`/.test(text)) reasons.push('template_className');
  if (/\b(bg|text|border|ring)-(red|rose|amber|emerald|green)-\d{2,3}\b/.test(text)) reasons.push('semantic_tailwind_color_classes');
  if (/(const|let)\s+\w*(Class|Classes|Tone|Variant|Style)\w*\s*=/.test(text)) reasons.push('local_class_or_tone_map');
  return reasons;
}

function analyzeScreen(row) {
  if (!row.file || !exists(row.file)) {
    return {
      ...row,
      ...Object.fromEntries(uiKeys.map((key) => [key, false])),
      legacyCss: [],
      localOverrides: [],
      sourceStatus: row.file ? 'file_missing' : 'no_runtime_file',
    };
  }

  const text = read(row.file);
  const componentFlags = Object.fromEntries(uiKeys.map((key) => [key, text.includes(key)]));
  const cssImports = extractCssImports(text);
  const legacyCss = cssImports.filter((cssPath) => /legacy|stage|visual|hotfix|temporary|emergency|repair|fix/i.test(cssPath));
  const localOverrides = analyzeLocalOverrides(text);

  return {
    ...row,
    ...componentFlags,
    legacyCss,
    localOverrides,
    sourceStatus: 'read',
  };
}

function bool(value) {
  return value ? 'yes' : 'no';
}

function escapeCell(value) {
  if (Array.isArray(value)) return value.length ? value.join('<br>') : '-';
  if (value === null || value === undefined || value === '') return '-';
  return String(value).replace(/\|/g, '\\|');
}

function createMarkdown(payload) {
  const cols = ['route', 'file', 'status', ...uiKeys, 'legacy CSS', 'local overrides'];
  const lines = [];
  lines.push(`# CloseFlow VS-4 — Active screen layout matrix — 2026-05-09`);
  lines.push('');
  lines.push(`Marker: \`${marker}\``);
  lines.push('');
  lines.push('## Cel');
  lines.push('');
  lines.push('Każdy aktywny ekran ma jawnie przypisane źródła UI. Ten plik jest generowany z `src/App.tsx` oraz plików stron, żeby nie zgadywać ręcznie, które ekrany używają komponentów systemu wizualnego.');
  lines.push('');
  lines.push('## Zakres');
  lines.push('');
  lines.push('- etap audytowy, bez zmian runtime UI;');
  lines.push('- matrix obejmuje route, plik strony, komponenty UI systemu, lokalne importy CSS i lokalne override’y;');
  lines.push('- legacy CSS i lokalne override’y są na tym etapie raportowane, ale nie blokowane;');
  lines.push('- VS-2C-2 pozostaje deferred, brak migracji list pages.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- generated_at: \`${payload.generatedAt}\``);
  lines.push(`- route_count: \`${payload.summary.routeCount}\``);
  lines.push(`- screen_file_count: \`${payload.summary.screenFileCount}\``);
  lines.push(`- rows_with_legacy_css_non_blocking: \`${payload.summary.rowsWithLegacyCss}\``);
  lines.push(`- rows_with_local_overrides_non_blocking: \`${payload.summary.rowsWithLocalOverrides}\``);
  lines.push('');
  lines.push('## Matrix');
  lines.push('');
  lines.push(`| ${cols.join(' |')} |`);
  lines.push(`| ${cols.map(() => '---').join(' |')} |`);
  for (const row of payload.matrix) {
    const values = [
      row.route,
      row.file,
      row.status,
      ...uiKeys.map((key) => bool(row[key])),
      row.legacyCss,
      row.localOverrides,
    ];
    lines.push(`| ${values.map(escapeCell).join(' | ')} |`);
  }
  lines.push('');
  lines.push('## Interpretacja');
  lines.push('');
  lines.push('- `yes` przy komponencie oznacza, że nazwa komponentu występuje w pliku strony. To jest audyt statyczny, nie test runtime renderowania.');
  lines.push('- `legacy CSS` pokazuje lokalne importy CSS wykryte w pliku strony, jeżeli nazwa wygląda jak stage/hotfix/repair/legacy.');
  lines.push('- `local overrides` pokazuje ryzyka utrzymaniowe: inline style, template className, lokalne mapy klas albo ręczne klasy semantycznych kolorów.');
  lines.push('');
  lines.push('## Kryterium zakończenia VS-4');
  lines.push('');
  lines.push('- `docs/ui/closeflow-active-screen-layout-matrix.generated.json` istnieje i zawiera matrix tras.');
  lines.push('- `docs/ui/CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_2026-05-09.md` istnieje i zawiera tabelę matrix.');
  lines.push('- `npm run check:closeflow-active-screen-layout-matrix` przechodzi.');
  lines.push('- Etap nie zmienia runtime UI.');
  lines.push('');
  return lines.join('\n');
}

function main() {
  if (!exists('src/App.tsx')) {
    console.error('CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_VS4_AUDIT_FAIL missing src/App.tsx');
    process.exit(1);
  }

  const appText = read('src/App.tsx');
  const lazyMap = extractLazyImports(appText);
  const routeRows = extractRoutes(appText, lazyMap);
  const matrix = routeRows.map(analyzeScreen);

  const sourceFiles = new Set(matrix.map((row) => row.file).filter(Boolean));
  const payload = {
    marker,
    generatedAt: new Date().toISOString(),
    source: {
      routesFile: 'src/App.tsx',
      routeParser: 'React Router Route path + lazy import static parser',
      runtimeChanges: false,
      vs2c2Migration: 'deferred_not_touched',
    },
    uiColumns: uiKeys,
    summary: {
      routeCount: matrix.length,
      screenFileCount: sourceFiles.size,
      rowsWithLegacyCss: matrix.filter((row) => row.legacyCss && row.legacyCss.length > 0).length,
      rowsWithLocalOverrides: matrix.filter((row) => row.localOverrides && row.localOverrides.length > 0).length,
    },
    matrix,
  };

  write(outJsonRel, JSON.stringify(payload, null, 2) + '\n');
  write(outDocRel, createMarkdown(payload));

  console.log('CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_VS4_AUDIT_OK');
  console.log('route_count=' + payload.summary.routeCount);
  console.log('screen_file_count=' + payload.summary.screenFileCount);
  console.log('rows_with_legacy_css_non_blocking=' + payload.summary.rowsWithLegacyCss);
  console.log('rows_with_local_overrides_non_blocking=' + payload.summary.rowsWithLocalOverrides);
}

main();
