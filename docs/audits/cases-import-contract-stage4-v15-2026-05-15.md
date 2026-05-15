# Stage 4 V15 - Cases import contract repair

## Cel
Przywrocic kanoniczne importy w `src/pages/Cases.tsx` wymagane przez `scripts/check-closeflow-cases-loader2-import.cjs` po globalnej normalizacji importow.

## Decyzja
Nie usuwamy guarda i nie wyciszamy `verify:closeflow:quiet`. Naprawiamy plik zrodlowy tak, zeby spelnial istniejacy kontrakt release gate.

## Zmienione
- `src/pages/Cases.tsx` - kanoniczne importy dla react, react-router-dom, lucide-react, date-fns, date-fns/locale i EntityIcon.
- `docs/audits/cases-import-contract-stage4-v15-2026-05-15.md` - raport.
- opcjonalny backup przed zmiana w `docs/audits/cases-import-contract-stage4-v15-backup-*`.

## Guardy
- `scripts/check-closeflow-cases-loader2-import.cjs` zostaje aktywny.
- `verify:closeflow:quiet` nadal musi przejsc.
