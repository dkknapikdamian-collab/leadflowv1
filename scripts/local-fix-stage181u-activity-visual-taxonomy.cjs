const fs = require('fs');

const tsxPath = 'src/pages/Activity.tsx';
const cssPath = 'src/styles/closeflow-activity-visual-source-truth-stage181u.css';

let src = fs.readFileSync(tsxPath, 'utf8');

// 0. Safety: keep Activity icon aliased to avoid duplicate declaration.
const lucideImportRe = /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];?/m;
const lucideMatch = src.match(lucideImportRe);

if (lucideMatch) {
  const importBlock = lucideMatch[0];
  if (/\bActivity\b/.test(importBlock) && !/\bActivity\s+as\s+ActivityIcon\b/.test(importBlock)) {
    src = src.replace(importBlock, importBlock.replace(/\bActivity\b(?!\s+as)/, 'Activity as ActivityIcon'));
  }
  src = src.replace(/<Activity(?=[\s/>])/g, '<ActivityIcon');
  src = src.replace(/<\/Activity(?=>)/g, '</ActivityIcon');
  src = src.replace(/icon=\{Activity\}/g, 'icon={ActivityIcon}');
}

// 1. Import final visual source truth after old Activity CSS.
if (!src.includes("../styles/closeflow-activity-visual-source-truth-stage181u.css")) {
  src = src.replace(
    "import '../styles/visual-stage8-activity-vnext.css';",
    "import '../styles/visual-stage8-activity-vnext.css';\nimport '../styles/closeflow-activity-visual-source-truth-stage181u.css';"
  );
}

// 2. Give top filter pills explicit taxonomy data.
if (!src.includes('data-activity-filter-kind={filter.value}')) {
  src = src.replace(
    `className={['activity-filter-pill', activeFilter === filter.value ? 'activity-filter-pill-active' : ''].join(' ')}`,
    `className={['activity-filter-pill', activeFilter === filter.value ? 'activity-filter-pill-active' : ''].join(' ')}
                    data-activity-filter-kind={filter.value}`
  );
}

// 3. Normalize top metric icon classes to one taxonomy.
src = src.replace(
  /iconClassName="bg-slate-100 text-slate-500"/,
  'iconClassName="cf-activity-metric-icon cf-activity-metric-icon-all"'
);
src = src.replace(
  /iconClassName="bg-blue-50 text-blue-500" valueClassName="text-blue-600"/,
  'iconClassName="cf-activity-metric-icon cf-activity-metric-icon-today" valueClassName="cf-activity-metric-value-today"'
);
src = src.replace(
  /iconClassName="bg-indigo-50 text-indigo-500"/,
  'iconClassName="cf-activity-metric-icon cf-activity-metric-icon-lead" valueClassName="cf-activity-metric-value-lead"'
);
src = src.replace(
  /iconClassName="bg-slate-100 text-slate-500"/,
  'iconClassName="cf-activity-metric-icon cf-activity-metric-icon-case" valueClassName="cf-activity-metric-value-case"'
);
src = src.replace(
  /iconClassName="bg-emerald-50 text-emerald-500" valueClassName="text-emerald-600"/,
  'iconClassName="cf-activity-metric-icon cf-activity-metric-icon-task" valueClassName="cf-activity-metric-value-task"'
);

// 4. Data attributes for right rail cards and buttons.
if (!src.includes('data-activity-rail-card="filters"')) {
  src = src.replace(
    `<section className="right-card activity-right-card">
              <div className="activity-right-card-head">
                <Filter className="h-4 w-4" />`,
    `<section className="right-card activity-right-card" data-activity-rail-card="filters">
              <div className="activity-right-card-head">
                <Filter className="h-4 w-4" />`
  );
}

if (!src.includes('data-activity-rail-button="today"')) {
  src = src.replace(
    `<button type="button" onClick={() => setActiveFilter('today')} className="activity-rail-button">`,
    `<button type="button" onClick={() => setActiveFilter('today')} className="activity-rail-button" data-activity-rail-button="today">`
  );
}

if (!src.includes('data-activity-rail-button="attention"')) {
  src = src.replace(
    `<button type="button" onClick={() => setActiveFilter('attention')} className="activity-rail-button">`,
    `<button type="button" onClick={() => setActiveFilter('attention')} className="activity-rail-button" data-activity-rail-button="attention">`
  );
}

if (!src.includes('data-activity-rail-card="cases"')) {
  src = src.replace(
    `<section className="right-card activity-right-card">
              <div className="activity-right-card-head">
                <EntityIcon entity="case" className="h-4 w-4" />`,
    `<section className="right-card activity-right-card" data-activity-rail-card="cases">
              <div className="activity-right-card-head">
                <EntityIcon entity="case" className="h-4 w-4" />`
  );
}

if (!src.includes('data-activity-rail-card="leads"')) {
  src = src.replace(
    `<section className="right-card activity-right-card">
              <div className="activity-right-card-head">
                <EntityIcon entity="lead" className="h-4 w-4" />`,
    `<section className="right-card activity-right-card" data-activity-rail-card="leads">
              <div className="activity-right-card-head">
                <EntityIcon entity="lead" className="h-4 w-4" />`
  );
}

