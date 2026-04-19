ETAP 2B — hotfix notatek leada + usuwanie wpisów z kalendarza + mniej agresywne ucinanie tekstu

Pliki w paczce:
- api/activities.ts
- src/pages/LeadDetail.tsx
- src/pages/Calendar.tsx
- src/components/ui/select.tsx

Zakres:
1. Notatka dodana przy leadzie zapisuje się do aktywności Supabase i od razu wraca na ekran.
2. Kalendarz ma akcję Usuń dla taska, wydarzenia i wpisu leadowego.
3. Leadowy wpis w kalendarzu przy usuwaniu czyści next step i nextActionAt, nie usuwa całego leada.
4. Select ma pełną szerokość i lepsze zachowanie przy dłuższym tekście.
5. W kilku krytycznych miejscach usunięto agresywne truncate i dodano break-words.
