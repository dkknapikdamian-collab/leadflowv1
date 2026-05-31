# STAGE148 Scaled Desktop Shell — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / app shell / scaled desktop canvas

## Cel

Naprawić prawdziwy blocker z audytu Stage148: Chrome/Windows raportuje bardzo mały CSS viewport (`innerWidth` ok. 326) przy szerokim oknie laptopa (`outerWidth` ok. 1536). To powoduje, że klasyczny desktop CSS nie ma stabilnego punktu odniesienia, a content wygląda jak ucięty / przykryty.

## FAKTY

- Stage145, Stage146 i Stage147 są aktywne.
- Runtime audit pokazał `outerWidth` około 1536 i `innerWidth` około 326.
- User jest na laptopie i chce desktopowy panel.
- Samo zwiększanie `overrun` powoduje wyciekanie pod warstwy, nie stabilny app-shell.
- W `Layout.tsx` wszystkie zakładki przechodzą przez `main[data-shell-main]` i `.view.active[data-shell-content]`.

## DECYZJA

Dodać Stage148:
- komponent `ShellDesktopViewportRuntime`,
- CSS `closeflow-scaled-desktop-shell-stage148.css`,
- wykrywanie desktop-like anomaly:
  - `hover:hover`,
  - `pointer:fine`,
  - `outerWidth >= 1000`,
  - `innerWidth < 900`,
- ustawienie desktopowego canvasu 1280-1480px,
- skalowanie całego `#root` przez `transform: scale(var(--cf148-scale))`,
- app-shell grid `sidebar + main`,
- route content wypełnia main lane.

## Dlaczego to jest lepsze od kolejnego CSS-overrun

Overrun rozciągał elementy poza rodzica. Stage148 robi standardowy model:
desktop design canvas → scale do realnego CSS viewportu.
To jest kontrolowane i jednolite dla wszystkich zakładek.

## Testy

```powershell
node scripts/check-stage148-scaled-desktop-shell.cjs
npm.cmd run build
```

## Runtime audit

```text
docs/ui/CLOSEFLOW_STAGE148_RUNTIME_SCALED_DESKTOP_AUDIT.js
```

Oczekiwane:
- `stage148Loaded: "active"`,
- `scaledDesktopAttr: "true"` przy obecnym runtime,
- `root.transform` zawiera matrix/scale,
- `app.display: grid`,
- `app.gridTemplateColumns` ma sidebar + main,
- content nie jest przykryty z prawej.

## Czego nie ruszano

- dane,
- auth,
- Supabase,
- Google Calendar,
- Stripe,
- AI,
- routing,
- deployment,
- push.

## Następny krok

Sprawdzić `/`, `/leads`, `/clients`, `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity`. Dopiero po akceptacji sprzątać stare Stage141-147 CSS albo przygotować jeden czysty plik source truth.
