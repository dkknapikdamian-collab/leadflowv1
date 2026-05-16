# CloseFlow Stage 4 V27 â€” TodayStable explicit export contract

## Cel

NaprawiÄ‡ bĹ‚Ä…d po V26:

```text
Multiple exports with the same name "TodayStable"
```

## Diagnoza

V26 zmieniĹ‚ deklaracjÄ™ funkcji na `export function TodayStable()`, ale lokalny plik nadal miaĹ‚ stary koĹ„cowy `export { TodayStable };`. To daje podwĂłjny named export i esbuild sĹ‚usznie zatrzymaĹ‚ build.

## Poprawka

Docelowy kontrakt:

```ts
function TodayStable() {
  // ...
}

export { TodayStable };
export default TodayStable;
```

## Guard

Dodano/zaostrzono:

- `tests/stage89-todaystable-named-export-contract.test.cjs`

Stage89 pilnuje:

- dokĹ‚adnie jeden named export `TodayStable`,
- dokĹ‚adnie jeden default export `TodayStable`,
- brak `export function TodayStable()`,
- brak `export default function TodayStable()`,
- obecnoĹ›Ä‡ Stage88 i Stage89 w quiet release gate.

## Zakres

Nie zmieniono logiki Today. Nie zmieniono routingu. Nie wyĹ‚Ä…czono testĂłw.
