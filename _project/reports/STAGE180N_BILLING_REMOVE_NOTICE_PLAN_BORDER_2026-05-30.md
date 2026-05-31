# STAGE180N - Billing remove payment helper notice and plan-colored status border

## Cel
Usunac widoczny tekst z sekcji wyboru okresu:
`Płatność kartą lub BLIK przez Stripe. Aktywny plan pojawi się dopiero po webhooku Stripe. Roczny plan daje niższy koszt w skali roku.`

Dodać obramowanie górnego kafelka statusu planu zgodne z planem:
- Free: slate,
- Basic: blue,
- Pro: green,
- AI: purple.

## Fakty
- Praca lokalna.
- Repo: `dkknapikdamian-collab/leadflowv1`
- Branch: `dev-rollout-freeze`
- Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`

## Zakres
- `src/pages/Billing.tsx`
- `src/styles/visual-stage16-billing-vnext.css`
- `scripts/check-stage180n-billing-remove-notice-plan-border.cjs`

## Testy
- `node scripts/check-stage180n-billing-remove-notice-plan-border.cjs`
- `npm run build`

## Czego nie ruszano
- Supabase
- RLS
- Stripe API
- webhook
- deployment
- push do GitHub

## Next step
Restart dev servera i Ctrl+F5 na `/billing`.
