# CloseFlow Stage02A — access / billing / workspace source of truth guard

Data: 2026-05-03  
Branch roboczy: `dev-rollout-freeze`  
Zakres: Etap 2A, strażnik spójności access / billing / workspace

## Cel

Ten etap nie przebudowuje UI i nie zmienia modelu cen. Jego cel jest prosty: zablokować cofnięcie aplikacji do stanu, w którym billing, workspace i access liczą dostęp w kilku miejscach inaczej.

Guard pilnuje, że:

- trial ma jedno źródło prawdy i trwa 21 dni,
- statusy dostępu są wspólne dla `src/lib/plans.ts`, `src/lib/access.ts`, `/api/me` i Billing UI,
- `useWorkspace()` bierze backendowy `me.access`, a nie zgaduje dostępu wyłącznie lokalnie,
- Billing nie pokazuje flow jako „symulacji”, jeśli używa realnego endpointu checkout,
- po powrocie z checkout i po akcjach cancel/resume wykonywany jest refresh workspace,
- `trial_expired` oznacza podgląd danych, ale blokadę tworzenia nowych rekordów.

## Pliki dodane

- `scripts/check-access-billing-source-of-truth-stage02a.cjs`
- `docs/architecture/ACCESS_BILLING_SOURCE_OF_TRUTH_STAGE02A.md`

## Package script

Dodany skrypt:

```json
"check:access-billing-source-of-truth-stage02a": "node scripts/check-access-billing-source-of-truth-stage02a.cjs"
```

Skrypt jest też dokładany do `lint`, żeby regresja w access/billing nie przechodziła bokiem.

## Zakres bezpieczny

Ten etap nie rusza:

- wyglądu Billing,
- cen planów,
- Stripe webhooków,
- Google Calendar,
- AI,
- struktury bazy,
- istniejących ekranów operatora.

## Ręczny test po wdrożeniu

1. Uruchom:

```powershell
npm.cmd run check:access-billing-source-of-truth-stage02a
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```

2. W aplikacji sprawdź:

- trial aktywny: można dodać leada, task i event,
- trial wygasły: dane są widoczne, ale dodawanie nowych rekordów jest blokowane,
- Billing: przycisk planu nie mówi o symulacji,
- po powrocie z checkout status odświeża się bez ręcznego reloadu,
- cancel/resume w Billing odświeża status konta.

## Kryterium zakończenia

Etap jest zamknięty, jeśli guard przechodzi lokalnie i `verify:closeflow:quiet` nie pokazuje regresji.
