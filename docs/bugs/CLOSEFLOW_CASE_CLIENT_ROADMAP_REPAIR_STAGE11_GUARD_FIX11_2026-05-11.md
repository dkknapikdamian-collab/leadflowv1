# CloseFlow Stage 11 guard repair 11

## Cel

Domknąć Etap 11 po serii failed repairów bez wypychania czerwonych zmian.

## Zakres

- reset lokalnych pół-zmian po failed repairach,
- package.json zapisany jako UTF-8 bez BOM,
- aggregate guard toleruje BOM przy czytaniu tekstu,
- wide quiet gate zbiera wiele czerwonych testów naraz,
- legacy Today.tsx dostaje jawne UTF-8 guard compatibility markers dla starych testów źródłowych.

## Guardy

```powershell
node --check scripts/closeflow-release-check-quiet-wide.cjs
npm.cmd run check:closeflow-case-client-roadmap-repair
npm.cmd run build
npm.cmd run verify:closeflow:quiet:wide
npm.cmd run verify:closeflow:quiet
```
