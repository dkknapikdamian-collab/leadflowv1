const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const casePath = path.join(repo, 'src/pages/CaseDetail.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage13-case-detail-vnext.css');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('Brak pliku: ' + path.relative(repo, filePath));
  return fs.readFileSync(filePath, 'utf8');
}
function write(filePath, content) { fs.writeFileSync(filePath, content, 'utf8'); }
function normalizeEol(value) { return String(value || '').replace(/\r\n/g, '\n'); }
function escapeRegex(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function findMatchingBrace(source, openIndex) {
  let quote = null;
  let escaped = false;
  let depth = 0;
  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (ch === quote && !escaped) quote = null;
      escaped = ch === '\\' && !escaped;
      if (ch !== '\\') escaped = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; escaped = false; continue; }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}
function removeBetweenFunctions(source, startNeedles, endNeedle) {
  for (const startNeedle of startNeedles) {
    while (source.includes(startNeedle)) {
      const start = source.indexOf(startNeedle);
      const end = source.indexOf(endNeedle, start);
      if (end < 0) break;
      source = source.slice(0, start) + source.slice(end);
    }
  }
  return source;
}
function removeTypeBlock(source, typeName) {
  const re = new RegExp('\\ntype\\s+' + escapeRegex(typeName) + '\\s*=\\s*\\{[\\s\\S]*?\\n\\};\\n?', 'g');
  return source.replace(re, '\n');
}
function insertAfterType(source, typeName, block) {
  if (source.includes('type CaseHistoryItem =')) return source;
  const idx = source.indexOf('type ' + typeName + ' =');
  if (idx < 0) throw new Error('Nie znaleziono type ' + typeName);
  const open = source.indexOf('{', idx);
  const close = findMatchingBrace(source, open);
  if (open < 0 || close < 0) throw new Error('Nie znaleziono końca type ' + typeName);
  const semi = source.indexOf(';', close);
  const end = semi >= 0 ? semi + 1 : close + 1;
  return source.slice(0, end) + '\n\n' + block.trim() + '\n' + source.slice(end);
}
function insertBeforeFunction(source, functionName, block) {
  if (source.includes('function buildCaseHistoryItemsStage14D')) return source;
  const needle = 'function ' + functionName;
  const idx = source.indexOf(needle);
  if (idx < 0) throw new Error('Nie znaleziono funkcji kotwicy: ' + functionName);
  return source.slice(0, idx) + block.trim() + '\n\n' + source.slice(idx);
}
function findStateVar(source, typeName, fallback) {
  const re = new RegExp('const\\s*\\[\\s*([A-Za-z_$][\\w$]*)\\s*,\\s*[A-Za-z_$][\\w$]*\\s*\\]\\s*=\\s*useState\\s*<\\s*' + escapeRegex(typeName) + '\\s*\\[\\]\\s*>', 'm');
  const match = source.match(re);
  return match ? match[1] : fallback;
}
function findEnclosingOpeningTag(source, needleIndex, tags) {
  let best = null;
  for (const tag of tags) {
    const idx = source.lastIndexOf('<' + tag, needleIndex);
    if (idx >= 0 && (!best || idx > best.index)) best = { tag, index: idx };
  }
  return best;
}
function findMatchingTagEnd(source, tag, start) {
  const tagRegex = new RegExp('<\\/?' + tag + '\\b[^>]*>', 'g');
  tagRegex.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tagRegex.exec(source))) {
    const text = match[0];
    const isClosing = text.startsWith('</' + tag);
    const isSelfClosing = /\/>\s*$/.test(text);
    if (isClosing) depth -= 1;
    else if (!isSelfClosing) depth += 1;
    if (depth === 0) return tagRegex.lastIndex;
  }
  return -1;
}
function replaceSectionByNeedles(source, needles, block) {
  for (const needle of needles) {
    const idx = source.indexOf(needle);
    if (idx < 0) continue;
    const opening = findEnclosingOpeningTag(source, idx, ['section', 'div']);
    if (!opening) continue;
    const end = findMatchingTagEnd(source, opening.tag, opening.index);
    if (end < 0) continue;
    const oldBlock = source.slice(opening.index, end);
    if (!oldBlock.includes('case-detail-section-card') && !oldBlock.includes('case-detail-history')) continue;
    return {
      source: source.slice(0, opening.index) + block.trim() + source.slice(end),
      changed: true,
      needle,
    };
  }
  return { source, changed: false, needle: '' };
}
function removeCssStage14D(css) {
  return css.replace(/\n\/\* STAGE14D_REAL_CASE_HISTORY[^*]*\*\/[\s\S]*?(?=\n\/\* STAGE|\s*$)/g, '');
}

