# CloseFlow UI Map Inventory v1

Generated: 2026-08-27T20:34:03.455Z

Scanner: **CLEAN_SCANNER_V4**

Status: **mapa/inwentaryzacja, nie refactor UI**. Ten plik ma pokazać, gdzie dziś żyją ikony, kafelki, sekcje, notatki, akcje i położenia. Dopiero po tej mapie wolno robić przepięcie na wspólne komponenty.

## Wynik skanowania

- Pliki przeskanowane: **446**
- Bezpośrednie importy ikon z lucide-react: **426**
- Użycia StatShortcutCard: **27**
- Lokalne implementacje InfoRow/InfoLine/StatCell/ActionButton: **3**
- Kontrakty akcji encji: **3**
- Dowody położenia/layoutu CSS: **800**

## Decyzja architektoniczna

Następny etap UI nie powinien naprawiać pojedynczych kolorów. Najpierw trzeba zatwierdzić mapę:

1. każda ikona standardowa ma dostać rolę semantyczną,
2. każdy kafelek/metrika ma zostać przypisana do wspólnego typu,
3. każda sekcja detail view ma dostać data-ui-region,
4. LeadDetail i ClientDetail mają mieć wspólny układ regionów,
5. dopiero później przepinamy kod na SemanticIcon, EntityInfoRow, EntityNoteCard i EntityDetailShell.

## Mapa ikon według roli

