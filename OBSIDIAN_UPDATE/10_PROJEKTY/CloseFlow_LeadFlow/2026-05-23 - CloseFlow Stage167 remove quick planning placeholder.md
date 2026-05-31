# CloseFlow Stage167 — Remove Quick Planning Placeholder

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / modal copy cleanup / placeholder removal

## FAKTY

- Stage166 został zastosowany lokalnie i build przeszedł.
- W modalnym formularzu widoczny jest placeholder `Szybkie planowanie`.
- Treść mówi o osobnym flow i o tym, że etap nie udaje funkcji.

## DECYZJE DAMIANA

- Kasujemy ten blok.
- Nie ukrywamy tylko wizualnie, usuwamy z kodu.
- Każda poprawka ma mieć guard.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- To jest tekst wewnętrzny/deweloperski, nie produkcyjny komunikat.
- Guard powinien skanować `src` po frazach placeholdera.

## TESTY

```powershell
node scripts/check-stage167-remove-quick-planning-placeholder.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić `+ Lead`, `+ Wydarzenie`, `+ Zadanie`.
