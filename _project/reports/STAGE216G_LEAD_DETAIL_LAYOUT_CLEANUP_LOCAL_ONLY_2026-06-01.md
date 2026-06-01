---
typ: project_report
stage: STAGE216G
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-G - Lead Detail Layout Cleanup

## FAKTY
- Damian zaakceptował kierunek: lead detail jako cockpit pracy sprzedażowej.
- Zmiana ma iść do Vercel, bo lokalny preview nie pozwala wiarygodnie ocenić widoku.

## ZMIANY
- Kompaktowy header.
- Lewa kolumna robocza.
- Prawa sticky kolumna decyzyjna.
- Puste stany zamienione na instrukcje działania i CTA.

## CZEGO NIE RUSZANO
- SQL/RLS/GRANT.
- Supabase dane.
- Storage upload.
- Google Calendar sync.

## TESTY
- npm run build przed pushem.
- Visual review na Vercel po deployu.
