# OBSIDIAN UPDATE - 2026-06-15 - STAGE232A

Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: DO_WDROZENIA

## FAKTY

- Damian zglosil blad w LeadDetail: dodany Brak jest widoczny w historii, ale nie jest widoczny w aktywnych brakach ani blokadach.
- Historia braku pokazuje tytul dwa razy.
- Sekcje dzialan w LeadDetail wygladaja jak zduplikowane listy.
- Centralna kolejka etapow zostala zaktualizowana: STAGE232A jest najblizszym etapem do wdrozenia.
- Centralny kierunek rozwoju aplikacji zostal zaktualizowany o zasade Brak != Blokada.

## DECYZJE DAMIANA

- Uporzadkowac Braki i Blokady jako produkcyjny model, nie kosmetyczny patch UI.
- Aplikacja nie moze zgadywac, co blokuje proces.
- Blokada musi byc jawna.
- Historia ma byc dziennikiem, nie zrodlem prawdy aktywnych brakow.

## KIERUNEK

```txt
Brak = aktywny element pracy, ktory czegos wymaga, ale nie musi blokowac procesu.
Blokada = brak albo problem, ktory realnie zatrzymuje nastepny ruch.
Historia = dziennik zdarzen, nie zrodlo prawdy dla aktywnych brakow.
```

## ETAP DO WDROZENIA

STAGE232A_LEAD_MISSING_BLOCKER_SOURCE_OF_TRUTH

Zakres:

- naprawic zapis Braku z LeadDetail,
- ustalic jedno zrodlo prawdy aktywnych brakow,
- dodac jawne oznaczanie blokady,
- rozdzielic Braki i Blokady w UI,
- naprawic historie bez duplikacji tytulu,
- ograniczyc dublowanie list dzialan.

## TESTY AUTOMATYCZNE DO DODANIA

- scripts/check-stage232a-lead-missing-blocker-source-truth.cjs
- tests/stage232a-lead-missing-blocker-source-truth.test.cjs

## TEST RECZNY DAMIANA

- Dodac nieblokujacy Brak i sprawdzic Braki + historie.
- Dodac blokujacy Brak i sprawdzic Braki + Blokady + top card Blokada.
- Rozwiazac Brak i sprawdzic, ze znika z aktywnych brakow.
- Zrobic hard refresh i sprawdzic stabilnosc stanu.

## RYZYKA

- Obecny zapis Braku moze tworzyc aktywnosc bez poprawnego aktywnego work item.
- Historia moze formatowac unknown activity przez payload.title jako tytul i opis.
- UI moze pokazywac kilka wariantow tej samej listy, co obniża zaufanie do aplikacji.
- Migracja SQL nie powinna byc robiona bez schema check; w R1 dopuszczalny payload/meta.

## NASTĘPNY KROK

Przekazac deweloperowi STAGE232A z obowiazkiem scan-first, guardami, testem recznym i aktualizacja _project oraz Obsidiana po wdrozeniu.
