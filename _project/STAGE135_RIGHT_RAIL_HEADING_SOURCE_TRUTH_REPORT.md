# STAGE135 Right Rail Heading Source Truth — raport

Data: 2026-05-22  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / napisy w kafelkach prawej kolumny

## Cel

Ujednolicić dokładnie te napisy/nagłówki kafelków, które Damian kliknął i zgłosił z panelu admina. To nie jest patch przycisków ani list. To jest patch typografii, rozmiaru, koloru, linii i położenia napisów w kafelkach prawej kolumny.

## Źródło zgłoszenia

Plik feedbacku: `closeflow_admin_feedback_2026-05-22_21-59.json`.

## Mapa dokładnie klikniętych napisów

### /leads
1. `Filtry proste` — selector: `div.panel-head`, rodzic: `[data-testid="leads-simple-filters-card"]`, opis: `Bez przesady, tylko najpotrzebniejsze.`
2. `Najcenniejsze leady` — selector: `div.panel-head`, rodzic: `[data-testid="leads-top-value-records-card"]`, opis: `5 leadów z największą wartością.`

### /clients
3. `Filtry proste` — selector: `div.panel-head`, rodzic: `[data-testid="clients-simple-filters-card"]`, opis: `Bez przesady, tylko najpotrzebniejsze.`
4. `Najcenniejsi klienci` — selector: `div.panel-head`, rodzic: `[data-testid="clients-top-value-records-card"]`, opis: `5 klientów z największą wartością.`

### /cases
5. `Operacyjne skróty` — selector: `div.panel-head`, rodzic: `.cases-shortcuts-rail-card`
6. `Blokery i ryzyko` — selector: `div.panel-head`, rodzic: `.cases-risk-rail-card`

### /activity
7. `Szybkie filtry` — selector: `h2`, rodzic: `.activity-right-card-head`
8. `Ostatnie zmiany w sprawach` — selector: `h2`, rodzic: `.activity-right-card-head`
9. `Ostatnie zmiany w leadach` — selector: `h2`, rodzic: `.activity-right-card-head`; uwaga Damiana: `ten styl jest ok`

## Audyt przeszkód

### Różne komponenty
Leads/Clients używają operator cards z `.panel-head`, Cases ma własne right cards z `.panel-head`, a Activity używa `.activity-right-card-head` z `h2`. Wniosek: nie wystarczy poprawić jednego komponentu TSX.

### Różne tagi
Activity używa `h2`, Cases używa `h3`, Leads/Clients używają `h3` i `p` w `.panel-head`. Wniosek: source truth obejmuje `h2`, `h3`, `p`, `small` i kontener.

### Różna wysokość headera
Feedback pokazał różne wysokości: pojedyncze h2 w Activity około 18.9 px, a nagłówki z opisem w Leads/Clients około 31-36 px. Wniosek: kontener dostaje wspólne `min-height: 38px`, a tytuł i opis osobne tokeny.

### Ryzyko starych override’ów
W aplikacji są historyczne klasy `.lead-right-card`, `.operator-top-value-card`, `.activity-right-card`, `.cases-risk-rail-card`. Wniosek: Stage135 używa ograniczonych selektorów tylko dla prawej kolumny i nie dotyka list ani danych.

## Jedno źródło prawdy

Plik:

```text
src/styles/closeflow-right-rail-heading-source-truth-stage135.css
```

Tokeny:

```css
--cf135-rail-heading-font-size: 14px;
--cf135-rail-heading-line-height: 18px;
--cf135-rail-heading-weight: 850;
--cf135-rail-description-font-size: 12px;
--cf135-rail-description-line-height: 16px;
--cf135-rail-description-weight: 600;
--cf135-rail-heading-min-height: 38px;
```

## Testy automatyczne

```powershell
node scripts/check-stage135-right-rail-heading-source-truth.cjs
npm.cmd run build
```

## Test ręczny

Sprawdzić `/leads`, `/clients`, `/cases`, `/activity` i porównać nagłówki/opisy w prawej kolumnie.

## Czego nie ruszano

Przycisków, danych, list, Supabase, Google OAuth, Stripe, AI, routingu, Vercel deploy, push.
