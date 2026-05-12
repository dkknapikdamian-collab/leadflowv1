# CLOSEFLOW_OPERATOR_TOP_TRIM_REPAIR3_2026-05-12

## Cel

Naprawić nieskuteczne cięcie desktopowych pasków po hero/headerze.

## Co było źle

Poprzednia poprawka próbowała ukrywać stary `CloseFlowPageHeaderV2` i pozycjonować akcję `Widok` wewnątrz tego samego ukrywanego obszaru. To nadal zostawiało ryzyko białych pasków, pigułek/kickerów oraz akcji w miejscu dawnego hero.

Dodatkowo skrypt REPAIR2 miał błąd cytowania w `node -e`, więc nie przeszedł do check/build/commit.

## Decyzja

Na desktopie stary `CloseFlowPageHeaderV2` ma być całkowicie niewidoczny i nie może zajmować miejsca.

Jedyna dozwolona akcja z dawnego headera to `Widok`, ale nie jako element starego headera. Runtime tworzy proxy przycisku w realnym `.global-bar` i przekazuje kliknięcie do oryginalnego przycisku, żeby nie rozbić logiki panelu widoku.

## Zakres

- `src/components/OperatorTopBarRuntime.tsx`
- `src/styles/closeflow-operator-top-trim-source-truth.css`
- `scripts/check-closeflow-operator-top-trim-repair3.cjs`
- `tools/patch-closeflow-operator-top-trim-repair3-2026-05-12.cjs`

## Kryterium zakończenia

- Brak białych pasków w miejscu dawnego hero.
- Brak samotnych piguł: `BAZA RELACJI`, `CZAS I OBOWIĄZKI`, `Plan i dostęp`, `USTAWIENIA`.
- `Odśwież`, `Odśwież dane` i inne lokalne akcje starego headera nie zostają w dawnej belce.
- `Widok` widoczny w prawdziwym górnym pasku i nadal otwiera oryginalny panel.
- Telefon bez zmian.
