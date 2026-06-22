# Obsidian update — STAGE232K_R2_CASE_COMMISSION_PAYMENT_WRITE_AND_CLIENT_REFRESH

Status: DO_WDROZENIA
Data: 2026-06-22 Europe/Warsaw

## Cel

Naprawić błąd z manual smoke STAGE232K_R1: przycisk "Dodaj wpłatę prowizji" otwierał modal prowizji, ale CaseDetail zapisywał płatność jako type=payment/status=fully_paid. Przez to prawy panel sprawy i klient nie pokazywały wpłaconej prowizji.

## Zakres

- CaseDetail zapisuje typ i status z formularza płatności, w tym type=commission.
- Korekta wpłat zachowuje oryginalny payment.type i nie zmienia commission na payment.
- Prawy panel używa etykiety "Pozostało prowizji do zapłaty".
- CF-RUNTIME allowlist obejmuje nowy zakres R2.

## Testy

- node scripts/check-stage232k-r1-case-commission-status-derived-from-payments.cjs
- node --test tests/stage232k-r1-case-commission-status-derived-from-payments.test.cjs
- node scripts/check-stage232k-r1d-cf-runtime-allowlist-repair.cjs
- node --test tests/stage232k-r1d-cf-runtime-allowlist-repair.test.cjs
- node scripts/check-stage232k-r2-commission-payment-write-and-client-refresh.cjs
- node --test tests/stage232k-r2-commission-payment-write-and-client-refresh.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## Manual smoke po wdrożeniu

1. Usuń albo zignoruj starą testową wpłatę 1000 zapisaną jako zwykła payment.
2. Dodaj nową wpłatę prowizji 1000 PLN jako opłaconą.
3. Sprawa ma pokazać: Wpłacono prowizji 1000 PLN, Pozostało prowizji do zapłaty 2000 PLN, status częściowo zapłacona.
4. Wejdź w klienta i sprawdź, że wpłacona prowizja 1000 PLN jest widoczna w finansach klienta.
5. Odśwież stronę i sprawdź trwałość danych.

## Ryzyka

- Stare wpłaty zapisane przez czerwony etap R1B/R1C jako type=payment nie zostaną automatycznie przemigrowane. Trzeba je usunąć/korygować ręcznie albo osobnym etapem migracyjnym po decyzji właściciela.
- Bez manual smoke etap nie jest w pełni zamknięty biznesowo.
