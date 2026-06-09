# Obsidian update — STAGE231D_R8_GOOGLE_LOGIN_UID_WORKSPACE_HARD_GATE

Dopisać do CloseFlow / LeadFlow:
- R6 po pushu i deployu nadal przepuszczał Google Login dla kont bez intencjonalnej rejestracji.
- R8 zaostrza warunek: Google Login wymaga profilu powiązanego z aktualnym Supabase UID oraz workspace/membership.
- Dopasowanie profilu tylko po emailu nie wystarcza do Google Login.
- Rejestracja Google pozostaje ścieżką tworzenia profilu/workspace.
