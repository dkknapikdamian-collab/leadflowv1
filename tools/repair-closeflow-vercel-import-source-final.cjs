#!/usr/bin/env node
const fs = require('fs');

const TARGET_FILES = [
  'src/pages/Leads.tsx',
  'src/pages/Tasks.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/Login.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Templates.tsx',
];

const MODULE_BY_IMPORTED = new Map();

function add(moduleName, names) {
  for (const name of names) MODULE_BY_IMPORTED.set(name, moduleName);
}

add('react', [
  'useState',
  'useEffect',
  'useMemo',
  'useRef',
  'useCallback',
  'FormEvent',
  'MouseEvent',
  'Dispatch',
  'SetStateAction',
  'ChangeEvent',
  'KeyboardEvent',
  'ReactNode',
  'ReactElement',
  'ComponentType',
]);

add('react-router-dom', [
  'Link',
  'NavLink',
  'Navigate',
  'Outlet',
  'useNavigate',
  'useParams',
  'useSearchParams',
  'useLocation',
]);

add('../components/GlobalQuickActions', [
  'consumeGlobalQuickAction',
  'subscribeGlobalQuickAction',
]);

add('../components/ui-system', [
  'EntityIcon',
  'ClientEntityIcon',
  'LeadEntityIcon',
  'CaseEntityIcon',
  'TaskEntityIcon',
  'EventEntityIcon',
  'ActivityEntityIcon',
  'PaymentEntityIcon',
  'CommissionEntityIcon',
  'AiEntityIcon',
  'TemplateEntityIcon',
  'NotificationEntityIcon',
  'OperatorMetricTiles',
  'OperatorMetricTile',
  'OperatorMetricTone',
  'OperatorMetricTileItem',
]);

add('lucide-react', [
  'Activity',
  'AlertCircle',
  'AlertTriangle',
  'Archive',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUpRight',
  'Bell',
  'Briefcase',
  'Building2',
  'Calendar',
  'CalendarCheck',
  'CalendarClock',
  'CalendarDays',
  'Check',
  'CheckCircle',
  'CheckCircle2',
  'CheckSquare',
  'ChevronDown',
  'ChevronLeft',
  'ChevronRight',
  'ChevronUp',
  'Clipboard',
  'Clock',
  'Clock3',
  'Copy',
  'Edit',
  'ExternalLink',
  'Eye',
  'FileText',
  'Filter',
  'FolderKanban',
  'Home',
  'Info',
  'Link2',
  'Loader2',
  'Lock',
  'LogIn',
  'Mail',
  'MapPin',
  'MessageSquare',
  'Mic',
  'MicOff',
  'MoreHorizontal',
  'MoreVertical',
  'Pencil',
  'Phone',
  'Pin',
  'Plus',
  'RefreshCw',
  'Repeat',
  'RotateCcw',
  'Save',
  'Search',
  'Settings',
  'Settings2',
  'ShieldAlert',
  'Sparkles',
  'Trash',
  'Trash2',
  'TrendingUp',
  'User',
  'Users',
  'X',
  'XCircle',
]);

add('date-fns', [
  'addDays',
  'addHours',
  'addMonths',
  'addWeeks',
  'differenceInMinutes',
  'eachDayOfInterval',
  'endOfMonth',
  'endOfWeek',
  'format',
  'isAfter',
  'isBefore',
  'isPast',
  'isSameDay',
  'isSameMonth',
  'isToday',
  'isTomorrow',
  'isValid',
  'isWithinInterval',
  'parseISO',
  'startOfDay',
  'startOfMonth',
  'startOfWeek',
  'subDays',
  'subMonths',
]);

