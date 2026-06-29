const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');

const ROOT = process.cwd();
const rel = (file) => path.join(ROOT, file);
const exists = (file) => fs.existsSync(rel(file));
const read = (file) => fs.readFileSync(rel(file), 'utf8');
const errors = [];
const warnings = [];
const fail = (message) => errors.push(message);
const requireFile = (file) => { if (!exists(file)) fail('missing file: ' + file); };
const requireText = (file, text, label = text) => { if (!exists(file) || !read(file).includes(text)) fail(file + ' missing ' + label); };
const forbid = (file, pattern, label) => { if (exists(file) && pattern.test(read(file))) fail(file + ' still has forbidden ' + label); };
const forbidText = (file, text, label = text) => { if (exists(file) && read(file).includes(text)) fail(file + ' still has forbidden ' + label); };

const canonical = 'src/lib/source-of-truth/ui-tones.ts';
const leadOptions = 'src/lib/source-of-truth/lead-options.ts';
const caseOptions = 'src/lib/source-of-truth/case-options.ts';
const packageJson = 'package.json';

[canonical, leadOptions, caseOptions, packageJson].forEach(requireFile);

for (const token of [
  'CloseFlowStatusTone',
  'CloseFlowSemanticTone',
  'UI_TONES',
  'STATUS_TONE_TO_SEMANTIC_TONE',
  'LEAD_DETAIL_PILL_CLASS_BY_TONE',
  'CLIENT_DETAIL_PILL_CLASS_BY_TONE',
  'CASE_DETAIL_PILL_CLASS_BY_TONE',
  'ACCESS_TONE_CLASS_BY_SEMANTIC_TONE',
  'ACCESS_CHIP_CLASS_BY_SEMANTIC_TONE',
  'getLeadDetailPillClassForTone',
  'getClientDetailPillClassForTone',
  'getCaseDetailPillClassForTone',
  'getSemanticToneForStatusTone',
]) requireText(canonical, token, token);

forbid(canonical, /bg-\$\{|text-\$\{|border-\$\{/, 'dynamic Tailwind token composition');
forbid(canonical, /`[^`]*(?:bg|text|border)-\$\{/, 'template Tailwind token composition');

requireText(leadOptions, "from './ui-tones'", 'ui-tones import');
requireText(leadOptions, 'getLeadDetailPillClassForTone', 'lead tone helper');
forbid(leadOptions, /export\s+type\s+CloseFlowStatusTone\s*=\s*'blue'/, 'local CloseFlowStatusTone');
forbid(leadOptions, /const\s+LEAD_STATUS_PILL_CLASSES\s*[:=]/, 'local LEAD_STATUS_PILL_CLASSES');

requireText(caseOptions, "from './ui-tones'", 'ui-tones import');
requireText(caseOptions, 'getClientDetailPillClassForTone', 'client tone helper');
requireText(caseOptions, 'getCaseDetailPillClassForTone', 'case tone helper');
forbid(caseOptions, /from '\.\/lead-options'/, 'tone import from lead-options');
forbid(caseOptions, /const\s+CLIENT_PILL_BY_TONE\s*[:=]/, 'local CLIENT_PILL_BY_TONE');
forbid(caseOptions, /const\s+CASE_DETAIL_PILL_BY_TONE\s*[:=]/, 'local CASE_DETAIL_PILL_BY_TONE');

for (const file of [canonical, leadOptions, caseOptions]) {
  for (const marker of ['Ä', 'Ă', 'Ĺ', 'â€', '�']) {
    if (exists(file) && read(file).includes(marker)) fail(file + ' contains mojibake marker: ' + marker);
  }
  for (const token of ['UI_UI_TONES', 'STATUS_STATUS_TONES', 'TONE_TONE_MAP', 'LEAD_LEAD_STATUS_PILL_CLASSES', 'CASE_CASE_DETAIL_PILL_BY_TONE', 'CLIENT_CLIENT_PILL_BY_TONE', 'bg-${', 'text-${', 'border-${']) {
    forbidText(file, token, 'bad tone token ' + token);
  }
}

requireText(
  packageJson,
  '"verify:lf-ui-sot-cz2-005-semantic-ui-tones-source-of-truth": "node scripts/guards/verify-lf-ui-sot-cz2-005-semantic-ui-tones-source-of-truth.cjs"',
  'package script verify:lf-ui-sot-cz2-005-semantic-ui-tones-source-of-truth',
);

const changed = childProcess.execSync('git diff --name-only', { cwd: ROOT, encoding: 'utf8' })
  .split(/\r?\n/).filter(Boolean);
for (const file of changed) {
  if (/\.css$/i.test(file)) fail('CSS touched: ' + file);
  if (file === 'src/App.tsx') fail('src/App.tsx touched');
  if (file === 'src/lib/routes.ts') fail('src/lib/routes.ts touched');
  if (/^(supabase|migrations|sql)\//i.test(file) || /\.sql$/i.test(file)) fail('SQL/migration touched: ' + file);
}

const result = {
  ok: errors.length === 0,
  stage: 'LF-UI-SOT-CZ2-005',
  canonical,
  scopedConsumers: [leadOptions, caseOptions],
  legacyDebt: ['config/badges.ts local status pill helper', 'access.ts tone/chip classes until CZ2-006'],
  changedFiles: changed,
  warnings,
  errors,
};
console.log(JSON.stringify(result, null, 2));
if (errors.length > 0) process.exit(1);
