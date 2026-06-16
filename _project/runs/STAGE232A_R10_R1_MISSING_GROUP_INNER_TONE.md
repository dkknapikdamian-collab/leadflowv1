# STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE

- data i godzina: 2026-06-16 23:45 Europe/Warsaw
- status: PASS_LOCAL_DO_SPRAWDZENIA
- typ: UI visual microfix
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Problem
W rozwinietej grupie Braki i blokady wewnetrzny pusty kafelek/row nadal byl neutralny, mimo ze sama grupa ma kolor brakow.

## Decyzja
Kolor grupy ma dotyczyc rowniez jej zawartosci:
- empty state Braki i blokady: amber/missing tone;
- item rows w blockers: amber/missing tone;
- nie zmieniac Cisza / ryzyko, bo tam zolty top card jest OK.

## Test reczny
1. Wejdz w LeadDetail bez brakow.
2. Rozwin Braki i blokady.
3. Wewnetrzny empty card ma byc amber/missing, nie neutralny bialy.
4. Dodaj brak blokujacy.
5. Wiersz braku w grupie Braki i blokady ma byc amber/missing.
