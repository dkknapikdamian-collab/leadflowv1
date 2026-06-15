import React from 'react';
import {
  MISSING_ITEM_KIND_LABELS,
  MISSING_ITEM_MODAL_COPY,
  MISSING_ITEM_MODAL_FIELDS,
  MISSING_ITEM_QUICK_ACTION_LABEL,
  type MissingItemKind,
  type MissingItemModalContext,
} from '../../lib/missing-items/stage227c2-missing-item-modal-contract';

export const STAGE227C2_MISSING_ITEM_MODAL_COMPONENT =
  'Stage227C2 shared Brak modal component is small, required-title only, no SQL and no checklist';

export const STAGE232A_R4_MISSING_ITEM_MODAL_BLOCKER_FIELDS =
  'MissingItemQuickActionModal exposes missingKind, blocksProgress and blockScope so Brak and Blokada are explicit';

export interface MissingItemQuickActionModalProps {
  open: boolean;
  context: MissingItemModalContext;
  titleValue: string;
  noteValue: string;
  missingKindValue: MissingItemKind;
  blocksProgressValue: boolean;
  blockScopeValue: string;
  error?: string;
  isSaving?: boolean;
  onTitleChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onMissingKindChange: (value: MissingItemKind) => void;
  onBlocksProgressChange: (value: boolean) => void;
  onBlockScopeChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function MissingItemQuickActionModal(props: MissingItemQuickActionModalProps) {
  if (!props.open) {
    return null;
  }

  const titleField = MISSING_ITEM_MODAL_FIELDS.find((field) => field.name === 'title');
  const kindField = MISSING_ITEM_MODAL_FIELDS.find((field) => field.name === 'missingKind');
  const blockScopeField = MISSING_ITEM_MODAL_FIELDS.find((field) => field.name === 'blockScope');
  const noteField = MISSING_ITEM_MODAL_FIELDS.find((field) => field.name === 'note');

  return (
    <div className="missing-item-modal-backdrop" data-stage227c2-missing-item-modal="true" data-stage232a-missing-blocker-modal="true" role="presentation">
      <section className="missing-item-modal-card" role="dialog" aria-modal="true" aria-label={MISSING_ITEM_MODAL_COPY.title}>
        <header className="missing-item-modal-header">
          <p className="missing-item-modal-kicker">{MISSING_ITEM_QUICK_ACTION_LABEL}</p>
          <h2>{MISSING_ITEM_MODAL_COPY.title}</h2>
          <p>{props.context.entityLabel}</p>
        </header>

        <label className="missing-item-modal-field">
          <span>{titleField?.label}</span>
          <input
            value={props.titleValue}
            onChange={(event) => props.onTitleChange(event.target.value)}
            placeholder={titleField?.placeholder}
            aria-invalid={Boolean(props.error)}
            required
          />
        </label>

        <label className="missing-item-modal-field">
          <span>{kindField?.label}</span>
          <select value={props.missingKindValue} onChange={(event) => props.onMissingKindChange(event.target.value as MissingItemKind)}>
            {Object.entries(MISSING_ITEM_KIND_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="missing-item-modal-field missing-item-modal-checkbox" data-stage232a-blocks-progress-field="true">
          <input
            type="checkbox"
            checked={props.blocksProgressValue}
            onChange={(event) => props.onBlocksProgressChange(event.target.checked)}
          />
          <span>{MISSING_ITEM_MODAL_COPY.blocksProgressLabel}</span>
        </label>

        {props.blocksProgressValue ? (
          <label className="missing-item-modal-field">
            <span>{blockScopeField?.label}</span>
            <input
              value={props.blockScopeValue}
              onChange={(event) => props.onBlockScopeChange(event.target.value)}
              placeholder={blockScopeField?.placeholder}
            />
          </label>
        ) : null}

        <label className="missing-item-modal-field">
          <span>{noteField?.label}</span>
          <textarea
            value={props.noteValue}
            onChange={(event) => props.onNoteChange(event.target.value)}
            placeholder={noteField?.placeholder}
            rows={3}
          />
        </label>

        {props.error ? <p className="missing-item-modal-error">{props.error}</p> : null}

        <footer className="missing-item-modal-actions">
          <button type="button" onClick={props.onCancel}>
            {MISSING_ITEM_MODAL_COPY.cancel}
          </button>
          <button type="button" onClick={props.onSubmit} disabled={props.isSaving}>
            {MISSING_ITEM_MODAL_COPY.submit}
          </button>
        </footer>
      </section>
    </div>
  );
}
