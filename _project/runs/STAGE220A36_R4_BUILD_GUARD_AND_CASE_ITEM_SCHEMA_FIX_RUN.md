# STAGE220A36-R4 — Build Guard and Case Item Schema Fix — RUN

Data: 2026-06-05 22:15 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## CEL
Naprawic czerwony Vercel build po 00b8a95 i runtime PGRST204 przy dodawaniu braku.

## ZMIANY
- A35/A36 guard clean UTF-8 without BOM/mojibake.
- A35/A36 guard accepts A36-R2 modal copy/order.
- api/case-items POST no longer sends approved_at.
- Added R4 guard and runtime test.

## STATUS
Do lokalnego testu i push po PASS.
