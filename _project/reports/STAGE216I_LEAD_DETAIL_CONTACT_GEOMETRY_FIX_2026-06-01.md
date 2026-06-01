---
typ: project_report
stage: STAGE216I
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-I - Lead Detail Contact Geometry Fix

## FAKTY
- Stage216-G poprawił ogólny cockpit leada.
- Stage216-H skompaktował treść karty kontaktowej, ale karta nadal zajmowała całą lewą szerokość.
- Repo i Vercel pokazały, że H działa, ale potrzebna jest korekta geometrii.

## ZMIANY
- Desktopowy shell ma trzy kolumny: kontakt / praca / decyzje.
- Dane kontaktowe są kompaktowym panelem po lewej.
- Kafle Najbliższa akcja / Wartość / Aktywny lead siedzą obok, w kolumnie pracy.
- Prawy rail pozostaje decyzyjny.

## CZEGO NIE RUSZANO
- SQL/RLS/GRANT.
- Supabase dane.
- Storage upload.
- Google Calendar sync.
- API.

## TESTY
- node scripts/check-stage216i-lead-contact-geometry-fix.cjs
- npm run build
- Visual review na Vercel po deployu.
