# Global quick actions bez duplikatów — v95

## Cel

Jedno miejsce dla szybkich akcji w aplikacji:

- Asystent AI,
- Szybki szkic,
- Szkice AI,
- Lead,
- Zadanie,
- Wydarzenie.

Te akcje mają być w globalnym pasku u góry. Jeżeli podstrona ma osobny Asystent AI albo Szybki szkic, traktujemy to jako dubel i usuwamy.

## Naprawa po starej paczce

v95 naprawia błąd parsera PowerShell z v94 i ponownie dokleja kontrakty widoku klienta, które mogły zostać cofnięte przez starą paczkę cumulative.

## Testy

- tests/global-quick-actions-no-duplicates.test.cjs
- tests/client-relation-command-center.test.cjs
- tests/client-detail-final-operating-model.test.cjs
- tests/relation-funnel-value.test.cjs
