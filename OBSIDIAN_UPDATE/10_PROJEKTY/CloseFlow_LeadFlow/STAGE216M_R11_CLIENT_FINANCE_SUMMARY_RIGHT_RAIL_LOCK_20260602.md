# CloseFlow / LeadFlow — Stage216M-R11 ClientDetail finance summary/right rail lock

## FAKTY
- Po R10-R4 środek klienta został przestawiony, ale w UI nadal brakowało poprawnie widocznych finansów klienta po prawej stronie.
- W zakładce `Podsumowanie` użytkownik widział głównie jeden duży kafel `Najbliższa zaplanowana akcja`, zamiast kompletnego podsumowania z finansami.

## DECYZJE DAMIANA
- Poprawić płatności/finanse klienta w widoku klienta.
- Podsumowanie ma pokazywać więcej niż jeden wielki kafel.
- Prawa szyna ma mieć widoczne finanse klienta.

## HIPOTEZY AI
- Karta finansów istnieje w TSX, ale ginie wizualnie pod foldem albo przez zbyt luźny rytm prawej szyny.
- Podsumowanie wymaga spłaszczenia układu hero + side cards do trzech równych kart.

## ZAKRES ETAPU
- Dodać CSS `stage216m-r11-client-finance-summary-right-rail-lock.css`.
- Podpiąć import w `page-adapters.css`.
- Dodać guard kontraktu.

## TESTY
- Guard R11.
- `git diff --check`.
- `npm run build`.

## CZEGO NIE RUSZANO
- API.
- Supabase.
- Dane.
- Płatności backendowe.
- Stage216D.

## NASTĘPNY KROK
Zweryfikować screenshot po deployu. Jeśli nadal finanse nie są widoczne, następny etap powinien edytować TSX i przenieść kartę finansów strukturalnie, nie tylko przez CSS.
