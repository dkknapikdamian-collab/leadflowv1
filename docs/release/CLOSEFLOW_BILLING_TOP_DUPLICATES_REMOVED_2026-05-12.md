# CLOSEFLOW_BILLING_TOP_DUPLICATES_REMOVED_2026-05-12

## Cel

Usunąć z ekranu rozliczeń dwa elementy wskazane na screenach:

1. samotny pasek/tab `Plan i dostęp`, który został po dawnym headerze,
2. duplikujący kafelek `Plan / Pro / Dostęp aktywny` pod główną kartą statusu.

## Decyzja

To nie jest już poprawka CSS. Te elementy są usuwane z JSX w `src/pages/Billing.tsx`, bo mają zniknąć z DOM, a nie tylko zostać przykryte stylem.

## Zakres

- `src/pages/Billing.tsx`
- `scripts/check-closeflow-billing-top-duplicates-removed.cjs`
- `package.json`

## Nie zmieniamy

- głównej karty statusu dostępu,
- prawego panelu statusu konta,
- kart planów Free/Basic/Pro/AI,
- Stripe/webhook/billing logic,
- telefonu.

## Kryterium zakończenia

Na desktopowym ekranie `/billing` nie ma już:

- paska `Plan i dostęp`,
- małego kafelka `Plan / Pro / Dostęp aktywny` pod statusem.
