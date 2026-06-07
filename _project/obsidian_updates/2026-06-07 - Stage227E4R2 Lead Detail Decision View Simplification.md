# Stage227E4R2 — Lead Detail Decision View Simplification

- data i godzina: 2026-06-07 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: doprecyzowanie IA i ograniczenie nadmiaru danych

## Decyzja
Stage227E4 technicznie działa, ale produktowo panel "Sygnał sprzedażowy" był za ciężki i dublował dane leada. Zmieniamy go na lekki "Kontekst sprzedażowy".

## Zasada
Nie pokazywać dużych pól decyzyjnych dla danych technicznych typu źródło Facebook albo status Nowy. To zostaje w danych leada/headerze, nie w panelu decyzji.

## Zostaje w panelu
- Potrzeba / problem
- Termin / pilność
- Budżet / potencjał
- Decyzja
- Blokada

## Guard
- Brak fallbacku do sourceLabel.
- Brak fallbacku do lead.status.
- Brak dużego pola "Powód kontaktu".
- Panel renderuje przed Work Action Center.

## Następny krok
Po PASS build i visual check można commitować. Stage227E5 zostaje osobnym etapem dla Missing / Blocker UX V1.
