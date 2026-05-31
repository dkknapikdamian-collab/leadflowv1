# STAGE177 Leads/Clients List Layout Source Truth — raport

Data: 2026-05-24  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / leads list / clients parity / right rail

## Cel

Doprowadzić kartę/listę leada do tego samego układu co klient:
- taka sama długość i szerokość list/cardów,
- search i informacje o leadzie kończą się na tej samej granicy co w Klienci,
- prawy rail `Filtry proste` i `Najcenniejsze leady` lekko ciaśniejszy, ale czytelny jak `Najcenniejsi klienci`.

## FAKTY

- `Clients.tsx` ma `layout-list w-full max-w-none`, a `Leads.tsx` miał samo `layout-list`.
- `Clients.tsx` ma `table-card w-full max-w-none`, a `Leads.tsx` miał `table-card lead-table-card`.
- `closeflow-record-list-source-truth.css` już deklaruje wspólny scope dla `/leads` i `/clients`, ale lead markup nie miał wszystkich markerów/wide classes.
- `closeflow-right-rail-source-truth.css` ma shared right rail source truth dla `.lead-right-rail` i `.clients-right-rail`.

## DECYZJE DAMIANA

- Lead ma wyglądać jak Klient pod względem długości/szerokości kart.
- Wyszukiwarka i informacje o leadzie mają kończyć się na tej samej granicy co w Kliencie.
- Prawy rail leadów ma być delikatnie ściśnięty, ale napisy mają wyglądać jak w karcie klienta.
- Wygląd i ułożenie to jedno źródło prawdy.
- Każda poprawka ma mieć guard.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- Problem wynikał nie tylko z CSS, ale z różnicy markup classes między `Leads.tsx` i `Clients.tsx`.
- Najbezpieczniej dodać Stage177 jako finalny source-truth override po Stage175.
- Nie należy ręcznie przepisywać danych leadów, tylko wyrównać ramę: layout-list, stack, search, table-card, row, rail.

## Pliki

- `src/App.tsx`
- `src/pages/Leads.tsx`
- `src/styles/closeflow-leads-clients-list-layout-source-truth-stage177.css`
- `scripts/apply-stage177-leads-clients-list-layout-source-truth.cjs`
- `scripts/check-stage177-leads-clients-list-layout-source-truth.cjs`
- `docs/ui/CLOSEFLOW_STAGE177_LEADS_CLIENTS_LIST_LAYOUT_SOURCE_TRUTH.md`
- `docs/ui/CLOSEFLOW_STAGE177_RUNTIME_LEADS_CLIENTS_LAYOUT_AUDIT.js`
- `_project/STAGE177_LEADS_CLIENTS_LIST_LAYOUT_SOURCE_TRUTH_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-24 - CloseFlow Stage177 leads clients list layout source truth.md`

## Testy automatyczne

```powershell
node scripts/check-stage177-leads-clients-list-layout-source-truth.cjs
npm.cmd run build
```

## Testy ręczne

Sprawdzić:
- `/clients`
- `/leads`

Warunki:
- list/search kończą się na tej samej prawej granicy,
- lead row ma tę samą geometrię co client row,
- right rail leadów nie jest szerszy/luźniejszy od client rail,
- napisy w `Filtry proste` i `Najcenniejsze leady` są czytelne,
- brak regresji search barów po Stage175.

## Czego nie ruszano

- dane
- auth
- Supabase schema
- Google Calendar
- Stripe
- AI
- deploy
- push
