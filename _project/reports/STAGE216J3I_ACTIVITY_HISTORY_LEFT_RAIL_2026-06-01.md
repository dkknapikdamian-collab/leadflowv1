---
typ: project_report
stage: STAGE216J3I
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-J3I - Activity History Left Rail

## FAKTY

- J3H technicznie przeszedł, ale przeniósł historię aktywności do prawej kolumny.
- Damian doprecyzował, że historia ma być z lewej strony, pod danymi leada.
- Pierwsza próba J3I zatrzymała się przed buildem i commitem na starym warunku J3G guard.
- J3I guard oraz J3H guard przeszły, ale J3G guard nie akceptował jeszcze lewego raila jako poprawnego miejsca historii.

## ZMIANY

- Historia aktywności została przeniesiona z prawego raila do lewego raila pod Dane leada.
- Historia nadal pokazuje 5 ostatnich zdarzeń.
- Starsze wpisy nadal są w rozwijanym bloku.
- Prawa kolumna wraca do roli: najbliższe działania, sprawa, finanse.
- Środek zostaje dla notatek.
- Guard J3G został zaktualizowany, żeby akceptował historię poza środkiem także w lewym railu J3I.

## TESTY

- node scripts/check-stage216j3i-activity-history-left-rail.cjs
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