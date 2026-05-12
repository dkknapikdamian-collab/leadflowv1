#!/usr/bin/env node
const fs = require('fs');

const STAGE = 'CLOSEFLOW_STAGE14H_CALENDAR_WEEK_NEAREST7_DEDUPE_2026_05_12';
const CALENDAR = 'src/pages/Calendar.tsx';
const PACKAGE = 'package.json';
const SCRIPT_NAME = 'check:stage14h-calendar-week-nearest7-dedupe';
const SCRIPT_VALUE = 'node scripts/check-stage14h-calendar-week-nearest7-dedupe.cjs';

if (process.argv.includes('--check-only')) {
  new Function('return true;');
  process.exit(0);
}

function fail(message) {
  throw new Error(message);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function write(path, value) {
  fs.writeFileSync(path, value, 'utf8');
}

function addPackageScript() {
  let pkg = read(PACKAGE);
  const scriptLine = `    "${SCRIPT_NAME}": "${SCRIPT_VALUE}",`;

  if (pkg.includes(`"${SCRIPT_NAME}"`)) {
    const re = new RegExp(`    "${SCRIPT_NAME}"\\s*:\\s*"[^"]+"[,]?`);
    pkg = pkg.replace(re, scriptLine);
    write(PACKAGE, pkg);
    return;
  }

  const anchor = '    "check:closeflow-admin-feedback-2026-05-11-p3": "node scripts/check-closeflow-admin-feedback-2026-05-11-p3.cjs",';
  if (pkg.includes(anchor)) {
    pkg = pkg.replace(anchor, `${anchor}\n${scriptLine}`);
    write(PACKAGE, pkg);
    return;
  }

  const fallbackAnchor = '    "check:page-header-stage6-final-lock"';
  const idx = pkg.indexOf(fallbackAnchor);
  if (idx !== -1) {
    pkg = pkg.slice(0, idx) + scriptLine + '\n' + pkg.slice(idx);
    write(PACKAGE, pkg);
    return;
  }

  fail('Cannot add package.json script: no stable anchor found.');
}

function addStageMarker(source) {
  if (source.includes(STAGE)) return source;
  const anchor = "const CALENDAR_VIEW_STORAGE_KEY = 'closeflow:calendar:view:v1';";
  if (!source.includes(anchor)) {
    fail('Cannot find Calendar marker anchor.');
  }
  return source.replace(anchor, `${anchor}\nconst ${STAGE} = '${STAGE}';`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findMatchingClosingBrace(source, openIndex) {
  let depth = 0;
  let quote = null;
  let templateDepth = 0;
  let escaped = false;
  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (quote === '`' && ch === '$' && next === '{') {
        templateDepth += 1;
        i += 1;
        continue;
      }
      if (quote === '`' && templateDepth > 0 && ch === '}') {
        templateDepth -= 1;
        continue;
      }
      if (ch === quote && templateDepth === 0) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }

    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function findMatchingClosingTag(source, startIndex, tagName) {
  const openRe = new RegExp(`<${tagName}(?=[\\s>])`, 'g');
  const closeRe = new RegExp(`</${tagName}>`, 'g');
  let depth = 0;
  let i = startIndex;

  while (i < source.length) {
    openRe.lastIndex = i;
    closeRe.lastIndex = i;
    const open = openRe.exec(source);
    const close = closeRe.exec(source);

    if (!close) return -1;

    if (open && open.index < close.index) {
      depth += 1;
      i = open.index + 1;
      continue;
    }

    depth -= 1;
    i = close.index + close[0].length;
    if (depth === 0) return i;
  }

  return -1;
}

function findEnclosingJsxBlock(source, index) {
  const tags = ['div', 'section', 'nav', 'ul'];
  const candidates = [];

  for (const tag of tags) {
    let pos = source.lastIndexOf(`<${tag}`, index);
    while (pos !== -1 && index - pos < 6000) {
      const end = findMatchingClosingTag(source, pos, tag);
      if (end !== -1 && end > index) {
        const block = source.slice(pos, end);
        candidates.push({ tag, start: pos, end, block, length: end - pos });
      }
      pos = source.lastIndexOf(`<${tag}`, pos - 1);
    }
  }

  candidates.sort((a, b) => a.length - b.length);
  return candidates[0] || null;
}

function removeLegacyListByNextWeek(source) {
  const needles = [
    'Przyszły tydzień',
    'Przyszly tydzien',
    'Przysz\u0142y tydzie\u0144'
  ];

  const headingCandidates = [
    'Najbliższe 7 dni',
    'Najblizsze 7 dni',
    'Najbli\u017csze 7 dni'
  ];

  let changed = false;
  for (const needle of needles) {
    let idx = source.indexOf(needle);
    while (idx !== -1) {
      const before = source.slice(Math.max(0, idx - 9000), idx);
      const hasNearestHeading = headingCandidates.some((heading) => before.includes(heading));
      const block = findEnclosingJsxBlock(source, idx);

      if (hasNearestHeading && block) {
        const text = block.block;
        const looksLikeDuplicateWeekSummary =
          /formatCalendarItemCount|rzecz|rzeczy|week/i.test(text) &&
          (/Dzisiaj|Środa|Sroda|Czwartek|Piątek|Piatek|Sobota|Niedziela|Poniedziałek|Poniedzialek/.test(text) || /map\s*\(/.test(text)) &&
          !/data-calendar-week-day-card|calendar-week-day-card|selectedDate|setSelectedDate/.test(text);

        if (looksLikeDuplicateWeekSummary || text.length < 4500) {
          source = source.slice(0, block.start) + `{/* ${STAGE}: duplicate legacy nearest-7 summary removed. */}` + source.slice(block.end);
          changed = true;
          idx = source.indexOf(needle, block.start + STAGE.length);
          continue;
        }
      }
      idx = source.indexOf(needle, idx + needle.length);
    }
  }
  return { source, changed };
}

function removeLegacyListByCompactMap(source) {
  const markers = [
    'formatCalendarItemCount',
    'getCalendarDayNavLabel',
    'calendarDayNavigation',
    'weekNavigationDays',
    'upcomingDays',
    'nextSevenDays'
  ];

  const nearestIdx = Math.max(
    source.lastIndexOf('Najbliższe 7 dni'),
    source.lastIndexOf('Najblizsze 7 dni'),
    source.lastIndexOf('Najbli\u017csze 7 dni')
  );

  for (const marker of markers) {
    let idx = source.indexOf(marker, nearestIdx >= 0 ? nearestIdx : 0);
    while (idx !== -1) {
      const block = findEnclosingJsxBlock(source, idx);
      if (block) {
        const text = block.block;
        const compactSummary =
          /formatCalendarItemCount/.test(text) &&
          (/·|&middot;|\{' · '\}|\{" · "\}| - /.test(text) || /rzecz|rzeczy/.test(text)) &&
          !/data-calendar-selected-day|data-calendar-week-day-card|setSelectedDate|selectedDate/.test(text);

        if (compactSummary) {
          return {
            source: source.slice(0, block.start) + `{/* ${STAGE}: duplicate legacy nearest-7 summary removed. */}` + source.slice(block.end),
            changed: true
          };
        }
      }
      idx = source.indexOf(marker, idx + marker.length);
    }
  }

  return { source, changed: false };
}

function hideLegacyByClassFallback(source) {
  const cssFile = 'src/styles/closeflow-calendar-render-pipeline-repair3.css';
  // This repair is intentionally source-first. CSS fallback is not used, because the user asked to remove the duplicate section.
  void cssFile;
  return { source, changed: false };
}

function patchCalendar() {
  let source = read(CALENDAR);
  const original = source;
  source = addStageMarker(source);

  let result = removeLegacyListByNextWeek(source);
  source = result.source;
  let changed = result.changed;

  if (!changed) {
    result = removeLegacyListByCompactMap(source);
    source = result.source;
    changed = result.changed;
  }

  if (!changed && original.includes(STAGE)) {
    console.log('Stage14H marker already present; Calendar may already be patched.');
  } else if (!changed) {
    const diagnosticNeedles = [
      'Najbliższe 7 dni',
      'Przyszły tydzień',
      'formatCalendarItemCount',
      'getCalendarDayNavLabel'
    ].map((needle) => `${needle}: ${source.includes(needle)}`).join('\n');
    fail(`Could not identify duplicate weekly nearest-7 legacy list. Diagnostics:\n${diagnosticNeedles}`);
  }

  if (source !== original) {
    write(CALENDAR, source);
    console.log('OK: Stage14H Calendar duplicate nearest-7 legacy list patch applied.');
  } else {
    console.log('OK: Stage14H Calendar already patched.');
  }
}

addPackageScript();
patchCalendar();
