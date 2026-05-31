const fs = require('fs');

const tsxPath = 'src/pages/AiDrafts.tsx';
const cssPath = 'src/styles/closeflow-ai-drafts-rail-force-colors-stage181w.css';

let src = fs.readFileSync(tsxPath, 'utf8');

const finalImport = "import '../styles/closeflow-ai-drafts-rail-force-colors-stage181w.css';";

// 1. Import final CSS after right-rail hotfix so it wins.
if (!src.includes(finalImport)) {
  if (src.includes("import '../styles/hotfix-right-rail-dark-wrappers.css';")) {
    src = src.replace(
      "import '../styles/hotfix-right-rail-dark-wrappers.css';",
      "import '../styles/hotfix-right-rail-dark-wrappers.css';\n" + finalImport
    );
  } else if (src.includes("import '../styles/visual-stage9-ai-drafts-vnext.css';")) {
    src = src.replace(
      "import '../styles/visual-stage9-ai-drafts-vnext.css';",
      "import '../styles/visual-stage9-ai-drafts-vnext.css';\n" + finalImport
    );
  } else {
    throw new Error('Could not find CSS import anchor in AiDrafts.tsx.');
  }
}

// 2. Data attrs for top filter pills.
if (!src.includes('data-ai-draft-filter-kind={filter.key}')) {
  src = src.replace(
    `className={['ai-drafts-filter-pill', activeFilter === filter.key ? 'ai-drafts-filter-pill-active' : ''].join(' ')}`,
    `className={['ai-drafts-filter-pill', activeFilter === filter.key ? 'ai-drafts-filter-pill-active' : ''].join(' ')}
                    data-ai-draft-filter-kind={filter.key}`
  );
}

// 3. Data attrs for right rail cards and buttons.
if (!src.includes('data-ai-draft-rail-card="filters"')) {
  src = src.replace(
    `<section className="right-card ai-drafts-right-card">
              <div className="ai-drafts-right-card-head">
                <EntityIcon entity="ai" className="h-4 w-4" />`,
    `<section className="right-card ai-drafts-right-card" data-ai-draft-rail-card="filters">
              <div className="ai-drafts-right-card-head">
                <EntityIcon entity="ai" className="h-4 w-4" />`
  );
}

if (!src.includes('data-ai-draft-rail-button="draft"')) {
  src = src.replace(
    `<button type="button" onClick={() => setActiveFilter('draft')} className="ai-drafts-rail-button">`,
    `<button type="button" onClick={() => setActiveFilter('draft')} className="ai-drafts-rail-button" data-ai-draft-rail-button="draft">`
  );
}

if (!src.includes('data-ai-draft-rail-button="errors"')) {
  src = src.replace(
    `<button type="button" onClick={() => setActiveFilter('errors')} className="ai-drafts-rail-button">`,
    `<button type="button" onClick={() => setActiveFilter('errors')} className="ai-drafts-rail-button" data-ai-draft-rail-button="errors">`
  );
}

if (!src.includes('data-ai-draft-rail-button="converted"')) {
  src = src.replace(
    `<button type="button" onClick={() => setActiveFilter('converted')} className="ai-drafts-rail-button">`,
    `<button type="button" onClick={() => setActiveFilter('converted')} className="ai-drafts-rail-button" data-ai-draft-rail-button="converted">`
  );
}

if (!src.includes('data-ai-draft-rail-card="errors"')) {
  src = src.replace(
    `<section className="right-card ai-drafts-right-card">
              <div className="ai-drafts-right-card-head">
                <AlertTriangle className="h-4 w-4" />`,
    `<section className="right-card ai-drafts-right-card" data-ai-draft-rail-card="errors">
              <div className="ai-drafts-right-card-head">
                <AlertTriangle className="h-4 w-4" />`
  );
}

if (!src.includes('data-ai-draft-rail-card="converted"')) {
  src = src.replace(
    `<section className="right-card ai-drafts-right-card">
              <div className="ai-drafts-right-card-head">
                <CheckCircle2 className="h-4 w-4" />`,
    `<section className="right-card ai-drafts-right-card" data-ai-draft-rail-card="converted">
              <div className="ai-drafts-right-card-head">
                <CheckCircle2 className="h-4 w-4" />`
  );
}

if (!src.includes('data-ai-draft-rail-card="help"')) {
  src = src.replace(
    `<section className="right-card ai-drafts-right-card">
              <div className="ai-drafts-right-card-head">
                <Clock className="h-4 w-4" />`,
    `<section className="right-card ai-drafts-right-card" data-ai-draft-rail-card="help">
              <div className="ai-drafts-right-card-head">
                <Clock className="h-4 w-4" />`
  );
}

