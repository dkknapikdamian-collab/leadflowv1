# STAGE180P - Billing plan tone and right rail cleanup - 2026-05-30

## Cel
Naprawić nieudany Stage180O i poprawić widok Rozliczenia/Billing lokalnie.

## Fakty
- Stage180O przerwał się na błędzie patchera Node: `ReferenceError: statusPlanToneKey is not defined`.
- Widoczny tekst o płatności Stripe/BLIK został wcześniej usunięty albo ma zostać usunięty, jeśli nadal istnieje.
- Górny kafelek `Status dostępu` ma wizualnie iść kolorem planu, nie statusem trial/payment.
- Ikony przy nagłówkach prawego panelu wyglądają jak przypadkowe kropki i mają być ukryte.

## Decyzje Damiana
- Usunąć tekst: `Płatność kartą lub BLIK przez Stripe. Aktywny plan pojawi się dopiero po webhooku Stripe. Roczny plan daje niższy koszt w skali roku.`
- Górny kafelek statusu ma mieć kolor/obramowanie planu.
- Kropki/ikonki po prawej są do poprawy.

## Zakres
- `src/pages/Billing.tsx`
- `src/styles/visual-stage16-billing-vnext.css`
- `scripts/check-stage180p-billing-plan-tone-right-rail-cleanup.cjs`

## Testy
- `node scripts/check-stage180p-billing-plan-tone-right-rail-cleanup.cjs`
- `npm run build`
- Ręcznie: `/billing`, restart dev servera, Ctrl+F5.

## Czego nie ruszano
- Supabase
- RLS
- Stripe API
- webhook Stripe
- deployment
- push

## Następny krok
Po wdrożeniu Stage180P sprawdzić screen `/billing`, zwłaszcza kartę `Status dostępu` i nagłówki prawego panelu.
