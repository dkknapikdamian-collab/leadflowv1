# CloseFlow Page Header Render Audit Stage 3

Ten raport pokazuje, które pliki TSX renderują lub oznaczają top header.

## Files

- src/pages/Activity.tsx: 2
- src/pages/AdminAiSettings.tsx: 2
- src/pages/AiDrafts.tsx: 2
- src/pages/Billing.tsx: 3
- src/pages/Calendar.tsx: 2
- src/pages/Cases.tsx: 2
- src/pages/Clients.tsx: 2
- src/pages/Leads.tsx: 2
- src/pages/NotificationsCenter.tsx: 2
- src/pages/ResponseTemplates.tsx: 2
- src/pages/Settings.tsx: 1
- src/pages/SettingsLegacy.tsx: 3
- src/pages/SupportCenter.tsx: 3
- src/pages/Tasks.tsx: 1
- src/pages/TasksStable.tsx: 6
- src/pages/Templates.tsx: 2
- src/pages/TodayStable.tsx: 1
- src/pages/UiPreviewVNext.tsx: 1
- src/pages/UiPreviewVNextFull.tsx: 1

## Rule

Każdy top header docelowo ma mieć `data-cf-page-header="true"` oraz części `data-cf-page-header-part`.
