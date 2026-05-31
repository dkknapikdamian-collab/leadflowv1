# CloseFlow Stage169 — Topic Contact Picker Readable + Task Guard

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / modal source picker / task relation guard

## FAKTY

- Problem: wybór źródła/powiązania w modalach jest niewidoczny albo źle kontrastuje.
- Wspólny komponent: `src/components/topic-contact-picker.tsx`.
- `TopicContactPicker` ma label `Powiąż z tematem lub kontaktem`.
- `Tasks.tsx` używa `TopicContactPicker` dla formularzy zadania.

## DECYZJE DAMIANA

- Poprawić widoczność wyboru źródła.
- W zadaniu ma być ta sama opcja powiązania jak w wydarzeniu.
- Każda poprawka ma mieć guard.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- Problem wynika z walki Stage165 dark modal motif z białymi dropdownami/opcjami.
- Dodać jawne data-markery do `TopicContactPicker`.
- Guard ma pilnować czytelności CSS i obecności pickerów w `Tasks.tsx`.

## TESTY

```powershell
node scripts/check-stage169-topic-contact-picker-readable.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić dropdowny źródła w `+ Lead`, `+ Zadanie`, `+ Wydarzenie`.
