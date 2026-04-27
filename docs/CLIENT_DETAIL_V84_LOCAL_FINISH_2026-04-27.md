# Client Detail V84 - lokalne domknięcie po V82/V83

Cel:
- domknąć konflikt po przebudowie ekranu klienta,
- nie cofać nowego układu klienta,
- usunąć główną akcję sprzedażową `Dodaj follow-up` z kartoteki klienta,
- usunąć roboczą kopię `ClientDetailV81.tsx` z kompilowanego `src/pages`, jeżeli nie jest używana.

Zasada produktu:
- Klient = kartoteka, relacje, kontakt, historia.
- Praca operacyjna = sprawa albo aktywny lead.
- Follow-up nie powinien być główną akcją w kokpicie klienta.

Walidacja po wdrożeniu:
- `node tests/client-detail-final-operating-model.test.cjs`
- `node tests/client-detail-simplified-card-view.test.cjs`
- `node tests/client-relation-command-center.test.cjs`
- `node tests/client-detail-v1-operational-center.test.cjs`
- `npm.cmd run lint`
- `npm.cmd run verify:closeflow:quiet`