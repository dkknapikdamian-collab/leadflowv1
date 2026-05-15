# ETAP 5 — Cleanup right rail po etapach 1–4

Data: 2026-05-15
Tryb: lokalnie, bez commita i bez pushu

## Cel

Usunięto stare copy, martwe ślady po dawnym kaflu top-client-value na ekranie klientów oraz lead-specyficzną klasę top-value z aktywnego renderu.

## Co zmieniono

- Zneutralizowano historyczne wzmianki o dawnym kaflu top-client-value w `src`, `tests` i `docs`.
- Usunięto z aktywnego renderu `/clients` ślad po starym top-client-value rail.
- `/clients` dalej używa `TopValueRecordsCard` dla `Najcenniejsi klienci`.
- `/leads` dalej używa `TopValueRecordsCard` dla top aktywnych leadów.
- Klasa `operator-top-value-card` została zastąpiona neutralną `operator-top-value-card` w aktywnym renderze i w CSS Stage26.
- Nie ruszono klasy `right-card`, bo to świadomy globalny kontrakt komponentu `OperatorSideCard`.
- Nie usunięto `data-relation-value-board`, bo to aktualny marker wartości i część działających guardów.

## Czego nie robiono

- Nie zmieniono logiki wartości klientów.
- Nie zmieniono logiki wartości leadów.
- Nie zmieniono limitu 5.
- Nie wykonano commita ani pushu.

## Guardy

`npm.cmd run check:operator-rail-stage5`
