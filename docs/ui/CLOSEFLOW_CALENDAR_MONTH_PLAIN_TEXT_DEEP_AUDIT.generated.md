# CloseFlow — Calendar Month Plain Text Deep Audit

Generated: 2026-05-12T06:15:34.473Z

## Werdykt

Widok miesiąca nie powinien używać mini-kafelków wpisów. Na screenie problemem jest „kafelek w kafelku”: ramka wpisu, badge typu, przekreślony tekst i mała wysokość wiersza walczą ze sobą. To trzeba zmienić strukturalnie na zwykłą linię tekstu.

## Teza

- Główna teza: przepiąć render wpisów w widoku miesiąca na plain text rows.
- Poziom przekonania: 9/10.
- Argument za: kilka warstw CSS nie naprawiło overlapu, a screen nadal pokazuje mini-karty z obramowaniem i wewnętrznym badgem.
- Argument przeciw: możliwe, że selector V3 nie trafił w DOM i czysty komponent też trzeba będzie dobrać do realnego miejsca renderu.
- Co zmieni zdanie: gdyby runtime DOM pokazał, że render jest już prostą linią, a problem robi tylko jeden konkretny stary CSS.
- Najkrótszy test: usunąć obramowanie mini-wpisu i renderować wpis miesiąca jako `type + text` w jednej linii z `title`.

## Obserwacje ze screena

- W kafelku dnia nadal widać „kafelek w kafelku”: każdy wpis ma własną ramkę/pill, a wewnątrz kolejny badge typu.
- Przekreślone/zakończone wpisy mają wizualnie drugą warstwę tekstu i nachodzą na następne pozycje.
- Mini-karty mają za małą wysokość względem line-height i dekoracji, więc w gęstym widoku miesiąca tekst dotyka kolejnej pozycji.
- Widok miesiąca powinien być listą lekkich linii tekstu, nie listą małych kart.

## Prawdopodobna przyczyna

- Struktura DOM i aktywne style dalej produkują wpis jako obramowany chip/pill.
- Nawet jeśli efekt strukturalny jest w kodzie, selector może nie trafiać w realny element albo uruchamia się za wcześnie/po złym parent scope.
- Wiele historycznych warstw kalendarza nadal istnieje i styluje wpisy przez klasy typu calendar/chip/entry/pill.
- Poprzednie CSS-y próbowały ratować istniejący DOM, ale screen pokazuje, że trzeba przestać używać mini-kafelków w miesiącu.

## Rekomendowana naprawa

- Przestać renderować wpisy miesiąca jako chip/card/pill.
- Dla miesiąca zrobić osobny prosty render: plain text row.
- Format: mała kropka lub krótki typ + jedna linia tekstu, bez obramowania wpisu.
- Długi tekst: ellipsis + title na hover.
- + X więcej zostaje jako osobna linia.
- Kolory dać subtelnie: typ/kropka/tekst, nie tło całej mini-karty.
- Najbezpieczniejsza poprawka: bez DOM-enhancera, bez zgadywania selectorów, bez mini-card CSS. Trzeba zmienić JSX renderu miesiąca w Calendar.tsx.

## Czego nie robić

- Nie robić kolejnej warstwy CSS na .chip/.entry.
- Nie dodawać większej wysokości kafelka dnia jako głównej naprawy, bo to tylko ukryje problem.
- Nie mieszać w panelu bocznym, tygodniu, API, Supabase ani handlerach.

## Evidence: structural package markers

- hasStructuralCssFile: true
- calendarImportsStructuralCss: true
- hasStructuralRepair2Marker: true
- hasStructuralRepair2Effect: true
- hasReplaceChildren: true

## Calendar.tsx CSS imports

- line 101: ../styles/visual-stage22-event-form-vnext.css
- line 106: ../styles/closeflow-page-header-v2.css
- line 107: ../styles/closeflow-calendar-skin-only-v1.css
- line 108: ../styles/closeflow-calendar-color-tooltip-v2.css
- line 109: ../styles/closeflow-calendar-month-chip-overlap-fix-v1.css
- line 110: ../styles/closeflow-calendar-month-rows-no-overlap-repair2.css
- line 111: ../styles/closeflow-calendar-month-entry-structural-fix-v3.css

## Active old / visual layers

