# P14J duplicate badge cleanup

## Cel
Domkniecie P14 po build warning w Billing.tsx: duplicate key badge.

## Zakres
- Usuniecie drugiego badge: 'Beta' w planie AI.
- Dodanie guarda check:p14-billing-no-duplicate-badge.
- Zero redesignu i zero zmian w logice aplikacji.

## Weryfikacja
- npm run check:p14-ui-truth-copy-menu
- npm run check:p14-billing-no-duplicate-badge
- npm run check:polish-mojibake
- npm run build

## Warunek push
Commit i push tylko po zielonych guardach oraz buildzie.
