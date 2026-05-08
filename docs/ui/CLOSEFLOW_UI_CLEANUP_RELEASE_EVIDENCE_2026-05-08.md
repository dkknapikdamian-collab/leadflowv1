# CLOSEFLOW_UI_CLEANUP_RELEASE_EVIDENCE_2026_05_08

## Cel

Stage21 zamyka serie UI cleanup jednym dokumentem dowodowym.

Ten etap nie zmienia danych, API, Supabase, auth, billing, AI, routingu ani zachowania klikniec. To jest release evidence: jeden plik pokazuje, co zostalo domkniete jako spojny system, co jest aktywne, co jest legacy oraz gdzie globalnie zmieniac style.

## Werdykt release evidence

UI cleanup jest zamkniety jako spojny system kontraktow dla aktywnego UI.

Nie oznacza to, ze kazdy ekran jest screenshotowo idealny. Oznacza to, ze:
- glowne style maja zrodla prawdy,
- znane wyjatki sa jawnie opisane,
- legacy Today.tsx nie miesza sie z aktywnym UI debt,
- kolejne poprawki maja isc przez kontrakty, nie przez lokalne ad hoc klasy,
- `/tasks` i `/cases` zostaja jako screenshot-driven future debt po Stage16B/Stage20.

## Lista etapow 0-21

> Uwaga: commit self-hash Stage21 nie jest wpisywany do wlasnej tresci dokumentu, bo zmieniloby to hash commita. Po pushu ostateczny hash Stage21 potwierdza terminal i GitHub. Dokument zawiera znane hashe etapow koncowych oraz miejsce na trace z git log dla starszych etapow.

| Etap | Nazwa / zakres | Commit hash / evidence | Status |
|---|---|---|---|
| 0 | UI cleanup baseline / release-governance start | GIT_LOG_TRACE_STAGE0 | CLOSED_PREVIOUS_CHAIN |
| 1 | Shell/layout visual baseline | GIT_LOG_TRACE_STAGE1 | CLOSED_PREVIOUS_CHAIN |
| 2 | Today visual baseline | GIT_LOG_TRACE_STAGE2 | CLOSED_PREVIOUS_CHAIN |
| 3 | Leads visual baseline | GIT_LOG_TRACE_STAGE3 | CLOSED_PREVIOUS_CHAIN |
| 4 | Lead detail visual baseline | GIT_LOG_TRACE_STAGE4 | CLOSED_PREVIOUS_CHAIN |
| 5 | Clients visual baseline | GIT_LOG_TRACE_STAGE5 | CLOSED_PREVIOUS_CHAIN |
| 6 | Client detail visual baseline | GIT_LOG_TRACE_STAGE6 | CLOSED_PREVIOUS_CHAIN |
| 7 | Cases visual baseline | GIT_LOG_TRACE_STAGE7 | CLOSED_PREVIOUS_CHAIN |
| 8 | Case detail visual baseline / UI contract audit | GIT_LOG_TRACE_STAGE8 | CLOSED_PREVIOUS_CHAIN |
| 9 | Alert/severity cleanup pass | GIT_LOG_TRACE_STAGE9 | CLOSED_PREVIOUS_CHAIN |
| 10 | Surface/card readability cleanup pass | GIT_LOG_TRACE_STAGE10 | CLOSED_PREVIOUS_CHAIN |
| 11 | Notifications severity contract | GIT_LOG_TRACE_STAGE11 | CLOSED_PREVIOUS_CHAIN |
| 12 | Active severity replacement / local red debt review | GIT_LOG_TRACE_STAGE12 | CLOSED_PREVIOUS_CHAIN |
| 13 | PWA/mobile safe contract pass | GIT_LOG_TRACE_STAGE13 | CLOSED_PREVIOUS_CHAIN |
| 14 | UI truth/copy/diacritics pass | GIT_LOG_TRACE_STAGE14 | CLOSED_PREVIOUS_CHAIN |
| 15 | Action placement / form/footer / card readability foundation | GIT_LOG_TRACE_STAGE15 | CLOSED_PREVIOUS_CHAIN |
| 16 | Active legacy color contract finalizer | `24418f4` | CLOSED |
| 16A | Metric Tiles + Page Hero Visual Parity Repair | `23aae58` | CLOSED |
| 16B | Visual Screenshot QA after Stage16A | `e5adbb8` | CLOSED |
| 17 | Dashboard logout action + Calendar entity type color contract | `69ecdc5` | CLOSED |
| 18 | Final active UI contract audit | `8e80bd7` | CLOSED |
| 19 | Detail pages action placement visual QA | `8a53255` | CLOSED |
| 20 | Mobile parity pass | `904b02a` | CLOSED |
| 21 | Final release evidence for UI cleanup | THIS_COMMIT_AFTER_PUSH | CLOSED_BY_THIS_EVIDENCE |

