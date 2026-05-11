# CloseFlow Stage 10 — Billing cleanup — 2026-05-11

## Cel

Zakładka `/billing` została ograniczona do statusu dostępu, abonamentu i najważniejszych akcji płatności. Usunięto z tego widoku elementy marketingowe planu oraz rozliczenia operacyjne lead/case.

## Zakres

- usunięto powtórzenie `Plan aktywny.`,
- przeniesiono informację `Następna płatność` do górnego status card,
- usunięto kafelek `Plan` z podsumowania rozliczeń,
- usunięto sekcję `Co masz w planie`,
- usunięto sekcję `Co jest dostępne teraz`,
- usunięto tab `Rozliczenia lead/case` z `/billing`,
- dodano guard `check:billing-cleanup-2026-05-11`.

## Poza zakresem

- nie usuwano API płatności,
- nie usuwano rekordów płatności,
- nie ruszano Stripe ani statusu dostępu,
- nie przenoszono jeszcze mechaniki wpłat do `/clients/:id`, `/case/:id` ani `/finance`.

## Weryfikacja

```bash
npm run check:billing-cleanup-2026-05-11
npm run build
```
