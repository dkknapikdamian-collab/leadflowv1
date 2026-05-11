# CloseFlow admin feedback P2 guard — 2026-05-11

## Cel

Dodano zbiorczy guard dla feedbacku P2 z ekranow CaseDetail, Billing, Help i Settings.

## Co sprawdza guard

- CaseDetail nie pokazuje juz tekstu `Dodaj brak`.
- CaseDetail nadal ma `case-quick-actions`.
- Style `case-quick-actions` nie wracaja do ciemnego tla.
- Billing nie pokazuje starych sekcji planu, limitow i rozliczen lead/case.
- Billing nadal pokazuje `Nastepna platnosc` i `billing-status-card`.
- Help nie pokazuje zbędnych prawych kart i pokazuje liste `Moje zgloszenia`.
- Help pokazuje status oraz miejsce na odpowiedz albo `Brak odpowiedzi`.
- Settings ma zakladki, `Plany` jako pierwszy kontekst oraz stale `Dane konta` z boku.

## Komenda

```powershell
npm.cmd run check:closeflow-admin-feedback-2026-05-11-p2
```

## Zasada

Guard pilnuje sensu feedbacku, nie pojedynczego piksela ani jednej konkretnej struktury HTML.
