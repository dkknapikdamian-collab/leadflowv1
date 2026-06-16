# STAGE232A_R9_BLOCKER_TOP_CARD_SUMMARY_AND_ALL_MISSING

- data i godzina: 2026-06-16 21:35 Europe/Warsaw
- status: PASS_LOCAL_DO_SPRAWDZENIA
- typ: UI/runtime hotfix
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Problem
Top card Blokada po R8 mial akcje per-item i nie pozwalal wygodnie dodac kolejnego braku, gdy aktywna blokada juz istniala.

## Decyzja
Top card Blokada nie jest lista operacyjna. To ma byc podsumowanie:
- pokazuje liczbe aktywnych blokad/brakow;
- ma zawsze Dodaj brak;
- ma Zobacz wszystkie braki, gdy istnieje jakikolwiek aktywny brak/blokada;
- Rozwiaz/Usun sa tylko w zoltym akordeonie przy konkretnych pozycjach.

## Test reczny
1. Lead z aktywna blokada.
2. Top card pokazuje liczbe, bez Rozwiaz/Usun.
3. Top card ma Dodaj brak.
4. Dodaj drugi brak/blokade.
5. Kliknij Zobacz wszystkie braki.
6. Zolty akordeon pokazuje wszystkie pozycje.
7. Rozwiaz/Usun dziala przy konkretnym wierszu.


## STAGE232A_R9_R2_R8_GUARD_COMPAT_CLOSURE

- data i godzina: 2026-06-16 21:50 Europe/Warsaw
- status: PASS_LOCAL_DO_SPRAWDZENIA
- typ: guard compatibility closure

### Problem
R9-R1 zatrzymal sie na starym R8 guardzie. Kod R9 jest celowy: top card jest summary-only, a akcje Rozwiaz/Usun sa w missing-only branch listy.

### Zmiana
R8 guard/test akceptuje R9 missing-only branch jako kontynuacje reguly: blocker group uses missing actions.
