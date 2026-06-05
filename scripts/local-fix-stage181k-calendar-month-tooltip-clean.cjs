const fs = require('fs');

const file = 'src/pages/Calendar.tsx';
let src = fs.readFileSync(file, 'utf8');
const before = src;

// 1. Add cleaner used by month plain row normalizer.
if (!src.includes('CLOSEFLOW_STAGE181K_MONTH_TILE_TOOLTIP_CLEANER')) {
  const anchor = `    const stripLeadingType = (fullText: string, label: string) => {
      const lower = fullText.toLowerCase();
      const normalizedLabel = label.toLowerCase();
      if (lower.startsWith(normalizedLabel)) {
        return cleanText(fullText.slice(label.length));
      }
      return fullText;
    };
`;

  const replacement = `    const stripLeadingType = (fullText: string, label: string) => {
      const lower = fullText.toLowerCase();
      const normalizedLabel = label.toLowerCase();
      if (lower.startsWith(normalizedLabel)) {
        return cleanText(fullText.slice(label.length));
      }
      return fullText;
    };

    // CLOSEFLOW_STAGE181K_MONTH_TILE_TOOLTIP_CLEANER
    // Month/week small tiles should show only time + title on hover.
    // Relation details stay in the selected-day panel below.
    const cleanCompactTileTooltip = (value: string) => cleanText(value)
      .replace(/\\s*[·•-]\\s*(Sprawa|Lead|Klient)\\b.*$/i, '')
      .replace(/\\s+Sprawa:\\s*.*$/i, '')
      .replace(/\\s+Lead:\\s*.*$/i, '')
      .replace(/\\s+Klient:\\s*.*$/i, '')
      .trim();
`;

  if (!src.includes(anchor)) {
    throw new Error('Could not find stripLeadingType block.');
  }

  src = src.replace(anchor, replacement);
}

// 2. Use cleaner in DOM normalizer title/aria and displayed title text.
if (!src.includes('const compactTitleText = cleanCompactTileTooltip(titleText);')) {
  const oldBlock = `        const titleText = stripLeadingType(fullText, normalized.label);
        if (!titleText || titleText.length < 2) continue;
`;

  const newBlock = `        const titleText = stripLeadingType(fullText, normalized.label);
        const compactTitleText = cleanCompactTileTooltip(titleText);
        if (!compactTitleText || compactTitleText.length < 2) continue;
`;

  if (!src.includes(oldBlock)) {
    throw new Error('Could not find titleText block in month normalizer.');
  }

  src = src.replace(oldBlock, newBlock);
}

src = src.replace(
  `        row.setAttribute('title', fullText);
        row.setAttribute('aria-label', fullText);
`,
  `        row.setAttribute('title', compactTitleText);
        row.setAttribute('aria-label', compactTitleText);
`
);

src = src.replace(
  `        title.textContent = titleText;`,
  `        title.textContent = compactTitleText;`
);

// 3. Remove relation suffix from raw month pill visible text and title.
src = src.replace(
  `                            title={entry.title}`,
  `                            title={format(parseISO(entry.startsAt), 'HH:mm') + ' ' + entry.title}`
);

src = src.replace(
  `                              {format(parseISO(entry.startsAt), 'HH:mm')} {entry.title}
                              {entry.raw?.caseId ? ' · Sprawa' : entry.raw?.leadId ? ' · Lead' : ''}
`,
  `                              {format(parseISO(entry.startsAt), 'HH:mm')} {entry.title}
`
);

fs.writeFileSync(file, src, 'utf8');

const next = fs.readFileSync(file, 'utf8');
const failures = [];

for (const token of [
  'CLOSEFLOW_STAGE181K_MONTH_TILE_TOOLTIP_CLEANER',
  'cleanCompactTileTooltip',
  'const compactTitleText = cleanCompactTileTooltip(titleText);',
  "row.setAttribute('title', compactTitleText);",
  "row.setAttribute('aria-label', compactTitleText);",
  'title.textContent = compactTitleText;',
  "title={format(parseISO(entry.startsAt), 'HH:mm') + ' ' + entry.title}",
]) {
  if (!next.includes(token)) failures.push('Missing token: ' + token);
}

if (next.includes("{entry.raw?.caseId ? ' · Sprawa' : entry.raw?.leadId ? ' · Lead' : ''}")) {
  failures.push('Relation suffix still exists in month pill visible text.');
}

if (failures.length) {
  console.error('Stage181K local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

if (before === next) {
  console.log('No changes needed. Stage181K already present.');
} else {
  console.log('Patched Stage181K locally.');
}

console.log('OK Stage181K local: compact calendar tile tooltip contains only time + title, no relation.');
