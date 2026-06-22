

# 2026-06-22 — STAGE232K_R3C_PAYMENT_API_STATUS_DB_SAFE_PAID_FIX

Status: DO_WDROZENIA_LOKALNIE

Diagnoza: produkcja wysyłała z frontu type=commission i status=fully_paid, ale API /api/payments zwracało status=planned, bo backendowa walidacja PAYMENT_STATUSES nie dopuszczała fully_paid i używała fallbacku planned.

Decyzja techniczna: nie zakładać, że baza przyjmie fully_paid. Backend mapuje paid-like inputy (fully_paid, partially_paid, deposit_paid itd.) na DB-safe status paid, który jest już liczony jako opłacony.

Zakres: src/server/payments.ts + guard/test R3C + CF runtime allowlist.

Następny krok po PASS_PUSHED: manual smoke nową wpłatą prowizji. Stare testowe rekordy planned usunąć/skorygować osobno. Dropdown statusu wpłaty usunąć w kolejnym cleanupie.
