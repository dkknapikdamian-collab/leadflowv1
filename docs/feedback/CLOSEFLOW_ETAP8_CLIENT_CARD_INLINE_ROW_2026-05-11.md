# CLOSEFLOW ETAP8 — Client card inline row

## Cel

Na `/clients` karta klienta ma być czytelna na desktopie jako jeden główny wiersz:

1. numer,
2. dane klienta,
3. sprawy / wartość / status,
4. najbliższa akcja,
5. akcje/przyciski.

Najbliższa akcja nie może być dolnym panelem pełnej szerokości na desktopie.

## Zakres zmian

- `src/pages/Clients.tsx`
  - dodanie klasy `cf-client-row-inline` do głównego `client-row`,
  - dodanie klasy `cf-client-main-cell` do głównej komórki danych klienta,
  - dodanie klasy `cf-client-cases-cell` do komórki wartości/spraw,
  - dodanie klasy `cf-client-next-action-inline` do panelu `cf-client-next-action-panel`,
  - dodanie klasy `cf-client-row-actions` do kontenera akcji, jeśli markup ma wykrywalny kontener akcji.

- `src/styles/clients-next-action-layout.css`
  - dodanie bloku `CLOSEFLOW_ETAP8_CLIENT_CARD_INLINE_ROW`,
  - desktopowy grid pięciokolumnowy,
  - breakpoint `1200px`,
  - breakpoint `760px`.

- `package.json`
  - dodanie `check:etap8-client-card-inline-row`.

## Reguły bezpieczeństwa

- Nie usuwać `cf-client-next-action-panel`.
- Nie usuwać ani nie osłabiać akcentu z ETAP4.
- Nie robić `position:absolute` dla najbliższej akcji.
- Nie ustawiać sztywnego `width: 1200px`.
- Nie ruszać kontraktu danych klient/lead/sprawa.

## Sprawdzenie

```powershell
npm.cmd run check:etap8-client-card-inline-row
npm.cmd run check:etap3-clients-wide-layout
npm.cmd run check:etap4-client-next-action-accent
npm.cmd run check:closeflow-admin-feedback-2026-05-11
npm.cmd run build
```

## Kryterium zakończenia

Na desktopie karta klienta wygląda jak jeden logiczny wiersz, a „Najbliższa akcja” jest w końcowej części głównego układu karty.
Na mobile karta może przechodzić na kilka linii, ale nie może powodować poziomego scrolla.
