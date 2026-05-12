const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const casePath = path.join(repo, 'src/pages/CaseDetail.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage13-case-detail-vnext.css');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Brak pliku: ${path.relative(repo, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}
function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}
function normalizeEol(value) {
  return String(value || '').replace(/\r\n/g, '\n');
}
function indexOfAny(source, needles) {
  for (const needle of needles) {
    const index = source.indexOf(needle);
    if (index >= 0) return { index, needle };
  }
  return { index: -1, needle: '' };
}
function findEnclosingOpeningTag(source, needleIndex, tags) {
  let best = null;
  for (const tag of tags) {
    const idx = source.lastIndexOf(`<${tag}`, needleIndex);
    if (idx >= 0 && (!best || idx > best.index)) best = { tag, index: idx };
  }
  return best;
}
function findMatchingTagEnd(source, tag, start) {
  const tagRegex = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g');
  tagRegex.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tagRegex.exec(source))) {
    const text = match[0];
    const isClosing = text.startsWith(`</${tag}`);
    const isSelfClosing = /\/>\s*$/.test(text);
    if (isClosing) depth -= 1;
    else if (!isSelfClosing) depth += 1;
    if (depth === 0) {
      let end = tagRegex.lastIndex;
      while (source[end] === '\n') end += 1;
      return end;
    }
  }
  return -1;
}
function findStatementEnd(source, start) {
  let quote = null;
  let escaped = false;
  let paren = 0;
  let brace = 0;
  let bracket = 0;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (quote === '`' && ch === '$' && source[i + 1] === '{' && !escaped) {
        brace += 1;
        i += 1;
        continue;
      }
      if (ch === quote && !escaped) quote = null;
      escaped = ch === '\\' && !escaped;
      if (ch !== '\\') escaped = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      escaped = false;
      continue;
    }
    if (ch === '(') paren += 1;
    if (ch === ')') paren = Math.max(0, paren - 1);
    if (ch === '{') brace += 1;
    if (ch === '}') brace = Math.max(0, brace - 1);
    if (ch === '[') bracket += 1;
    if (ch === ']') bracket = Math.max(0, bracket - 1);
    if (ch === ';' && paren === 0 && brace === 0 && bracket === 0) {
      let end = i + 1;
      while (source[end] === '\n') end += 1;
      return end;
    }
  }
  return -1;
}
function insertBeforeNeedle(source, needle, block, label) {
  if (source.includes(block.trim().split('\n')[0].trim())) return source;
  const index = source.indexOf(needle);
  if (index < 0) throw new Error(`Nie znaleziono miejsca wstawienia: ${label} (${needle})`);
  console.log(`- inserted: ${label}`);
  return source.slice(0, index) + block + '\n' + source.slice(index);
}
function removeFailedStage14DBlocks(source) {
  const markers = [
    'type CaseHistoryItem = {',
    'function getCaseHistoryPayloadStage14D',
    'function getCaseHistoryTextStage14D',
    'function buildCaseHistoryItemsStage14D',
  ];
  for (const marker of markers) {
    let index = source.indexOf(marker);
    while (index >= 0) {
      const start = marker.startsWith('type ') ? source.lastIndexOf('\ntype ', index) + 1 : source.lastIndexOf('\nfunction ', index) + 1;
      if (start <= 0) break;
      const nextAnchors = [
        source.indexOf('\nfunction ', start + 1),
        source.indexOf('\ntype ', start + 1),
        source.indexOf('\nconst ', start + 1),
      ].filter((item) => item > start);
      const end = marker.startsWith('type ') ? findStatementEnd(source, start) : Math.min(...nextAnchors, source.length);
      if (!Number.isFinite(end) || end <= start) break;
      source = source.slice(0, start) + source.slice(end);
      index = source.indexOf(marker);
    }
  }
  return source;
}

const historyTypeBlock = [
  'type CaseHistoryItem = {',
  '  id: string;',
  "  kind: 'note' | 'task' | 'event' | 'payment' | 'status' | 'case';",
  '  title: string;',
  '  body: string;',
  '  occurredAt: string | null;',
  '};',
  '',
].join('\n');