## Zrodla prawdy

| Obszar | Zrodlo prawdy | Jak uzywac |
|---|---|---|
| metric tiles | `src/components/StatShortcutCard.tsx`, `src/styles/closeflow-metric-tiles.css` | Top metryki maja isc przez `StatShortcutCard` / `cf-top-metric-tile`, bez lokalnych `tile-v2` i `metric-fix`. |
| page hero | `src/styles/closeflow-page-header.css` | Page hero/header ma isc przez `cf-page-hero`, `cf-page-hero-title`, `cf-page-hero-kicker`, `cf-page-hero-actions`. |
| surfaces | `src/styles/closeflow-surface-tokens.css` | Right-card, rail i surface panele maja korzystac z `--cf-surface-*`. |
| list rows | `src/styles/closeflow-list-row-tokens.css` | Meta, contact/value/client, status i progress pille maja isc przez `cf-list-row-*`, `cf-status-pill`, `cf-progress-pill`, `cf-progress-bar`. |
| status/progress | `src/styles/closeflow-list-row-tokens.css` | Status/progress nie jest alert/severity. Zmieniac tokeny `--cf-status-*` i `--cf-progress-*`. |
| alert/severity | `src/styles/closeflow-alert-severity.css` | Bledy, warningi, info, success i severity maja isc przez `cf-alert-*` i `cf-severity-*`. |
| actions | `src/components/entity-actions.tsx`, `src/styles/closeflow-action-tokens.css`, `src/styles/closeflow-action-clusters.css` | Akcje encji, danger/delete, session action logout i rozmieszczenie akcji sa oddzielone semantycznie. |
| forms | `src/styles/closeflow-form-actions.css` | Stopki formularzy i modali ida przez `cf-form-actions`, `cf-modal-footer`, `cf-form-actions-danger`. |
| cards/empty states | `src/styles/closeflow-card-readability.css` | Czytelnosc kart, paneli i empty state przez `cf-readable-card`, `cf-readable-panel`, `cf-empty-state`. |
| entity type | `src/styles/closeflow-entity-type-tokens.css` | Typy wpisu w Calendar to entity type, nie severity ani danger. |

## Co jest aktywne

Aktywne trasy i pliki:
- `/today` -> `src/pages/TodayStable.tsx`
- `/tasks` -> `src/pages/TasksStable.tsx`
- `/leads` -> `src/pages/Leads.tsx`
- `/clients` -> `src/pages/Clients.tsx`
- `/cases` -> `src/pages/Cases.tsx`
- `/calendar` -> `src/pages/Calendar.tsx`
- `/ai-drafts` -> `src/pages/AiDrafts.tsx`
- `/notifications` -> `src/pages/NotificationsCenter.tsx`
- detail pages: `LeadDetail.tsx`, `ClientDetail.tsx`, `CaseDetail.tsx`

## Co jest legacy

- `src/pages/Today.tsx` jest legacy inactive.
- Aktywne `/` i `/today` ida przez `TodayStable`.
- Historyczne czerwienie/rose/amber w `Today.tsx` nie sa aktywnym UI debt.
- Nie ruszac `Today.tsx` bez osobnego etapu archiwizacji/usuniecia.

## Jak zmienic globalnie

### Jak zmienic kolor kosza

Kosz / usuwanie rekordu to delete/destructive action, nie logout.

Zmieniaj:
- `src/styles/closeflow-action-tokens.css`
- tokeny `--cf-action-danger-*`
- klasy `cf-entity-action-danger`

Nie zmieniaj lokalnie:
- `text-red-*`
- `hover:bg-red-*`
- `EntityActionButton danger` dla logout

Logout jest osobna kategoria:
- `cf-session-action-danger`
- `data-cf-session-action="logout"`

### Jak zmienic kolor bledu

Bledy systemowe i severity error zmieniaj w:
- `src/styles/closeflow-alert-severity.css`
- `--cf-alert-error-text`
- `--cf-alert-error-bg`
- `--cf-alert-error-border`
- `cf-alert-error`
- `cf-severity-panel[data-cf-severity="error"]`
- `cf-severity-pill[data-cf-severity="error"]`

