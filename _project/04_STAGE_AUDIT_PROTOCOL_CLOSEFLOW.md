# 04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW - CloseFlow / LeadFlow

Data: 2026-06-12 20:19 Europe/Warsaw  
Status: ACTIVE  
Typ: obowiązkowy protokół audytu przed i po każdym etapie  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Canonical name: CloseFlow / LeadFlow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Cel

Ten protokół mówi, jak prowadzić każdy kolejny etap CloseFlow: przed wdrożeniem, w trakcie wdrożenia i po wdrożeniu.

Decyzja Damiana z 2026-06-12: przy każdym etapie trzeba zrobić audyt etapu przed wdrożeniem i po wdrożeniu. Audyt ma szukać realnych problemów: rzeczy źle podpiętych, niedopiętych, niedokończonych, sprzecznych z kierunkiem aplikacji albo ryzykownych. Nie wolno doszukiwać się problemów na siłę ani robić chaosu poza zakresem etapu.

## Zasada główna

Każdy etap musi mieć trzy warstwy:

1. Audyt przed etapem - czy rozumiemy, co robimy i czy nie ma obok realnego problemu.
2. Wdrożenie etapu - tylko w ustalonym zakresie, z guardem/testem.
3. Audyt po etapie - czy poprawka nie stworzyła regresji, drugiego źródła prawdy albo niedokończonego przepięcia.

Etap bez audytu przed i po nie jest zamknięty.

## 1. Audyt przed etapem

Przed kodem, ZIP-em albo poleceniem dla Codexa trzeba ustalić:

### 1.1 Routing projektu

