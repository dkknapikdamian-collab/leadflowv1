# Stage117 - LeadDetail vertical rhythm local-only

## Status
LOCAL-ONLY / DO TESTU.

## Problem
Kartoteka leada ma za duzy pusty odstep miedzy sekcjami. To jest problem rytmu pionowego, nie modelu danych.

## Decyzja
Nie przebudowywac LeadDetail szeroko. Poprawic tylko gestosc ukladu w glownej kolumnie leada:
- mniejszy gap miedzy sekcjami,
- mniejszy padding kart,
- mniejszy margines naglowkow sekcji,
- mniejsze puste boxy,
- bez ukrywania Notatek, Zadan i wydarzen, Historii kontaktu.

## Pliki
- `src/pages/LeadDetail.tsx`
- `src/styles/visual-stage14-lead-detail-vnext.css`
- `tests/stage117-lead-detail-vertical-rhythm-contract.test.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `tools/patch-stage117-lead-detail-vertical-rhythm-local-only.cjs`

## Testy automatyczne w paczce
- `node --test tests/stage117-lead-detail-vertical-rhythm-contract.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

## Test reczny Damiana
- Otworzyc kartoteke leada.
- Sprawdzic czy nie ma duzego pustego odstepu miedzy Notatkami, kaflami, Zadaniami i Historia kontaktu.
- Sprawdzic czy sekcje nadal sa widoczne.
- Sprawdzic desktop i zwezony widok.

## Tryb
Bez commita i bez pusha. Ten etap jest dokladany do lokalnego batcha po Stage114E/F.
