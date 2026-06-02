# CloseFlow / LeadFlow — Stage216M-R9 Client left rail final lock

## FAKTY
- Stage216M-R7 wprowadził wspólne źródło prawdy dla kart danych `Dane leada` i `Dane klienta`.
- Stage216M-R8 ujednolicił historię aktywności klienta z historią aktywności leada.
- Po screenach Damian zaakceptował kierunek, ale wskazał potrzebę przesunięcia lewej szyny klienta o jeden dodatkowy takt w górę.

## DECYZJE DAMIANA
- Wdrażamy kierunek: klient ma mieć ten sam system wizualny co lead, ale własną logikę pracy.
- Lewa szyna klienta ma mieć `Dane klienta` oraz `Historia aktywności`.
- Historia klienta ma używać własnych danych klienta, nie danych leada.

## ZAKRES STAGE216M-R9
- finalny lock CSS lewej szyny klienta,
- dodatkowe przesunięcie klienta w górę,
- utrzymanie wspólnego fioletowego stylu historii aktywności.

## TESTY
- Stage216M-R9 guard,
- `git diff --check`,
- `npm run build`,
- ręcznie: screenshot lewej szyny klienta i lewej szyny leada.

## CZEGO NIE RUSZANO
- API,
- Supabase,
- płatności,
- prawa szyna,
- środek klienta,
- Stage216D.

## NASTĘPNY KROK
Stage216M-R10: środek klienta. Proponowana kolejność: kafelki → aktywne sprawy → notatki → historia/podsumowanie.
