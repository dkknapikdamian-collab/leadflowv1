# Client Detail V1 operational center

Data: 2026-04-24

## Co robi ten etap

Client Detail przestaje byÄ‡ tylko edycjÄ… danych klienta. Jest teraz centrum operacyjnym klienta.

## Zakres

Dodano:

- nastÄ™pny ruch klienta,
- liczniki aktywnych leadĂłw, spraw, zadaĹ„ i wydarzeĹ„,
- listÄ™ zadaĹ„ klienta,
- listÄ™ wydarzeĹ„ klienta,
- ostatniÄ… aktywnoĹ›Ä‡ klienta,
- poprawne przejĹ›cia do spraw przez `/cases/:id`,
- powiÄ…zanie aktywnoĹ›ci, zadaĹ„ i wydarzeĹ„ przez leadId oraz caseId.

## Logika nastÄ™pnego ruchu

Priorytet jest prosty:

```text
1. zalegĹ‚e zadanie,
2. najbliĹĽsze aktywne zadanie,
3. najbliĹĽsze aktywne wydarzenie,
4. aktywna sprawa,
5. aktywny lead,
6. brak aktywnego ruchu.
```

## Efekt dla uĹĽytkownika

UĹĽytkownik wchodzi w klienta i widzi, co realnie trzeba zrobiÄ‡ dalej. Nie musi rÄ™cznie szukaÄ‡ w DziĹ›, Kalendarzu, Leadach, Sprawach i AktywnoĹ›ci.

## WaĹĽne

Ten etap nie zmienia SQL. Korzysta z obecnych API i filtruje dane po relacjach leadId oraz caseId.