let source = normalizeEol(read(casePath));
let css = normalizeEol(read(cssPath));
const originalSource = source;
const originalCss = css;

// Remove partial failed Stage14D attempts first. Repair3 owns this block.
source = source.replace(/\/\* STAGE14D[^*]*\*\/\n?/g, '');
source = removeTypeBlock(source, 'CaseHistoryItem');
source = removeBetweenFunctions(source, [
  'function getCaseHistoryPayloadStage14D',
  'function asCaseHistoryTextStage14D',
  'function isGenericCaseHistoryTextStage14D',
  'function pickCaseHistoryBodyStage14D',
  'function getCaseHistoryDateStage14D',
  'function getCaseActivityHistoryItemStage14D',
  'function sortCaseHistoryItemsStage14D',
  'function buildCaseHistoryItemsStage14D',
], 'function sortCaseItems');

if (!source.includes('STAGE14D_REAL_CASE_HISTORY_REPAIR3')) {
  const anchor = source.includes('/* STAGE14C_CASE_DETAIL_CLEANUP */')
    ? '/* STAGE14C_CASE_DETAIL_CLEANUP */'
    : '/* STAGE68P_CASE_HISTORY_PACKAGE_FINAL */';
  source = source.replace(anchor, '/* STAGE14D_REAL_CASE_HISTORY_REPAIR3 */\n' + anchor);
}

const historyType = [
  'type CaseHistoryItem = {',
  '  id: string;',
  "  kind: 'note' | 'task' | 'event' | 'payment' | 'status' | 'case';",
  '  title: string;',
  '  body: string;',
  '  occurredAt: string | null;',
  '};',
].join('\n');
source = insertAfterType(source, 'CaseActivity', historyType);

