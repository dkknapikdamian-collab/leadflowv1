const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const calendarPath = path.join(repoRoot, 'src/pages/Calendar.tsx');
const packagePath = path.join(repoRoot, 'package.json');

function fail(message) {
  throw new Error(message);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, source) {
  fs.writeFileSync(file, source.replace(/[ \t]+$/gm, '').replace(/\r?\n/g, '\n'), 'utf8');
}

function uniqueImport(source, importLine) {
  const escaped = importLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  source = source.replace(new RegExp(`\\n${escaped};?`, 'g'), '');
  const anchor = "import '../styles/closeflow-calendar-selected-day-full-text-repair11.css';";
  if (source.includes(anchor)) {
    return source.replace(anchor, `${anchor}\n${importLine}`);
  }
  const fallback = "import '../styles/closeflow-calendar-month-plain-text-rows-v4.css';";
  if (source.includes(fallback)) {
    return source.replace(fallback, `${fallback}\n${importLine}`);
  }
  fail('Cannot find calendar CSS import anchor');
}

function removeStaleImports(source) {
  return source
    .replace(/\nimport '\.\.\/styles\/closeflow-calendar-selected-day-agenda-actions-v2\.css';/g, '')
    .replace(/\nimport '\.\.\/styles\/closeflow-calendar-selected-day-new-tile-v4\.css';/g, '')
    .replace(/\nimport '\.\.\/styles\/closeflow-calendar-selected-day-new-tile-v9\.css';/g, '');
}

