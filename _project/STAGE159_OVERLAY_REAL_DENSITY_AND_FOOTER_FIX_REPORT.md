# STAGE159 Overlay Real Density and Footer Fix — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / dialogs / modals / footer / no dialog zoom

## Cel

Poprawić podokienka po Stage158:
- „Zaplanuj wydarzenie” nie może przeskakiwać w prawo.
- „Nowy lead” i „Nowe zadanie” nie mogą ucinać tekstu.
- Pasek akcji z „Zaplanuj” ma być na dole i nie zasłaniać treści.
- Lead/task najlepiej bez zbędnego scrollowania.

## FAKTY

- Stage157 ustawił główną aplikację jak widok 80%.
- Stage158 próbował skalować portale przez `zoom`.
- `zoom` na portaled dialog content może zaburzać pozycjonowanie i scroll/stopkę.
- Screenshot pokazuje problem w modalach „Zaplanuj wydarzenie” i „Nowy lead”.

## DECYZJE DAMIANA

- Poprawić wszystkie podokienka, nie tylko jeden przykład.
- Zadania i leady najlepiej bez koniecznego scrollowania.
- Event footer nie może zasłaniać treści.
- Każda poprawka ma mieć guard.

## HIPOTEZY AI

- Lepszy kierunek: wyłączyć zoom na dialogach i użyć realnych density tokens.
- Overlay/backdrop powinien zostać pełnoekranowy.
- Footer/action row trzeba wymusić jako ostatni element w flex-flow formularza, żeby nie przykrywał tekstu.

## Zakres Stage159

Dodaje:
- `src/styles/closeflow-overlay-real-density-and-footer-stage159.css`
- `scripts/apply-stage159-overlay-real-density-and-footer.cjs`
- `scripts/check-stage159-overlay-real-density-and-footer.cjs`
- `docs/ui/CLOSEFLOW_STAGE159_OVERLAY_REAL_DENSITY_AND_FOOTER_FIX.md`
- `docs/ui/CLOSEFLOW_STAGE159_RUNTIME_OVERLAY_FOOTER_AUDIT.js`
- `_project/STAGE159_OVERLAY_REAL_DENSITY_AND_FOOTER_FIX_REPORT.md`
- aktualizację Obsidiana

Modyfikuje:
- `src/App.tsx`: import Stage159 po Stage158.

## Testy

```powershell
node scripts/check-stage159-overlay-real-density-and-footer.cjs
npm.cmd run build
```

## Testy ręczne

- `/leads` → `+ Lead`
- `/calendar` → `+ Wydarzenie`
- `/tasks` → `+ Zadanie`
- sprawdzić dropdowny i selecty w modalach
- sprawdzić, czy footer nie zasłania pól
- sprawdzić, czy lead/task nie mają zbędnego scrolla

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
