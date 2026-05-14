#!/usr/bin/env node
/*
  Stage 1 audit: right rail / side card style source map.
  This script is intentionally read-only for UI. It scans source files and writes an audit report.
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'docs', 'audits');
const OUT_JSON = path.join(OUT_DIR, 'right-rail-card-style-map.json');
const OUT_MD = path.join(OUT_DIR, 'right-rail-card-style-map.md');
const CHECK_MODE = process.argv.includes('--check');

const WATCHED_SELECTORS = [
  'right-card',
  'lead-right-card',
  'lead-top-relations',
  'cases-shortcuts-rail-card',
  'cases-risk-rail-card',
  'clients-right-rail',
];

const PRIORITY_FILES = [
  'src/pages/Leads.tsx',
  'src/pages/Cases.tsx',
  'src/pages/Clients.tsx',
  'src/components/StatShortcutCard.tsx',
  'src/components/ui-system/index.ts',
  'src/styles/page-adapters.css',
];

const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.pcss', '.html']);
const CSS_EXTENSIONS = new Set(['.css', '.scss', '.pcss']);
const TSX_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);
const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.vercel']);

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function existsRel(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (TEXT_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function readFileSafe(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch (_) { return ''; }
}

function lineNumberAt(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compact(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseCssRules(content, file) {
  const rules = [];
  const withoutComments = content.replace(/\/\*[\s\S]*?\*\//g, '');
  const ruleRegex = /([^{}]+)\{([^{}]*)\}/g;
  let match;
  while ((match = ruleRegex.exec(withoutComments))) {
    const selector = compact(match[1]);
    const body = match[2];
    const declarations = {};
    for (const line of body.split(';')) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const prop = line.slice(0, idx).trim().toLowerCase();
      const val = line.slice(idx + 1).trim();
      if (prop) declarations[prop] = val;
    }
    rules.push({
      file: rel(file),
      line: lineNumberAt(withoutComments, match.index),
      selector,
      declarations,
      body: compact(body),
    });
  }
  return rules;
}

function extractBackground(rule) {
  const d = rule.declarations || {};
  const bgKeys = [
    'background',
    'background-color',
    'background-image',
    '--background',
    '--card-background',
    '--card-bg',
    '--cf-card-bg',
    '--cf-surface-card',
  ];
  const hits = [];
  for (const key of bgKeys) {
    if (d[key]) hits.push(`${key}: ${d[key]}`);
  }
  return hits.length ? hits.join('; ') : 'brak jawnego tła w tej regule';
}

function looksDark(rule) {
  const text = `${rule.selector} ${rule.body}`.toLowerCase();
  return /#0[0-9a-f]{2,6}|#111|#121|#151|#181|rgb\(\s*(0|1[0-9]|2[0-9]|3[0-9])\s*,\s*(0|1[0-9]|2[0-9]|3[0-9])\s*,\s*(0|1[0-9]|2[0-9]|3[0-9])|rgba\(\s*(0|1[0-9]|2[0-9]|3[0-9])\s*,\s*(0|1[0-9]|2[0-9]|3[0-9])\s*,\s*(0|1[0-9]|2[0-9]|3[0-9])|dark|black|slate-9|zinc-9|neutral-9/.test(text);
}

function classifyRule(rule, selector) {
  const file = rule.file.toLowerCase();
  const sel = rule.selector.toLowerCase();
  const tags = [];
  if (file.includes('stage') || file.includes('visual') || file.includes('adapter')) tags.push('stary/stage CSS albo adapter');
  if (sel.includes('.right-card')) tags.push('globalne .right-card');
  if (sel.includes(`.${selector.toLowerCase()}`)) tags.push('lokalna klasa selektora');
  if (sel.includes('.cf-html-view')) tags.push('wrapper .cf-html-view');
  if (sel.includes('shell') || sel.includes('layout') || sel.includes('app-frame')) tags.push('dark shell / layout wrapper');
  if (looksDark(rule)) tags.push('deklaracja wygląda na ciemne tło/ciemny shell');
  return tags;
}

function findImports(fileContent) {
  const imports = [];
  const importRegex = /@import\s+(?:url\()?['"]?([^'";)]+)['"]?\)?\s*;/g;
  let match;
  while ((match = importRegex.exec(fileContent))) {
    imports.push(match[1]);
  }
  return imports;
}

function findUsages(content, file, selector) {
  const usages = [];
  const regex = new RegExp(escapeRegex(selector), 'g');
  let match;
  while ((match = regex.exec(content))) {
    const line = lineNumberAt(content, match.index);
    const lineText = content.split(/\r?\n/)[line - 1] || '';
    usages.push({
      file: rel(file),
      line,
      snippet: compact(lineText).slice(0, 220),
      context: TSX_EXTENSIONS.has(path.extname(file))
        ? (lineText.includes('className') ? 'inline/className' : 'TS/TSX reference')
        : (CSS_EXTENSIONS.has(path.extname(file)) ? 'CSS rule/reference' : 'text reference'),
    });
  }
  return usages;
}

function targetBackgroundFor(selector) {
  // This is not an implementation decision. It is the audit target to keep the next stage consistent.
  if (selector === 'lead-top-relations') return 'docelowo: wspólne jasne tło karty relacji z jednego tokena UI, bez lokalnego czarnego override';
  if (selector.includes('risk')) return 'docelowo: jasna karta + kolor ryzyka tylko na badge/akcentach, nie pełne czarne tło';
  return 'docelowo: wspólne jasne tło bocznej karty z jednego źródła prawdy, nie lokalny/stage CSS';
}

function main() {
  const files = uniqueBy([
    ...PRIORITY_FILES.map(p => path.join(ROOT, p)).filter(fs.existsSync),
    ...walk(path.join(ROOT, 'src')),
    ...walk(path.join(ROOT, 'app')),
    ...walk(path.join(ROOT, 'components')),
    ...walk(path.join(ROOT, 'lib')),
  ], f => path.resolve(f));

  const cssFiles = files.filter(f => CSS_EXTENSIONS.has(path.extname(f)));
  const allCssRules = [];
  const cssImports = [];
  for (const file of cssFiles) {
    const content = readFileSafe(file);
    for (const imp of findImports(content)) cssImports.push({ file: rel(file), import: imp });
    allCssRules.push(...parseCssRules(content, file));
  }

  const selectorReports = WATCHED_SELECTORS.map(selector => {
    const allUsages = [];
    for (const file of files) {
      const content = readFileSafe(file);
      if (!content.includes(selector)) continue;
      allUsages.push(...findUsages(content, file, selector));
    }

    const tsxUsages = allUsages.filter(u => /\.(tsx|ts|jsx|js)$/.test(u.file));
    const cssUsages = allUsages.filter(u => /\.(css|scss|pcss)$/.test(u.file));
    const cssRules = allCssRules.filter(rule => {
      const s = rule.selector;
      return s.includes(`.${selector}`) || (selector === 'right-card' && s.includes('right-card'));
    }).map(rule => ({
      file: rule.file,
      line: rule.line,
      selector: rule.selector,
      background: extractBackground(rule),
      suspectedSources: classifyRule(rule, selector),
      declarations: Object.fromEntries(Object.entries(rule.declarations).filter(([k]) => /background|color|border|shadow|surface|card/.test(k))),
    }));

    const suspectedSources = new Set();
    if (tsxUsages.some(u => u.context === 'inline/className')) suspectedSources.add('inline className w TSX');
    for (const rule of cssRules) for (const tag of rule.suspectedSources) suspectedSources.add(tag);
    if (cssRules.length === 0 && tsxUsages.length > 0) suspectedSources.add('klasa używana w TSX, brak jawnej reguły CSS w skanie');

    const backgrounds = uniqueBy(cssRules.map(r => `${r.file}:${r.line} -> ${r.background}`), x => x);

    return {
      selector,
      tsxFiles: uniqueBy(tsxUsages.map(u => u.file), x => x),
      cssFiles: uniqueBy(cssRules.map(r => r.file), x => x),
      usageCount: allUsages.length,
      tsxUsages: uniqueBy(tsxUsages, u => `${u.file}:${u.line}:${u.snippet}`),
      cssUsages: uniqueBy(cssUsages, u => `${u.file}:${u.line}:${u.snippet}`),
      cssRules,
      currentBackgrounds: backgrounds.length ? backgrounds : ['brak jawnego background/background-color w znalezionych regułach'],
      targetBackground: targetBackgroundFor(selector),
      suspectedSources: [...suspectedSources],
    };
  });

  const report = {
    generatedAt: new Date().toISOString(),
    root: ROOT,
    checkMode: CHECK_MODE,
    priorityFiles: PRIORITY_FILES.map(p => ({ path: p, exists: existsRel(p) })),
    watchedSelectors: WATCHED_SELECTORS,
    cssImports: uniqueBy(cssImports, x => `${x.file}:${x.import}`),
    selectors: selectorReports,
    conclusion: buildConclusion(selectorReports),
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), 'utf8');
  fs.writeFileSync(OUT_MD, renderMarkdown(report), 'utf8');

  console.log(`OK: zapisano ${path.relative(ROOT, OUT_MD)}`);
  console.log(`OK: zapisano ${path.relative(ROOT, OUT_JSON)}`);
  console.log('Skrót:');
  for (const item of selectorReports) {
    console.log(`- ${item.selector}: TSX=${item.tsxFiles.length}, CSS=${item.cssFiles.length}, sources=${item.suspectedSources.join(', ') || 'brak'}`);
  }
}

function buildConclusion(selectorReports) {
  const rows = selectorReports.map(item => {
    const global = item.suspectedSources.includes('globalne .right-card');
    const stage = item.suspectedSources.some(s => s.includes('stage'));
    const dark = item.suspectedSources.some(s => s.includes('ciemne'));
    let status = 'nieustalone';
    if (dark && stage) status = 'prawdopodobnie stary/stage CSS z ciemnym tłem';
    else if (dark && global) status = 'prawdopodobnie globalne .right-card albo dark shell';
    else if (dark) status = 'prawdopodobnie lokalna reguła z ciemnym tłem';
    else if (item.cssRules.length) status = 'reguły znalezione, brak oczywistego ciemnego tła';
    else if (item.tsxUsages.length) status = 'użycie w TSX bez jawnej reguły CSS w skanie';
    return { selector: item.selector, status };
  });
  return rows;
}

function renderMarkdown(report) {
  const lines = [];
  lines.push('# Audyt źródeł bocznych kart i starych styli');
  lines.push('');
  lines.push(`Wygenerowano: ${report.generatedAt}`);
  lines.push(`Repo: ${report.root}`);
  lines.push('');
  lines.push('## Zakres');
  lines.push('');
  lines.push('Ten audyt nie zmienia UI. Celem jest wskazanie, skąd realnie biorą się style bocznych kart i czarne tła.');
  lines.push('');
  lines.push('## Pliki priorytetowe');
  lines.push('');
  lines.push('| Plik | Istnieje |');
  lines.push('|---|---:|');
  for (const p of report.priorityFiles) lines.push(`| \`${p.path}\` | ${p.exists ? 'tak' : 'nie'} |`);
  lines.push('');
  lines.push('## Mapa selector -> TSX -> CSS -> aktualne tło -> docelowe tło');
  lines.push('');
  lines.push('| Selector | Pliki TSX | Pliki CSS | Aktualne tło | Docelowe tło | Podejrzane źródło |');
  lines.push('|---|---|---|---|---|---|');
  for (const item of report.selectors) {
    const tsx = item.tsxFiles.length ? item.tsxFiles.map(f => `\`${f}\``).join('<br>') : 'brak';
    const css = item.cssFiles.length ? item.cssFiles.map(f => `\`${f}\``).join('<br>') : 'brak';
    const bg = item.currentBackgrounds.map(b => `\`${b.replace(/`/g, '')}\``).join('<br>');
    const suspected = item.suspectedSources.length ? item.suspectedSources.join('<br>') : 'brak';
    lines.push(`| \`.${item.selector}\` | ${tsx} | ${css} | ${bg} | ${item.targetBackground} | ${suspected} |`);
  }
  lines.push('');
  lines.push('## Wnioski automatyczne');
  lines.push('');
  for (const c of report.conclusion) lines.push(`- \`.${c.selector}\`: ${c.status}`);
  lines.push('');
  lines.push('## Szczegóły reguł CSS');
  lines.push('');
  for (const item of report.selectors) {
    lines.push(`### .${item.selector}`);
    lines.push('');
    if (!item.cssRules.length) {
      lines.push('Brak znalezionych jawnych reguł CSS dla tego selektora.');
      lines.push('');
    } else {
      for (const rule of item.cssRules) {
        lines.push(`- \`${rule.file}:${rule.line}\` — \`${rule.selector.replace(/`/g, '')}\``);
        lines.push(`  - tło: \`${rule.background.replace(/`/g, '')}\``);
        if (rule.suspectedSources.length) lines.push(`  - źródła: ${rule.suspectedSources.join(', ')}`);
      }
      lines.push('');
    }
    if (item.tsxUsages.length) {
      lines.push('Użycia TSX/JS:');
      for (const usage of item.tsxUsages.slice(0, 25)) {
        lines.push(`- \`${usage.file}:${usage.line}\` — ${usage.context} — \`${usage.snippet.replace(/`/g, '')}\``);
      }
      if (item.tsxUsages.length > 25) lines.push(`- ...oraz ${item.tsxUsages.length - 25} kolejnych użyć`);
      lines.push('');
    }
  }
  lines.push('## Importy CSS znalezione w skanie');
  lines.push('');
  if (!report.cssImports.length) lines.push('Brak importów CSS wykrytych przez prosty parser.');
  for (const imp of report.cssImports) lines.push(`- \`${imp.file}\` importuje \`${imp.import}\``);
  lines.push('');
  lines.push('## Kryterium zakończenia Etapu 1');
  lines.push('');
  lines.push('Etap 1 jest zakończony, gdy ten raport jasno pokazuje, czy problem tła jest globalny, lokalny, ze starego stage CSS, wrappera `.cf-html-view`, dark shell albo inline `className`. Dopiero po tym wolno przejść do zmiany styli.');
  lines.push('');
  return lines.join('\n');
}

try {
  main();
} catch (err) {
  console.error('ERROR: audit-right-rail-card-styles failed');
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}
