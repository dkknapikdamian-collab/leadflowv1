---
typ: project_report
stage: STAGE216J3F
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-J3F - Notes UX cleanup

## FAKTY

- Visual review po J3E pokazał, że inline pole notatki jest mylące.
- Klik Dodaj notatkę powinien otwierać jeden czytelny formularz notatki.
- Kontekst leada dublował ostatnią notatkę z historii.

## ZMIANY

- Usunięto inline textarea z sekcji Notatki i historia kontaktu.
- Dodano dwa jawne przyciski: Dodaj notatkę i Dyktuj notatkę.
- Dodano modal Dodaj notatkę, który zapisuje przez istniejący handleAddNote.
- Kontekst leada jest teraz opcjonalny i pokazuje tylko notatkę źródłową z leada.
- Ostatnia notatka z historii nie jest już powielana w Kontekście leada.

## TESTY

- node scripts/check-stage216j3f-notes-ux-cleanup.cjs
- node scripts/check-stage216j3e-duplicate-actions-cleanup.cjs
- node scripts/check-stage216j3e-hotfix-jsx-newline.cjs
- npm run build
- Vercel visual review

## CZEGO NIE RUSZANO

- API.
- SQL/RLS/GRANT.
- Supabase dane.
- Storage.
- Google Calendar.