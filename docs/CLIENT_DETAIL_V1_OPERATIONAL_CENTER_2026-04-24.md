# Client Detail V1 operational center

Data: 2026-04-24

## Co robi ten etap

Client Detail przestaje być tylko edycją danych klienta. Jest teraz centrum operacyjnym klienta.

## Zakres

Dodano:

- następny ruch klienta,
- liczniki aktywnych leadów, spraw, zadań i wydarzeń,
- listę zadań klienta,
- listę wydarzeń klienta,
- ostatnią aktywność klienta,
- poprawne przejścia do spraw przez `/cases/:id`,
- powiązanie aktywności, zadań i wydarzeń przez leadId oraz caseId.

## Logika następnego ruchu

Priorytet jest prosty:

```text
1. zaległe zadanie,
2. najbliższe aktywne zadanie,
3. najbliższe aktywne wydarzenie,
4. aktywna sprawa,
5. aktywny lead,
6. brak aktywnego ruchu.
```

## Efekt dla użytkownika

Użytkownik wchodzi w klienta i widzi, co realnie trzeba zrobić dalej. Nie musi ręcznie szukać w Dziś, Kalendarzu, Leadach, Sprawach i Aktywności.

## Ważne

Ten etap nie zmienia SQL. Korzysta z obecnych API i filtruje dane po relacjach leadId oraz caseId.
