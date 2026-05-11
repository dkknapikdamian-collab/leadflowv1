# CLOSEFLOW_CASE_DETAIL_REMOVE_CLIENT_BACKGROUND_PANEL_2026-05-10

## Cel

Usunięcie z prawej kolumny `CaseDetail` dodatkowego panelu klienta, który dublował kontekst sprawy i zaśmiecał prawą kolumnę.

## Zakres

- Sprawdzany plik główny: `src/pages/CaseDetail.tsx`.
- Patcher usuwa tylko blok JSX zawierający etykietę panelu klienta w tle.
- Relacja `case -> client` zostaje bez zmian.
- Routing `/clients/:id` zostaje bez zmian.
- Link do klienta może pozostać w headerze, breadcrumbzie albo istniejącej sekcji powiązań.

## Nie zmieniono

- Modelu danych sprawy.
- Modelu danych klienta.
- Endpointów klienta.
- Routingu klienta.
- Globalnej zakładki aktywności.

## Weryfikacja

Automatyczny check:

```bash
npm run check:closeflow-case-detail-no-client-background-panel
```

Manualnie:

1. Otwórz sprawę powiązaną z klientem.
2. Sprawdź, że dodatkowy panel klienta w prawej kolumnie zniknął.
3. Sprawdź, że nadal da się przejść do klienta z sensownego miejsca, jeśli taki link już istniał.
4. Sprawdź, że prawa kolumna nie ma pustej dziury po usuniętym panelu.

## Kryterium zakończenia

`CaseDetail` nie renderuje już usuwanego panelu klienta w prawej kolumnie, a check pilnuje, żeby nie wrócił.
