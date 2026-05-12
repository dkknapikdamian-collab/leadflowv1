const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function p(rel) {
  return path.join(repo, rel);
}

function read(rel) {
  const file = p(rel);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function write(rel, text) {
  fs.writeFileSync(p(rel), text, 'utf8');
}

const rel = 'src/pages/Calendar.tsx';
let text = read(rel);
if (!text) throw new Error(`${rel} not found`);

const importLine = "import '../styles/closeflow-calendar-skin-only-v1.css';";

if (!text.includes(importLine)) {
  const allImports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
  if (!allImports.length) {
    text = `${importLine}\n${text}`;
  } else {
    const lastCss = [...text.matchAll(/^import\s+['"][^'"]+\.css['"];\s*$/gm)].at(-1);
    const lastImport = lastCss || allImports.at(-1);
    const at = lastImport.index + lastImport[0].length;
    text = text.slice(0, at) + `\n${importLine}` + text.slice(at);
  }
}

const marker = "const CLOSEFLOW_CALENDAR_SKIN_ONLY_V1 = 'CLOSEFLOW_CALENDAR_SKIN_ONLY_V1_2026_05_12';";
if (!text.includes('CLOSEFLOW_CALENDAR_SKIN_ONLY_V1_2026_05_12')) {
  const anchor = "const CALENDAR_VIEW_STORAGE_KEY";
  const idx = text.indexOf(anchor);
  if (idx >= 0) {
    const lineStart = text.lastIndexOf('\n', idx) + 1;
    text = text.slice(0, lineStart) + `${marker}\n` + text.slice(lineStart);
  } else {
    const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
    const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
    text = text.slice(0, at) + `\n${marker}\n` + text.slice(at);
  }
}

write(rel, text.replace(/\n{3,}/g, '\n\n'));

fs.mkdirSync(p('docs/ui'), { recursive: true });

const audit = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_SKIN_ONLY_V1_2026_05_12',
  changed: [
    'src/pages/Calendar.tsx',
    'src/styles/closeflow-calendar-skin-only-v1.css'
  ],
  hardRules: [
    'skin only',
    'do not change calendar structure',
    'do not hide left side panel',
    'do not change data handlers',
    'do not change routing'
  ]
};

fs.writeFileSync(
  p('docs/ui/CLOSEFLOW_CALENDAR_SKIN_ONLY_V1_AUDIT.generated.json'),
  JSON.stringify(audit, null, 2),
  'utf8'
);

console.log('CLOSEFLOW_CALENDAR_SKIN_ONLY_V1_PATCH_OK');
console.log(JSON.stringify(audit, null, 2));
