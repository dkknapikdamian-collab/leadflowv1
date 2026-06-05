# STAGE220A36-R5 — R4 Guard Token Compat — RUN

Data: 2026-06-05 22:30 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## CEL
Naprawic czerwony Vercel po d1e380f5 przez zbyt sztywny R4 guard.

## ZMIANY
- R4 guard akceptuje obecny token "CaseFinanceEditorDialog percent basis label" i historyczny "field".
- Dodano R5 guard i test regresyjny.
- Nie ruszano UI, Supabase, RLS ani payloadu case_items poza R4, ktory zostaje.

## STATUS
Do lokalnego testu i push po PASS.
