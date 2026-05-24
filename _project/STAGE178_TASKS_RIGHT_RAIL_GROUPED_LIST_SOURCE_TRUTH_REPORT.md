# STAGE178 Tasks Right Rail and Grouped List Source Truth — raport

Data: 2026-05-24  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / tasks operational panel / right rail / grouped list

## Cel

Zakładka `Zadania` jest za pusta. Trzeba dodać operacyjny panel w tym samym stylu wizualnym:
- prawy rail,
- grupowanie zadań,
- search skrócony do kolumny roboczej,
- kolory/gęstość podobne do kafelków i prawych paneli Lead/Klient.

## FAKTY

- `TasksStable.tsx` ma obecnie listę zadań jako pojedynczą kolumnę.
- Search w `TasksStable.tsx` jest osobnym blokiem z ikoną i `pl-9`.
- Statystyki są już liczone: aktywne, dziś, zaległe, zrobione.
- Stage175/174/173 dały source truth dla search barów.
- Stage177 wyrównywał listy Lead/Klient.

## DECYZJE DAMIANA

- Dodać prawy panel w tym samym stylu wizualnym.
- Kolorystyka może być jak w kafelkach.
- Skrócić pasek wyszukiwania do tego samego wymiaru / kolumny roboczej.
- Zachować jedno źródło prawdy wizualnej.
- Każda poprawka ma mieć guard.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- Najlepszym wypełnieniem pustej przestrzeni jest prawy rail, nie ozdobne kafelki.
- `Filtry zadań` i `Najpilniejsze zadania` poprawiają realne użycie aplikacji.
- Grupowanie listy zmienia pustą zakładkę w centrum egzekucji dnia.

## Pliki

- `src/App.tsx`
- `src/pages/TasksStable.tsx`
- `src/styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css`
- `scripts/apply-stage178-tasks-right-rail-grouped-list-source-truth.cjs`
- `scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs`
- `docs/ui/CLOSEFLOW_STAGE178_TASKS_RIGHT_RAIL_GROUPED_LIST_SOURCE_TRUTH.md`
- `docs/ui/CLOSEFLOW_STAGE178_RUNTIME_TASKS_LAYOUT_AUDIT.js`
- `_project/STAGE178_TASKS_RIGHT_RAIL_GROUPED_LIST_SOURCE_TRUTH_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-24 - CloseFlow Stage178 tasks right rail grouped list source truth.md`

## Testy automatyczne

```powershell
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
```

## Testy ręczne

Sprawdzić `/tasks`:
- prawa kolumna istnieje,
- są `Filtry zadań`, `Najpilniejsze zadania`,
- search kończy się w lewej kolumnie, nie idzie przez całą stronę,
- lista jest grupowana,
- filtry ustawiają właściwy zakres,
- klik w pilne zadanie zawęża listę,
- brak regresji modalu `Nowe zadanie`.

## Czego nie ruszano

- dane
- auth
- Supabase schema
- Google Calendar
- Stripe
- AI
- deploy
- push


## Stage179 update

- Poprawiono polskie znaki w tekstach panelu zadań.
- Usunięto kartę `Szybki fokus` z prawego panelu.
- Pozostają: `Filtry zadań` i `Najpilniejsze zadania`.
