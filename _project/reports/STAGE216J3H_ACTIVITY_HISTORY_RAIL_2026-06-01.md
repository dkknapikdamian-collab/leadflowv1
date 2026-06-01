---
typ: project_report
stage: STAGE216J3H
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-J3H - Activity History Rail

## FAKTY

- Pierwsza próba J3H zatrzymała się przed commitem.
- Guard J3H wykrył brak redakcji notatek w historii aktywności.
- Fix dopisuje obsługę isNoteEvent w leadActivityHistoryItems.

## ZMIANY

- Historia aktywności zostaje w prawej kolumnie pod Najbliższe działania.
- Historia pokazuje 5 ostatnich zdarzeń związanych z leadem.
- Starsze wpisy są dostępne w rozwijanym bloku.
- Notatki są widoczne w historii jako zdarzenie Dodano notatkę, ale bez dublowania treści.
- Treść notatki zostaje w sekcji Notatki.

## TESTY

- node scripts/check-stage216j3h-activity-history-rail.cjs
- node scripts/check-stage216j3g-split-notes-from-history.cjs
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