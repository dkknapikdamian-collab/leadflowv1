# FORTECA 010 — BROWSER PROOF

Reference: `010_lead_detail.webp` (147160 bytes)
Implementation commit: pending 010 batch
Route: `/leads/:leadId` active lead preview
Build: TSC PASS

Steps:
1. Navigate `/leads` -> click active lead row -> `/leads/:leadId`
2. Header: Back Leady link, name+firma, status pill once `lead-detail-pill-green`, value 1 PLN, primary contextual Ustaw kolejny krok / Rozpocznij obsługę / Otwórz sprawę per lead state, secondary Edytuj, overflow ...
3. Left EntityContactCard compact: email, phone, firma, ostatnia aktualizacja — no duplicated identity
4. Decision cards 4-up: Następny krok, Potencjał, Cisza/ryzyko, Blokada — tones reuse foundation semantic colors, radius 16
5. Center: Notes modal trigger, Zadania i wydarzenia timeline, Historia kontaktu capped 5
6. Right rail: Upcoming actions 5, quick actions note/task/event/brak wired via ContextActionDialogs host, finance rail if relation exists
7. No horizontal scroll, responsive 1 col at 640

Comparison: hierarchy/spacing/density PASS, subtle borders #E5EAF2, restrained blue primary only on primary CTA, header actions max 1 primary+1-2 secondary PASS, ignore generated copy detail — functional truth retained.

Result: PASS reuse 001 foundation + LeadDetail local layout owners
