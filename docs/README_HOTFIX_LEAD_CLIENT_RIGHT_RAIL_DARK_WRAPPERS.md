# HOTFIX — jasne panele boczne w LeadDetail i ClientDetail

## Cel

Usuwa ciemny wrapper / czarne tło widoczne za jasnymi kartami w szczegółach leada i klienta.

Zakres:

- `LeadDetail`
- `ClientDetail`
- prawa kolumna leada
- lewa i prawa kolumna klienta

## Co jest zmieniane

Dodawany jest osobny CSS:

- `src/styles/hotfix-lead-client-right-rail-dark-wrappers.css`

oraz import w:

- `src/index.css`

Dodawany jest test:

- `tests/hotfix-lead-client-right-rail-dark-wrappers.test.cjs`

## Czego nie rusza

Hotfix nie zmienia:

- danych,
- API,
- Supabase,
- auth,
- billing,
- workspace,
- routingu,
- sidebaru,
- filtrów,
- akcji,
- logiki leada,
- logiki klienta,
- logiki spraw.

To jest tylko hotfix wizualny.

## Testy uruchamiane przez skrypt

```powershell
node tests/hotfix-lead-client-right-rail-dark-wrappers.test.cjs
npm.cmd run check:polish
npm.cmd run build
```

## Test ręczny

Po wdrożeniu sprawdź:

1. `/leads/:id`
2. szczegóły leada, prawa kolumna:
   - brak czarnych narożników,
   - brak ciemnego tła pod kartami,
   - brak ciemnych pasów między kartami.
3. `/clients/:id`
4. szczegóły klienta, lewa i prawa kolumna:
   - brak czarnych narożników,
   - brak ciemnego tła pod kartami,
   - brak ciemnych pasów między kartami.
5. Sidebar dalej zostaje ciemny.
