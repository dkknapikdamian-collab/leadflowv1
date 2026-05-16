# Run report — Stage102 Calendar edit modal form source

## Cel
Ujednolicić modal edycji wpisu kalendarza z formularzami dodawania zadania/wydarzenia bez przepisywania logiki zapisu.

## Scan-first confirmation

- Repo: `dkknapikdamian-collab/leadflowv1`
- Branch: `dev-rollout-freeze`
- Metoda skanu: GitHub connector + aktywny source file Lead app.
- Pliki repo przeczytane: `src/pages/Calendar.tsx`, `src/styles/visual-stage22-event-form-vnext.css`, `src/components/ui/dialog.tsx`, `src/components/entity-actions.tsx`, `scripts/closeflow-release-check-quiet.cjs`, `_project/06_GUARDS_AND_TESTS.md`, `_project/14_TEST_HISTORY.md`.
- Aktywne źródło prawdy: repo aplikacji dla kodu/testów/_project; Obsidian dla dashboardu, decyzji, ryzyk i testów ręcznych.
- Legacy / competing paths: osobny JSX edycji w `Calendar.tsx`; create-event używało `event-form-vnext`, create-task nie było spięte w pełni z tym samym content/form source. Logika zapisu została nietknięta.

## FAKTY Z KODU / PLIKÓW

- `Calendar.tsx` ma osobne bloki renderu: create event, create task i edit entry.
- `visual-stage22-event-form-vnext.css` jest aktywnym stylem formularza wydarzenia i już ustawia jasne inputy oraz jasną powierzchnię formularza.
- `entity-actions.tsx` zawiera `modalFooterClass()` jako źródło prawdy dla stopek modalnych.

## DECYZJE DAMIANA

- Modal edycji ma wyglądać jak formularz dodawania zadania/wydarzenia.
- Nie przepisywać logiki zapisu od zera.
- Dodać guard i aktualizację Obsidiana.

## Zmienione pliki

- `src/pages/Calendar.tsx`
- `src/styles/visual-stage22-event-form-vnext.css`
- `tests/stage102-calendar-edit-modal-form-source.test.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `_project/06_GUARDS_AND_TESTS.md`
- `_project/14_TEST_HISTORY.md`
- `_project/runs/2026-05-16_stage102_calendar_edit_modal_form_source.md`
- Obsidian: `10_PROJEKTY/CloseFlow_Lead_App/RUNS/2026-05-16_stage102_calendar_edit_modal_form_source.md` plus link/status w dashboardzie, jeśli plik istnieje lokalnie.

## TESTY AUTOMATYCZNE / GUARDY

Po zastosowaniu paczki uruchomić:

```powershell
node --test tests/stage102-calendar-edit-modal-form-source.test.cjs
npm run build
npm run verify:closeflow:quiet
```

Status przed lokalnym uruchomieniem: `DO POTWIERDZENIA LOKALNIE`.

## TESTY RĘCZNE

Status: `TEST RĘCZNY DO WYKONANIA`.

Instrukcja:
1. Otwórz `/calendar`.
2. Otwórz „Dodaj wydarzenie” i zapamiętaj wygląd powierzchni, inputów, selectów, scrolla i stopki.
3. Otwórz „Dodaj zadanie” i sprawdź, czy używa tej samej jasnej powierzchni i stopki.
4. Kliknij „Edytuj” na zadaniu i wydarzeniu w planie tygodnia / wybranym dniu.
5. Sprawdź, czy modal edycji ma jasne inputy, ciemny tekst, brak zielonych ramek, brak ciemnego dolnego paska, łagodny scroll i tę samą stopkę zapisu.
6. Zmień tytuł i zapisz jeden wpis testowy. Potwierdź, czy zapis nadal działa.

## BRAKI I RYZYKA

- To jest minimalne ujednolicenie klas/renderu, nie pełny refactor do komponentu `CalendarEntryForm`.
- Pełny refactor warto zrobić dopiero po potwierdzeniu ręcznym, żeby nie dotykać logiki zapisu i mapowania relacji w tym samym etapie.

## WPŁYW NA OBSIDIANA

- Dopisać status Stage102, decyzję „minimalny render-source unification zamiast pełnego refactoru”, guard i test ręczny do wykonania.

## NASTĘPNY KROK

Po ręcznym potwierdzeniu Damiana: Paczka E może wydzielić realny komponent `CalendarEntryForm`, jeśli nadal będzie potrzebne usunięcie duplikacji JSX. Nie robić tego przed potwierdzeniem wyglądu i zapisu.
