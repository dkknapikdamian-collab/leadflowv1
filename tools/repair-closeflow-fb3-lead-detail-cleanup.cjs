const fs = require('fs');
const path = require('path');

const root = process.cwd();
const rel = 'src/pages/LeadDetail.tsx';
const file = path.join(root, rel);
let text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');

const marker = 'CLOSEFLOW_FB3_LEAD_DETAIL_CLEANUP_V1';
if (!text.includes(marker)) {
  text = text.replace(
    "const STAGE88_LEAD_DETAIL_ADMIN_FEEDBACK_HOTFIX = 'LeadDetail cleans noisy helper copy and protects right rail readability';",
    "const STAGE88_LEAD_DETAIL_ADMIN_FEEDBACK_HOTFIX = 'LeadDetail cleans noisy helper copy and protects right rail readability';\nconst CLOSEFLOW_FB3_LEAD_DETAIL_CLEANUP_V1 = 'Lead status visible in header, duplicated right-rail status card removed';"
  );
}

function findMatchingDiv(source, start) {
  const re = /<\/?div\b[^>]*>/gi;
  re.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = re.exec(source))) {
    const token = match[0];
    if (token.startsWith('</')) {
      depth -= 1;
      if (depth === 0) return re.lastIndex;
    } else if (!token.endsWith('/>')) {
      depth += 1;
    }
  }
  return -1;
}

function removeStatusCardOnce(source) {
  const needles = ['Status leada', 'Lead aktywny', 'Możesz prowadzić kontakt sprzedażowy', 'Mozesz prowadzic kontakt sprzedazowy'];
  let statusIdx = source.indexOf('Status leada');
  if (statusIdx < 0) {
    statusIdx = source.indexOf('Lead aktywny');
  }
  if (statusIdx < 0) return { source, removed: false };

  const openings = [];
  const openRe = /<div\b[^>]*>/gi;
  let m;
  while ((m = openRe.exec(source.slice(Math.max(0, statusIdx - 6000), statusIdx)))) {
    const absolute = Math.max(0, statusIdx - 6000) + m.index;
    const tag = m[0];
    if (/className=/.test(tag)) openings.push({ index: absolute, tag });
  }

  // Prefer a wrapper/card, not only the tiny text row.
  const ranked = openings.reverse().sort((a, b) => {
    const score = (item) => /card|panel|rail|aside|summary|surface|tile|box/i.test(item.tag) ? 0 : 1;
    const sa = score(a);
    const sb = score(b);
    if (sa !== sb) return sa - sb;
    return b.index - a.index;
  });

  for (const opening of ranked) {
    const end = findMatchingDiv(source, opening.index);
    if (end < 0) continue;
    const chunk = source.slice(opening.index, end);
    const hasStatusCopy = needles.some((needle) => chunk.includes(needle));
    if (!hasStatusCopy) continue;
    const lineStart = source.lastIndexOf('\n', opening.index) + 1;
    const lineEnd = source.indexOf('\n', end);
    const removeEnd = lineEnd >= 0 ? lineEnd + 1 : end;
    return {
      source: source.slice(0, lineStart) + source.slice(removeEnd),
      removed: true
    };
  }

  // Last-resort: remove the closest paragraph/text wrapper, still safer than keeping duplicate copy.
  const smallStart = source.lastIndexOf('<div', statusIdx);
  if (smallStart >= 0) {
    const end = findMatchingDiv(source, smallStart);
    if (end > smallStart) {
      const chunk = source.slice(smallStart, end);
      if (needles.some((needle) => chunk.includes(needle))) {
        const lineStart = source.lastIndexOf('\n', smallStart) + 1;
        const lineEnd = source.indexOf('\n', end);
        return {
          source: source.slice(0, lineStart) + source.slice(lineEnd >= 0 ? lineEnd + 1 : end),
          removed: true
        };
      }
    }
  }

  return { source, removed: false };
}

let removalCount = 0;
for (let i = 0; i < 4; i += 1) {
  const result = removeStatusCardOnce(text);
  text = result.source;
  if (!result.removed) break;
  removalCount += 1;
}

const statusPill = [
  '              <span',
  '                className={`lead-detail-pill ${statusClass(lead?.status)}`}',
  '                data-fb3-lead-status-header-pill="true"',
  '              >',
  '                {statusLabel(lead?.status)}',
  '              </span>'
].join('\n');

if (!text.includes('data-fb3-lead-status-header-pill="true"')) {
  const exactH1 = /(<h1[^>]*>\s*\{getLeadName\(lead\)\}\s*<\/h1>)/;
  if (exactH1.test(text)) {
    text = text.replace(exactH1, `$1\n${statusPill}`);
  } else {
    const nearName = text.indexOf('getLeadName(lead)');
    if (nearName >= 0) {
      const closeH1 = text.indexOf('</h1>', nearName);
      if (closeH1 >= 0) {
        const insertAt = closeH1 + '</h1>'.length;
        text = text.slice(0, insertAt) + '\n' + statusPill + text.slice(insertAt);
      }
    }
  }
}

if (!text.includes('data-fb3-lead-status-header-pill="true"')) {
  throw new Error(`${rel}: could not place header status pill near lead title`);
}

const forbidden = [
  'Status leada',
  'Lead aktywny. Możesz prowadzić kontakt sprzedażowy.',
  'Lead aktywny. Mozesz prowadzic kontakt sprzedazowy.'
];

for (const needle of forbidden) {
  if (text.includes(needle)) {
    throw new Error(`${rel}: duplicated right rail status card copy still present: ${needle}`);
  }
}

if (!text.includes('statusLabel(lead?.status)')) {
  throw new Error(`${rel}: statusLabel(lead?.status) missing after cleanup`);
}

if (!text.includes('statusClass(lead?.status)')) {
  throw new Error(`${rel}: statusClass(lead?.status) missing after cleanup`);
}

fs.writeFileSync(file, text, 'utf8');
console.log(`CLOSEFLOW_FB3_LEAD_DETAIL_CLEANUP_PATCH_OK removed_status_cards=${removalCount}`);
