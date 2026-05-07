const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const today = read('src/pages/TodayStable.tsx');
const indexCss = read('src/index.css');
const css = read('src/styles/eliteflow-semantic-badges-and-today-sections.css');

function fail(message) {
  console.error('[admin-feedback-p1-followup] FAIL: ' + message);
  process.exit(1);
}

const importLine = "@import './styles/eliteflow-semantic-badges-and-today-sections.css';";
if (!indexCss.includes(importLine)) fail('missing semantic badges css import');
if (!indexCss.trim().endsWith(importLine)) fail('semantic badges css import must be the final import in src/index.css');

[
  'ADMIN_FEEDBACK_P1_FOLLOWUP_TODAY_SECTIONS_BADGES',
  "czeka za długo bez świeżego ruchu",
  'semanticBadgeClass',
  'openTodaySection',
  'scrollToTodaySection',
  'TODAY_SECTION_TITLES',
  'useState<TodaySectionKey[]>(() => [...TODAY_SECTION_KEYS])',
  'className={semanticBadgeClass(badge)}',
].forEach((needle) => {
  if (!today.includes(needle)) fail('TodayStable missing marker: ' + needle);
});

if (today.includes('waiting za')) fail('TodayStable still contains English waiting copy');

[
  'ELITEFLOW_SEMANTIC_BADGES_AND_TODAY_SECTIONS_2026_05_07',
  '--cf-semantic-danger-bg',
  '--cf-semantic-event-bg',
  '--cf-semantic-task-bg',
  '--cf-semantic-note-bg',
  '.cf-semantic-badge-danger',
  '.cf-semantic-badge-event',
  '.cf-semantic-badge-task',
  '.cf-semantic-badge-note',
  '[data-cf-semantic-tone="danger"]',
].forEach((needle) => {
  if (!css.includes(needle)) fail('semantic css missing marker: ' + needle);
});

console.log('[admin-feedback-p1-followup] OK: Today copy, collapsed sections and semantic badge tokens are wired');
