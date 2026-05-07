const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const todayPath = path.join(repo, 'src/pages/TodayStable.tsx');
const pkgPath = path.join(repo, 'package.json');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}

function fail(message) {
  throw new Error(message);
}

function matchBalancedBrace(src, start) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let templateExprDepth = 0;

  for (let i = start; i < src.length; i += 1) {
    const ch = src[i];
    const next = src[i + 1];

    if (lineComment) {
      if (ch === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === '*' && next === '/') {
        blockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (quote === '`' && ch === '$' && next === '{') {
        templateExprDepth += 1;
        i += 1;
        continue;
      }
      if (quote === '`' && templateExprDepth > 0) {
        if (ch === '{') templateExprDepth += 1;
        if (ch === '}') templateExprDepth -= 1;
        continue;
      }
      if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '/' && next === '/') {
      lineComment = true;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      blockComment = true;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function normalizeOldFailedArtifacts() {
  const oldFiles = [
    'scripts/repair-stage16ap-today-view-all-options.cjs',
    'scripts/repair-stage16aq-today-view-all-options.cjs',
    'docs/release/STAGE16AP_TODAY_VIEW_ALL_OPTIONS_REPAIR_2026-05-07.md',
    'docs/release/STAGE16AQ_TODAY_VIEW_ALL_OPTIONS_PATTERNLESS_REPAIR_2026-05-07.md',
  ];
  for (const rel of oldFiles) {
    const full = path.join(repo, rel);
    if (fs.existsSync(full)) fs.rmSync(full, { force: true });
  }
}

function ensureMarker(src) {
  const marker = "const STAGE16AR_TODAY_VIEW_ALL_OPTIONS_FIXED = 'STAGE16AR_TODAY_VIEW_ALL_OPTIONS_FIXED';";
  if (!src.includes(marker)) {
    const anchor = "const STAGE16AN_TODAY_VIEW_CUSTOMIZER = 'STAGE16AN_TODAY_VIEW_CUSTOMIZER';";
    if (src.includes(anchor)) {
      src = src.replace(anchor, anchor + '\n' + marker);
    } else {
      src = src.replace("const TODAY_VIEW_STORAGE_KEY =", marker + '\nconst TODAY_VIEW_STORAGE_KEY =');
    }
  }
  const voidMarker = 'void STAGE16AR_TODAY_VIEW_ALL_OPTIONS_FIXED;';
  if (!src.includes(voidMarker)) {
    const anchor = 'void STAGE16AN_TODAY_VIEW_CUSTOMIZER;';
    if (src.includes(anchor)) {
      src = src.replace(anchor, anchor + '\n' + voidMarker);
    } else {
      src = src.replace('void STAGE16AI_TODAY_TILES_MATCH_LISTS;', 'void STAGE16AI_TODAY_TILES_MATCH_LISTS;\n' + voidMarker);
    }
  }
  return src;
}

function makePanelBlock(indent) {
  const i = indent || '      ';
  const inner = i + '  ';
  const deep = i + '    ';
  return `${i}{todayViewOpen ? (\n${inner}<Card className="border-slate-100 shadow-sm">\n${deep}<CardContent className="space-y-3 p-4">\n${deep}  <div className="flex flex-wrap items-start justify-between gap-3">\n${deep}    <div>\n${deep}      <p className="text-sm font-bold text-slate-900">Widok Dziś</p>\n${deep}      <p className="text-xs font-medium text-slate-500">Wybierz, które kafelki i listy mają być widoczne. Odznaczone opcje nadal zostają na tej liście.</p>\n${deep}    </div>\n${deep}    <Button\n${deep}      type="button"\n${deep}      size="sm"\n${deep}      variant="outline"\n${deep}      onClick={() => {\n${deep}        const allKeys = todayTiles.map((tile) => tile.key);\n${deep}        setVisibleTodaySections(allKeys);\n${deep}        writeTodayVisibleSections(allKeys);\n${deep}        setExpandedSection('all');\n${deep}      }}\n${deep}    >\n${deep}      Pokaż wszystko\n${deep}    </Button>\n${deep}  </div>\n${deep}  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">\n${deep}    {todayTiles.map((tile) => {\n${deep}      const checked = visibleTodaySectionSet.has(tile.key);\n${deep}      return (\n${deep}        <label\n${deep}          key={tile.key}\n${deep}          className={\n${deep}            'flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm transition ' +\n${deep}            (checked ? 'border-slate-300 bg-white text-slate-900 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-500')\n${deep}          }\n${deep}        >\n${deep}          <input\n${deep}            type="checkbox"\n${deep}            className="h-4 w-4 rounded border-slate-300"\n${deep}            checked={checked}\n${deep}            onChange={(event) => {\n${deep}              const shouldShow = event.currentTarget.checked;\n${deep}              if (!shouldShow) {\n${deep}                setExpandedSection((current) => current === tile.key ? 'all' : current);\n${deep}              }\n${deep}              setVisibleTodaySections((current) => {\n${deep}                const base = sanitizeTodayVisibleSections(current);\n${deep}                const next = shouldShow\n${deep}                  ? sanitizeTodayVisibleSections([...base, tile.key])\n${deep}                  : base.filter((key) => key !== tile.key);\n${deep}                writeTodayVisibleSections(next);\n${deep}                return next;\n${deep}              });\n${deep}            }}\n${deep}          />\n${deep}          <span className={'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-slate-100 ' + tile.tone}>\n${deep}            {tile.icon}\n${deep}          </span>\n${deep}          <span className="min-w-0">\n${deep}            <span className="block truncate font-semibold">{tile.title}</span>\n${deep}            <span className="block text-xs text-slate-500">{tile.count} wpisów</span>\n${deep}          </span>\n${deep}        </label>\n${deep}      );\n${deep}    })}\n${deep}  </div>\n${deep}</CardContent>\n${inner}</Card>\n${i}) : null}`;
}

function findTodayViewExpression(src) {
  const returnIdx = src.indexOf('return (');
  const startSearch = returnIdx >= 0 ? returnIdx : 0;
  const re = /\{\s*todayViewOpen\s*(?:\?|&&)\s*\(/g;
  re.lastIndex = startSearch;
  let match;
  while ((match = re.exec(src))) {
    const start = match.index;
    const end = matchBalancedBrace(src, start);
    if (end < 0) continue;
    const block = src.slice(start, end + 1);
    if (block.includes('checkbox') || block.includes('setVisibleTodaySections') || block.includes('Widok') || block.includes('todayTiles') || block.includes('visibleTodaySections')) {
      const lineStart = src.lastIndexOf('\n', start) + 1;
      const indentMatch = src.slice(lineStart, start).match(/^\s*/);
      return { start, end, indent: indentMatch ? indentMatch[0] : '      ' };
    }
  }
  return null;
}

function replacePanel(src) {
  const found = findTodayViewExpression(src);
  if (!found) fail('Today view open JSX expression not found');
  return src.slice(0, found.start) + makePanelBlock(found.indent) + src.slice(found.end + 1);
}

function patchPackageJson() {
  if (!fs.existsSync(pkgPath)) fail('package.json not found');
  const pkg = JSON.parse(read(pkgPath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:today-view-customizer-all-options'] = 'node scripts/check-today-view-customizer-all-options.cjs';
  pkg.scripts['test:today-view-customizer-all-options'] = 'node --test tests/today-view-customizer-all-options.test.cjs';
  write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function patchTodayStable() {
  if (!fs.existsSync(todayPath)) fail('src/pages/TodayStable.tsx not found');
  let src = read(todayPath);
  src = ensureMarker(src);
  src = replacePanel(src);

  if (!src.includes('STAGE16AR_TODAY_VIEW_ALL_OPTIONS_FIXED')) fail('Stage16AR marker missing');
  if (!src.includes('{todayTiles.map((tile) => {')) fail('View panel must map all todayTiles');
  if (!src.includes('const checked = visibleTodaySectionSet.has(tile.key);')) fail('View panel must read checked state from visible set');
  if (!src.includes('writeTodayVisibleSections(next);')) fail('View panel must persist changed visibility');
  if (!src.includes('Pokaż wszystko')) fail('View panel must expose show all action');

  write(todayPath, src);
}

function main() {
  normalizeOldFailedArtifacts();
  patchPackageJson();
  patchTodayStable();
  console.log('OK: Stage16AR Today view all-options final repair applied.');
  console.log('- src/pages/TodayStable.tsx');
  console.log('- package.json');
}

main();
