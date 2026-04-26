# Today quick snooze real button + billing email prefill

Data: 2026-04-26

## Cel

Naprawić przypadek, w którym kliknięcie szybkiego odłożenia w Today nic nie robiło.

## Zmiana

- akcje szybkiego odłożenia są teraz natywnymi przyciskami
- obsługują pointer-up i click jako fallback
- mają krótką blokadę przeciw podwójnemu wywołaniu tej samej akcji
- nadal zatrzymują kliknięcie rodzica, żeby nie otwierać kafelka zamiast akcji
- Billing nie wysyła już domyślnie maila workspace do Stripe Checkout jako prefill

## Stripe Checkout

- napis Piaskownica wynika z trybu testowego Stripe i znika w trybie live
- nazwa po lewej stronie pochodzi z nazwy konta publicznego w Stripe
- pole e-mail w Checkout może nadal istnieć, bo Stripe potrzebuje danych kontaktowych płatnika, ale aplikacja nie powinna już prefillować prywatnego maila użytkownika

## Kryterium zakończenia

- npm.cmd run verify:closeflow:quiet przechodzi
- node scripts/scan-polish-mojibake.cjs przechodzi
