# STAGE227B — Lead Detail Work Action Center + Leads History Tile Cleanup

Data: 2026-06-06 15:45 Europe/Warsaw
Status: DO WDROŻENIA PO STAGE227A / LOCAL-ONLY FIRST
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Powód

Damian zgłosił, że śledzenie historii i obsługa działań w leadzie są niewystarczające:

1. Na liście Leadów jest kafelek `Historia`, który myli filtr leadów przeniesionych do obsługi z prawdziwą historią pracy.
2. Po wejściu w LeadDetail użytkownik widzi najbliższe działania, ale nie ma wystarczająco wygodnego centrum operacyjnego do obsługi zadania/wydarzenia bez przechodzenia do Kalendarza.
3. Przykład realny: wydarzenie odbyło się dzisiaj, ale użytkownik nie chce zamykać go tylko przez Kalendarz. LeadDetail powinien pozwalać na obsługę wydarzenia/zadania w miejscu pracy z leadem.
4. CaseDetail ma już lepszy wzorzec: `Działania sprawy`, `Najbliższe działania`, `Braki i blokady`, `Wszystkie aktywne`. LeadDetail powinien dostać analogiczny, ale lżejszy panel.

## Teza

LeadDetail ma być miejscem pracy z działaniami leada. Użytkownik nie może być zmuszony do przejścia do Calendar tylko po to, żeby oznaczyć wydarzenie/zadanie jako zrobione, edytować, przesunąć albo usunąć.

## Zakres Stage227B

### 1. Usunąć kafelek Historia z `/leads`

Usunąć albo ukryć top stat card `Historia` z listy Leadów.

Nie usuwać w pierwszym kroku całej logiki `quickFilter === 'history'`, jeśli jest używana do historii leadów przeniesionych do obsługi. Na start usunąć mylący kafelek z górnych statów.

### 2. Dodać główny panel `Działania leada` w LeadDetail

Panel ma być wzorowany na CaseDetail, ale dopasowany do leada:

- `Działania leada`
- `Zadania, wydarzenia i obserwacje przypięte do tego leada`
- sekcje: `Najbliższe działania`, `Zaległe`, `Wszystkie aktywne`
- opcjonalnie miejsce na `Obserwacje / braki` jako przyszły model bez nowej tabeli

### 3. Akcje na task/event w LeadDetail

Każde działanie leada w głównym panelu powinno pozwalać na minimum:

- `Edytuj`
- `Zrobione`
- `Jutro` albo `+1D`
- `Usuń`

Opcjonalnie zostawić `+1H` i `+1W`, jeśli nie obciążają UI.

### 4. Główne akcje nie mogą być schowane tylko w `Pozostałe działania`

Obecny wzorzec, w którym pełne akcje pojawiają się dopiero dla dalszych wpisów, jest odwrócony operacyjnie. Najważniejsze działania na górze muszą mieć akcje.

### 5. Obserwacje

Nie budować nowej tabeli na tym etapie. `Obserwacja` może być szybką notatką operacyjną przypiętą do leada, zapisywaną obecnym systemem notatek/activities. Dodać przycisk `Dodaj obserwację`, który może otworzyć obecny modal notatki z prefixem `Obserwacja:`.

## Pliki do przeczytania przed wdrożeniem

- `AGENTS.md`
- `_project/07_NEXT_STEPS.md`
- `_project/04_DECISIONS.md`
- `_project/06_GUARDS_AND_TESTS.md`
- `_project/13_TEST_HISTORY.md`
- `_project/08_CHANGELOG_AI.md`
- `_project/12_IMPLEMENTATION_LEDGER.md`
- `src/pages/Leads.tsx`
- `src/pages/LeadDetail.tsx`
- `src/pages/CaseDetail.tsx`
- `src/lib/work-items/planned-actions.ts`
- `src/lib/work-items/normalize.ts`
- `src/lib/supabase-fallback.ts`

AI developer ma porównać LeadDetail z CaseDetail i nie wymyślać nowego designu od zera.

## Czego nie ruszać

- Stage227A Lejek, jeśli jest aktualnie wdrażany lokalnie
- Supabase schema
- RLS
- Google Calendar timezone
- finanse A36
- start_service / konwersja lead -> sprawa
- AI Drafts
- pełna przebudowa LeadDetail

