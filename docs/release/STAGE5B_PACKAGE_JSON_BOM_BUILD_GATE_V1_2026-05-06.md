# STAGE5B_PACKAGE_JSON_BOM_BUILD_GATE_V1 â€” 2026-05-06

## Cel

NaprawiÄ‡ blokadÄ™ produkcyjnego builda po Stage5:

```text
Unexpected token 'ď»ż', "ď»ż{ ... is not valid JSON
```

ĹąrĂłdĹ‚o problemu: `package.json` zostaĹ‚ zapisany z UTF-8 BOM na poczÄ…tku pliku. Tailwind/Vite przez `enhanced-resolve` czyta `package.json` zwykĹ‚ym `JSON.parse`, ktĂłry wyĹ‚oĹĽyĹ‚ siÄ™ na znaku U+FEFF.

## Co zmieniono

- `package.json` jest przepisywany jako UTF-8 without BOM.
- Dodany jest guard `check:stage5b-package-json-bom-build-gate-v1`.
- Dodany jest test `test:stage5b-package-json-bom-build-gate-v1`.
- Apply-script koĹ„czy siÄ™ bĹ‚Ä™dem przed commitem/pushem, jeĹĽeli check, test albo build padnÄ….

## ReguĹ‚a bezpieczeĹ„stwa

No commit/push after failed build.

Commit i push mogÄ… wykonaÄ‡ siÄ™ dopiero po:

1. poprawnym parsowaniu `package.json`,
2. przejĹ›ciu guardu Stage5B,
3. przejĹ›ciu testu Stage5B,
4. przejĹ›ciu `npm run build`, jeĹ›li uruchomiono z `-RunBuild`.

## Nie zmieniaj

- Logiki AI.
- Endpointu `/api/assistant/query`.
- Today assistant.
- Modelu szkicĂłw AI.
- UI.

## Kryterium zakoĹ„czenia

`npm.cmd run build` nie pada juĹĽ na `package.json` z BOM-em, a kolejne paczki nie mogÄ… zrobiÄ‡ commita/pusha po czerwonym buildzie.