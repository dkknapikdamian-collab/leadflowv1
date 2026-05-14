const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'src', 'pages', 'LeadDetail.tsx');

function fail(message) {
  console.error('STAGE77_LEAD_DETAIL_SINGLE_STATUS_PILL_FAIL:', message);
  process.exit(1);
}

function findLeadTitleRowBlock(text) {
  const markerIndex = text.indexOf('lead-detail-title-row');
  if (markerIndex < 0) fail('missing lead-detail-title-row');
  const start = text.lastIndexOf('<div', markerIndex);
  if (start < 0) fail('cannot find opening div for title row');
  const tagPattern = /<\/?div\b[^>]*>/g;
  tagPattern.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tagPattern.exec(text))) {
    const tag = match[0];
    if (tag.startsWith('</')) depth -= 1;
    else if (!tag.endsWith('/>')) depth += 1;
    if (depth === 0) return text.slice(start, tagPattern.lastIndex);
  }
  fail('cannot find closing div for title row');
}

const text = fs.readFileSync(file, 'utf8');
if (!text.includes('STAGE77_LEAD_DETAIL_SINGLE_STATUS_PILL')) fail('missing Stage77 marker');
if (!text.includes('function statusLabel(status?: string)')) fail('missing one status label mapping function');
if (!text.includes('function statusClass(status?: string)')) fail('missing one status class mapping function');

const titleRow = findLeadTitleRowBlock(text);
const statusLabelCalls = (titleRow.match(/statusLabel\s*\(/g) || []).length + (titleRow.match(/leadStatusLabel/g) || []).length;
const statusClassCalls = (titleRow.match(/statusClass\s*\(/g) || []).length;
const pillMentions = (titleRow.match(/lead-detail-pill/g) || []).length;

if (statusLabelCalls !== 1) fail('lead-detail-title-row must render exactly one status label, found: ' + statusLabelCalls);
if (statusClassCalls > 1) fail('lead-detail-title-row has duplicated status class mapping, found: ' + statusClassCalls);
if (pillMentions > 2) fail('lead-detail-title-row has too many lead-detail-pill mentions, found: ' + pillMentions);

const requiredStatuses = ['proposal_sent', 'new', 'waiting_response', 'qualification', 'lost'];
for (const status of requiredStatuses) {
  if (!text.includes("value: '" + status + "'")) fail('missing lead status option: ' + status);
}

const requiredLabels = ['Oferta wysłana', 'Nowy', 'Czeka na odpowiedź', 'Przegrany'];
for (const label of requiredLabels) {
  if (!text.includes(label)) fail('missing lead status label: ' + label);
}

const duplicatedLiteralStatus = /\{statusLabel\([^)]*lead[^)]*status[^)]*\)\}[\s\S]{0,260}\{statusLabel\([^)]*lead[^)]*status[^)]*\)\}/;
if (duplicatedLiteralStatus.test(titleRow)) fail('duplicate statusLabel renderers are still adjacent in title row');

console.log('OK stage77 lead detail single status pill');

