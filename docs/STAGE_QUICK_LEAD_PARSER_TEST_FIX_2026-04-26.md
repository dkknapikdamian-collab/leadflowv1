# Stage — Quick Lead Parser test fix — 2026-04-26

## Cel
Naprawić test `tests/quick-lead-capture.test.ts`, który wykazał, że parser nie rozpoznawał akcji `oddzwonić`.

## Przyczyna
W `src/lib/quick-lead-capture.ts` wzorce akcji używały granicy słowa `\b`. W JavaScript `\b` działa poprawnie głównie dla ASCII i bywa zawodna przy polskich znakach, np. końcówce `ć`.

## Zmiana
Usunięto `\b` z wzorców akcji w `NEXT_ACTION_PATTERNS` i zostawiono proste dopasowania fraz:

- `oddzwonić`
- `zadzwonić`
- `wysłać ofertę`
- `wysłać maila`
- `umówić spotkanie`
- `przypomnieć`
- `wrócić do tematu`
- `skontaktować się`

## Nie zmieniono
- flow Quick Lead Capture,
- UI,
- modelu danych,
- sposobu zapisu leada,
- prywatności rawText.

## Weryfikacja
Po wgraniu paczki odpalić:

```powershell
npm.cmd run lint
npm.cmd run test:stage
npm.cmd run build
```

## Kryterium zakończenia
`test:quick-lead` przechodzi i parser rozpoznaje `oddzwonić` oraz inne akcje z polskimi znakami.
