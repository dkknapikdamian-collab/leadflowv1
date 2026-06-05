const fs = require('fs');

const tsxPath = 'src/pages/Billing.tsx';
const cssPath = 'src/styles/closeflow-billing-visual-taxonomy-stage181z.css';

let src = fs.readFileSync(tsxPath, 'utf8');

const finalImport = "import '../styles/closeflow-billing-visual-taxonomy-stage181z.css';";

// 1. Import final CSS after billing/page-header styles so it wins.
if (!src.includes(finalImport)) {
  if (src.includes("import '../styles/closeflow-page-header-v2.css';")) {
    src = src.replace(
      "import '../styles/closeflow-page-header-v2.css';",
      "import '../styles/closeflow-page-header-v2.css';\n" + finalImport
    );
  } else if (src.includes("import '../styles/visual-stage16-billing-vnext.css';")) {
    src = src.replace(
      "import '../styles/visual-stage16-billing-vnext.css';",
      "import '../styles/visual-stage16-billing-vnext.css';\n" + finalImport
    );
  } else {
    throw new Error('Could not find CSS import anchor in Billing.tsx.');
  }
}

// 2. Add plan key data attr for stable color source truth.
if (!src.includes('data-billing-plan-key={plan.key}')) {
  src = src.replace(
    `<article key={plan.id} className={['billing-plan-card', availability === 'current' ? 'billing-plan-current' : ''].join(' ')}>`,
    `<article key={plan.id} className={['billing-plan-card', availability === 'current' ? 'billing-plan-current' : ''].join(' ')} data-billing-plan-key={plan.key}>`
  );
}

// 3. Add data attrs for right rail cards. CSS also has nth-of-type fallback.
if (!src.includes('data-billing-rail-card="status"')) {
  src = src.replace(
    `<section className="right-card billing-right-card">
                <div className="billing-right-title">
                  <Shield className="h-4 w-4" />`,
    `<section className="right-card billing-right-card" data-billing-rail-card="status">
                <div className="billing-right-title">
                  <Shield className="h-4 w-4" />`
  );
}

if (!src.includes('data-billing-rail-card="summary"')) {
  src = src.replace(
    `<section className="right-card billing-right-card">

<div className="billing-right-list">`,
    `<section className="right-card billing-right-card" data-billing-rail-card="summary">

<div className="billing-right-list">`
  );
}

if (!src.includes('data-billing-rail-card="popular"')) {
  src = src.replace(
    `<section className="right-card billing-right-card billing-right-featured">`,
    `<section className="right-card billing-right-card billing-right-featured" data-billing-rail-card="popular">`
  );
}

if (!src.includes('data-billing-rail-card="pro"')) {
  src = src.replace(
    `<section className="right-card billing-right-card">
                <div className="billing-right-title">
                  <BadgeCheck className="h-4 w-4" />`,
    `<section className="right-card billing-right-card" data-billing-rail-card="pro">
                <div className="billing-right-title">
                  <BadgeCheck className="h-4 w-4" />`
  );
}

if (!src.includes('data-billing-rail-card="ai"')) {
  src = src.replace(
    `<section className="right-card billing-right-card">
                <div className="billing-right-title">
                  <EntityIcon entity="ai" className="h-4 w-4" />`,
    `<section className="right-card billing-right-card" data-billing-rail-card="ai">
                <div className="billing-right-title">
                  <EntityIcon entity="ai" className="h-4 w-4" />`
  );
}

fs.writeFileSync(tsxPath, src, 'utf8');

