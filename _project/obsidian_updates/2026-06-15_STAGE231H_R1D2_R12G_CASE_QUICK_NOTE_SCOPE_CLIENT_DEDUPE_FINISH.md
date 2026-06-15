# 2026-06-15 08:45 Europe/Warsaw — STAGE231H_R1D2_R12G_CASE_QUICK_NOTE_SCOPE_CLIENT_DEDUPE_FINISH

## Status
Prepared / local repair after R12F partial.

## Decyzja / fakt
R12F zastosował najważniejsze fragmenty runtime dla szybkiej notatki, ale zatrzymał się na markerze deduplikacji ClientDetail. R12G ma dokończyć tylko brakujący element, dodać stabilny marker R12G i przejść guardy/testy/build/diff-check.

## Zakres
- CaseQuickActions: wszystkie 4 akcje mają jawne `data-context-case-id`.
- ContextNoteDialog: handoff `savedRecord` przed zamknięciem.
- CaseDetail: szybka notatka lokalnie wpada do notatek sprawy i odpala follow-up prompt.
- ClientDetail: prawy panel najbliższych działań deduplikuje po scaleniu tasków i eventów.

## Ryzyka
- Guardy potwierdzą kontrakt kodu, ale serwerowy deploy musi potwierdzić realny realtime/refresh po Supabase.
- W lokalnym ledgerze mogą istnieć wpisy z nieudanych R12D/R12E/R12F; R12G ma być finalnym wpisem zamykającym klasę problemu.
