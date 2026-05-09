# CloseFlow UI Map Inventory v1

Generated: 2026-05-09T05:55:21.705Z

Scanner: **CLEAN_SCANNER_V4**

Status: **mapa/inwentaryzacja, nie refactor UI**. Ten plik ma pokazać, gdzie dziś żyją ikony, kafelki, sekcje, notatki, akcje i położenia. Dopiero po tej mapie wolno robić przepięcie na wspólne komponenty.

## Wynik skanowania

- Pliki przeskanowane: **287**
- Bezpośrednie importy ikon z lucide-react: **375**
- Użycia StatShortcutCard: **36**
- Lokalne implementacje InfoRow/InfoLine/StatCell/ActionButton: **5**
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
| add | 10 | Plus (src/components/GlobalQuickActions.tsx:26, użycia: 3)<br>Plus (src/pages/CaseDetail.tsx:26, użycia: 2)<br>Plus (src/pages/Cases.tsx:6, użycia: 2)<br>Plus (src/pages/ClientDetail.tsx:46, użycia: 1)<br>Plus (src/pages/Clients.tsx:3, użycia: 1)<br>Plus (src/pages/Dashboard.tsx:7, użycia: 1)<br>Plus (src/pages/LeadDetail.tsx:12, użycia: 1)<br>Plus (src/pages/ResponseTemplates.tsx:2, użycia: 2)<br>Plus (src/pages/Templates.tsx:2, użycia: 3)<br>Plus (src/pages/Today.tsx:56, użycia: 0) |
| ai | 14 | Sparkles (src/components/Layout.tsx:25, użycia: 0)<br>Sparkles (src/components/LeadAiFollowupDraft.tsx:2, użycia: 2)<br>Sparkles (src/components/LeadAiNextAction.tsx:2, użycia: 2)<br>Sparkles (src/components/QuickAiCapture.tsx:8, użycia: 2)<br>Bot (src/pages/AdminAiSettings.tsx:2, użycia: 1)<br>Sparkles (src/pages/AiDrafts.tsx:11, użycia: 2)<br>Sparkles (src/pages/Billing.tsx:30, użycia: 2)<br>Sparkles (src/pages/Calendar.tsx:15, użycia: 1)<br>Sparkles (src/pages/Cases.tsx:6, użycia: 1)<br>Sparkles (src/pages/ClientDetail.tsx:46, użycia: 2)<br>Sparkles (src/pages/LeadDetail.tsx:12, użycia: 1)<br>Sparkles (src/pages/Leads.tsx:7, użycia: 1) |
| auth | 5 | LogOut (src/components/EmailVerificationGate.tsx:2, użycia: 1)<br>LogOut (src/components/Layout.tsx:25, użycia: 2)<br>LogOut (src/pages/Dashboard.tsx:7, użycia: 1)<br>LogIn (src/pages/Login.tsx:32, użycia: 1)<br>LogOut (src/pages/Settings.tsx:15, użycia: 1) |
| case | 8 | Briefcase (src/components/Layout.tsx:25, użycia: 0)<br>Briefcase (src/pages/Activity.tsx:5, użycia: 1)<br>Briefcase (src/pages/ClientDetail.tsx:46, użycia: 3)<br>Briefcase (src/pages/Clients.tsx:3, użycia: 0)<br>Briefcase (src/pages/LeadDetail.tsx:12, użycia: 5)<br>Briefcase (src/pages/Leads.tsx:7, użycia: 0)<br>Briefcase (src/pages/Login.tsx:32, użycia: 0)<br>Briefcase (src/pages/Today.tsx:56, użycia: 2) |
| close | 11 | X (src/components/Layout.tsx:25, użycia: 1)<br>X (src/components/lead-picker.tsx:2, użycia: 1)<br>X (src/components/PwaInstallPrompt.tsx:3, użycia: 1)<br>X (src/components/topic-contact-picker.tsx:2, użycia: 1)<br>X (src/components/ui/dialog.tsx:3, użycia: 1)<br>OctagonXIcon (src/components/ui/sonner.tsx:5, użycia: 1)<br>XCircle (src/pages/AiDrafts.tsx:11, użycia: 0)<br>ExternalLink (src/pages/CaseDetail.tsx:26, użycia: 1)<br>X (src/pages/CaseDetail.tsx:26, użycia: 0)<br>ExternalLink (src/pages/Cases.tsx:6, użycia: 1)<br>X (src/pages/ClientPortal.tsx:6, użycia: 1) |
| company_property | 2 | Building2 (src/pages/ClientDetail.tsx:46, użycia: 0)<br>Building2 (src/pages/Settings.tsx:15, użycia: 1) |
| copy | 9 | ClipboardList (src/components/GlobalQuickActions.tsx:26, użycia: 1)<br>Copy (src/components/LeadAiFollowupDraft.tsx:2, użycia: 1)<br>ClipboardList (src/components/LeadAiNextAction.tsx:2, użycia: 1)<br>Copy (src/components/LeadAiNextAction.tsx:2, użycia: 1)<br>Clipboard (src/pages/AiDrafts.tsx:11, użycia: 0)<br>Copy (src/pages/CaseDetail.tsx:26, użycia: 1)<br>Copy (src/pages/ClientDetail.tsx:46, użycia: 1)<br>Copy (src/pages/ResponseTemplates.tsx:2, użycia: 2)<br>Copy (src/pages/Templates.tsx:2, użycia: 1) |
| delete | 13 | Trash2 (src/pages/AiDrafts.tsx:11, użycia: 0)<br>Trash2 (src/pages/Calendar.tsx:15, użycia: 1)<br>Trash2 (src/pages/CaseDetail.tsx:26, użycia: 0)<br>Trash2 (src/pages/Cases.tsx:6, użycia: 1)<br>Trash2 (src/pages/ClientDetail.tsx:46, użycia: 2)<br>Trash2 (src/pages/Clients.tsx:3, użycia: 2)<br>Trash2 (src/pages/LeadDetail.tsx:12, użycia: 0)<br>Trash2 (src/pages/Leads.tsx:7, użycia: 2)<br>Trash2 (src/pages/NotificationsCenter.tsx:2, użycia: 1)<br>Trash2 (src/pages/Tasks.tsx:38, użycia: 0)<br>Trash2 (src/pages/TasksStable.tsx:20, użycia: 1)<br>Trash2 (src/pages/Templates.tsx:2, użycia: 2) |
| edit | 5 | CreditCard (src/components/Layout.tsx:25, użycia: 0)<br>Pencil (src/pages/AiDrafts.tsx:11, użycia: 0)<br>CreditCard (src/pages/Billing.tsx:30, użycia: 1)<br>Pencil (src/pages/ClientDetail.tsx:46, użycia: 2)<br>Edit2 (src/pages/LeadDetail.tsx:12, użycia: 1) |
| email | 8 | MailCheck (src/components/EmailVerificationGate.tsx:2, użycia: 1)<br>Mail (src/pages/ClientDetail.tsx:46, użycia: 0)<br>Mail (src/pages/LeadDetail.tsx:12, użycia: 1)<br>Mail (src/pages/Leads.tsx:7, użycia: 0)<br>Mail (src/pages/Login.tsx:32, użycia: 2)<br>Mail (src/pages/NotificationsCenter.tsx:2, użycia: 1)<br>Mail (src/pages/Settings.tsx:15, użycia: 1)<br>Mail (src/pages/SupportCenter.tsx:2, użycia: 2) |
| event | 12 | Calendar (src/components/Layout.tsx:25, użycia: 0)<br>CalendarDays (src/lib/options.ts:1, użycia: 0)<br>CalendarClock (src/pages/Activity.tsx:5, użycia: 0)<br>CalendarClock (src/pages/AiDrafts.tsx:11, użycia: 0)<br>CalendarClock (src/pages/Billing.tsx:30, użycia: 0)<br>CalendarClock (src/pages/CaseDetail.tsx:26, użycia: 2)<br>Calendar (src/pages/ClientDetail.tsx:46, użycia: 0)<br>Calendar (src/pages/LeadDetail.tsx:12, użycia: 2)<br>CalendarDays (src/pages/Login.tsx:32, użycia: 0)<br>CalendarClock (src/pages/NotificationsCenter.tsx:2, użycia: 1)<br>CalendarDays (src/pages/Settings.tsx:15, użycia: 3)<br>CalendarDays (src/pages/TodayStable.tsx:20, użycia: 4) |
| filter | 3 | Filter (src/pages/Activity.tsx:5, użycia: 1)<br>Filter (src/pages/Dashboard.tsx:7, użycia: 1)<br>Filter (src/pages/NotificationsCenter.tsx:2, użycia: 1) |
| finance | 3 | Wallet (src/pages/Clients.tsx:3, użycia: 0)<br>DollarSign (src/pages/LeadDetail.tsx:12, użycia: 2)<br>WalletCards (src/pages/Settings.tsx:15, użycia: 1) |
| goal | 8 | Target (src/pages/Activity.tsx:5, użycia: 1)<br>Target (src/pages/AiDrafts.tsx:11, użycia: 0)<br>Target (src/pages/ClientDetail.tsx:46, użycia: 3)<br>Target (src/pages/Clients.tsx:3, użycia: 0)<br>Target (src/pages/LeadDetail.tsx:12, użycia: 3)<br>Target (src/pages/Leads.tsx:7, użycia: 0)<br>Target (src/pages/Login.tsx:32, użycia: 0)<br>Target (src/pages/NotificationsCenter.tsx:2, użycia: 1) |
| loading | 26 | Loader2 (src/components/confirm-dialog.tsx:1, użycia: 1)<br>Loader2 (src/components/ContextNoteDialog.tsx:2, użycia: 1)<br>Loader2 (src/components/EmailVerificationGate.tsx:2, użycia: 3)<br>Loader2 (src/components/EventCreateDialog.tsx:2, użycia: 1)<br>Loader2 (src/components/LeadAiFollowupDraft.tsx:2, użycia: 1)<br>Loader2 (src/components/LeadAiNextAction.tsx:2, użycia: 2)<br>Loader2 (src/components/quick-lead/QuickLeadCaptureModal.tsx:2, użycia: 2)<br>Loader2 (src/components/QuickAiCapture.tsx:8, użycia: 1)<br>Loader2 (src/components/TaskCreateDialog.tsx:2, użycia: 1)<br>Loader2Icon (src/components/ui/sonner.tsx:5, użycia: 1)<br>Loader2 (src/pages/Activity.tsx:5, użycia: 1)<br>Loader2 (src/pages/AiDrafts.tsx:11, użycia: 1) |
| navigation | 26 | ChevronRight (src/components/Layout.tsx:25, użycia: 1)<br>ChevronLeft (src/components/sidebar-mini-calendar.tsx:17, użycia: 1)<br>ChevronRight (src/components/sidebar-mini-calendar.tsx:17, użycia: 1)<br>ChevronRight (src/components/ui/dropdown-menu.tsx:3, użycia: 1)<br>ChevronDownIcon (src/components/ui/select.tsx:5, użycia: 2)<br>ChevronUpIcon (src/components/ui/select.tsx:5, użycia: 1)<br>ArrowUpRight (src/pages/Activity.tsx:5, użycia: 1)<br>ArrowRight (src/pages/Billing.tsx:30, użycia: 1)<br>ChevronLeft (src/pages/Calendar.tsx:15, użycia: 1)<br>ChevronRight (src/pages/Calendar.tsx:15, użycia: 1)<br>ArrowLeft (src/pages/CaseDetail.tsx:26, użycia: 2)<br>ArrowRight (src/pages/CaseDetail.tsx:26, użycia: 1) |
| note | 14 | MessageSquareText (src/components/Layout.tsx:25, użycia: 0)<br>FileText (src/lib/options.ts:1, użycia: 0)<br>FileText (src/pages/Activity.tsx:5, użycia: 1)<br>FileText (src/pages/AiDrafts.tsx:11, użycia: 0)<br>FileText (src/pages/CaseDetail.tsx:26, użycia: 2)<br>StickyNote (src/pages/CaseDetail.tsx:26, użycia: 1)<br>FileText (src/pages/Cases.tsx:6, użycia: 0)<br>FileText (src/pages/ClientDetail.tsx:46, użycia: 2)<br>FileText (src/pages/ClientPortal.tsx:6, użycia: 1)<br>FileText (src/pages/LeadDetail.tsx:12, użycia: 1)<br>FileText (src/pages/Leads.tsx:7, użycia: 0)<br>MessageSquareText (src/pages/ResponseTemplates.tsx:2, użycia: 2) |
| notification | 9 | Bell (src/components/Layout.tsx:25, użycia: 0)<br>Bell (src/pages/Activity.tsx:5, użycia: 0)<br>Bell (src/pages/Calendar.tsx:15, użycia: 0)<br>BellRing (src/pages/Login.tsx:32, użycia: 0)<br>Bell (src/pages/NotificationsCenter.tsx:2, użycia: 3)<br>BellRing (src/pages/NotificationsCenter.tsx:2, użycia: 2)<br>Bell (src/pages/Settings.tsx:15, użycia: 1)<br>Bell (src/pages/Tasks.tsx:38, użycia: 0)<br>Bell (src/pages/Today.tsx:56, użycia: 3) |
| person | 12 | Users (src/components/Layout.tsx:25, użycia: 0)<br>UserRound (src/lib/options.ts:1, użycia: 0)<br>UserRound (src/pages/Activity.tsx:5, użycia: 0)<br>UserRound (src/pages/CaseDetail.tsx:26, użycia: 1)<br>UserRound (src/pages/ClientDetail.tsx:46, użycia: 1)<br>UserRound (src/pages/Clients.tsx:3, użycia: 2)<br>Users (src/pages/Dashboard.tsx:7, użycia: 2)<br>UserRound (src/pages/LeadDetail.tsx:12, użycia: 0)<br>User (src/pages/Login.tsx:32, użycia: 1)<br>User (src/pages/Settings.tsx:15, użycia: 2)<br>Users (src/pages/Settings.tsx:15, użycia: 1)<br>UserRound (src/pages/TodayStable.tsx:20, użycia: 4) |
| phone | 5 | Smartphone (src/components/PwaInstallPrompt.tsx:3, użycia: 1)<br>Phone (src/lib/options.ts:1, użycia: 0)<br>Phone (src/pages/ClientDetail.tsx:46, użycia: 0)<br>Phone (src/pages/LeadDetail.tsx:12, użycia: 1)<br>Smartphone (src/pages/Settings.tsx:15, użycia: 1) |
| pin | 1 | Pin (src/pages/ClientDetail.tsx:46, użycia: 1) |
| refresh | 9 | RefreshCcw (src/components/EmailVerificationGate.tsx:2, użycia: 1)<br>RefreshCw (src/pages/AdminAiSettings.tsx:2, użycia: 1)<br>RefreshCw (src/pages/Billing.tsx:30, użycia: 1)<br>RotateCcw (src/pages/Clients.tsx:3, użycia: 2)<br>RotateCcw (src/pages/Leads.tsx:7, użycia: 2)<br>RotateCcw (src/pages/NotificationsCenter.tsx:2, użycia: 1)<br>RefreshCw (src/pages/Settings.tsx:15, użycia: 2)<br>RefreshCcw (src/pages/TasksStable.tsx:20, użycia: 1)<br>RefreshCcw (src/pages/TodayStable.tsx:20, użycia: 1) |
| risk_alert | 22 | AlertTriangle (src/components/Layout.tsx:25, użycia: 1)<br>TriangleAlertIcon (src/components/ui/sonner.tsx:5, użycia: 1)<br>AlertTriangle (src/pages/AdminAiSettings.tsx:2, użycia: 1)<br>AlertTriangle (src/pages/AiDrafts.tsx:11, użycia: 1)<br>AlertTriangle (src/pages/Billing.tsx:30, użycia: 1)<br>AlertCircle (src/pages/CaseDetail.tsx:26, użycia: 3)<br>AlertTriangle (src/pages/Cases.tsx:6, użycia: 0)<br>AlertTriangle (src/pages/ClientDetail.tsx:46, użycia: 1)<br>AlertCircle (src/pages/ClientPortal.tsx:6, użycia: 2)<br>AlertTriangle (src/pages/Clients.tsx:3, użycia: 0)<br>AlertCircle (src/pages/Dashboard.tsx:7, użycia: 1)<br>AlertTriangle (src/pages/Leads.tsx:7, użycia: 0) |
| search | 14 | Search (src/components/lead-picker.tsx:2, użycia: 1)<br>Search (src/components/topic-contact-picker.tsx:2, użycia: 1)<br>Search (src/pages/Activity.tsx:5, użycia: 1)<br>Search (src/pages/AiDrafts.tsx:11, użycia: 1)<br>Search (src/pages/Cases.tsx:6, użycia: 1)<br>Search (src/pages/Clients.tsx:3, użycia: 1)<br>Search (src/pages/Dashboard.tsx:7, użycia: 2)<br>Search (src/pages/Leads.tsx:7, użycia: 0)<br>Search (src/pages/NotificationsCenter.tsx:2, użycia: 1)<br>Search (src/pages/ResponseTemplates.tsx:2, użycia: 1)<br>Search (src/pages/SupportCenter.tsx:2, użycia: 2)<br>Search (src/pages/Tasks.tsx:38, użycia: 2) |
| send | 3 | Send (src/components/EmailVerificationGate.tsx:2, użycia: 1)<br>Send (src/pages/CaseDetail.tsx:26, użycia: 1)<br>Send (src/pages/SupportCenter.tsx:2, użycia: 2) |
| settings | 5 | Settings (src/components/Layout.tsx:25, użycia: 0)<br>Settings (src/pages/Dashboard.tsx:7, użycia: 1)<br>Settings2 (src/pages/NotificationsCenter.tsx:2, użycia: 1)<br>SlidersHorizontal (src/pages/Settings.tsx:15, użycia: 1)<br>SlidersHorizontal (src/pages/TodayStable.tsx:20, użycia: 1) |
| task_status | 42 | CheckCircle2 (src/components/Layout.tsx:25, użycia: 1)<br>CheckSquare (src/components/Layout.tsx:25, użycia: 0)<br>Check (src/components/lead-picker.tsx:2, użycia: 1)<br>CheckCircle2 (src/components/LeadAiFollowupDraft.tsx:2, użycia: 1)<br>CheckCircle2 (src/components/LeadAiNextAction.tsx:2, użycia: 1)<br>ShieldCheck (src/components/PwaInstallPrompt.tsx:3, użycia: 1)<br>Check (src/components/topic-contact-picker.tsx:2, użycia: 1)<br>CheckIcon (src/components/ui/checkbox.tsx:6, użycia: 1)<br>Check (src/components/ui/dropdown-menu.tsx:3, użycia: 1)<br>CheckIcon (src/components/ui/select.tsx:5, użycia: 1)<br>CircleCheckIcon (src/components/ui/sonner.tsx:5, użycia: 1)<br>CheckCircle2 (src/pages/Activity.tsx:5, użycia: 0) |
| time | 14 | Clock (src/pages/Activity.tsx:5, użycia: 0)<br>Clock (src/pages/AiDrafts.tsx:11, użycia: 1)<br>Clock (src/pages/CaseDetail.tsx:26, użycia: 2)<br>Clock (src/pages/Cases.tsx:6, użycia: 0)<br>Clock (src/pages/ClientDetail.tsx:46, użycia: 2)<br>Clock (src/pages/ClientPortal.tsx:6, użycia: 1)<br>Clock (src/pages/Dashboard.tsx:7, użycia: 1)<br>Clock (src/pages/LeadDetail.tsx:12, użycia: 4)<br>Clock3 (src/pages/Leads.tsx:7, użycia: 1)<br>Clock3 (src/pages/NotificationsCenter.tsx:2, użycia: 1)<br>Clock3 (src/pages/SupportCenter.tsx:2, użycia: 1)<br>Clock (src/pages/Tasks.tsx:38, użycia: 0) |
| unclassified | 61 | LayoutDashboard (src/components/Layout.tsx:25, użycia: 0)<br>History (src/components/Layout.tsx:25, użycia: 0)<br>LifeBuoy (src/components/Layout.tsx:25, użycia: 0)<br>Menu (src/components/Layout.tsx:25, użycia: 1)<br>FolderKanban (src/components/Layout.tsx:25, użycia: 0)<br>MessageSquare (src/components/LeadAiFollowupDraft.tsx:2, użycia: 1)<br>Download (src/components/PwaInstallPrompt.tsx:3, użycia: 1)<br>Mic (src/components/quick-lead/QuickLeadCaptureModal.tsx:2, użycia: 1)<br>Wand2 (src/components/quick-lead/QuickLeadCaptureModal.tsx:2, użycia: 1)<br>Mic (src/components/QuickAiCapture.tsx:8, użycia: 1)<br>MicOff (src/components/QuickAiCapture.tsx:8, użycia: 1)<br>Circle (src/components/ui/dropdown-menu.tsx:3, użycia: 1) |
| view | 1 | Eye (src/pages/ClientDetail.tsx:46, użycia: 1) |

