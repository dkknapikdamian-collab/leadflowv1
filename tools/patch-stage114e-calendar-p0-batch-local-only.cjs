const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const calendarPath = path.join(root, 'src', 'pages', 'Calendar.tsx');
const modalCssPath = path.join(root, 'src', 'styles', 'visual-stage22-event-form-vnext.css');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}
function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}
function fail(message) {
  throw new Error(`[Stage114E] ${message}`);
}
function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

let calendar = read(calendarPath);

const mojibakePairs = [
  ['UsuĹ„', 'Usuń'],
  ['Wybrany dzieĹ„', 'Wybrany dzień'],
  ['Brak zadaĹ„', 'Brak zadań'],
  ['wydarzeĹ„', 'wydarzeń'],
  ['BĹ‚Ä…d', 'Błąd'],
  ['PrzesuniÄ™to', 'Przesunięto'],
  ['PrzywrĂłÄ‡', 'Przywróć'],
  ['Wpis usuniÄ™ty', 'Wpis usunięty'],
  ['UsunÄ…Ä‡', 'Usunąć'],
  ['Nie udaĹ‚o siÄ™', 'Nie udało się'],
  ['SprĂłbuj', 'Spróbuj'],
  ['PowiÄ…zane', 'Powiązane'],
  ['PowiÄ…zana', 'Powiązana'],
  ['powiÄ…zanie', 'powiązanie'],
  ['wiÄ™cej', 'więcej'],
  ['dzieĹ„', 'dzień'],
  ['godzinÄ™', 'godzinę'],
  ['ZalegĹ‚e', 'Zaległe'],
  ['OtwĂłrz', 'Otwórz'],
  ['sprawÄ™', 'sprawę'],
  ['tytuĹ‚', 'tytuł'],
  ['datÄ™', 'datę'],
  ['koĹ„ca', 'końca'],
  ['moĹĽe', 'może'],
];
for (const [from, to] of mojibakePairs) {
  calendar = replaceAll(calendar, from, to);
}

if (!calendar.includes("const calendarLoadSeqRef = useRef(0);")) {
  const anchor = "  const editEntrySubmitLockRef = useRef(false);\n";
  if (!calendar.includes(anchor)) fail('Cannot find editEntrySubmitLockRef anchor.');
  calendar = calendar.replace(anchor, anchor + "  const calendarLoadSeqRef = useRef(0);\n  const calendarReadyRetryTimersRef = useRef<number[]>([]);\n\n");
}

if (!calendar.includes("const calendarAuthUserId = auth.currentUser?.uid || 'anonymous';")) {
  const anchor = "  async function refreshSupabaseBundle() {";
  const idx = calendar.indexOf(anchor);
  if (idx === -1) fail('Cannot find refreshSupabaseBundle anchor for auth user id insertion.');
  calendar = calendar.slice(0, idx) + "  const calendarAuthUserId = auth.currentUser?.uid || 'anonymous';\n\n" + calendar.slice(idx);
}

const loaderStartMarker = "  useEffect(() => {\n    // STAGE114B_CALENDAR_HARD_REFRESH_DATA_LOAD_CONTRACT:";
const loaderStart = calendar.indexOf(loaderStartMarker);
if (loaderStart === -1) fail('Cannot find Stage114B hard refresh loader effect.');
const loaderEndMarker = "  }, [workspace?.id, workspaceLoading, workspaceReady]);";
const loaderEnd = calendar.indexOf(loaderEndMarker, loaderStart);
if (loaderEnd === -1) fail('Cannot find end of Stage114B hard refresh loader effect.');
const loaderEndIndex = loaderEnd + loaderEndMarker.length;
const loaderReplacement = `  useEffect(() => {
    // STAGE114E_CALENDAR_HARD_REFRESH_READY_RETRY_CONTRACT:
    // Do not publish a final empty calendar while auth/workspace is still hydrating.
    // After workspaceReady, run one immediate bundle load and timed retry reads to cover hard refresh races.
    for (const timer of calendarReadyRetryTimersRef.current) {
      window.clearTimeout(timer);
    }
    calendarReadyRetryTimersRef.current = [];

    if (workspaceLoading || !workspaceReady || !workspace?.id) {
      setLoading(true);
      return undefined;
    }

    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) {
      setLoading(true);
      return undefined;
    }

    let cancelled = false;
    const runId = ++calendarLoadSeqRef.current;

    const loadBundle = async (reason: 'initial' | 'retry') => {
      try {
        if (reason === 'initial') setLoading(true);
        await refreshSupabaseBundle();
      } catch (error: any) {
        if (!cancelled && reason === 'initial') {
          toast.error(\`Błąd odczytu kalendarza: \${error.message}\`);
        }
      } finally {
        if (!cancelled && runId === calendarLoadSeqRef.current) {
          setLoading(false);
        }
      }
    };

    void loadBundle('initial');

    calendarReadyRetryTimersRef.current = [250, 900, 1800].map((delayMs) => window.setTimeout(() => {
      if (!cancelled && runId === calendarLoadSeqRef.current) {
        void loadBundle('retry');
      }
    }, delayMs));

    return () => {
      cancelled = true;
      for (const timer of calendarReadyRetryTimersRef.current) {
        window.clearTimeout(timer);
      }
      calendarReadyRetryTimersRef.current = [];
    };
  }, [workspace?.id, workspaceLoading, workspaceReady, calendarAuthUserId]);`;
