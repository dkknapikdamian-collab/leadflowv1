# STAGE61_CASE_NOTE_ACTION_BUTTON_SWAP

Data: 2026-05-04

## Cel

Naprawia pomyłkę Stage60 po ręcznej weryfikacji UI: usunięty został zły przycisk notatki.

## Zmiana

- Przywrócono przycisk notatki w panelu akcji sprawy: `data-case-create-action="note"`.
- Usunięto górny przycisk `Dodaj notatkę` z nagłówka sekcji `Najważniejsze działania`.
- Pozostawiono logikę modala notatki i Stage59 follow-up prompt.
- Pozostawiono usunięty opis: `Zadania, wydarzenia, braki i notatki powiązane ze sprawą.`.

## Nie zmieniono

- Backend.
- Supabase.
- Model danych.
- Logiki zapisu notatki.
- Logiki Stage59 follow-up po notatce.

## Kryterium zakończenia

- W `Najważniejsze działania` nie ma górnego przycisku `Dodaj notatkę`.
- W panelu akcji sprawy jest przycisk notatki.
- `verify:case-operational-ui` przechodzi.
- `build` przechodzi.
