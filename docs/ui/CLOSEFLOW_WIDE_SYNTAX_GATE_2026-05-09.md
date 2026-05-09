# CloseFlow Wide Syntax Gate — baseline-safe — 2026-05-09

## Cel

Ten gate chroni repo przed powtórką z failed VS-2C:

- rozwalone importy typu `import { ]`,
- tekst z komentarza/tablicy zależności wklejony do importu,
- React hooki/types zaimportowane z `ui-system`,
- realne błędy składni TS/TSX przez `esbuild.transformSync`.

## Tryb baseline-safe

Nie blokuje obecnego działającego baseline za:

- stare BOM-y / FEFF,
- stare BOM-y w `scripts/*.cjs`,
- istniejące podejrzane nazwy importów, które baseline nadal kompiluje.

Te rzeczy są raportowane jako warning.

## Mikro-naprawa Today.tsx

`src/pages/Today.tsx` jest legacy inactive, ale miał jedną linię komentarza bez `//`:

```ts
  not rendered locally in Today.
```

Build Vite przechodził, bo aktywny routing używa `TodayStable`, ale szeroki gate słusznie wykrywał składnię. Naprawa zmienia to na:

```ts
//   not rendered locally in Today.
```

## Komenda

```bash
npm run check:closeflow-wide-syntax-gate
```

## Bramka przed VS-2C

Przed VS-2C musi przejść:

```bash
npm run check:closeflow-wide-syntax-gate
npm run check:closeflow-entity-icon-registry
npm run build
```

Dopiero po tym można dodać `ActionIcon` jako mały etap, bez hurtowego przepinania wszystkich ekranów.