const helpers = [
  'function getCaseHistoryPayloadStage14D(activity: CaseActivity) {',
  "  return activity?.payload && typeof activity.payload === 'object' ? activity.payload : {};",
  '}',
  'function asCaseHistoryTextStage14D(value: unknown) {',
  "  return typeof value === 'string' ? value.trim() : '';",
  '}',
  'function isGenericCaseHistoryTextStage14D(value: string) {',
  "  const normalized = String(value || '').trim().toLowerCase();",
  "  const blocked = ['notatka', 'historia sprawy', 'dodano ruch w sprawie', 'dodano notatkę'];",
  "  const blockedOperational = 'zapis operacyjny ' + 'sprawy';",
  '  return !normalized || blocked.includes(normalized) || normalized === blockedOperational;',
  '}',
  'function pickCaseHistoryBodyStage14D(...values: unknown[]) {',
  '  for (const value of values) {',
  '    const text = asCaseHistoryTextStage14D(value);',
  '    if (text && !isGenericCaseHistoryTextStage14D(text)) return text;',
  '  }',
  "  return '';",
  '}',
  'function getCaseHistoryDateStage14D(...values: unknown[]) {',
  '  for (const value of values) {',
  '    if (!value) continue;',
  '    const date = toDate(value);',
  '    if (date) return date.toISOString();',
  '  }',
  '  return null;',
  '}',
  'function pushCaseHistoryItemStage14D(target: CaseHistoryItem[], item: CaseHistoryItem | null) {',
  '  if (!item) return;',
  '  if (!item.body || isGenericCaseHistoryTextStage14D(item.body)) return;',
  '  target.push(item);',
  '}',
  'function getCaseActivityHistoryItemStage14D(activity: CaseActivity): CaseHistoryItem | null {',
  '  const payload = getCaseHistoryPayloadStage14D(activity);',
  "  const eventType = String(activity.eventType || payload.eventType || payload.type || '').trim();",
  '  const lowerType = eventType.toLowerCase();',
  '  const body = pickCaseHistoryBodyStage14D(payload.note, payload.content, payload.body, payload.message, payload.description, payload.summary, payload.itemTitle, payload.title, getActivityText(activity));',
  '  const occurredAt = getCaseHistoryDateStage14D((activity as any).happenedAt, (activity as any).updatedAt, activity.createdAt, payload.happenedAt, payload.updatedAt, payload.createdAt);',
  '  const id = String(activity.id || eventType || occurredAt || Math.random());',
  "  if (lowerType.includes('status') || lowerType.includes('lifecycle')) {",
  '    const statusBody = pickCaseHistoryBodyStage14D(payload.statusLabel, payload.status, payload.nextStatus, payload.toStatus, body);',
  "    return statusBody ? { id: 'activity-' + id, kind: 'status', title: 'Zmiana statusu', body: statusBody, occurredAt } : null;",
  '  }',
  "  if (lowerType.includes('task')) {",
  "    const status = String(payload.status || '').toLowerCase();",
  "    const title = lowerType.includes('done') || lowerType.includes('completed') || status.includes('done') || status.includes('completed') ? 'Zadanie wykonane' : 'Zadanie';",
  "    return body ? { id: 'activity-' + id, kind: 'task', title, body, occurredAt } : null;",
  '  }',
  "  if (lowerType.includes('event') || lowerType.includes('meeting')) {",
  "    return body ? { id: 'activity-' + id, kind: 'event', title: 'Wydarzenie', body, occurredAt } : null;",
  '  }',
  "  if (lowerType.includes('payment') || lowerType.includes('billing')) {",
  "    return body ? { id: 'activity-' + id, kind: 'payment', title: 'Wpłata', body, occurredAt } : null;",
  '  }',
  "  if (lowerType.includes('note') || lowerType === 'operator_note') {",
  "    return body ? { id: 'activity-' + id, kind: 'note', title: 'Notatka', body, occurredAt } : null;",
  '  }',
  "  return body ? { id: 'activity-' + id, kind: 'case', title: 'Ruch w sprawie', body, occurredAt } : null;",
  '}',
  'function buildCaseHistoryItemsStage14D(input: {',
  '  activities?: CaseActivity[];',
  '  tasks?: TaskRecord[];',
  '  events?: EventRecord[];',
  '  payments?: CasePaymentRecord[];',
  '  caseItems?: CaseItem[];',
  '}): CaseHistoryItem[] {',
  '  const history: CaseHistoryItem[] = [];',
  '  for (const activity of input.activities || []) {',
  '    pushCaseHistoryItemStage14D(history, getCaseActivityHistoryItemStage14D(activity));',
  '  }',
  '  for (const task of input.tasks || []) {',
  "    const body = pickCaseHistoryBodyStage14D(task.title, 'Zadanie bez tytułu');",
  "    const status = String(task.status || '').toLowerCase();",
  "    const title = status === 'done' || status === 'completed' ? 'Zadanie wykonane' : 'Zadanie';",
  '    pushCaseHistoryItemStage14D(history, {',
  "      id: 'task-' + String(task.id || body),",
  "      kind: 'task',",
  '      title,',
  '      body,',
  '      occurredAt: getCaseHistoryDateStage14D((task as any).completedAt, (task as any).updatedAt, getTaskMainDate(task), task.reminderAt, task.scheduledAt, task.date),',
  '    });',
  '  }',
  '  for (const event of input.events || []) {',
  "    const body = pickCaseHistoryBodyStage14D(event.title, 'Wydarzenie bez tytułu');",
  '    pushCaseHistoryItemStage14D(history, {',
  "      id: 'event-' + String(event.id || body),",
  "      kind: 'event',",
  "      title: 'Wydarzenie',",
  '      body,',
  '      occurredAt: getCaseHistoryDateStage14D((event as any).updatedAt, getEventMainDate(event), event.startAt, event.reminderAt),',
  '    });',
  '  }',
  '  for (const payment of input.payments || []) {',
  "    const currency = typeof payment.currency === 'string' && payment.currency.trim() ? payment.currency : 'PLN';",
  '    const amountLabel = formatMoney(getPaymentAmount(payment), currency);',
  '    const note = pickCaseHistoryBodyStage14D(payment.note, billingStatusLabel(payment.status));',
  "    const body = note ? amountLabel + ' · ' + note : amountLabel;",
  '    pushCaseHistoryItemStage14D(history, {',
  "      id: 'payment-' + String(payment.id || payment.paidAt || payment.createdAt || body),",
  "      kind: 'payment',",
  "      title: 'Wpłata',",
  '      body,',
  '      occurredAt: getCaseHistoryDateStage14D(payment.paidAt, payment.createdAt, payment.dueAt),',
  '    });',
  '  }',
  '  for (const item of input.caseItems || []) {',
  '    const body = pickCaseHistoryBodyStage14D(item.title, item.description, item.fileName);',
  '    const status = getItemStatusLabel(item.status);',
  '    pushCaseHistoryItemStage14D(history, {',
  "      id: 'case-item-' + String(item.id || body),",
  "      kind: 'case',",
  "      title: status && status !== 'Brak' ? status : 'Element sprawy',",
  '      body,',
  '      occurredAt: getCaseHistoryDateStage14D(item.approvedAt, item.createdAt, item.dueDate),',
  '    });',
  '  }',
  '  return history.sort((left, right) => sortTime(right.occurredAt, 0) - sortTime(left.occurredAt, 0));',
  '}',
].join('\n');
source = insertBeforeFunction(source, 'sortCaseItems', helpers);

