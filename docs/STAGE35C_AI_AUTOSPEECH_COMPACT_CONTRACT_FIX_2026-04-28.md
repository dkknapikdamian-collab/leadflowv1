# Stage35c - naprawa kontraktu autospeech po kompaktowym panelu AI

## Cel
Naprawić paczkę Stage35b, która przerwała się przez błąd składni w patcherze. Ten etap nie przywraca długiej instrukcji w panelu AI. Aktualizuje testy pod krótką wersję panelu.

## Zmienione
- Nadpisano tests/ai-assistant-autospeech-and-clear-input.test.cjs pod kompaktowy panel asystenta.
- Dodano tests/stage35c-ai-autospeech-compact-contract-fix.test.cjs.
- Dodano awaryjny plik zgodności tests/stage35b-ai-autospeech-compact-copy-contract.test.cjs, żeby ręczne odpalenie starej komendy nie kończyło się MODULE_NOT_FOUND.
- Dopisano Stage35c do quiet i full release gate.

## Nie zmieniaj
- UI asystenta AI.
- Logiki direct write.
- Kafelka Szkice w Dziś.
- Zakładki Leady i prawego panelu Najcenniejsze.

## Po wdrożeniu sprawdź
```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/ai-assistant-autospeech-and-clear-input.test.cjs
node tests/stage35c-ai-autospeech-compact-contract-fix.test.cjs
node tests/stage35b-ai-autospeech-compact-copy-contract.test.cjs
node tests/stage35-ai-assistant-compact-ui.test.cjs
```

## Kryterium zakończenia
Wszystkie powyższe komendy przechodzą na zielono, a długi tekst instrukcji zapisu do Szkiców AI nie wraca do panelu.
