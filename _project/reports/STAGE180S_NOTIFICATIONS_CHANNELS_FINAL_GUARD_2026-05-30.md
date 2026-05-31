# Stage180S - Notifications channels final guard

## Cel
Naprawa po Stage180R: karta Kanały została usunięta, ale guard wykrył brak wymaganej karty informacyjnej "Jak działają powiadomienia?".

## Fakty
- Pracujemy lokalnie na CloseFlow / LeadFlow.
- Repo: C:\Users\malim\Desktop\biznesy_ai\2.closeflow.
- Branch: dev-rollout-freeze.
- Stage180R usunął kartę Kanały, ale zatrzymał etap na guardzie.

## Decyzje Damiana
- Usunąć z prawego panelu powiadomień kartę "Kanały".
- Usunąć komunikaty o zablokowanych powiadomieniach w przeglądarce.
- Usunąć "Poranny digest e-mail" oraz "Konfiguracja w Ustawieniach".

## Zakres Stage180S
- Usunięto resztki karty Kanały, jeżeli pozostały.
- Usunięto martwy helper PermissionCopy, jeżeli pozostał.
- Przywrócono kartę "Jak działają powiadomienia?", jeżeli Stage180R usunął ją zbyt szeroko.
- Dodano guard scripts/check-stage180s-notifications-channels-final-guard.cjs.

## Testy
- node scripts/check-stage180s-notifications-channels-final-guard.cjs
- npm run build

## Czego nie ruszano
- Supabase
- RLS
- routing
- deployment
- push

## Następny krok
Uruchomić dev server, wykonać Ctrl+F5 na /notifications i potwierdzić, że karta Kanały zniknęła, a pozostały Szybkie akcje, Nadchodzące i Jak działają powiadomienia?.
