# STAGE217 R3 - CaseDetail note history summary repair

## Cel
Naprawić niedomknięty guard po Stage217 R2: pełna treść notatki ma zostać w panelu Notatki sprawy, a historia aktywności ma pokazywać skrót: `Notatka zapisana przy sprawie. Pełna treść jest w panelu Notatki.`

## Fakty
- Stage217 R2 skopiował panel operacyjny, panel notatek, CSS i raporty.
- Guard zatrzymał etap na `Stage217 note history summary missing`.
- Build po R2 przeszedł, ale guard Stage217 nie przeszedł.

## Zakres R3
- Dopina stałą `STAGE217_CASE_NOTE_HISTORY_SUMMARY` w `src/pages/CaseDetail.tsx`.
- Próbuje przepiąć gałąź historii dla notatek na skrót zamiast pełnej treści.
- Dodatkowo zabezpiecza renderowanie wiersza historii: jeśli `item.kind === 'note'`, pokazuje skrót zamiast pełnej treści.
- Uruchamia istniejący guard `scripts/check-stage217-case-detail-operation-workspace.cjs`.

## Czego nie ruszano
- Supabase
- SQL
- API
- LeadDetail
- ClientDetail
- push do GitHuba

## Testy
- `node scripts/check-stage217-case-detail-operation-workspace.cjs`
- `npm run build`
- test ręczny: wejść w sprawę, sprawdzić panel Obsługa, panel Notatki i historię aktywności.
