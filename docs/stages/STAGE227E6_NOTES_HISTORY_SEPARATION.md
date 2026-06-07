# STAGE227E6 — Notes vs History Separation

Data: 2026-06-07
Tryb: local-only, bez pushu.

## Cel

Rozdzielić notatki od historii aktywności w LeadDetail.

## Decyzja

- Notatki pokazują treść notatki.
- Historia aktywności pokazuje log zdarzeń.
- Historia nie powtarza pełnej treści notatki.
- Zdarzenie notatki w historii ma mieć generyczny tytuł: "Dodano notatkę".
- Treść notatki pozostaje w sekcji "Notatki".

## Nie ruszano

- SQL/Supabase.
- Modelu danych.
- Braków/blokad.
- Work center.
- QuickActionsBar.
- Prawa kolumna poza wcześniejszym E5.