- src/index.css: emergency-hotfixes
- src/pages/Calendar.tsx: closeflow-calendar-skin-only-v1
- src/pages/Calendar.tsx: closeflow-calendar-color-tooltip-v2
- src/pages/Calendar.tsx: closeflow-calendar-month-chip-overlap-fix-v1
- src/pages/Calendar.tsx: closeflow-calendar-month-rows-no-overlap-repair2
- src/pages/Calendar.tsx: closeflow-calendar-month-entry-structural-fix-v3
- src/styles/page-adapters/page-adapters.css: visual-stage29-calendar-vnext
- src/styles/temporary/temporary-overrides.css: stage34-calendar-readability-status-forms
- src/styles/temporary/temporary-overrides.css: stage34b-calendar-complete-polish
- tools/audit-closeflow-calendar-color-tooltip-v2.cjs: emergency-hotfixes
- tools/audit-closeflow-calendar-color-tooltip-v2.cjs: closeflow-calendar-skin-only-v1
- tools/audit-closeflow-calendar-color-tooltip-v2.cjs: closeflow-calendar-color-tooltip-v2
- tools/audit-closeflow-calendar-month-chip-overlap-fix-v1.cjs: closeflow-calendar-skin-only-v1
- tools/audit-closeflow-calendar-month-chip-overlap-fix-v1.cjs: closeflow-calendar-color-tooltip-v2
- tools/audit-closeflow-calendar-month-chip-overlap-fix-v1.cjs: closeflow-calendar-month-chip-overlap-fix-v1
- tools/audit-closeflow-calendar-month-entry-structural-fix-v3-repair2.cjs: closeflow-calendar-month-entry-structural-fix-v3
- tools/audit-closeflow-calendar-month-overlap-deep.cjs: closeflow-calendar-skin-only-v1
- tools/audit-closeflow-calendar-month-overlap-deep.cjs: closeflow-calendar-color-tooltip-v2
- tools/audit-closeflow-calendar-month-overlap-deep.cjs: closeflow-calendar-month-chip-overlap-fix-v1
- tools/audit-closeflow-calendar-month-overlap-deep.cjs: closeflow-calendar-month-rows-no-overlap-repair2
- tools/audit-closeflow-calendar-month-plain-text-deep.cjs: visual-stage29-calendar-vnext
- tools/audit-closeflow-calendar-month-plain-text-deep.cjs: stage34-calendar-readability-status-forms
- tools/audit-closeflow-calendar-month-plain-text-deep.cjs: stage34b-calendar-complete-polish
- tools/audit-closeflow-calendar-month-plain-text-deep.cjs: emergency-hotfixes
- tools/audit-closeflow-calendar-month-plain-text-deep.cjs: closeflow-calendar-skin-only-v1
- tools/audit-closeflow-calendar-month-plain-text-deep.cjs: closeflow-calendar-color-tooltip-v2
- tools/audit-closeflow-calendar-month-plain-text-deep.cjs: closeflow-calendar-month-chip-overlap-fix-v1
- tools/audit-closeflow-calendar-month-plain-text-deep.cjs: closeflow-calendar-month-rows-no-overlap-repair2
- tools/audit-closeflow-calendar-month-plain-text-deep.cjs: closeflow-calendar-month-entry-structural-fix-v3
- tools/audit-closeflow-calendar-month-rows-no-overlap-repair2.cjs: closeflow-calendar-month-rows-no-overlap-repair2
- tools/audit-closeflow-calendar-skin-scope-repair-audit-v2-repair1.cjs: emergency-hotfixes
- tools/audit-closeflow-calendar-skin-scope-repair-audit-v2-repair1.cjs: closeflow-calendar-skin-only-v1
- tools/audit-closeflow-calendar-skin-scope-repair-audit-v2.cjs: closeflow-calendar-skin-only-v1
- tools/audit-closeflow-header-command-buttons-stage6.cjs: emergency-hotfixes
- tools/patch-closeflow-calendar-color-tooltip-v2.cjs: closeflow-calendar-skin-only-v1
- tools/patch-closeflow-calendar-color-tooltip-v2.cjs: closeflow-calendar-color-tooltip-v2
- tools/patch-closeflow-calendar-month-chip-overlap-fix-v1.cjs: closeflow-calendar-skin-only-v1
- tools/patch-closeflow-calendar-month-chip-overlap-fix-v1.cjs: closeflow-calendar-color-tooltip-v2
- tools/patch-closeflow-calendar-month-chip-overlap-fix-v1.cjs: closeflow-calendar-month-chip-overlap-fix-v1
- tools/patch-closeflow-calendar-month-entry-structural-fix-v3-repair2.cjs: closeflow-calendar-month-rows-no-overlap-repair2
- tools/patch-closeflow-calendar-month-entry-structural-fix-v3-repair2.cjs: closeflow-calendar-month-entry-structural-fix-v3
- tools/patch-closeflow-calendar-month-rows-no-overlap-repair2.cjs: closeflow-calendar-color-tooltip-v2
- tools/patch-closeflow-calendar-month-rows-no-overlap-repair2.cjs: closeflow-calendar-month-chip-overlap-fix-v1
- tools/patch-closeflow-calendar-month-rows-no-overlap-repair2.cjs: closeflow-calendar-month-rows-no-overlap-repair2
- tools/patch-closeflow-calendar-skin-only-v1.cjs: closeflow-calendar-skin-only-v1
- tools/patch-closeflow-calendar-skin-scope-repair-audit-v2-repair1.cjs: closeflow-calendar-skin-only-v1
- tools/patch-closeflow-calendar-skin-scope-repair-audit-v2.cjs: closeflow-calendar-skin-only-v1
- tools/patch-closeflow-header-command-buttons-source-truth-stage6.cjs: emergency-hotfixes
- tools/patch-closeflow-page-header-copy-left-only-packet4.cjs: emergency-hotfixes
- tools/patch-closeflow-page-header-final-lock-packet2.cjs: emergency-hotfixes
- tools/patch-closeflow-page-header-semantic-copy-packet1.cjs: emergency-hotfixes
- tools/patch-closeflow-page-header-source-truth-rebuild-stage2.cjs: emergency-hotfixes
- tools/patch-closeflow-page-header-stage6-final-lock.cjs: emergency-hotfixes
- tools/patch-closeflow-page-header-structure-lock-packet3.cjs: emergency-hotfixes
- scripts/apply-stage34-calendar-readability-status-forms.cjs: stage34-calendar-readability-status-forms
- scripts/apply-stage34b-calendar-complete-polish.cjs: stage34b-calendar-complete-polish
- scripts/audit-closeflow-active-screen-layout-matrix.cjs: visual-stage29-calendar-vnext
- scripts/audit-closeflow-active-screen-layout-matrix.cjs: stage34-calendar-readability-status-forms
- scripts/audit-closeflow-active-screen-layout-matrix.cjs: stage34b-calendar-complete-polish
- scripts/check-closeflow-admin-feedback-2026-05-11.cjs: emergency-hotfixes
- scripts/check-closeflow-calendar-color-tooltip-v2.cjs: closeflow-calendar-color-tooltip-v2
- scripts/check-closeflow-calendar-month-chip-overlap-fix-v1.cjs: closeflow-calendar-month-chip-overlap-fix-v1
- scripts/check-closeflow-calendar-month-entry-structural-fix-v3-repair2.cjs: closeflow-calendar-month-entry-structural-fix-v3
- scripts/check-closeflow-calendar-month-rows-no-overlap-repair2.cjs: closeflow-calendar-month-rows-no-overlap-repair2
- scripts/check-closeflow-calendar-skin-only-v1.cjs: closeflow-calendar-skin-only-v1
- scripts/check-closeflow-calendar-skin-scope-repair-audit-v2-repair1.cjs: closeflow-calendar-skin-only-v1
- scripts/check-closeflow-calendar-skin-scope-repair-audit-v2.cjs: closeflow-calendar-skin-only-v1
- scripts/check-closeflow-css-import-order.cjs: visual-stage29-calendar-vnext
- scripts/check-closeflow-css-import-order.cjs: emergency-hotfixes
- scripts/check-closeflow-header-command-buttons-source-truth-stage6.cjs: emergency-hotfixes
- scripts/check-closeflow-metric-tile-single-source-truth.cjs: emergency-hotfixes
- scripts/check-closeflow-metric-tile-visual-source-truth.cjs: emergency-hotfixes
- scripts/check-closeflow-metric-tiles-final-system.cjs: emergency-hotfixes
- scripts/check-closeflow-no-unclassified-css-imports.cjs: emergency-hotfixes
- scripts/check-closeflow-page-header-copy-left-only-packet4.cjs: emergency-hotfixes
- scripts/check-closeflow-page-header-final-lock-packet2.cjs: emergency-hotfixes
- scripts/check-closeflow-page-header-semantic-copy-packet1.cjs: emergency-hotfixes
- scripts/check-closeflow-page-header-source-truth-rebuild-stage2.cjs: emergency-hotfixes
- scripts/check-closeflow-page-header-stage6-final-lock.cjs: emergency-hotfixes
- scripts/check-closeflow-page-header-structure-lock-packet3.cjs: emergency-hotfixes
- scripts/check-stage34-calendar-readability-status-forms.cjs: stage34-calendar-readability-status-forms
- scripts/check-stage34b-calendar-complete-polish.cjs: stage34b-calendar-complete-polish

## High-risk CSS rows

