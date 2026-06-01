---
typ: project_report
stage: STAGE216H
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-H - Lead Detail Contact Card Compaction

## FAKTY
- Stage216-G poprawił ogólny cockpit leada.
- Po visual review karta leada została oceniona jako za szeroka i zdublowana z headerem.

## ZMIANY
- Kontaktowa karta leada jest kompaktowa.
- Avatar, nazwa i subtitle są ukryte w karcie kontaktowej, bo są już w headerze.
- Ostatni kontakt jest ukryty w karcie kontaktowej, bo jest już w headerze.
- Telefon, e-mail i firma zostają jako trzy robocze pola kontaktowe.
- Prawa karta Najbliższa akcja nie pokazuje już pustego '-' bez akcji.

## CZEGO NIE RUSZANO
- SQL/RLS/GRANT.
- Supabase dane.
- Storage upload.
- Google Calendar sync.
- API.

## TESTY
- node scripts/check-stage216h-lead-contact-card-compaction.cjs
- npm run build
- Visual review na Vercel po deployu.