| Rola | Liczba importów | Przykłady |
|---|---:|---|
| add | 13 | Plus (src/components/GlobalQuickActions.tsx:3, użycia: 1)<br>Plus (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>Plus (src/pages/CaseDetail.tsx:22, użycia: 4)<br>Plus (src/pages/Cases.tsx:17, użycia: 2)<br>Plus (src/pages/ClientDetail.tsx:10, użycia: 2)<br>Plus (src/pages/Clients.tsx:17, użycia: 1)<br>Plus (src/pages/Dashboard.tsx:3, użycia: 1)<br>Plus (src/pages/LeadDetail.tsx:49, użycia: 5)<br>Plus (src/pages/Leads.tsx:16, użycia: 2)<br>Plus (src/pages/ResponseTemplates.tsx:2, użycia: 1)<br>Plus (src/pages/Templates.tsx:2, użycia: 3)<br>Plus (src/pages/Today.tsx:3, użycia: 0) |
| ai | 1 | Sparkles (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| auth | 7 | LogOut (src/components/EmailVerificationGate.tsx:2, użycia: 1)<br>LogOut (src/components/Layout.tsx:10, użycia: 2)<br>LogOut (src/pages/Dashboard.tsx:3, użycia: 1)<br>LogIn (src/pages/Login.tsx:3, użycia: 2)<br>LogOut (src/pages/Settings.tsx:2, użycia: 1)<br>LogIn (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0)<br>LogOut (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| case | 3 | Briefcase (src/components/Layout.tsx:10, użycia: 0)<br>Briefcase (src/components/ui-system/icon-registry.ts:2, użycia: 0)<br>Briefcase (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| close | 13 | X (src/components/Layout.tsx:10, użycia: 1)<br>X (src/components/PwaInstallPrompt.tsx:2, użycia: 1)<br>X (src/components/ui/dialog.tsx:5, użycia: 1)<br>OctagonXIcon (src/components/ui/sonner.tsx:5, użycia: 1)<br>X (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>X (src/components/ui-system/icon-registry.ts:2, użycia: 0)<br>X (src/pages/CaseDetail.tsx:22, użycia: 0)<br>X (src/pages/Cases.tsx:17, użycia: 0)<br>X (src/pages/ClientPortal.tsx:3, użycia: 1)<br>X (src/pages/Dashboard.tsx:3, użycia: 0)<br>X (src/pages/Leads.tsx:16, użycia: 6)<br>X (src/server/_portal-token.ts:1, użycia: 0) |
| company_property | 6 | Building2 (src/components/entity-contact-card.tsx:2, użycia: 0)<br>Home (src/components/Layout.tsx:10, użycia: 0)<br>Building2 (src/pages/LeadDetail.tsx:49, użycia: 3)<br>Building2 (src/pages/Leads.tsx:16, użycia: 1)<br>Building2 (src/pages/Settings.tsx:2, użycia: 0)<br>Building2 (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| copy | 14 | Copy (src/components/admin-tools/AdminDebugToolbar.tsx:2, użycia: 0)<br>Copy (src/components/entity-contact-card.tsx:2, użycia: 1)<br>ClipboardList (src/components/GlobalQuickActions.tsx:3, użycia: 2)<br>Copy (src/components/LeadAiFollowupDraft.tsx:2, użycia: 1)<br>ClipboardList (src/components/LeadAiNextAction.tsx:2, użycia: 1)<br>Copy (src/components/LeadAiNextAction.tsx:2, użycia: 1)<br>ClipboardList (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>Copy (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>ClipboardList (src/components/ui-system/icon-registry.ts:2, użycia: 0)<br>Clipboard (src/pages/AiDrafts.tsx:2, użycia: 0)<br>Copy (src/pages/CaseDetail.tsx:22, użycia: 0)<br>Copy (src/pages/ResponseTemplates.tsx:2, użycia: 2) |
| delete | 1 | Trash2 (src/components/ui-system/action-icon-registry.ts:1, użycia: 0) |
| edit | 6 | Pencil (src/components/ActivityRoadmap.tsx:2, użycia: 0)<br>Pencil (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>Pencil (src/pages/AiDrafts.tsx:2, użycia: 0)<br>Pencil (src/pages/ClientDetail.tsx:10, użycia: 2)<br>Edit2 (src/pages/LeadDetail.tsx:49, użycia: 3)<br>Pencil (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| email | 10 | MailCheck (src/components/EmailVerificationGate.tsx:2, użycia: 1)<br>Mail (src/components/entity-contact-card.tsx:2, użycia: 0)<br>Mail (src/pages/LeadDetail.tsx:49, użycia: 2)<br>Mail (src/pages/Leads.tsx:16, użycia: 1)<br>Mail (src/pages/Login.tsx:3, użycia: 2)<br>Mail (src/pages/NotificationsCenter.tsx:9, użycia: 1)<br>Mail (src/pages/PublicLanding.tsx:2, użycia: 0)<br>Mail (src/pages/Settings.tsx:2, użycia: 1)<br>Mail (src/pages/SupportCenter.tsx:2, użycia: 1)<br>Mail (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| event | 20 | CalendarClock (src/components/ActivityRoadmap.tsx:2, użycia: 0)<br>CalendarClock (src/components/CaseQuickActions.tsx:1, użycia: 1)<br>Calendar (src/components/Layout.tsx:10, użycia: 0)<br>Calendar (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>Calendar (src/components/ui-system/icon-registry.ts:2, użycia: 0)<br>CalendarDays (src/components/work-item-card.tsx:1, użycia: 0)<br>Calendar (src/lib/calendar-items.ts:1, użycia: 0)<br>CalendarClock (src/pages/Activity.tsx:3, użycia: 0)<br>CalendarClock (src/pages/AiDrafts.tsx:2, użycia: 0)<br>CalendarClock (src/pages/Billing.tsx:2, użycia: 0)<br>CalendarClock (src/pages/CaseDetail.tsx:22, użycia: 3)<br>CalendarDays (src/pages/LeadDetail.tsx:49, użycia: 4) |
| filter | 7 | Filter (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>Filter (src/pages/Activity.tsx:3, użycia: 1)<br>Filter (src/pages/Dashboard.tsx:3, użycia: 1)<br>Filter (src/pages/Leads.tsx:16, użycia: 1)<br>Filter (src/pages/NotificationsCenter.tsx:9, użycia: 1)<br>Filter (src/pages/SalesFunnel.tsx:3, użycia: 1)<br>Filter (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| finance | 11 | CircleDollarSign (src/components/ActivityRoadmap.tsx:2, użycia: 0)<br>CreditCard (src/components/Layout.tsx:10, użycia: 0)<br>BadgeDollarSign (src/components/ui-system/icon-registry.ts:2, użycia: 0)<br>CreditCard (src/components/ui-system/icon-registry.ts:2, użycia: 0)<br>Wallet (src/components/ui-system/icon-registry.ts:2, użycia: 0)<br>Wallet (src/lib/source-of-truth/icon-registry.ts:1, użycia: 0)<br>DollarSign (src/pages/LeadDetail.tsx:49, użycia: 3)<br>Wallet (src/pages/Leads.tsx:16, użycia: 0)<br>WalletCards (src/pages/Settings.tsx:2, użycia: 0)<br>DollarSign (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0)<br>Wallet (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| goal | 4 | Target (src/components/ui-system/icon-registry.ts:2, użycia: 0)<br>Target (src/pages/SalesFunnel.tsx:3, użycia: 2)<br>Target (src/pages/TodayStable.tsx:3, użycia: 2)<br>Target (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| loading | 30 | Loader2 (src/components/ContextNoteDialog.tsx:2, użycia: 1)<br>Loader2 (src/components/EmailVerificationGate.tsx:2, użycia: 3)<br>Loader2 (src/components/EventCreateDialog.tsx:2, użycia: 1)<br>Loader2 (src/components/LeadAiFollowupDraft.tsx:2, użycia: 1)<br>Loader2 (src/components/LeadAiNextAction.tsx:2, użycia: 2)<br>Loader2 (src/components/quick-lead/QuickLeadCaptureModal.tsx:2, użycia: 2)<br>Loader2 (src/components/QuickAiCapture.tsx:2, użycia: 1)<br>Loader2 (src/components/TaskCreateDialog.tsx:2, użycia: 1)<br>Loader2Icon (src/components/ui/sonner.tsx:5, użycia: 1)<br>Loader2 (src/components/work-item-card.tsx:1, użycia: 1)<br>Loader2 (src/pages/Activity.tsx:3, użycia: 1)<br>Loader2 (src/pages/AiDrafts.tsx:2, użycia: 1) |
| navigation | 38 | ChevronDown (src/components/GlobalQuickActions.tsx:3, użycia: 1)<br>ChevronRight (src/components/Layout.tsx:10, użycia: 1)<br>ChevronLeft (src/components/sidebar-mini-calendar.tsx:3, użycia: 1)<br>ChevronRight (src/components/sidebar-mini-calendar.tsx:3, użycia: 1)<br>ChevronRight (src/components/ui/dropdown-menu.tsx:3, użycia: 1)<br>ChevronDownIcon (src/components/ui/select.tsx:5, użycia: 2)<br>ChevronUpIcon (src/components/ui/select.tsx:5, użycia: 1)<br>ArrowLeft (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>ExternalLink (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>ArrowRight (src/components/work-item-card.tsx:1, użycia: 1)<br>ArrowUpRight (src/pages/Activity.tsx:3, użycia: 1)<br>ArrowRight (src/pages/Billing.tsx:2, użycia: 1) |
| note | 13 | FileCheck2 (src/components/ActivityRoadmap.tsx:2, użycia: 0)<br>FileText (src/components/ActivityRoadmap.tsx:2, użycia: 0)<br>StickyNote (src/components/ActivityRoadmap.tsx:2, użycia: 0)<br>FileWarning (src/components/CaseQuickActions.tsx:1, użycia: 1)<br>StickyNote (src/components/CaseQuickActions.tsx:1, użycia: 1)<br>MessageSquareText (src/components/Layout.tsx:10, użycia: 0)<br>StickyNote (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>FileText (src/components/ui-system/icon-registry.ts:2, użycia: 0)<br>StickyNote (src/pages/CaseDetail.tsx:22, użycia: 5)<br>FileText (src/pages/Cases.tsx:17, użycia: 0)<br>FileText (src/pages/PublicLanding.tsx:2, użycia: 1)<br>MessageSquareText (src/pages/ResponseTemplates.tsx:2, użycia: 1) |
| notification | 4 | Bell (src/components/Layout.tsx:10, użycia: 0)<br>Bell (src/components/ui-system/icon-registry.ts:2, użycia: 0)<br>BellRing (src/pages/PublicLanding.tsx:2, użycia: 0)<br>Bell (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| person | 11 | Users (src/components/Layout.tsx:10, użycia: 0)<br>UserRound (src/components/ui-system/icon-registry.ts:2, użycia: 0)<br>Users (src/lib/source-of-truth/icon-registry.ts:1, użycia: 0)<br>Users (src/pages/Dashboard.tsx:3, użycia: 2)<br>UserRound (src/pages/LeadDetail.tsx:49, użycia: 1)<br>UserRound (src/pages/Leads.tsx:16, użycia: 2)<br>User (src/pages/Login.tsx:3, użycia: 1)<br>Users (src/pages/PublicLanding.tsx:2, użycia: 0)<br>User (src/pages/Settings.tsx:2, użycia: 2)<br>Users (src/pages/Settings.tsx:2, użycia: 0)<br>UserRound (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| phone | 6 | Phone (src/components/entity-contact-card.tsx:2, użycia: 0)<br>Smartphone (src/components/PwaInstallPrompt.tsx:2, użycia: 1)<br>Phone (src/pages/LeadDetail.tsx:49, użycia: 4)<br>PhoneCall (src/pages/Leads.tsx:16, użycia: 1)<br>Smartphone (src/pages/Settings.tsx:2, użycia: 1)<br>Phone (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| pin | 2 | Pin (src/pages/ClientDetail.tsx:10, użycia: 1)<br>Pin (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| refresh | 15 | RefreshCcw (src/components/EmailVerificationGate.tsx:2, użycia: 1)<br>RefreshCw (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>RotateCcw (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>RefreshCw (src/pages/AdminAiSettings.tsx:2, użycia: 0)<br>RefreshCw (src/pages/Billing.tsx:2, użycia: 1)<br>RotateCcw (src/pages/Clients.tsx:17, użycia: 2)<br>RefreshCw (src/pages/Leads.tsx:16, użycia: 2)<br>RotateCcw (src/pages/Leads.tsx:16, użycia: 3)<br>RotateCcw (src/pages/NotificationsCenter.tsx:9, użycia: 2)<br>RefreshCw (src/pages/SalesFunnel.tsx:3, użycia: 1)<br>RefreshCw (src/pages/Settings.tsx:2, użycia: 2)<br>RefreshCcw (src/pages/TasksStable.tsx:3, użycia: 1) |
| risk_alert | 25 | AlertTriangle (src/components/detail/MissingItemsManagerDialog.tsx:16, użycia: 1)<br>AlertTriangle (src/components/EntityConflictDialog.tsx:1, użycia: 1)<br>AlertTriangle (src/components/Layout.tsx:10, użycia: 1)<br>TriangleAlertIcon (src/components/ui/sonner.tsx:5, użycia: 1)<br>AlertTriangle (src/pages/AdminAiSettings.tsx:2, użycia: 1)<br>AlertTriangle (src/pages/AiDrafts.tsx:2, użycia: 1)<br>AlertTriangle (src/pages/Billing.tsx:2, użycia: 1)<br>AlertCircle (src/pages/CaseDetail.tsx:22, użycia: 2)<br>AlertTriangle (src/pages/Cases.tsx:17, użycia: 0)<br>AlertTriangle (src/pages/ClientDetail.tsx:10, użycia: 3)<br>AlertCircle (src/pages/ClientPortal.tsx:3, użycia: 2)<br>AlertTriangle (src/pages/Clients.tsx:17, użycia: 0) |
| search | 14 | Search (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>Search (src/pages/Activity.tsx:3, użycia: 1)<br>Search (src/pages/AiDrafts.tsx:2, użycia: 1)<br>Search (src/pages/Cases.tsx:17, użycia: 1)<br>Search (src/pages/Clients.tsx:17, użycia: 1)<br>Search (src/pages/Dashboard.tsx:3, użycia: 2)<br>Search (src/pages/Leads.tsx:16, użycia: 1)<br>Search (src/pages/NotificationsCenter.tsx:9, użycia: 1)<br>Search (src/pages/ResponseTemplates.tsx:2, użycia: 1)<br>Search (src/pages/SupportCenter.tsx:2, użycia: 2)<br>Search (src/pages/Tasks.tsx:3, użycia: 2)<br>Search (src/pages/TasksStable.tsx:3, użycia: 1) |
| send | 4 | Send (src/components/EmailVerificationGate.tsx:2, użycia: 1)<br>Send (src/pages/CaseDetail.tsx:22, użycia: 0)<br>Send (src/pages/SupportCenter.tsx:2, użycia: 2)<br>Send (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| settings | 9 | Settings (src/components/Layout.tsx:10, użycia: 0)<br>Settings (src/components/ui-system/action-icon-registry.ts:1, użycia: 0)<br>Settings (src/components/ui-system/icon-registry.ts:2, użycia: 0)<br>Settings (src/pages/Dashboard.tsx:3, użycia: 1)<br>Settings2 (src/pages/NotificationsCenter.tsx:9, użycia: 1)<br>Settings (src/pages/Settings.tsx:2, użycia: 0)<br>SlidersHorizontal (src/pages/Settings.tsx:2, użycia: 1)<br>SlidersHorizontal (src/pages/TodayStable.tsx:3, użycia: 1)<br>Settings (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |
| task_status | 47 | CheckCircle2 (src/components/ActivityRoadmap.tsx:2, użycia: 0)<br>ListChecks (src/components/ActivityRoadmap.tsx:2, użycia: 0)<br>ListChecks (src/components/CaseQuickActions.tsx:1, użycia: 1)<br>CheckCircle2 (src/components/Layout.tsx:10, użycia: 1)<br>CheckSquare (src/components/Layout.tsx:10, użycia: 0)<br>Check (src/components/lead-picker.tsx:2, użycia: 1)<br>CheckCircle2 (src/components/LeadAiFollowupDraft.tsx:2, użycia: 1)<br>CheckCircle2 (src/components/LeadAiNextAction.tsx:2, użycia: 1)<br>Check (src/components/topic-contact-picker.tsx:2, użycia: 1)<br>CheckIcon (src/components/ui/checkbox.tsx:6, użycia: 1)<br>Check (src/components/ui/dropdown-menu.tsx:3, użycia: 1)<br>CheckIcon (src/components/ui/select.tsx:5, użycia: 1) |
| time | 16 | Clock (src/pages/Activity.tsx:3, użycia: 0)<br>Clock (src/pages/AiDrafts.tsx:2, użycia: 1)<br>Clock (src/pages/CaseDetail.tsx:22, użycia: 1)<br>Clock (src/pages/Cases.tsx:17, użycia: 0)<br>Clock (src/pages/ClientDetail.tsx:10, użycia: 2)<br>Clock (src/pages/ClientPortal.tsx:3, użycia: 1)<br>Clock (src/pages/Dashboard.tsx:3, użycia: 1)<br>Clock (src/pages/LeadDetail.tsx:49, użycia: 10)<br>Clock3 (src/pages/Leads.tsx:16, użycia: 3)<br>Clock3 (src/pages/NotificationsCenter.tsx:9, użycia: 1)<br>Clock3 (src/pages/SupportCenter.tsx:2, użycia: 1)<br>Clock (src/pages/Tasks.tsx:3, użycia: 0) |
| unclassified | 74 | FolderKanban (src/components/Layout.tsx:10, użycia: 0)<br>History (src/components/Layout.tsx:10, użycia: 0)<br>LifeBuoy (src/components/Layout.tsx:10, użycia: 0)<br>Menu (src/components/Layout.tsx:10, użycia: 1)<br>MessageSquare (src/components/LeadAiFollowupDraft.tsx:2, użycia: 1)<br>Download (src/components/PwaInstallPrompt.tsx:2, użycia: 1)<br>Mic (src/components/quick-lead/QuickLeadCaptureModal.tsx:2, użycia: 1)<br>Wand2 (src/components/quick-lead/QuickLeadCaptureModal.tsx:2, użycia: 1)<br>Mic (src/components/QuickAiCapture.tsx:2, użycia: 1)<br>MicOff (src/components/QuickAiCapture.tsx:2, użycia: 1)<br>Circle (src/components/ui/dropdown-menu.tsx:3, użycia: 1)<br>InfoIcon (src/components/ui/sonner.tsx:5, użycia: 1) |
| view | 2 | Eye (src/pages/ClientDetail.tsx:10, użycia: 1)<br>Eye (src/ui-system/icons/SemanticIcon.tsx:6, użycia: 0) |

## Użycia kafelków / StatShortcutCard

| Plik | Linia | Fragment |
|---|---:|---|
| src/pages/Activity.tsx | 298 | <StatShortcutCard label="Wszystkie" value={metrics.all} icon={TemplateEntityIcon} active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} iconClassName="cf-activity-metric-icon cf-activity-metric-icon-all" /><br>          <StatShortcutCard label="Dzisiaj" value={metrics.today} icon={Clock} active={activeFilter === 'today'} onClick={() => setActiveFilter('today')} iconClassName="cf-activity-metric-icon cf- |
| src/pages/Activity.tsx | 299 | <StatShortcutCard label="Dzisiaj" value={metrics.today} icon={Clock} active={activeFilter === 'today'} onClick={() => setActiveFilter('today')} iconClassName="cf-activity-metric-icon cf-activity-metric-icon-today" valueClassName="cf-activity-metric-value-today" /><br>          <StatShortcutCard label="Leady" value={metrics.leads} icon={LeadEntityIcon} active={activeFilter === 'lead'} onClick={() => setActiveFilter('lead |
| src/pages/Activity.tsx | 300 | <StatShortcutCard label="Leady" value={metrics.leads} icon={LeadEntityIcon} active={activeFilter === 'lead'} onClick={() => setActiveFilter('lead')} iconClassName="cf-activity-metric-icon cf-activity-metric-icon-lead" valueClassName="cf-activity-metric-value-lead" /><br>          <StatShortcutCard label="Sprawy" value={metrics.cases} icon={CaseEntityIcon} active={activeFilter === 'case'} onClick={() => setActiveFilter(' |
| src/pages/Activity.tsx | 301 | <StatShortcutCard label="Sprawy" value={metrics.cases} icon={CaseEntityIcon} active={activeFilter === 'case'} onClick={() => setActiveFilter('case')} iconClassName="cf-activity-metric-icon cf-activity-metric-icon-case" valueClassName="cf-activity-metric-value-case" /><br>          <StatShortcutCard label="Zadania" value={metrics.tasks} icon={ListChecks} active={activeFilter === 'task'} onClick={() => setActiveFilter('ta |
| src/pages/Activity.tsx | 302 | <StatShortcutCard label="Zadania" value={metrics.tasks} icon={ListChecks} active={activeFilter === 'task'} onClick={() => setActiveFilter('task')} iconClassName="cf-activity-metric-icon cf-activity-metric-icon-task" valueClassName="cf-activity-metric-value-task" /><br>          <StatShortcutCard label="Wymaga uwagi" value={metrics.attention} icon={NotificationEntityIcon} active={activeFilter === 'attention'} onClick={() |
| src/pages/Activity.tsx | 303 | <StatShortcutCard label="Wymaga uwagi" value={metrics.attention} icon={NotificationEntityIcon} active={activeFilter === 'attention'} onClick={() => setActiveFilter('attention')} tone="red" /><br>        </section><br><br>        <div className="activity-vnext-shell"><br>          <section className="activity-main-column"><br>            <div className="activity-toolbar-card"><br>              <div className="activity-filter-pills" ari |
| src/pages/Cases.tsx | 749 | <StatShortcutCard<br>            label="Otwarte sprawy"<br>            value={stats.open}<br>            icon={FileText}<br>            tone="blue"<br>            active={caseView === 'open'}<br>            onClick={() => setCaseViewStage231B0R9('open')}<br>          /><br>          <StatShortcutCard<br>            label="Czeka na klienta"<br>            value={stats.waiting}<br>            icon={Clock} |
| src/pages/Cases.tsx | 757 | <StatShortcutCard<br>            label="Czeka na klienta"<br>            value={stats.waiting}<br>            icon={Clock}<br>            tone="amber"<br>            active={caseView === 'waiting' \|\| caseView === 'approval'}<br>            onClick={() => toggleCaseView('waiting')}<br>          /><br>          <StatShortcutCard<br>            label="Zablokowane"<br>            value={stats.blocked}<br>            icon={AlertTriangle} |
| src/pages/Cases.tsx | 765 | <StatShortcutCard<br>            label="Zablokowane"<br>            value={stats.blocked}<br>            icon={AlertTriangle}<br>            tone="red"<br>            active={caseView === 'blocked'}<br>            onClick={() => toggleCaseView('blocked')}<br>          /><br>          <StatShortcutCard<br>            label="Gotowe"<br>            value={stats.ready}<br>            icon={CheckCircle2} |
| src/pages/Cases.tsx | 773 | <StatShortcutCard<br>            label="Gotowe"<br>            value={stats.ready}<br>            icon={CheckCircle2}<br>            tone="green"<br>            active={caseView === 'ready'}<br>            onClick={() => toggleCaseView('ready')}<br>          /><br>        </div><br><br>        <div className="layout-list"><br>          <div className="stack"> |
| src/pages/Clients.tsx | 988 | <StatShortcutCard<br>            label="Aktywni"<br>            value={activeCount}<br>            icon={LeadEntityIcon}<br>            active={clientRelationFilterStage232C === 'all'}<br>            onClick={() => applyClientRelationFilterStage232C('all')}<br>            title="Pokaż aktywnych klientów"<br>            ariaLabel="Pokaż aktywnych klientów"<br>            tone="blue"<br>            helper="niearchiwalni klienci"<br>          /><br>    |
| src/pages/Clients.tsx | 999 | <StatShortcutCard<br>            label="Bez sprawy"<br>            value={clientsWithoutCases}<br>            icon={CaseEntityIcon}<br>            active={clientRelationFilterStage232C === 'without_case'}<br>            onClick={() => applyClientRelationFilterStage232C('without_case')}<br>            title="Pokaż klientów bez sprawy"<br>            ariaLabel="Pokaż klientów bez sprawy"<br>            tone="neutral"<br>            helper="tylko |
| src/pages/Clients.tsx | 1010 | <StatShortcutCard<br>            label="Prowizja"<br>            value={formatClientMoney(activeCommissionValueStage232C)}<br>            icon={PaymentEntityIcon}<br>            active={clientRelationFilterStage232C === 'active_commission'}<br>            onClick={() => applyClientRelationFilterStage232C('active_commission')}<br>            title="Pokaż prowizję relacji"<br>            ariaLabel="Pokaż prowizję relacji"<br>            tone= |
| src/pages/Clients.tsx | 1021 | <StatShortcutCard<br>            label="Wymaga kontaktu"<br>            value={staleClients}<br>            icon={AlertTriangle}<br>            active={clientRelationFilterStage232C === 'needs_contact'}<br>            onClick={() => applyClientRelationFilterStage232C('needs_contact')}<br>            title="Pokaż klientów bez ruchu"<br>            ariaLabel="Pokaż klientów bez ruchu"<br>            tone="red"<br>            helper="do sprawdzen |
| src/pages/Leads.tsx | 1966 | <StatShortcutCard<br>              label="Wszystkie"<br>              value={stats.total}<br>              icon={LeadEntityIcon}<br>              active={quickFilter === 'all' && !valueSortEnabled && !showTrash}<br>              onClick={() => { setShowTrash(false); setQuickFilter('all'); setRiskFilter('all'); setValueSortEnabled(false); }}<br>              title="Pokaż wszystkie leady"<br>              ariaLabel="Pokaż wszystkie leady"<br> |
| src/pages/Leads.tsx | 1977 | <StatShortcutCard<br>              label="Aktywne"<br>              value={stats.active}<br>              icon={Activity}<br>              active={quickFilter === 'active' && !showTrash}<br>              onClick={() => toggleQuickFilter('active')}<br>              title="Pokaż aktywne leady"<br>              ariaLabel="Pokaż aktywne leady"<br>              valueClassName="text-slate-900"<br>              iconClassName="bg-blue-50 text-blue-500 |
| src/pages/Leads.tsx | 1990 | <StatShortcutCard<br>              label="Wartość"<br>              value={`${stats.value.toLocaleString('pl-PL')} PLN`}<br>              icon={Wallet}<br>              active={valueSortEnabled && !showTrash}<br>              onClick={toggleValueSorting}<br>              title="Sortuj leady po wartości"<br>              ariaLabel="Sortuj leady po wartości"<br>              helper={valueSortEnabled ? 'Sortowanie aktywne' : 'Suma wartości akt |
| src/pages/Leads.tsx | 2001 | <StatShortcutCard<br>              label="Zagrożone"<br>              value={stats.atRisk}<br>              icon={AlertTriangle}<br>              active={quickFilter === 'at-risk' && !showTrash}<br>              onClick={() => toggleQuickFilter('at-risk')}<br>              title="Pokaż zagrożone leady"<br>              ariaLabel="Pokaż zagrożone leady"<br>              tone="risk"<br>              helper={riskView ? `${stats.atRisk} ${stats.at |
| src/pages/ResponseTemplates.tsx | 202 | <StatShortcutCard label="Szablony" value={stats.total} icon={AiEntityIcon} iconClassName="app-primary-chip" valueClassName="app-text" /><br>          <StatShortcutCard label="Kategorie" value={stats.categories} icon={MessageSquareText} iconClassName="bg-indigo-500/12 text-indigo-600" valueClassName="app-text" /><br>          <StatShortcutCard label="Tagi" value={stats.tags} icon={Tags} iconClassName="bg-amber-500/12 text-a |
| src/pages/ResponseTemplates.tsx | 203 | <StatShortcutCard label="Kategorie" value={stats.categories} icon={MessageSquareText} iconClassName="bg-indigo-500/12 text-indigo-600" valueClassName="app-text" /><br>          <StatShortcutCard label="Tagi" value={stats.tags} icon={Tags} iconClassName="bg-amber-500/12 text-amber-600" valueClassName="text-amber-600" /><br>          <StatShortcutCard label="Zmienne" value={stats.withVariables} icon={Copy} iconClassName="bg- |
| src/pages/ResponseTemplates.tsx | 204 | <StatShortcutCard label="Tagi" value={stats.tags} icon={Tags} iconClassName="bg-amber-500/12 text-amber-600" valueClassName="text-amber-600" /><br>          <StatShortcutCard label="Zmienne" value={stats.withVariables} icon={Copy} iconClassName="bg-emerald-500/12 text-emerald-600" valueClassName="text-emerald-600" /><br>        </section><br><br>        <Card className="cf-readable-card border-none app-surface-strong app-shadow" |
| src/pages/ResponseTemplates.tsx | 205 | <StatShortcutCard label="Zmienne" value={stats.withVariables} icon={Copy} iconClassName="bg-emerald-500/12 text-emerald-600" valueClassName="text-emerald-600" /><br>        </section><br><br>        <Card className="cf-readable-card border-none app-surface-strong app-shadow"><br>          <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between"><br>            <div className="relative flex-1 c |
| src/pages/Tasks.tsx | 1461 | <StatShortcutCard<br>              key={stat.id}<br>              label={stat.title}<br>              value={stat.value}<br>              icon={stat.icon}<br>              active={taskScope === stat.id}<br>              onClick={() => activateScope(stat.id)}<br>              tone={stat.tone}<br>              title={`Pokaż: ${stat.title.toLowerCase()}`}<br>            /><br>          ))}<br>        </div> |
| src/pages/Templates.tsx | 76 | <StatShortcutCard label="Szablony" value={stats.totalTemplates} icon={AiEntityIcon} iconClassName="bg-emerald-50 text-emerald-700" /><br>      <StatShortcutCard label="Pozycje" value={stats.totalItems} icon={TemplateEntityIcon} iconClassName="bg-indigo-50 text-indigo-700" /><br>      <StatShortcutCard label="Obowiązkowe" value={stats.requiredItems} icon={AlertTriangle} iconClassName="bg-amber-50 text-amber-700" valueClassN |
| src/pages/Templates.tsx | 77 | <StatShortcutCard label="Pozycje" value={stats.totalItems} icon={TemplateEntityIcon} iconClassName="bg-indigo-50 text-indigo-700" /><br>      <StatShortcutCard label="Obowiązkowe" value={stats.requiredItems} icon={AlertTriangle} iconClassName="bg-amber-50 text-amber-700" valueClassName="text-amber-600" /><br>      <StatShortcutCard label="Akceptacje" value={stats.decisionItems} icon={CheckCircle2} iconClassName="bg-emerald |
| src/pages/Templates.tsx | 78 | <StatShortcutCard label="Obowiązkowe" value={stats.requiredItems} icon={AlertTriangle} iconClassName="bg-amber-50 text-amber-700" valueClassName="text-amber-600" /><br>      <StatShortcutCard label="Akceptacje" value={stats.decisionItems} icon={CheckCircle2} iconClassName="bg-emerald-50 text-emerald-700" valueClassName="text-emerald-600" /><br>    </section><br>  );<br>}<br><br>export default function Templates() {<br>  const { hasAccess |
| src/pages/Templates.tsx | 79 | <StatShortcutCard label="Akceptacje" value={stats.decisionItems} icon={CheckCircle2} iconClassName="bg-emerald-50 text-emerald-700" valueClassName="text-emerald-600" /><br>    </section><br>  );<br>}<br><br>export default function Templates() {<br>  const { hasAccess } = useWorkspace();<br>  const [templates, setTemplates] = useState<TemplateRecord[]>([]);<br>  const [loading, setLoading] = useState(true);<br>  const [searchQuery, setSearchQue |

## Kontrakty akcji encji

| Plik | Linia | Fragment |
|---|---:|---|
| src/pages/CaseDetail.tsx | 169 | const CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CASE = {<br>  entity: 'case',<br>  entityHeaderActionCluster: actionButtonClass('neutral', 'cf-entity-action-cluster'),<br>  activityPanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),<br>  notePanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),<br>  tasksPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),<br>  workItemsPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),<br>  eventsPanelHeader: actionButtonClass('neutral', ' |
| src/pages/ClientDetail.tsx | 238 | const CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CLIENT = {<br>  entity: 'client',<br>  entityHeaderActionCluster: actionButtonClass('neutral', 'cf-entity-action-cluster'),<br>  activityPanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),<br>  notePanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),<br>  tasksPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),<br>  workItemsPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),<br>  eventsPanelHeader: actionButtonClass('neutral |
| src/pages/LeadDetail.tsx | 203 | const CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_LEAD = {<br>  entity: 'lead',<br>  entityHeaderActionCluster: actionButtonClass('neutral', 'cf-entity-action-cluster'),<br>  activityPanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),<br>  notePanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),<br>  tasksPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),<br>  workItemsPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),<br>  eventsPanelHeader: actionButtonClass('neutral', ' |

## Lokalne implementacje do przepięcia

Te elementy są kandydatami do przeniesienia do wspólnego UI systemu.

| Nazwa | Plik | Linia |
|---|---|---:|
| ClientMultiContactField | src/pages/ClientDetail.tsx | 1072 |
| StatCell | src/pages/ClientDetail.tsx | 1129 |
| LeadActionButton | src/pages/LeadDetail.tsx | 676 |

## Regiony / data attributes

| Plik | Linia | Wartość |
|---|---:|---|
| src/components/AppChunkErrorBoundary.tsx | 34 | true |
| src/components/confirm-dialog.tsx | 30 | true |
| src/components/entity-actions.tsx | 152 | true |
| src/components/entity-actions.tsx | 153 | trash-action-source |
| src/components/entity-actions.tsx | 174 | entity-header-action-cluster |
| src/components/entity-actions.tsx | 174 | VS6 |
| src/components/entity-actions.tsx | 182 | VS6 |
| src/components/entity-actions.tsx | 189 | info-row-inline-action |
| src/components/entity-actions.tsx | 189 | VS6 |
| src/components/entity-actions.tsx | 196 | danger-action-zone |
| src/components/entity-actions.tsx | 196 | VS6 |
| src/components/finance/CaseFinanceEditorDialog.tsx | 178 | true |
| src/components/finance/CaseFinanceEditorDialog.tsx | 184 | true |
| src/components/finance/CaseFinanceEditorDialog.tsx | 250 | remaining |
| src/components/finance/CaseSettlementPanel.tsx | 275 | true |
| src/components/finance/CaseSettlementSection.tsx | 43 | case-detail-only |
| src/components/finance/FinanceMiniSummary.tsx | 181 | transaction |
| src/components/finance/FinanceMiniSummary.tsx | 182 | commission |
| src/components/finance/FinanceMiniSummary.tsx | 183 | paid |
| src/components/finance/FinanceMiniSummary.tsx | 184 | remaining |
| src/components/finance/FinanceMiniSummary.tsx | 295 | transaction |
| src/components/finance/FinanceMiniSummary.tsx | 296 | commission |
| src/components/finance/FinanceMiniSummary.tsx | 297 | paid |
| src/components/finance/FinanceMiniSummary.tsx | 298 | remaining |
| src/components/finance/FinanceMiniSummary.tsx | 299 | cost |
| src/components/finance/FinanceMiniSummary.tsx | 300 | total |
| src/components/finance/FinanceMiniSummary.tsx | 319 | transaction |
| src/components/finance/FinanceMiniSummary.tsx | 320 | commission |
| src/components/finance/FinanceMiniSummary.tsx | 321 | paid |
| src/components/finance/FinanceMiniSummary.tsx | 322 | remaining |
| src/components/GlobalQuickActions.tsx | 184 | ai |
| src/components/GlobalQuickActions.tsx | 191 | neutral |
| src/components/GlobalQuickActions.tsx | 197 | neutral |
| src/components/GlobalQuickActions.tsx | 202 | neutral |
| src/components/GlobalQuickActions.tsx | 206 | neutral |
| src/components/Layout.tsx | 712 | true |
| src/components/layout/app-shell.tsx | 22 | lf-ui-sot-cz2-015 |
| src/components/layout/app-shell.tsx | 22 | app-shell |
| src/components/layout/content-rail-layout.tsx | 23 | lf-ui-sot-cz2-015 |
| src/components/layout/content-rail-layout.tsx | 23 | content-rail |
| src/components/layout/content-rail-layout.tsx | 24 | true |
| src/components/layout/content-rail-layout.tsx | 27 | true |
| src/components/layout/page-header.tsx | 24 | lf-ui-sot-cz2-015 |
| src/components/layout/page-header.tsx | 24 | page-header |
| src/components/layout/page-header.tsx | 26 | true |
| src/components/layout/page-header.tsx | 28 | true |
| src/components/layout/page-header.tsx | 29 | true |
| src/components/layout/page-header.tsx | 31 | true |
| src/components/layout/page-shell.tsx | 23 | lf-ui-sot-cz2-015 |
| src/components/layout/page-shell.tsx | 23 | page-shell |
| src/components/layout/page-shell.tsx | 24 | true |
| src/components/layout/page-shell.tsx | 25 | true |
| src/components/layout/page-shell.tsx | 28 | true |
| src/components/layout/sidebar-nav.tsx | 35 | lf-ui-sot-cz2-015 |
| src/components/layout/sidebar-nav.tsx | 35 | sidebar-nav |
| src/components/layout/sidebar-nav.tsx | 41 | true |
| src/components/layout/sidebar-nav.tsx | 47 | true |
| src/components/layout/sidebar-nav.tsx | 54 | true |
| src/components/layout/sidebar-nav.tsx | 59 | true |
| src/components/operator-rail/TopValueRecordsCard.tsx | 61 | true |
| src/components/operator-rail/TopValueRecordsCard.tsx | 62 | blue |
| src/components/QuickAiCapture.tsx | 280 | ai |
| src/components/ui-system/ActionCluster.tsx | 41 | ActionCluster |
| src/components/ui-system/ActionCluster.tsx | 45 | VS6 |
| src/components/ui-system/ActionCluster.tsx | 46 | primary,secondary,danger |
| src/components/ui-system/EmptyState.tsx | 18 | EmptyState |
| src/components/ui-system/EmptyState.tsx | 20 | component-registry-vs2 |
| src/components/ui-system/FormFooter.tsx | 22 | FormFooter |
| src/components/ui-system/FormFooter.tsx | 24 | component-registry-vs2 |
| src/components/ui-system/ListRow.tsx | 40 | ListRow |
| src/components/ui-system/ListRow.tsx | 40 | component-registry-vs2 |
| src/components/ui-system/ListRow.tsx | 48 | ListRow |
| src/components/ui-system/ListRow.tsx | 48 | component-registry-vs2 |
| src/components/ui-system/ListRow.tsx | 55 | ListRow |
| src/components/ui-system/ListRow.tsx | 55 | component-registry-vs2 |
| src/components/ui-system/MetricGrid.tsx | 20 | MetricGrid |
| src/components/ui-system/MetricGrid.tsx | 21 | component-registry-vs2 |
| src/components/ui-system/MetricGrid.tsx | 23 | 1 |
| src/components/ui-system/MetricTile.tsx | 59 | MetricTile |
| src/components/ui-system/MetricTile.tsx | 60 | label,value,helper,icon,tone,active,onClick |
| src/components/ui-system/MetricTile.tsx | 61 | component-registry-vs2 |
| src/components/ui-system/OperatorMetricTiles.tsx | 7 | vs5v |
| src/components/ui-system/OperatorMetricTiles.tsx | 48 | true |
| src/components/ui-system/OperatorMetricTiles.tsx | 51 | true |
| src/components/ui-system/OperatorMetricTiles.tsx | 52 | OperatorMetricTiles |
| src/components/ui-system/OperatorMetricTiles.tsx | 53 | vs5x-repair3 |
| src/components/ui-system/OperatorMetricTiles.tsx | 87 | true |
| src/components/ui-system/OperatorMetricTiles.tsx | 98 | true |
| src/components/ui-system/OperatorMetricToneRuntime.tsx | 93 | true |
| src/components/ui-system/OperatorMetricToneRuntime.tsx | 109 | true |
| src/components/ui-system/PageHero.tsx | 20 | PageHero |
| src/components/ui-system/PageShell.tsx | 21 | PageShell |
| src/components/ui-system/StatusPill.tsx | 24 | StatusPill |
| src/components/ui-system/StatusPill.tsx | 26 | component-registry-vs2 |
| src/components/ui-system/SurfaceCard.tsx | 28 | SurfaceCard |
| src/components/ui-system/SurfaceCard.tsx | 30 | component-registry-vs2 |
| src/components/ui/badge.tsx | 42 | true |
| src/components/ui/button.tsx | 56 | true |
| src/components/ui/card.tsx | 85 | true |
| src/components/ui/detail-panel.tsx | 25 | detail-panel |
| src/components/ui/detail-panel.tsx | 25 | lf-ui-sot-cz2-012 |
| src/components/ui/dialog.tsx | 36 | true |
| src/components/ui/empty-state-card.tsx | 24 | empty-state |
| src/components/ui/empty-state-card.tsx | 24 | lf-ui-sot-cz2-012 |
| src/components/ui/filter-chip-group.tsx | 46 | chip-group |
| src/components/ui/filter-chip-group.tsx | 46 | lf-ui-sot-cz2-014 |
| src/components/ui/filter-select.tsx | 36 | filter-select |
| src/components/ui/filter-select.tsx | 36 | lf-ui-sot-cz2-014 |
| src/components/ui/filter-toolbar.tsx | 23 | toolbar |
| src/components/ui/filter-toolbar.tsx | 23 | lf-ui-sot-cz2-014 |
| src/components/ui/filter-toolbar.tsx | 25 | true |
| src/components/ui/filter-toolbar.tsx | 30 | true |
| src/components/ui/form-field.tsx | 26 | field |
| src/components/ui/form-field.tsx | 26 | lf-ui-sot-cz2-013 |
| src/components/ui/form-field.tsx | 33 | true |
| src/components/ui/form-section.tsx | 23 | section |
| src/components/ui/form-section.tsx | 23 | lf-ui-sot-cz2-013 |
| src/components/ui/form-section.tsx | 29 | true |
| src/components/ui/input.tsx | 14 | true |
| src/components/ui/list-card.tsx | 46 | list |
| src/components/ui/list-card.tsx | 46 | lf-ui-sot-cz2-012 |
| src/components/ui/metric-card.tsx | 64 | metric |
| src/components/ui/metric-card.tsx | 65 | lf-ui-sot-cz2-012 |
| src/components/ui/metric-card.tsx | 66 | true |
| src/components/ui/metric-card.tsx | 69 | cz2-012-card-variant |
| src/components/ui/metric-card.tsx | 77 | true |
| src/components/ui/metric-card.tsx | 88 | true |
| src/components/ui/search-field.tsx | 39 | search |
| src/components/ui/search-field.tsx | 39 | lf-ui-sot-cz2-014 |
| src/components/ui/select-field.tsx | 50 | select |
| src/components/ui/select.tsx | 43 | select |
| src/components/ui/sort-select.tsx | 25 | sort-select |
| src/components/ui/sort-select.tsx | 25 | lf-ui-sot-cz2-014 |
| src/components/ui/textarea-field.tsx | 46 | textarea |
| src/components/ui/textarea.tsx | 14 | textarea |
| src/components/VisualFoundationRuntimeStage212B.tsx | 55 | true |
| src/components/VisualFoundationRuntimeStage212G.tsx | 56 | true |
| src/components/VisualFoundationRuntimeStage212M.tsx | 74 | true |
| src/pages/Activity.tsx | 357 | semantic173 |
| src/pages/Activity.tsx | 357 | true |

## Położenie / layout CSS

| Plik | Linia | Selektor/kontekst | Reguła |
|---|---:|---|---|
| src/index.css | 22 | [data-skin="forteca-light"] { --color-primary: #2563eb; --color-primary-foreground: #ffffff; --app-bg: #f1f5f9; --app-surface: #f8fafc; --app-surface-strong: #ffffff; --app-surface-muted: #f1f5f9; --app-border: #e2e8f0; | --app-border: #e2e8f0; |
| src/index.css | 38 | [data-skin="forteca-dark"] { --color-primary: #60a5fa; --color-primary-foreground: #08111f; --app-bg: #f1f5f9; --app-surface: #f8fafc; --app-surface-strong: #ffffff; --app-surface-muted: #f1f5f9; --app-border: #475569; | --app-border: #475569; |
| src/index.css | 54 | [data-skin="midnight"] { --color-primary: #22c55e; --color-primary-foreground: #04110a; --app-bg: #f1f5f9; --app-surface: #f8fafc; --app-surface-strong: #ffffff; --app-surface-muted: #f1f5f9; --app-border: #334155; | --app-border: #334155; |
| src/index.css | 70 | [data-skin="sandstone"] { --color-primary: #d97706; --color-primary-foreground: #fffdf8; --app-bg: #f1f5f9; --app-surface: #f8fafc; --app-surface-strong: #ffffff; --app-surface-muted: #f1f5f9; --app-border: #c8b594; | --app-border: #c8b594; |
| src/index.css | 128 | .glass { @apply backdrop-blur-md; background-color: color-mix(in srgb, var(--app-surface-strong) 82%, transparent); border: 1px solid color-mix(in srgb, var(--app-border) 65%, transparent); | border: 1px solid color-mix(in srgb, var(--app-border) 65%, transparent); |
| src/pages/legal-public-pages.css | 14 | .cf-legal-card { width: min(920px, 100%); margin: 0 auto; border: 1px solid #e4e7ec; | border: 1px solid #e4e7ec; |
| src/pages/legal-public-pages.css | 74 | .cf-legal-actions { display: flex; | display: flex; |
| src/pages/legal-public-pages.css | 106 | .cf-legal-secondary-link { border: 1px solid #e4e7ec; | border: 1px solid #e4e7ec; |
| src/pages/legal-public-pages.css | 116 | @media (max-width: 720px) { | @media (max-width: 720px) { |
| src/styles/admin-tools.css | 3 | .admin-debug-toolbar { position: relative; | position: relative; |
| src/styles/admin-tools.css | 11 | z-index: 2147483000; isolation: isolate; display: inline-flex; align-items: center; gap: 6px; margin-left: auto; padding: 4px; border: 1px solid rgba(148, 163, 184, 0.36); | border: 1px solid rgba(148, 163, 184, 0.36); |
| src/styles/admin-tools.css | 28 | .admin-preset-grid button { border: 1px solid rgba(148, 163, 184, 0.32); | border: 1px solid rgba(148, 163, 184, 0.32); |
| src/styles/admin-tools.css | 48 | .admin-tool-popover { position: absolute; | position: absolute; |
| src/styles/admin-tools.css | 53 | .admin-tool-popover { position: absolute; z-index: 2147483003; top: calc(100% + 8px); right: 0; width: 320px; display: grid; | display: grid; |
| src/styles/admin-tools.css | 56 | z-index: 2147483003; top: calc(100% + 8px); right: 0; width: 320px; display: grid; gap: 10px; padding: 12px; border: 1px solid rgba(148, 163, 184, 0.32); | border: 1px solid rgba(148, 163, 184, 0.32); |
| src/styles/admin-tools.css | 69 | .admin-tool-row { display: flex; | display: flex; |
| src/styles/admin-tools.css | 79 | .admin-button-list { display: grid; | display: grid; |
| src/styles/admin-tools.css | 86 | .admin-button-row { display: grid; | display: grid; |
| src/styles/admin-tools.css | 87 | .admin-button-row { display: grid; grid-template-columns: minmax(0, 1fr) 130px; | grid-template-columns: minmax(0, 1fr) 130px; |
| src/styles/admin-tools.css | 91 | .admin-button-row { display: grid; grid-template-columns: minmax(0, 1fr) 130px; gap: 8px; align-items: center; padding: 8px; border: 1px solid rgba(148, 163, 184, 0.22); | border: 1px solid rgba(148, 163, 184, 0.22); |
| src/styles/admin-tools.css | 104 | .admin-tool-dialog-backdrop { position: fixed; | position: fixed; |
| src/styles/admin-tools.css | 107 | .admin-tool-dialog-backdrop { position: fixed; inset: 0; z-index: 2147483001; display: flex; | display: flex; |
| src/styles/admin-tools.css | 117 | .admin-tool-dialog { position: relative; | position: relative; |
| src/styles/admin-tools.css | 123 | .admin-tool-dialog { position: relative; z-index: 2147483002; width: min(520px, 96vw); max-height: calc(100vh - 112px); overflow: auto; will-change: transform; display: grid; | display: grid; |
| src/styles/admin-tools.css | 137 | .admin-tool-dialog label { display: grid; | display: grid; |
| src/styles/admin-tools.css | 148 | .admin-tool-popover select { width: 100%; border: 1px solid rgba(148, 163, 184, 0.38); | border: 1px solid rgba(148, 163, 184, 0.38); |
| src/styles/admin-tools.css | 160 | .admin-target-card { display: grid; | display: grid; |
| src/styles/admin-tools.css | 163 | .admin-target-card { display: grid; gap: 6px; padding: 10px; border: 1px solid rgba(96, 165, 250, 0.42); | border: 1px solid rgba(96, 165, 250, 0.42); |
| src/styles/admin-tools.css | 169 | .admin-preset-grid { display: flex; | display: flex; |
| src/styles/admin-tools.css | 174 | @media (max-width: 900px) { | @media (max-width: 900px) { |
| src/styles/admin-tools.css | 176 | .admin-debug-toolbar { max-width: 100%; | max-width: 100%; |
| src/styles/admin-tools.css | 208 | @media (max-height: 720px) { | @media (max-height: 720px) { |
| src/styles/admin-tools.css | 218 | @media (max-height: 560px) { | @media (max-height: 560px) { |
| src/styles/admin-tools.css | 228 | .admin-tool-mode-hint { position: fixed; | position: fixed; |
| src/styles/admin-tools.css | 232 | .admin-tool-mode-hint { position: fixed; right: 24px; bottom: 24px; z-index: 2147483004; max-width: min(420px, calc(100vw - 48px)); | max-width: min(420px, calc(100vw - 48px)); |
| src/styles/admin-tools.css | 234 | .admin-tool-mode-hint { position: fixed; right: 24px; bottom: 24px; z-index: 2147483004; max-width: min(420px, calc(100vw - 48px)); padding: 10px 12px; border: 1px solid rgba(96, 165, 250, 0.42); | border: 1px solid rgba(96, 165, 250, 0.42); |
| src/styles/admin-tools.css | 243 | .admin-tool-save-toast { position: fixed; | position: fixed; |
| src/styles/admin-tools.css | 247 | .admin-tool-save-toast { position: fixed; right: 24px; bottom: 24px; z-index: 2147483005; max-width: min(420px, calc(100vw - 48px)); | max-width: min(420px, calc(100vw - 48px)); |
| src/styles/admin-tools.css | 249 | .admin-tool-save-toast { position: fixed; right: 24px; bottom: 24px; z-index: 2147483005; max-width: min(420px, calc(100vw - 48px)); padding: 10px 12px; border: 1px solid rgba(34, 197, 94, 0.48); | border: 1px solid rgba(34, 197, 94, 0.48); |
| src/styles/admin-tools.css | 258 | .admin-tool-quick-editor { position: fixed; | position: fixed; |
| src/styles/admin-tools.css | 265 | position: fixed; right: 24px; bottom: 24px; z-index: 2147483006; width: min(480px, calc(100vw - 48px)); max-height: min(720px, calc(100vh - 48px)); overflow: auto; display: grid; | display: grid; |
| src/styles/admin-tools.css | 268 | z-index: 2147483006; width: min(480px, calc(100vw - 48px)); max-height: min(720px, calc(100vh - 48px)); overflow: auto; display: grid; gap: 10px; padding: 14px; border: 1px solid rgba(96, 165, 250, 0.45); | border: 1px solid rgba(96, 165, 250, 0.45); |
| src/styles/admin-tools.css | 281 | .admin-tool-quick-editor label { display: grid; | display: grid; |
| src/styles/admin-tools.css | 291 | .admin-tool-quick-editor select { width: 100%; border: 1px solid rgba(148, 163, 184, 0.38); | border: 1px solid rgba(148, 163, 184, 0.38); |
| src/styles/admin-tools.css | 303 | .admin-tool-quick-editor button { border: 1px solid rgba(148, 163, 184, 0.32); | border: 1px solid rgba(148, 163, 184, 0.32); |
| src/styles/admin-tools.css | 316 | @media (max-width: 760px) { | @media (max-width: 760px) { |
| src/styles/admin-tools.css | 323 | .admin-tool-save-toast { right: 12px; bottom: 12px; width: calc(100vw - 24px); max-width: calc(100vw - 24px); | max-width: calc(100vw - 24px); |
| src/styles/admin-tools.css | 355 | @media (max-width: 760px) { | @media (max-width: 760px) { |
| src/styles/clients-next-action-layout.css | 4 | .main-clients-html .client-row:not(.cf-client-row-two-line) { display: grid; | display: grid; |
| src/styles/clients-next-action-layout.css | 5 | .main-clients-html .client-row:not(.cf-client-row-two-line) { display: grid; grid-template-columns: minmax(2.25rem, auto) minmax(0, 1fr) minmax(7.5rem, auto); | grid-template-columns: minmax(2.25rem, auto) minmax(0, 1fr) minmax(7.5rem, auto); |
| src/styles/clients-next-action-layout.css | 20 | .main-clients-html .client-row:not(.cf-client-row-two-line) > .lead-main-cell { grid-area: main; min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 33 | .main-clients-html .client-row:not(.cf-client-row-two-line) > .client-card-next-action-block { grid-area: next; width: 100%; min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 34 | .main-clients-html .client-row:not(.cf-client-row-two-line) > .client-card-next-action-block { grid-area: next; width: 100%; min-width: 0; display: flex; | display: flex; |
| src/styles/clients-next-action-layout.css | 40 | min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 0.2rem; padding: 0.72rem 0.85rem; border-radius: 0.95rem; border: 1px solid rgba(148, 163, 184, 0.28); | border: 1px solid rgba(148, 163, 184, 0.28); |
| src/styles/clients-next-action-layout.css | 54 | .main-clients-html .client-row:not(.cf-client-row-two-line) > .client-card-next-action-block strong { max-width: 100%; | max-width: 100%; |
| src/styles/clients-next-action-layout.css | 69 | .main-clients-html .client-row:not(.cf-client-row-two-line) > .client-card-action-buttons { grid-area: actions; justify-self: end; width: 100%; min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 70 | .main-clients-html .client-row:not(.cf-client-row-two-line) > .client-card-action-buttons { grid-area: actions; justify-self: end; width: 100%; min-width: 0; display: flex; | display: flex; |
| src/styles/clients-next-action-layout.css | 86 | .main-clients-html .client-row:not(.cf-client-row-two-line) > .client-card-action-buttons a { min-width: max-content; | min-width: max-content; |
| src/styles/clients-next-action-layout.css | 89 | @media (max-width: 1024px) { | @media (max-width: 1024px) { |
| src/styles/clients-next-action-layout.css | 91 | .main-clients-html .client-row:not(.cf-client-row-two-line) { grid-template-columns: minmax(2.25rem, auto) minmax(0, 1fr); | grid-template-columns: minmax(2.25rem, auto) minmax(0, 1fr); |
| src/styles/clients-next-action-layout.css | 109 | @media (max-width: 520px) { | @media (max-width: 520px) { |
| src/styles/clients-next-action-layout.css | 111 | .main-clients-html .client-row:not(.cf-client-row-two-line) { grid-template-columns: 1fr; | grid-template-columns: 1fr; |
| src/styles/clients-next-action-layout.css | 135 | .main-clients-html .layout-list { width: 100%; max-width: none; | max-width: none; |
| src/styles/clients-next-action-layout.css | 136 | .main-clients-html .layout-list { width: 100%; max-width: none; min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 142 | .main-clients-html .layout-list > .stack { width: 100%; max-width: none; | max-width: none; |
| src/styles/clients-next-action-layout.css | 143 | .main-clients-html .layout-list > .stack { width: 100%; max-width: none; min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 148 | .main-clients-html .table-card { width: 100%; max-width: none; | max-width: none; |
| src/styles/clients-next-action-layout.css | 149 | .main-clients-html .table-card { width: 100%; max-width: none; min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 157 | .main-clients-html [class*="group/client-card"] { width: 100%; max-width: none; | max-width: none; |
| src/styles/clients-next-action-layout.css | 158 | .main-clients-html [class*="group/client-card"] { width: 100%; max-width: none; min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 167 | .main-clients-html [data-client-card-wide-layout="true"] > a { display: block; width: 100%; max-width: none; | max-width: none; |
| src/styles/clients-next-action-layout.css | 168 | .main-clients-html [data-client-card-wide-layout="true"] > a { display: block; width: 100%; max-width: none; min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 173 | .main-clients-html .client-row:not(.cf-client-row-two-line) { width: 100%; max-width: none; | max-width: none; |
| src/styles/clients-next-action-layout.css | 174 | .main-clients-html .client-row:not(.cf-client-row-two-line) { width: 100%; max-width: none; min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 181 | .main-clients-html .client-row:not(.cf-client-row-two-line) > .client-card-next-action-block { min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 186 | .main-clients-html .statusline { max-width: 100%; | max-width: 100%; |
| src/styles/clients-next-action-layout.css | 187 | .main-clients-html .statusline { max-width: 100%; min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 188 | .main-clients-html .statusline { max-width: 100%; min-width: 0; display: flex; | display: flex; |
| src/styles/clients-next-action-layout.css | 195 | .main-clients-html .statusline > * { min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 206 | .cf-client-card-grid { display: grid; | display: grid; |
| src/styles/clients-next-action-layout.css | 207 | .cf-client-card-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 360px); | grid-template-columns: minmax(0, 1fr) minmax(260px, 360px); |
| src/styles/clients-next-action-layout.css | 212 | @media (min-width: 901px) { | @media (min-width: 901px) { |
| src/styles/clients-next-action-layout.css | 214 | .main-clients-html .client-row:not(.cf-client-row-two-line) { grid-template-columns: minmax(2.25rem, auto) minmax(0, 1fr) minmax(260px, 360px); | grid-template-columns: minmax(2.25rem, auto) minmax(0, 1fr) minmax(260px, 360px); |
| src/styles/clients-next-action-layout.css | 218 | .main-clients-html .client-row:not(.cf-client-row-two-line) > .lead-value-cell { min-width: 260px; | min-width: 260px; |
| src/styles/clients-next-action-layout.css | 222 | @media (max-width: 900px) { | @media (max-width: 900px) { |
| src/styles/clients-next-action-layout.css | 224 | .cf-client-card-grid { grid-template-columns: 1fr; | grid-template-columns: 1fr; |
| src/styles/clients-next-action-layout.css | 228 | .main-clients-html .client-row:not(.cf-client-row-two-line) { grid-template-columns: minmax(2.25rem, auto) minmax(0, 1fr); | grid-template-columns: minmax(2.25rem, auto) minmax(0, 1fr); |
| src/styles/clients-next-action-layout.css | 232 | @media (max-width: 520px) { | @media (max-width: 520px) { |
| src/styles/clients-next-action-layout.css | 238 | .main-clients-html [class*="group/client-card"] { width: 100%; max-width: 100%; | max-width: 100%; |
| src/styles/clients-next-action-layout.css | 242 | .main-clients-html .client-row:not(.cf-client-row-two-line) > .cf-client-next-action-panel { border: 1px solid rgba(37, 99, 235, 0.18); | border: 1px solid rgba(37, 99, 235, 0.18); |
| src/styles/clients-next-action-layout.css | 263 | @media (max-width: 520px) { | @media (max-width: 520px) { |
| src/styles/clients-next-action-layout.css | 270 | .main-clients-html .client-row:not(.cf-client-row-two-line).cf-client-row-inline { display: grid; | display: grid; |
| src/styles/clients-next-action-layout.css | 271 | .main-clients-html .client-row:not(.cf-client-row-two-line).cf-client-row-inline { display: grid; grid-template-columns: | grid-template-columns: |
| src/styles/clients-next-action-layout.css | 282 | .main-clients-html .cf-client-main-cell { min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 286 | .main-clients-html .cf-client-cases-cell { min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 290 | .main-clients-html .cf-client-next-action-inline { min-width: 0; | min-width: 0; |
| src/styles/clients-next-action-layout.css | 292 | .main-clients-html .cf-client-next-action-inline { min-width: 0; align-self: stretch; display: flex; | display: flex; |
| src/styles/clients-next-action-layout.css | 305 | @media (max-width: 75rem) { | @media (max-width: 75rem) { |
| src/styles/clients-next-action-layout.css | 307 | .main-clients-html .client-row:not(.cf-client-row-two-line).cf-client-row-inline { grid-template-columns: | grid-template-columns: |
| src/styles/clients-next-action-layout.css | 315 | .main-clients-html .cf-client-row-actions { grid-column: 2 / -1; | grid-column: 2 / -1; |
| src/styles/clients-next-action-layout.css | 319 | @media (max-width: 47.5rem) { | @media (max-width: 47.5rem) { |
| src/styles/clients-next-action-layout.css | 321 | .main-clients-html .client-row:not(.cf-client-row-two-line).cf-client-row-inline { grid-template-columns: auto minmax(0, 1fr); | grid-template-columns: auto minmax(0, 1fr); |
| src/styles/clients-next-action-layout.css | 328 | .main-clients-html .cf-client-row-actions { grid-column: 2 / -1; | grid-column: 2 / -1; |
| src/styles/closeflow-activity-rail.css | 8 | .activity-vnext-page .activity-right-rail .right-card.activity-right-card { position: relative; | position: relative; |
| src/styles/closeflow-activity-rail.css | 20 | .activity-vnext-page .activity-right-rail .right-card.activity-right-card::before { content: ""; position: absolute; | position: absolute; |
| src/styles/closeflow-activity-rail.css | 117 | .activity-vnext-page .activity-right-rail .activity-rail-button strong { min-width: 30px; | min-width: 30px; |
| src/styles/closeflow-activity-rail.css | 119 | .activity-vnext-page .activity-right-rail .activity-rail-button strong { min-width: 30px; height: 26px; border: 1px solid currentColor; | border: 1px solid currentColor; |
| src/styles/closeflow-activity-rail.css | 126 | .activity-vnext-page .activity-right-rail .activity-right-card[data-activity-rail-card="cases"] .activity-rail-empty { border: 1px dashed rgba(4, 120, 87, 0.28); | border: 1px dashed rgba(4, 120, 87, 0.28); |
| src/styles/closeflow-activity-rail.css | 133 | .activity-vnext-page .activity-right-rail .activity-right-card[data-activity-rail-card="leads"] .activity-rail-empty { border: 1px dashed rgba(79, 70, 229, 0.28); | border: 1px dashed rgba(79, 70, 229, 0.28); |
| src/styles/closeflow-activity-rail.css | 188 | .activity-vnext-page .activity-filter-pill strong { background: rgba(255,255,255,0.80); color: currentColor; border: 1px solid currentColor; | border: 1px solid currentColor; |
| src/styles/closeflow-ai-drafts-rail.css | 67 | .ai-drafts-vnext-page .ai-drafts-filter-pill strong { background: rgba(255,255,255,0.82); border: 1px solid currentColor; | border: 1px solid currentColor; |
| src/styles/closeflow-ai-drafts-rail.css | 81 | .ai-drafts-vnext-page .ai-drafts-right-rail .right-card.ai-drafts-right-card { position: relative; | position: relative; |
| src/styles/closeflow-ai-drafts-rail.css | 93 | .ai-drafts-vnext-page .ai-drafts-right-rail .right-card.ai-drafts-right-card::before { content: ""; position: absolute; | position: absolute; |
| src/styles/closeflow-ai-drafts-rail.css | 213 | .ai-drafts-vnext-page .ai-drafts-rail-button strong { min-width: 30px; | min-width: 30px; |
| src/styles/closeflow-ai-drafts-rail.css | 215 | .ai-drafts-vnext-page .ai-drafts-rail-button strong { min-width: 30px; height: 26px; border: 1px solid currentColor; | border: 1px solid currentColor; |
| src/styles/closeflow-ai-drafts-rail.css | 222 | .ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="errors"] .ai-drafts-rail-empty { border: 1px dashed rgba(220, 38, 38, 0.28); | border: 1px dashed rgba(220, 38, 38, 0.28); |
| src/styles/closeflow-ai-drafts-rail.css | 229 | .ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="converted"] .ai-drafts-rail-empty { border: 1px dashed rgba(4, 120, 87, 0.28); | border: 1px dashed rgba(4, 120, 87, 0.28); |
| src/styles/closeflow-ai-drafts-rail.css | 236 | .ai-drafts-vnext-page .ai-drafts-right-card[data-ai-draft-rail-card="help"] .ai-drafts-rail-empty { border: 1px dashed rgba(37, 99, 235, 0.24); | border: 1px dashed rgba(37, 99, 235, 0.24); |
| src/styles/closeflow-ai-drafts.css | 10 | .ai-drafts-page-header { max-width: 1440px; | max-width: 1440px; |
| src/styles/closeflow-ai-drafts.css | 12 | .ai-drafts-page-header { max-width: 1440px; margin: 0 auto 22px; display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 41 | .ai-drafts-header-actions { display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 49 | .ai-drafts-header-button { min-height: 42px; border: 1px solid #e4e7ec; | border: 1px solid #e4e7ec; |
| src/styles/closeflow-ai-drafts.css | 66 | .ai-drafts-stats-grid { max-width: 1440px; | max-width: 1440px; |
| src/styles/closeflow-ai-drafts.css | 68 | .ai-drafts-stats-grid { max-width: 1440px; margin: 0 auto 22px; display: grid; | display: grid; |
| src/styles/closeflow-ai-drafts.css | 69 | .ai-drafts-stats-grid { max-width: 1440px; margin: 0 auto 22px; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); | grid-template-columns: repeat(6, minmax(0, 1fr)); |
| src/styles/closeflow-ai-drafts.css | 76 | .ai-drafts-stat-card { min-height: 96px; padding: 16px; border: 1px solid #e4e7ec; | border: 1px solid #e4e7ec; |
| src/styles/closeflow-ai-drafts.css | 81 | min-height: 96px; padding: 16px; border: 1px solid #e4e7ec; border-radius: 22px; background: rgba(255, 255, 255, 0.92); box-shadow: 0 8px 22px rgba(16, 24, 40, 0.05); color: #111827; display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 102 | .ai-drafts-stat-content { display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 135 | .ai-drafts-vnext-shell { max-width: 1440px; | max-width: 1440px; |
| src/styles/closeflow-ai-drafts.css | 137 | .ai-drafts-vnext-shell { max-width: 1440px; margin: 0 auto; display: grid; | display: grid; |
| src/styles/closeflow-ai-drafts.css | 138 | .ai-drafts-vnext-shell { max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) 320px; | grid-template-columns: minmax(0, 1fr) 320px; |
| src/styles/closeflow-ai-drafts.css | 144 | .ai-drafts-main-column { min-width: 0; | min-width: 0; |
| src/styles/closeflow-ai-drafts.css | 145 | .ai-drafts-main-column { min-width: 0; display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 152 | .ai-drafts-list-card { border: 1px solid #e4e7ec; | border: 1px solid #e4e7ec; |
| src/styles/closeflow-ai-drafts.css | 160 | .ai-drafts-toolbar-card { padding: 16px; display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 166 | .ai-drafts-filter-pills { display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 174 | .ai-drafts-filter-pill { height: 40px; padding: 0 13px; border: 1px solid #e4e7ec; | border: 1px solid #e4e7ec; |
| src/styles/closeflow-ai-drafts.css | 188 | .ai-drafts-filter-pill strong { min-width: 24px; | min-width: 24px; |
| src/styles/closeflow-ai-drafts.css | 215 | .ai-drafts-search-box { min-height: 48px; border: 1px solid #e4e7ec; | border: 1px solid #e4e7ec; |
| src/styles/closeflow-ai-drafts.css | 219 | .ai-drafts-search-box { min-height: 48px; border: 1px solid #e4e7ec; border-radius: 20px; background: #fff; box-shadow: 0 8px 22px rgba(16, 24, 40, 0.04); display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 228 | .ai-drafts-search-box input { width: 100%; min-width: 0; | min-width: 0; |
| src/styles/closeflow-ai-drafts.css | 229 | .ai-drafts-search-box input { width: 100%; min-width: 0; border: 0; | border: 0; |
| src/styles/closeflow-ai-drafts.css | 247 | .ai-drafts-list-head { min-height: 78px; padding: 20px 22px; display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 273 | .ai-drafts-list-head > span { border: 1px solid #e4e7ec; | border: 1px solid #e4e7ec; |
| src/styles/closeflow-ai-drafts.css | 283 | .ai-drafts-rows { display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 298 | .ai-drafts-row-grid { min-height: 78px; display: grid; | display: grid; |
| src/styles/closeflow-ai-drafts.css | 299 | .ai-drafts-row-grid { min-height: 78px; display: grid; grid-template-columns: 36px minmax(340px, 1fr) 150px 130px 140px auto; | grid-template-columns: 36px minmax(340px, 1fr) 150px 130px 140px auto; |
| src/styles/closeflow-ai-drafts.css | 340 | .ai-drafts-row-main { min-width: 0; | min-width: 0; |
| src/styles/closeflow-ai-drafts.css | 344 | .ai-drafts-row-heading { display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 425 | .ai-drafts-actions-col { display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 434 | .ai-drafts-action { min-height: 32px; border: 1px solid #e4e7ec; | border: 1px solid #e4e7ec; |
| src/styles/closeflow-ai-drafts.css | 487 | .ai-drafts-approval-panel { margin: 0 22px 18px 76px; border: 1px solid #e4e7ec; | border: 1px solid #e4e7ec; |
| src/styles/closeflow-ai-drafts.css | 497 | .ai-drafts-approval-textarea { min-height: 112px; width: 100%; border: 1px solid #e4e7ec; | border: 1px solid #e4e7ec; |
| src/styles/closeflow-ai-drafts.css | 507 | .ai-drafts-inline-edit > div { margin-top: 10px; display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 513 | .ai-drafts-detail-titlebar { display: flex; | display: flex; |
| src/styles/closeflow-ai-drafts.css | 545 | .ai-drafts-detail-grid { display: grid; | display: grid; |
| src/styles/closeflow-ai-drafts.css | 546 | .ai-drafts-detail-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); | grid-template-columns: repeat(4, minmax(0, 1fr)); |
| src/styles/closeflow-ai-drafts.css | 554 | .ai-drafts-relation-picker { border: 1px solid #e4e7ec; | border: 1px solid #e4e7ec; |
| src/styles/closeflow-ai-drafts.css | 585 | .ai-drafts-recognized-card dl { margin: 10px 0 0; display: grid; | display: grid; |
| src/styles/closeflow-ai-drafts.css | 586 | .ai-drafts-recognized-card dl { margin: 10px 0 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); | grid-template-columns: repeat(2, minmax(0, 1fr)); |

## Następny krok po zatwierdzeniu mapy

Pakiet UI-2 powinien zrobić dopiero wtedy:

- SemanticIcon jako jedyne źródło ikon standardowych,
- EntityInfoRow dla telefonu, maila, źródła i danych kontaktowych,
- EntityNoteCard / EntityNoteComposer / EntityNoteList,
- EntityDetailShell z regionami dla LeadDetail i ClientDetail,
- guard blokujący nowe lokalne style ikon/notatek/kontaktów.
