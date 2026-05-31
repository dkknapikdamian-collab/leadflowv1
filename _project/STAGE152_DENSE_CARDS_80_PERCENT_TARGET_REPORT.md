# STAGE152 Dense Cards 80 Percent Target — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / denser cards / 80 percent target / guard per correction

## Cel

Po Stage151 kafelki są lepsze, ale nadal za duże. Damian wskazał, że układ zaczyna wyglądać dobrze dopiero przy zoomie ok. 70-80%. Stage152 ma uzyskać podobną gęstość bez skalowania całej aplikacji i bez zmiany szerokości.

## FAKTY

- Stage149 jest źródłem prawdy szerokości.
- Stage150 jest źródłem prawdy typografii.
- Stage151 dodał pierwsze zmniejszenie kart.
- Damian potwierdził, że to jeszcze nie to i trzeba iść mocniej w stronę 70-80% wizualnej gęstości.
- Damian ustalił zasadę: każda poprawka ma mieć osobny guard.

## DECYZJE DAMIANA

- Jeszcze trochę zmniejszyć kafelki.
- Kierunek: gęstość zbliżona do widoku przy 70-80% zoomu okna.
- Każda poprawka = nowy guard.
- Nie ruszać szerokości, bo Stage149 jest akceptowanym source truth.

## Zakres Stage152

Dodaje:
- `src/styles/closeflow-dense-cards-80-percent-target-stage152.css`
- `scripts/check-stage152-dense-cards-80-percent-target.cjs`
- `scripts/apply-stage152-dense-cards-80-percent-target.cjs`
- `docs/ui/CLOSEFLOW_STAGE152_DENSE_CARDS_80_PERCENT_TARGET.md`
- `_project/STAGE152_DENSE_CARDS_80_PERCENT_TARGET_REPORT.md`
- aktualizację Obsidiana

## Testy

```powershell
node scripts/check-stage152-dense-cards-80-percent-target.cjs
npm.cmd run build
```

## Czego nie ruszano

- Stage149 szerokość
- Stage150 ogólna typografia
- routing
- dane
- auth
- Supabase
- Google Calendar
- Stripe
- AI
- deploy
- push

## Następny krok

Sprawdzić wizualnie `/`, `/leads`, `/clients`, `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity`.
Jeśli nadal jest za duże, regulować wyłącznie zmienne `--cf152-*`.
