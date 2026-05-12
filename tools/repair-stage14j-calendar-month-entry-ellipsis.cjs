const fs = require('fs');
const path = require('path');

const STAGE = 'STAGE14J_CALENDAR_MONTH_ENTRY_ELLIPSIS';
const repo = process.cwd();

function fail(message) {
  throw new Error(message);
}

function filePath(file) {
  return path.join(repo, file);
}

function read(file) {
  const full = filePath(file);
  if (!fs.existsSync(full)) fail(`Missing file: ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function write(file, content) {
  fs.writeFileSync(filePath(file), content, 'utf8');
}

function hasScript(pkgText, scriptName) {
  return pkgText.includes(`"${scriptName}"`);
}

function addPackageScript() {
  const scriptName = 'check:stage14j-calendar-month-entry-ellipsis';
  const scriptCommand = 'node scripts/check-stage14j-calendar-month-entry-ellipsis.cjs';
  const file = 'package.json';
  let pkg = read(file);

  if (hasScript(pkg, scriptName)) {
    try { JSON.parse(pkg); } catch (error) { fail(`package.json invalid before patch: ${error.message}`); }
    return false;
  }

  const lines = pkg.split(/\r?\n/);
  const anchors = [
    'check:stage14i-calendar-snake-case-task-dates',
    'check:stage14h-calendar-week-nearest7-dedupe',
    'check:closeflow-admin-feedback-2026-05-11-p3',
    'check:closeflow-admin-feedback-2026-05-11-p2'
  ];

  let insertAt = -1;
  for (const anchor of anchors) {
    const index = lines.findIndex((line) => line.includes(`"${anchor}"`));
    if (index >= 0) {
      insertAt = index + 1;
      break;
    }
  }

  if (insertAt < 0) {
    const scriptsIndex = lines.findIndex((line) => /"scripts"\s*:\s*\{/.test(line));
    if (scriptsIndex < 0) fail('Could not find scripts object in package.json');
    insertAt = scriptsIndex + 1;
  }

  const previousLine = lines[insertAt - 1] || '';
  if (previousLine.trim() && !previousLine.trim().endsWith('{') && !previousLine.trim().endsWith(',')) {
    lines[insertAt - 1] = previousLine + ',';
  }

  const indentMatch = previousLine.match(/^(\s*)/);
  const indent = previousLine.trim().startsWith('"') ? (indentMatch ? indentMatch[1] : '    ') : '    ';
  lines.splice(insertAt, 0, `${indent}"${scriptName}": "${scriptCommand}",`);

  let next = lines.join('\n');
  // If the inserted line is immediately before the scripts closing brace, remove trailing comma.
  next = next.replace(new RegExp(`(\\s*"${scriptName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*"${scriptCommand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}")\\s*,(\\s*\\n\\s*})`), '$1$2');

  try {
    JSON.parse(next);
  } catch (error) {
    fail(`package.json invalid after script patch: ${error.message}`);
  }

  write(file, next.endsWith('\n') ? next : next + '\n');
  return true;
}

function ensureUseEffectImport(source) {
  if (/import[\s\S]*\buseEffect\b[\s\S]*from\s*["']react["']/.test(source)) {
    return source;
  }
  return `import { useEffect } from "react";\n` + source;
}

function insertAfterImports(source, block) {
  const lines = source.split(/\r?\n/);
  let index = 0;
  let inImport = false;
  for (; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    if (trimmed.startsWith('import ')) {
      inImport = !trimmed.endsWith(';');
      continue;
    }
    if (inImport) {
      if (trimmed.endsWith(';')) inImport = false;
      continue;
    }
    break;
  }
  lines.splice(index, 0, '', block.trim(), '');
  return lines.join('\n');
}

const hookBlock = `
// ${STAGE}
function useStage14JMonthEntryEllipsis() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    let frame = 0;

    const normalizeText = (value) => String(value || "").replace(/\\s+/g, " ").trim();

    const isMoreCounter = (label) => /^\\+\\s*\\d+/.test(label) || /\\bwiecej\\b|\\bwi[eę]cej\\b/i.test(label);

    const isInsideMonth = (element) => Boolean(element.closest([
      '[data-calendar-month-grid="true"]',
      '[data-calendar-month-day="true"]',
      '.calendar-month-grid',
      '.calendar-month-view',
      '.calendar-month-day',
      '.month-grid',
      '.month-day',
      '.month-view'
    ].join(',')));

    const markMonthEntries = () => {
      frame = 0;
      const selector = [
        '[data-calendar-month-entry="true"]',
        '.calendar-month-entry',
        '.calendar-month-item',
        '.calendar-month-event',
        '.calendar-month-task',
        '.cf-calendar-month-entry',
        '.calendar-month-day button',
        '.calendar-month-day [role="button"]',
        '.month-day button',
        '[data-calendar-month-day="true"] button',
        '[data-calendar-month-day="true"] [role="button"]'
      ].join(',');

      document.querySelectorAll(selector).forEach((node) => {
        const element = node instanceof HTMLElement ? node : null;
        if (!element) return;
        if (!isInsideMonth(element)) return;

        const label = normalizeText(element.textContent);
        if (!label || isMoreCounter(label)) return;

        element.setAttribute('data-calendar-month-entry', 'true');
        element.setAttribute('title', label);

        const day = element.closest('[data-calendar-month-day="true"], .calendar-month-day, .month-day');
        if (day instanceof HTMLElement) day.setAttribute('data-calendar-month-day', 'true');

        const parent = element.parentElement;
        if (parent) parent.setAttribute('data-calendar-month-day-entries', 'true');
      });
    };

    const scheduleMark = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(markMonthEntries);
    };

    scheduleMark();

    const observer = new MutationObserver(scheduleMark);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.addEventListener('resize', scheduleMark);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', scheduleMark);
    };
  }, []);
}
`;

function addHookCall(source) {
  if (/useStage14JMonthEntryEllipsis\s*\(\s*\)/.test(source)) return source;

  const patterns = [
    /(export\s+default\s+function\s+Calendar\w*\s*\([^)]*\)\s*{)/,
    /(function\s+Calendar\w*\s*\([^)]*\)\s*{)/,
    /(const\s+Calendar\w*\s*=\s*\([^)]*\)\s*=>\s*{)/,
    /(export\s+default\s+function\s+\w*Calendar\w*\s*\([^)]*\)\s*{)/,
    /(function\s+\w*Calendar\w*\s*\([^)]*\)\s*{)/
  ];

  for (const pattern of patterns) {
    if (pattern.test(source)) {
      return source.replace(pattern, `$1\n  useStage14JMonthEntryEllipsis();`);
    }
  }

  fail('Could not find Calendar component function to insert Stage14J hook call');
}

function patchCalendar() {
  const file = 'src/pages/Calendar.tsx';
  let source = read(file);
  const original = source;

  source = ensureUseEffectImport(source);
  if (!source.includes(STAGE)) {
    source = insertAfterImports(source, hookBlock);
  }
  source = addHookCall(source);

  if (source !== original) {
    write(file, source.endsWith('\n') ? source : source + '\n');
    return true;
  }
  return false;
}

function findCalendarCssImport(calendarSource) {
  const importRegex = /import\s+["']([^"']*styles\/[^"']*(?:Calendar|calendar)[^"']*\.css)["'];/g;
  let match;
  while ((match = importRegex.exec(calendarSource))) {
    let imported = match[1];
    if (imported.startsWith('@/')) imported = 'src/' + imported.slice(2);
    if (imported.startsWith('../')) imported = path.normalize(path.join('src/pages', imported)).replace(/\\/g, '/');
    if (imported.startsWith('./')) imported = path.normalize(path.join('src/pages', imported)).replace(/\\/g, '/');
    if (fs.existsSync(filePath(imported))) return imported;
  }
  if (fs.existsSync(filePath('src/styles/Calendar.css'))) return 'src/styles/Calendar.css';
  if (fs.existsSync(filePath('src/styles/calendar.css'))) return 'src/styles/calendar.css';
  return null;
}

const cssBlock = `

/* ${STAGE} */
html body #root [data-calendar-month-day="true"],
html body #root .calendar-month-day,
html body #root .month-day {
  min-width: 0;
  overflow: hidden;
}

html body #root [data-calendar-month-day-entries="true"],
html body #root .calendar-month-day-entries,
html body #root .month-day-entries {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

html body #root [data-calendar-month-entry="true"] {
  display: block !important;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

html body #root [data-calendar-month-entry="true"] > * {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
`;

function patchCss() {
  const calendarSource = read('src/pages/Calendar.tsx');
  let cssFile = findCalendarCssImport(calendarSource);
  let created = false;

  if (!cssFile) {
    cssFile = 'src/styles/closeflow-calendar-month-entry-ellipsis.css';
    created = true;
  }

  let css = fs.existsSync(filePath(cssFile)) ? read(cssFile) : '';
  if (!css.includes(STAGE)) {
    css = (css.endsWith('\n') ? css : css + '\n') + cssBlock.trim() + '\n';
    write(cssFile, css);
  }

  if (created) {
    let calendar = read('src/pages/Calendar.tsx');
    const importLine = 'import "../styles/closeflow-calendar-month-entry-ellipsis.css";';
    if (!calendar.includes(importLine)) {
      calendar = insertAfterImports(calendar, importLine);
      write('src/pages/Calendar.tsx', calendar.endsWith('\n') ? calendar : calendar + '\n');
    }
  }

  return cssFile;
}

function main() {
  const changed = [];
  if (addPackageScript()) changed.push('package.json');
  if (patchCalendar()) changed.push('src/pages/Calendar.tsx');
  const cssFile = patchCss();
  changed.push(cssFile);

  console.log('OK: Stage14J calendar month entry ellipsis patch applied.');
  console.log(JSON.stringify({ stage: STAGE, changed: Array.from(new Set(changed)) }, null, 2));
}

main();
