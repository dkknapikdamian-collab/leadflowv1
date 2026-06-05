const fs = require('fs');

const tsxPath = 'src/pages/Activity.tsx';
const cssPath = 'src/styles/closeflow-activity-rail-force-colors-stage181v.css';

let src = fs.readFileSync(tsxPath, 'utf8');

// 1. Safety: Activity icon alias, żeby Vite nie wrócił do duplicate declaration.
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

// 2. Import final CSS PO hotfix-right-rail-dark-wrappers.css, bo poprzedni etap mógł być przykryty.
const finalImport = "import '../styles/closeflow-activity-rail-force-colors-stage181v.css';";

if (!src.includes(finalImport)) {
  if (src.includes("import '../styles/hotfix-right-rail-dark-wrappers.css';")) {
    src = src.replace(
      "import '../styles/hotfix-right-rail-dark-wrappers.css';",
      "import '../styles/hotfix-right-rail-dark-wrappers.css';\n" + finalImport
    );
  } else if (src.includes("import '../styles/visual-stage8-activity-vnext.css';")) {
    src = src.replace(
      "import '../styles/visual-stage8-activity-vnext.css';",
      "import '../styles/visual-stage8-activity-vnext.css';\n" + finalImport
    );
  } else {
    throw new Error('Could not find CSS import anchor.');
  }
}

// 3. Add data attributes if possible, but CSS below also supports nth-child fallback.
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

