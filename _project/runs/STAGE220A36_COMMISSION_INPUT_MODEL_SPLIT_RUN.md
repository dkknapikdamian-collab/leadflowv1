# STAGE220A36 — Commission Input Model Split — RUN

Data: 2026-06-05 21:45 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## CEL
Rozdzielić model wprowadzania prowizji: kwota stała jako gotowa prowizja, procent jako wyliczenie z osobnej podstawy transakcji.

## ZMIANY
- CaseFinanceEditorDialog: rodzaj prowizji, podstawa procentu, stawka, wartość prowizji.
- Clients: wartość operacyjna klienta liczona jako prowizja należna, nie cena transakcji.
- Guardy i testy A35/A36.

## STATUS
Do lokalnego testu i push po PASS.
