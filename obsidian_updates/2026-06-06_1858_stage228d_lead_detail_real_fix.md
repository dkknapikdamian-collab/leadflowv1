# 2026-06-06 18:58 Europe/Warsaw — Stage228D LeadDetail real fix

## Routing

- entity_id: E001
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow / LeadFlow
- report_id: STAGE228D
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Decyzja / kierunek

LeadDetail ma byc dopiety do jednego zrodla prawdy wizualnej dla sekcji operacyjnych: zachowanie jak w CaseDetail, czyli kolorowe grupy-akordeony i maksymalnie jedna rozwinieta grupa.

## Wdrozenie lokalne

- Naprawiono runner po nieudanym Stage228C: brak falszywego DONE po bledzie.
- LeadDetail: akordeon Najblizsze dzialania / Braki i blokady / Wszystkie aktywne.
- Prawy rail: usuniety kafelek Powiazana sprawa, dodany kafelek Szybkie akcje.
- CSS: pelnotonowe kolory grup, bez bialego pustego kontenera w kolorowym kafelku.
- CSS: telefon w Dane leada nie jest przycinany.

## Testy

- npm run verify:stage228d-lead-detail-real-fix
- git diff --check
- recznie sprawdzic LeadDetail w przegladarce.

## Audyt ryzyk po etapie

- Dodaj brak nadal tworzy/otwiera zadanie, bo nie ma osobnego modelu brakow dla leada.
- Filtr brakow opiera sie na tytule/statusie zadania/wydarzenia, wiec to nie jest jeszcze pelny odpowiednik case_items.
- Brak migracji SQL i brak zmiany danych.

## Nastepny krok

Po akceptacji wizualnej: selektywny commit i push tylko plikow Stage228D.