// 4. CSS: strong, portal/order-safe, with data attrs + nth-child fallback.
const css = `/* CLOSEFLOW_STAGE181V_ACTIVITY_RAIL_FORCE_COLORS
   LOCAL ONLY
   Reason: previous activity rail color CSS was likely imported before hotfix-right-rail-dark-wrappers.css.
   This file must be imported after the hotfix.
   Visual source truth:
   filters/today = blue,
   attention = red,
   cases = emerald,
   leads = indigo.
*/

.activity-vnext-page .activity-right-rail {
  gap: 18px !important;
}

/* Shared card skin */
.activity-vnext-page .activity-right-rail .activity-right-card,
.activity-vnext-page .activity-right-rail .right-card.activity-right-card {
  position: relative !important;
  overflow: hidden !important;
  border-radius: 24px !important;
  border-width: 1px !important;
  background: #ffffff !important;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08) !important;
  padding: 18px !important;
}

.activity-vnext-page .activity-right-rail .activity-right-card::before,
.activity-vnext-page .activity-right-rail .right-card.activity-right-card::before {
  content: "" !important;
  position: absolute !important;
  left: 0 !important;
  top: 14px !important;
  bottom: 14px !important;
  width: 5px !important;
  border-radius: 999px !important;
  background: #2563eb !important;
}

/* Card 1: filters, blue */
.activity-vnext-page .activity-right-rail .activity-right-card[data-activity-rail-card="filters"],
.activity-vnext-page .activity-right-rail .right-card.activity-right-card:nth-of-type(1) {
  border-color: #bfdbfe !important;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 34%),
    #ffffff !important;
}

.activity-vnext-page .activity-right-rail .activity-right-card[data-activity-rail-card="filters"]::before,
.activity-vnext-page .activity-right-rail .right-card.activity-right-card:nth-of-type(1)::before {
  background: #2563eb !important;
}

/* Card 2: cases, emerald */
.activity-vnext-page .activity-right-rail .activity-right-card[data-activity-rail-card="cases"],
.activity-vnext-page .activity-right-rail .right-card.activity-right-card:nth-of-type(2) {
  border-color: #bbf7d0 !important;
  background:
    radial-gradient(circle at top right, rgba(4, 120, 87, 0.12), transparent 34%),
    #ffffff !important;
}

.activity-vnext-page .activity-right-rail .activity-right-card[data-activity-rail-card="cases"]::before,
.activity-vnext-page .activity-right-rail .right-card.activity-right-card:nth-of-type(2)::before {
  background: #047857 !important;
}

/* Card 3: leads, indigo */
.activity-vnext-page .activity-right-rail .activity-right-card[data-activity-rail-card="leads"],
.activity-vnext-page .activity-right-rail .right-card.activity-right-card:nth-of-type(3) {
  border-color: #c7d2fe !important;
  background:
    radial-gradient(circle at top right, rgba(79, 70, 229, 0.13), transparent 34%),
    #ffffff !important;
}

.activity-vnext-page .activity-right-rail .activity-right-card[data-activity-rail-card="leads"]::before,
.activity-vnext-page .activity-right-rail .right-card.activity-right-card:nth-of-type(3)::before {
  background: #4f46e5 !important;
}

/* Header icons as colored chips */
.activity-vnext-page .activity-right-rail .activity-right-card .activity-right-card-head,
.activity-vnext-page .activity-right-rail .right-card.activity-right-card .activity-right-card-head {
  margin-left: 2px !important;
  gap: 10px !important;
  color: #2563eb !important;
}

.activity-vnext-page .activity-right-rail .activity-right-card:nth-of-type(2) .activity-right-card-head,
.activity-vnext-page .activity-right-rail .activity-right-card[data-activity-rail-card="cases"] .activity-right-card-head {
  color: #047857 !important;
}

.activity-vnext-page .activity-right-rail .activity-right-card:nth-of-type(3) .activity-right-card-head,
.activity-vnext-page .activity-right-rail .activity-right-card[data-activity-rail-card="leads"] .activity-right-card-head {
  color: #4f46e5 !important;
}

.activity-vnext-page .activity-right-rail .activity-right-card-head > svg {
  width: 26px !important;
  height: 26px !important;
  padding: 6px !important;
  border-radius: 10px !important;
  background: currentColor !important;
  color: #ffffff !important;
  stroke: #ffffff !important;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.10) !important;
}

.activity-vnext-page .activity-right-rail .activity-right-card-head h2 {
  color: #111827 !important;
  font-weight: 950 !important;
}

/* Quick filters buttons */
.activity-vnext-page .activity-right-rail .activity-rail-button {
  min-height: 46px !important;
  border-radius: 16px !important;
  font-weight: 900 !important;
}

.activity-vnext-page .activity-right-rail .activity-rail-button[data-activity-rail-button="today"],
.activity-vnext-page .activity-right-rail .activity-right-card:nth-of-type(1) .activity-rail-button:nth-of-type(1) {
  border-color: #bfdbfe !important;
  background: #eff6ff !important;
  color: #1d4ed8 !important;
}

.activity-vnext-page .activity-right-rail .activity-rail-button[data-activity-rail-button="attention"],
.activity-vnext-page .activity-right-rail .activity-right-card:nth-of-type(1) .activity-rail-button:nth-of-type(2) {
  border-color: #fecaca !important;
  background: #fef2f2 !important;
  color: #dc2626 !important;
}

.activity-vnext-page .activity-right-rail .activity-rail-button strong {
  min-width: 30px !important;
  height: 26px !important;
  border: 1px solid currentColor !important;
  background: rgba(255,255,255,0.82) !important;
  color: currentColor !important;
  font-weight: 950 !important;
}

/* Empty states get tinted, not dead white */
.activity-vnext-page .activity-right-rail .activity-right-card:nth-of-type(2) .activity-rail-empty,
.activity-vnext-page .activity-right-rail .activity-right-card[data-activity-rail-card="cases"] .activity-rail-empty {
  border: 1px dashed rgba(4, 120, 87, 0.28) !important;
  background: #ecfdf5 !important;
  color: #047857 !important;
}

.activity-vnext-page .activity-right-rail .activity-right-card:nth-of-type(3) .activity-rail-empty,
.activity-vnext-page .activity-right-rail .activity-right-card[data-activity-rail-card="leads"] .activity-rail-empty {
  border: 1px dashed rgba(79, 70, 229, 0.28) !important;
  background: #eef2ff !important;
  color: #4f46e5 !important;
}

.activity-vnext-page .activity-right-rail .activity-rail-empty {
  border-radius: 16px !important;
  padding: 12px !important;
  font-weight: 800 !important;
}

/* Optional: top filter pills also get light visual taxonomy */
.activity-vnext-page .activity-filter-pill:nth-child(1) {
  border-color: #e2e8f0 !important;
  background: #f8fafc !important;
  color: #475569 !important;
}

.activity-vnext-page .activity-filter-pill:nth-child(2) {
  border-color: #bfdbfe !important;
  background: #eff6ff !important;
  color: #1d4ed8 !important;
}

.activity-vnext-page .activity-filter-pill:nth-child(3) {
  border-color: #c7d2fe !important;
  background: #eef2ff !important;
  color: #4f46e5 !important;
}

.activity-vnext-page .activity-filter-pill:nth-child(4) {
  border-color: #bbf7d0 !important;
  background: #ecfdf5 !important;
  color: #047857 !important;
}

.activity-vnext-page .activity-filter-pill:nth-child(5) {
  border-color: #fde68a !important;
  background: #fffbeb !important;
  color: #b45309 !important;
}

.activity-vnext-page .activity-filter-pill:nth-child(6) {
  border-color: #bae6fd !important;
  background: #f0f9ff !important;
  color: #0369a1 !important;
}

.activity-vnext-page .activity-filter-pill:nth-child(7) {
  border-color: #e9d5ff !important;
  background: #faf5ff !important;
  color: #7e22ce !important;
}

.activity-vnext-page .activity-filter-pill strong {
  background: rgba(255,255,255,0.80) !important;
  color: currentColor !important;
  border: 1px solid currentColor !important;
}
`;

fs.writeFileSync(cssPath, css, 'utf8');

const next = fs.readFileSync(tsxPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  "closeflow-activity-rail-force-colors-stage181v.css",
  "data-activity-rail-card=\"filters\"",
  "data-activity-rail-button=\"today\"",
  "data-activity-rail-button=\"attention\"",
  "data-activity-rail-card=\"cases\"",
  "data-activity-rail-card=\"leads\"",
]) {
  if (!next.includes(token)) failures.push('Activity.tsx missing token: ' + token);
}

for (const token of [
  "CLOSEFLOW_STAGE181V_ACTIVITY_RAIL_FORCE_COLORS",
  "nth-of-type(1)",
  "nth-of-type(2)",
  "nth-of-type(3)",
  "#eff6ff",
  "#fef2f2",
  "#ecfdf5",
  "#eef2ff",
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181V local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181V local: activity right rail colors are forced after hotfix import.');
