# CloseFlow Stage177 — Leads/Clients List Layout Source Truth

Data: 2026-05-24  
Status: przygotowano ZIP lokalny  
Typ: UI / leads clients parity / list layout / right rail

## FAKTY

- Po Stage176 hotfix duplicate import przeszedł lokalnie i build OK.
- Użytkownik porównał `/clients` i `/leads`.
- Lead list visually diverges from Client list.
- `Clients.tsx` ma szersze/wide klasy na layout-list i table-card, a `Leads.tsx` ich nie miał.
- Shared CSS istnieje, ale markup leadów nie był w pełni dopięty do tej samej geometrii.

## DECYZJE DAMIANA

- Karta/lista leada ma mieć tę samą długość i szerokość co klient.
- Wyszukiwarka i informacje o leadzie mają kończyć się na granicy jak w karcie klienta.
- `Filtry proste` i `Najcenniejsze leady` mają być lekko ciaśniejsze, ale czytelne jak klient.
- Wygląd i ułożenie to jedno źródło prawdy.
- Każda poprawka ma mieć guard.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- Różnica wynika z kombinacji markup classes i CSS rail/layout.
- Stage177 powinien dodać finalną warstwę source truth dla `/leads` i `/clients`.
- Lepiej wyrównać geometrię niż kopiować literalnie treść kart klienta.

## TESTY

```powershell
node scripts/check-stage177-leads-clients-list-layout-source-truth.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Test wizualny `/clients` oraz `/leads` na tym samym zoomie i tej samej szerokości okna.