const helperBlock = [
  'function getCaseHistoryPayloadStage14D(activity: CaseActivity) {',
  "  return activity?.payload && typeof activity.payload === 'object' ? activity.payload : {};",
  '}',
  'function asCaseHistoryTextStage14D(value: unknown) {',
  "  return typeof value === 'string' ? value.trim() : '';",
  '}',
  'function isGenericCaseHistoryTextStage14D(value: string) {',
  "  const normalized = String(value || '').trim().toLowerCase();",
  "  return !normalized || normalized === 'notatka' || normalized === 'historia sprawy' || normalized === 'zapis operacyjny sprawy' || normalized === 'dodano ruch w sprawie' || normalized === 'dodano notatkę';",
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
  'function getCaseActivityHistoryItemStage14D(activity: CaseActivity): CaseHistoryItem | null {',
  '  const payload = getCaseHistoryPayloadStage14D(activity);',
  "  const eventType = String(activity.eventType || payload.eventType || payload.type || '').trim();",
  "  const lowerType = eventType.toLowerCase();",
  '  const body = pickCaseHistoryBodyStage14D(payload.note, payload.content, payload.body, payload.message, payload.description, payload.summary, payload.itemTitle, payload.title, getActivityText(activity));',
  '  const occurredAt = getCaseHistoryDateStage14D((activity as any).happenedAt, (activity as any).updatedAt, activity.createdAt, payload.happenedAt, payload.updatedAt, payload.createdAt);',
  "  if (lowerType.includes('status') || lowerType.includes('lifecycle')) {",
  "    const statusBody = pickCaseHistoryBodyStage14D(payload.statusLabel, payload.status, payload.nextStatus, payload.toStatus, body);",
  "    return statusBody ? { id: `activity-${activity.id || eventType || occurredAt}`, kind: 'status', title: 'Zmiana statusu', body: statusBody, occurredAt } : null;",
  '  }',
  "  if (lowerType.includes('task')) {",
  "    const title = lowerType.includes('done') || lowerType.includes('completed') || String(payload.status || '').toLowerCase().includes('done') ? 'Zadanie wykonane' : 'Zadanie';",
  "    return body ? { id: `activity-${activity.id || eventType || occurredAt}`, kind: 'task', title, body, occurredAt } : null;",
  '  }',
  "  if (lowerType.includes('event') || lowerType.includes('meeting')) {",
  "    return body ? { id: `activity-${activity.id || eventType || occurredAt}`, kind: 'event', title: 'Wydarzenie', body, occurredAt } : null;",
  '  }',
  "  if (lowerType.includes('payment') || lowerType.includes('billing')) {",
  "    return body ? { id: `activity-${activity.id || eventType || occurredAt}`, kind: 'payment', title: 'Wpłata', body, occurredAt } : null;",
  '  }',
  "  if (lowerType.includes('note') || lowerType === 'operator_note') {",
  "    return body ? { id: `activity-${activity.id || eventType || occurredAt}`, kind: 'note', title: 'Notatka', body, occurredAt } : null;",
  '  }',
  "  return body ? { id: `activity-${activity.id || eventType || occurredAt}`, kind: 'case', title: 'Ruch w sprawie', body, occurredAt } : null;",
  '}',
  'function sortCaseHistoryItemsStage14D(items: CaseHistoryItem[]) {',
  '  return [...items].sort((left, right) => sortTime(right.occurredAt, 0) - sortTime(left.occurredAt, 0));',
  '}',
  '',
].join('\n');

