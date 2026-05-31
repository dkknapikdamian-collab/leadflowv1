# STAGE149 Clean Desktop App Shell Canvas — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / app-shell / cleanup width experiments

## Cel

Zatrzymać serię plastrów CSS Stage136-148 i wrócić do poprawnej architektury panelu operatorskiego:
- stały sidebar,
- main jako płynna kolumna,
- route content na pełną szerokość main,
- bez transform scale,
- bez `100% + overrun`,
- bez losowych `max-w-*` wysp.

## FAKTY

- Audyt runtime pokazał, że `html/body/#root/app` dostają bardzo niski CSS viewport przy szerokim `outerWidth`.
- Stage146/147 próbowały rozciągać route sloty.
- Stage148 próbował skalować desktop canvas przez transform.
- To nie rozwiązało problemu i wprowadziło dodatkową warstwę zniekształceń.

## DECYZJA

Stage149:
1. usuwa importy eksperymentalnych width CSS Stage136-148 z `src/App.tsx`,
2. usuwa `ShellDesktopViewportRuntime` z `Layout.tsx`,
3. zostawia poprawki route-root/source code z wcześniejszych etapów, ale nowym właścicielem szerokości jest jeden CSS:
   `src/styles/closeflow-clean-desktop-app-shell-canvas-stage149.css`,
4. wymusza desktopowy app canvas minimum 1280px dla środowiska `hover:hover` + `pointer:fine`.

## Testy

```powershell
node scripts/check-stage149-clean-desktop-app-shell-canvas.cjs
npm.cmd run build
```

## Runtime audit

```text
docs/ui/CLOSEFLOW_STAGE149_RUNTIME_APP_SHELL_AUDIT.js
```

Oczekiwane:
- `stage149Loaded: "active"`,
- `stage148Attr: null`,
- `.app` ma `grid-template-columns: 240px minmax(0, 1fr)`,
- `#root/.app` mają minimum 1280px w desktop-like input,
- brak `transform: matrix(...)` na root/app.

## Czego nie ruszano

- dane
- auth
- Supabase
- Google Calendar
- Stripe
- AI
- routing
- deployment
- push

## Następny krok

Sprawdzić lokalnie `/leads`, `/clients`, `/`, `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity`.
Jeżeli nadal widać dziwny viewport, testować bez zadokowanego DevTools albo użyć osobnego zewnętrznego okna DevTools.
