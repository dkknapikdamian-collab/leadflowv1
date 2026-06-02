# STAGE217R4 - CaseDetail UTF-8 note summary repair

## Cel
Naprawić Stage217 po R2/R3, gdzie PowerShell wstawił treść summary notatki z błędnym kodowaniem albo nie wstawił jej w miejscu sprawdzanym przez guard.

## Fakty
- R2 dodał panel operacyjny i panel notatek.
- Guard blokował brak tekstu: `Stage217 note history summary missing`.
- Build przechodził, ale guard nie.

## Zmiana
- Patch wykonywany przez Node.js, nie przez literały PowerShell z polskimi znakami.
- `STAGE217_CASE_NOTE_HISTORY_SUMMARY` ustawione jako poprawny UTF-8.
- Historia notatek używa summary, pełna treść pozostaje w panelu Notatki.

## Testy
- `node scripts/check-stage217-case-detail-operation-workspace.cjs`
- `npm run build`

## Czego nie ruszano
- Supabase, SQL, API, push.