- projekt: CloseFlow / LeadFlow,
- repo: `dkknapikdamian-collab/leadflowv1`,
- branch: `dev-rollout-freeze`,
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`,
- Obsidian folder: `10_PROJEKTY/CloseFlow_Lead_App`,
- etap: nazwa i numer,
- typ etapu: UI / routing / data / auth / Supabase / docs / guard / cleanup / product.

Jeżeli wklejony tekst wygląda jak inny projekt, zatrzymać pracę i zgłosić konflikt. Nie wdrażać w cudzym repo.

### 1.2 Źródła do przeczytania

Minimum dla każdego etapu:

- `AGENTS.md`,
- `_project/00_PROJECT_MEMORY_PROTOCOL.md`,
- `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`,
- `_project/STAGE_TEMPLATE_MINIMAL.md`,
- właściwy plik etapu / roadmapy, np. `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md`,
- najnowsze raporty z `_project/runs/`, jeżeli dotyczą tego modułu,
- `package.json`, jeżeli etap dotyczy guardów/testów/builda,
- pliki kodu, których etap dotyka.

Obsidian, jeśli jest dostępny:

- pulpit projektu,
- aktualny stan,
- aktywne decyzje,
- kierunek do wdrożenia,
- mapa zależności,
- ściąga plików,
- testy i wyniki,
- ryzyka/bugi/dług techniczny.

Jeżeli Obsidian nie jest dostępny, zapisać `OBSIDIAN_LOCAL_UNAVAILABLE` i przygotować payload do wklejenia.

### 1.3 Sprawdzenie, czy etap już istnieje

Przed planowaniem trzeba sprawdzić, czy etap nie jest już wdrożony w całości albo częściowo.

Raport musi odpowiedzieć:

- co już istnieje,
- gdzie istnieje,
- czego brakuje,
- co jest sprzeczne,
- jakie guardy/testy już są,
- jakich guardów/testów brakuje,
- jaki jest najbezpieczniejszy zakres.

Nie wolno przepisywać etapu od zera, jeżeli istnieje częściowe wdrożenie.

### 1.4 Mapa obszaru zmiany

Dla każdego etapu trzeba krótko wypisać:

- ekran, na którym Damian to zobaczy,
- ścieżkę w aplikacji, np. `/leads`, `/clients/:id`, `/case/:caseId`,
- główne komponenty,
- źródło danych,
- powiązane akcje,
- podobne miejsca, które mogą mieć ten sam wzorzec,
- czego nie wolno ruszać.

Dla UI zawsze dopisać: gdzie dokładnie Damian ma kliknąć i co ma zobaczyć.

### 1.5 Realne problemy do sprawdzenia obok

Audyt ma szukać tylko realnych problemów. Przykłady realnych problemów:

- trasa publiczna pokazuje coś, co powinno być gated,
- komponent używa starego źródła danych,
- jedna akcja istnieje w dwóch miejscach i działa inaczej,
- guard sprawdza tylko string, a nie klasę błędu,
- UI tworzy drugi wariant tego samego kafelka/przycisku,
- komentarz w kodzie mówi, że coś jest obejściem,
- TODO/FIXME dotyczy aktualnie ruszanego modułu,
- env albo auth ma fallback maskujący błąd,
- etap zmienia layout, ale nie aktualizuje Visual Tile System / atlasu UI,
- usunięcie w UI działa optymistycznie, ale dane mogą wrócić po refetchu,
- plik dokumentacji mówi co innego niż kod.

Czego nie robić:

- nie szukać problemów losowo po całym repo,
- nie naprawiać obcych modułów bez związku,
- nie robić refactoru przy okazji,
- nie mieszać etapów UI, Supabase, docs i guard runnerów w jednym patchu,
- nie przepisywać historii `_project` tylko dlatego, że ma stare krzaki.

## 2. Guard/test przed wdrożeniem

Każdy etap musi mieć plan dowodu:

- guard automatyczny, jeżeli da się sprawdzić klasę błędu,
- test build/typecheck, jeżeli zmiana dotyka runtime,
- test ręczny dla Damiana, jeżeli zmiana jest wizualna,
- jawny `BRAK DEDYKOWANEGO GUARDA` tylko z powodem i ryzykiem.

Guard ma chronić klasę błędu, nie jedną linijkę.

Przykłady:

- public preview routes -> guard blokuje publiczne trasy preview w produkcji,
- chunk/lazy -> guard sprawdza default/named export stron,
- auth/env -> guard sprawdza brak cichego service-role fallback w produkcji,
- encoding -> guard aktywnych dokumentów,
- visual tile -> guard wymaga wspólnych klas/atrybutów wzorca.

## 3. Zasady wdrożenia

Podczas wdrożenia:

- zmieniać tylko pliki objęte etapem,
- nie ruszać SQL/Supabase, jeśli etap tego nie wymaga,
- nie zmieniać UI przy etapie logicznym,
- nie zmieniać logiki danych przy etapie wizualnym,
- nie tworzyć drugiego źródła prawdy,
- nie tworzyć nowego stylu, jeśli istnieje wspólny wzorzec,
- nie usuwać obejścia bez potwierdzenia, że jego przyczyna jest naprawiona,
- aktualizować `_project` równolegle z kodem.

Jeśli w trakcie wyjdzie drugi podobny błąd, przejść w kontrolowany bug-class sweep tylko dla tego modułu / klasy błędu.

## 4. Audyt po etapie

Po zmianie trzeba sprawdzić:

### 4.1 Czy etap naprawdę rozwiązał problem

- Czy objaw zniknął?
- Czy przyczyna została naprawiona, a nie tylko ukryta?
- Czy podobne miejsca zostały sprawdzone?
- Czy nowy guard łapie tę klasę problemu?

### 4.2 Czy coś się nie rozpięło

Sprawdzić:

- routing,
- auth/gating,
- źródło danych,
- refetch/optimistic update,
- statusy i mapowania,
- powiązane akcje,
- layout i czytelność w 5 sekund,
- mobile, jeśli zmiana dotyka układu,
- build/typecheck,
- test ręczny.

### 4.3 Czy nie powstał dług albo konflikt

Sprawdzić:

- czy dokumentacja nie mówi starej wersji,
- czy `_project/07_NEXT_STEPS.md` albo aktywny plik etapu nie wymaga aktualizacji,
- czy Obsidian payload jest przygotowany,
- czy nie zostały tymczasowe TODO bez wpisu w ryzykach,
- czy nie dodano nowego obejścia bez opisu,
- czy nie ma orphan files.

### 4.4 Wynik audytu po etapie

Raport po etapie musi mieć sekcję:

```txt
AUDYT PO ETAPIE
- co mogło się zepsuć:
- co sprawdzono obok:
- podobne miejsca:
- nowe problemy wykryte:
- problemy świadomie nie ruszone:
- guard/test dowodzący:
- manual test dla Damiana:
- wpływ na Obsidian/_project:
- następny najlepszy krok:
```

## 5. Hard stop

Zatrzymać etap i nie pushować, jeśli:

- nie przeczytano `AGENTS.md`, `_project` i właściwego pliku etapu,
- etap dotyczy innego projektu,
- guard/test jest czerwony,
- `git diff --check` jest czerwony,
- zmiana wymaga SQL/RLS/env, a etap tego nie przewidywał,
- UI wygląda gorzej albo mniej czytelnie niż przed etapem,
- naprawa maskuje problem zamiast go rozwiązać,
- dane mogą wracać po odświeżeniu/refetchu,
- nie wiadomo, jak Damian ma ręcznie sprawdzić efekt.

## 6. Raport wymagany przed wydaniem ZIP/push

Każdy etap musi zakończyć się raportem:

- etap wdrożony:
- gdzie w aplikacji to widać:
- pliki repo przeczytane:
- pliki Obsidiana przeczytane / unavailable:
- pliki zmienione:
- guardy/testy uruchomione:
- wynik:
- test ręczny dla Damiana:
- audyt przed etapem:
- audyt po etapie:
- co znaleziono dodatkowo:
- czego nie ruszano:
- Obsidian/_project update:
- git status / diff check:
- następny etap:

## 7. Zastosowanie do STAGE232A-F

Dla etapów z `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md`:

1. `STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK` - audytować routing public/private, fixture danych, auth gate i produkcyjne preview.
2. `STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY` - audytować importy stron, lazy boundaries, exporty i route smoke.
3. `STAGE232C_AUTH_ENV_FAIL_CLOSED` - audytować env contract, service-role fallback i błędy konfiguracji.
4. `STAGE232D_DOCS_ENCODING_SWEEP` - audytować tylko aktywne docs, bez przepisywania starej historii.
5. `STAGE232E_POLISH_MOJIBAKE_GUARD_SCOPE` - audytować zakres guardu i fałszywe PASS.
6. `STAGE232F_GUARD_RUNNER_CROSS_PLATFORM_CLEANUP` - audytować runner, Windows/Linux, release gate i ryzyko wycięcia starych guardów.

## Obsidian update payload

- data i godzina: 2026-06-12 20:19 Europe/Warsaw
- typ wpisu: obowiązkowy protokół audytu przed i po etapie
- project: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- docelowe pliki Obsidiana: `04_KIERUNEK_DO_WDROZENIA`, `09_TESTY_DO_WYKONANIA_I_WYNIKI`, `11_RYZYKA_BUGI_I_DLUG_TECHNICZNY`, `08_HISTORIA_ZMIAN`
- status: zapisane w repo; Obsidian lokalny DO_SYNCHRONIZACJI
