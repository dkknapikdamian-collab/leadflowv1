# CLOSEFLOW Finance release evidence — 2026-05-09

Marker: CLOSEFLOW_FINANCE_RELEASE_EVIDENCE

## Cel

FIN-10 domyka bramkę weryfikacji finansów jako jedną komendę:

```bash
npm run verify:closeflow-finance
```

Ta komenda ma pilnować, żeby FIN-5–FIN-9 nie rozjechały się przy kolejnych etapach, refaktorach UI ani zmianach API.

## Zakres chroniony

### FIN-5 — Case settlement panel

- Panel rozliczenia sprawy istnieje.
- `CaseSettlementPanel` nadal jest renderowany z `CaseDetail`.
- Wpłaty klienta i płatności prowizji są liczone osobno.
- Zapis idzie przez istniejące helpery API/Supabase.
- Brak pełnego reloadu strony po zapisie.

### FIN-6 — Payments list and payment types

Wspólne typy płatności:

- Zaliczka
- Częściowa wpłata
- Końcowa wpłata
- Prowizja
- Zwrot
- Inne

Wspólne statusy:

- Planowana
- Należna
- Zapłacona
- Anulowana

Etykiety są trzymane w `src/lib/finance/finance-payment-labels.ts`.

### FIN-7 — Client finance summary

Klient pokazuje podsumowanie relacji, a nie pełną księgowość:

- Suma spraw
- Prowizja należna
- Wpłacono
- Pozostało

### FIN-8 — Finance visual integration

Finanse używają design systemu:

- SurfaceCard
- StatusPill
- FormFooter
- tokenowy CSS

Zakazane są lokalne warianty wizualne finansów oraz surowe kolory w CSS finansowym.

### FIN-9 — Finance duplicate safety

Przed wpłatą/prowizją aplikacja ostrzega, ale nie blokuje:

> Ten klient może mieć duplikat. Upewnij się, że dodajesz wpłatę do właściwego rekordu.

Zasada: nie blokować, ostrzegać.

### FIN-10 — Finance verification gate

Dodaje zbiorcze bramki:

- `scripts/check-closeflow-finance-contract.cjs`
- `scripts/check-closeflow-finance-ui-contract.cjs`
- `scripts/check-closeflow-finance-payment-types.cjs`
- `scripts/check-closeflow-finance-duplicate-safety.cjs`

oraz komendę:

```bash
npm run verify:closeflow-finance
```

## Co musi przejść

`verify:closeflow-finance` odpala:

- FIN-10 contract guard
- FIN-10 UI guard
- FIN-10 payment types guard
- FIN-10 duplicate safety guard
- FIN-5 guard
- FIN-6 guard
- FIN-7 guard
- FIN-8 guard
- FIN-9 guard
- API-0 Vercel Hobby guard
- API runtime data-contract guard
- import boundary guard
- TypeScript
- production build

## Kryterium zakończenia

FIN-10 jest zakończony dopiero wtedy, gdy:

```bash
npm run verify:closeflow-finance
```

kończy się bez błędów, a commit zostaje wypchnięty na `dev-rollout-freeze`.
