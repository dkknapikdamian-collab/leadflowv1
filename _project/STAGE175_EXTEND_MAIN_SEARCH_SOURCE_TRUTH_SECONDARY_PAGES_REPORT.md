# STAGE175 Extend Main Search Source Truth to Secondary Pages — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / main search bars / secondary pages

## Cel

Podpiąć do tego samego źródła prawdy wyszukiwarki w zakładkach:
- Zadania,
- Szablony,
- Odpowiedzi,
- Aktywność,
- Inbox szkiców,
- Powiadomienia,
- Pomoc.

## FAKTY

- Stage174 lokalnie przeszedł guard i build.
- `TasksStable.tsx` ma własny search z ikoną i `pl-9`.
- `Templates.tsx` i `ResponseTemplates.tsx` mają własne search wrappery `relative flex-1`.
- `Activity.tsx`, `AiDrafts.tsx`, `NotificationsCenter.tsx`, `SupportCenter.tsx` mają własne klasy search boxów:
  - `activity-search-box`,
  - `ai-drafts-search-box`,
  - `notifications-search-box`,
  - `support-search-field`.

## DECYZJE DAMIANA

- Ten sam source truth dla pasków wyszukiwania.
- Nie stroić każdej zakładki ręcznie jako osobnej wyspy.
- Każda poprawka ma mieć guard.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- Search bary w tych widokach są różne technicznie, ale można je spiąć przez jeden marker `.cf-main-search` i jeden plik CSS.
- Ikony w searchu powinny zostać ukryte jako dekoracyjne, bo powodowały kolizje z tekstem.
- Wrapper ma być layout-only, input ma być jedyną widoczną powierzchnią.

## Pliki

- `src/App.tsx`
- `src/pages/TasksStable.tsx`
- `src/pages/Templates.tsx`
- `src/pages/ResponseTemplates.tsx`
- `src/pages/Activity.tsx`
- `src/pages/AiDrafts.tsx`
- `src/pages/NotificationsCenter.tsx`
- `src/pages/SupportCenter.tsx`
- `src/styles/closeflow-extend-main-search-source-truth-secondary-pages-stage175.css`
- `scripts/apply-stage175-extend-main-search-source-truth-secondary-pages.cjs`
- `scripts/check-stage175-extend-main-search-source-truth-secondary-pages.cjs`
- `docs/ui/CLOSEFLOW_STAGE175_EXTEND_MAIN_SEARCH_SOURCE_TRUTH_SECONDARY_PAGES.md`
- `docs/ui/CLOSEFLOW_STAGE175_RUNTIME_SECONDARY_SEARCH_AUDIT.js`
- `_project/STAGE175_EXTEND_MAIN_SEARCH_SOURCE_TRUTH_SECONDARY_PAGES_REPORT.md`
- `_project/STAGE175_SEARCH_SOURCE_TOUCHED_FILES.txt`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage175 extend main search source truth secondary pages.md`

## Testy automatyczne

```powershell
node scripts/check-stage175-extend-main-search-source-truth-secondary-pages.cjs
npm.cmd run build
```

## Testy ręczne

Sprawdzić:
- `/tasks`
- `/templates`
- `/response-templates`
- `/activity`
- `/ai-drafts`
- `/notifications`
- `/support`

Warunki:
- brak dwóch warstw,
- brak lupki nachodzącej na tekst,
- input ma tę samą wysokość i font co Lead/Klient/Sprawy,
- pasek wypełnia swoją kolumnę roboczą,
- sąsiednie liczniki/selecty nie rozwalają układu.

## Czego nie ruszano

- push
- deploy
- auth
- Supabase schema
- Google Calendar
- Stripe
- AI
