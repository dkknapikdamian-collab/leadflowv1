const fs = require('fs');

const tsxPath = 'src/pages/NotificationsCenter.tsx';
const cssPath = 'src/styles/closeflow-notifications-rail-force-colors-stage181x.css';

let src = fs.readFileSync(tsxPath, 'utf8');

const finalImport = "import '../styles/closeflow-notifications-rail-force-colors-stage181x.css';";

// 1. Import final CSS after right-rail hotfix so it wins.
if (!src.includes(finalImport)) {
  if (src.includes("import '../styles/hotfix-right-rail-dark-wrappers.css';")) {
    src = src.replace(
      "import '../styles/hotfix-right-rail-dark-wrappers.css';",
      "import '../styles/hotfix-right-rail-dark-wrappers.css';\n" + finalImport
    );
  } else if (src.includes("import '../styles/visual-stage10-notifications-vnext.css';")) {
    src = src.replace(
      "import '../styles/visual-stage10-notifications-vnext.css';",
      "import '../styles/visual-stage10-notifications-vnext.css';\n" + finalImport
    );
  } else {
    throw new Error('Could not find CSS import anchor in NotificationsCenter.tsx.');
  }
}

// 2. Add data attrs for top filter pills.
if (!src.includes('data-notification-filter-kind={filter.value}')) {
  src = src.replace(
    `className={['notifications-filter-pill', activeFilter === filter.value ? 'notifications-filter-pill-active' : ''].join(' ')}`,
    `className={['notifications-filter-pill', activeFilter === filter.value ? 'notifications-filter-pill-active' : ''].join(' ')}
                    data-notification-filter-kind={filter.value}`
  );
}

// 3. Add data attrs for right rail cards and buttons. CSS also has nth-child fallback.
if (!src.includes('data-notification-rail-card="channels"')) {
  src = src.replace(
    `<section className="right-card notifications-right-card">
              <div className="notifications-right-card-head">
                <EntityIcon entity="notification" className="h-4 w-4" />`,
    `<section className="right-card notifications-right-card" data-notification-rail-card="channels">
              <div className="notifications-right-card-head">
                <EntityIcon entity="notification" className="h-4 w-4" />`
  );
}

if (!src.includes('data-notification-rail-card="actions"')) {
  src = src.replace(
    `<section className="right-card notifications-right-card">
              <div className="notifications-right-card-head">
                <Filter className="h-4 w-4" />`,
    `<section className="right-card notifications-right-card" data-notification-rail-card="actions">
              <div className="notifications-right-card-head">
                <Filter className="h-4 w-4" />`
  );
}

if (!src.includes('data-notification-rail-card="upcoming"')) {
  src = src.replace(
    `<section className="right-card notifications-right-card">
              <div className="notifications-right-card-head">
                <Clock3 className="h-4 w-4" />`,
    `<section className="right-card notifications-right-card" data-notification-rail-card="upcoming">
              <div className="notifications-right-card-head">
                <Clock3 className="h-4 w-4" />`
  );
}

if (!src.includes('data-notification-rail-card="help"')) {
  src = src.replace(
    `<section className="right-card notifications-right-card">
              <div className="notifications-right-card-head">
                <Mail className="h-4 w-4" />`,
    `<section className="right-card notifications-right-card" data-notification-rail-card="help">
              <div className="notifications-right-card-head">
                <Mail className="h-4 w-4" />`
  );
}

if (!src.includes('data-notification-rail-button="action"')) {
  src = src.replace(
    `<button type="button" className="notifications-rail-button" onClick={() => setActiveFilter('action')}>`,
    `<button type="button" className="notifications-rail-button" data-notification-rail-button="action" onClick={() => setActiveFilter('action')}>`
  );
}

if (!src.includes('data-notification-rail-button="overdue"')) {
  src = src.replace(
    `<button type="button" className="notifications-rail-button" onClick={() => setActiveFilter('overdue')}>`,
    `<button type="button" className="notifications-rail-button" data-notification-rail-button="overdue" onClick={() => setActiveFilter('overdue')}>`
  );
}

if (!src.includes('data-notification-rail-button="read"')) {
  src = src.replace(
    `<button type="button" className="notifications-rail-button" onClick={handleMarkAllRead}>`,
    `<button type="button" className="notifications-rail-button" data-notification-rail-button="read" onClick={handleMarkAllRead}>`
  );
}

fs.writeFileSync(tsxPath, src, 'utf8');

