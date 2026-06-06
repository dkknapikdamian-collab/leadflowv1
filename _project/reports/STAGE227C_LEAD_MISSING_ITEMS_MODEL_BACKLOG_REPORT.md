# STAGE227C — Lead Missing Items / Blocks Model Backlog

Data: 2026-06-06 15:55 Europe/Warsaw
Status: FUTURE STAGE / DO WDROŻENIA PO STAGE227B, JEŚLI POTWIERDZONE
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Powód

W Stage227B planujemy uporządkować LeadDetail i dodać panel `Działania leada`, wzorowany operacyjnie na CaseDetail. Jednym z elementów może być przycisk `Dodaj brak` albo sekcja `Braki / obserwacje`.

Największe ryzyko: w repo nie ma osobnego modelu braków/blokad dla leada analogicznego do `case_items` w sprawie. Dlatego `Dodaj brak` w leadzie może na razie działać tylko jako szybkie zadanie albo notatka operacyjna. To jest uczciwy kompromis dla Stage227B, ale nie jest pełnym modelem braków.

## Decyzja

Nie budować pełnego modelu `braków leada` w Stage227B. Stage227B ma tylko uporządkować ekran i obsługę istniejących task/event/note.

Jeżeli po Stage227B Damian potwierdzi, że `brak leada` ma być czymś więcej niż zadanie oznaczone jako brak, zrobić osobny etap Stage227C.

## Teza Stage227C

Lead może potrzebować własnego lekkiego modelu braków/blokad, ale tylko jeśli realnie ma to służyć pracy sprzedażowej przed konwersją do sprawy.

Przykłady braków leada:

- brak telefonu,
- brak e-maila,
- brak decyzji klienta,
- brak dokumentu do wyceny,
- brak terminu spotkania,
- brak odpowiedzi po ofercie,
- potrzebna informacja do kwalifikacji,
- blokada: czeka na klienta,
- blokada: czeka na wewnętrzną decyzję.

## Zakres przyszłego Stage227C

### Opcja minimalna

Utrzymać `brak leada` jako task z typem/metadanym `missing_item` / `blocker`.

Wtedy trzeba dodać:

- jawny typ zadania `missing_item` albo `blocker`;
- UI w LeadDetail filtrujące takie zadania do sekcji `Braki i blokady`;
- guard, że `Dodaj brak` tworzy task z właściwym typem, a nie zwykłe zadanie bez klasyfikacji;
- test, że braki nie mieszają się z normalnymi follow-upami.

### Opcja pełniejsza

Dodać osobny model danych dla braków leadów, analogiczny koncepcyjnie do `case_items`, ale lżejszy.

Możliwa nazwa:

- `lead_items`
- `lead_missing_items`
- `lead_blockers`

Zakres pełniejszy wymaga osobnego SQL/migracji, RLS, API, DTO, UI i guardów. Nie robić tego bez potwierdzenia Damiana.

## Czego nie robić w Stage227B

- Nie dodawać nowej tabeli dla braków leada.
- Nie robić SQL/migracji.
- Nie mieszać `case_items` ze zwykłymi leadami.
- Nie udawać, że szybkie zadanie jest pełnym modelem braków.
- Nie budować drugiego systemu checklist w leadach bez decyzji produktowej.

## Pliki do przeczytania przy przyszłym wdrożeniu

- `src/pages/LeadDetail.tsx`
- `src/pages/CaseDetail.tsx`
- `api/case-items.ts` albo aktualna ścieżka obsługi case items
- `src/lib/data-contract.ts`
- `src/lib/work-items/normalize.ts`
- `src/lib/supabase-fallback.ts`
- aktualne migracje Supabase, jeśli pełny model będzie potwierdzony
- `_project/04_DECISIONS.md`
- `_project/06_GUARDS_AND_TESTS.md`
- `_project/11_RISKS_BUGS_TECH_DEBT.md`, jeśli istnieje

## Guardy przyszłego etapu

Jeśli minimalny model przez task:

- `scripts/check-stage227c-lead-missing-items-task-model.cjs`
- `tests/stage227c-lead-missing-items-task-model.test.cjs`

Jeśli pełny model przez tabelę:

- guard SQL/RLS/API;
- test API create/list/update/delete;
- test UI LeadDetail;
- test regresji CaseDetail, żeby nie pomieszać case items z lead items.

## Kryteria akceptacji przyszłego etapu

- `Dodaj brak` w leadzie ma jednoznaczny model danych.
- Brak/blokada nie miesza się z normalnym follow-upem.
- LeadDetail pokazuje `Braki i blokady` osobno od `Najbliższych działań`.
- Jeśli brak jest taskiem, ma typ `missing_item`/`blocker` i osobne filtrowanie.
- Jeśli brak jest osobną tabelą, ma własne API, RLS i guardy.
- CaseDetail i case_items nie są uszkodzone.

## Ryzyko

Budowa pełnego modelu braków leadów może być przesadą, jeśli w praktyce braki przed sprzedażą wystarczą jako zadania/obserwacje. Dlatego Stage227C ma najpierw porównać koszt, marżę operacyjną i realną wartość dla użytkownika. Nie robić tabeli tylko dlatego, że w sprawie istnieją `case_items`.

## Status

Ten plik jest notatką etapową/backlogiem. Nie zmienia runtime aplikacji.
