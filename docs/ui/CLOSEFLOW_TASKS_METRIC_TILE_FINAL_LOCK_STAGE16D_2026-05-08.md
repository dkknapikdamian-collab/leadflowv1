# CLOSEFLOW_TASKS_METRIC_TILE_FINAL_LOCK_STAGE16D_2026_05_08

## Cel

Stage16D naprawia konkretny blad pokazany na screenshocie: top metric tiles na `/tasks` sa inne niz kafelki w pozostalych sekcjach.

Problem widoczny na screenie:

- `AKTYWNE` lamie sie jako `AKTYW / NE`,
- label jest za duzy,
- kafelki sa za wysokie i wygladaja jak osobny system,
- radius i padding nie sa zgodne z poprawnym wzorem,
- `/tasks` ma wyglad inny niz poprawne kafelki z pozostalych sekcji.

## Zakres

- `src/pages/TasksStable.tsx`
- `src/index.css`
- `src/styles/closeflow-stage16d-tasks-metric-final-lock.css`
- `scripts/check-closeflow-stage16d-tasks-metric-final-lock.cjs`
- `package.json`

## Nie zmieniac

- danych zadan,
- filtrow,
- wyszukiwania,
- API,
- Supabase,
- auth,
- billing,
- AI,
- routingu,
- Cases,
- Today.tsx.

## Decyzja

To nie jest kolejny szeroki UI cleanup. To jest finalny lock dla metryk `/tasks`, bo screenshot pokazal realny blad, a nie hipotetyczny debt.

Naprawa jest scoped do:

```text
main[data-p0-tasks-stable-rebuild="true"][data-stage16c-tasks-cases-repair="tasks"] section[data-eliteflow-task-stat-grid="true"]
```

## Wzorzec wizualny

Kafelek `/tasks` ma byc kompaktowy jak poprawne kafelki z innych sekcji:

- label: 11px, uppercase, bold, no-wrap,
- value: 20px,
- icon: 26px,
- min-height: 56px,
- radius: 16px,
- padding: 10px 14px,
- gap: 8px,
- soft border i shadow,
- grid: 4 kolumny desktop, 2 tablet, 1 mobile.

## Status po etapie

| Ekran | Status | Decyzja |
|---|---|---|
| `/tasks` | REPAIRED_SCREENSHOT_ISSUE | top metric tiles maja final lock |
| `/cases` | POZA_ZAKRESEM | nie ruszac w tym etapie |
| pozostale ekrany | POZA_ZAKRESEM | release evidence juz zamknal szeroki cleanup |

## QA po deployu

Sprawdzic screenshotowo:

1. `AKTYWNE` nie lamie sie w polowie slowa.
2. `ZROBIONE` nie lamie sie w polowie slowa.
3. Kafelki `/tasks` sa kompaktowe jak poprawny wzor.
4. Label nie jest za duzy.
5. Kafelek nie jest za wysoki.
6. Mobile nadal ma 1 kolumne.

## Weryfikacja

```bash
npm run check:closeflow-stage16d-tasks-metric-final-lock
npm run build
```
