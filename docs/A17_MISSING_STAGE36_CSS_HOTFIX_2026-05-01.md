# A17 — hotfix brakującego pliku CSS Stage36

## Cel

Naprawić błąd buildu Vercel:

```text
Can't resolve './styles/stage36-unified-light-pages.css' in '/vercel/path0/src'
```

## Przyczyna

`src/index.css` importuje `./styles/stage36-unified-light-pages.css`, ale plik nie trafił do commita. Lokalny build przeszedł, bo plik istniał lokalnie jako nieśledzony plik. Vercel buduje z czystego klona GitHub, więc nie miał tego pliku.

## Zakres

- Dodano `src/styles/stage36-unified-light-pages.css` do repo.
- Nie zmieniono logiki aplikacji.
- Nie zmieniono typów.
- Nie zmieniono routingu.

## Walidacja

Po wdrożeniu skrypt uruchamia:

```powershell
npm.cmd run check:a13-critical-regressions
npm.cmd run build
```

## Kryterium zakończenia

Vercel nie zatrzymuje się na braku `stage36-unified-light-pages.css`.
