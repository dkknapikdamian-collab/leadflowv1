---
typ: project_report
stage: STAGE216J3B
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-J3B - Lead Data Panel

## FAKTY

- J3A uprościł header.
- Pierwsza próba J3B nie weszła do gita przez błąd ścieżek relatywnych.
- Poprawiona wersja używa pełnych ścieżek.

## ZMIANY

- Lewa kolumna nie używa już EntityContactCard.
- Dane leada są w jednym miejscu: status, źródło, telefon, e-mail, firma, wartość, ostatnia aktywność.
- Panel ma akcję Edytuj dane.
- Telefon i e-mail mają akcję Kopiuj.

## CZEGO NIE RUSZANO

- Notatki.
- Zadania i wydarzenia.
- Prawy panel.
- SQL/RLS/GRANT.
- API i Supabase dane.

## TESTY

- node scripts/check-stage216j3b-lead-data-panel.cjs
- npm run build
- Vercel visual review.