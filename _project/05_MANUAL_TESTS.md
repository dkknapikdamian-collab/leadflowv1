# 05_MANUAL_TESTS - CloseFlow / LeadFlow

## Krytyczna sciezka reczna
1. Login -> workspace -> Today.
2. Dodanie leada, zadania i wydarzenia.
3. Lead -> sprawa, jesli flow jest aktywny.
4. AI Draft -> przeglad -> zatwierdzenie/anulowanie.
5. Billing/trial/access.
6. Reload kluczowych stron.
7. Drugi workspace/uzytkownik bez przecieku danych.

Po kazdym etapie dopisz realny wynik testu.

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymały się na kruchych anchorach w Clients.tsx.
- V3 używa elastycznych regexów i naprawia częściowy lokalny stan.
- Docelowy wzór: [Oferta wysłana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check
