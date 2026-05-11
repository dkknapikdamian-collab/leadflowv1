# Today entry relation links

Data: 2026-04-24

## Problem

Ekran Dziś pokazuje najważniejsze akcje, ale użytkownik nie powinien szukać powiązanego leada albo sprawy ręcznie.

## Decyzja

Wpisy na ekranie Dziś pokazują szybkie przejścia:

```text
leadId -> Otwórz lead
caseId -> Otwórz sprawę
```

## Efekt w UI

- Zadanie powiązane z leadem pokazuje link „Otwórz lead”.
- Wydarzenie powiązane ze sprawą pokazuje link „Otwórz sprawę”.
- Dziś staje się realnym pulpitem operacyjnym, nie tylko listą przypomnień.

## Zakres

Zmiana dotyczy tylko prezentacji wpisów na ekranie Dziś.
Nie zmienia SQL ani zapisu danych.

- leadId -> OtwĂłrz lead

- caseId -> OtwĂłrz sprawÄ™
