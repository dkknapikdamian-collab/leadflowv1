# CLOSEFLOW FIN-8 — Bulk visual contract repair — 2026-05-10

Marker: FIN-8_FINANCE_VISUAL_INTEGRATION_BULK_REPAIR

## Cel

Naprawić zbiorczo błędy wykryte przez ciężki test FIN-8, zamiast łatać pojedyncze frazy po kolei.

## Zakres

- Finanse używają `SurfaceCard` jako powierzchni.
- Statusy używają `StatusPill`.
- Formularze używają `FormFooter`.
- Lista płatności używa wspólnego źródła etykiet typów i statusów.
- FIN-6 carry-forward zostaje dopięty do commita.
- FIN-7 marker CSS zostaje zachowany.

## Zakaz

Stare lokalne warianty wizualne finansów są niedozwolone w źródłach finansowych. Ten dokument nie zapisuje ich dosłownych nazw, żeby guard nie łapał własnej dokumentacji.

## Wymagane komponenty design systemu

- SurfaceCard
- StatusPill
- FormFooter
