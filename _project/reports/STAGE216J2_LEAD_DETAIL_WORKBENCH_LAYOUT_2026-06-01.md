---
typ: project_report
stage: STAGE216J2
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-J2 - Lead Detail Workbench Layout

## FAKTY
- Stage216-G/H/I poprawiały objawy, ale zostawiły konflikt starych warstw layoutu.
- Damian wskazał, że dane powinny być w jednym miejscu i edytowalne, a notatki powinny mieć szeroką środkową przestrzeń.
- Najbliższe działania mają pokazywać 5 pozycji z datą powiązanych z leadem.

## ZMIANY
- Usunięto użycie EntityContactCard z głównego shell LeadDetail.
- Lewa kolumna: Dane leada + Obsługa + warunkowe finanse.
- Środek: Co dalej + Notatki i historia kontaktu.
- Prawa kolumna: Najbliższe 5 działań z datą + Szybkie akcje.
- Historia kontaktu i działania są limitowane do 5 pozycji w widoku głównym.

## CZEGO NIE RUSZANO
- SQL/RLS/GRANT.
- Supabase dane.
- Storage upload.
- Google Calendar sync.
- API.

## TESTY
- node scripts/check-stage216j2-lead-detail-workbench-layout.cjs
- npm run build
- Visual review na Vercel po deployu.