calendar = calendar.slice(0, loaderStart) + loaderReplacement + calendar.slice(loaderEndIndex);

function ensureSourceIdInShift(functionName, pendingNeedle) {
  const fnIndex = calendar.indexOf(`const ${functionName} = async`);
  if (fnIndex === -1) fail(`Cannot find ${functionName}.`);
  const nextFnIndex = calendar.indexOf('\n  const ', fnIndex + 10);
  const blockEnd = nextFnIndex === -1 ? calendar.length : nextFnIndex;
  let block = calendar.slice(fnIndex, blockEnd);
  if (!block.includes('const sourceId = String(entry.sourceId || entry.raw?.id || entry.id);')) {
    if (!block.includes(pendingNeedle)) fail(`Cannot find pending anchor in ${functionName}.`);
    block = block.replace(pendingNeedle, pendingNeedle + "\n      const sourceId = String(entry.sourceId || entry.raw?.id || entry.id);");
  }
  block = block.replace(/id:\s*entry\.sourceId,/g, 'id: sourceId,');
  calendar = calendar.slice(0, fnIndex) + block + calendar.slice(blockEnd);
}
ensureSourceIdInShift('handleShiftEntry', '      setActionPendingId(`${entry.id}:${days}`);');
ensureSourceIdInShift('handleShiftEntryHours', '      setActionPendingId(`${entry.id}:h${hours}`);');

// Fill missing task calendar persistence fields if an older local copy lacks them.
calendar = calendar.replace(/date:\s*taskPayload\.date,\n\s*status:\s*taskPayload\.status,/g,
  `date: taskPayload.date,\n          scheduledAt: taskPayload.dueAt,\n          dueAt: taskPayload.dueAt,\n          time: taskPayload.time,\n          status: taskPayload.status,`);

const forbidden = /[ĹÄĂÂâ�]/;
if (forbidden.test(calendar)) {
  const match = calendar.match(forbidden);
  fail(`Calendar.tsx still contains mojibake marker ${JSON.stringify(match && match[0])}.`);
}

write(calendarPath, calendar);
console.log('Stage114E patched Calendar.tsx: hard refresh retry lifecycle, sourceId-safe shifts, task dueAt/scheduledAt persistence, mojibake cleanup.');

let css = read(modalCssPath);
if (!css.includes('STAGE114E_CALENDAR_MODAL_VIEWPORT_REPAIR_START')) {
  css += `

/* STAGE114E_CALENDAR_MODAL_VIEWPORT_REPAIR_START
   P1/P0 batch repair: calendar create/edit dialogs must fit viewport,
   keep title off screen edges, let form body scroll and keep footer visible.
*/
.event-form-vnext-content[data-calendar-entry-form-source="event-form-vnext"].calendar-entry-modal-viewport,
.event-form-vnext-content[data-stage114-calendar-modal-viewport="true"] {
  width: min(780px, calc(100vw - 28px)) !important;
  max-width: 780px !important;
  max-height: calc(100vh - 64px) !important;
  overflow: hidden !important;
  top: calc(50% + 12px) !important;
  padding: 0 !important;
}

.event-form-vnext-content[data-stage114-calendar-modal-viewport="true"] > .cf-modal-header,
.event-form-vnext-content[data-stage114-calendar-modal-viewport="true"] > div:first-child {
  padding: 24px 24px 18px !important;
}

.event-form-vnext-content[data-stage114-calendar-modal-viewport="true"] .cf-modal-title,
.event-form-vnext-content[data-stage114-calendar-modal-viewport="true"] h2 {
  line-height: 1.18 !important;
  margin-right: 36px !important;
}

.event-form-vnext-content[data-stage114-calendar-modal-viewport="true"] .event-form-vnext {
  max-height: calc(100vh - 190px) !important;
  overflow-y: auto !important;
  padding: 20px 24px 96px !important;
  scroll-padding-bottom: 110px !important;
}

.event-form-vnext-content[data-stage114-calendar-modal-viewport="true"] .event-form-footer,
.event-form-vnext-content[data-stage114-calendar-modal-viewport="true"] .cf-modal-footer {
  position: sticky !important;
  bottom: 0 !important;
  z-index: 3 !important;
  margin: 16px -24px -96px !important;
  padding: 14px 24px 20px !important;
}

@media (max-width: 640px) {
  .event-form-vnext-content[data-stage114-calendar-modal-viewport="true"] {
    width: calc(100vw - 16px) !important;
    max-height: calc(100vh - 32px) !important;
    top: calc(50% + 8px) !important;
  }

  .event-form-vnext-content[data-stage114-calendar-modal-viewport="true"] .event-form-vnext {
    max-height: calc(100vh - 160px) !important;
    padding: 16px 16px 92px !important;
  }

  .event-form-vnext-content[data-stage114-calendar-modal-viewport="true"] .event-form-footer,
  .event-form-vnext-content[data-stage114-calendar-modal-viewport="true"] .cf-modal-footer {
    margin: 14px -16px -92px !important;
    padding: 14px 16px 18px !important;
  }
}
/* STAGE114E_CALENDAR_MODAL_VIEWPORT_REPAIR_END */
`;
}
write(modalCssPath, css);
console.log('Stage114E patched calendar modal viewport CSS.');