- src/components/admin-tools/admin-tools-export.ts:103 [border-pill-card] selector=`` :: `for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {`
- src/components/admin-tools/dom-candidates.ts:173 [border-pill-card] selector=`` :: `export function buildTargetCandidates(pathLike: EventTarget[] | Element[], route: string, screen: string): AdminTargetCandidate[] {`
- src/components/admin-tools/dom-targeting.ts:22 [border-pill-card] selector=`` :: `export function pickAdminTargetCandidate(event: Event, route: string, screen: string): {`
- src/components/ContextActionDialogs.tsx:43 [border-pill-card] selector=`` :: `function buildContextFromPath(pathname: string): TaskCreateDialogContext | null {`
- src/components/EventCreateDialog.tsx:58 [border-pill-card] selector=`` :: `title: string;`
- src/components/EventCreateDialog.tsx:59 [border-pill-card] selector=`` :: `type: string;`
- src/components/EventCreateDialog.tsx:60 [border-pill-card] selector=`` :: `startAt: string;`
- src/components/EventCreateDialog.tsx:61 [border-pill-card] selector=`` :: `endAt: string;`
- src/components/EventCreateDialog.tsx:62 [border-pill-card] selector=`` :: `status: string;`
- src/components/EventCreateDialog.tsx:63 [border-pill-card] selector=`` :: `recurrenceMode: string;`
- src/components/EventCreateDialog.tsx:64 [border-pill-card] selector=`` :: `reminderMode: string;`
- src/components/EventCreateDialog.tsx:89 [border-pill-card] selector=`` :: `function buildRecurrenceRule(mode: string) {`
- src/components/EventCreateDialog.tsx:96 [border-pill-card] selector=`` :: `function calculateReminderAt(startAt: string, reminderMode: string, reminderOffsetMinutes: number) {`
- src/components/EventCreateDialog.tsx:100 [border-pill-card] selector=`` :: `return new Date(startTime - Number(reminderOffsetMinutes || 0) * 60_000).toISOString();`
- src/components/EventCreateDialog.tsx:164 [border-pill-card] selector=`` :: `<div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900" data-stage85-context-relation="true">`
- src/components/EventCreateDialog.tsx:186 [border-pill-card] selector=`` :: `<select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}>`
- src/components/EventCreateDialog.tsx:192 [border-pill-card] selector=`` :: `<select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}>`
- src/components/EventCreateDialog.tsx:202 [border-pill-card] selector=`` :: `<select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.recurrenceMode} onChange={(event) => setForm((prev) => ({ ...prev, recurrenceMode: event.target.value }))}>`
- src/components/EventCreateDialog.tsx:208 [border-pill-card] selector=`` :: `<select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.reminderMode} onChange={(event) => setForm((prev) => ({ ...prev, reminderMode: event.target.value }))}>`
- src/components/EventCreateDialog.tsx:214 [border-pill-card] selector=`` :: `<select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={String(form.reminderOffsetMinutes)} disabled={form.reminderMode === 'none'} onChange={(event) => setForm((prev) => ({ ...prev, reminderOffsetMinutes: Number(event.t`
- src/components/EventCreateDialog.tsx:215 [border-pill-card] selector=`` :: `{REMINDER_OFFSET_OPTIONS.map((option) => <option key={option.value} value={String(option.value)}>{option.label}</option>)}`
- src/components/EventCreateDialog.tsx:220 [border-pill-card] selector=`` :: `<Button type="button" variant="outline" onClick={closeDialog} disabled={saving}>Anuluj</Button>`
- src/components/finance/PaymentList.tsx:30 [border-pill-card] selector=`` :: `return date.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });`
- src/components/GlobalQuickActions.tsx:101 [border-pill-card] selector=`` :: `<Button type="button" variant="outline" className="btn cf-command-action cf-command-action--neutral" data-global-quick-action="task" data-cf-command-action="neutral" data-global-task-direct-modal-trigger="true" data-feature-status="Gotowe" title="Gotowe" onCli`
- src/components/GlobalQuickActions.tsx:105 [border-pill-card] selector=`` :: `<Button asChild variant="outline" className="btn cf-command-action cf-command-action--neutral" data-global-quick-action="event" data-cf-command-action="neutral" data-feature-status="Gotowe" title="Gotowe">`
- src/components/LeadAiFollowupDraft.tsx:16 [border-pill-card] selector=`` :: `tasks?: Record<string, unknown>[];`
- src/components/LeadAiFollowupDraft.tsx:17 [border-pill-card] selector=`` :: `events?: Record<string, unknown>[];`
- src/components/LeadAiNextAction.tsx:18 [border-pill-card] selector=`` :: `tasks: Record<string, unknown>[];`
- src/components/LeadAiNextAction.tsx:19 [border-pill-card] selector=`` :: `events: Record<string, unknown>[];`
- src/components/LeadAiNextAction.tsx:116 [border-pill-card] selector=`` :: `const dueAt = suggestion.suggestedTask.dueAt || suggestion.dueAt || new Date().toISOString();`
- src/components/sidebar-mini-calendar.tsx:26 [border-pill-card] selector=`` :: `date: string;`
- src/components/sidebar-mini-calendar.tsx:37 [border-pill-card] selector=`` :: `function hasValidDate(value: string, day: Date) {`
- src/components/sidebar-mini-calendar.tsx:88 [border-pill-card] selector=`` :: `<div className="mt-4 rounded-2xl border app-border p-2 app-surface-strong">`
- src/components/sidebar-mini-calendar.tsx:90 [border-pill-card] selector=`` :: `<Button variant="ghost" size="icon" className="h-5 w-5 rounded-md" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>`
- src/components/sidebar-mini-calendar.tsx:98 [border-pill-card] selector=`` :: `<Button variant="ghost" size="icon" className="h-5 w-5 rounded-md" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>`
- src/components/sidebar-mini-calendar.tsx:118 [border-pill-card] selector=`` :: `key={day.toISOString()}`
- src/components/sidebar-mini-calendar.tsx:122 [border-pill-card] selector=`` :: `'flex h-5 items-center justify-center rounded-md text-[9px] font-semibold transition-colors',`
- src/components/task-editor-dialog.tsx:18 [border-pill-card] selector=`` :: `id: string;`
- src/components/task-editor-dialog.tsx:19 [border-pill-card] selector=`` :: `title: string;`
- src/components/task-editor-dialog.tsx:20 [border-pill-card] selector=`` :: `type: string;`
- src/components/task-editor-dialog.tsx:21 [border-pill-card] selector=`` :: `date: string;`
- src/components/task-editor-dialog.tsx:22 [border-pill-card] selector=`` :: `priority: string;`
- src/components/task-editor-dialog.tsx:23 [border-pill-card] selector=`` :: `reminderAt: string | null;`
- src/components/task-editor-dialog.tsx:26 [border-pill-card] selector=`` :: `recurrenceEndAt: string | null;`
- src/components/task-editor-dialog.tsx:28 [border-pill-card] selector=`` :: `leadId: string | null;`
- src/components/task-editor-dialog.tsx:33 [border-pill-card] selector=`` :: `title: string;`
- src/components/task-editor-dialog.tsx:34 [border-pill-card] selector=`` :: `type: string;`
- src/components/task-editor-dialog.tsx:35 [border-pill-card] selector=`` :: `date: string;`
- src/components/task-editor-dialog.tsx:36 [border-pill-card] selector=`` :: `priority: string;`
- src/components/task-editor-dialog.tsx:37 [border-pill-card] selector=`` :: `reminderAt: string;`
- src/components/task-editor-dialog.tsx:40 [border-pill-card] selector=`` :: `recurrenceEndAt: string;`
- src/components/task-editor-dialog.tsx:41 [border-pill-card] selector=`` :: `recurrenceCount: string;`
- src/components/task-editor-dialog.tsx:42 [border-pill-card] selector=`` :: `leadId: string;`
- src/components/task-editor-dialog.tsx:43 [border-pill-card] selector=`` :: `leadSearch: string;`
- src/components/task-editor-dialog.tsx:56 [border-pill-card] selector=`` :: `recurrenceCount: task?.recurrenceCount ? String(task.recurrenceCount) : '5',`
- src/components/task-editor-dialog.tsx:231 [border-pill-card] selector=`` :: `<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button>`
- src/components/TaskCreateDialog.tsx:22 [border-pill-card] selector=`` :: `title: string;`
- src/components/TaskCreateDialog.tsx:23 [border-pill-card] selector=`` :: `type: string;`
- src/components/TaskCreateDialog.tsx:24 [border-pill-card] selector=`` :: `dueAt: string;`
- src/components/TaskCreateDialog.tsx:25 [border-pill-card] selector=`` :: `priority: string;`
- src/components/TaskCreateDialog.tsx:26 [border-pill-card] selector=`` :: `status: string;`
- src/components/TaskCreateDialog.tsx:27 [border-pill-card] selector=`` :: `reminderMode: string;`
- src/components/TaskCreateDialog.tsx:33 [border-pill-card] selector=`` :: `recordId?: string;`
- src/components/TaskCreateDialog.tsx:34 [border-pill-card] selector=`` :: `recordLabel?: string;`
- src/components/TaskCreateDialog.tsx:35 [border-pill-card] selector=`` :: `leadId?: string | null;`
- src/components/TaskCreateDialog.tsx:36 [border-pill-card] selector=`` :: `caseId?: string | null;`
- src/components/TaskCreateDialog.tsx:37 [border-pill-card] selector=`` :: `clientId?: string | null;`
- src/components/TaskCreateDialog.tsx:61 [border-pill-card] selector=`` :: `function calculateReminderAt(dueAt: string, reminderMode: string, reminderOffsetMinutes: number) {`
- src/components/TaskCreateDialog.tsx:65 [border-pill-card] selector=`` :: `return new Date(dueTime - Number(reminderOffsetMinutes || 0) * 60_000).toISOString();`
- src/components/TaskCreateDialog.tsx:102 [border-pill-card] selector=`` :: `recurrenceRule: form.reminderMode === 'recurring' ? 'FREQ=DAILY' : undefined,`
- src/components/TaskCreateDialog.tsx:126 [border-pill-card] selector=`` :: `<div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900" data-stage85-context-relation="true">`
- src/components/TaskCreateDialog.tsx:142 [border-pill-card] selector=`` :: `<select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.priority} onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}>`
- src/components/TaskCreateDialog.tsx:150 [border-pill-card] selector=`` :: `<select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}>`
- src/components/TaskCreateDialog.tsx:156 [border-pill-card] selector=`` :: `<select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}>`
- src/components/TaskCreateDialog.tsx:165 [border-pill-card] selector=`` :: `<select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.reminderMode} onChange={(event) => setForm((prev) => ({ ...prev, reminderMode: event.target.value }))}>`
- src/components/TaskCreateDialog.tsx:171 [border-pill-card] selector=`` :: `<select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={String(form.reminderOffsetMinutes)} disabled={form.reminderMode === 'none'} onChange={(event) => setForm((prev) => ({ ...prev, reminderOffsetMinutes: Number(event.t`
- src/components/TaskCreateDialog.tsx:172 [border-pill-card] selector=`` :: `{REMINDER_OFFSET_OPTIONS.map((option) => <option key={option.value} value={String(option.value)}>{option.label}</option>)}`
- src/components/TaskCreateDialog.tsx:177 [border-pill-card] selector=`` :: `<Button type="button" variant="outline" onClick={closeDialog} disabled={saving}>Anuluj</Button>`
- src/components/ui/button.tsx:7 [border-pill-card] selector=`` :: `"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-no`
- src/components/ui/dialog.tsx:44 [border-pill-card] selector=`` :: `<DialogPrimitive.Close className="cf-modal-close absolute right-4 top-4 rounded-sm text-slate-500 opacity-70 transition-colors transition-opacity hover:text-slate-900 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 dis`
- src/components/ui/dropdown-menu.tsx:79 [border-pill-card] selector=`` :: `"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-slate-900 outline-none transition-colors focus:bg-slate-100 focus:text-slate-950 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",`
- src/components/ui/dropdown-menu.tsx:95 [border-pill-card] selector=`` :: `"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-slate-900 outline-none transition-colors focus:bg-slate-100 focus:text-slate-950 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",`
- src/components/ui/dropdown-menu.tsx:119 [border-pill-card] selector=`` :: `"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-slate-900 outline-none transition-colors focus:bg-slate-100 focus:text-slate-950 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",`
- src/components/ui/select.tsx:42 [border-pill-card] selector=`` :: `"flex w-full min-w-0 items-center justify-between gap-1.5 rounded-lg border border-slate-300 bg-white py-2 pr-2 pl-2.5 text-sm whitespace-nowrap text-slate-900 transition-colors outline-none select-none focus-visible:border-blue-500 focus-visible:ring-3 focus-`
- src/components/ui/select.tsx:131 [border-pill-card] selector=`` :: `"relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm text-slate-900 outline-hidden select-none focus:bg-slate-100 focus:text-slate-900 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-no`
- src/components/ui/tabs.tsx:29 [border-pill-card] selector=`` :: `"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-event`
- src/components/ui-system/semantic-visual-registry.ts:258 [border-pill-card] selector=`` :: `} satisfies Record<string, Omit<CloseflowSemanticVisualEntry, 'name'>>;`
- src/components/ui-system/StatusPill.tsx:8 [border-pill-card] selector=`` :: `className?: string;`
- src/components/ui-system/StatusPill.tsx:11 [border-pill-card] selector=`` :: `const TONE_CLASS: Record<StatusPillTone, string> = {`
- src/components/ui-system/StatusPill.tsx:12 [border-pill-card] selector=`` :: `neutral: 'bg-slate-100 text-slate-700 border-slate-200',`
- src/components/ui-system/StatusPill.tsx:13 [border-pill-card] selector=`` :: `blue: 'bg-blue-50 text-blue-700 border-blue-100',`
- src/components/ui-system/StatusPill.tsx:14 [border-pill-card] selector=`` :: `green: 'bg-emerald-50 text-emerald-700 border-emerald-100',`
- src/components/ui-system/StatusPill.tsx:15 [border-pill-card] selector=`` :: `amber: 'bg-amber-50 text-amber-700 border-amber-100',`
- src/components/ui-system/StatusPill.tsx:16 [border-pill-card] selector=`` :: `red: 'bg-rose-50 text-rose-700 border-rose-100',`
- src/components/ui-system/StatusPill.tsx:17 [border-pill-card] selector=`` :: `purple: 'bg-purple-50 text-purple-700 border-purple-100',`
- src/components/ui-system/StatusPill.tsx:23 [border-pill-card] selector=`` :: `className={['cf-status-pill inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-[0.04em]', TONE_CLASS[tone], className].filter(Boolean).join(' ')}`
- src/lib/access.ts:40 [border-pill-card] selector=`` :: `chipClassName: string;`
- src/lib/activity-roadmap.ts:150 [border-pill-card] selector=`` :: `function activityKindFromEventType(eventType: string): ActivityRoadmapItemKind {`
- src/lib/activity-roadmap.ts:210 [border-pill-card] selector=`` :: `function buildTaskItem(task: unknown, caseId: string): ActivityRoadmapItem | null {`
- src/lib/activity-roadmap.ts:230 [border-pill-card] selector=`` :: `function buildEventItem(event: unknown, caseId: string): ActivityRoadmapItem | null {`
- src/lib/ai-assistant.ts:50 [border-pill-card] selector=`` :: `tasks?: Record<string, unknown>[];`
- src/lib/ai-assistant.ts:51 [border-pill-card] selector=`` :: `events?: Record<string, unknown>[];`
- src/lib/ai-assistant.ts:77 [border-pill-card] selector=`` :: `type Stage32TaskRow = Record<string, unknown> & {`
- src/lib/ai-assistant.ts:143 [border-pill-card] selector=`` :: `function stage32MonthRange(now: Date, monthOffset: number, label: string): Stage32DateRange {`
- src/lib/ai-assistant.ts:202 [border-pill-card] selector=`` :: `String(value.getMonth() + 1).padStart(2, '0'),`
- src/lib/ai-assistant.ts:207 [border-pill-card] selector=`` :: `function stage32IsOpenTask(row: Record<string, unknown>) {`
- src/lib/ai-assistant.ts:212 [border-pill-card] selector=`` :: `function stage32TaskTitle(row: Record<string, unknown>) {`
- src/lib/ai-assistant.ts:216 [border-pill-card] selector=`` :: `function stage32TaskHref(row: Record<string, unknown>) {`
- src/lib/ai-assistant.ts:252 [border-pill-card] selector=`` :: `function stage32WantsMostTasksDay(query: string) {`
- src/lib/ai-assistant.ts:258 [border-pill-card] selector=`` :: `function stage32WantsFirstTask(query: string) {`
- src/lib/ai-assistant.ts:263 [border-pill-card] selector=`` :: `function stage32WantsTaskListInRange(query: string, range: Stage32DateRange | null) {`
- src/lib/ai-assistant.ts:285 [border-pill-card] selector=`` :: `function stage32BuildMostTasksDayAnswer(input: TodayAiAssistantInput, query: string, range: Stage32DateRange | null): TodayAiAssistantAnswer {`
- src/lib/ai-assistant.ts:287 [border-pill-card] selector=`` :: `const groups = new Map<string, { date: Date; tasks: Stage32TaskRow[] }>();`
- src/lib/ai-direct-write-guard.ts:71 [border-pill-card] selector=`` :: `return { date: String(base.getFullYear()) + '-' + pad2(base.getMonth() + 1) + '-' + pad2(base.getDate()), matched: 'dzisiaj' };`
- src/lib/ai-direct-write-guard.ts:77 [border-pill-card] selector=`` :: `return { date: String(next.getFullYear()) + '-' + pad2(next.getMonth() + 1) + '-' + pad2(next.getDate()), matched: 'jutro' };`
- src/lib/ai-direct-write-guard.ts:83 [border-pill-card] selector=`` :: `return { date: String(next.getFullYear()) + '-' + pad2(next.getMonth() + 1) + '-' + pad2(next.getDate()), matched: 'pojutrze' };`
- src/lib/ai-direct-write-guard.ts:104 [border-pill-card] selector=`` :: `return { date: String(parsed.getFullYear()) + '-' + pad2(parsed.getMonth() + 1) + '-' + pad2(parsed.getDate()), matched: match[0] };`
- src/lib/ai-direct-write-guard.ts:132 [border-pill-card] selector=`` :: `return String(date.getFullYear()) + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()) + 'T' + pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':00';`
- src/lib/ai-draft-approval.ts:18 [border-pill-card] selector=`` :: `taskType: string;`
- src/lib/ai-draft-approval.ts:19 [border-pill-card] selector=`` :: `eventType: string;`
- src/lib/ai-followup.ts:5 [border-pill-card] selector=`` :: `tasks?: Record<string, unknown>[];`
- src/lib/ai-followup.ts:6 [border-pill-card] selector=`` :: `events?: Record<string, unknown>[];`
- src/lib/ai-next-action.ts:5 [border-pill-card] selector=`` :: `tasks?: Record<string, unknown>[];`
- src/lib/ai-next-action.ts:6 [border-pill-card] selector=`` :: `events?: Record<string, unknown>[];`
- src/lib/ai-usage-guard.ts:45 [border-pill-card] selector=`` :: `const month = String(now.getMonth() + 1).padStart(2, '0');`
- src/lib/calendar-items.ts:16 [border-pill-card] selector=`` :: `id: string;`
- src/lib/calendar-items.ts:17 [border-pill-card] selector=`` :: `title: string;`
- src/lib/calendar-items.ts:18 [border-pill-card] selector=`` :: `date: string;`
- src/lib/calendar-items.ts:19 [border-pill-card] selector=`` :: `dueAt?: string;`
- src/lib/calendar-items.ts:20 [border-pill-card] selector=`` :: `time?: string;`
- src/lib/calendar-items.ts:21 [border-pill-card] selector=`` :: `scheduledAt?: string;`
- src/lib/calendar-items.ts:22 [border-pill-card] selector=`` :: `startAt?: string;`
- src/lib/calendar-items.ts:23 [border-pill-card] selector=`` :: `startsAt?: string;`
- src/lib/calendar-items.ts:24 [border-pill-card] selector=`` :: `status: string;`
- src/lib/calendar-items.ts:25 [border-pill-card] selector=`` :: `type?: string;`
- src/lib/calendar-items.ts:26 [border-pill-card] selector=`` :: `priority?: string;`
- src/lib/calendar-items.ts:27 [border-pill-card] selector=`` :: `reminderAt?: string | null;`
- src/lib/calendar-items.ts:28 [border-pill-card] selector=`` :: `recurrenceRule?: string;`
- src/lib/calendar-items.ts:29 [border-pill-card] selector=`` :: `recurrenceEndType?: string;`
- src/lib/calendar-items.ts:30 [border-pill-card] selector=`` :: `recurrenceEndAt?: string | null;`
- src/lib/calendar-items.ts:32 [border-pill-card] selector=`` :: `recurrence?: Record<string, unknown>;`
- src/lib/calendar-items.ts:33 [border-pill-card] selector=`` :: `reminder?: Record<string, unknown>;`
- src/lib/calendar-items.ts:34 [border-pill-card] selector=`` :: `leadId?: string;`
- src/lib/calendar-items.ts:35 [border-pill-card] selector=`` :: `leadName?: string;`
- src/lib/calendar-items.ts:36 [border-pill-card] selector=`` :: `caseId?: string;`
- src/lib/calendar-items.ts:37 [border-pill-card] selector=`` :: `clientId?: string;`
- src/lib/calendar-items.ts:41 [border-pill-card] selector=`` :: `id: string;`
- src/lib/calendar-items.ts:42 [border-pill-card] selector=`` :: `title: string;`
- src/lib/calendar-items.ts:43 [border-pill-card] selector=`` :: `type: string;`
- src/lib/calendar-items.ts:44 [border-pill-card] selector=`` :: `startAt: string;`
- src/lib/calendar-items.ts:45 [border-pill-card] selector=`` :: `startsAt?: string;`
- src/lib/calendar-items.ts:46 [border-pill-card] selector=`` :: `scheduledAt?: string;`
- src/lib/calendar-items.ts:47 [border-pill-card] selector=`` :: `endAt?: string;`
- src/lib/calendar-items.ts:48 [border-pill-card] selector=`` :: `status: string;`
- src/lib/calendar-items.ts:49 [border-pill-card] selector=`` :: `leadId?: string;`
- src/lib/calendar-items.ts:50 [border-pill-card] selector=`` :: `leadName?: string;`
- src/lib/calendar-items.ts:51 [border-pill-card] selector=`` :: `caseId?: string;`
- src/lib/calendar-items.ts:52 [border-pill-card] selector=`` :: `clientId?: string;`
- src/lib/calendar-items.ts:53 [border-pill-card] selector=`` :: `reminderAt?: string | null;`
- src/lib/calendar-items.ts:54 [border-pill-card] selector=`` :: `recurrenceRule?: string;`
- src/lib/calendar-items.ts:55 [border-pill-card] selector=`` :: `recurrenceEndType?: string;`
- src/lib/calendar-items.ts:56 [border-pill-card] selector=`` :: `recurrenceEndAt?: string | null;`
- src/lib/calendar-items.ts:58 [border-pill-card] selector=`` :: `recurrence?: Record<string, unknown>;`
- src/lib/calendar-items.ts:59 [border-pill-card] selector=`` :: `reminder?: Record<string, unknown>;`
- src/lib/calendar-items.ts:65 [border-pill-card] selector=`` :: `leads: Record<string, unknown>[];`
- src/lib/calendar-items.ts:66 [border-pill-card] selector=`` :: `cases: Record<string, unknown>[];`
- src/lib/calendar-items.ts:81 [border-pill-card] selector=`` :: `const message = String(error instanceof Error ? error.message : error || '').toLowerCase();`
- src/lib/calendar-items.ts:108 [border-pill-card] selector=`` :: `function isIsoLike(value?: string | null) {`
- src/lib/calendar-items.ts:114 [border-pill-card] selector=`` :: `return typeof value === 'string' && value.trim() ? value.trim() : undefined;`
- src/lib/calendar-items.ts:117 [border-pill-card] selector=`` :: `function normalizeReminderMinutes(scheduledAt: string, reminderAt?: string | null) {`
- src/lib/calendar-items.ts:123 [border-pill-card] selector=`` :: `function normalizeRecurrenceObject(row: Record<string, unknown>, recurrenceRule?: string, recurrenceEndType?: string, recurrenceCount?: number | null) {`
- src/lib/calendar-items.ts:125 [border-pill-card] selector=`` :: `? (row.recurrence as Record<string, unknown>)`
- src/lib/calendar-items.ts:129 [border-pill-card] selector=`` :: `function normalizeReminderObject(row: Record<string, unknown>, scheduledAt: string, reminderAt?: string | null) {`
- src/lib/calendar-items.ts:130 [border-pill-card] selector=`` :: `if (row.reminderRule && typeof row.reminderRule === 'object') return row.reminderRule as Record<string, unknown>;`
- src/lib/calendar-items.ts:131 [border-pill-card] selector=`` :: `if (row.reminder && typeof row.reminder === 'object') return row.reminder as Record<string, unknown>;`
- src/lib/calendar-items.ts:137 [border-pill-card] selector=`` :: `function getRecurrenceMeta(row: Record<string, unknown>) {`
- src/lib/calendar-items.ts:148 [border-pill-card] selector=`` :: `export function normalizeCalendarTask(row: Record<string, unknown>): CalendarTaskItem | null {`
- src/lib/calendar-items.ts:166 [border-pill-card] selector=`` :: `priority: typeof row.priority === 'string' ? row.priority : undefined,`
- src/lib/calendar-items.ts:181 [border-pill-card] selector=`` :: `export function normalizeCalendarEvent(row: Record<string, unknown>): CalendarEventItem | null {`
- src/lib/calendar-items.ts:252 [border-pill-card] selector=`` :: `tasks: (taskItems as Record<string, unknown>[]).map(normalizeCalendarTask).filter((item): item is CalendarTaskItem => Boolean(item)),`
- src/lib/calendar-items.ts:253 [border-pill-card] selector=`` :: `events: (eventItems as Record<string, unknown>[]).map(normalizeCalendarEvent).filter((item): item is CalendarEventItem => Boolean(item)),`
- src/lib/calendar-items.ts:254 [border-pill-card] selector=`` :: `leads: leadItems as Record<string, unknown>[],`
- src/lib/calendar-items.ts:255 [border-pill-card] selector=`` :: `cases: caseItems as Record<string, unknown>[],`
- src/lib/data-contract.ts:275 [border-pill-card] selector=`` :: `eventType: string;`
- src/lib/domain-statuses.ts:142 [border-pill-card] selector=`` :: `const TASK_LEGACY_STATUS_MAP: Record<string, TaskStatus> = {`
- src/lib/domain-statuses.ts:149 [border-pill-card] selector=`` :: `const EVENT_LEGACY_STATUS_MAP: Record<string, EventStatus> = {`
- src/lib/domain-statuses.ts:248 [border-pill-card] selector=`` :: `export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {`
- src/lib/domain-statuses.ts:256 [border-pill-card] selector=`` :: `export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {`
- src/lib/google-calendar-reminder-preferences.ts:18 [border-pill-card] selector=`` :: `const raw = String(value || '').trim().toLowerCase();`
- src/lib/google-calendar-reminder-preferences.ts:26 [border-pill-card] selector=`` :: `: typeof value === 'string' && value.trim()`
- src/lib/google-calendar-reminder-preferences.ts:51 [border-pill-card] selector=`` :: `window.localStorage.setItem(GOOGLE_CALENDAR_REMINDER_MINUTES_STORAGE_KEY, String(minutesBefore));`
- src/lib/google-calendar-reminder-preferences.ts:54 [border-pill-card] selector=`` :: `export function applyGoogleCalendarReminderPreferenceToEventPayload<T extends Record<string, unknown>>(input: T): T {`
- src/lib/lead-case-handoff.ts:38 [border-pill-card] selector=`` :: `tasks?: Record<string, unknown>[];`
- src/lib/lead-case-handoff.ts:39 [border-pill-card] selector=`` :: `events?: Record<string, unknown>[];`
- src/lib/lead-case-handoff.ts:84 [border-pill-card] selector=`` :: `tasks: Record<string, unknown>[];`
- src/lib/lead-case-handoff.ts:85 [border-pill-card] selector=`` :: `events: Record<string, unknown>[];`
- src/lib/lead-finance.ts:26 [border-pill-card] selector=`` :: `const entry = input as Record<string, unknown>;`
- src/lib/lead-finance.ts:31 [border-pill-card] selector=`` :: `id: String(entry.id || 'payment-${fallbackIndex}'),`
- src/lib/lead-finance.ts:33 [border-pill-card] selector=`` :: `paidAt: typeof entry.paidAt === 'string' && entry.paidAt.trim() ? entry.paidAt : undefined,`
- src/lib/lead-finance.ts:34 [border-pill-card] selector=`` :: `createdAt: typeof entry.createdAt === 'string' && entry.createdAt.trim() ? entry.createdAt : new Date(0).toISOString(),`
- src/lib/notification-snooze.ts:30 [border-pill-card] selector=`` :: `function readSnoozeMap(): Record<string, NotificationSnoozeEntry> {`
- src/lib/notification-snooze.ts:38 [border-pill-card] selector=`` :: `return parsed as Record<string, NotificationSnoozeEntry>;`
- src/lib/notification-snooze.ts:44 [border-pill-card] selector=`` :: `function saveSnoozeMap(map: Record<string, NotificationSnoozeEntry>) {`
- src/lib/notification-snooze.ts:49 [border-pill-card] selector=`` :: `function pruneSnoozeMap(map: Record<string, NotificationSnoozeEntry>, now = new Date()) {`
- src/lib/notification-snooze.ts:50 [border-pill-card] selector=`` :: `const next: Record<string, NotificationSnoozeEntry> = {};`
- src/lib/options.ts:78 [border-pill-card] selector=`` :: `export function getScheduleEntryIcon(kind: 'event' | 'task' | 'lead', type?: string): LucideIcon {`
- src/lib/planned-actions.ts:38 [border-pill-card] selector=`` :: `function isOpenTaskStatus(status: string) {`
- src/lib/planned-actions.ts:42 [border-pill-card] selector=`` :: `function isOpenEventStatus(status: string) {`
- src/lib/quick-lead-parser.ts:117 [border-pill-card] selector=`` :: `const month = String(value.getMonth() + 1).padStart(2, '0');`
- src/lib/relation-value.ts:98 [border-pill-card] selector=`` :: `function upsertEntry(map: Map<string, RelationValueEntry>, entry: RelationValueEntry) {`
- src/lib/relation-value.ts:116 [border-pill-card] selector=`` :: `const map = new Map<string, RelationValueEntry>();`
- src/lib/relation-value.ts:178 [border-pill-card] selector=`` :: `/* buildRelationValueEntries buildRelationFunnelValue RELATION_FUNNEL_SUM_FROM_ACTIVE_LEADS_AND_CLIENTS clients?: Record<string, unknown>[] dealValue clientValue contractValue totalRevenue return buildRelationValueEntries({ leads, clients }).reduce((sum, entry`
- src/lib/schedule-conflicts.ts:47 [border-pill-card] selector=`` :: `|| (typeof task?.scheduledAt === 'string' && task.scheduledAt)`
- src/lib/schedule-conflicts.ts:48 [border-pill-card] selector=`` :: `|| (typeof task?.dueAt === 'string' && task.dueAt)`
- src/lib/schedule-conflicts.ts:49 [border-pill-card] selector=`` :: `|| (typeof task?.date === 'string' ? '${task.date}T09:00' : '')`
- src/lib/schedule-conflicts.ts:66 [border-pill-card] selector=`` :: `const caseId = typeof task?.caseId === 'string' ? task.caseId : task?.caseId ? String(task.caseId) : null;`
- src/lib/schedule-conflicts.ts:68 [border-pill-card] selector=`` :: `id: String(task.id),`
- src/lib/schedule-conflicts.ts:70 [border-pill-card] selector=`` :: `title: String(task?.title || 'Zadanie'),`
- src/lib/schedule-conflicts.ts:73 [border-pill-card] selector=`` :: `leadName: task?.leadName ? String(task.leadName) : '',`
- src/lib/schedule-conflicts.ts:84 [border-pill-card] selector=`` :: `const caseId = typeof event?.caseId === 'string' ? event.caseId : event?.caseId ? String(event.caseId) : null;`
- src/lib/schedule-conflicts.ts:86 [border-pill-card] selector=`` :: `id: String(event.id),`
- src/lib/schedule-conflicts.ts:88 [border-pill-card] selector=`` :: `title: String(event?.title || 'Wydarzenie'),`
- src/lib/schedule-conflicts.ts:91 [border-pill-card] selector=`` :: `leadName: event?.leadName ? String(event.leadName) : '',`
- src/lib/scheduling.ts:105 [border-pill-card] selector=`` :: `export function reminderRuleToReminderAtIso(startAt: string, rule: CalendarReminderRule | null): string | null {`
- src/lib/scheduling.ts:347 [border-pill-card] selector=`` :: `if (!event.startAt || typeof event.startAt !== 'string') return [] as ScheduleEntry[];`
- src/lib/scheduling.ts:349 [border-pill-card] selector=`` :: `return expandRecurringMoments(event.startAt, event.recurrence, rangeStart, rangeEnd).map((occurrence, index) => {`
- src/lib/scheduling.ts:350 [border-pill-card] selector=`` :: `const baseStart = parseISO(String(event.startAt));`
- src/lib/scheduling.ts:351 [border-pill-card] selector=`` :: `const baseEnd = typeof event.endAt === 'string' ? parseISO(event.endAt) : null;`
- src/lib/scheduling.ts:354 [border-pill-card] selector=`` :: `const eventId = String(event.id || crypto.randomUUID());`
- src/lib/scheduling.ts:357 [border-pill-card] selector=`` :: `id: eventId + ':' + String(index),`
- src/lib/scheduling.ts:365 [border-pill-card] selector=`` :: `leadId: typeof event.leadId === 'string' ? event.leadId : null,`
- src/lib/scheduling.ts:366 [border-pill-card] selector=`` :: `leadName: typeof event.leadName === 'string' ? event.leadName : null,`
- src/lib/scheduling.ts:386 [border-pill-card] selector=`` :: `const taskId = String(task.id || crypto.randomUUID());`
- src/lib/scheduling.ts:389 [border-pill-card] selector=`` :: `id: taskId + ':' + String(index),`
- src/lib/scheduling.ts:397 [border-pill-card] selector=`` :: `leadId: typeof task.leadId === 'string' ? task.leadId : null,`
- src/lib/scheduling.ts:398 [border-pill-card] selector=`` :: `leadName: typeof task.leadName === 'string' ? task.leadName : null,`
- src/lib/scheduling.ts:472 [border-pill-card] selector=`` :: `const deduped = new Map<string, ScheduleEntry>();`
- src/lib/scheduling.ts:504 [border-pill-card] selector=`` :: `const sameLead = Boolean(entry.leadId && leadEntry.leadId && String(entry.leadId) === String(leadEntry.leadId));`
- src/lib/scheduling.ts:512 [border-pill-card] selector=`` :: `function removeLeadShadowEntries(entries: ScheduleEntry[]) {`
- src/lib/scheduling.ts:570 [border-pill-card] selector=`` :: `const taskId = String(task.id || crypto.randomUUID());`
- src/lib/scheduling.ts:580 [border-pill-card] selector=`` :: `leadId: typeof task.leadId === 'string' ? task.leadId : null,`
- src/lib/scheduling.ts:581 [border-pill-card] selector=`` :: `leadName: typeof task.leadName === 'string' ? task.leadName : null,`
- src/lib/scheduling.ts:608 [border-pill-card] selector=`` :: `function buildOperatorTodayLeadEntry(lead: ScheduleRawRecord, moment: Date, reasonLabel: string): ScheduleEntry {`
- src/lib/scheduling.ts:688 [border-pill-card] selector=`` :: `if (entry.kind === 'event') return 'bg-indigo-50 text-indigo-700 border-indigo-100';`
- src/lib/scheduling.ts:689 [border-pill-card] selector=`` :: `if (entry.kind === 'task') return 'bg-emerald-50 text-emerald-700 border-emerald-100';`
- src/lib/supabase-fallback.ts:22 [border-pill-card] selector=`` :: `type TaskInsertInput = { title: string; type?: string; date?: string; scheduledAt?: string;`
- src/lib/supabase-fallback.ts:25 [border-pill-card] selector=`` :: `type EventInsertInput = { title: string; type?: string; startAt: string;`
- src/lib/supabase-fallback.ts:30 [border-pill-card] selector=`` :: `type ActivityInput = { id?: string; caseId?: string | null; leadId?: string | null; clientId?: string | null; ownerId?: string | null; actorId?: string | null; actorType?: string; eventType?: string; payload?: Record<string, unknown>; workspaceId?: string };`
- src/lib/supabase-fallback.ts:169 [border-pill-card] selector=`` :: `const apiGetCache = new Map<string, ApiCacheEntry>();`
- src/lib/supabase-fallback.ts:305 [border-pill-card] selector=`` :: `function filterCalendarRowsByActiveParentsForCascade(rows: Record<string, unknown>[], index: { archivedClientIds: Set<string>; archivedCaseIds: Set<string> }) {`
- src/lib/supabase-fallback.ts:380 [border-pill-card] selector=`` :: `export async function insertTaskToSupabase(input: TaskInsertInput) { return callApi<SupabaseInsertResult>('/api/tasks', { method: 'POST', body: JSON.stringify(input) }); }`
- src/lib/supabase-fallback.ts:381 [border-pill-card] selector=`` :: `export async function insertEventToSupabase(input: EventInsertInput) { return callApi<SupabaseInsertResult>('/api/events', { method: 'POST', body: JSON.stringify(applyGoogleCalendarReminderPreferenceToEventPayload(input as unknown as Record<string, unknown>)) `
- src/lib/supabase-fallback.ts:425 [border-pill-card] selector=`` :: `tasks: Record<string, unknown>[];`
- src/lib/supabase-fallback.ts:426 [border-pill-card] selector=`` :: `events: Record<string, unknown>[];`
- src/lib/supabase-fallback.ts:462 [border-pill-card] selector=`` :: `const normalizedTasks = normalizeTaskListContract(getDevPreviewData().tasks as Record<string, unknown>[]);`
- src/lib/supabase-fallback.ts:468 [border-pill-card] selector=`` :: `const normalizedTasks = await callApi<Record<string, unknown>[]>('/api/tasks').then(normalizeTaskListContract);`
- src/lib/supabase-fallback.ts:474 [border-pill-card] selector=`` :: `const normalizedEvents = normalizeEventListContract(getDevPreviewData().events as Record<string, unknown>[]);`
- src/lib/supabase-fallback.ts:480 [border-pill-card] selector=`` :: `const normalizedEvents = await callApi<Record<string, unknown>[]>('/api/events').then(normalizeEventListContract);`
- src/lib/supabase-fallback.ts:541 [border-pill-card] selector=`` :: `export async function insertPortalActivityToSupabase(input: { caseId: string; portalSession: string; eventType: string; payload?: Record<string, unknown> }) {`
- src/lib/supabase-fallback.ts:542 [border-pill-card] selector=`` :: `return callApi<Record<string, unknown>>('/api/activities', { method: 'POST', body: JSON.stringify({ caseId: input.caseId, portalSession: input.portalSession, actorType: 'client', eventType: input.eventType, payload: input.payload || {} }) });`