fs.writeFileSync(tsxPath, src, 'utf8');

// 4. CSS: strong selectors + nth-of-type fallback.
const css = `/* CLOSEFLOW_STAGE181W_AI_DRAFTS_RAIL_FORCE_COLORS
   LOCAL ONLY
   Scope: /ai-drafts.
   Visual taxonomy:
   draft / AI = violet,
   lead = indigo,
   task = amber,
   event = sky,
   errors = red,
   converted = emerald,
   help = slate.
*/

:root {
  --cf-ai-draft-violet-bg: #f5f3ff;
  --cf-ai-draft-violet-border: #ddd6fe;
  --cf-ai-draft-violet-text: #6d28d9;

  --cf-ai-draft-indigo-bg: #eef2ff;
  --cf-ai-draft-indigo-border: #c7d2fe;
  --cf-ai-draft-indigo-text: #4f46e5;

  --cf-ai-draft-amber-bg: #fffbeb;
  --cf-ai-draft-amber-border: #fde68a;
  --cf-ai-draft-amber-text: #b45309;

  --cf-ai-draft-sky-bg: #f0f9ff;
  --cf-ai-draft-sky-border: #bae6fd;
  --cf-ai-draft-sky-text: #0369a1;

  --cf-ai-draft-red-bg: #fef2f2;
  --cf-ai-draft-red-border: #fecaca;
  --cf-ai-draft-red-text: #dc2626;

  --cf-ai-draft-emerald-bg: #ecfdf5;
  --cf-ai-draft-emerald-border: #bbf7d0;
  --cf-ai-draft-emerald-text: #047857;

  --cf-ai-draft-slate-bg: #f8fafc;
  --cf-ai-draft-slate-border: #e2e8f0;
  --cf-ai-draft-slate-text: #475569;
}

/* Top filter pills */
.ai-drafts-vnext-page .ai-drafts-filter-pill[data-ai-draft-filter-kind="all"],
.ai-drafts-vnext-page .ai-drafts-filter-pill:nth-child(1) {
  border-color: var(--cf-ai-draft-slate-border) !important;
  background: var(--cf-ai-draft-slate-bg) !important;
  color: var(--cf-ai-draft-slate-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-filter-pill[data-ai-draft-filter-kind="draft"],
.ai-drafts-vnext-page .ai-drafts-filter-pill:nth-child(2) {
  border-color: var(--cf-ai-draft-violet-border) !important;
  background: var(--cf-ai-draft-violet-bg) !important;
  color: var(--cf-ai-draft-violet-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-filter-pill[data-ai-draft-filter-kind="lead"],
.ai-drafts-vnext-page .ai-drafts-filter-pill:nth-child(3) {
  border-color: var(--cf-ai-draft-indigo-border) !important;
  background: var(--cf-ai-draft-indigo-bg) !important;
  color: var(--cf-ai-draft-indigo-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-filter-pill[data-ai-draft-filter-kind="task"],
.ai-drafts-vnext-page .ai-drafts-filter-pill:nth-child(4) {
  border-color: var(--cf-ai-draft-amber-border) !important;
  background: var(--cf-ai-draft-amber-bg) !important;
  color: var(--cf-ai-draft-amber-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-filter-pill[data-ai-draft-filter-kind="event"],
.ai-drafts-vnext-page .ai-drafts-filter-pill:nth-child(5) {
  border-color: var(--cf-ai-draft-sky-border) !important;
  background: var(--cf-ai-draft-sky-bg) !important;
  color: var(--cf-ai-draft-sky-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-filter-pill[data-ai-draft-filter-kind="note"],
.ai-drafts-vnext-page .ai-drafts-filter-pill:nth-child(6) {
  border-color: #e9d5ff !important;
  background: #faf5ff !important;
  color: #7e22ce !important;
}

.ai-drafts-vnext-page .ai-drafts-filter-pill[data-ai-draft-filter-kind="errors"],
.ai-drafts-vnext-page .ai-drafts-filter-pill:nth-child(7) {
  border-color: var(--cf-ai-draft-red-border) !important;
  background: var(--cf-ai-draft-red-bg) !important;
  color: var(--cf-ai-draft-red-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-filter-pill[data-ai-draft-filter-kind="converted"],
.ai-drafts-vnext-page .ai-drafts-filter-pill:nth-child(8) {
  border-color: var(--cf-ai-draft-emerald-border) !important;
  background: var(--cf-ai-draft-emerald-bg) !important;
  color: var(--cf-ai-draft-emerald-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-filter-pill[data-ai-draft-filter-kind="archived"],
.ai-drafts-vnext-page .ai-drafts-filter-pill:nth-child(9) {
  border-color: #e2e8f0 !important;
  background: #f1f5f9 !important;
  color: #64748b !important;
}

.ai-drafts-vnext-page .ai-drafts-filter-pill strong {
  background: rgba(255,255,255,0.82) !important;
  border: 1px solid currentColor !important;
  color: currentColor !important;
}

.ai-drafts-vnext-page .ai-drafts-filter-pill-active {
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08) !important;
  transform: translateY(-1px) !important;
}

/* Right rail base */
.ai-drafts-vnext-page .ai-drafts-right-rail {
  gap: 18px !important;
}

.ai-drafts-vnext-page .ai-drafts-right-rail .ai-drafts-right-card,
.ai-drafts-vnext-page .ai-drafts-right-rail .right-card.ai-drafts-right-card {
  position: relative !important;
  overflow: hidden !important;
  border-radius: 24px !important;
  border-width: 1px !important;
  background: #ffffff !important;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08) !important;
  padding: 18px !important;
}

.ai-drafts-vnext-page .ai-drafts-right-rail .ai-drafts-right-card::before,
.ai-drafts-vnext-page .ai-drafts-right-rail .right-card.ai-drafts-right-card::before {
  content: "" !important;
  position: absolute !important;
  left: 0 !important;
  top: 14px !important;
  bottom: 14px !important;
  width: 5px !important;
  border-radius: 999px !important;
  background: var(--cf-ai-draft-violet-text) !important;
}

/* Card 1: quick filters / AI violet */
.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="filters"],
.ai-drafts-vnext-page .ai-drafts-right-rail .right-card.ai-drafts-right-card:nth-of-type(1) {
  border-color: var(--cf-ai-draft-violet-border) !important;
  background:
    radial-gradient(circle at top right, rgba(109, 40, 217, 0.13), transparent 34%),
    #ffffff !important;
}

.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="filters"]::before,
.ai-drafts-vnext-page .ai-drafts-right-rail .right-card.ai-drafts-right-card:nth-of-type(1)::before {
  background: var(--cf-ai-draft-violet-text) !important;
}

/* Card 2: errors red */
.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="errors"],
.ai-drafts-vnext-page .ai-drafts-right-rail .right-card.ai-drafts-right-card:nth-of-type(2) {
  border-color: var(--cf-ai-draft-red-border) !important;
  background:
    radial-gradient(circle at top right, rgba(220, 38, 38, 0.11), transparent 34%),
    #ffffff !important;
}

.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="errors"]::before,
.ai-drafts-vnext-page .ai-drafts-right-rail .right-card.ai-drafts-right-card:nth-of-type(2)::before {
  background: var(--cf-ai-draft-red-text) !important;
}

/* Card 3: converted emerald */
.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="converted"],
.ai-drafts-vnext-page .ai-drafts-right-rail .right-card.ai-drafts-right-card:nth-of-type(3) {
  border-color: var(--cf-ai-draft-emerald-border) !important;
  background:
    radial-gradient(circle at top right, rgba(4, 120, 87, 0.12), transparent 34%),
    #ffffff !important;
}

.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="converted"]::before,
.ai-drafts-vnext-page .ai-drafts-right-rail .right-card.ai-drafts-right-card:nth-of-type(3)::before {
  background: var(--cf-ai-draft-emerald-text) !important;
}

/* Card 4: help slate/blue */
.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="help"],
.ai-drafts-vnext-page .ai-drafts-right-rail .right-card.ai-drafts-right-card:nth-of-type(4) {
  border-color: #bfdbfe !important;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.10), transparent 34%),
    #ffffff !important;
}

.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="help"]::before,
.ai-drafts-vnext-page .ai-drafts-right-rail .right-card.ai-drafts-right-card:nth-of-type(4)::before {
  background: #2563eb !important;
}

/* Header icon chips */
.ai-drafts-vnext-page .ai-drafts-right-card .ai-drafts-right-card-head {
  margin-left: 2px !important;
  gap: 10px !important;
  color: var(--cf-ai-draft-violet-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-right-card:nth-of-type(2) .ai-drafts-right-card-head,
.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="errors"] .ai-drafts-right-card-head {
  color: var(--cf-ai-draft-red-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-right-card:nth-of-type(3) .ai-drafts-right-card-head,
.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="converted"] .ai-drafts-right-card-head {
  color: var(--cf-ai-draft-emerald-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-right-card:nth-of-type(4) .ai-drafts-right-card-head,
.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="help"] .ai-drafts-right-card-head {
  color: #2563eb !important;
}

.ai-drafts-vnext-page .ai-drafts-right-card-head > svg {
  width: 26px !important;
  height: 26px !important;
  padding: 6px !important;
  border-radius: 10px !important;
  background: currentColor !important;
  color: #ffffff !important;
  stroke: #ffffff !important;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.10) !important;
}

.ai-drafts-vnext-page .ai-drafts-right-card-head h2 {
  color: #111827 !important;
  font-weight: 950 !important;
}

/* Quick rail buttons */
.ai-drafts-vnext-page .ai-drafts-rail-button {
  min-height: 46px !important;
  border-radius: 16px !important;
  font-weight: 900 !important;
}

.ai-drafts-vnext-page .ai-drafts-rail-button[data-ai-draft-rail-button="draft"],
.ai-drafts-vnext-page .ai-drafts-right-card:nth-of-type(1) .ai-drafts-rail-button:nth-of-type(1) {
  border-color: var(--cf-ai-draft-violet-border) !important;
  background: var(--cf-ai-draft-violet-bg) !important;
  color: var(--cf-ai-draft-violet-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-rail-button[data-ai-draft-rail-button="errors"],
.ai-drafts-vnext-page .ai-drafts-right-card:nth-of-type(1) .ai-drafts-rail-button:nth-of-type(2) {
  border-color: var(--cf-ai-draft-red-border) !important;
  background: var(--cf-ai-draft-red-bg) !important;
  color: var(--cf-ai-draft-red-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-rail-button[data-ai-draft-rail-button="converted"],
.ai-drafts-vnext-page .ai-drafts-right-card:nth-of-type(1) .ai-drafts-rail-button:nth-of-type(3) {
  border-color: var(--cf-ai-draft-emerald-border) !important;
  background: var(--cf-ai-draft-emerald-bg) !important;
  color: var(--cf-ai-draft-emerald-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-rail-button strong {
  min-width: 30px !important;
  height: 26px !important;
  border: 1px solid currentColor !important;
  background: rgba(255,255,255,0.82) !important;
  color: currentColor !important;
  font-weight: 950 !important;
}

/* Empty states */
.ai-drafts-vnext-page .ai-drafts-right-card:nth-of-type(2) .ai-drafts-rail-empty,
.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="errors"] .ai-drafts-rail-empty {
  border: 1px dashed rgba(220, 38, 38, 0.28) !important;
  background: var(--cf-ai-draft-red-bg) !important;
  color: var(--cf-ai-draft-red-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-right-card:nth-of-type(3) .ai-drafts-rail-empty,
.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="converted"] .ai-drafts-rail-empty {
  border: 1px dashed rgba(4, 120, 87, 0.28) !important;
  background: var(--cf-ai-draft-emerald-bg) !important;
  color: var(--cf-ai-draft-emerald-text) !important;
}

.ai-drafts-vnext-page .ai-drafts-right-card:nth-of-type(4) .ai-drafts-rail-empty,
.ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="help"] .ai-drafts-rail-empty {
  border: 1px dashed rgba(37, 99, 235, 0.24) !important;
  background: var(--cf-ai-draft-sky-bg) !important;
  color: #1e3a8a !important;
}

.ai-drafts-vnext-page .ai-drafts-rail-empty {
  border-radius: 16px !important;
  padding: 12px !important;
  font-weight: 750 !important;
}
`;

fs.writeFileSync(cssPath, css, 'utf8');

const next = fs.readFileSync(tsxPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  "closeflow-ai-drafts-rail-force-colors-stage181w.css",
  "data-ai-draft-filter-kind={filter.key}",
  'data-ai-draft-rail-card="filters"',
  'data-ai-draft-rail-button="draft"',
  'data-ai-draft-rail-button="errors"',
  'data-ai-draft-rail-button="converted"',
  'data-ai-draft-rail-card="errors"',
  'data-ai-draft-rail-card="converted"',
  'data-ai-draft-rail-card="help"',
]) {
  if (!next.includes(token)) failures.push('AiDrafts.tsx missing token: ' + token);
}

for (const token of [
  "CLOSEFLOW_STAGE181W_AI_DRAFTS_RAIL_FORCE_COLORS",
  "nth-of-type(1)",
  "nth-of-type(2)",
  "nth-of-type(3)",
  "nth-of-type(4)",
  "#f5f3ff",
  "#fef2f2",
  "#ecfdf5",
  "#f0f9ff",
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181W local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181W local: AI drafts right rail and filter pills use colored visual taxonomy.');
