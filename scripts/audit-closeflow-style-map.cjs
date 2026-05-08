const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outDir = path.join(root, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

const scanDirs = ['src'];
const exts = new Set(['.css', '.tsx', '.ts', '.jsx', '.js']);
function walk(dir, acc = []) {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) return acc;
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    const full = path.join(fullDir, entry.name);
    if (entry.isDirectory()) walk(path.relative(root, full), acc);
    else if (exts.has(path.extname(entry.name))) acc.push(full);
  }
  return acc;
}
function rel(file) { return path.relative(root, file).replace(/\\/g, '/'); }
function lineNo(text, idx) { return text.slice(0, idx).split(/\r?\n/).length; }

const files = scanDirs.flatMap(d => walk(d));
const result = {
  generatedAt: new Date().toISOString(),
  cssVariables: [],
  dangerColorClasses: [],
  inlineStyles: [],
  localStyleRisk: [],
  metricTileTokens: [],
};

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const r = rel(file);
  let m;
  const cssVarRegex = /(--[a-zA-Z0-9_-]+)\s*:/g;
  while ((m = cssVarRegex.exec(text))) {
    const entry = { name: m[1], file: r, line: lineNo(text, m.index) };
    result.cssVariables.push(entry);
    if (m[1].includes('metric') || m[1].includes('action') || m[1].includes('danger') || m[1].includes('destructive')) {
      result.metricTileTokens.push(entry);
    }
  }

  const dangerRegex = /(text|bg|border|ring)-(red|rose)-[0-9]{2,3}/g;
  while ((m = dangerRegex.exec(text))) {
    result.dangerColorClasses.push({ className: m[0], file: r, line: lineNo(text, m.index) });
  }

  const styleRegex = /style=\{\{/g;
  while ((m = styleRegex.exec(text))) {
    result.inlineStyles.push({ file: r, line: lineNo(text, m.index) });
  }

  if (/fix|repair|hotfix|vnext|override/i.test(r) || /fix|repair|hotfix|vnext|override/i.test(text)) {
    result.localStyleRisk.push({ file: r });
  }
}

const md = [];
md.push('# CloseFlow Style Map — generated');
md.push('');
md.push(`Generated: ${result.generatedAt}`);
md.push('');
md.push('## CSS variables');
for (const item of result.cssVariables.slice(0, 500)) md.push(`- ${item.name}: ${item.file}:${item.line}`);
md.push('');
md.push('## Danger/red local classes');
for (const item of result.dangerColorClasses.slice(0, 500)) md.push(`- ${item.className}: ${item.file}:${item.line}`);
md.push('');
md.push('## Inline styles');
for (const item of result.inlineStyles.slice(0, 300)) md.push(`- ${item.file}:${item.line}`);
md.push('');
md.push('## Local style risk files');
for (const item of [...new Set(result.localStyleRisk.map(x => x.file))].sort()) md.push(`- ${item}`);
md.push('');

fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_STYLE_MAP.generated.md'), md.join('\n'), 'utf8');
fs.writeFileSync(path.join(outDir, 'closeflow-style-map.generated.json'), JSON.stringify(result, null, 2), 'utf8');
console.log('OK: wrote docs/ui/CLOSEFLOW_STYLE_MAP.generated.md and docs/ui/closeflow-style-map.generated.json');
