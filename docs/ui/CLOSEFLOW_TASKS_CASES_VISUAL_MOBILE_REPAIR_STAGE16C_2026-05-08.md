# CLOSEFLOW_TASKS_CASES_VISUAL_MOBILE_REPAIR_STAGE16C_2026_05_08

## Cel

Stage16C/Stage20B domyka pozostaly jawny debt po Stage16B, Stage20 i Stage21:

- `/tasks`
- `/cases`

Ten etap nie zmienia danych, API, Supabase, auth, billing, AI, routingu ani zachowania klikniec. Naprawa jest scoped do wizualnego i mobilnego ulozenia dwoch ekranow przez istniejace kontrakty.

## Dlaczego

Release evidence Stage21 zostawilo tylko `/tasks` i `/cases` jako screenshot-driven future debt. Bez screenshotow nie udajemy pelnego QA wizualnego, ale usuwamy najczestsza przyczyne rozjazdu: rozny page container, rozny hero/header flow oraz rozne mobile wrapping pomiedzy TasksStable i Cases.

## Zakres

- `src/pages/TasksStable.tsx`
- `src/pages/Cases.tsx`
- `src/index.css`
- `src/styles/closeflow-stage16c-tasks-cases-parity.css`
- `scripts/check-closeflow-stage16c-tasks-cases-visual-mobile-repair.cjs`
- `package.json`

## Co zostaje bez zmian

- logika zadan
- logika spraw
- filtry
- wyszukiwanie
- tworzenie sprawy
- tworzenie i edycja zadania
- usuwanie
- API
- Supabase
- auth
- billing
- AI
- routing
- `Today.tsx`

## Naprawa

| Obszar | `/tasks` | `/cases` | Decyzja |
|---|---|---|---|
| page container | `main[data-p0-tasks-stable-rebuild="true"]` | `.cf-html-view.main-cases-html` | ten sam max-width, padding, gap |
| page hero/header | `.cf-page-hero` | `.page-head` | ten sam min-height, flex, mobile stack |
| action cluster headera | `.cf-page-hero-actions` / ostatni blok hero | `.head-actions` | wrap, gap, mobile full width |
| metric tiles grid | `section[data-eliteflow-task-stat-grid="true"]` | `.grid-4` | 4 kolumny desktop, 2 tablet, 1 mobile |
| metric labels | `cf-top-metric-tile-label` | `cf-top-metric-tile-label` | brak lamania krotkich slow, ellipsis |
| long names | task title | case title/client/sub | safe wrapping bez poziomego scrolla |
| danger spacing | task delete | danger action tokens | nie obok primary bez odstepu |

## Zrodlo prawdy

Naprawa nie tworzy nowego systemu wizualnego. Jest tylko scoped adapterem dla dwoch ekranow do istniejacych kontraktow:

- metric tiles: `src/styles/closeflow-metric-tiles.css`
- page hero: `src/styles/closeflow-page-header.css`
- forms: `src/styles/closeflow-form-actions.css`
- actions: `src/styles/closeflow-action-tokens.css`
- mobile action clusters: `src/styles/closeflow-action-clusters.css`
- cards/readability: `src/styles/closeflow-card-readability.css`

## Status po etapie

| Ekran | Status | Decyzja |
|---|---|---|
| `/tasks` | REPAIRED_CONTRACT | naprawiony przez scoped contract CSS, nadal zalecany screenshot po deployu |
| `/cases` | REPAIRED_CONTRACT | naprawiony przez scoped contract CSS, nadal zalecany screenshot po deployu |
| pozostałe ekrany | POZA_ZAKRESEM | Stage21 zamknal szeroki UI cleanup |

## QA po deployu

Sprawdzic na desktop i mobile:

1. `/tasks` i `/cases` maja zblizony page width i rytm pionowy.
2. Hero/header nie ma latajacych buttonow.
3. Kafelki sa w tym samym rytmie: 4/2/1 kolumna.
4. Krotkie labele nie lamia sie w polowie slowa.
5. Dlugie tytuly nie tworza poziomego scrolla.
6. Danger action ma odstep i nie siedzi jako glowne CTA.

## Kryterium zakonczenia

- check Stage16C przechodzi,
- build przechodzi,
- commit i push ida na `dev-rollout-freeze`,
- naprawa jest ograniczona do `/tasks` i `/cases`,
- dokument nie udaje pelnego screenshot QA bez screenshotow.

## Weryfikacja

```bash
npm run check:closeflow-stage16c-tasks-cases-visual-mobile-repair
npm run build
```