const caseHistoryMemoBlock = [
  '  const caseHistoryItems = useMemo<CaseHistoryItem[]>(() => {',
  '    const history: CaseHistoryItem[] = [];',
  '',
  '    for (const activity of activities) {',
  '      const item = getCaseActivityHistoryItemStage14D(activity);',
  '      if (item) history.push(item);',
  '    }',
  '',
  '    for (const task of tasks) {',
  '      const normalizedStatus = String(task.status || \'\').toLowerCase();',
  "      const title = ['done', 'completed'].includes(normalizedStatus) ? 'Zadanie wykonane' : 'Zadanie';",
  "      const body = pickCaseHistoryBodyStage14D(task.title, 'Zadanie bez tytułu');",
  '      if (body) {',
  '        history.push({',
  '          id: `task-${task.id || body}`,',
  "          kind: 'task',",
  '          title,',
  '          body,',
  '          occurredAt: getCaseHistoryDateStage14D((task as any).completedAt, (task as any).doneAt, (task as any).updatedAt, getTaskMainDate(task), task.reminderAt, task.date),',
  '        });',
  '      }',
  '    }',
  '',
  '    for (const event of events) {',
  "      const body = pickCaseHistoryBodyStage14D(event.title, 'Wydarzenie bez tytułu');",
  '      if (body) {',
  "        history.push({ id: `event-${event.id || body}`, kind: 'event', title: 'Wydarzenie', body, occurredAt: getCaseHistoryDateStage14D((event as any).updatedAt, getEventMainDate(event), event.reminderAt, event.startAt, event.endAt) });",
  '      }',
  '    }',
  '',
  '    for (const payment of visibleCasePayments) {',
  '      const amountLabel = formatMoney(getPaymentAmount(payment), payment.currency || caseFinanceSummary.currency);',
  '      const note = pickCaseHistoryBodyStage14D(payment.note);',
  "      const body = note ? `${amountLabel} · ${note}` : amountLabel;",
  "      history.push({ id: `payment-${payment.id || body}`, kind: 'payment', title: 'Wpłata', body, occurredAt: getCaseHistoryDateStage14D(payment.paidAt, payment.createdAt, payment.dueAt) });",
  '    }',
  '',
  '    for (const item of items) {',
  '      const body = pickCaseHistoryBodyStage14D(item.title, item.description);',
  '      if (body) {',
  "        const title = item.status === 'accepted' ? 'Element zaakceptowany' : item.status === 'uploaded' ? 'Element przesłany' : 'Element sprawy';",
  "        history.push({ id: `item-${item.id || body}`, kind: 'case', title, body, occurredAt: getCaseHistoryDateStage14D(item.approvedAt, item.createdAt, item.dueDate) });",
  '      }',
  '    }',
  '',
  '    const unique = new Map<string, CaseHistoryItem>();',
  '    for (const item of history) {',
  "      const key = `${item.kind}|${item.title}|${item.body}|${item.occurredAt || ''}`;",
  '      if (!unique.has(key)) unique.set(key, item);',
  '    }',
  '    return sortCaseHistoryItemsStage14D(Array.from(unique.values())).slice(0, 25);',
  '  }, [activities, tasks, events, visibleCasePayments, items, caseFinanceSummary.currency]);',
  '',
].join('\n');

const historySectionBlock = [
  '                <section className="case-detail-section-card" data-case-history-list="true">',
  '                  <div className="case-detail-section-head">',
  '                    <div>',
  '                      <h2>Historia sprawy</h2>',
  '                      <p>Realne notatki, zadania, wydarzenia, wpłaty i zmiany statusu tej sprawy.</p>',
  '                    </div>',
  '                  </div>',
  '',
  '                  {caseHistoryItems.length > 0 ? (',
  '                    <div className="case-history-list">',
  '                      {caseHistoryItems.slice(0, 10).map((item) => (',
  '                        <article className="case-history-row" key={item.id}>',
  '                          <span className="case-history-kind">{item.title}</span>',
  '                          <p title={item.body}>{item.body}</p>',
  "                          <time>{formatDate(item.occurredAt, 'Brak daty')}</time>",
  '                        </article>',
  '                      ))}',
  '                    </div>',
  '                  ) : (',
  '                    <p className="case-detail-light-empty">Brak historii sprawy.</p>',
  '                  )}',
  '                </section>',
].join('\n');

let source = normalizeEol(read(casePath));
let css = normalizeEol(read(cssPath));
const originalSource = source;
const originalCss = css;

