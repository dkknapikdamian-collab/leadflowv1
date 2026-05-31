# STAGE136 Desktop Wide Content — raport

Data: 2026-05-22  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / desktop width / główne kontenery

## Cel

Poszerzyć główne okna aplikacji tylko na komputerze, żeby listy, kafelki i prawe panele nie siedziały w zbyt wąskim kontenerze na środku ekranu.

## Źródło zgłoszenia

Admin feedback: `closeflow_admin_feedback_2026-05-22_22-09.json`.

Damian wskazał, że:
- źle oznaczył część elementów w pliku,
- chodzi nie o pojedynczy kafelek, tylko o szerokość głównych okien,
- na komputerze tracimy czytelność przez zbyt wąski środkowy layout.

## Mapa wskazanych miejsc

- `/clients`: `main-clients-html`, `layout-list w-full max-w-none`
- `/cases`: `grid-4`, `layout-list`
- `/tasks`: `main.mx-auto.flex.w-full.max-w-5xl`
- `/calendar`: `main-calendar-html`
- `/templates`: `main-templates-html mx-auto ... max-w-7xl`
- `/response-templates`: `cf-html-view mx-auto ... max-w-7xl`
- `/activity`: `activity-main-column`, `activity-vnext-shell`

## Decyzja

Dodać desktop-only CSS source truth:

```text
src/styles/closeflow-desktop-wide-content-stage136.css
```

Zakres aktywny od:

```css
@media (min-width: 1280px)
```

Nie ruszać mobile/tablet.

## Parametry

- desktop content max: `1640px`
- desktop content max od 1600px viewport: `1680px`
- gutter: `24px` / `28px`
- prawa kolumna: `332px` / `340px`
- layout list: `minmax(0, 1fr) + right rail`

## Testy

```powershell
node scripts/check-stage136-desktop-wide-content.cjs
npm.cmd run build
```

## Test ręczny

Sprawdzić na komputerze:
- `/clients`
- `/leads`
- `/cases`
- `/tasks`
- `/calendar`
- `/templates`
- `/response-templates`
- `/activity`

Na mobile/tablet szerokość nie powinna się zmienić.

## Czego nie ruszano

- dane
- listy
- przyciski
- auth
- Supabase
- Google OAuth
- Stripe
- AI
- Vercel deploy
- push
