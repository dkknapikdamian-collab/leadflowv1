# CloseFlow VS-8 — Screenshot QA gate

**Data:** 2026-05-09  
**Status po wdrożeniu paczki:** gate instalowany, screenshot evidence wymagane osobno  
**Cel:** tekstowy guard UI nie wystarcza. Dla krytycznych ekranów CloseFlow musi istnieć realna evidencja screenshotów w 3 szerokościach.

---

## 1. Teza VS-8

VS-8 nie zmienia wyglądu aplikacji.

VS-8 dodaje twardą bramkę jakości:

> Nie uznajemy UI za sprawdzone, dopóki nie ma screenshotów z wymaganych ekranów i szerokości.

To ma chronić przed sytuacją, w której check tekstowy przechodzi, a ekran realnie:
- ucina przyciski,
- ma rozjechane kolumny,
- chowa akcje poza ekranem,
- psuje mobile,
- pokazuje panel w innym miejscu niż pozostałe encje,
- różni się między Lead / Client / Case mimo wspólnego kontraktu slotów.

---

## 2. Zakres widoków

Każdy ekran ma mieć evidencję dla 3 szerokości:

| Viewport ID | Szerokość | Minimalna wysokość | Cel |
|---|---:|---:|---|
| `desktop-1440` | `1440` | `800` | typowy laptop / desktop |
| `desktop-1280` | `1280` | `720` | ciaśniejszy laptop |
| `mobile-390` | `390` | `700` | telefon / PWA mobile |

---

## 3. Ekrany obowiązkowe

### Statyczne route’y

| Screen ID | Route |
|---|---|
| `today` | `/today` |
| `tasks` | `/tasks` |
| `leads` | `/leads` |
| `clients` | `/clients` |
| `cases` | `/cases` |
| `calendar` | `/calendar` |
| `ai-drafts` | `/ai-drafts` |
| `notifications` | `/notifications` |
| `templates` | `/templates` |
| `activity` | `/activity` |

### Dynamiczne route’y

| Screen ID | Template | Wymaganie |
|---|---|---|
| `lead-detail` | `/leads/:id` | manifest musi podać realny `routeActual`, np. `/leads/abc123` |
| `client-detail` | `/clients/:id` | manifest musi podać realny `routeActual`, np. `/clients/abc123` |
| `case-detail` | `/cases/:id` | manifest musi podać realny `routeActual`, np. `/cases/abc123` |

Łącznie wymagane jest:

```text
13 ekranów x 3 viewporty = 39 screenshotów
```

---

## 4. Pliki evidencji

Domyślny manifest:

```text
docs/ui/screenshot-qa/CLOSEFLOW_SCREENSHOT_QA_EVIDENCE_2026-05-09.json
```

Rekomendowany folder screenshotów:

```text
docs/ui/screenshot-qa/2026-05-09/
```

Rekomendowane nazwy plików:

```text
today__desktop-1440.png
today__desktop-1280.png
today__mobile-390.png
lead-detail__desktop-1440.png
lead-detail__desktop-1280.png
lead-detail__mobile-390.png
```

---

## 5. Format manifestu

Manifest ma mieć tablicę `screenshots`.

Minimalny przykład dla jednego wpisu:

```json
{
  "stage": "VS-8",
  "capturedAt": "2026-05-09T20:00:00+02:00",
  "baseUrl": "http://localhost:3000",
  "operator": "manual",
  "screenshots": [
    {
      "screenId": "today",
      "routeTemplate": "/today",
      "routeActual": "/today",
      "viewportId": "desktop-1440",
      "width": 1440,
      "height": 900,
      "file": "docs/ui/screenshot-qa/2026-05-09/today__desktop-1440.png",
      "status": "pass",
      "notes": "Widok kompletny, akcje widoczne."
    }
  ]
}
```

---

## 6. Zasady dla dynamicznych ekranów

Dla:

```text
/leads/:id
/clients/:id
/cases/:id
```

nie wolno zostawiać `routeActual` jako template.

Poprawnie:

```json
{
  "screenId": "lead-detail",
  "routeTemplate": "/leads/:id",
  "routeActual": "/leads/realny-id-leada",
  "viewportId": "desktop-1440"
}
```

Błędnie:

```json
{
  "screenId": "lead-detail",
  "routeTemplate": "/leads/:id",
  "routeActual": "/leads/:id",
  "viewportId": "desktop-1440"
}
```

---

## 7. Co sprawdza script

Plik:

```text
scripts/check-closeflow-screenshot-qa-evidence.cjs
```

Tryb kontraktu:

```bash
node scripts/check-closeflow-screenshot-qa-evidence.cjs --contract-only
```

Sprawdza, czy:
- dokument VS-8 istnieje,
- lista viewportów jest pełna,
- lista ekranów jest pełna,
- package.json ma script `check:closeflow-screenshot-qa-evidence`,
- nie ma pustego dokumentu zamiast realnego gate’u.

Tryb evidencji:

```bash
npm run check:closeflow-screenshot-qa-evidence
```

Sprawdza, czy:
- istnieje manifest evidencji,
- jest 39 wpisów,
- każdy wymagany route + viewport ma screenshot,
- dynamiczne route’y mają realny `routeActual`,
- każdy plik `.png` istnieje,
- plik nie jest pusty,
- PNG ma szerokość zgodną z viewportem,
- status każdego wpisu to `pass`.

---

## 8. Czego VS-8 nie robi

VS-8 nie generuje screenshotów automatycznie.

Powód: generowanie wymaga działającej aplikacji, danych testowych i poprawnie zalogowanego stanu. Bez tego automat może zrobić screenshot loginu albo pustej strony i dać fałszywe poczucie bezpieczeństwa.

VS-8 dodaje bramkę, która wymaga realnej evidencji. Samo wykonanie screenshotów to kolejny krok QA.

---

## 9. Manualny scenariusz screenshot QA

1. Uruchom aplikację lokalnie albo preview.
2. Przygotuj dane testowe:
   - minimum 1 lead,
   - minimum 1 client,
   - minimum 1 case.
3. Otwórz każdy route z listy.
4. Zrób screenshot dla:
   - 1440px,
   - 1280px,
   - 390px mobile.
5. Zapisz pliki do:

```text
docs/ui/screenshot-qa/2026-05-09/
```

6. Uzupełnij manifest:

```text
docs/ui/screenshot-qa/CLOSEFLOW_SCREENSHOT_QA_EVIDENCE_2026-05-09.json
```

7. Uruchom:

```bash
npm run check:closeflow-screenshot-qa-evidence
```

---

## 10. Kryterium zakończenia VS-8

VS-8 jako etap techniczny jest zakończony, gdy:
- dokument istnieje,
- script istnieje,
- package.json zawiera script,
- tryb `--contract-only` przechodzi,
- build przechodzi.

Screenshot QA jako bramka release jest zielona dopiero wtedy, gdy:
- normalny tryb `npm run check:closeflow-screenshot-qa-evidence` przechodzi,
- czyli istnieją kompletne realne screenshoty.

---

## 11. Powiązanie z VS-7

VS-7 ustalił logiczne sloty położenia akcji.

VS-8 ma dać dowód wizualny, że położenie i zachowanie ekranów nie rozjeżdża się realnie na:
- desktopie,
- ciaśniejszym laptopie,
- telefonie.
