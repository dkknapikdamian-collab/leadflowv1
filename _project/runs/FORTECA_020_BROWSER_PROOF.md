# FORTECA 020 — BROWSER PROOF
Reference: 020_lead_start_case.webp
Route: /leads/:leadId modal Rozpocznij obsługę
Trigger: Rozpocznij obsługę primary -> LeadStartServiceDialog
Steps: Click Rozpocznij obsługę -> Dialog client name/email/phone, title, Template select, status ready_to_start, submit -> lead-case-handoff startLeadToCaseHandoff -> create case + migrate lead -> navigate /cases/:newCaseId, cancel closes, error toast
Visual: modal via closeflow-dialogs.css PASS
