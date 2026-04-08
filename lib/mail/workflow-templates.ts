export type WorkflowNotificationKind =
  | "operator_client_inactive"
  | "operator_client_uploaded_file"
  | "operator_verification_required"
  | "operator_case_ready_to_start"
  | "operator_case_blocked"
  | "client_link_sent"
  | "client_missing_items_reminder"
  | "client_due_soon"
  | "client_decision_required"

export interface WorkflowEmailTemplateInput {
  kind: WorkflowNotificationKind
  title: string
  body: string
  recipientName?: string | null
}

export function buildWorkflowEmailTemplate(input: WorkflowEmailTemplateInput) {
  const greeting = input.recipientName?.trim() ? `Czesc ${input.recipientName.trim()},` : "Czesc,"
  const subject = input.title
  const text = `${greeting}\n\n${input.body}\n\nTo automatyczne powiadomienie z ClientPilot.`
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
      <p>${greeting}</p>
      <p>${input.body}</p>
      <p style="color:#64748b;font-size:13px;">To automatyczne powiadomienie z ClientPilot.</p>
    </div>
  `

  return { subject, text, html }
}
