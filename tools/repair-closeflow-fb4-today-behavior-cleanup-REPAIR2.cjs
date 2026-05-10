const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const file = path.join(repo, 'src/pages/TodayStable.tsx');
let text = fs.readFileSync(file, 'utf8');
text = text.replace(/^\uFEFF/, '').replace(/^ï»¿/, '');

function write() {
  fs.writeFileSync(file, text.replace(/\r\n/g, '\n'));
}
function fail(message) { throw new Error(message); }
function ensureIncludes(needle, label) { if (!text.includes(needle)) fail(`Missing ${label || needle}`); }
function replaceImportFrom(modulePath, symbol) {
  if (new RegExp(`\\b${symbol}\\b`).test(text)) return;
  const re = new RegExp(`import\\s*\\{([\\s\\S]*?)\\}\\s*from\\s*['"]${modulePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"];`);
  const match = text.match(re);
  if (!match) fail(`Missing import block ${modulePath}`);
  const body = match[1];
  const entries = body.split(',').map((part) => part.trim()).filter(Boolean);
  entries.push(symbol);
  const next = `import {\n  ${entries.join(',\n  ')}\n} from '${modulePath}';`;
  text = text.replace(match[0], next);
}

replaceImportFrom('../lib/supabase-fallback', 'updateTaskInSupabase');

if (!text.includes("CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP")) {
  const marker = "const CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP = 'CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP';\nvoid CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP;\n";
  if (text.includes("const TODAY_VIEW_STORAGE_KEY")) {
    const lineRe = /const TODAY_VIEW_STORAGE_KEY[^\n]*\n/;
    text = text.replace(lineRe, (m) => m + marker);
  } else if (text.includes('type DashboardStatus')) {
    text = text.replace('type DashboardStatus', marker + '\ntype DashboardStatus');
  } else {
    fail('Missing stable insertion area for FB-4 marker');
  }
}

const helperBlock = `
function getFb4TodayTasksSectionTitle(tasks: any[]) {
  const today = localDateKey();
  let todayCount = 0;
  let overdueCount = 0;

  for (const task of Array.isArray(tasks) ? tasks : []) {
    if (isClosedStatus(task?.status)) continue;
    const dateKey = getDateKey(getTaskMomentRaw(task));
    if (!dateKey) continue;
    if (dateKey === today) todayCount += 1;
    if (dateKey < today) overdueCount += 1;
  }

  if (todayCount > 0 && overdueCount > 0) return 'Zadania do obsługi';
  if (overdueCount > 0) return 'Zaległe zadania';
  return 'Zadania do wykonania dziś';
}

function shouldFb4ScrollTodaySection() {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(min-width: 768px)').matches;
  } catch {
    return true;
  }
}

function normalizeFb4TodayActionText(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeFb4TodayActionClusterOrder() {
  if (typeof document === 'undefined') return;
  const root = document.querySelector('[data-p0-today-stable-rebuild="true"]') as HTMLElement | null;
  if (!root) return;
  const buttons = Array.from(root.querySelectorAll('button')) as HTMLButtonElement[];
  const refreshButton = buttons.find((button) => normalizeFb4TodayActionText(button.textContent).includes('odswiez'));
  const viewButton = buttons.find((button) => normalizeFb4TodayActionText(button.textContent).includes('widok'));
  if (!refreshButton || !viewButton || refreshButton === viewButton) return;
  const refreshParent = refreshButton.parentElement;
  if (!refreshParent) return;
  if (viewButton.parentElement !== refreshParent) refreshParent.appendChild(viewButton);
  if (refreshButton.nextSibling !== viewButton) refreshParent.insertBefore(viewButton, refreshButton.nextSibling);
}
`;
if (!text.includes('function getFb4TodayTasksSectionTitle(')) {
  const exportIndex = text.indexOf('export default function TodayStable()');
  if (exportIndex < 0) fail('Missing TodayStable export anchor');
  text = text.slice(0, exportIndex) + helperBlock + '\n' + text.slice(exportIndex);
}

if (text.includes('function scrollToTodaySection(key: TodaySectionKey)')) {
  text = text.replace(/function scrollToTodaySection\(key: TodaySectionKey\) \{[\s\S]*?\n\}/, `function scrollToTodaySection(key: TodaySectionKey) {
  if (!shouldFb4ScrollTodaySection()) return;
  const target = getTodaySectionCardElement(key);
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}`);
} else {
  fail('Missing scrollToTodaySection helper');
}

