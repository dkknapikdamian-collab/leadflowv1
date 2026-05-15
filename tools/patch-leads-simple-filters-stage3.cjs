const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const leadsPath = path.join(repo, 'src', 'pages', 'Leads.tsx');
const testsDir = path.join(repo, 'tests');
const auditsDir = path.join(repo, 'docs', 'audits');
const testPath = path.join(testsDir, 'stage82-leads-simple-filters-card.test.cjs');
const reportPath = path.join(auditsDir, 'leads-simple-filters-stage3-2026-05-15.md');

function fail(message) {
  throw new Error(message);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`Missing file: ${path.relative(repo, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function ensureOperatorRailImport(source) {
  const importRe = /import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\.\/components\/operator-rail['"];?/m;
  const match = source.match(importRe);

  if (match) {
    const names = match[1]
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
    const set = new Set(names);
    set.add('SimpleFiltersCard');
    set.add('TopValueRecordsCard');
    const ordered = Array.from(set).sort((a, b) => a.localeCompare(b));
    const replacement = `import { ${ordered.join(', ')} } from '../components/operator-rail';`;
    return source.replace(importRe, replacement);
  }

  const firstImportEnd = source.indexOf('\n');
  if (firstImportEnd < 0) fail('Cannot insert operator-rail import; file has no newline.');
  return `${source.slice(0, firstImportEnd + 1)}import { SimpleFiltersCard, TopValueRecordsCard } from '../components/operator-rail';\n${source.slice(firstImportEnd + 1)}`;
}

function insertSimpleFiltersCard(source) {
  if (source.includes('dataTestId="leads-simple-filters-card"') || source.includes("dataTestId='leads-simple-filters-card'")) {
    return source;
  }

  const titleIndex = source.indexOf('title="Najcenniejsze leady"');
  if (titleIndex < 0) {
    fail('Cannot find TopValueRecordsCard title="Najcenniejsze leady" in src/pages/Leads.tsx.');
  }

  const cardStart = source.lastIndexOf('<TopValueRecordsCard', titleIndex);
  if (cardStart < 0) {
    fail('Cannot find <TopValueRecordsCard before title="Najcenniejsze leady".');
  }

  const lineStart = source.lastIndexOf('\n', cardStart) + 1;
  const linePrefix = source.slice(lineStart, cardStart).match(/^\s*/)?.[0] || '        ';
  const inner = `${linePrefix}  `;
  const deeper = `${linePrefix}    `;
  const item = `${linePrefix}      `;
  const body = `${linePrefix}        `;

  const block = [
    `${linePrefix}<SimpleFiltersCard`,
    `${inner}title="Filtry proste"`,
    `${inner}description="Bez przesady, tylko najpotrzebniejsze."`,
    `${inner}dataTestId="leads-simple-filters-card"`,
    `${inner}items={[`,
    `${deeper}{`,
    `${item}key: 'active',`,
    `${item}label: 'Aktywne',`,
    `${item}value: stats.active,`,
    `${item}onClick: () => {`,
    `${body}setShowTrash(false);`,
    `${body}setQuickFilter('active');`,
    `${body}setValueSortEnabled(false);`,
    `${item}},`,
    `${deeper}},`,
    `${deeper}{`,
    `${item}key: 'at-risk',`,
    `${item}label: 'Zagrożone',`,
    `${item}value: stats.atRisk,`,
    `${item}onClick: () => {`,
    `${body}setShowTrash(false);`,
    `${body}setQuickFilter('at-risk');`,
    `${body}setValueSortEnabled(false);`,
    `${item}},`,
    `${deeper}},`,
    `${deeper}{`,
    `${item}key: 'history',`,
    `${item}label: 'Historia',`,
    `${item}value: stats.linkedToCase,`,
    `${item}onClick: () => {`,
    `${body}setShowTrash(false);`,
    `${body}setQuickFilter('history');`,
    `${body}setValueSortEnabled(false);`,
    `${item}},`,
    `${deeper}},`,
    `${deeper}{`,
    `${item}key: 'trash',`,
    `${item}label: 'Kosz',`,
    `${item}value: stats.trash,`,
    `${item}onClick: () => {`,
    `${body}setShowTrash(true);`,
    `${body}setQuickFilter('all');`,
    `${body}setValueSortEnabled(false);`,
    `${item}},`,
    `${deeper}},`,
    `${inner}]}`,
    `${linePrefix}/>`
  ].join('\n') + '\n\n';

  return `${source.slice(0, lineStart)}${block}${source.slice(lineStart)}`;
}

function verifySource(source) {
  const required = [
    'SimpleFiltersCard',
    'TopValueRecordsCard',
    'dataTestId="leads-simple-filters-card"',
    'title="Filtry proste"',
    'description="Bez przesady, tylko najpotrzebniejsze."',
    "key: 'active'",
    "label: 'Aktywne'",
    'value: stats.active',
    "setQuickFilter('active')",
    "key: 'at-risk'",
    "label: 'Zagrożone'",
    'value: stats.atRisk',
    "setQuickFilter('at-risk')",
    "key: 'history'",
    "label: 'Historia'",
    'value: stats.linkedToCase',
    "setQuickFilter('history')",
    "key: 'trash'",
    "label: 'Kosz'",
    'value: stats.trash',
    'setShowTrash(true)',
    "setQuickFilter('all')",
    'title="Najcenniejsze leady"'
  ];

  for (const marker of required) {
    if (!source.includes(marker)) fail(`Missing marker after patch: ${marker}`);
  }

  const simpleIndex = source.indexOf('dataTestId="leads-simple-filters-card"');
  const topIndex = source.indexOf('title="Najcenniejsze leady"');
  if (!(simpleIndex >= 0 && topIndex >= 0 && simpleIndex < topIndex)) {
    fail('SimpleFiltersCard must be rendered before TopValueRecordsCard / Najcenniejsze leady.');
  }
}

let source = read(leadsPath);
source = ensureOperatorRailImport(source);
source = insertSimpleFiltersCard(source);
verifySource(source);
write(leadsPath, source);

const testContent = `const fs = require('fs');\nconst path = require('path');\n\nconst repo = path.resolve(__dirname, '..');\nconst source = fs.readFileSync(path.join(repo, 'src', 'pages', 'Leads.tsx'), 'utf8');\n\nfunction assert(condition, message) {\n  if (!condition) {\n    console.error('FAIL:', message);\n    process.exit(1);\n  }\n}\n\nassert(source.includes('SimpleFiltersCard'), 'Leads.tsx must import/use SimpleFiltersCard.');\nassert(source.includes('TopValueRecordsCard'), 'Leads.tsx must still use TopValueRecordsCard.');\nassert(source.includes('dataTestId="leads-simple-filters-card"'), 'Missing leads simple filters dataTestId.');\nassert(source.includes('title="Filtry proste"'), 'Missing simple filters title.');\nassert(source.includes('description="Bez przesady, tylko najpotrzebniejsze."'), 'Missing simple filters description.');\nassert(source.includes("label: 'Aktywne'"), 'Missing Aktywne filter.');\nassert(source.includes("label: 'Zagrożone'"), 'Missing Zagrozone filter.');\nassert(source.includes("label: 'Historia'"), 'Missing Historia filter.');\nassert(source.includes("label: 'Kosz'"), 'Missing Kosz filter.');\nassert(source.includes('value: stats.active'), 'Aktywne must use stats.active.');\nassert(source.includes('value: stats.atRisk'), 'Zagrozone must use stats.atRisk.');\nassert(source.includes('value: stats.linkedToCase'), 'Historia must use stats.linkedToCase.');\nassert(source.includes('value: stats.trash'), 'Kosz must use stats.trash.');\nassert(source.includes("setQuickFilter('active')"), 'Aktywne must set quick filter active.');\nassert(source.includes("setQuickFilter('at-risk')"), 'Zagrozone must set quick filter at-risk.');\nassert(source.includes("setQuickFilter('history')"), 'Historia must set quick filter history.');\nassert(source.includes("setQuickFilter('all')"), 'Kosz must reset quick filter to all.');\nassert(source.includes('setShowTrash(true)'), 'Kosz must enable trash view.');\n\nconst simpleIndex = source.indexOf('dataTestId="leads-simple-filters-card"');\nconst topIndex = source.indexOf('title="Najcenniejsze leady"');\nassert(simpleIndex >= 0 && topIndex >= 0 && simpleIndex < topIndex, 'Filtry proste must render before Najcenniejsze leady.');\n\nconsole.log('OK tests/stage82-leads-simple-filters-card.test.cjs');\n`;
write(testPath, testContent);

const report = [
  '# CloseFlow Stage82 / Etap 3 - Leads simple filters',
  '',
  'Status: applied locally, commit/push skipped by request.',
  '',
  'Scope:',
  '- src/pages/Leads.tsx',
  '- tests/stage82-leads-simple-filters-card.test.cjs',
  '- tools/patch-clients-top-value-stage2.cjs is not touched by this stage',
  '',
  'What changed:',
  '- /leads now uses SimpleFiltersCard in the right rail.',
  '- The simple filters card is rendered before Najcenniejsze leady.',
  '- The top stat cards are not intentionally changed by this patch.',
  '',
  'Manual check:',
  '- Open /leads.',
  '- Right rail should show: Filtry proste, then Najcenniejsze leady.',
  '- Click Aktywne, Zagrozone, Historia, Kosz and confirm the list/filter behavior still works.',
].join('\n') + '\n';
write(reportPath, report);

console.log('OK: Stage82 / Etap 3 leads simple filters patch applied.');
