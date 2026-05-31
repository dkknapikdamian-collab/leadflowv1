# STAGE180T - notifications channels dead copy fix

## Cel
Usunac karte Kanaly i martwe teksty powiadomien po Stage180R/S.

## Fakty
- Stage180R usunal widoczna karte Kanaly, ale guard zatrzymal etap po utracie albo zmianie markera karty informacyjnej.
- Stage180S naprawil czesc struktury, ale zostawil copy z helpera PermissionCopy.

## Zakres
- src/pages/NotificationsCenter.tsx
- scripts/check-stage180t-notifications-channels-dead-copy-fix.cjs

## Zmiany
- Usunieto helper PermissionCopy.
- Usunieto pozostalosci karty Kanaly, Poranny digest e-mail i Konfiguracja w Ustawieniach.
- Zachowano prawy rail: Szybkie akcje, Nadchodzace, Jak dzialaja powiadomienia.

## Testy
- node scripts/check-stage180t-notifications-channels-dead-copy-fix.cjs
- npm run build

## Czego nie ruszano
- Supabase
- RLS
- routing
- deployment
- push

## Next step
Restart dev servera i Ctrl+F5 na /notifications.
