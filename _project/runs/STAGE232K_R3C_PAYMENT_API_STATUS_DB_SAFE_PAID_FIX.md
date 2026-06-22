

# STAGE232K_R3C_PAYMENT_API_STATUS_DB_SAFE_PAID_FIX

Data/czas: 2026-06-22 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: READY_FOR_LOCAL_TEST

## Cel
Naprawić backend /api/payments, który zamieniał request type=commission + status=fully_paid na response status=planned.

## Diagnoza
Frontend wysyłał poprawnie type=commission i status=fully_paid, ale API dopuszczało tylko planned/due/paid/cancelled i używało fallbacku planned. R3C mapuje paid-like inputy na DB-safe status paid.

## Zakres
- src/server/payments.ts
- scripts/check-stage232k-r3c-payment-api-status-db-safe-paid.cjs
- tests/stage232k-r3c-payment-api-status-db-safe-paid.test.cjs
- scripts/check-cf-runtime-00-source-truth.cjs

## Nie dotykano
SQL, RLS, MissingItems/Braki, Owner Control, Calendar, billing, Node_RED_Kabelki, lokalny Obsidian vault.

## Manual smoke po wdrożeniu
Dodać NOWĄ wpłatę prowizji 1000 PLN. Oczekiwane: POST request status fully_paid, response/GET status paid, panel pokazuje wpłacono 1000 i pozostało 2000.
