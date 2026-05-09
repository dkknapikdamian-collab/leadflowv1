# CloseFlow client/case/lead settlement dynamic v31

Status: guard finalizer after V29/V30.

Cel:
- nie resetowaÄ‡ zmian V29/V30,
- naprawiÄ‡ uszkodzony check `check-closeflow-supabase-fallback-named-exports-v1.cjs`,
- utrzymaÄ‡ dynamiczne rozliczenie lead/sprawa/klient,
- przejĹ›Ä‡ TypeScript audit i build przed commitem.

Zakres:
- `LeadDetail.tsx`: dynamiczne rozliczenie i `updateCaseInSupabase`,
- `Clients.tsx`: wartoĹ›Ä‡ relacji/sprawy, nie sama wpĹ‚ata,
- `CaseDetail.tsx`: wartoĹ›Ä‡ sprawy z expected revenue albo paid + remaining,
- guard supabase-fallback: bounded import declarations + usuwanie komentarzy w importach.
