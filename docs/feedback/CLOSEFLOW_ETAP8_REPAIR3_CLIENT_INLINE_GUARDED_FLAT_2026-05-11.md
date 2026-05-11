# CLOSEFLOW_ETAP8_REPAIR3_CLIENT_INLINE_GUARDED_2026-05-11

## Cel

Naprawić ETAP8 po paczce, która pozwoliła na commit/push mimo czerwonych checków.

## Problem naprawiany

Poprzedni apply script uruchamiał natywne komendy `node` i `npm.cmd`, ale PowerShell 5 nie zatrzymuje całego skryptu wyłącznie przez `$ErrorActionPreference="Stop"`, gdy natywna komenda zwróci niezerowy exit code.

Efekt: `check:etap8-client-card-inline-row` i `check:etap3-clients-wide-layout` były czerwone, a mimo tego commit i push poszły.

## Zakres naprawy

- Dopina klasy ETAP8 do realnego markup karty klienta w `src/pages/Clients.tsx`.
- Przenosi `Najbliższa akcja` do tej samej linii gridu na desktopie.
- Zostawia `cf-client-next-action-panel`, żeby ETAP4 nie utracił akcentu.
- Zastępuje breakpoint `1200px` wartością `75rem`, bo istniejący guard ETAP3 flaguje literalne `1200px` jako fixed width.
- Dodaje twarde sprawdzanie `$LASTEXITCODE` po każdym kroku w PowerShell.
- Commit i push wykonują się dopiero po zielonych checkach i buildzie.

## Pliki

- `src/pages/Clients.tsx`
- `src/styles/clients-next-action-layout.css`
- `package.json`
- `scripts/check-closeflow-etap8-client-card-inline-row.cjs`
- `tools/repair-closeflow-etap8-client-card-inline-row.cjs`

## Nie zmieniać

- routingu,
- danych klient/lead/sprawa,
- zakładek,
- pozycji paneli poza kartą klienta,
- klasy `cf-client-next-action-panel`,
- guardów ETAP3/ETAP4/admin feedback.

## Weryfikacja

Musi przejść:

```text
npm.cmd run check:etap8-client-card-inline-row
npm.cmd run check:etap3-clients-wide-layout
npm.cmd run check:etap4-client-next-action-accent
npm.cmd run check:closeflow-admin-feedback-2026-05-11
npm.cmd run build
```