const activitiesVar = findStateVar(source, 'CaseActivity', 'activities');
const tasksVar = findStateVar(source, 'TaskRecord', 'tasks');
const eventsVar = findStateVar(source, 'EventRecord', 'events');
const paymentsVar = findStateVar(source, 'CasePaymentRecord', 'payments');
const caseItemsVar = findStateVar(source, 'CaseItem', source.includes('const [items') ? 'items' : 'caseItems');

const historySection = [
  '<section className="case-detail-section-card" data-case-history-list="true">',
  '  <div className="case-detail-section-head">',
  '    <div>',
  '      <h2>Historia sprawy</h2>',
  '      <p>Realne notatki, zadania, wydarzenia, wpłaty i zmiany zapisane przy tej sprawie.</p>',
  '    </div>',
  '  </div>',
  '  {(() => {',
  '    const caseHistoryItems = buildCaseHistoryItemsStage14D({',
  '      activities: ' + activitiesVar + ',',
  '      tasks: ' + tasksVar + ',',
  '      events: ' + eventsVar + ',',
  '      payments: ' + paymentsVar + ',',
  '      caseItems: ' + caseItemsVar + ',',
  '    });',
  '    return caseHistoryItems.length > 0 ? (',
  '      <div className="case-history-list">',
  '        {caseHistoryItems.slice(0, 10).map((item) => (',
  '          <article className="case-history-row" key={item.id}>',
  '            <span className="case-history-kind">{item.title}</span>',
  '            <p title={item.body}>{item.body}</p>',
  "            <time>{formatDate(item.occurredAt, 'Brak daty')}</time>",
  '          </article>',
  '        ))}',
  '      </div>',
  '    ) : (',
  '      <p className="case-detail-light-empty">Brak historii sprawy.</p>',
  '    );',
  '  })()}',
  '</section>',
].join('\n');

const replaceResult = replaceSectionByNeedles(source, [
  'Najważniejsze działania',
  'Najwazniejsze działania',
  'Najwazniejsze dzialania',
  'Zapis operacyjny',
  'data-case-history-list="true"',
  'caseHistoryItems.slice(0, 10)',
], historySection);
source = replaceResult.source;
if (!replaceResult.changed) {
  throw new Error('Nie znaleziono sekcji historii/Najważniejsze działania do podmiany.');
}
console.log('- replaced history section by needle: ' + replaceResult.needle);

css = removeCssStage14D(css);
const cssBlock = [
  '',
  '/* STAGE14D_REAL_CASE_HISTORY_REPAIR3 */',
  '.case-detail-vnext-page .case-history-list {',
  '  display: grid;',
  '  gap: 10px;',
  '}',
  '',
  '.case-detail-vnext-page .case-history-row {',
  '  min-width: 0;',
  '  display: grid;',
  '  grid-template-columns: 150px minmax(0, 1fr) auto;',
  '  gap: 12px;',
  '  align-items: center;',
  '  border: 1px solid #e4e7ec;',
  '  border-radius: 18px;',
  '  background: #fff;',
  '  padding: 12px 14px;',
  '}',
  '',
  '.case-detail-vnext-page .case-history-kind {',
  '  min-width: 0;',
  '  color: #111827;',
  '  font-size: 12px;',
  '  font-weight: 850;',
  '  overflow: hidden;',
  '  text-overflow: ellipsis;',
  '  white-space: nowrap;',
  '}',
  '',
  '.case-detail-vnext-page .case-history-row p {',
  '  min-width: 0;',
  '  margin: 0;',
  '  color: #475467;',
  '  font-size: 13px;',
  '  line-height: 1.35;',
  '  overflow: hidden;',
  '  text-overflow: ellipsis;',
  '  white-space: nowrap;',
  '}',
  '',
  '.case-detail-vnext-page .case-history-row time {',
  '  color: #667085;',
  '  font-size: 12px;',
  '  font-weight: 750;',
  '  white-space: nowrap;',
  '}',
  '',
  '@media (max-width: 720px) {',
  '  .case-detail-vnext-page .case-history-row {',
  '    grid-template-columns: 1fr;',
  '    align-items: start;',
  '  }',
  '}',
].join('\n');
css = css.replace(/\s*$/u, '') + cssBlock + '\n';

if (source === originalSource) throw new Error('Stage14D Repair3 nie zmienił CaseDetail.tsx.');
if (css === originalCss) throw new Error('Stage14D Repair3 nie zmienił CSS.');

write(casePath, source);
write(cssPath, css);
console.log('OK: Stage14D Repair3 real CaseDetail history patch applied.');
console.log('History data vars: ' + JSON.stringify({ activitiesVar, tasksVar, eventsVar, paymentsVar, caseItemsVar }));
