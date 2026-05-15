import { type ReactNode } from 'react';
import "../styles/context-action-button-source-truth.css";

export type ContextActionKind = "task" | "event" | "note" | string;
export type ContextRecordType = "lead" | "client" | "case" | string;

export type ContextActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  kind?: ContextActionKind;
  actionKind?: ContextActionKind;
  recordType?: ContextRecordType;
  recordId?: string | null;
  clientId?: string | null;
  leadId?: string | null;
  caseId?: string | null;
  recordLabel?: string | null;
  label?: React.ReactNode;
  text?: React.ReactNode;
};

const defaultLabelByKind: Record<string, string> = {
  task: "Dodaj zadanie",
  event: "Dodaj wydarzenie",
  note: "Dodaj notatkę",
};

export function ContextActionButton({
  kind,
  actionKind,
  recordType,
  recordId,
  clientId,
  leadId,
  caseId,
  recordLabel,
  label,
  text,
  className = "",
  children,
  type = "button",
  ...props
}: ContextActionButtonProps) {
  const resolvedKind = String(kind ?? actionKind ?? "action");
  const content = children ?? label ?? text ?? defaultLabelByKind[resolvedKind] ?? "Akcja";
  const classes = ["context-action-button", "context-action-button--" + resolvedKind, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      data-context-action-kind={resolvedKind}
      data-context-record-type={recordType ?? undefined}
      data-context-record-id={recordId ?? undefined}
      data-context-client-id={clientId ?? undefined}
      data-context-lead-id={leadId ?? undefined}
      data-context-case-id={caseId ?? undefined}
      data-context-record-label={recordLabel ?? undefined}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
}

export default ContextActionButton;
