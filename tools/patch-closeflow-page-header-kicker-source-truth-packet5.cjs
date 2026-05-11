const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

const cssPath = path.join(repo, 'src/styles/closeflow-page-header-v2.css');
const payloadCssPath = path.join(repo, 'src/styles/closeflow-page-header-v2.css');

function read(rel) {
  const file = path.join(repo, rel);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}

function replaceCssMarker(rel) {
  const file = path.join(repo, rel);
  if (!fs.existsSync(file)) throw new Error(rel + ' not found');
  return true;
}

function stripDuplicateParagraphs(rel, exactTexts) {
  let text = read(rel);
  const before = text;
  for (const exact of exactTexts) {
    const escaped = exact.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const patterns = [
      new RegExp(String.raw`\n?[ \t]*<p[^>]*>\s*${escaped}\s*</p>\s*`, 'g'),
      new RegExp(String.raw`\n?[ \t]*<div[^>]*>\s*${escaped}\s*</div>\s*`, 'g'),
      new RegExp(String.raw`\n?[ \t]*<span[^>]*>\s*${escaped}\s*</span>\s*`, 'g'),
      new RegExp(String.raw`\n?[ \t]*\{\s*['\"]${escaped}['\"]\s*\}\s*`, 'g'),
    ];
    for (const p of patterns) text = text.replace(p, '\n');
    // remove JSX text node lines containing exact copy
    text = text.split('\n').filter((line) => !line.includes(exact)).join('\n');
  }
  text = text.replace(/\n{3,}/g, '\n\n');
  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

function auditOldImports() {
  const files = fs.readdirSync(path.join(repo, 'src/pages')).filter((f) => f.endsWith('.tsx'));
  const oldMarkers = [
    'closeflow-page-header-card-source-truth.css',
    'closeflow-page-header-final-lock.css',
    'closeflow-page-header-structure-lock.css',
    'closeflow-page-header-copy-left-only.css',
    'page-adapters.css',
    'visual-stage37-unified-page-head-and-metrics.css',
    'visual-stage39-page-headers-copy-visual-system.css',
    'visual-stage40',
  ];
  const rows = [];
  for (const file of files) {
    const rel = 'src/pages/' + file;
    const text = read(rel);
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      oldMarkers.forEach((marker) => {
        if (line.includes(marker)) {
          rows.push({ file: rel, line: i + 1, marker, text: line.trim() });
        }
      });
    });
  }
  const outDir = path.join(repo, 'docs/ui');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_PAGE_HEADER_KICKER_SOURCE_TRUTH_PACKET5_AUDIT.generated.json'), JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2), 'utf8');
  return rows.length;
}

const cleanupMap = {
  'src/pages/ResponseTemplates.tsx': [
    'Własne gotowce do follow-upów, przypomnień i wiadomości do klientów. AI może później pracować na tych szablonach, ale źródłem prawdy jest Twoja biblioteka.',
  ],
  'src/pages/AiDrafts.tsx': [
    'Sprawdź, popraw i zatwierdź szkice przed zapisem.',
    'Sprawdź, popraw i zatwierdź szkice przed zapisem w CRM.',
  ],
  'src/pages/NotificationsCenter.tsx': [
    'Przypomnienia, zaległe rzeczy i alerty, których nie możesz przegapić.',
    'Przypomnienia, zaległe rzeczy i alerty z aplikacji. Tu widzisz zaległe rzeczy, nadchodzące terminy i sprawy, których nie można przegapić.',
  ],
  'src/pages/AdminAiSettings.tsx': [
    'Ukryta warstwa diagnostyczna dla Quick Lead Capture. Użytkownik końcowy widzi tylko prosty szkic do potwierdzenia, nie providerów ani kluczy.',
  ],
};

const changed = [];
for (const [rel, exactTexts] of Object.entries(cleanupMap)) {
  if (fs.existsSync(path.join(repo, rel)) && stripDuplicateParagraphs(rel, exactTexts)) {
    changed.push(rel);
  }
}
const auditRows = auditOldImports();
console.log('CLOSEFLOW_PAGE_HEADER_KICKER_SOURCE_TRUTH_PACKET5_PATCH_OK');
console.log(JSON.stringify({ changed, auditRows }, null, 2));
