---
typ: project_report
stage: STAGE216J3A
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-J3A - Lead Detail Header Simplification

## FAKTY
- Po rollbacku J2 build wrócił do PASS.
- J3 ma być dzielone na małe, bezpieczne etapy.

## ZMIANY
- Header leada ustawiony jako jeden wiersz.
- W headerze zostają: powrót, nazwa, status i główne akcje.
- Meta: źródło, ostatnia aktywność i kontakt są ukryte z headera. Wrócą w J3B jako panel danych leada.

## CZEGO NIE RUSZANO
- Notatki.
- Zadania i wydarzenia.
- Prawy panel.
- SQL/RLS/GRANT.
- API i Supabase dane.

## TESTY
- node scripts/check-stage216j3a-lead-detail-header-simplification.cjs
- npm run build
- Vercel visual review.
