# STAGE169 Topic Contact Picker Readable + Task Guard — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / modal source picker / task relation guard

## Cel

Naprawić problem:
- przy wyborze źródła/powiązania w modalnych panelach nic nie widać,
- prawdopodobnie biały tekst na białym tle,
- w zadaniu ma być ta sama opcja powiązania co w wydarzeniu.

## FAKTY

- Wspólny komponent pola to `src/components/topic-contact-picker.tsx`.
- Komponent ma domyślny label `Powiąż z tematem lub kontaktem`.
- Komponent ma domyślny placeholder `Wpisz lead, klienta, sprawę, e-mail lub telefon`.
- `src/pages/Tasks.tsx` importuje `TopicContactPicker`.
- `Tasks.tsx` używa `TopicContactPicker` w formularzu nowego i edycji zadania.
- Problem jest najpewniej kolorem dropdown/options po Stage165 dark modal motif.

## DECYZJE DAMIANA

- Poprawić widoczność wyboru źródła/powiązania.
- Zadanie ma mieć taką samą opcję powiązania jak wydarzenie.
- Każda poprawka ma mieć guard.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- Najbezpieczniej dodać jawne data-markery do `TopicContactPicker`.
- CSS powinien być celowany w `[data-topic-contact-picker-*]`, nie w losowe inputy.
- Native `select option` też trzeba zabezpieczyć na biały panel + ciemny tekst.

## Pliki

- `src/components/topic-contact-picker.tsx`
- `src/styles/closeflow-topic-contact-picker-readable-stage169.css`
- `scripts/apply-stage169-topic-contact-picker-readable.cjs`
- `scripts/check-stage169-topic-contact-picker-readable.cjs`
- `docs/ui/CLOSEFLOW_STAGE169_TOPIC_CONTACT_PICKER_READABLE_AND_TASK_GUARD.md`
- `docs/ui/CLOSEFLOW_STAGE169_RUNTIME_TOPIC_CONTACT_PICKER_AUDIT.js`
- `_project/STAGE169_TOPIC_CONTACT_PICKER_READABLE_AND_TASK_GUARD_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage169 topic contact picker readable and task guard.md`

## Testy automatyczne

```powershell
node scripts/check-stage169-topic-contact-picker-readable.cjs
npm.cmd run build
```

## Testy ręczne

- `/leads` → `+ Lead` → kliknij `Powiąż z tematem lub kontaktem`
- `/tasks` → `+ Zadanie` → kliknij `Powiąż z tematem lub kontaktem`
- `/calendar` → `+ Wydarzenie` → kliknij `Powiąż z tematem lub kontaktem`

Sprawdzić:
- input ma ciemny tekst na białym tle,
- lista opcji ma biały panel i ciemny tekst,
- opcje są czytelne przy hover,
- Zadanie nadal ma `TopicContactPicker`.

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