// 4. CSS with strong selectors + nth-of-type fallback.
const css = `/* CLOSEFLOW_STAGE181X_NOTIFICATIONS_RAIL_FORCE_COLORS
   LOCAL ONLY
   Scope: /notifications.
   Visual taxonomy:
   channels = amber,
   actions/action = blue,
   overdue = red,
   read = emerald,
   upcoming = violet,
   help = sky.
*/

:root {
  --cf-notif-amber-bg: #fffbeb;
  --cf-notif-amber-border: #fde68a;
  --cf-notif-amber-text: #b45309;

  --cf-notif-blue-bg: #eff6ff;
  --cf-notif-blue-border: #bfdbfe;
  --cf-notif-blue-text: #1d4ed8;

  --cf-notif-red-bg: #fef2f2;
  --cf-notif-red-border: #fecaca;
  --cf-notif-red-text: #dc2626;

  --cf-notif-emerald-bg: #ecfdf5;
  --cf-notif-emerald-border: #bbf7d0;
  --cf-notif-emerald-text: #047857;

  --cf-notif-violet-bg: #f5f3ff;
  --cf-notif-violet-border: #ddd6fe;
  --cf-notif-violet-text: #6d28d9;

  --cf-notif-sky-bg: #f0f9ff;
  --cf-notif-sky-border: #bae6fd;
  --cf-notif-sky-text: #0369a1;

  --cf-notif-slate-bg: #f8fafc;
  --cf-notif-slate-border: #e2e8f0;
  --cf-notif-slate-text: #475569;
}

/* Top filter pills */
.notifications-vnext-page .notifications-filter-pill[data-notification-filter-kind="all"],
.notifications-vnext-page .notifications-filter-pill:nth-child(1) {
  border-color: var(--cf-notif-slate-border) !important;
  background: var(--cf-notif-slate-bg) !important;
  color: var(--cf-notif-slate-text) !important;
}

.notifications-vnext-page .notifications-filter-pill[data-notification-filter-kind="action"],
.notifications-vnext-page .notifications-filter-pill:nth-child(2) {
  border-color: var(--cf-notif-blue-border) !important;
  background: var(--cf-notif-blue-bg) !important;
  color: var(--cf-notif-blue-text) !important;
}

.notifications-vnext-page .notifications-filter-pill[data-notification-filter-kind="overdue"],
.notifications-vnext-page .notifications-filter-pill:nth-child(3) {
  border-color: var(--cf-notif-red-border) !important;
  background: var(--cf-notif-red-bg) !important;
  color: var(--cf-notif-red-text) !important;
}

.notifications-vnext-page .notifications-filter-pill[data-notification-filter-kind="today"],
.notifications-vnext-page .notifications-filter-pill:nth-child(4) {
  border-color: var(--cf-notif-blue-border) !important;
  background: var(--cf-notif-blue-bg) !important;
  color: var(--cf-notif-blue-text) !important;
}

.notifications-vnext-page .notifications-filter-pill[data-notification-filter-kind="upcoming"],
.notifications-vnext-page .notifications-filter-pill:nth-child(5) {
  border-color: var(--cf-notif-violet-border) !important;
  background: var(--cf-notif-violet-bg) !important;
  color: var(--cf-notif-violet-text) !important;
}

.notifications-vnext-page .notifications-filter-pill[data-notification-filter-kind="snoozed"],
.notifications-vnext-page .notifications-filter-pill:nth-child(6) {
  border-color: var(--cf-notif-amber-border) !important;
  background: var(--cf-notif-amber-bg) !important;
  color: var(--cf-notif-amber-text) !important;
}

.notifications-vnext-page .notifications-filter-pill[data-notification-filter-kind="read"],
.notifications-vnext-page .notifications-filter-pill:nth-child(7) {
  border-color: var(--cf-notif-emerald-border) !important;
  background: var(--cf-notif-emerald-bg) !important;
  color: var(--cf-notif-emerald-text) !important;
}

.notifications-vnext-page .notifications-filter-pill[data-notification-filter-kind="system"],
.notifications-vnext-page .notifications-filter-pill:nth-child(8) {
  border-color: var(--cf-notif-violet-border) !important;
  background: var(--cf-notif-violet-bg) !important;
  color: var(--cf-notif-violet-text) !important;
}

.notifications-vnext-page .notifications-filter-pill strong {
  background: rgba(255,255,255,0.82) !important;
  border: 1px solid currentColor !important;
  color: currentColor !important;
}

.notifications-vnext-page .notifications-filter-pill-active {
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08) !important;
  transform: translateY(-1px) !important;
}

/* Right rail base */
.notifications-vnext-page .notifications-right-rail {
  gap: 18px !important;
}

.notifications-vnext-page .notifications-right-rail .notifications-right-card,
.notifications-vnext-page .notifications-right-rail .right-card.notifications-right-card {
  position: relative !important;
  overflow: hidden !important;
  border-radius: 24px !important;
  border-width: 1px !important;
  background: #ffffff !important;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08) !important;
  padding: 18px !important;
}

.notifications-vnext-page .notifications-right-rail .notifications-right-card::before,
.notifications-vnext-page .notifications-right-rail .right-card.notifications-right-card::before {
  content: "" !important;
  position: absolute !important;
  left: 0 !important;
  top: 14px !important;
  bottom: 14px !important;
  width: 5px !important;
  border-radius: 999px !important;
  background: var(--cf-notif-blue-text) !important;
}

/* Card 1: channels amber */
.notifications-vnext-page .notifications-right-card[data-notification-rail-card="channels"],
.notifications-vnext-page .notifications-right-rail .right-card.notifications-right-card:nth-of-type(1) {
  border-color: var(--cf-notif-amber-border) !important;
  background:
    radial-gradient(circle at top right, rgba(180, 83, 9, 0.11), transparent 34%),
    #ffffff !important;
}

.notifications-vnext-page .notifications-right-card[data-notification-rail-card="channels"]::before,
.notifications-vnext-page .notifications-right-rail .right-card.notifications-right-card:nth-of-type(1)::before {
  background: var(--cf-notif-amber-text) !important;
}

/* Card 2: actions blue */
.notifications-vnext-page .notifications-right-card[data-notification-rail-card="actions"],
.notifications-vnext-page .notifications-right-rail .right-card.notifications-right-card:nth-of-type(2) {
  border-color: var(--cf-notif-blue-border) !important;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 34%),
    #ffffff !important;
}

.notifications-vnext-page .notifications-right-card[data-notification-rail-card="actions"]::before,
.notifications-vnext-page .notifications-right-rail .right-card.notifications-right-card:nth-of-type(2)::before {
  background: var(--cf-notif-blue-text) !important;
}

/* Card 3: upcoming violet */
.notifications-vnext-page .notifications-right-card[data-notification-rail-card="upcoming"],
.notifications-vnext-page .notifications-right-rail .right-card.notifications-right-card:nth-of-type(3) {
  border-color: var(--cf-notif-violet-border) !important;
  background:
    radial-gradient(circle at top right, rgba(109, 40, 217, 0.11), transparent 34%),
    #ffffff !important;
}

.notifications-vnext-page .notifications-right-card[data-notification-rail-card="upcoming"]::before,
.notifications-vnext-page .notifications-right-rail .right-card.notifications-right-card:nth-of-type(3)::before {
  background: var(--cf-notif-violet-text) !important;
}

/* Card 4: help sky */
.notifications-vnext-page .notifications-right-card[data-notification-rail-card="help"],
.notifications-vnext-page .notifications-right-rail .right-card.notifications-right-card:nth-of-type(4) {
  border-color: var(--cf-notif-sky-border) !important;
  background:
    radial-gradient(circle at top right, rgba(3, 105, 161, 0.10), transparent 34%),
    #ffffff !important;
}

.notifications-vnext-page .notifications-right-card[data-notification-rail-card="help"]::before,
.notifications-vnext-page .notifications-right-rail .right-card.notifications-right-card:nth-of-type(4)::before {
  background: var(--cf-notif-sky-text) !important;
}

/* Header icon chips */
.notifications-vnext-page .notifications-right-card .notifications-right-card-head {
  margin-left: 2px !important;
  gap: 10px !important;
  color: var(--cf-notif-amber-text) !important;
}

.notifications-vnext-page .notifications-right-card:nth-of-type(2) .notifications-right-card-head,
.notifications-vnext-page .notifications-right-card[data-notification-rail-card="actions"] .notifications-right-card-head {
  color: var(--cf-notif-blue-text) !important;
}

.notifications-vnext-page .notifications-right-card:nth-of-type(3) .notifications-right-card-head,
.notifications-vnext-page .notifications-right-card[data-notification-rail-card="upcoming"] .notifications-right-card-head {
  color: var(--cf-notif-violet-text) !important;
}

.notifications-vnext-page .notifications-right-card:nth-of-type(4) .notifications-right-card-head,
.notifications-vnext-page .notifications-right-card[data-notification-rail-card="help"] .notifications-right-card-head {
  color: var(--cf-notif-sky-text) !important;
}

.notifications-vnext-page .notifications-right-card-head > svg {
  width: 26px !important;
  height: 26px !important;
  padding: 6px !important;
  border-radius: 10px !important;
  background: currentColor !important;
  color: #ffffff !important;
  stroke: #ffffff !important;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.10) !important;
}

.notifications-vnext-page .notifications-right-card-head h2 {
  color: #111827 !important;
  font-weight: 950 !important;
}

/* Channel cards */
.notifications-vnext-page .notifications-channel-card {
  border-radius: 16px !important;
  border: 1px solid rgba(180, 83, 9, 0.18) !important;
  background: var(--cf-notif-amber-bg) !important;
}

.notifications-vnext-page .notifications-channel-card + .notifications-channel-card {
  margin-top: 10px !important;
}

.notifications-vnext-page .notifications-channel-card button {
  border-color: var(--cf-notif-blue-border) !important;
  background: var(--cf-notif-blue-bg) !important;
  color: var(--cf-notif-blue-text) !important;
  font-weight: 900 !important;
}

/* Quick action buttons */
.notifications-vnext-page .notifications-rail-button {
  min-height: 46px !important;
  border-radius: 16px !important;
  font-weight: 900 !important;
}

.notifications-vnext-page .notifications-rail-button[data-notification-rail-button="action"],
.notifications-vnext-page .notifications-right-card:nth-of-type(2) .notifications-rail-button:nth-of-type(1) {
  border-color: var(--cf-notif-blue-border) !important;
  background: var(--cf-notif-blue-bg) !important;
  color: var(--cf-notif-blue-text) !important;
}

.notifications-vnext-page .notifications-rail-button[data-notification-rail-button="overdue"],
.notifications-vnext-page .notifications-right-card:nth-of-type(2) .notifications-rail-button:nth-of-type(2) {
  border-color: var(--cf-notif-red-border) !important;
  background: var(--cf-notif-red-bg) !important;
  color: var(--cf-notif-red-text) !important;
}

.notifications-vnext-page .notifications-rail-button[data-notification-rail-button="read"],
.notifications-vnext-page .notifications-right-card:nth-of-type(2) .notifications-rail-button:nth-of-type(3) {
  border-color: var(--cf-notif-emerald-border) !important;
  background: var(--cf-notif-emerald-bg) !important;
  color: var(--cf-notif-emerald-text) !important;
}

.notifications-vnext-page .notifications-rail-button strong {
  min-width: 30px !important;
  height: 26px !important;
  border: 1px solid currentColor !important;
  background: rgba(255,255,255,0.82) !important;
  color: currentColor !important;
  font-weight: 950 !important;
}

/* Empty states */
.notifications-vnext-page .notifications-right-card:nth-of-type(3) .notifications-rail-empty,
.notifications-vnext-page .notifications-right-card[data-notification-rail-card="upcoming"] .notifications-rail-empty {
  border: 1px dashed rgba(109, 40, 217, 0.28) !important;
  background: var(--cf-notif-violet-bg) !important;
  color: var(--cf-notif-violet-text) !important;
}

.notifications-vnext-page .notifications-right-card:nth-of-type(4) .notifications-rail-empty,
.notifications-vnext-page .notifications-right-card[data-notification-rail-card="help"] .notifications-rail-empty {
  border: 1px dashed rgba(3, 105, 161, 0.24) !important;
  background: var(--cf-notif-sky-bg) !important;
  color: #075985 !important;
}

.notifications-vnext-page .notifications-rail-empty {
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
  "closeflow-notifications-rail-force-colors-stage181x.css",
  "data-notification-filter-kind={filter.value}",
  'data-notification-rail-card="channels"',
  'data-notification-rail-card="actions"',
  'data-notification-rail-card="upcoming"',
  'data-notification-rail-card="help"',
  'data-notification-rail-button="action"',
  'data-notification-rail-button="overdue"',
  'data-notification-rail-button="read"',
]) {
  if (!next.includes(token)) failures.push('NotificationsCenter.tsx missing token: ' + token);
}

for (const token of [
  "CLOSEFLOW_STAGE181X_NOTIFICATIONS_RAIL_FORCE_COLORS",
  "nth-of-type(1)",
  "nth-of-type(2)",
  "nth-of-type(3)",
  "nth-of-type(4)",
  "#fffbeb",
  "#eff6ff",
  "#fef2f2",
  "#ecfdf5",
  "#f5f3ff",
  "#f0f9ff",
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181X local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181X local: notifications rail and filters use colored visual taxonomy.');
