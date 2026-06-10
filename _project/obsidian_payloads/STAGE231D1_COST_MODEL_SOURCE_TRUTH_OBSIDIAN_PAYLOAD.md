# STAGE231D1_COST_MODEL_SOURCE_TRUTH — Obsidian payload

data i godzina: 2026-06-10 Europe/Warsaw
nazwa / alias wejściowy: STAGE231D1 — model kosztów
canonical_name: CloseFlow / LeadFlow
folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
typ wpisu: etap finansów / model kosztów / source of truth
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze

## Decyzja

STAGE231D1_COST_MODEL_SOURCE_TRUTH: koszty sprawy mają centralny model przed UI i SQL.

## VISUAL SOURCE OF TRUTH

D1 nie dodaje UI. Etykiety kosztów są centralne:
- Koszty poniesione
- Koszty do zwrotu
- Koszty zwrócone
- Razem do pobrania

## D1 nie dodaje SQL

SQL, tabela kosztów, RLS i Supabase guard mają wejść dopiero w D2, kiedy model będzie podpinany do sprawy.

## bez zmian runtime UI

Nie zmieniano ClientDetail, CaseDetail, widoków kart ani styli.

## testy

- check:stage231d1-cost-model-source-truth
- test:stage231d1-cost-model-source-truth
- D0/D0A regression
- Polish guard
- build
- git diff --check

## audyt ryzyk

- Ryzyko: D2 musi nie zdublować modelu kosztów lokalnie.
- Ryzyko: SQL musi być podany osobno, gotowy do kopiuj-wklej, z guardem efektu.
- Ryzyko: UI kosztów musi użyć D0A Visual Source of Truth.

## następny krok

STAGE231D2 — koszty w sprawie: SQL + UI + guardy.