const css = `/* CLOSEFLOW_STAGE181Z_BILLING_VISUAL_TAXONOMY
   LOCAL ONLY
   Scope: /billing.
   Goal: billing screen should not be flat black-white.
   Visual taxonomy:
   Free = slate,
   Basic = blue,
   Pro = emerald,
   AI/Beta = violet,
   Status = blue/amber based on existing class,
   Summary = slate,
   Popular/AI = violet,
   Pro unlocks = emerald.
*/

:root {
  --cf-billing-slate-bg: #f8fafc;
  --cf-billing-slate-border: #e2e8f0;
  --cf-billing-slate-text: #475569;

  --cf-billing-blue-bg: #eff6ff;
  --cf-billing-blue-border: #bfdbfe;
  --cf-billing-blue-text: #1d4ed8;

  --cf-billing-emerald-bg: #ecfdf5;
  --cf-billing-emerald-border: #bbf7d0;
  --cf-billing-emerald-text: #047857;

  --cf-billing-violet-bg: #f5f3ff;
  --cf-billing-violet-border: #ddd6fe;
  --cf-billing-violet-text: #6d28d9;

  --cf-billing-amber-bg: #fffbeb;
  --cf-billing-amber-border: #fde68a;
  --cf-billing-amber-text: #b45309;
}

/* Main status card: stronger hierarchy */
.billing-vnext-page .billing-status-card {
  position: relative !important;
  overflow: hidden !important;
  border-radius: 28px !important;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08) !important;
}

.billing-vnext-page .billing-status-card::before {
  content: "" !important;
  position: absolute !important;
  left: 0 !important;
  top: 18px !important;
  bottom: 18px !important;
  width: 5px !important;
  border-radius: 999px !important;
  background: var(--cf-billing-blue-text) !important;
}

.billing-vnext-page .billing-status-amber {
  border-color: var(--cf-billing-amber-border) !important;
  background:
    radial-gradient(circle at top right, rgba(180, 83, 9, 0.10), transparent 34%),
    #ffffff !important;
}

.billing-vnext-page .billing-status-amber::before {
  background: var(--cf-billing-amber-text) !important;
}

.billing-vnext-page .billing-status-green {
  border-color: var(--cf-billing-emerald-border) !important;
  background:
    radial-gradient(circle at top right, rgba(4, 120, 87, 0.10), transparent 34%),
    #ffffff !important;
}

.billing-vnext-page .billing-status-green::before {
  background: var(--cf-billing-emerald-text) !important;
}

.billing-vnext-page .billing-status-red {
  border-color: #fecaca !important;
  background:
    radial-gradient(circle at top right, rgba(220, 38, 38, 0.10), transparent 34%),
    #ffffff !important;
}

.billing-vnext-page .billing-status-red::before {
  background: #dc2626 !important;
}

.billing-vnext-page .billing-status-slate {
  border-color: var(--cf-billing-slate-border) !important;
  background:
    radial-gradient(circle at top right, rgba(71, 85, 105, 0.08), transparent 34%),
    #ffffff !important;
}

/* Period card */
.billing-vnext-page .billing-period-card {
  border-color: #dbeafe !important;
  background:
    linear-gradient(180deg, rgba(239, 246, 255, 0.70), rgba(255,255,255,0.96)) !important;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.06) !important;
}

.billing-vnext-page .billing-period-card h2 {
  color: #0f172a !important;
  font-weight: 950 !important;
}

.billing-vnext-page .billing-period-switch button {
  font-weight: 900 !important;
}

.billing-vnext-page .billing-period-switch .billing-period-active {
  border-color: var(--cf-billing-blue-border) !important;
  background: var(--cf-billing-blue-bg) !important;
  color: var(--cf-billing-blue-text) !important;
}

/* Plan cards */
.billing-vnext-page .billing-plan-card {
  position: relative !important;
  overflow: hidden !important;
  border-width: 1px !important;
  border-radius: 24px !important;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.07) !important;
}

.billing-vnext-page .billing-plan-card::before {
  content: "" !important;
  position: absolute !important;
  left: 0 !important;
  top: 16px !important;
  bottom: 16px !important;
  width: 5px !important;
  border-radius: 999px !important;
  background: var(--cf-billing-slate-text) !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="free"] {
  border-color: var(--cf-billing-slate-border) !important;
  background:
    radial-gradient(circle at top right, rgba(71, 85, 105, 0.07), transparent 34%),
    #ffffff !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="free"]::before {
  background: var(--cf-billing-slate-text) !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="basic"] {
  border-color: var(--cf-billing-blue-border) !important;
  background:
    radial-gradient(circle at top right, rgba(29, 78, 216, 0.09), transparent 34%),
    #ffffff !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="basic"]::before {
  background: var(--cf-billing-blue-text) !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="pro"] {
  border-color: var(--cf-billing-emerald-border) !important;
  background:
    radial-gradient(circle at top right, rgba(4, 120, 87, 0.12), transparent 34%),
    #ffffff !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="pro"]::before {
  background: var(--cf-billing-emerald-text) !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="ai"] {
  border-color: var(--cf-billing-violet-border) !important;
  background:
    radial-gradient(circle at top right, rgba(109, 40, 217, 0.13), transparent 34%),
    #ffffff !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="ai"]::before {
  background: var(--cf-billing-violet-text) !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="pro"].billing-plan-current,
.billing-vnext-page .billing-plan-card[data-billing-plan-key="pro"]:has(strong) {
  box-shadow: 0 18px 42px rgba(4, 120, 87, 0.14) !important;
}

.billing-vnext-page .billing-plan-status {
  border: 1px solid currentColor !important;
  background: rgba(255,255,255,0.78) !important;
  color: inherit !important;
  font-weight: 950 !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="free"] .billing-plan-status {
  color: var(--cf-billing-slate-text) !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="basic"] .billing-plan-status,
.billing-vnext-page .billing-plan-card[data-billing-plan-key="basic"] .billing-plan-price span {
  color: var(--cf-billing-blue-text) !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="pro"] .billing-plan-status,
.billing-vnext-page .billing-plan-card[data-billing-plan-key="pro"] .billing-plan-price span {
  color: var(--cf-billing-emerald-text) !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="ai"] .billing-plan-status,
.billing-vnext-page .billing-plan-card[data-billing-plan-key="ai"] .billing-plan-price span {
  color: var(--cf-billing-violet-text) !important;
}

.billing-vnext-page .billing-plan-card li svg {
  padding: 2px !important;
  border-radius: 999px !important;
  background: #eff6ff !important;
  color: #2563eb !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="pro"] li svg {
  background: var(--cf-billing-emerald-bg) !important;
  color: var(--cf-billing-emerald-text) !important;
}

.billing-vnext-page .billing-plan-card[data-billing-plan-key="ai"] li svg {
  background: var(--cf-billing-violet-bg) !important;
  color: var(--cf-billing-violet-text) !important;
}

.billing-vnext-page .billing-plan-button {
  font-weight: 950 !important;
  border-radius: 16px !important;
}

/* Right rail */
.billing-vnext-page .billing-right-rail {
  gap: 18px !important;
}

.billing-vnext-page .billing-right-card {
  position: relative !important;
  overflow: hidden !important;
  border-radius: 24px !important;
  border-width: 1px !important;
  background: #ffffff !important;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08) !important;
  padding: 18px !important;
}

.billing-vnext-page .billing-right-card::before {
  content: "" !important;
  position: absolute !important;
  left: 0 !important;
  top: 14px !important;
  bottom: 14px !important;
  width: 5px !important;
  border-radius: 999px !important;
  background: var(--cf-billing-blue-text) !important;
}

/* Rail card 1: account status */
.billing-vnext-page .billing-right-card[data-billing-rail-card="status"],
.billing-vnext-page .billing-right-rail .billing-right-card:nth-of-type(1) {
  border-color: var(--cf-billing-blue-border) !important;
  background:
    radial-gradient(circle at top right, rgba(29, 78, 216, 0.10), transparent 34%),
    #ffffff !important;
}

/* Rail card 2: summary */
.billing-vnext-page .billing-right-card[data-billing-rail-card="summary"],
.billing-vnext-page .billing-right-rail .billing-right-card:nth-of-type(2) {
  border-color: var(--cf-billing-slate-border) !important;
  background:
    radial-gradient(circle at top right, rgba(71, 85, 105, 0.07), transparent 34%),
    #ffffff !important;
}

.billing-vnext-page .billing-right-card[data-billing-rail-card="summary"]::before,
.billing-vnext-page .billing-right-rail .billing-right-card:nth-of-type(2)::before {
  background: var(--cf-billing-slate-text) !important;
}

/* Rail card 3: popular Pro */
.billing-vnext-page .billing-right-card[data-billing-rail-card="popular"],
.billing-vnext-page .billing-right-rail .billing-right-card:nth-of-type(3) {
  border-color: var(--cf-billing-violet-border) !important;
  background:
    radial-gradient(circle at top right, rgba(109, 40, 217, 0.13), transparent 34%),
    #ffffff !important;
}

.billing-vnext-page .billing-right-card[data-billing-rail-card="popular"]::before,
.billing-vnext-page .billing-right-rail .billing-right-card:nth-of-type(3)::before {
  background: var(--cf-billing-violet-text) !important;
}

/* Rail card 4: Pro unlocks */
.billing-vnext-page .billing-right-card[data-billing-rail-card="pro"],
.billing-vnext-page .billing-right-rail .billing-right-card:nth-of-type(4) {
  border-color: var(--cf-billing-emerald-border) !important;
  background:
    radial-gradient(circle at top right, rgba(4, 120, 87, 0.12), transparent 34%),
    #ffffff !important;
}

.billing-vnext-page .billing-right-card[data-billing-rail-card="pro"]::before,
.billing-vnext-page .billing-right-rail .billing-right-card:nth-of-type(4)::before {
  background: var(--cf-billing-emerald-text) !important;
}

/* Rail card 5: AI beta */
.billing-vnext-page .billing-right-card[data-billing-rail-card="ai"],
.billing-vnext-page .billing-right-rail .billing-right-card:nth-of-type(5) {
  border-color: var(--cf-billing-violet-border) !important;
  background:
    radial-gradient(circle at top right, rgba(109, 40, 217, 0.13), transparent 34%),
    #ffffff !important;
}

.billing-vnext-page .billing-right-card[data-billing-rail-card="ai"]::before,
.billing-vnext-page .billing-right-rail .billing-right-card:nth-of-type(5)::before {
  background: var(--cf-billing-violet-text) !important;
}

.billing-vnext-page .billing-right-title {
  gap: 10px !important;
}

.billing-vnext-page .billing-right-title svg {
  width: 26px !important;
  height: 26px !important;
  padding: 6px !important;
  border-radius: 10px !important;
  background: currentColor !important;
  color: #ffffff !important;
  stroke: #ffffff !important;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.10) !important;
}

.billing-vnext-page .billing-right-card:nth-of-type(1) .billing-right-title { color: var(--cf-billing-blue-text) !important; }
.billing-vnext-page .billing-right-card:nth-of-type(2) .billing-right-title { color: var(--cf-billing-slate-text) !important; }
.billing-vnext-page .billing-right-card:nth-of-type(3) .billing-right-title { color: var(--cf-billing-violet-text) !important; }
.billing-vnext-page .billing-right-card:nth-of-type(4) .billing-right-title { color: var(--cf-billing-emerald-text) !important; }
.billing-vnext-page .billing-right-card:nth-of-type(5) .billing-right-title { color: var(--cf-billing-violet-text) !important; }

.billing-vnext-page .billing-right-title h2 {
  color: #111827 !important;
  font-weight: 950 !important;
}

.billing-vnext-page .billing-right-list span {
  border-radius: 16px !important;
  border: 1px solid rgba(148, 163, 184, 0.28) !important;
  background: #f8fafc !important;
  color: #334155 !important;
  font-weight: 850 !important;
}

.billing-vnext-page .billing-right-card[data-billing-rail-card="pro"] .billing-right-list span,
.billing-vnext-page .billing-right-rail .billing-right-card:nth-of-type(4) .billing-right-list span {
  border-color: rgba(4, 120, 87, 0.24) !important;
  background: var(--cf-billing-emerald-bg) !important;
  color: var(--cf-billing-emerald-text) !important;
}

.billing-vnext-page .billing-right-featured button {
  border-color: var(--cf-billing-blue-border) !important;
  background: var(--cf-billing-blue-bg) !important;
  color: var(--cf-billing-blue-text) !important;
  font-weight: 950 !important;
}

.billing-vnext-page .billing-right-card button {
  font-weight: 850 !important;
  border-radius: 14px !important;
}

@media (max-width: 860px) {
  .billing-vnext-page .billing-plan-card::before,
  .billing-vnext-page .billing-right-card::before,
  .billing-vnext-page .billing-status-card::before {
    width: 4px !important;
  }
}
`;

fs.writeFileSync(cssPath, css, 'utf8');

const next = fs.readFileSync(tsxPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  "closeflow-billing-visual-taxonomy-stage181z.css",
  "data-billing-plan-key={plan.key}",
  'data-billing-rail-card="status"',
  'data-billing-rail-card="summary"',
  'data-billing-rail-card="popular"',
  'data-billing-rail-card="pro"',
  'data-billing-rail-card="ai"',
]) {
  if (!next.includes(token)) failures.push('Billing.tsx missing token: ' + token);
}

for (const token of [
  "CLOSEFLOW_STAGE181Z_BILLING_VISUAL_TAXONOMY",
  "--cf-billing-blue-bg",
  "--cf-billing-emerald-bg",
  "--cf-billing-violet-bg",
  "data-billing-plan-key",
  "data-billing-rail-card",
  "billing-plan-card::before",
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181Z local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181Z local: billing page uses plan and right-rail visual taxonomy.');
