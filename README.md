# CloseFlow — paczka wdrożeniowa

Aktualna paczka zawiera kolejne etapy LeadFlow / CloseFlow:

1. Quick Lead Capture — szybki lead z notatki wpisanej lub podyktowanej systemowo.
2. Normalizatory danych dla tasków, eventów, leadów i spraw.
3. Helper najbliższej zaplanowanej akcji.
4. Centrum powiadomień i runtime przypomnień.
5. Snooze alertów: 15 min, 1h, jutro.

## Uruchomienie lokalne

```powershell
npm.cmd install
npm.cmd run dev
```

## Testy i build

```powershell
npm.cmd install
npm.cmd run test:stage
npm.cmd run build
```

## Ważne

Jeśli `npm install` zawiesi się lokalnie, uruchom ponownie polecenie. Paczka nie zawiera `node_modules`.
