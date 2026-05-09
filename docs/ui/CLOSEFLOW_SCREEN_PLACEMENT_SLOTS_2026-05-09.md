# CloseFlow VS-7 — Screen templates and placement slots

**Data:** 2026-05-09  
**Status:** wdrożone jako kontrakt systemowy położenia elementów  
**Zakres:** Visual System / Screen placement contract  
**Pliki:**

- `src/components/ui-system/screen-slots.ts`
- `src/components/ui-system/index.ts`
- `scripts/check-closeflow-screen-placement-slots.cjs`
- `docs/ui/CLOSEFLOW_SCREEN_PLACEMENT_SLOTS_2026-05-09.md`

## Cel

VS-7 domyka brakujący element po VS dotyczących stylu: wspólne położenie rzeczy.

Nie wystarczy, że kafelki, przyciski i panele wyglądają podobnie. Lead, Client i Case mają mieć wspólny język rozmieszczenia:

- główne akcje strony są w tym samym typie miejsca,
- drugorzędne akcje strony są w tym samym typie miejsca,
- akcje szczegółów są w nagłówku szczegółów,
- szybkie akcje są w osobnym logicznym slocie,
- panele notatek, zadań, wydarzeń i finansów mają stałe nazwy slotów,
- filtry, wyszukiwarka i wiersze listy mają stałe nazwy slotów.

## Decyzja

Dodajemy kontrakt slotów jako jedno źródło prawdy w `src/components/ui-system/screen-slots.ts`.

Ten etap nie przebudowuje jeszcze ekranów. To jest blokada nazewnictwa i mapa, pod którą kolejne etapy będą przepinać `Lead`, `Client` i `Case`.

## Sloty

### Page

- `page.primaryActions` — główne akcje strony, np. dodaj, rozpocznij, utwórz.
- `page.secondaryActions` — akcje pomocnicze, np. import, eksport, odśwież, ustawienia widoku.

### Detail

- `detail.headerActions` — akcje w nagłówku szczegółów rekordu.
- `detail.quickActions` — szybkie akcje robocze dla rekordu.
- `detail.dangerZone` — akcje destrukcyjne albo ryzykowne.
- `detail.financePanel` — panel finansowy.
- `detail.notesPanel` — panel notatek.
- `detail.tasksPanel` — panel zadań.
- `detail.eventsPanel` — panel wydarzeń.

### List

- `list.filters` — filtry listy.
- `list.search` — wyszukiwarka listy.
- `list.rows` — wiersze listy.

## Kontrakt encji

Kontrakt obejmuje trzy główne encje operacyjne:

- `lead`
- `client`
- `case`

Każda z nich ma używać tych samych logicznych slotów. Nie oznacza to identycznej treści, tylko identyczne miejsce i rolę elementu.

Przykład:

- przycisk dodania leadu trafia do `page.primaryActions`,
- przycisk edycji klienta trafia do `detail.headerActions`,
- szybkie działania sprawy trafiają do `detail.quickActions`,
- usuwanie albo archiwizacja trafia do `detail.dangerZone`,
- zadania rekordu trafiają do `detail.tasksPanel`.

## Czego nie robić w tym etapie

- Nie przepinać jeszcze konkretnych ekranów na siłę.
- Nie zmieniać wyglądu kart, kafli, przycisków ani kolorów.
- Nie ruszać logiki lead → klient → sprawa.
- Nie robić refaktoru całych ekranów `LeadDetail`, `ClientDetail`, `CaseDetail`.
- Nie mieszać kontraktu slotów z kontraktem kolorów i tonów metryk.

## Testy i checki

Po wdrożeniu uruchomić:

```powershell
npm.cmd run check:closeflow-screen-placement-slots
npm.cmd run build
```

Check `scripts/check-closeflow-screen-placement-slots.cjs` sprawdza:

- czy istnieje `src/components/ui-system/screen-slots.ts`,
- czy istnieje eksport w `src/components/ui-system/index.ts`,
- czy istnieje dokumentacja VS-7,
- czy wszystkie sloty są zapisane w kontrakcie,
- czy `lead`, `client` i `case` używają tej samej listy slotów,
- czy `package.json` ma skrypt `check:closeflow-screen-placement-slots`.

## Kryterium zakończenia

Lead / Client / Case mają akcje w tych samych logicznych miejscach.

W VS-7 kryterium jest spełnione na poziomie kontraktu systemowego. Następny etap może zacząć przepinać realne ekrany pod te sloty bez wymyślania nazewnictwa od nowa.
