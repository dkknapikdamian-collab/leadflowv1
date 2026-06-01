---
typ: project_report
stage: STAGE216J3G
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-J3G - Split Notes From Activity History

## FAKTY

- Visual review po J3F pokazał, że Notatki i historia kontaktu mieszają dwa różne byty.
- Pierwsza próba J3G zatrzymała się przed commitem na guardzie: brak helpera isLeadNoteActivity.
- J3G został dokończony punktowym fixem bez ponownego patchowania całego JSX.

## ZMIANY

- Sekcja Notatki pokazuje tylko notatki operatora.
- Historia aktywności została przeniesiona do osobnej, drugorzędnej i zwijanej sekcji.
- Usunięto nagłówek Notatki i historia kontaktu.
- Dodano helper isLeadNoteActivity.
- leadNoteActivityItems przechowuje raw activity, żeby edycja i usuwanie notatek dalej działały.

## TESTY

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