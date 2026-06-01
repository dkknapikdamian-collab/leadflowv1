---
typ: project_report
stage: STAGE216J3C2
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-J3C2 - Notes Order Fix

## FAKTY

- J3C przeszedł guard, build i push.
- Visual review pokazał, że Zadania i wydarzenia nadal renderują się przed Notatki i historia kontaktu.
- Przyczyną jest brak wymuszonego display grid/flex na rodzicu przy użyciu CSS order.

## ZMIANY

- .lead-detail-main-column wymusza display: grid.
- Kolejność środka:
  1. kafle statusu,
  2. Notatki i historia kontaktu,
  3. Zadania i wydarzenia,
  4. Kontekst leada.

## TESTY

- node scripts/check-stage216j3c2-notes-order-fix.cjs
- node scripts/check-stage216j3c-notes-history-center.cjs
- npm run build

## CZEGO NIE RUSZANO

- JSX LeadDetail.
- Lewy panel danych.
- Prawy panel.
- API.
- SQL/RLS/GRANT.
- Supabase dane.