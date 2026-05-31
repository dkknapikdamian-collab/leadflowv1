# STAGE146 Fluid Work Surface — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / desktop-like work surface / fluid main area

## Cel

Naprawić brakujące około 1/5 szerokości po prawej stronie głównego obszaru aplikacji.

## FAKTY

- Stage145 jest załadowany lokalnie.
- Runtime pokazuje `stage145Loaded: "active"`.
- Chrome nadal raportuje niski CSS viewport, mimo że użytkownik pracuje na laptopie.
- Użytkownik wskazał, że aplikacja operatorska powinna renderować główne panele według struktury app shell, a nie wyłącznie przez breakpoint `min-width:1280px`.
- Wizualnie content zaczyna się w dobrym miejscu, ale kończy się za wcześnie po prawej stronie.

## DECYZJA

Dodać Stage146 jako fluid work surface:
- aktywowany przez `hover:hover` i `pointer:fine`, nie przez samo `min-width`,
- bez odejmowania sidebara od `100vw`, bo slot wizualnie siedzi już w shellu,
- `data-shell-content` dostaje płynną szerokość:
  `min(100vw - guttery, 100% + extension)`,
- route rooty wypełniają `data-shell-content`.

## Testy

```powershell
node scripts/check-stage146-fluid-work-surface.cjs
npm.cmd run build
```

## Runtime audit

```text
docs/ui/CLOSEFLOW_STAGE146_RUNTIME_WIDTH_AUDIT.js
```

## Czego nie ruszano

Dane, auth, Supabase, Google Calendar, Stripe, AI, routing, deployment, push.

## Następny krok

Sprawdzić `/`, `/clients`, `/leads`, `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity`.
Jeśli content nadal kończy się za wcześnie, zwiększyć tylko `--cf146-work-extension`.
