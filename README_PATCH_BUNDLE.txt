PATCH BUNDLE — leadflow global dropdown + lead links + settings provider

Co jest w tej paczce:
1. src/components/ui/select.tsx
   - globalna podmiana wspólnego Select na stabilny wrapper oparty o natywny <select>
   - cel: usunąć efekt "otwiera się i od razu zwija / mruga" we wszystkich zakładkach

2. src/pages/LeadDetail.tsx
   - lead pokazuje teraz powiązane zadania i wydarzenia
   - wydarzenia z datą nadal pojawiają się w kalendarzu, a na karcie leada są też widoczne
   - sekcja realizacji pokazuje podpiętą sprawę
   - dodany został przycisk do podpięcia istniejącej sprawy do leada

3. src/lib/supabase-fallback.ts
   - dodany helper updateCaseInSupabase() do przypinania sprawy do leada przez /api/cases PATCH

4. src/main.tsx
   - zawiera spięcie AppearanceProvider, żeby ustawienia nie wywalały error boundary

5. src/components/ui/dialog.tsx
6. src/components/ui/dropdown-menu.tsx
   - dołączone razem, żeby poprzednie poprawki warstw UI były w tej samej paczce

Uwaga:
- Zadania i wydarzenia już miały pola leadId w formularzach. Ta paczka domyka warstwę globalnego Select oraz widoczność tych rekordów przy leadzie.
- Podpinanie sprawy do leada zakłada, że backend /api/cases przyjmuje PATCH z id i leadId.
