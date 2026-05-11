# CloseFlow — CaseDetail loading scope fix

Data: 2026-05-11  
Branch: `dev-rollout-freeze`

## Problem

Po wcześniejszym hotfixie runtime Vercel nadal pokazywał:

```text
ReferenceError: loading is not defined
APP_ROUTE_RENDER_FAILED
```

Nowy bundle miał inną nazwę, więc problem nie był już cachem. W źródle były dwa odwołania do `loading`: poprawne, wewnątrz komponentu `CaseDetail`, oraz dodatkowy guard z markera `CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_GUARD_2026_05_11`, który mógł trafić poza właściwy scope renderu.

## Naprawa

1. Usunięto dodatkowy, niebezpieczny blok:

```tsx
/* CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_GUARD_2026_05_11 */
if (loading) {
  return <CaseDetailLoadingState />;
}
```

2. Zostawiono właściwy loading state i właściwy wczesny guard renderu w komponencie.
3. Dodano guard `scripts/check-closeflow-case-detail-loading-reference.cjs`.
4. Podpięto guard do `scripts/closeflow-release-check-quiet.cjs` bez zmiany kontraktu `package.json`.

## Kryterium

- `CaseDetail` ma mieć `const [loading, setLoading] = useState(true)` wewnątrz komponentu.
- Pierwszy `if (loading)` ma wystąpić przed `<CaseSettlementPanel`.
- Po `<CaseSettlementPanel` nie może być żadnego `if (loading)`.
- Marker `CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_GUARD_2026_05_11` nie może istnieć w `CaseDetail.tsx`.