## Calendar render signals

- src/pages/Calendar.tsx:109 [month] `import '../styles/closeflow-calendar-month-chip-overlap-fix-v1.css';`
- src/pages/Calendar.tsx:110 [month] `import '../styles/closeflow-calendar-month-rows-no-overlap-repair2.css';`
- src/pages/Calendar.tsx:111 [month] `import '../styles/closeflow-calendar-month-entry-structural-fix-v3.css';`
- src/pages/Calendar.tsx:131 [month] `type CalendarView = 'week' | 'month';`
- src/pages/Calendar.tsx:144 [CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3, CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2] `const CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2 = 'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_MASSCHECK_2026_05_12';`
- src/pages/Calendar.tsx:294 [cf-entity-type-pill] `return 'cf-entity-type-pill';`
- src/pages/Calendar.tsx:389 [line-through] `const relationClass = 'truncate text-[12px] font-semibold ${isCompletedEntry ? 'text-slate-400 line-through' : 'text-slate-500'}';`
- src/pages/Calendar.tsx:396 [calendar-entry-card] `<div data-calendar-entry-completed={isCompletedEntry ? 'true' : undefined} className={'calendar-entry-card cf-readable-card ${isCompletedEntry ? 'calendar-entry-completed' : ''} rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:`
- src/pages/Calendar.tsx:405 [line-through, title=] `<p className={'truncate text-[14px] font-bold leading-5 ${isCompletedEntry ? 'text-slate-500 line-through' : 'text-slate-900'}'} title={entry.title}>`
- src/pages/Calendar.tsx:410 [title=] `<Link to={'/cases/${entry.raw.caseId}'} className={'${relationClass} transition hover:text-sky-700'} title={relationLabel}>`
- src/pages/Calendar.tsx:414 [title=] `<Link to={'/leads/${entry.raw.leadId}'} className={'${relationClass} transition hover:text-blue-700'} title={relationLabel}>`
- src/pages/Calendar.tsx:418 [title=] `<p className={relationClass} title={relationLabel}>{relationLabel}</p>`
- src/pages/Calendar.tsx:478 [calendarScale] `const [calendarScale, setCalendarScale] = useState<CalendarScale>('default');`
- src/pages/Calendar.tsx:543 [month] `if (forcedCalendarView === 'week' || forcedCalendarView === 'month') {`
- src/pages/Calendar.tsx:572 [month] `if (storedView === 'week' || storedView === 'month') {`
- src/pages/Calendar.tsx:579 [calendarScale] `window.localStorage.setItem(CALENDAR_SCALE_STORAGE_KEY, calendarScale);`
- src/pages/Calendar.tsx:581 [calendarScale] `}, [calendarScale]);`
- src/pages/Calendar.tsx:609 [querySelectorAll<HTMLElement>] `const contentCandidates = Array.from(scope.querySelectorAll<HTMLElement>([`
- src/pages/Calendar.tsx:610 [calendar-entry-card] `'.calendar-entry-card',`
- src/pages/Calendar.tsx:611 [calendar-entry-card] `'.calendar-entry-card *',`
- src/pages/Calendar.tsx:612 [month] `'[class*="month"] [class*="entry"]',`
- src/pages/Calendar.tsx:613 [month] `'[class*="month"] [class*="entry"] *',`
- src/pages/Calendar.tsx:614 [month] `'[class*="month"] [class*="item"]',`
- src/pages/Calendar.tsx:615 [month] `'[class*="month"] [class*="item"] *',`
- src/pages/Calendar.tsx:616 [month] `'[class*="month"] [class*="chip"]',`
- src/pages/Calendar.tsx:617 [month] `'[class*="month"] [class*="chip"] *',`
- src/pages/Calendar.tsx:645 [data-cf-calendar] `const row = node.closest('[data-cf-calendar-row-kind]') as HTMLElement | null;`
- src/pages/Calendar.tsx:663 [calendarScale] `}, [calendarView, calendarScale, currentMonth, selectedDate, events, tasks, leads, cases, clients, loading]);`
- src/pages/Calendar.tsx:666 [CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3, CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2] `// CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT:`
- src/pages/Calendar.tsx:667 [month] `// normalize compact month entries into stable one-row chips.`
- src/pages/Calendar.tsx:668 [calendarView !==, month] `if (calendarView !== 'month') return;`
- src/pages/Calendar.tsx:689 [querySelectorAll<HTMLElement>] `const candidates = Array.from(scope.querySelectorAll<HTMLElement>([`
- src/pages/Calendar.tsx:690 [month] `'[class*="month"] [class*="entry"]',`
- src/pages/Calendar.tsx:691 [month] `'[class*="month"] [class*="item"]',`
- src/pages/Calendar.tsx:692 [month] `'[class*="month"] [class*="chip"]',`
- src/pages/Calendar.tsx:693 [month] `'[class*="month"] [class*="event"]',`
- src/pages/Calendar.tsx:694 [month] `'[class*="month"] [class*="task"]',`
- src/pages/Calendar.tsx:699 [cf-month-entry-chip-structural, month] `if (candidate.classList.contains('cf-month-entry-chip-structural')) continue;`
- src/pages/Calendar.tsx:700 [cf-month-entry-chip-structural, month] `if (candidate.closest('.cf-month-entry-chip-structural')) continue;`
- src/pages/Calendar.tsx:705 [więcej] `if (/^\+\s*\d+\s*więcej$/i.test(fullText)) {`
- src/pages/Calendar.tsx:706 [month] `candidate.classList.add('cf-month-entry-more');`
- src/pages/Calendar.tsx:710 [querySelectorAll<HTMLElement>] `const labelNode = Array.from(candidate.querySelectorAll<HTMLElement>('span, strong, p, div, small, em, b'))`
- src/pages/Calendar.tsx:732 [line-through] `candidate.querySelector('[data-calendar-entry-completed="true"], .calendar-entry-completed, .line-through, [class*="line-through"], s, del')`
- src/pages/Calendar.tsx:735 [cf-month-entry-chip-structural, month] `candidate.classList.add('cf-month-entry-chip-structural');`
- src/pages/Calendar.tsx:742 [candidate.replaceChildren] `candidate.replaceChildren();`
- src/pages/Calendar.tsx:745 [cf-month-entry-chip-structural, month] `badge.className = 'cf-month-entry-chip-structural__badge';`
- src/pages/Calendar.tsx:749 [cf-month-entry-chip-structural, month] `title.className = 'cf-month-entry-chip-structural__title';`
- src/pages/Calendar.tsx:768 [calendarScale] `}, [calendarView, calendarScale, currentMonth, selectedDate, events, tasks, leads, cases, clients, loading]);`
- src/pages/Calendar.tsx:1052 [month] `const monthStart = startOfMonth(currentMonth);`
- src/pages/Calendar.tsx:1053 [month] `const monthEnd = endOfMonth(monthStart);`
- src/pages/Calendar.tsx:1054 [month] `const monthRangeStart = startOfWeek(monthStart, { weekStartsOn: 1 });`
- src/pages/Calendar.tsx:1055 [month] `const monthRangeEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });`
- src/pages/Calendar.tsx:1062 [month] `const calendarDataRangeEnd = rollingWeekEnd.getTime() > monthRangeEnd.getTime() ? rollingWeekEnd : monthRangeEnd;`
- src/pages/Calendar.tsx:1063 [month] `const calendarDays = eachDayOfInterval({ start: monthRangeStart, end: monthRangeEnd });`
- src/pages/Calendar.tsx:1068 [month] `rangeStart: monthRangeStart,`
- src/pages/Calendar.tsx:1095 [calendarScale, month] `const monthCellMinHeight = calendarScale === 'compact' ? 104 : calendarScale === 'large' ? 160 : 128;`
- src/pages/Calendar.tsx:1580 [month] `<button type="button" className={'seg-btn ${calendarView === 'month' ? 'active' : ''}'} onClick={() => setCalendarView('month')}>Miesiąc</button>`
- src/pages/Calendar.tsx:1584 [month] `{calendarView === 'month' ? (`
- src/pages/Calendar.tsx:1586 [calendarScale] `<button type="button" className={'seg-btn ${calendarScale === 'compact' ? 'active' : ''}'} onClick={() => setCalendarScale('compact')}>Małe kafelki</button>`
- src/pages/Calendar.tsx:1587 [calendarScale] `<button type="button" className={'seg-btn ${calendarScale === 'default' ? 'active' : ''}'} onClick={() => setCalendarScale('default')}>Standard</button>`
- src/pages/Calendar.tsx:1588 [calendarScale] `<button type="button" className={'seg-btn ${calendarScale === 'large' ? 'active' : ''}'} onClick={() => setCalendarScale('large')}>Duże kafelki</button>`
- src/pages/Calendar.tsx:1678 [month] `{calendarView === 'month' ? (`
- src/pages/Calendar.tsx:1686 [month] `<div className="calendar-month-grid">`
- src/pages/Calendar.tsx:1689 [month] `const isCurrentMonth = isSameMonth(day, monthStart);`
- src/pages/Calendar.tsx:1705 [month] `style={{ minHeight: monthCellMinHeight }}`
- src/pages/Calendar.tsx:1715 [calendarScale] `{dayEntries.slice(0, calendarScale === 'compact' ? 3 : 4).map((entry) => {`
- src/pages/Calendar.tsx:1722 [month] `className={'calendar-day-pill ${getEntryTone(entry)} ${isCompletedCalendarEntry(entry) ? 'calendar-entry-completed calendar-month-entry-completed' : ''} ${isCompletedCalendarEntry(entry) ? 'calendar-entry-completed calendar-month-entry-completed' : ''} ${isCom`
- src/pages/Calendar.tsx:1728 [title=] `title={entry.title}`
- src/pages/Calendar.tsx:1738 [calendarScale] `{dayEntries.length > (calendarScale === 'compact' ? 3 : 4) && (`
- src/pages/Calendar.tsx:1739 [calendarScale, więcej] `<div className="calendar-more">+ {dayEntries.length - (calendarScale === 'compact' ? 3 : 4)} więcej</div>`

## Następny pakiet wdrożeniowy

Cel: wymienić render miesiąca na plain text row. Nie CSS-overrides.

Docelowy DOM:

```tsx
<button className="cf-calendar-month-text-row" title={fullText}>
  <span className="cf-calendar-month-text-type" data-kind={kind}>{shortType}</span>
  <span className="cf-calendar-month-text-title">{text}</span>
</button>
```

Styl:

```css
.cf-calendar-month-text-row {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 18px;
  border: 0;
  background: transparent;
  overflow: hidden;
}
.cf-calendar-month-text-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```
