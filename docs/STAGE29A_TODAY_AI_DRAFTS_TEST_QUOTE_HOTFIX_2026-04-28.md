# Stage29a - hotfix testu kafelka Szkice w Dzis

## Cel
Naprawa bledu skladni w tescie tests/today-ai-drafts-tile-stage29.test.cjs po Stage29.

## Zakres
- Poprawiono tylko cudzyslow w asercji testowej.
- Nie zmieniono logiki aplikacji.
- Nie zmieniono kafelka Szkice w Dzis.
- Brak SQL.

## Komendy sprawdzajace
```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/today-ai-drafts-tile-stage29.test.cjs
```

## Kryterium zakonczenia
Wszystkie powyzsze komendy przechodza na zielono.
