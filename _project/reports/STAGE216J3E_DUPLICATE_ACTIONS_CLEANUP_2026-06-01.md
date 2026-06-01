---
typ: project_report
stage: STAGE216J3E
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-J3E - Duplicate Actions Cleanup

## FAKTY

- J3D dodał prawą kartę Najbliższe działania.
- Visual review pokazał duplikat: środkowe Zadania i wydarzenia powtarzały pusty stan z prawej kolumny.
- Karta Szybkie akcje zawierała tylko Rozpocznij obsługę i dublowała header oraz Powiązaną sprawę.

## ZMIANY

- Środkowa sekcja działań staje się sekcją Pozostałe działania.
- Pozostałe działania pokazują się tylko, gdy timeline ma więcej niż 5 pozycji.
- Środkowa lista pokazuje elementy od szóstej pozycji przez timeline.slice(5).
- Usunięto zduplikowaną kartę Szybkie akcje z prawej kolumny.
- Najbliższe działania pozostają głównym miejscem dla follow-upu i wydarzeń.

## TESTY

- node scripts/check-stage216j3e-duplicate-actions-cleanup.cjs
- npm run build
- Vercel visual review

## CZEGO NIE RUSZANO

- API.
- SQL/RLS/GRANT.
- Supabase dane.
- Storage.
- Google Calendar.