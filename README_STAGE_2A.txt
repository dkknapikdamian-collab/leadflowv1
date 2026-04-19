ETAP 2A — SUPABASE CUTOVER DLA SPRAWY / PORTALU / AKTYWNOŚCI

Co robi ta paczka:
1. Domyka API dla cases:
   - GET
   - POST
   - PATCH
   - DELETE
2. Dodaje API dla:
   - case-items
   - activities
   - client-portal-tokens
3. Przepina:
   - CaseDetail
   - ClientPortal
   - Activity
   na Supabase, gdy VITE_SUPABASE_URL jest ustawione
4. Zostawia Firebase Storage dla uploadu plików jako etap przejściowy
5. Poprawia globalnie SelectTrigger / SelectValue, żeby tekst nie był tak łatwo ucinany

Ważne:
- Najpierw odpal SQL z pliku SUPABASE_SQL_STEP_2A_CASE_PORTAL_ACTIVITY.sql
- Dopiero potem build / commit / push