add('../components/ui/card', ['Card', 'CardContent', 'CardDescription', 'CardFooter', 'CardHeader', 'CardTitle']);
add('../components/ui/tabs', ['Tabs', 'TabsContent', 'TabsList', 'TabsTrigger']);
add('../components/ui/dialog', ['Dialog', 'DialogContent', 'DialogDescription', 'DialogFooter', 'DialogHeader', 'DialogTitle']);
add('../components/ui/dropdown-menu', ['DropdownMenu', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuTrigger']);
add('../components/ui/button', ['Button']);
add('../components/ui/badge', ['Badge']);
add('../components/ui/input', ['Input']);
add('../components/ui/label', ['Label']);
add('../components/ui/textarea', ['Textarea']);
add('../components/EntityConflictDialog', ['EntityConflictDialog', 'EntityConflictCandidate']);
add('../components/StatShortcutCard', ['StatShortcutCard']);
add('../components/entity-actions', ['actionButtonClass', 'actionIconClass', 'modalFooterClass']);
add('../components/topic-contact-picker', ['TopicContactPicker']);
add('../lib/calendar-items', ['fetchCalendarBundleFromSupabase', 'CalendarBundle']);
add('../lib/scheduling', [
  'buildStartEndPair',
  'combineScheduleEntries',
  'createDefaultRecurrence',
  'createDefaultReminder',
  'getEntriesForDay',
  'getEntryTone',
  'getTaskDate',
  'getTaskStartAt',
  'normalizeRecurrenceConfig',
  'normalizeReminderConfig',
  'syncTaskDerivedFields',
  'toDateTimeLocalValue',
  'toReminderAtIso',
  'ScheduleEntry',
]);
add('../lib/options', ['EVENT_TYPES', 'PRIORITY_OPTIONS', 'RECURRENCE_OPTIONS', 'REMINDER_OFFSET_OPTIONS', 'REMINDER_MODE_OPTIONS', 'TASK_TYPES']);
add('../lib/schedule-conflicts', ['buildConflictCandidates', 'confirmScheduleConflicts']);
add('../lib/topic-contact', ['buildTopicContactOptions', 'findTopicContactOption', 'resolveTopicContactLink', 'TopicContactOption']);
add('../lib/workspace-context', ['requireWorkspaceId']);
add('../lib/supabase-fallback', [
  'deleteEventFromSupabase',
  'deleteTaskFromSupabase',
  'fetchCasesFromSupabase',
  'fetchClientsFromSupabase',
  'fetchEventsFromSupabase',
  'fetchLeadsFromSupabase',
  'fetchTasksFromSupabase',
  'findEntityConflictsInSupabase',
  'insertActivityToSupabase',
  'insertEventToSupabase',
  'insertLeadToSupabase',
  'insertTaskToSupabase',
  'isSupabaseConfigured',
  'subscribeCloseflowDataMutations',
  'updateClientInSupabase',
  'updateEventInSupabase',
  'updateLeadInSupabase',
  'updateTaskInSupabase',
]);
add('../firebase', ['auth']);
add('sonner', ['toast']);

function importedName(spec) {
  const clean = String(spec || '').trim().replace(/^type\s+/, '').trim();
  return clean.split(/\s+as\s+/i)[0].trim();
}

function localName(spec) {
  const clean = String(spec || '').trim().replace(/^type\s+/, '').trim();
  const parts = clean.split(/\s+as\s+/i).map((part) => part.trim()).filter(Boolean);
  return parts[1] || parts[0] || '';
}

function parseSpecifiers(body) {
  return String(body || '').split(',').map((part) => part.trim()).filter(Boolean);
}

function uniqByImported(specs) {
  const seen = new Set();
  const out = [];
  for (const spec of specs) {
    const key = `${importedName(spec)}::${localName(spec)}::${spec.trim().startsWith('type ')}`;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(spec.trim());
  }
  return out;
}

function sortSpecs(specs) {
  return uniqByImported(specs).sort((a, b) => {
    const at = a.trim().startsWith('type ') ? 1 : 0;
    const bt = b.trim().startsWith('type ') ? 1 : 0;
    if (at !== bt) return at - bt;
    return importedName(a).localeCompare(importedName(b));
  });
}

function formatNamedImport(moduleName, specs) {
  const unique = sortSpecs(specs);
  if (!unique.length) return '';
  if (unique.length <= 3) return `import { ${unique.join(', ')} } from '${moduleName}';\n`;
  return `import {\n  ${unique.join(',\n  ')}\n} from '${moduleName}';\n`;
}

function addToBucket(buckets, moduleName, spec) {
  if (!buckets.has(moduleName)) buckets.set(moduleName, []);
  buckets.get(moduleName).push(spec.trim());
}

function cleanText(text) {
  return String(text || '')
    .replace(/^\uFEFF/, '')
    .replace(/\uFEFF/g, '')
    .split('ï»¿').join('')
    .split('´╗┐').join('');
}

function patchFile(file) {
  if (!fs.existsSync(file)) {
    console.log(`skip missing: ${file}`);
    return;
  }

  const original = cleanText(fs.readFileSync(file, 'utf8'));
  const buckets = new Map();
  const namedImportRe = /import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g;

  let output = '';
  let cursor = 0;
  let match;

  while ((match = namedImportRe.exec(original)) !== null) {
    output += original.slice(cursor, match.index);
    cursor = namedImportRe.lastIndex;

    const body = match[1];
    const moduleName = match[2];
    const kept = [];

    for (const rawSpec of parseSpecifiers(body)) {
      const name = importedName(rawSpec);
      const desiredModule = MODULE_BY_IMPORTED.get(name);
      if (!desiredModule) {
        kept.push(rawSpec);
        continue;
      }
      addToBucket(buckets, desiredModule, rawSpec);
    }

    output += formatNamedImport(moduleName, kept);
  }

  output += original.slice(cursor);

  const canonicalImports = [];
  const preferredOrder = [
    'react',
    'react-router-dom',
    'lucide-react',
    '../components/ui-system',
    '../components/GlobalQuickActions',
    '../components/entity-actions',
    '../components/ui/card',
    '../components/ui/tabs',
    '../components/ui/dialog',
    '../components/ui/dropdown-menu',
    '../components/ui/button',
    '../components/ui/badge',
    '../components/ui/input',
    '../components/ui/label',
    '../components/ui/textarea',
    '../components/EntityConflictDialog',
    '../components/StatShortcutCard',
    '../components/topic-contact-picker',
    '../lib/calendar-items',
    '../lib/scheduling',
    '../lib/options',
    '../lib/schedule-conflicts',
    '../lib/topic-contact',
    '../lib/workspace-context',
    '../lib/supabase-fallback',
    '../firebase',
    'date-fns',
    'sonner',
  ];

  for (const moduleName of preferredOrder) {
    if (buckets.has(moduleName)) canonicalImports.push(formatNamedImport(moduleName, buckets.get(moduleName)));
  }

  for (const [moduleName, specs] of buckets.entries()) {
    if (!preferredOrder.includes(moduleName)) canonicalImports.push(formatNamedImport(moduleName, specs));
  }

  output = canonicalImports.join('') + output.replace(/^\s+/, '');
  output = output.replace(/\n{4,}/g, '\n\n\n');

  fs.writeFileSync(file, output, 'utf8');
  console.log(`canonicalized import sources: ${file}`);
}

for (const file of TARGET_FILES) patchFile(file);

console.log('CLOSEFLOW_VERCEL_IMPORT_SOURCE_FINAL_REPAIR_OK');