fs.writeFileSync(tsxPath, src, 'utf8');

// 5. CSS source truth.
const css = `/* CLOSEFLOW_STAGE181U_ACTIVITY_VISUAL_TAXONOMY_SOURCE_TRUTH
   LOCAL ONLY
   Scope: /activity visual hierarchy.
   Rule: icon colors and right-rail colors follow one taxonomy:
   all=slate, today=blue, lead=indigo/blue, case=emerald, task=amber, event=sky, system=violet, attention=red.
*/

:root {
  --cf-activity-all-bg: #f8fafc;
  --cf-activity-all-border: #e2e8f0;
  --cf-activity-all-text: #475569;

  --cf-activity-today-bg: #eff6ff;
  --cf-activity-today-border: #bfdbfe;
  --cf-activity-today-text: #1d4ed8;

  --cf-activity-lead-bg: #eef2ff;
  --cf-activity-lead-border: #c7d2fe;
  --cf-activity-lead-text: #4f46e5;

  --cf-activity-case-bg: #ecfdf5;
  --cf-activity-case-border: #bbf7d0;
  --cf-activity-case-text: #047857;

  --cf-activity-task-bg: #fffbeb;
  --cf-activity-task-border: #fde68a;
  --cf-activity-task-text: #b45309;

  --cf-activity-event-bg: #f0f9ff;
  --cf-activity-event-border: #bae6fd;
  --cf-activity-event-text: #0369a1;

  --cf-activity-system-bg: #faf5ff;
  --cf-activity-system-border: #e9d5ff;
  --cf-activity-system-text: #7e22ce;

  --cf-activity-attention-bg: #fef2f2;
  --cf-activity-attention-border: #fecaca;
  --cf-activity-attention-text: #dc2626;
}

/* Top metric icon source truth */
.cf-activity-metric-icon {
  border: 1px solid transparent !important;
}

.cf-activity-metric-icon-all {
  background: var(--cf-activity-all-bg) !important;
  color: var(--cf-activity-all-text) !important;
  border-color: var(--cf-activity-all-border) !important;
}

.cf-activity-metric-icon-today {
  background: var(--cf-activity-today-bg) !important;
  color: var(--cf-activity-today-text) !important;
  border-color: var(--cf-activity-today-border) !important;
}

.cf-activity-metric-icon-lead {
  background: var(--cf-activity-lead-bg) !important;
  color: var(--cf-activity-lead-text) !important;
  border-color: var(--cf-activity-lead-border) !important;
}

.cf-activity-metric-icon-case {
  background: var(--cf-activity-case-bg) !important;
  color: var(--cf-activity-case-text) !important;
  border-color: var(--cf-activity-case-border) !important;
}

.cf-activity-metric-icon-task {
  background: var(--cf-activity-task-bg) !important;
  color: var(--cf-activity-task-text) !important;
  border-color: var(--cf-activity-task-border) !important;
}

.cf-activity-metric-value-today { color: var(--cf-activity-today-text) !important; }
.cf-activity-metric-value-lead { color: var(--cf-activity-lead-text) !important; }
.cf-activity-metric-value-case { color: var(--cf-activity-case-text) !important; }
.cf-activity-metric-value-task { color: var(--cf-activity-task-text) !important; }

/* Top filter pills: light color coding, still compact */
.activity-filter-pill[data-activity-filter-kind="all"] {
  border-color: var(--cf-activity-all-border) !important;
  background: var(--cf-activity-all-bg) !important;
  color: var(--cf-activity-all-text) !important;
}

.activity-filter-pill[data-activity-filter-kind="today"] {
  border-color: var(--cf-activity-today-border) !important;
  background: var(--cf-activity-today-bg) !important;
  color: var(--cf-activity-today-text) !important;
}

.activity-filter-pill[data-activity-filter-kind="lead"] {
  border-color: var(--cf-activity-lead-border) !important;
  background: var(--cf-activity-lead-bg) !important;
  color: var(--cf-activity-lead-text) !important;
}

.activity-filter-pill[data-activity-filter-kind="case"] {
  border-color: var(--cf-activity-case-border) !important;
  background: var(--cf-activity-case-bg) !important;
  color: var(--cf-activity-case-text) !important;
}

.activity-filter-pill[data-activity-filter-kind="task"] {
  border-color: var(--cf-activity-task-border) !important;
  background: var(--cf-activity-task-bg) !important;
  color: var(--cf-activity-task-text) !important;
}

.activity-filter-pill[data-activity-filter-kind="event"] {
  border-color: var(--cf-activity-event-border) !important;
  background: var(--cf-activity-event-bg) !important;
  color: var(--cf-activity-event-text) !important;
}

.activity-filter-pill[data-activity-filter-kind="system"] {
  border-color: var(--cf-activity-system-border) !important;
  background: var(--cf-activity-system-bg) !important;
  color: var(--cf-activity-system-text) !important;
}

.activity-filter-pill[data-activity-filter-kind] strong {
  background: rgba(255, 255, 255, 0.72) !important;
  color: currentColor !important;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04) !important;
}

.activity-filter-pill-active {
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08) !important;
  transform: translateY(-1px) !important;
}

/* Right rail: colored cards */
.activity-right-card[data-activity-rail-card] {
  position: relative !important;
  overflow: hidden !important;
  border-width: 1px !important;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.07) !important;
}

.activity-right-card[data-activity-rail-card]::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 auto 0 0 !important;
  width: 5px !important;
  border-radius: 999px !important;
  background: #cbd5e1 !important;
}

.activity-right-card[data-activity-rail-card="filters"] {
  border-color: var(--cf-activity-today-border) !important;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 36%),
    #ffffff !important;
}

.activity-right-card[data-activity-rail-card="filters"]::before {
  background: var(--cf-activity-today-text) !important;
}

.activity-right-card[data-activity-rail-card="cases"] {
  border-color: var(--cf-activity-case-border) !important;
  background:
    radial-gradient(circle at top right, rgba(4, 120, 87, 0.08), transparent 36%),
    #ffffff !important;
}

.activity-right-card[data-activity-rail-card="cases"]::before {
  background: var(--cf-activity-case-text) !important;
}

.activity-right-card[data-activity-rail-card="leads"] {
  border-color: var(--cf-activity-lead-border) !important;
  background:
    radial-gradient(circle at top right, rgba(79, 70, 229, 0.08), transparent 36%),
    #ffffff !important;
}

.activity-right-card[data-activity-rail-card="leads"]::before {
  background: var(--cf-activity-lead-text) !important;
}

.activity-right-card[data-activity-rail-card] .activity-right-card-head {
  padding-left: 2px !important;
}

.activity-right-card[data-activity-rail-card="filters"] .activity-right-card-head {
  color: var(--cf-activity-today-text) !important;
}

.activity-right-card[data-activity-rail-card="cases"] .activity-right-card-head {
  color: var(--cf-activity-case-text) !important;
}

.activity-right-card[data-activity-rail-card="leads"] .activity-right-card-head {
  color: var(--cf-activity-lead-text) !important;
}

.activity-right-card[data-activity-rail-card] .activity-right-card-head svg {
  padding: 2px !important;
  border-radius: 10px !important;
  background: currentColor !important;
  color: #ffffff !important;
  stroke: #ffffff !important;
}

/* Quick buttons */
.activity-rail-button[data-activity-rail-button="today"] {
  border-color: var(--cf-activity-today-border) !important;
  background: var(--cf-activity-today-bg) !important;
  color: var(--cf-activity-today-text) !important;
}

.activity-rail-button[data-activity-rail-button="attention"] {
  border-color: var(--cf-activity-attention-border) !important;
  background: var(--cf-activity-attention-bg) !important;
  color: var(--cf-activity-attention-text) !important;
}

.activity-rail-button[data-activity-rail-button] strong {
  background: rgba(255,255,255,0.78) !important;
  color: currentColor !important;
  border: 1px solid currentColor !important;
}

/* Recent changes cards */
.activity-right-card[data-activity-rail-card="cases"] .activity-rail-item {
  border-color: rgba(4, 120, 87, 0.18) !important;
  background: #f0fdf4 !important;
}

.activity-right-card[data-activity-rail-card="cases"] .activity-rail-item span {
  color: #047857 !important;
}

.activity-right-card[data-activity-rail-card="leads"] .activity-rail-item {
  border-color: rgba(79, 70, 229, 0.18) !important;
  background: #eef2ff !important;
}

.activity-right-card[data-activity-rail-card="leads"] .activity-rail-item span {
  color: #4f46e5 !important;
}

.activity-rail-empty {
  border: 1px dashed rgba(148, 163, 184, 0.45) !important;
  border-radius: 16px !important;
  background: #f8fafc !important;
  padding: 12px !important;
  color: #64748b !important;
  font-weight: 650 !important;
}

@media (max-width: 860px) {
  .activity-right-card[data-activity-rail-card]::before {
    width: 4px !important;
  }

  .activity-filter-pill[data-activity-filter-kind] {
    flex: 0 0 auto !important;
  }
}
`;

fs.writeFileSync(cssPath, css, 'utf8');

const next = fs.readFileSync(tsxPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  "closeflow-activity-visual-source-truth-stage181u.css",
  "data-activity-filter-kind={filter.value}",
  'data-activity-rail-card="filters"',
  'data-activity-rail-button="today"',
  'data-activity-rail-button="attention"',
  'data-activity-rail-card="cases"',
  'data-activity-rail-card="leads"',
]) {
  if (!next.includes(token)) failures.push('Activity.tsx missing token: ' + token);
}

for (const token of [
  "CLOSEFLOW_STAGE181U_ACTIVITY_VISUAL_TAXONOMY_SOURCE_TRUTH",
  "--cf-activity-lead-bg",
  "--cf-activity-case-bg",
  "--cf-activity-task-bg",
  "--cf-activity-attention-bg",
  "data-activity-rail-card",
  "data-activity-filter-kind",
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181U local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181U local: Activity page uses shared visual taxonomy for filters, icons and right rail.');
