# STAGE16O - Final QA AI + collector repair

Cel: naprawić pozostałe czerwone testy po Stage16M bez cofania security i UI truth.

Zakres:
- billing diagnostics nie może wyciekać do customer-facing Billing source,
- AI assistant zachowuje legacy/static release markers, ale nie tworzy final leadów bez zatwierdzenia,
- GlobalAiAssistant zachowuje kontrakt kontekstu dla starych testów,
- collector działa na Windows przez `npm.cmd` i `process.execPath`, bez `exit=null`.

Bez commita. Bez pusha.