Nie mieszaj z:
- entity type
- status/progress
- delete action
- logout action

### Jak zmienic kolor statusu

Status/progress zmieniaj w:
- `src/styles/closeflow-list-row-tokens.css`
- `--cf-status-blue-*`
- `--cf-status-green-*`
- `--cf-status-amber-*`
- `--cf-status-red-*`
- `--cf-progress-*`

Nie zmieniaj przez alert/severity, chyba ze to realny alert.

### Jak zmienic wyglad kafelka

Kafelek top metryki zmieniaj w:
- `src/components/StatShortcutCard.tsx`
- `src/styles/closeflow-metric-tiles.css`

Najwazniejsze tokeny:
- `--cf-metric-tile-radius`
- `--cf-metric-tile-padding-*`
- `--cf-metric-tile-min-height`
- `--cf-metric-tile-value-size`
- `--cf-metric-tile-icon-size`
- `--cf-metric-tile-shadow`

Nie tworz:
- `metric-fix`
- `tile-v2`
- lokalnych gridow tylko dla jednego ekranu

### Jak zmienic page hero

Page hero/header zmieniaj w:
- `src/styles/closeflow-page-header.css`

Najwazniejsze klasy:
- `cf-page-hero`
- `cf-page-hero-layout`
- `cf-page-hero-title`
- `cf-page-hero-kicker`
- `cf-page-hero-actions`

Nie tworz:
- `page-head-v2`
- `header-fix`
- per-page hero CSS bez kontraktu

### Jak zmienic card surface

Card/right-card/surface zmieniaj w:
- `src/styles/closeflow-surface-tokens.css`
- `src/styles/closeflow-card-readability.css`

Najwazniejsze tokeny:
- `--cf-surface-card`
- `--cf-surface-border`
- `--cf-surface-shadow`
- `--cf-readable-card-bg`
- `--cf-readable-card-border`
- `--cf-readable-title`
- `--cf-readable-text`
- `--cf-readable-muted`

## Checki, ktore przechodza w tej serii

Weryfikacja release evidence:
- `npm run check:closeflow-ui-cleanup-release-evidence`
- `npm run build`

Kluczowe checki serii UI cleanup:
- `npm run check:closeflow-metric-visual-parity-contract`
- `npm run check:closeflow-visual-qa-stage16b`
- `npm run check:closeflow-dashboard-calendar-color-contract`
- `npm run check:closeflow-final-active-ui-contract-audit`
- `npm run check:closeflow-detail-action-visual-qa`
- `npm run check:closeflow-mobile-parity-contract`
- `npm run audit:closeflow-ui-map`
- `npm run audit:closeflow-style-map`
- `npm run check:closeflow-danger-style-contract`
- `npm run check:polish-mojibake`

## Pozostale swiadome wyjatki

| Obszar | Status | Decyzja |
|---|---|---|
| `/tasks` visual parity | PRZYSZLY_DEBT | Stage16B/Stage20 oznaczyl ekran jako wymagajacy screenshot-driven Stage16C albo Stage20B. |
| `/cases` visual parity | PRZYSZLY_DEBT | Stage16B/Stage20 oznaczyl ekran jako wymagajacy screenshot-driven Stage16C albo Stage20B. |
| `Today.tsx` | LEGACY_INACTIVE | Poza aktywnym UI debt. Nie ruszac bez osobnego etapu. |
| real device screenshots | DO_POTWIERDZENIA_SCREENSHOTEM | Mobile/visual QA na 390px/430px dopiero po deployu lub screenshocie. |
| Calendar/notifications contrast | DO_POTWIERDZENIA_SCREENSHOTEM | Robic osobno tylko po konkretnym screenie albo bledzie kontraktu. |

## Zamkniecie

UI cleanup jest zamkniety jako spojny system kontraktow. Nastepne zmiany powinny byc punktowe:
1. Stage16C dla `/tasks` i `/cases`, jezeli screenshot dalej pokazuje rozjazd.
2. Osobny etap archiwizacji `Today.tsx`, jezeli zapadnie decyzja.
3. Osobny contrast/readability repair tylko z dowodem screenshotowym.

Nie wracac do szerokiego audytu calego UI bez nowego bledu. To bylby mlynek bez ziarna.
