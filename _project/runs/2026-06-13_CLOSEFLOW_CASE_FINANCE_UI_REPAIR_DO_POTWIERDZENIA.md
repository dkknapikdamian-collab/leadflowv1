---
project_id: closeflow_lead_app
canonical_name: CloseFlow / LeadFlow
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
stage_id: DO_POTWIERDZENIA
toc: 08, 09, 10, 11
---

# CLOSEFLOW_CASE_FINANCE_UI_REPAIR

## AUDYT PRZED ETAPEM
- Grupy dzialan i limit 5 byly czesciowo wdrozone.
- Minimalne zapytania work-items pomijaly `case_id` i `client_id`.
- Repo oczekiwalo `case_items.description`, ale schemat nie gwarantowal kolumny.
- Kolory finansowe byly rozproszone.

## ZMIANY
- Filtrowanie task/event po `case_id`, jawny blad pobierania i optimistic insert.
- Addytywna migracja `case_items` oraz reload schema PostgREST.
- Wspolny kontrakt `data-cf-finance-tone` i label `Pozostalo do zaplaty`.
- Kolejnosc akcji notatek i ellipsis leadow.

## WERYFIKACJA
- PASS: dedykowany guard/test, task-event guard, urgent regression guard, build, diff-check.
- FAIL niezwiązany: globalny Stage98 mojibake/BOM.
- FAIL niezwiązany: dwie stare migracje portalu.
- SKIP: browser localhost zablokowany przez polityke narzedzia.

## AUDYT PO ETAPIE
- Naprawiono przyczyne utraty relacji, nie tylko render listy.
- Inne sprawy sa odcinane po `case_id`; statusy `canceled/cancelled` sa wykluczane.
- Braki pozostaja w `case_items`, bez drugiego zrodla danych.
- Kolory maja jedno zrodlo w `closeflow-finance.css`.
- Obce pliki 231D nie zostaly objete zakresem.
- Znalezione problemy: brak nowych.

## STATUS
- LOCAL_IMPLEMENTED_AUTOMATED_PASS_MANUAL_PENDING
- Bez commitu i pushu.
