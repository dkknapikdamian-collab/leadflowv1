const fs = require('fs');
const path = require('path');

const root = process.cwd();
const leadDetailPath = path.join(root, 'src/pages/LeadDetail.tsx');
const helperPath = path.join(root, 'src/lib/activity-timeline.ts');

function fail(message) {
  console.error('FAIL check:lead-detail-feedback-p1:', message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail('Brak pliku: ' + path.relative(root, file));
  return fs.readFileSync(file, 'utf8');
}

function matchingSectionEnd(source, sectionStart) {
  let depth = 0;
  const re = /<section\b|<\/section>/g;
  re.lastIndex = sectionStart;
  let match;
  while ((match = re.exec(source))) {
    if (match[0].startsWith('<section')) depth += 1;
    else depth -= 1;
    if (depth === 0) return re.lastIndex;
  }
  return -1;
}

function sections(source) {
  const out = [];
  const re = /<section\b/g;
  let match;
  while ((match = re.exec(source))) {
    const end = matchingSectionEnd(source, match.index);
    if (end > match.index) {
      out.push(source.slice(match.index, end));
      re.lastIndex = end;
    }
  }
  return out;
}

const leadDetail = read(leadDetailPath);
const helper = read(helperPath);

if (!leadDetail.includes("../lib/activity-timeline")) fail('LeadDetail nie importuje wspólnego formattera activity-timeline.');
if (!leadDetail.includes('getActivityTimelineTitle') || !leadDetail.includes('getActivityTimelineDescription')) fail('LeadDetail nie używa wspólnego formattera historii.');
if (leadDetail.includes('<LeadAiNextAction') || leadDetail.includes('<LeadAiFollowupDraft')) fail('LeadDetail nadal renderuje kafelek AI wsparcia w JSX.');
if (leadDetail.includes('Centrum pracy leada')) fail('LeadDetail nadal zawiera tekst Centrum pracy leada.');

const badRightCards = sections(leadDetail)
  .filter((section) => section.includes('right-card') || section.includes('lead-detail-right-card'))
  .filter((section) => section.includes('AI wsparcie') || section.includes('Lead aktywny'));
if (badRightCards.length) fail('Nadal istnieje noisy right-card AI/status: ' + badRightCards.length);

for (const required of [
  'getActivityTimelineTitle',
  'getActivityTimelineDescription',
  'normalizeActivityTimelineItem',
  'Zmieniono status',
  'Dodano notatkę',
  'Wpłata',
  'Zadanie',
  'Wydarzenie',
]) {
  if (!helper.includes(required)) fail('activity-timeline.ts nie zawiera wymaganego fragmentu: ' + required);
}

console.log('OK check:lead-detail-feedback-p1');
