# STAGE220A33B - guard syntaxfix after A33

## Cel
Naprawić składnię guarda `scripts/check-stage220a33-no-tab-switch-reload-delete-blob.cjs` po A33.

## Fakt
A33 nałożył zmiany runtime/CSS, ale guard nie uruchomił się przez błąd cytowania w JS:

```text
requireText(chunk, 'document.visibilityState !== 'visible'', ...)
```

## Zakres
- Nadpisano tylko guard A33 poprawną składnią JS.
- Zachowano zmiany A33 w `chunk-asset-reload-guard.ts`, CSS i `package.json`.

## Testy
```powershell
node scripts/check-stage220a33-no-tab-switch-reload-delete-blob.cjs
npm run build
```

## Czego nie ruszano
- API.
- Supabase.
- Logika usuwania sprawy.
- Logika finansów.
