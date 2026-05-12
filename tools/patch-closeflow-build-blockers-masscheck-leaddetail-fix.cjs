const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function p(rel) {
  return path.join(repo, rel);
}
function read(rel) {
  const full = p(rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}
function write(rel, text) {
  fs.writeFileSync(p(rel), text, 'utf8');
}

const rel = 'src/pages/LeadDetail.tsx';
let text = read(rel);
if (!text) throw new Error(`${rel} not found`);

const before = "{serviceCaseId ? serviceCaseStatusLabel : 'Brak powiązanej sprawy}</small>";
const after = "{serviceCaseId ? serviceCaseStatusLabel : 'Brak powiązanej sprawy'}</small>";

let changed = false;

if (text.includes(before)) {
  text = text.replace(before, after);
  changed = true;
}

/* More robust fallback: fix the exact broken ternary if spacing changed. */
const brokenRegex = /\{serviceCaseId\s*\?\s*serviceCaseStatusLabel\s*:\s*'Brak powiązanej sprawy\}\s*<\/small>/g;
if (brokenRegex.test(text)) {
  text = text.replace(brokenRegex, "{serviceCaseId ? serviceCaseStatusLabel : 'Brak powiązanej sprawy'}</small>");
  changed = true;
}

const marker = "const CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_2026_05_12 = 'LeadDetail service case small fallback quote fixed';";
if (!text.includes('CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_2026_05_12')) {
  const anchor = "const CLOSEFLOW_FB3_LEAD_DETAIL_CLEANUP_V1";
  const idx = text.indexOf(anchor);
  if (idx >= 0) {
    const lineEnd = text.indexOf('\n', idx);
    text = text.slice(0, lineEnd + 1) + marker + '\n' + text.slice(lineEnd + 1);
    changed = true;
  }
}

if (!changed) {
  console.log('CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_NOOP');
} else {
  write(rel, text);
  console.log('CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_PATCH_OK');
}

fs.mkdirSync(p('docs/release'), { recursive: true });
const audit = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_2026_05_12',
  changed: [rel],
  fixed: [
    "LeadDetail.tsx unterminated string literal in serviceCaseStatusLabel fallback"
  ],
  exactBadPatternRemoved: !read(rel).includes("Brak powiązanej sprawy}</small>"),
  exactGoodPatternPresent: read(rel).includes("Brak powiązanej sprawy'}</small>")
};

fs.writeFileSync(
  p('docs/release/CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_2026-05-12.generated.json'),
  JSON.stringify(audit, null, 2),
  'utf8'
);