function findCombinedEntriesVar(source) {
  const direct = source.match(/const\s+([A-Za-z0-9_]+)\s*=\s*useMemo\s*\(\s*\(\)\s*=>\s*combineScheduleEntries\s*\(/);
  if (direct) return direct[1];
  const idx = source.indexOf('combineScheduleEntries({');
  if (idx === -1) fail('Cannot find combineScheduleEntries({ in Calendar.tsx');
  const before = source.slice(Math.max(0, idx - 500), idx);
  const m = before.match(/const\s+([A-Za-z0-9_]+)\s*=\s*useMemo\s*\([^\n]*$/m) || before.match(/const\s+([A-Za-z0-9_]+)\s*=/g);
  if (Array.isArray(m)) {
    const last = m[m.length - 1].match(/const\s+([A-Za-z0-9_]+)\s*=/);
    if (last) return last[1];
  }
  fail('Cannot infer schedule entries variable name');
}

function findBlockAroundAttr(source, attr) {
  const idx = source.indexOf(attr);
  if (idx === -1) return null;
  const tagCandidates = ['section', 'article', 'div'];
  let start = -1;
  let tag = '';
  for (const candidate of tagCandidates) {
    const found = source.lastIndexOf(`<${candidate}`, idx);
    if (found > start) {
      start = found;
      tag = candidate;
    }
  }
  if (start < 0) fail(`Cannot find JSX start tag for ${attr}`);

  const re = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g');
  re.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = re.exec(source))) {
    const text = match[0];
    const isClose = text.startsWith(`</${tag}`);
    const isSelf = /\/>\s*$/.test(text);
    if (isClose) {
      depth -= 1;
      if (depth === 0) return { start, end: re.lastIndex, tag };
    } else if (!isSelf) {
      depth += 1;
    }
  }
  fail(`Cannot find JSX closing tag for ${attr}`);
}

function replaceLegacySelectedDayBlocks(source, entriesVar) {
  // Remove/replace any older V2/V4 selected-day panel block. Repeat because failed
  // repairs may have left more than one candidate.
  const replacement = `
        <CalendarSelectedDayTileV9
          selectedDate={selectedDate}
          entries={sortCalendarEntriesForDisplay(getEntriesForDay(${entriesVar}, selectedDate))}
          actionPendingId={actionPendingId}
          onEdit={handleEditEntry}
          onShift={handleShiftEntry}
          onShiftHours={handleShiftEntryHours}
          onComplete={handleCompleteEntry}
          onDelete={handleDeleteEntry}
        />`;

  let replaced = false;
  for (const attr of [
    'data-cf-calendar-selected-day-new-tile-v4="true"',
    'data-cf-calendar-selected-day="true"',
    'data-cf-selected-day-agenda-v2="true"',
  ]) {
    let block;
    while ((block = findBlockAroundAttr(source, attr))) {
      source = source.slice(0, block.start) + replacement + source.slice(block.end);
      replaced = true;
    }
  }

  if (!replaced) {
    // Fallback: place tile just after month/week grid when no legacy marker exists.
    const insertionAnchors = [
      '</div>\n\n        <Dialog',
      '</section>\n\n        <Dialog',
      '</div>\n\n      <Dialog',
    ];
    for (const anchor of insertionAnchors) {
      const idx = source.indexOf(anchor);
      if (idx !== -1) {
        source = source.slice(0, idx + anchor.split('\n')[0].length) + `\n${replacement}` + source.slice(idx + anchor.split('\n')[0].length);
        replaced = true;
        break;
      }
    }
  }

  if (!replaced) fail('Cannot replace or insert selected-day V9 tile');
  return source;
}

const entryTileComponent = `

type CalendarSelectedDayTileV9Props = {
  selectedDate: Date;
  entries: ScheduleEntry[];
  actionPendingId: string | null;
  onEdit: (entry: ScheduleEntry) => void;
  onShift: (entry: ScheduleEntry, days: number) => void;
  onShiftHours: (entry: ScheduleEntry, hours: number) => void;
  onComplete: (entry: ScheduleEntry) => void;
  onDelete: (entry: ScheduleEntry) => void;
};

function CalendarSelectedDayEntryRowV9({ entry, actionPendingId, onEdit, onShift, onShiftHours, onComplete, onDelete }: Omit<CalendarSelectedDayTileV9Props, 'selectedDate' | 'entries'> & { entry: ScheduleEntry }) {
  const pendingEdit = actionPendingId === \`${'${entry.id}'}:edit\`;
  const pendingDay = actionPendingId === \`${'${entry.id}'}:1\`;
  const pendingWeek = actionPendingId === \`${'${entry.id}'}:7\`;
  const pendingHour = actionPendingId === \`${'${entry.id}'}:h1\`;
  const pendingDone = actionPendingId === \`${'${entry.id}'}:done\`;
  const pendingDelete = actionPendingId === \`${'${entry.id}'}:delete\`;
  const isCompletedEntry = isCompletedCalendarEntry(entry);
  const title = String(entry.title || getCalendarEntryTypeLabel(entry) || 'Wpis').trim();
  const relationLabel = getCalendarEntryRelationLabel(entry);

  return (
    <div data-cf-calendar-selected-day-entry-v9="true" data-calendar-entry-completed={isCompletedEntry ? 'true' : undefined}>
      <div className="cf-selected-day-v9-main">
        <div className="cf-selected-day-v9-meta">
          <span className="cf-selected-day-v9-type" data-cf-entity-type={getCalendarEntryTypeValue(entry)}>{getCalendarEntryTypeLabel(entry)}</span>
          <span className="cf-selected-day-v9-time">{getCalendarEntryTimeLabel(entry)}</span>
          <span className="cf-selected-day-v9-status">{getCalendarEntryStatusLabel(entry)}</span>
        </div>
        <p className="cf-selected-day-v9-entry-title" title={title} data-cf-entry-title="true">{title}</p>
        <div className="cf-selected-day-v9-relation">
          {relationLabel ? <span title={relationLabel}>{relationLabel}</span> : <span>Brak powiązania</span>}
          {entry.raw?.leadId ? (
            <Link to={\`/leads/${'${entry.raw.leadId}'}\`}>Otwórz lead</Link>
          ) : null}
          {entry.raw?.caseId ? (
            <Link to={\`/cases/${'${entry.raw.caseId}'}\`}>Otwórz sprawę</Link>
          ) : null}
        </div>
      </div>
      <div className="cf-selected-day-v9-actions">
        <button type="button" className="cf-selected-day-v9-action" onClick={() => onEdit(entry)} disabled={pendingEdit}>Edytuj</button>
        <button type="button" className="cf-selected-day-v9-action" onClick={() => onShiftHours(entry, 1)} disabled={pendingHour}>{pendingHour ? '...' : '+1H'}</button>
        <button type="button" className="cf-selected-day-v9-action" onClick={() => onShift(entry, 1)} disabled={pendingDay}>{pendingDay ? '...' : '+1D'}</button>
        <button type="button" className="cf-selected-day-v9-action" onClick={() => onShift(entry, 7)} disabled={pendingWeek}>{pendingWeek ? '...' : '+1W'}</button>
        <button type="button" className="cf-selected-day-v9-action cf-selected-day-v9-action-done" onClick={() => onComplete(entry)} disabled={pendingDone}>
          <CheckSquare className="mr-1 h-3.5 w-3.5" /> {pendingDone ? '...' : isCompletedEntry ? 'Przywróć' : 'Zrobione'}
        </button>
        <button type="button" className="cf-selected-day-v9-action cf-selected-day-v9-action-danger" onClick={() => onDelete(entry)} disabled={pendingDelete}>
          <Trash2 className="mr-1 h-3.5 w-3.5" /> {pendingDelete ? '...' : 'Usuń'}
        </button>
      </div>
    </div>
  );
}

function CalendarSelectedDayTileV9({ selectedDate, entries, actionPendingId, onEdit, onShift, onShiftHours, onComplete, onDelete }: CalendarSelectedDayTileV9Props) {
  const safeEntries = Array.isArray(entries) ? entries.filter(Boolean) : [];
  const title = capitalizeCalendarLabel(format(selectedDate, 'eeee, d MMMM yyyy', { locale: pl }));

  return (
    <section data-cf-calendar-selected-day-new-tile-v9="true" aria-label="Wybrany dzień">
      <div className="cf-selected-day-v9-header">
        <div>
          <p className="cf-selected-day-v9-kicker">Wybrany dzień</p>
          <h2 className="cf-selected-day-v9-title">{title}</h2>
        </div>
        <span className="cf-selected-day-v9-count">{formatCalendarItemCount(safeEntries.length)}</span>
      </div>
      <div className="cf-selected-day-v9-body">
        {safeEntries.length ? (
          safeEntries.map((entry) => (
            <CalendarSelectedDayEntryRowV9
              key={entry.id}
              entry={entry}
              actionPendingId={actionPendingId}
              onEdit={onEdit}
              onShift={onShift}
              onShiftHours={onShiftHours}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))
        ) : (
          <p className="cf-selected-day-v9-empty">Brak zadań, wydarzeń i zaplanowanych akcji w tym dniu.</p>
        )}
      </div>
    </section>
  );
}
`;

function ensureComponent(source) {
  source = source.replace(/[\n\r]*type CalendarSelectedDayTileV9Props[\s\S]*?function CalendarSelectedDayTileV9[\s\S]*?\n\}\n(?=\nexport default function Calendar\()/, '\n');
  const anchor = 'export default function Calendar() {';
  if (!source.includes(anchor)) fail('Cannot find Calendar component export anchor');
  return source.replace(anchor, `${entryTileComponent}\n${anchor}`);
}

function ensurePackageScript() {
  if (!fs.existsSync(packagePath)) return;
  const pkg = JSON.parse(read(packagePath));
  pkg.scripts = pkg.scripts || {};
  for (const key of Object.keys(pkg.scripts)) {
    if (/calendar:selected-day-new-tile-v4|calendar:selected-day-new-tile-v[3-8]/.test(key)) delete pkg.scripts[key];
  }
  pkg.scripts['check:calendar:selected-day-new-tile-v9'] = 'node scripts/check-calendar-selected-day-new-tile-v9-massfix.cjs';
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

let source = read(calendarPath);
source = removeStaleImports(source);
source = uniqueImport(source, "import '../styles/closeflow-calendar-selected-day-new-tile-v9.css';");
source = ensureComponent(source);
const entriesVar = findCombinedEntriesVar(source);
source = replaceLegacySelectedDayBlocks(source, entriesVar);

const requiredHandlers = [
  'handleEditEntry',
  'handleShiftEntry',
  'handleShiftEntryHours',
  'handleCompleteEntry',
  'handleDeleteEntry',
];
for (const name of requiredHandlers) {
  if (!source.includes(name)) fail(`Missing required calendar handler in Calendar.tsx: ${name}`);
}

write(calendarPath, source);
ensurePackageScript();
console.log('OK: selected-day V9 massfix source applied');
