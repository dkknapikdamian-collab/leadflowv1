# STAGE134 Search and Leads Value Card Cleanup — raport

Data: 2026-05-22  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / wyszukiwarki / prawy kafelek leadów

## Źródło zgłoszenia

Admin feedback export: `closeflow_admin_feedback_2026-05-22_21-04.json`.

Zgłoszenia P1:
1. `/leads` — wyszukiwarka ma brzydkie teksty wewnątrz, każda wyszukiwarka ma wyglądać tak samo i mieć jedno źródło wizualne.
2. `/leads` — kafelek `Najcenniejsze leady` wygląda brzydko, ma dostać taki sam kierunek jak odpowiednik w zakładce `Klienci`.

## Decyzja

Nie robimy globalnego redesignu. Robimy mały UI cleanup:
- główne wyszukiwarki list mają wspólny tekst i wspólny styl,
- w `/leads` znak `?` zostaje zastąpiony ikoną `Search`,
- `Leads` i `Clients` używają wspólnego placeholdera:
  `Szukaj po nazwie, telefonie, e-mailu, firmie albo sprawie...`
- tryb kosza używa krótkiego placeholdera:
  `Szukaj w koszu...`
- `Najcenniejsze leady` dostaje opis jak `Najcenniejsi klienci` i nie używa ciemnego badge’a `Lejek razem`.

## Uwaga V2

V2 jest resume-safe. Dokańcza wdrożenie po częściowo urwanym V1, które mogło już:
- skopiować pliki Stage134,
- dodać import CSS w `src/App.tsx`,
- częściowo ruszyć `src/pages/Leads.tsx`.

## Testy

```powershell
node scripts/check-stage134-search-and-value-card.cjs
npm.cmd run build
```

## Czego nie ruszano

Supabase, Google OAuth, Stripe, AI, dane, routing, Vercel deploy, push.
