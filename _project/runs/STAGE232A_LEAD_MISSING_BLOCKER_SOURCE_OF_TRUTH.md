# STAGE232A_LEAD_MISSING_BLOCKER_SOURCE_OF_TRUTH

Data: 2026-06-15 Europe/Warsaw
Status: DO_WDROZENIA
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja

Robimy etap porzadkujacy LeadDetail: Braki, Blokady, historie i Dzialania leada.

Problem zgloszony przez Damiana:

- dodany Brak widac w historii, ale nie widac go w aktywnych brakach ani blokadach,
- historia pokazuje tytul dwa razy,
- UI wyglada jak kilka kopii tej samej listy dzialan,
- aplikacja nie moze zgadywac, czy dokument, spotkanie albo informacja blokuje proces.

## Teza produktu

```txt
Brak = aktywny element pracy, ktory czegos wymaga, ale nie musi blokowac procesu.
Blokada = brak albo problem, ktory realnie zatrzymuje nastepny ruch.
Historia = dziennik zdarzen, nie zrodlo prawdy dla aktywnych brakow.
```

## Pliki do skanu przed wdrozeniem

- AGENTS.md
- _project/CODEX_CONTEXT_INDEX.md, jesli istnieje
- _project/04_ETAPY_ROZWOJU_APLIKACJI.md
- _project/04_KIERUNEK_ROZWOJU_APLIKACJI.md
- _project/06_GUARDS_AND_TESTS.md
- _project/08_CHANGELOG_AI.md
- _project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md
- _project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md
- src/pages/LeadDetail.tsx
- src/components/ContextActionDialogs.tsx
- src/lib/activity-timeline.ts
- helpery Supabase dla zadan i aktywnosci
- testy/guardy Stage227/Stage228 dotyczace missing_item
- Obsidian TOC/index projektu CloseFlow

## Zakres R1

1. Naprawic zapis Braku z modala tak, zeby realny createdMissingTask byl przekazywany do no-flicker/silent refresh i handleSaved.
2. Ustalic aktywne Braki jako linkedTasks/work_items z leadId oraz type/kind = missing_item.
3. Nie liczyc aktywnych brakow z historii.
4. Dodac jawne pola blokowania w payload/meta, jesli nie ma bezpiecznej migracji SQL:
   - blocksProgress: boolean
   - blockScope: lead_next_action | offer | case_start | case_completion | payment | other | none
   - missingKind: document | information | decision | payment | meeting | other
5. Modal Brak ma pytac, czy brak blokuje dalszy ruch i co blokuje.
6. Rozdzielic w UI Braki i Blokady.
7. Top card Blokada pokazuje tylko prawdziwe blokady.
8. Historia ma formatowac Brak/Blokade bez powielania tytulu.
9. Dzialania leada maja byc jednym centrum pracy, a nie kopia historii albo kolejnych list.

## Czego nie ruszac

- Google Calendar
- finanse
- global layout
- pelny DMS
- duza migracja SQL bez schema check
- przebudowa calego CaseDetail
- AI Drafts poza kompatybilnoscia create_missing_item, jesli wymagana

## Guardy i testy wymagane

Dodac:

```txt
scripts/check-stage232a-lead-missing-blocker-source-truth.cjs
tests/stage232a-lead-missing-blocker-source-truth.test.cjs
```

Wymagane asercje:

- nieblokujacy Brak pojawia sie w Braki, ale nie w top card Blokada,
- blokujacy Brak pojawia sie w Braki, Blokady i top card Blokada,
- historia nie dubluje tytulu,
- rozwiazany Brak znika z aktywnych brakow,
- usuniety Brak nie wraca po refresh,
- aktywne braki nie sa liczone z historii,
- UI nie ma trzech aktywnych kopii tej samej listy.

Uruchomic:

```powershell
node scripts/check-stage232a-lead-missing-blocker-source-truth.cjs
node --test tests/stage232a-lead-missing-blocker-source-truth.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## Test reczny

1. Dodaj Brak nieblokujacy `TEST BRAK 123`.
2. Potwierdz, ze jest w Braki, nie ma go w top card Blokada, a historia nie powiela tytulu.
3. Dodaj Blokade `TEST BLOKADA 123`.
4. Potwierdz, ze jest w Braki, Blokady i top card Blokada oraz pokazuje, co blokuje.
5. Rozwiaz pierwszy Brak.
6. Potwierdz, ze znika z aktywnych brakow i zostaje w historii jako rozwiazany.
7. Zrob hard refresh i sprawdz, ze stan sie nie rozjechal.

## Warunek zamkniecia

- scan-first udokumentowany,
- Brak dziala bez reloadu i po hard refresh,
- Blokada jest jawna i niezgadywana,
- historia nie dubluje tytulu,
- listy dzialan nie sa bezsensownie powielone,
- guardy/build sa zielone albo blokada jest jasno opisana,
- _project i Obsidian payload sa zaktualizowane,
- commit/push selektywny tylko dla CloseFlow.