## Użycia kafelków / StatShortcutCard

| Plik | Linia | Fragment |
|---|---:|---|
| src/pages/Activity.tsx | 709 | <StatShortcutCard label="Wszystkie" value={metrics.all} icon={FileText} active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} iconClassName="bg-slate-100 text-slate-500" /><br>          <StatShortcutCard label="Dzisiaj" value={metrics.today} icon={Clock} active={activeFilter === 'today'} onClick={() => setActiveFilter('today')} iconClassName="bg-blue-50 text-blue-500" valueClassName="text-blue-600" /><br>  |
| src/pages/Activity.tsx | 710 | <StatShortcutCard label="Dzisiaj" value={metrics.today} icon={Clock} active={activeFilter === 'today'} onClick={() => setActiveFilter('today')} iconClassName="bg-blue-50 text-blue-500" valueClassName="text-blue-600" /><br>          <StatShortcutCard label="Leady" value={metrics.leads} icon={Target} active={activeFilter === 'lead'} onClick={() => setActiveFilter('lead')} iconClassName="bg-indigo-50 text-indigo-500" /><br>   |
| src/pages/Activity.tsx | 711 | <StatShortcutCard label="Leady" value={metrics.leads} icon={Target} active={activeFilter === 'lead'} onClick={() => setActiveFilter('lead')} iconClassName="bg-indigo-50 text-indigo-500" /><br>          <StatShortcutCard label="Sprawy" value={metrics.cases} icon={Briefcase} active={activeFilter === 'case'} onClick={() => setActiveFilter('case')} iconClassName="bg-slate-100 text-slate-500" /><br>          <StatShortcutCard l |
| src/pages/Activity.tsx | 712 | <StatShortcutCard label="Sprawy" value={metrics.cases} icon={Briefcase} active={activeFilter === 'case'} onClick={() => setActiveFilter('case')} iconClassName="bg-slate-100 text-slate-500" /><br>          <StatShortcutCard label="Zadania" value={metrics.tasks} icon={ListChecks} active={activeFilter === 'task'} onClick={() => setActiveFilter('task')} iconClassName="bg-emerald-50 text-emerald-500" valueClassName="text-eme |
| src/pages/Activity.tsx | 713 | <StatShortcutCard label="Zadania" value={metrics.tasks} icon={ListChecks} active={activeFilter === 'task'} onClick={() => setActiveFilter('task')} iconClassName="bg-emerald-50 text-emerald-500" valueClassName="text-emerald-600" /><br>          <StatShortcutCard label="Wymaga uwagi" value={metrics.attention} icon={Bell} active={activeFilter === 'attention'} onClick={() => setActiveFilter('attention')} tone="red" /><br>      |
| src/pages/Activity.tsx | 714 | <StatShortcutCard label="Wymaga uwagi" value={metrics.attention} icon={Bell} active={activeFilter === 'attention'} onClick={() => setActiveFilter('attention')} tone="red" /><br>        </section><br><br>        <div className="activity-vnext-shell"><br>          <section className="activity-main-column"><br>            <div className="activity-toolbar-card"><br>              <div className="activity-filter-pills" aria-label="Filtry ak |
| src/pages/Cases.tsx | 658 | <StatShortcutCard<br>            label="W realizacji"<br>            value={stats.total}<br>            icon={FileText}<br>            tone="blue"<br>            active={caseView === 'all'}<br>            onClick={() => setCaseView('all')}<br>          /><br>          <StatShortcutCard<br>            label="Czeka na klienta"<br>            value={stats.waiting}<br>            icon={Clock} |
| src/pages/Cases.tsx | 666 | <StatShortcutCard<br>            label="Czeka na klienta"<br>            value={stats.waiting}<br>            icon={Clock}<br>            tone="amber"<br>            active={caseView === 'waiting' \|\| caseView === 'approval'}<br>            onClick={() => toggleCaseView('waiting')}<br>          /><br>          <StatShortcutCard<br>            label="Zablokowane"<br>            value={stats.blocked}<br>            icon={AlertTriangle} |
| src/pages/Cases.tsx | 674 | <StatShortcutCard<br>            label="Zablokowane"<br>            value={stats.blocked}<br>            icon={AlertTriangle}<br>            tone="red"<br>            active={caseView === 'blocked'}<br>            onClick={() => toggleCaseView('blocked')}<br>          /><br>          <StatShortcutCard<br>            label="Gotowe"<br>            value={stats.ready}<br>            icon={CheckCircle2} |
| src/pages/Cases.tsx | 682 | <StatShortcutCard<br>            label="Gotowe"<br>            value={stats.ready}<br>            icon={CheckCircle2}<br>            tone="green"<br>            active={caseView === 'ready'}<br>            onClick={() => toggleCaseView('ready')}<br>          /><br>        </div><br><br>        <div className="layout-list"><br>          <div className="stack"> |
| src/pages/Clients.tsx | 486 | <StatShortcutCard<br>            label="Aktywni"<br>            value={activeCount}<br>            icon={Target}<br>            active={!showArchived}<br>            onClick={() => setShowArchived(false)}<br>            title="Pokaż aktywnych klientów"<br>            ariaLabel="Pokaż aktywnych klientów"<br>            tone="blue"<br>            helper="z otwartą sprawą"<br>          /><br>          <StatShortcutCard |
| src/pages/Clients.tsx | 497 | <StatShortcutCard<br>            label="Bez sprawy"<br>            value={clientsWithoutCases}<br>            icon={Briefcase}<br>            onClick={() => setShowArchived(false)}<br>            title="Pokaż klientów bez sprawy"<br>            ariaLabel="Pokaż klientów bez sprawy"<br>            tone="neutral"<br>            helper="tylko kontakt"<br>          /><br>          <StatShortcutCard<br>            label="Wartość" |
| src/pages/Clients.tsx | 507 | <StatShortcutCard<br>            label="Wartość"<br>            value={formatClientMoney(relationValue)}<br>            icon={Wallet}<br>            onClick={() => setShowArchived(false)}<br>            title="Pokaż wartość relacji"<br>            ariaLabel="Pokaż wartość relacji"<br>            tone="green"<br>            helper="w relacjach"<br>          /><br>          <StatShortcutCard<br>            label="Bez ruchu" |
| src/pages/Clients.tsx | 517 | <StatShortcutCard<br>            label="Bez ruchu"<br>            value={staleClients}<br>            icon={AlertTriangle}<br>            onClick={() => setShowArchived(false)}<br>            title="Pokaż klientów bez ruchu"<br>            ariaLabel="Pokaż klientów bez ruchu"<br>            tone="red"<br>            helper="do sprawdzenia"<br>          /><br>        </div> |
| src/pages/Leads.tsx | 727 | <StatShortcutCard<br>            label="Wszystkie"<br>            value={stats.total}<br>            icon={Target}<br>            active={quickFilter === 'all' && !valueSortEnabled && !showTrash}<br>            onClick={() => { setShowTrash(false); setQuickFilter('all'); setValueSortEnabled(false); }}<br>            title="Pokaż wszystkie leady"<br>            ariaLabel="Pokaż wszystkie leady"<br>          /><br><br>          <StatShortcutCard<br>   |
| src/pages/Leads.tsx | 737 | <StatShortcutCard<br>            label="Aktywne"<br>            value={stats.active}<br>            icon={TrendingUp}<br>            active={quickFilter === 'active' && !showTrash}<br>            onClick={() => toggleQuickFilter('active')}<br>            title="Pokaż aktywne leady"<br>            ariaLabel="Pokaż aktywne leady"<br>            valueClassName="text-slate-900"<br>            iconClassName="bg-blue-50 text-blue-500"<br>          /> |
| src/pages/Leads.tsx | 749 | <StatShortcutCard<br>            label="Wartość"<br>            value={`${stats.value.toLocaleString('pl-PL')} PLN`}<br>            icon={TrendingUp}<br>            active={valueSortEnabled && !showTrash}<br>            onClick={toggleValueSorting}<br>            title="Sortuj leady po wartości"<br>            ariaLabel="Sortuj leady po wartości"<br>            helper={valueSortEnabled ? 'sortowanie aktywne' : 'kliknij, aby sortować!'}<br>     |
| src/pages/Leads.tsx | 760 | <StatShortcutCard<br>            label="Zagrożone"<br>            value={stats.atRisk}<br>            icon={AlertTriangle}<br>            active={quickFilter === 'at-risk' && !showTrash}<br>            onClick={() => toggleQuickFilter('at-risk')}<br>            title="Pokaż zagrożone leady"<br>            ariaLabel="Pokaż zagrożone leady"<br>            tone="risk"<br>          /><br><br>          <StatShortcutCard |
| src/pages/Leads.tsx | 771 | <StatShortcutCard<br>            label="Historia"<br>            value={stats.linkedToCase}<br>            icon={Briefcase}<br>            active={quickFilter === 'history' && !showTrash}<br>            onClick={() => toggleQuickFilter('history')}<br>            title="Pokaż leady przeniesione do obsługi"<br>            ariaLabel="Pokaż leady przeniesione do obsługi"<br>          /><br>        </div><br><br>        {/* STAGE32_VALUABLE_RELATIONS_RIG |
| src/pages/NotificationsCenter.tsx | 648 | <StatShortcutCard label="Wszystkie" value={metrics.all} icon={BellRing} active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} iconClassName="bg-slate-100 text-slate-500" /><br>          <StatShortcutCard label="Do reakcji" value={metrics.action} icon={ShieldAlert} active={activeFilter === 'action'} onClick={() => setActiveFilter('action')} iconClassName="bg-blue-50 text-blue-500" valueClassName="text-bl |
| src/pages/NotificationsCenter.tsx | 649 | <StatShortcutCard label="Do reakcji" value={metrics.action} icon={ShieldAlert} active={activeFilter === 'action'} onClick={() => setActiveFilter('action')} iconClassName="bg-blue-50 text-blue-500" valueClassName="text-blue-600" /><br>          <StatShortcutCard label="Zaległe" value={metrics.overdue} icon={Clock3} active={activeFilter === 'overdue'} onClick={() => setActiveFilter('overdue')} tone="red" /><br>          <Sta |
| src/pages/NotificationsCenter.tsx | 650 | <StatShortcutCard label="Zaległe" value={metrics.overdue} icon={Clock3} active={activeFilter === 'overdue'} onClick={() => setActiveFilter('overdue')} tone="red" /><br>          <StatShortcutCard label="Dzisiaj" value={metrics.today} icon={CalendarClock} active={activeFilter === 'today'} onClick={() => setActiveFilter('today')} iconClassName="bg-indigo-50 text-indigo-500" /><br>          <StatShortcutCard label="Nadchodząc |
| src/pages/NotificationsCenter.tsx | 651 | <StatShortcutCard label="Dzisiaj" value={metrics.today} icon={CalendarClock} active={activeFilter === 'today'} onClick={() => setActiveFilter('today')} iconClassName="bg-indigo-50 text-indigo-500" /><br>          <StatShortcutCard label="Nadchodzące" value={metrics.upcoming} icon={Bell} active={activeFilter === 'upcoming'} onClick={() => setActiveFilter('upcoming')} iconClassName="bg-slate-100 text-slate-500" /><br>        |
| src/pages/NotificationsCenter.tsx | 652 | <StatShortcutCard label="Nadchodzące" value={metrics.upcoming} icon={Bell} active={activeFilter === 'upcoming'} onClick={() => setActiveFilter('upcoming')} iconClassName="bg-slate-100 text-slate-500" /><br>          <StatShortcutCard label="Odłożone" value={metrics.snoozed} icon={RotateCcw} active={activeFilter === 'snoozed'} onClick={() => setActiveFilter('snoozed')} tone="amber" /><br>          <StatShortcutCard label="P |
| src/pages/NotificationsCenter.tsx | 653 | <StatShortcutCard label="Odłożone" value={metrics.snoozed} icon={RotateCcw} active={activeFilter === 'snoozed'} onClick={() => setActiveFilter('snoozed')} tone="amber" /><br>          <StatShortcutCard label="Przeczytane" value={metrics.read} icon={Check} active={activeFilter === 'read'} onClick={() => setActiveFilter('read')} iconClassName="bg-emerald-50 text-emerald-500" valueClassName="text-emerald-600" /><br>        </ |
| src/pages/NotificationsCenter.tsx | 654 | <StatShortcutCard label="Przeczytane" value={metrics.read} icon={Check} active={activeFilter === 'read'} onClick={() => setActiveFilter('read')} iconClassName="bg-emerald-50 text-emerald-500" valueClassName="text-emerald-600" /><br>        </section><br><br>        <div className="notifications-vnext-shell"><br>          <section className="notifications-main-column"><br>            <div className="notifications-toolbar-card"><br>     |
| src/pages/ResponseTemplates.tsx | 212 | <StatShortcutCard label="Szablony" value={stats.total} icon={Sparkles} iconClassName="app-primary-chip" valueClassName="app-text" /><br>          <StatShortcutCard label="Kategorie" value={stats.categories} icon={MessageSquareText} iconClassName="bg-indigo-500/12 text-indigo-600" valueClassName="app-text" /><br>          <StatShortcutCard label="Tagi" value={stats.tags} icon={Tags} iconClassName="bg-amber-500/12 text-amber |
| src/pages/ResponseTemplates.tsx | 213 | <StatShortcutCard label="Kategorie" value={stats.categories} icon={MessageSquareText} iconClassName="bg-indigo-500/12 text-indigo-600" valueClassName="app-text" /><br>          <StatShortcutCard label="Tagi" value={stats.tags} icon={Tags} iconClassName="bg-amber-500/12 text-amber-600" valueClassName="text-amber-600" /><br>          <StatShortcutCard label="Zmienne" value={stats.withVariables} icon={Copy} iconClassName="bg- |
| src/pages/ResponseTemplates.tsx | 214 | <StatShortcutCard label="Tagi" value={stats.tags} icon={Tags} iconClassName="bg-amber-500/12 text-amber-600" valueClassName="text-amber-600" /><br>          <StatShortcutCard label="Zmienne" value={stats.withVariables} icon={Copy} iconClassName="bg-emerald-500/12 text-emerald-600" valueClassName="text-emerald-600" /><br>        </section><br><br>        <Card className="cf-readable-card border-none app-surface-strong app-shadow" |
| src/pages/ResponseTemplates.tsx | 215 | <StatShortcutCard label="Zmienne" value={stats.withVariables} icon={Copy} iconClassName="bg-emerald-500/12 text-emerald-600" valueClassName="text-emerald-600" /><br>        </section><br><br>        <Card className="cf-readable-card border-none app-surface-strong app-shadow"><br>          <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between"><br>            <div className="relative flex-1"> |
| src/pages/Tasks.tsx | 1363 | <StatShortcutCard<br>              key={stat.id}<br>              label={stat.title}<br>              value={stat.value}<br>              icon={stat.icon}<br>              active={taskScope === stat.id}<br>              onClick={() => activateScope(stat.id)}<br>              tone={stat.tone}<br>              title={`Pokaż: ${stat.title.toLowerCase()}`}<br>            /><br>          ))}<br>        </div> |
| src/pages/TasksStable.tsx | 497 | <StatShortcutCard<br>              key={card.id}<br>              label={card.label}<br>              value={card.value}<br>              icon={card.icon}<br>              active={scope === card.id}<br>              onClick={() => setScope(card.id)}<br>              tone={card.tone}<br>              title={`Pokaż zadania: ${card.label}`}<br>              ariaLabel={`Pokaż zadania: ${card.label}`}<br>            /><br>          ))} |
| src/pages/Templates.tsx | 113 | <StatShortcutCard label="Szablony" value={stats.totalTemplates} icon={Sparkles} iconClassName="bg-emerald-50 text-emerald-700" /><br>      <StatShortcutCard label="Pozycje" value={stats.totalItems} icon={FileText} iconClassName="bg-indigo-50 text-indigo-700" /><br>      <StatShortcutCard label="Obowiązkowe" value={stats.requiredItems} icon={AlertTriangle} iconClassName="bg-amber-50 text-amber-700" valueClassName="text-ambe |
| src/pages/Templates.tsx | 114 | <StatShortcutCard label="Pozycje" value={stats.totalItems} icon={FileText} iconClassName="bg-indigo-50 text-indigo-700" /><br>      <StatShortcutCard label="Obowiązkowe" value={stats.requiredItems} icon={AlertTriangle} iconClassName="bg-amber-50 text-amber-700" valueClassName="text-amber-600" /><br>      <StatShortcutCard label="Akceptacje" value={stats.decisionItems} icon={CheckCircle2} iconClassName="bg-emerald-50 text-e |
| src/pages/Templates.tsx | 115 | <StatShortcutCard label="Obowiązkowe" value={stats.requiredItems} icon={AlertTriangle} iconClassName="bg-amber-50 text-amber-700" valueClassName="text-amber-600" /><br>      <StatShortcutCard label="Akceptacje" value={stats.decisionItems} icon={CheckCircle2} iconClassName="bg-emerald-50 text-emerald-700" valueClassName="text-emerald-600" /><br>    </section><br>  );<br>}<br><br>export default function Templates() {<br>  const { hasAccess |
| src/pages/Templates.tsx | 116 | <StatShortcutCard label="Akceptacje" value={stats.decisionItems} icon={CheckCircle2} iconClassName="bg-emerald-50 text-emerald-700" valueClassName="text-emerald-600" /><br>    </section><br>  );<br>}<br><br>export default function Templates() {<br>  const { hasAccess } = useWorkspace();<br>  const [templates, setTemplates] = useState<TemplateRecord[]>([]);<br>  const [loading, setLoading] = useState(true);<br>  const [searchQuery, setSearchQue |

## Kontrakty akcji encji

| Plik | Linia | Fragment |
|---|---:|---|
| src/pages/CaseDetail.tsx | 87 | const CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CASE = {<br>  entity: 'case',<br>  entityHeaderActionCluster: actionButtonClass('neutral', 'cf-entity-action-cluster'),<br>  activityPanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),<br>  notePanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),<br>  tasksPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),<br>  workItemsPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),<br>  eventsPanelHeader: actionButtonClass('neutral', ' |
| src/pages/ClientDetail.tsx | 98 | const CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CLIENT = {<br>  entity: 'client',<br>  entityHeaderActionCluster: actionButtonClass('neutral', 'cf-entity-action-cluster'),<br>  activityPanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),<br>  notePanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),<br>  tasksPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),<br>  workItemsPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),<br>  eventsPanelHeader: actionButtonClass('neutral |
| src/pages/LeadDetail.tsx | 81 | const CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_LEAD = {<br>  entity: 'lead',<br>  entityHeaderActionCluster: actionButtonClass('neutral', 'cf-entity-action-cluster'),<br>  activityPanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),<br>  notePanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),<br>  tasksPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),<br>  workItemsPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),<br>  eventsPanelHeader: actionButtonClass('neutral', ' |

## Lokalne implementacje do przepięcia

Te elementy są kandydatami do przeniesienia do wspólnego UI systemu.

| Nazwa | Plik | Linia |
|---|---|---:|
| ClientMultiContactField | src/pages/ClientDetail.tsx | 591 |
| InfoRow | src/pages/ClientDetail.tsx | 648 |
| StatCell | src/pages/ClientDetail.tsx | 667 |
| InfoLine | src/pages/LeadDetail.tsx | 403 |
| LeadActionButton | src/pages/LeadDetail.tsx | 414 |

## Regiony / data attributes

| Plik | Linia | Wartość |
|---|---:|---|
| src/components/entity-actions.tsx | 130 | entity-header-action-cluster |
| src/components/entity-actions.tsx | 152 | danger-action-zone |
| src/pages/Cases.tsx | 752 | amber |
| src/pages/Clients.tsx | 559 | amber |
| src/pages/Clients.tsx | 559 | green |
| src/pages/Clients.tsx | 560 | blue |
| src/pages/Dashboard.tsx | 228 | logout |
| src/pages/Dashboard.tsx | 328 | error |
| src/pages/Dashboard.tsx | 335 | error |
| src/pages/Leads.tsx | 866 | blue |
| src/pages/Leads.tsx | 868 | green |
| src/pages/Templates.tsx | 411 | red |
| src/pages/TodayStable.tsx | 515 | true |
| src/pages/TodayStable.tsx | 1014 | error |
| src/styles/closeflow-alert-severity.css | 63 | error |
| src/styles/closeflow-alert-severity.css | 69 | warning |
| src/styles/closeflow-alert-severity.css | 75 | info |
| src/styles/closeflow-alert-severity.css | 81 | success |
| src/styles/closeflow-alert-severity.css | 104 | error |
| src/styles/closeflow-alert-severity.css | 110 | warning |
| src/styles/closeflow-alert-severity.css | 116 | info |
| src/styles/closeflow-alert-severity.css | 122 | success |
| src/styles/closeflow-alert-severity.css | 138 | error |
| src/styles/closeflow-alert-severity.css | 143 | warning |
| src/styles/closeflow-alert-severity.css | 148 | info |
| src/styles/closeflow-alert-severity.css | 153 | success |
| src/styles/closeflow-entity-type-tokens.css | 3 | lead |
| src/styles/closeflow-entity-type-tokens.css | 24 | event |
| src/styles/closeflow-entity-type-tokens.css | 31 | task |
| src/styles/closeflow-entity-type-tokens.css | 38 | lead |
| src/styles/closeflow-form-actions.css | 57 | danger |
| src/styles/closeflow-form-actions.css | 58 | danger |
| src/styles/closeflow-form-actions.css | 99 | danger |
| src/styles/closeflow-form-actions.css | 100 | danger |
| src/styles/closeflow-list-row-tokens.css | 84 | blue |
| src/styles/closeflow-list-row-tokens.css | 85 | blue |
| src/styles/closeflow-list-row-tokens.css | 91 | green |
| src/styles/closeflow-list-row-tokens.css | 92 | green |
| src/styles/closeflow-list-row-tokens.css | 98 | amber |
| src/styles/closeflow-list-row-tokens.css | 99 | amber |
| src/styles/closeflow-list-row-tokens.css | 105 | red |
| src/styles/closeflow-list-row-tokens.css | 106 | red |
| src/styles/closeflow-list-row-tokens.css | 129 | green |
| src/styles/closeflow-list-row-tokens.css | 133 | amber |
| src/styles/closeflow-list-row-tokens.css | 137 | red |
| src/styles/closeflow-list-row-tokens.css | 141 | blue |
| src/styles/closeflow-stage16c-tasks-cases-parity.css | 124 | danger |
| src/styles/eliteflow-semantic-badges-and-today-sections.css | 48 | true |
| src/styles/eliteflow-semantic-badges-and-today-sections.css | 60 | danger |
| src/styles/eliteflow-semantic-badges-and-today-sections.css | 68 | event |
| src/styles/eliteflow-semantic-badges-and-today-sections.css | 76 | task |
| src/styles/eliteflow-semantic-badges-and-today-sections.css | 84 | note |
| src/styles/eliteflow-semantic-badges-and-today-sections.css | 92 | lead |
| src/styles/eliteflow-semantic-badges-and-today-sections.css | 100 | case |
| src/styles/eliteflow-semantic-badges-and-today-sections.css | 108 | client |
| src/styles/eliteflow-semantic-badges-and-today-sections.css | 116 | neutral |

## Położenie / layout CSS

| Plik | Linia | Selektor/kontekst | Reguła |
|---|---:|---|---|
| src/index.css | 46 | [data-skin="forteca-light"] { --color-primary: #2563eb; --color-primary-foreground: #ffffff; --app-bg: #f8fafc; --app-surface: #f8fafc; --app-surface-strong: #ffffff; --app-surface-muted: #f1f5f9; --app-border: #e2e8f0; | --app-border: #e2e8f0; |
| src/index.css | 62 | [data-skin="forteca-dark"] { --color-primary: #60a5fa; --color-primary-foreground: #08111f; --app-bg: #0f172a; --app-surface: #111827; --app-surface-strong: #1e293b; --app-surface-muted: #334155; --app-border: #475569; | --app-border: #475569; |
| src/index.css | 78 | [data-skin="midnight"] { --color-primary: #22c55e; --color-primary-foreground: #04110a; --app-bg: #020617; --app-surface: #0f172a; --app-surface-strong: #111827; --app-surface-muted: #1f2937; --app-border: #334155; | --app-border: #334155; |
| src/index.css | 94 | [data-skin="sandstone"] { --color-primary: #d97706; --color-primary-foreground: #fffdf8; --app-bg: #f8f5ef; --app-surface: #f3ede2; --app-surface-strong: #fffdf8; --app-surface-muted: #e7dcc7; --app-border: #c8b594; | --app-border: #c8b594; |
| src/index.css | 153 | .glass { @apply backdrop-blur-md; background-color: color-mix(in srgb, var(--app-surface-strong) 82%, transparent); border: 1px solid color-mix(in srgb, var(--app-border) 65%, transparent); | border: 1px solid color-mix(in srgb, var(--app-border) 65%, transparent); |
| src/index.css | 296 | .right-card.activity-right-card { background: #ffffff !important; color: #0f172a !important; border: 1px solid rgba(148, 163, 184, 0.42) !important; | border: 1px solid rgba(148, 163, 184, 0.42) !important; |
| src/index.css | 327 | .ai-drafts-right-card button { background: #ffffff !important; border: 1px solid #cbd5e1 !important; | border: 1px solid #cbd5e1 !important; |
| src/index.css | 351 | :where(.case-detail-right-card.case-detail-create-action-card, [data-case-create-actions-panel="true"]) { background: linear-gradient(180deg, rgba(255, 255, 255, 0.99), rgba(248, 250, 252, 0.97)) !important; color: #0f17 | border: 1px solid rgba(226, 232, 240, 0.95) !important; |
| src/styles/admin-tools.css | 2 | .admin-debug-toolbar { position: relative; | position: relative; |
| src/styles/admin-tools.css | 10 | z-index: 2147483000; isolation: isolate; display: inline-flex; align-items: center; gap: 6px; margin-left: auto; padding: 4px; border: 1px solid rgba(148, 163, 184, 0.36); | border: 1px solid rgba(148, 163, 184, 0.36); |
| src/styles/admin-tools.css | 27 | .admin-preset-grid button { border: 1px solid rgba(148, 163, 184, 0.32); | border: 1px solid rgba(148, 163, 184, 0.32); |
| src/styles/admin-tools.css | 47 | .admin-tool-popover { position: absolute; | position: absolute; |
| src/styles/admin-tools.css | 52 | .admin-tool-popover { position: absolute; z-index: 2147483003; top: calc(100% + 8px); right: 0; width: 320px; display: grid; | display: grid; |
| src/styles/admin-tools.css | 55 | z-index: 2147483003; top: calc(100% + 8px); right: 0; width: 320px; display: grid; gap: 10px; padding: 12px; border: 1px solid rgba(148, 163, 184, 0.32); | border: 1px solid rgba(148, 163, 184, 0.32); |
| src/styles/admin-tools.css | 68 | .admin-tool-row { display: flex; | display: flex; |
| src/styles/admin-tools.css | 78 | .admin-button-list { display: grid; | display: grid; |
| src/styles/admin-tools.css | 85 | .admin-button-row { display: grid; | display: grid; |
| src/styles/admin-tools.css | 86 | .admin-button-row { display: grid; grid-template-columns: minmax(0, 1fr) 130px; | grid-template-columns: minmax(0, 1fr) 130px; |
| src/styles/admin-tools.css | 90 | .admin-button-row { display: grid; grid-template-columns: minmax(0, 1fr) 130px; gap: 8px; align-items: center; padding: 8px; border: 1px solid rgba(148, 163, 184, 0.22); | border: 1px solid rgba(148, 163, 184, 0.22); |
| src/styles/admin-tools.css | 103 | .admin-tool-dialog-backdrop { position: fixed; | position: fixed; |
| src/styles/admin-tools.css | 106 | .admin-tool-dialog-backdrop { position: fixed; inset: 0; z-index: 2147483001; display: flex; | display: flex; |
| src/styles/admin-tools.css | 118 | .admin-tool-dialog { position: relative; | position: relative; |
| src/styles/admin-tools.css | 124 | .admin-tool-dialog { position: relative; z-index: 2147483002; width: min(520px, 96vw); max-height: calc(100vh - 112px); overflow: auto; will-change: transform; display: grid; | display: grid; |
| src/styles/admin-tools.css | 138 | .admin-tool-dialog label { display: grid; | display: grid; |
| src/styles/admin-tools.css | 149 | .admin-tool-popover select { width: 100%; border: 1px solid rgba(148, 163, 184, 0.38); | border: 1px solid rgba(148, 163, 184, 0.38); |
| src/styles/admin-tools.css | 161 | .admin-target-card { display: grid; | display: grid; |
| src/styles/admin-tools.css | 164 | .admin-target-card { display: grid; gap: 6px; padding: 10px; border: 1px solid rgba(96, 165, 250, 0.42); | border: 1px solid rgba(96, 165, 250, 0.42); |
| src/styles/admin-tools.css | 170 | .admin-preset-grid { display: flex; | display: flex; |
| src/styles/admin-tools.css | 175 | @media (max-width: 900px) { | @media (max-width: 900px) { |
| src/styles/admin-tools.css | 177 | .admin-debug-toolbar { max-width: 100%; | max-width: 100%; |
| src/styles/admin-tools.css | 210 | @media (max-height: 720px) { | @media (max-height: 720px) { |
| src/styles/admin-tools.css | 220 | @media (max-height: 560px) { | @media (max-height: 560px) { |
| src/styles/admin-tools.css | 232 | .admin-tool-mode-hint { position: fixed; | position: fixed; |
| src/styles/admin-tools.css | 236 | .admin-tool-mode-hint { position: fixed; right: 24px; bottom: 24px; z-index: 2147483004; max-width: min(420px, calc(100vw - 48px)); | max-width: min(420px, calc(100vw - 48px)); |
| src/styles/admin-tools.css | 238 | .admin-tool-mode-hint { position: fixed; right: 24px; bottom: 24px; z-index: 2147483004; max-width: min(420px, calc(100vw - 48px)); padding: 10px 12px; border: 1px solid rgba(96, 165, 250, 0.42); | border: 1px solid rgba(96, 165, 250, 0.42); |
| src/styles/admin-tools.css | 247 | .admin-tool-save-toast { position: fixed; | position: fixed; |
| src/styles/admin-tools.css | 251 | .admin-tool-save-toast { position: fixed; right: 24px; bottom: 24px; z-index: 2147483005; max-width: min(420px, calc(100vw - 48px)); | max-width: min(420px, calc(100vw - 48px)); |
| src/styles/admin-tools.css | 253 | .admin-tool-save-toast { position: fixed; right: 24px; bottom: 24px; z-index: 2147483005; max-width: min(420px, calc(100vw - 48px)); padding: 10px 12px; border: 1px solid rgba(34, 197, 94, 0.48); | border: 1px solid rgba(34, 197, 94, 0.48); |
| src/styles/admin-tools.css | 262 | .admin-tool-quick-editor { position: fixed; | position: fixed; |
| src/styles/admin-tools.css | 269 | position: fixed; right: 24px; bottom: 24px; z-index: 2147483006; width: min(480px, calc(100vw - 48px)); max-height: min(720px, calc(100vh - 48px)); overflow: auto; display: grid; | display: grid; |
| src/styles/admin-tools.css | 272 | z-index: 2147483006; width: min(480px, calc(100vw - 48px)); max-height: min(720px, calc(100vh - 48px)); overflow: auto; display: grid; gap: 10px; padding: 14px; border: 1px solid rgba(96, 165, 250, 0.45); | border: 1px solid rgba(96, 165, 250, 0.45); |
| src/styles/admin-tools.css | 285 | .admin-tool-quick-editor label { display: grid; | display: grid; |
| src/styles/admin-tools.css | 295 | .admin-tool-quick-editor select { width: 100%; border: 1px solid rgba(148, 163, 184, 0.38); | border: 1px solid rgba(148, 163, 184, 0.38); |
| src/styles/admin-tools.css | 307 | .admin-tool-quick-editor button { border: 1px solid rgba(148, 163, 184, 0.32); | border: 1px solid rgba(148, 163, 184, 0.32); |
| src/styles/admin-tools.css | 332 | @media (max-width: 760px) { | @media (max-width: 760px) { |
| src/styles/admin-tools.css | 339 | .admin-tool-save-toast { right: 12px; bottom: 12px; width: calc(100vw - 24px); max-width: calc(100vw - 24px); | max-width: calc(100vw - 24px); |
| src/styles/admin-tools.css | 373 | @media (max-width: 760px) { | @media (max-width: 760px) { |
| src/styles/case-detail-simplified.css | 10 | section[data-testid="case-detail-v1-command-center"] { --case-shell-radius: 1.75rem; --case-tile-radius: 1.25rem; --case-soft-border: color-mix(in srgb, var(--app-border) 74%, transparent); | --case-soft-border: color-mix(in srgb, var(--app-border) 74%, transparent); |
| src/styles/case-detail-simplified.css | 23 | section[data-testid="case-detail-v1-command-center"] .bg-slate-950 { background: radial-gradient(circle at top left, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 34rem), var(--app-surface-strong | border: 1px solid var(--case-soft-border) !important; |
| src/styles/case-detail-simplified.css | 111 | @media (max-width: 768px) { | @media (max-width: 768px) { |
| src/styles/case-detail-simplified.css | 123 | section[data-testid="case-detail-v1-command-center"] .grid.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); | grid-template-columns: repeat(3, minmax(0, 1fr)); |
| src/styles/case-detail-simplified.css | 127 | section[data-testid="case-detail-v1-command-center"] .grid.grid-cols-2 { grid-template-columns: 1fr; | grid-template-columns: 1fr; |
| src/styles/case-detail-stage2.css | 11 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 { --case-stage2-radius-xl: 1.75rem; --case-stage2-radius-lg: 1.25rem; --case-stage2-radius-md: 1rem; --case-stage2-border: color-mix(in srgb, var(-- | --case-stage2-border: color-mix(in srgb, var(--app-border) 76%, transparent); |
| src/styles/case-detail-stage2.css | 29 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-shell { background: radial-gradient(circle at top left, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 3 | border: 1px solid var(--case-stage2-border) !important; |
| src/styles/case-detail-stage2.css | 35 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-header { display: flex; | display: flex; |
| src/styles/case-detail-stage2.css | 61 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-subtitle { margin-top: 0.4rem; max-width: 48rem; | max-width: 48rem; |
| src/styles/case-detail-stage2.css | 68 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-grid { display: grid; | display: grid; |
| src/styles/case-detail-stage2.css | 69 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-grid { display: grid; grid-template-columns: 1.12fr 1fr 0.9fr; | grid-template-columns: 1.12fr 1fr 0.9fr; |
| src/styles/case-detail-stage2.css | 75 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-tile { min-height: 10.5rem; border: 1px solid var(--case-stage2-border); | border: 1px solid var(--case-stage2-border); |
| src/styles/case-detail-stage2.css | 79 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-tile { min-height: 10.5rem; border: 1px solid var(--case-stage2-border); border-radius: var(--case-stage2-radius-lg); background | display: flex; |
| src/styles/case-detail-stage2.css | 106 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-tile-top { display: flex; | display: flex; |
| src/styles/case-detail-stage2.css | 137 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-tile-footer { margin-top: auto; display: flex; | display: flex; |
| src/styles/case-detail-stage2.css | 143 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-progress-row { display: flex; | display: flex; |
| src/styles/case-detail-stage2.css | 162 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-metrics { display: grid; | display: grid; |
| src/styles/case-detail-stage2.css | 163 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); | grid-template-columns: repeat(3, minmax(0, 1fr)); |
| src/styles/case-detail-stage2.css | 168 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-metric { border: 1px solid var(--case-stage2-border); | border: 1px solid var(--case-stage2-border); |
| src/styles/case-detail-stage2.css | 193 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-actions { margin-top: 0.9rem; display: flex; | display: flex; |
| src/styles/case-detail-stage2.css | 202 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-actions-right { display: flex; | display: flex; |
| src/styles/case-detail-stage2.css | 223 | @media (max-width: 1120px) { | @media (max-width: 1120px) { |
| src/styles/case-detail-stage2.css | 225 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-grid { grid-template-columns: 1fr; | grid-template-columns: 1fr; |
| src/styles/case-detail-stage2.css | 233 | @media (max-width: 768px) { | @media (max-width: 768px) { |
| src/styles/case-detail-stage2.css | 246 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-actions-right { display: grid; | display: grid; |
| src/styles/case-detail-stage2.css | 248 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-actions-right { display: grid; width: 100%; grid-template-columns: 1fr; | grid-template-columns: 1fr; |
| src/styles/case-detail-stage2.css | 257 | section[data-testid="case-detail-v1-command-center"].case-detail-stage2 .case-detail-stage2-metrics { grid-template-columns: repeat(3, minmax(0, 1fr)); | grid-template-columns: repeat(3, minmax(0, 1fr)); |
| src/styles/closeflow-action-clusters.css | 10 | .cf-danger-action-zone { display: flex; | display: flex; |
| src/styles/closeflow-action-clusters.css | 39 | @media (max-width: 640px) { | @media (max-width: 640px) { |
| src/styles/closeflow-action-clusters.css | 52 | .cf-danger-action-zone > * { min-width: 0; | min-width: 0; |
| src/styles/closeflow-action-tokens.css | 10 | :root { --cf-action-danger-text: #be123c; --cf-action-danger-text-hover: #9f1239; --cf-action-danger-bg: #fff1f2; --cf-action-danger-bg-hover: #ffe4e6; --cf-action-danger-border: #fecdd3; | --cf-action-danger-border: #fecdd3; |
| src/styles/closeflow-action-tokens.css | 15 | --cf-action-danger-bg: #fff1f2; --cf-action-danger-bg-hover: #ffe4e6; --cf-action-danger-border: #fecdd3; --cf-action-danger-border-hover: #fda4af; --cf-action-danger-focus: rgba(190, 18, 60, 0.24); --cf-action-neutral-t | --cf-action-neutral-border: #d0d5dd; |
| src/styles/closeflow-alert-severity.css | 4 | :root { --cf-alert-error-text: #9f1239; --cf-alert-error-bg: #fff1f3; --cf-alert-error-border: #fecdd3; | --cf-alert-error-border: #fecdd3; |
| src/styles/closeflow-alert-severity.css | 7 | :root { --cf-alert-error-text: #9f1239; --cf-alert-error-bg: #fff1f3; --cf-alert-error-border: #fecdd3; --cf-alert-warning-text: #92400e; --cf-alert-warning-bg: #fffbeb; --cf-alert-warning-border: #fde68a; | --cf-alert-warning-border: #fde68a; |
| src/styles/closeflow-alert-severity.css | 10 | --cf-alert-error-bg: #fff1f3; --cf-alert-error-border: #fecdd3; --cf-alert-warning-text: #92400e; --cf-alert-warning-bg: #fffbeb; --cf-alert-warning-border: #fde68a; --cf-alert-info-text: #1d4ed8; --cf-alert-info-bg: #ef | --cf-alert-info-border: #bfdbfe; |
| src/styles/closeflow-alert-severity.css | 13 | --cf-alert-warning-bg: #fffbeb; --cf-alert-warning-border: #fde68a; --cf-alert-info-text: #1d4ed8; --cf-alert-info-bg: #eff6ff; --cf-alert-info-border: #bfdbfe; --cf-alert-success-text: #047857; --cf-alert-success-bg: #e | --cf-alert-success-border: #a7f3d0; |
| src/styles/closeflow-alert-severity.css | 18 | .cf-alert { border: 1px solid var(--cf-alert-info-border); | border: 1px solid var(--cf-alert-info-border); |
| src/styles/closeflow-alert-severity.css | 90 | .cf-severity-pill { width: fit-content; border: 1px solid var(--cf-alert-info-border); | border: 1px solid var(--cf-alert-info-border); |
| src/styles/closeflow-card-readability.css | 9 | :root { --cf-readable-card-bg: #ffffff; --cf-readable-card-border: #e2e8f0; | --cf-readable-card-border: #e2e8f0; |
| src/styles/closeflow-card-readability.css | 26 | .cf-readable-panel { border: 1px solid var(--cf-readable-card-border); | border: 1px solid var(--cf-readable-card-border); |
| src/styles/closeflow-case-detail-focus.css | 5 | :root { --cf-case-bg: #f8fafc; --cf-case-surface: #ffffff; --cf-case-surface-soft: #f1f5f9; --cf-case-border: #e2e8f0; | --cf-case-border: #e2e8f0; |
| src/styles/closeflow-case-detail-focus.css | 31 | .cf-case-topbar { position: sticky; | position: sticky; |
| src/styles/closeflow-case-detail-focus.css | 40 | .cf-case-topbar-inner { max-width: 1440px; | max-width: 1440px; |
| src/styles/closeflow-case-detail-focus.css | 44 | .cf-case-topbar-inner { max-width: 1440px; min-height: 82px; margin: 0 auto; padding: 16px 24px; display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 51 | .cf-case-title-row { min-width: 0; | min-width: 0; |
| src/styles/closeflow-case-detail-focus.css | 52 | .cf-case-title-row { min-width: 0; display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 61 | .cf-icon-link { width: 40px; height: 40px; border-radius: 999px; border: 1px solid var(--cf-case-border); | border: 1px solid var(--cf-case-border); |
| src/styles/closeflow-case-detail-focus.css | 78 | .cf-case-heading { min-width: 0; | min-width: 0; |
| src/styles/closeflow-case-detail-focus.css | 82 | .cf-breadcrumbs { display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 102 | .cf-case-heading h1 { margin: 0; color: var(--cf-case-text); font-size: clamp(21px, 2.4vw, 34px); line-height: 1.05; font-weight: 850; letter-spacing: -0.045em; max-width: 820px; | max-width: 820px; |
| src/styles/closeflow-case-detail-focus.css | 110 | .cf-case-meta { margin-top: 8px; display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 119 | .cf-case-header-actions { display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 127 | .cf-case-main { max-width: 1440px; | max-width: 1440px; |
| src/styles/closeflow-case-detail-focus.css | 133 | .cf-command-grid { display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 134 | .cf-command-grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.9fr) minmax(260px, 0.85fr); | grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.9fr) minmax(260px, 0.85fr); |
| src/styles/closeflow-case-detail-focus.css | 143 | .cf-sub-card { border: 1px solid var(--cf-case-border) !important; | border: 1px solid var(--cf-case-border) !important; |
| src/styles/closeflow-case-detail-focus.css | 161 | .cf-command-content { height: 100%; min-height: 174px; padding: 20px !important; display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 168 | .cf-command-eyebrow { display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 207 | .cf-command-actions { display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 214 | .cf-progress-head { display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 234 | .cf-mini-stats { margin-top: 12px; display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 250 | .cf-case-layout { margin-top: 18px; display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 251 | .cf-case-layout { margin-top: 18px; display: grid; grid-template-columns: minmax(0, 1fr) 344px; | grid-template-columns: minmax(0, 1fr) 344px; |
| src/styles/closeflow-case-detail-focus.css | 258 | .cf-case-right { display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 260 | .cf-case-right { display: grid; gap: 18px; min-width: 0; | min-width: 0; |
| src/styles/closeflow-case-detail-focus.css | 267 | .cf-sub-card-header { padding: 18px 20px !important; border-bottom: 1px solid var(--cf-case-border); display: flex !important; | display: flex !important; |
| src/styles/closeflow-case-detail-focus.css | 294 | .cf-tabs { display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 304 | .cf-tabs-list { width: fit-content; height: auto !important; padding: 5px !important; border-radius: 16px !important; background: #f1f5f9 !important; border: 1px solid var(--cf-case-border); | border: 1px solid var(--cf-case-border); |
| src/styles/closeflow-case-detail-focus.css | 324 | .cf-work-grid { display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 325 | .cf-work-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr); | grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr); |
| src/styles/closeflow-case-detail-focus.css | 340 | .cf-side-stack { display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 345 | .cf-action-item { display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 346 | .cf-action-item { display: grid; grid-template-columns: 40px minmax(0, 1fr); | grid-template-columns: 40px minmax(0, 1fr); |
| src/styles/closeflow-case-detail-focus.css | 350 | .cf-action-item { display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 12px; padding: 13px; border-radius: 18px; border: 1px solid var(--cf-case-border); | border: 1px solid var(--cf-case-border); |
| src/styles/closeflow-case-detail-focus.css | 366 | .cf-action-main { min-width: 0; | min-width: 0; |
| src/styles/closeflow-case-detail-focus.css | 394 | .cf-check-meta { margin-top: 8px; display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 408 | .cf-status-summary { padding: 14px !important; display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 414 | .cf-info-list > div { display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 448 | .cf-operator-note { margin-top: 4px; padding: 13px; border-radius: 16px; background: var(--cf-case-info-bg); border: 1px solid rgba(37, 99, 235, 0.13); | border: 1px solid rgba(37, 99, 235, 0.13); |
| src/styles/closeflow-case-detail-focus.css | 464 | .cf-checklist-head { margin-bottom: 13px; display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 485 | .cf-checklist-row { display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 486 | .cf-checklist-row { display: grid; grid-template-columns: 40px minmax(0, 1fr) auto; | grid-template-columns: 40px minmax(0, 1fr) auto; |
| src/styles/closeflow-case-detail-focus.css | 490 | .cf-checklist-row { display: grid; grid-template-columns: 40px minmax(0, 1fr) auto; gap: 12px; align-items: flex-start; padding: 14px; border: 1px solid var(--cf-case-border); | border: 1px solid var(--cf-case-border); |
| src/styles/closeflow-case-detail-focus.css | 496 | .cf-check-main { min-width: 0; | min-width: 0; |
| src/styles/closeflow-case-detail-focus.css | 500 | .cf-check-title-line { min-width: 0; | min-width: 0; |
| src/styles/closeflow-case-detail-focus.css | 501 | .cf-check-title-line { min-width: 0; display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 527 | .cf-client-response { margin-top: 10px; padding: 10px; border-radius: 14px; background: var(--cf-case-surface-soft); display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 536 | .cf-client-response p { margin: 0; display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 548 | .cf-check-actions { display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 590 | .cf-wide-action span { display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 621 | .cf-timeline { position: relative; | position: relative; |
| src/styles/closeflow-case-detail-focus.css | 622 | .cf-timeline { position: relative; display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 629 | .cf-timeline::before { content: ''; position: absolute; | position: absolute; |
| src/styles/closeflow-case-detail-focus.css | 639 | .cf-timeline-item { position: relative; | position: relative; |
| src/styles/closeflow-case-detail-focus.css | 640 | .cf-timeline-item { position: relative; display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 645 | .cf-timeline-dot { position: absolute; | position: absolute; |
| src/styles/closeflow-case-detail-focus.css | 652 | position: absolute; top: 5px; left: -20px; width: 12px; height: 12px; border-radius: 999px; background: var(--cf-case-primary); border: 3px solid #ffffff; | border: 3px solid #ffffff; |
| src/styles/closeflow-case-detail-focus.css | 677 | .cf-empty-box { min-height: 160px; border: 1px dashed var(--cf-case-border-strong); | border: 1px dashed var(--cf-case-border-strong); |
| src/styles/closeflow-case-detail-focus.css | 681 | .cf-empty-box { min-height: 160px; border: 1px dashed var(--cf-case-border-strong); border-radius: 20px; background: #f8fafc; color: var(--cf-case-muted); display: grid; | display: grid; |
| src/styles/closeflow-case-detail-focus.css | 704 | .cf-empty-box span { max-width: 360px; | max-width: 360px; |
| src/styles/closeflow-case-detail-focus.css | 710 | .cf-status-badge { border: 1px solid transparent !important; | border: 1px solid transparent !important; |
| src/styles/closeflow-case-detail-focus.css | 750 | .cf-native-select { width: 100%; height: 40px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--cf-case-border-strong); | border: 1px solid var(--cf-case-border-strong); |
| src/styles/closeflow-case-detail-focus.css | 757 | .cf-checkbox-line { display: flex; | display: flex; |
| src/styles/closeflow-case-detail-focus.css | 769 | @media (max-width: 1180px) { | @media (max-width: 1180px) { |
| src/styles/closeflow-case-detail-focus.css | 773 | .cf-work-grid { grid-template-columns: 1fr; | grid-template-columns: 1fr; |
| src/styles/closeflow-case-detail-focus.css | 777 | .cf-case-right { grid-template-columns: repeat(2, minmax(0, 1fr)); | grid-template-columns: repeat(2, minmax(0, 1fr)); |
| src/styles/closeflow-case-detail-focus.css | 781 | .cf-note-card { grid-column: 1 / -1; | grid-column: 1 / -1; |
| src/styles/closeflow-case-detail-focus.css | 785 | @media (max-width: 760px) { | @media (max-width: 760px) { |
| src/styles/closeflow-case-detail-focus.css | 829 | .cf-case-right { grid-template-columns: 1fr; | grid-template-columns: 1fr; |
| src/styles/closeflow-case-detail-focus.css | 834 | .cf-tabs-list { width: 100%; display: grid !important; | display: grid !important; |
| src/styles/closeflow-case-detail-focus.css | 835 | .cf-tabs-list { width: 100%; display: grid !important; grid-template-columns: repeat(3, 1fr); | grid-template-columns: repeat(3, 1fr); |
| src/styles/closeflow-case-detail-focus.css | 839 | .cf-checklist-row { grid-template-columns: 36px minmax(0, 1fr); | grid-template-columns: 36px minmax(0, 1fr); |
| src/styles/closeflow-case-detail-focus.css | 843 | .cf-check-actions { grid-column: 1 / -1; | grid-column: 1 / -1; |

## Następny krok po zatwierdzeniu mapy

Pakiet UI-2 powinien zrobić dopiero wtedy:

- SemanticIcon jako jedyne źródło ikon standardowych,
- EntityInfoRow dla telefonu, maila, źródła i danych kontaktowych,
- EntityNoteCard / EntityNoteComposer / EntityNoteList,
- EntityDetailShell z regionami dla LeadDetail i ClientDetail,
- guard blokujący nowe lokalne style ikon/notatek/kontaktów.
