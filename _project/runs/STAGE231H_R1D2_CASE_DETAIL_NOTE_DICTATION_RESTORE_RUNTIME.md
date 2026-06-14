# STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

Date: 2026-06-14 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: LOCAL_PACKAGE_PREPARED / DO_TEST_AND_PUSH / SERVER_UI_REQUIRED

## Cel

Przywrócić realne dyktowanie notatki w CaseDetail po produktowym zamknięciu R1G2/R1G3. R1D2 jest użyte celowo, bo R1D istnieje już jako etap finance modal compact.

## Scan-first

Przeczytane / wymagane źródła:

- AGENTS.md
- _project/04_ETAPY_ROZWOJU_APLIKACJI.md
- _project/runs/STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC.md
- _project/runs/STAGE231H_R1D_CASE_DETAIL_NOTE_DICTATION_RESTORE.md
- src/pages/CaseDetail.tsx
- src/pages/LeadDetail.tsx tylko jako możliwe źródło wzorca, bez zmian runtime
- src/lib/supabase-fallback.ts przez istniejący import insertActivityToSupabase/updateCaseInSupabase

## Zakres

- CaseDetail: realny przycisk `Dyktuj notatkę`.
- Web Speech API: `window.SpeechRecognition` albo `window.webkitSpeechRecognition`.
- Autosave po około 2 sekundach ciszy.
- Zapis activity/note z `caseId`, `clientId`, `leadId`, `actorType: operator`, `eventType: operator_note`.
- Brak zapisu pustej transkrypcji.
- Guard przeciw duplikatom autosave.
- Komunikat dla braku wsparcia SpeechRecognition albo odmowy mikrofonu.

## Nie ruszano

- Google Calendar
- SQL
- billing/trial
- AI Drafts
- koszty R1E
- globalny layout
- CaseDetail finance/cost runtime poza memory sync R1G2

## Testy automatyczne

Do wykonania po apply:

- `node scripts/check-stage231h-r1g2-case-detail-cost-payment-closeout.cjs`
- `node --test tests/stage231h-r1g2-case-detail-cost-payment-closeout.test.cjs`
- `node scripts/check-stage231h-r1d2-case-detail-note-dictation-restore.cjs`
- `node --test tests/stage231h-r1d2-case-detail-note-dictation-restore.test.cjs`
- `npm run build`
- `git diff --check`

## Manual test

1. Otwórz sprawę.
2. Kliknij `Dyktuj notatkę`.
3. Powiedz jedno zdanie.
4. Przestań mówić na około 2 sekundy.
5. Sprawdź, czy notatka zapisuje się automatycznie.
6. Zrób hard refresh.
7. Sprawdź, czy notatka zostaje w notatkach/historii sprawy.
8. Sprawdź zachowanie przy odmowie mikrofonu.
9. Sprawdź, że nie powstały duplikaty notatki.

## AUDYT PRZED ETAPEM

- R1G2/R1G3 są produktowo zamknięte dla kosztów/wpłat.
- R1D run report wskazuje, że dyktowanie było błędnie wyłączone i ma wrócić.
- CaseDetail ma już ścieżkę zapisu aktywności/notatek przez `insertActivityToSupabase` i historię bazującą na `operator_note`.
- Największe ryzyka: Web Speech API zależne od przeglądarki, odmowa mikrofonu, puste transkrypcje, duplikaty autosave.

## AUDYT PO ETAPIE

Do uzupełnienia po apply/push/manual test.