const rowStart = text.indexOf('function RowLink({');
const rowEnd = text.indexOf('async function loadStableTodayData', rowStart);
if (rowStart < 0 || rowEnd < 0) fail('Missing RowLink block');
let rowBlock = text.slice(rowStart, rowEnd);
if (!rowBlock.includes('fb4TaskId')) {
  rowBlock = rowBlock.replace(/\) \{\s*return \(/, `) {
  const fb4TaskId = typeof to === 'string' && to.startsWith('/tasks/') ? (to.split('/').filter(Boolean).pop() || '') : '';
  return (`);
}
if (!rowBlock.includes('closeflow:today:mark-task-done')) {
  const actionDiv = '<div className="flex items-center gap-2">';
  const insert = `<div className="flex items-center gap-2">
          {fb4TaskId ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                window.dispatchEvent(new CustomEvent('closeflow:today:mark-task-done', { detail: { id: fb4TaskId } }));
              }}
            >
              Zrobione
            </Button>
          ) : null}`;
  if (!rowBlock.includes(actionDiv)) fail('Missing RowLink action div');
  rowBlock = rowBlock.replace(actionDiv, insert);
}
text = text.slice(0, rowStart) + rowBlock + text.slice(rowEnd);

const componentEffect = `
  useEffect(() => {
    // CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP: Today tiles control one expanded list, move it to the top and avoid mobile scroll jump.
    if (typeof window === 'undefined') return;

    const handleTileClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const clickable = target?.closest('button, a, [role="button"]') as HTMLElement | null;
      const section = getTodaySectionFromTileText(clickable?.textContent || '');
      if (!section) return;

      setExpandedSection(section);
      setActiveTodaySection(section);
      setCollapsedSections(TODAY_SECTION_KEYS.filter((key) => key !== section));

      window.setTimeout(() => {
        moveTodaySectionToTop(section);
        scrollToTodaySection(section);
      }, 0);
    };

    const handleTaskDone = async (event: Event) => {
      const id = String((event as CustomEvent<{ id?: string }>).detail?.id || '').trim();
      if (!id) return;
      try {
        setActionPendingId(id);
        await updateTaskInSupabase({ id, status: 'done' } as any);
        await refreshData({ manual: true });
      } finally {
        setActionPendingId('');
      }
    };

    window.addEventListener('click', handleTileClick, true);
    window.addEventListener('closeflow:today:mark-task-done', handleTaskDone as EventListener);
    return () => {
      window.removeEventListener('click', handleTileClick, true);
      window.removeEventListener('closeflow:today:mark-task-done', handleTaskDone as EventListener);
    };
  }, [refreshData]);

  useEffect(() => {
    const title = getFb4TodayTasksSectionTitle(data.tasks);
    const header = getTodaySectionHeaderElement('tasks');
    const titleElement = header?.querySelector('h2');
    if (titleElement && titleElement.textContent !== title) titleElement.textContent = title;
    normalizeFb4TodayActionClusterOrder();
  }, [data.tasks, expandedSection, activeTodaySection, collapsedSections, visibleTodaySections, todayViewOpen, manualRefreshing]);
`;
if (!text.includes('closeflow:today:mark-task-done')) {
  // The RowLink insertion also adds this string. This branch is intentionally not used.
}
if (!text.includes('Today tiles control one expanded list')) {
  const anchor = '  const todayKey = localDateKey();';
  if (!text.includes(anchor)) fail('Missing todayKey hook insertion anchor');
  text = text.replace(anchor, componentEffect + '\n' + anchor);
}

// Keep the visible task title contract available in source, even though the DOM effect updates it dynamically after render.
if (!text.includes("'Zadania do obsługi'") || !text.includes("'Zaległe zadania'")) {
  fail('Missing FB-4 task title variants');
}

ensureIncludes('updateTaskInSupabase', 'update task helper import/use');
ensureIncludes('Zrobione', 'Zrobione action');
ensureIncludes('moveTodaySectionToTop(section)', 'move opened list to top');
ensureIncludes('shouldFb4ScrollTodaySection', 'mobile-safe scroll gate');
ensureIncludes('normalizeFb4TodayActionClusterOrder', 'Widok action cluster ordering');
write();
console.log('CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP_REPAIR2_PATCH_OK');
