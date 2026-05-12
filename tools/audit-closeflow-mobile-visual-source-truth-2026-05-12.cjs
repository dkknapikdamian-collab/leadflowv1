#!/usr/bin/env node
/*
  CloseFlow mobile visual source truth audit
  Purpose: find whether mobile top tiles are controlled by the intended CSS layer
  or by older/hotfix/stage visual files/components.
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DATE = '2026-05-12';
const REPORT = path.join(ROOT, 'docs', 'release', `CLOSEFLOW_MOBILE_VISUAL_SOURCE_TRUTH_AUDIT_${DATE}.md`);
const JSON_REPORT = path.join(ROOT, 'docs', 'release', `closeflow_mobile_visual_source_truth_audit_${DATE}.json`);

function exists(p) { return fs.existsSync(path.join(ROOT, p)); }
function readRel(p) {
  const full = path.join(ROOT, p);
  if (!fs.existsSync(full)) return '';
  return fs.readFileSync(full, 'utf8');
}
function listFiles(dir, exts) {
  const out = [];
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return out;
  const walk = (p) => {
    for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
      const fp = path.join(p, ent.name);
      if (ent.isDirectory()) {
        if (['node_modules', 'dist', '.git', '.vercel'].includes(ent.name)) continue;
        walk(fp);
      } else if (!exts || exts.includes(path.extname(ent.name))) {
        out.push(path.relative(ROOT, fp).replace(/\\/g, '/'));
      }
    }
  };
  walk(full);
  return out.sort();
}
function linesWith(content, re, max = 20) {
  const lines = content.split(/\r?\n/);
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i])) hits.push({ line: i + 1, text: lines[i].trim().slice(0, 240) });
    if (hits.length >= max) break;
  }
  return hits;
}
function grepFiles(files, re, maxPerFile = 10) {
  const result = [];
  for (const file of files) {
    const content = readRel(file);
    const hits = linesWith(content, re, maxPerFile);
    if (hits.length) result.push({ file, hits });
  }
  return result;
}
function mdList(items, empty = '_brak_') {
  if (!items || items.length === 0) return empty;
  return items.map((x) => `- \`${x}\``).join('\n');
}
function mdHits(groups, empty = '_brak trafień_') {
  if (!groups || groups.length === 0) return empty;
  return groups.map(g => {
    const body = g.hits.map(h => `  - L${h.line}: \`${h.text.replace(/`/g, '\\`')}\``).join('\n');
    return `- \`${g.file}\`\n${body}`;
  }).join('\n');
}
function extractCssImports(content) {
  const imports = [];
  const re = /@import\s+["']([^"']+)["'];?/g;
  let m;
  while ((m = re.exec(content))) imports.push(m[1]);
  return imports;
}
function packageScriptNames() {
  try {
    const pkg = JSON.parse(readRel('package.json'));
    return Object.keys(pkg.scripts || {}).sort();
  } catch {
    return [];
  }
}

const srcFiles = listFiles('src', ['.ts', '.tsx', '.js', '.jsx', '.css']);
const tsxFiles = srcFiles.filter(f => /\.(tsx|jsx|ts|js)$/.test(f));
const cssFiles = srcFiles.filter(f => f.endsWith('.css'));
const styleFiles = cssFiles.filter(f => f.startsWith('src/styles/'));
const indexCss = readRel('src/index.css');
const cssImports = extractCssImports(indexCss);

const routeHits = grepFiles(['src/App.tsx', 'src/main.tsx', ...tsxFiles.filter(f => /route|router|layout|shell|app/i.test(f))], /TodayStable|Today\b|\/today|path\s*[:=]\s*["']\/|element=.*Today/i, 12);
const todayCandidates = tsxFiles.filter(f => /Today/i.test(path.basename(f)) || /TodayStable/i.test(readRel(f)) || /Centrum dnia|Do zrobienia dziś|Dziś/.test(readRel(f)));
const tileComponentHits = grepFiles(tsxFiles, /StatShortcutCard|OperatorMetricTiles|CloseFlowPageHeaderV2|data-cf-mobile-start-tile-trim|Centrum dnia|href=["']\/leads|to=["']\/leads|Leady|Zadania|Kalendarz/i, 20);
const mobileTrimHits = grepFiles(srcFiles, /cf-mobile-start-tile|mobile-start-tile-trim|data-cf-mobile-start-tile-trim|CLOSEFLOW_MOBILE_HIDE_TOP_TILES|hide top start tiles/i, 40);
const mobileMediaHits = grepFiles(cssFiles, /@media\s*\([^)]*(max-width|max-width:\s*767|max-width:\s*768|max-width:\s*900|max-width:\s*1023)|@media\s*\([^)]*pointer|@media\s*\([^)]*hover/i, 20);
const displayImportantHits = grepFiles(cssFiles, /display\s*:\s*(grid|flex|block)\s*!important|visibility\s*:\s*visible\s*!important|opacity\s*:\s*1\s*!important/i, 15);
const hidingHits = grepFiles(cssFiles, /display\s*:\s*none\s*!important|visibility\s*:\s*hidden|height\s*:\s*0|overflow\s*:\s*hidden/i, 20);
const legacyVisualFiles = styleFiles.filter(f => /hotfix|legacy|stage|repair|vnext|visual|elite|skin|page-header|metric|calendar|tile|mobile|desktop|source-truth|freeze|debug/i.test(path.basename(f)));
const visualClassHits = grepFiles(cssFiles, /cf-page-hero|cf-page-header|cf-stat|StatShortcutCard|operator-metric|metric-tile|shortcut|quick-action|top-start|hero-aside|today|mobile/i, 30);
const packageScripts = packageScriptNames().filter(s => /mobile|visual|tile|style|calendar|today|header|metric|ui|repair|stage/i.test(s));

const hardFindings = [];
if (!exists('src/styles/closeflow-mobile-start-tile-trim.css')) hardFindings.push('Brak `src/styles/closeflow-mobile-start-tile-trim.css`.');
if (!indexCss.includes('closeflow-mobile-start-tile-trim.css')) hardFindings.push('`src/index.css` nie importuje `closeflow-mobile-start-tile-trim.css`.');
const hasDataAttrInTsx = grepFiles(tsxFiles, /data-cf-mobile-start-tile-trim\s*=/, 5).length > 0;
if (!hasDataAttrInTsx) hardFindings.push('Brak `data-cf-mobile-start-tile-trim` w plikach TSX/JSX. Obecna poprawka opiera się na CSS fallbackach, a nie na twardo oznaczonym wrapperze.');
if (legacyVisualFiles.length >= 20) hardFindings.push(`Dużo plików stylu o nazwach hotfix/stage/repair/visual/metric/mobile: ${legacyVisualFiles.length}. To nie znaczy automatycznie błąd, ale podnosi ryzyko konfliktów i nadpisywania.`);
if (displayImportantHits.length > 0) hardFindings.push('W CSS istnieją reguły z `display: grid/flex/block !important` lub podobne. Mogą przebić mobile hide, jeśli są później w kolejności importu albo mają mocniejszy selektor.');

const likelyTodayFiles = todayCandidates.slice(0, 30);

const verdict = hasDataAttrInTsx
  ? 'LEPIEJ: w kodzie znaleziono twardy atrybut wrappera `data-cf-mobile-start-tile-trim`. CSS może celować w konkretny blok.'
  : 'RYZYKO: nie znaleziono twardego atrybutu wrappera w TSX/JSX. Jeśli kafle nadal widać, trzeba wejść w realny komponent Today/TodayStable i oznaczyć dokładny wrapper, zamiast dokładać kolejne fallbacki CSS.';

const json = {
  date: DATE,
  repo: ROOT,
  verdict,
  hardFindings,
  cssImports,
  likelyTodayFiles,
  legacyVisualFiles,
  packageScripts,
  counts: {
    srcFiles: srcFiles.length,
    cssFiles: cssFiles.length,
    styleFiles: styleFiles.length,
    legacyVisualFiles: legacyVisualFiles.length,
    routeHits: routeHits.length,
    tileComponentHits: tileComponentHits.length,
    mobileTrimHits: mobileTrimHits.length,
    mobileMediaHits: mobileMediaHits.length,
    displayImportantHits: displayImportantHits.length,
    hidingHits: hidingHits.length,
  },
};

const md = `# CloseFlow — Mobile Visual Source Truth Audit — ${DATE}

## Cel

Sprawdzić, czy problem z widocznością górnych kafelków na telefonie wynika z:

- starej logiki wizualnej,
- wielu warstw CSS/hotfix/stage,
- aktywnego komponentu innego niż zakładany,
- braku twardego wrappera w TSX,
- konfliktu reguł CSS.

Ten audyt **nie zmienia UI aplikacji**. Zostawia tylko raport i skrypt diagnostyczny.

## Werdykt

${verdict}

## Najważniejsze ryzyka / ustalenia

${hardFindings.length ? hardFindings.map(x => `- ${x}`).join('\n') : '- Brak twardych czerwonych flag z automatycznej inspekcji.'}

## Aktywne/importowane CSS z \`src/index.css\`

${mdList(cssImports)}

## Kandydaci na aktywny widok Today / Dziś

${mdList(likelyTodayFiles)}

## Trafienia routingu / renderowania Today

${mdHits(routeHits)}

## Trafienia komponentów kafelków / skrótów / nagłówków

${mdHits(tileComponentHits)}

## Obecny stan mobile tile trim

${mdHits(mobileTrimHits)}

## Pliki stylów potencjalnie historyczne / warstwowe / ryzykowne

${mdList(legacyVisualFiles)}

## Mobile media queries w CSS

${mdHits(mobileMediaHits)}

## Reguły CSS, które mogą przebijać ukrywanie

${mdHits(displayImportantHits)}

## Reguły CSS ukrywające elementy

${mdHits(hidingHits)}

## Skrypty package.json związane z UI/mobile/style/tile

${mdList(packageScripts)}

## Decyzja techniczna po audycie

1. Jeśli kafelki zniknęły po repair2: zostawić obecne CSS jako hotfix, ale przy najbliższym porządku dodać twardy wrapper w realnym komponencie Today/TodayStable.
2. Jeśli kafelki nadal są widoczne: nie dodawać kolejnego blind CSS. Otworzyć plik wskazany w sekcji „Kandydaci na aktywny widok Today / Dziś”, znaleźć blok renderujący kafelki i dodać dokładnie tam:

\`\`\`tsx
data-cf-mobile-start-tile-trim="true"
\`\`\`

3. Następnie CSS mobile powinien celować tylko w:

\`\`\`css
@media (max-width: 767px) {
  [data-cf-mobile-start-tile-trim="true"] {
    display: none !important;
  }
}
\`\`\`

## Kryterium zamknięcia problemu

- mobile: górne kafelki startowe nie są widoczne na pierwszym ekranie,
- desktop: kafelki nadal są widoczne,
- kod: istnieje jedno twarde źródło prawdy, czyli wrapper oznaczony atrybutem w komponencie, a nie wyłącznie zgadywanie po klasach CSS,
- repo: brak nieśledzonych plików po wdrożeniu.

## JSON evidence

Raport maszynowy: \`docs/release/closeflow_mobile_visual_source_truth_audit_${DATE}.json\`
`;

fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, md, 'utf8');
fs.writeFileSync(JSON_REPORT, JSON.stringify(json, null, 2), 'utf8');

console.log('CLOSEFLOW_MOBILE_VISUAL_SOURCE_TRUTH_AUDIT_OK');
console.log(JSON.stringify({
  report: path.relative(ROOT, REPORT).replace(/\\/g, '/'),
  json: path.relative(ROOT, JSON_REPORT).replace(/\\/g, '/'),
  verdict,
  hardFindings,
  counts: json.counts,
}, null, 2));

// Never fail the build by design. This is evidence-gathering, not an app gate.
process.exit(0);
