# STAGE141 Shared Work Width Frame — raport

Data: 2026-05-22  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / desktop width source truth / Layout.tsx

## Cel

Naprawić szerokość wszystkich zakładek jednym realnym źródłem prawdy, nie kolejnymi selektorami CSS per route.

## FAKTY

- Damian wymaga, żeby każda zakładka miała tę samą szerokość roboczą.
- Poprzednie Stage136-140 poprawiały shell częściowo, ale dalej przegrały z różnymi rootami route’ów.
- `Layout.tsx` renderuje `{children}` bez wspólnego wrappera w `div.view.active`.
- `TodayStable.tsx` ma root `main.mx-auto.w-full.max-w-7xl[data-p0-today-stable-rebuild]`, który trzyma własną wyspę.
- `Clients.tsx` ma root `div.cf-html-view.main-clients-html`.
- Inne zakładki mają własne rooty i utility klasy.

## Audyt blockera

Źródłem problemu jest brak jednego realnego kontenera szerokości. CSS po route’ach jest kruchy, bo:
- `/` używa `main[data-p0-today-stable-rebuild]`,
- `/clients` używa `.cf-html-view.main-clients-html`,
- `/leads` używa `.cf-html-view.main-leads-html`,
- `/cases` używa `.cf-html-view.main-cases-html`,
- `/tasks` używa własnego stable rebuild roota,
- `/activity` używa `.activity-vnext-shell`.

## Decyzja

Dodać w `Layout.tsx` jeden wrapper:

```tsx
<div className="cf-work-width-frame" data-cf-work-width-frame="true" data-cf-work-width-section={currentSection}>
  {children}
</div>
```

I jedno źródło prawdy CSS:

```text
src/styles/closeflow-shared-work-width-frame-stage141.css
```

## Tokeny

```css
--cf141-work-width: 1440px;
--cf141-work-width-wide: 1480px;
--cf141-left-gutter: 8px;
--cf141-right-gutter: 16px;
--cf141-right-rail-width: 360px;
```

## Zakres

Wszystkie widoki renderowane przez `Layout.tsx`, w tym:
- `/`
- `/leads`
- `/clients`
- `/cases`
- `/tasks`
- `/calendar`
- `/templates`
- `/response-templates`
- `/activity`
- podstrony szczegółów, settings, billing, help, notifications, ai-drafts

## Testy

```powershell
node scripts/check-stage141-shared-work-width-frame.cjs
npm.cmd run build
```

## Test ręczny

1. Wejdź w `/`.
2. Sprawdź prawą krawędź głównej zawartości.
3. Przejdź:
   - `/leads`
   - `/clients`
   - `/cases`
   - `/tasks`
   - `/calendar`
   - `/templates`
   - `/response-templates`
   - `/activity`
4. Szerokość nie powinna przeskakiwać między zakładkami.

## Czego nie ruszano

- dane
- routing
- Supabase/Auth/Google
- Stripe
- AI
- przyciski
- logika list
- mobile/tablet
- Vercel deploy
- push

## Następny krok

Jeśli szerokość ma być inna, zmienić tylko `--cf141-work-width`. Nie dodawać osobnych wyjątków per zakładka.
