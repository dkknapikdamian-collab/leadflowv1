# Panel delete actions V1

Data: 2026-04-24

## Problem

Na listach Leady i Klienci użytkownik widział rekordy, ale nie miał szybkiej akcji kosza z poziomu panelu. Przy duplikatach albo testowych rekordach wymuszało to dodatkowe klikanie.

## Decyzja

Dodano kosz bezpośrednio na kartach listy:

- w panelu Leady,
- w panelu Klienci.

## Zasada UX

Kliknięcie karty nadal prowadzi do szczegółów. Kliknięcie kosza zatrzymuje przejście do szczegółów, pokazuje potwierdzenie i usuwa rekord przez istniejące API.

## Bezpieczeństwo

Przed usunięciem jest confirm. Jeśli baza odmówi usunięcia przez powiązania, użytkownik dostanie komunikat z błędem zamiast cichego zniknięcia danych.
