# STAGE160 Modal Center and Compact All — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / dialogs / all modals smaller and centered

## Cel

Naprawić wszystkie podokienka:
- mają być mniejsze,
- mają być na środku,
- nie mogą uciekać w lewo/prawo,
- tekst nie może być ucinany,
- footer nie może zasłaniać treści.

## FAKTY

- Stage157 dobrze ustawił skalę głównej aplikacji.
- Stage158/159 nie rozwiązały poprawnie wszystkich modalnych podokienek.
- Screenshot pokazuje „Nowy lead” przesunięty/cropped przy lewej krawędzi.
- Użytkownik potwierdził: wszystkie okna są w ten sposób do poprawy.

## DECYZJE DAMIANA

- Wszystkie podokienka mają być mniejsze i wycentrowane.
- Dotyczy: lead, zadanie, wydarzenie i inne modalne okna.
- Każda poprawka ma mieć osobny guard.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- Problem wynika z mieszania dwóch kontekstów: modale wewnątrz zoomed app i modale portaled poza root.
- Dla modali wewnątrz Stage157 app trzeba użyć inverse center: `50vw * inverse`.
- Dla portali poza root trzeba użyć zwykłego `50vw`.

## Zakres Stage160

Dodaje:
- `src/styles/closeflow-modal-center-and-compact-all-stage160.css`
- `scripts/apply-stage160-modal-center-and-compact-all.cjs`
- `scripts/check-stage160-modal-center-and-compact-all.cjs`
- `docs/ui/CLOSEFLOW_STAGE160_MODAL_CENTER_AND_COMPACT_ALL.md`
- `docs/ui/CLOSEFLOW_STAGE160_RUNTIME_MODAL_CENTER_AUDIT.js`
- `_project/STAGE160_MODAL_CENTER_AND_COMPACT_ALL_REPORT.md`
- aktualizację Obsidiana

Modyfikuje:
- `src/App.tsx`: dodaje import Stage160 po Stage159.

## Testy

```powershell
node scripts/check-stage160-modal-center-and-compact-all.cjs
npm.cmd run build
```

## Testy ręczne

- `/leads` → `+ Lead`
- `/tasks` → `+ Zadanie`
- `/calendar` → `+ Wydarzenie`
- inne okna modalne
- dropdowny/selecty
- sprawdzić, czy dialog jest mniejszy i centered
- sprawdzić, czy tekst nie jest ucięty
- sprawdzić, czy footer nie zasłania treści

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