## Guard do dodania

`scripts/check-stage227b-lead-detail-work-action-center.cjs`

Guard ma sprawdzać:

- `Leads.tsx` nie renderuje top stat card `label="Historia"`
- `LeadDetail.tsx` ma marker `data-stage227b-lead-work-action-center="true"`
- LeadDetail pokazuje główną sekcję `Działania leada`
- top actions mają akcje `Edytuj`, `Zrobione`, `Jutro` albo `+1D`, `Usuń`
- najbliższe działania nie są tylko read-only listą w right rail
- istnieją ścieżki `updateTaskInSupabase` i `updateEventInSupabase` dla task/event
- brak wymogu przejścia do Calendar, żeby oznaczyć event jako zrobiony

## Test do dodania

`tests/stage227b-lead-detail-work-action-center.test.cjs`

Testy:

1. `Leads.tsx` nie zawiera kafelka `Historia` jako `StatShortcutCard`.
2. `LeadDetail.tsx` ma sekcję `Działania leada`.
3. `LeadDetail.tsx` renderuje akcje dla tasków.
4. `LeadDetail.tsx` renderuje akcje dla eventów.
5. Event z dzisiaj może dostać akcję `Zrobione`.
6. Task/event można edytować z LeadDetail.
7. Top 5 działań nie jest tylko read-only.
8. Right rail może zostać skrótem, ale pełne akcje są w centrum.

## Komendy testowe

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

git status -sb

node scripts/check-stage227b-lead-detail-work-action-center.cjs
node --test tests/stage227b-lead-detail-work-action-center.test.cjs

npm run build
npm run verify:closeflow:quiet

git diff --check
git status --short
```

Jeżeli Stage227A jest w trakcie lokalnego wdrożenia, odpalić też jego guard/test, żeby nie zepsuć lejka.

## Test ręczny

1. Wejść w `/leads`.
2. Potwierdzić, że kafelek `Historia` z top statów zniknął.
3. Wejść w leada z wydarzeniem dzisiaj.
4. W LeadDetail znaleźć sekcję `Działania leada`.
5. Sprawdzić, czy wydarzenie jest widoczne w głównym panelu, nie tylko w prawym railu.
6. Kliknąć `Zrobione`.
7. Sprawdzić, czy wydarzenie zmienia status i znika z aktywnych albo dostaje status zakończony.
8. Dodać nowe wydarzenie z LeadDetail.
9. Edytować wydarzenie z LeadDetail.
10. Przesunąć wydarzenie na jutro.
11. Usunąć testowe wydarzenie.
12. Sprawdzić Calendar — status/godzina są spójne.
13. Sprawdzić CaseDetail — nie został zepsuty.

## Ryzyka

1. Można przypadkiem zbudować drugi, niespójny kalendarz w LeadDetail. Nie robić tego. Używać tych samych task/event helpers i update functions.
2. Można zduplikować akcje w prawym railu i centrum. Preferencja: centrum = pełna obsługa, right rail = skrót.
3. Usunięcie kafelka Historia może utrudnić dostęp do leadów przeniesionych do obsługi. Jeśli filtr nadal potrzebny, przenieść go później do filtrów prostych, nie top stat cards.
4. Event z Google Calendar po `Zrobione` może mieć inną semantykę. Wymagany Calendar smoke.

## Kryteria akceptacji

- Kafelek `Historia` znika z top stat cards `/leads`.
- LeadDetail ma główny panel `Działania leada`.
- Event z dzisiaj można oznaczyć jako zrobiony z LeadDetail.
- Task można oznaczyć jako zrobiony z LeadDetail.
- Event/task można edytować z LeadDetail.
- Event/task można przesunąć na jutro/+1D z LeadDetail.
- Nie trzeba iść do Calendar, żeby obsłużyć działanie leada.
- CaseDetail nie traci obecnych działań sprawy.
- Guard PASS.
- Runtime test PASS.
- Build PASS.
- `verify:closeflow:quiet` PASS.
- `git diff --check` czysty.

## Status

Ten plik jest notatką etapową/backlogiem. Nie zmienia runtime aplikacji.
