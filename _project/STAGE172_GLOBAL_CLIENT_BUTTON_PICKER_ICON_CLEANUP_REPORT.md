# STAGE172 Global Client Button + Picker Icon Cleanup — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / global quick actions / client create dialog / topic-contact picker

## Cel

Wykonać trzy poprawki:
- poprawić albo usunąć lupkę w polu `Powiąż z tematem lub kontaktem`,
- dodać globalny przycisk `+ Klient` obok `+ Lead`, `+ Zadanie`, `+ Wydarzenie`,
- zrobić okno klienta w tym samym źródle prawdy wizualnej co lead, z opcją dodania sprawy od razu.

## FAKTY

- Stage171 został zastosowany lokalnie i build przeszedł.
- Globalne szybkie akcje są w `src/components/GlobalQuickActions.tsx`.
- Obecny globalny pasek ma `Lead`, `Zadanie`, `Wydarzenie`.
- Picker powiązań jest w `src/components/topic-contact-picker.tsx`.
- `createClientInSupabase` i `createCaseInSupabase` są dostępne w `src/lib/supabase-fallback.ts`.

## DECYZJE DAMIANA

- Lupkę poprawić albo skasować. Stage172 kasuje ją z pickera, bo wizualnie przeszkadza.
- Dodać `+ Klient` obok istniejących przycisków.
- Okno klienta ma mieć ten sam motyw/source truth co lead.
- W oknie klienta ma być od razu opcja dodania sprawy.
- Każda poprawka ma mieć guard.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- Najbezpieczniej usunąć ikonę z `TopicContactPicker`, bo ikonę zastąpi placeholder i jasne pole.
- Globalny `+ Klient` powinien działać lokalnie w pasku, bez przełączania trasy.
- Nowy `ClientCreateDialog` powinien reużyć `lead-form-vnext`, żeby nie tworzyć kolejnej odnogi wizualnej.
- Opcja tworzenia sprawy powinna być checkboxem, żeby użytkownik decydował, czy tworzyć case od razu.

## Pliki

- `src/components/ClientCreateDialog.tsx`
- `src/components/GlobalQuickActions.tsx`
- `src/components/topic-contact-picker.tsx`
- `src/styles/closeflow-global-client-create-dialog-stage172.css`
- `scripts/apply-stage172-global-client-button-picker-icon-cleanup.cjs`
- `scripts/check-stage172-global-client-button-picker-icon-cleanup.cjs`
- `docs/ui/CLOSEFLOW_STAGE172_GLOBAL_CLIENT_BUTTON_PICKER_ICON_CLEANUP.md`
- `docs/ui/CLOSEFLOW_STAGE172_RUNTIME_GLOBAL_CLIENT_AND_PICKER_AUDIT.js`
- `_project/STAGE172_GLOBAL_CLIENT_BUTTON_PICKER_ICON_CLEANUP_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage172 global client button and picker icon cleanup.md`

## Testy automatyczne

```powershell
node scripts/check-stage172-global-client-button-picker-icon-cleanup.cjs
npm.cmd run build
```

## Testy ręczne

- Globalny pasek: czy widać `+ Klient` obok `+ Lead`, `+ Zadanie`, `+ Wydarzenie`.
- Klik `+ Klient`: otwiera modal `Nowy klient`.
- Modal klienta: wygląda jak lead, bez osobnej stylistycznej wyspy.
- Checkbox `Dodaj sprawę od razu`: po zaznaczeniu pokazuje pola sprawy.
- `TopicContactPicker`: brak lupki nachodzącej na tekst, tekst zaczyna się normalnie.
- Regresja: `+ Lead`, `+ Zadanie`, `+ Wydarzenie`.

## Czego nie ruszano

- deploy
- push
- auth
- Supabase schema
- Google Calendar
- Stripe
- AI