source = removeFailedStage14DBlocks(source);

if (!source.includes('STAGE14D_REAL_CASE_HISTORY_REPAIR1')) {
  const guardAnchor = source.includes('/* STAGE14C_CASE_DETAIL_CLEANUP_REPAIR1 */')
    ? '/* STAGE14C_CASE_DETAIL_CLEANUP_REPAIR1 */'
    : '/* STAGE68P_CASE_HISTORY_PACKAGE_FINAL */';
  source = source.replace(guardAnchor, '/* STAGE14D_REAL_CASE_HISTORY_REPAIR1 */\n' + guardAnchor);
}

if (!source.includes('type CaseHistoryItem = {')) {
  source = insertBeforeNeedle(source, 'type WorkItem = {', historyTypeBlock, 'CaseHistoryItem type');
}
if (!source.includes('getCaseActivityHistoryItemStage14D')) {
  source = insertBeforeNeedle(source, 'function sortCaseItems', helperBlock, 'Stage14D history helpers');
}

if (!source.includes('const caseHistoryItems = useMemo<CaseHistoryItem[]>')) {
  const anchors = [
    '\n  if (isLoading) {',
    '\n  if (loading) {',
    '\n  if (loadError || !caseData)',
  ];
  const match = indexOfAny(source, anchors);
  if (match.index < 0) throw new Error('Nie znaleziono miejsca na useMemo caseHistoryItems przed renderem.');
  source = source.slice(0, match.index + 1) + caseHistoryMemoBlock + source.slice(match.index + 1);
  console.log('- inserted: caseHistoryItems useMemo');
}

let replacedHistory = false;
const serviceNeedle = source.indexOf('Najważniejsze działania');
if (serviceNeedle >= 0) {
  const opening = findEnclosingOpeningTag(source, serviceNeedle, ['section', 'div']);
  if (!opening) throw new Error('Nie znaleziono otwierającego bloku dla Najważniejsze działania.');
  const end = findMatchingTagEnd(source, opening.tag, opening.index);
  if (end < 0) throw new Error('Nie znaleziono końca bloku Najważniejsze działania.');
  source = source.slice(0, opening.index) + historySectionBlock + source.slice(end);
  replacedHistory = true;
  console.log('- replaced section: Najważniejsze działania -> Historia sprawy');
}
if (!replacedHistory && !source.includes('data-case-history-list="true"')) {
  throw new Error('Nie znaleziono sekcji Najważniejsze działania i nie ma jeszcze data-case-history-list.');
}

const cssBlock = [
  '',
  '/* STAGE14D_REAL_CASE_HISTORY_REPAIR1 */',
  '.case-detail-vnext-page .case-history-list {',
  '  display: grid;',
  '  gap: 10px;',
  '}',
  '',
  '.case-detail-vnext-page .case-history-row {',
  '  min-width: 0;',
  '  display: grid;',
  '  grid-template-columns: minmax(120px, 0.42fr) minmax(0, 1fr) auto;',
  '  align-items: center;',
  '  gap: 12px;',
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
  '  font-weight: 900;',
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
  '  font-weight: 800;',
  '  white-space: nowrap;',
  '}',
  '',
  '@media (max-width: 720px) {',
  '  .case-detail-vnext-page .case-history-row {',
  '    grid-template-columns: 1fr;',
  '    align-items: start;',
  '  }',
  '}',
  '',
].join('\n');

if (!css.includes('STAGE14D_REAL_CASE_HISTORY_REPAIR1')) {
  css = css.replace(/\s*$/u, '') + cssBlock;
  console.log('- appended CSS: Stage14D real history rows');
}

if (source === originalSource) throw new Error('Stage14D Repair1 nie zmienił CaseDetail.tsx. Przerywam.');
if (css === originalCss) throw new Error('Stage14D Repair1 nie zmienił CSS. Przerywam.');

write(casePath, source);
write(cssPath, css);
console.log('OK: Stage14D Repair1 real CaseDetail history patch applied.');
