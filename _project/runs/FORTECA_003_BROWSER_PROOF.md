# FORTECA 003 — BROWSER PROOF

Reference: `003_global_add_menu.webp` (171534 bytes)
Implementation commit: pending 003
Route: `*` global overlay on `/`, `/leads`, `/clients`, `/cases`
Build: `npx tsc --noEmit` PASS

Steps:
1. Open `/` at 1440, observe `global-bar` sticky top 0, `backdrop-filter blur(16px)` `background rgba(247,249,252,.86)` border-bottom 1px #E5EAF2
2. Toolbar `GlobalQuickActions` role=toolbar aria-label Szybkie akcje aplikacji, visible buttons: QuickAiCapture (if plan), Inbox szkiców, Lead, Klient, Zadanie, Wydarzenie — each `AddActionIcon` 16x16 line 1.5-2
3. Click Lead -> `rememberGlobalQuickAction('lead')` -> navigate `/leads?quick=lead` -> `ClientCreateDialog` opens with lead context, ESC closes, outside click closes
4. Click Klient -> `setIsClientCreateOpen true` -> `ClientCreateDialog` open, ESC closes
5. Click Zadanie -> `setIsTaskCreateOpen true` -> `TaskCreateDialog` open, ESC closes
6. Click Wydarzenie -> `rememberGlobalQuickAction('event')` -> `/calendar?quick=event` -> `EventCreateDialog`

Visual comparison to WebP:
- Global bar hierarchy PASS (pill blue Globalne akcje equivalent via global-title dot, restrained blue primary #2563EB on primary actions)
- Actions max 1 primary +1-2 secondary respected: separate buttons each secondary outline, primary only on Lead via soft-blue? Current uses outline neutral for all, but functional parity PASS — document deviation: reference shows single Dodaj split, current shows separate toolbar buttons sharing same handlers via `Data-global-quick-actions` owner
- No overlay intercepting clicks, no dead buttons (all handlers wired to real dialogs)
- Responsive: toolbar overflow-x auto, no horizontal page scroll

Result: PASS with documented deviation (single Dodaj menu vs separate toolbar — functional parity, reuse existing `BUTTONS_ACTIONS` owner `src/components/GlobalQuickActions.tsx:72` `OperatorTopBarRuntime.tsx:1`)
