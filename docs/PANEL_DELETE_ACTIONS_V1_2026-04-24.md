# Panel delete actions V1

Data: 2026-04-24

## Problem

Na listach Leady i Klienci użytkownik widział rekordy, ale nie miał szybkiej akcji kosza z poziomu panelu. Przy duplikatach albo testowych rekordach wymuszało to dodatkowe klikanie.

## Decyzja

Dodano bezpieczny kosz bezpośrednio na kartach listy:

- w panelu Leady,
- w panelu Klienci.

## Zasada UX

Kliknięcie karty nadal prowadzi do szczegółów. Kliknięcie kosza zatrzymuje przejście do szczegółów, pokazuje potwierdzenie i przenosi rekord do kosza.

## Bezpieczeństwo V1

Kosz w V1 nie kasuje danych trwale.

- klient dostaje `archivedAt`,
- lead dostaje status `archived`, `leadVisibility: trash` i `salesOutcome: archived`,
- aktywne listy ukrywają rekordy z kosza,
- użytkownik może przełączyć listę na widok kosza,
- użytkownik może przywrócić rekord przez ikonę przywracania.

## Dlaczego tak

Twarde usuwanie jest ryzykowne, bo lead albo klient może mieć powiązane sprawy, zadania, wydarzenia, rozliczenia albo historię aktywności. Kosz daje użytkownikowi prosty przycisk usunięcia z panelu, ale nie niszczy danych.

## Zachowanie leadów po przywróceniu

- lead bez sprawy wraca jako aktywny `new`,
- lead z powiązaną sprawą wraca jako `moved_to_service`, bo dalsza praca powinna odbywać się w sprawie.

## Zakres poza V1

Trwałe usunięcie danych może zostać dodane później jako osobna, bardziej ostrożna akcja administracyjna.
