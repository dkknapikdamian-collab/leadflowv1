import React from 'react';
import {
  MISSING_ITEM_KIND_LABELS,
  MISSING_ITEM_MODAL_COPY,
  MISSING_ITEM_MODAL_FIELDS,
  MISSING_ITEM_QUICK_ACTION_LABEL,
  type MissingItemKind,
  type MissingItemModalContext,
} from '../../lib/missing-items/stage227c2-missing-item-modal-contract';
import '../../styles/visual-stage20-lead-form-vnext.css';
import '../../styles/stage232a-missing-item-visual-source.css';

export const STAGE227C2_MISSING_ITEM_MODAL_COMPONENT =
  'Stage227C2 shared Brak modal component is small, required-title only, no SQL and no checklist';

export const STAGE232A_R4_MISSING_ITEM_MODAL_BLOCKER_FIELDS =
  'MissingItemQuickActionModal exposes missingKind, blocksProgress and blockScope so Brak and Blokada are explicit';

export const STAGE232A_R5_MISSING_ITEM_MODAL_VISUAL_SOURCE_TRUTH =
  'MissingItemQuickActionModal reuses lead-form-vnext visual source of truth from quick lead creation';

export const STAGE232A_R10_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_TRUTH =
  'MissingItemQuickActionModal uses the same quick-lead visual shell tokens: dark modal surface, lead-form sections, white inputs, sticky footer and consistent buttons';

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
    <div className="missing-item-modal-backdrop" data-stage227c2-missing-item-modal="true" data-stage232a-missing-blocker-modal="true" data-stage232a-missing-visual-source="lead-form-vnext" data-stage232a-r10-missing-modal-visual-source="quick-lead-form" role="presentation">
      <section className="missing-item-modal-card lead-form-vnext-content" data-stage232a-r10-missing-modal-card="true" role="dialog" aria-modal="true" aria-labelledby="missing-item-modal-title" aria-describedby="missing-item-modal-description">
        <header className="missing-item-modal-header lead-form-vnext-header">
          <span className="lead-form-vnext-kicker">{MISSING_ITEM_QUICK_ACTION_LABEL}</span>
          <h2 id="missing-item-modal-title">{MISSING_ITEM_MODAL_COPY.title}</h2>
          <p id="missing-item-modal-description">{props.context.entityLabel}</p>
        </header>

        <form
          className="missing-item-modal-form lead-form-vnext"
          data-stage232a-missing-visual-form="lead-form-vnext"
          onSubmit={(event) => {
            event.preventDefault();
            props.onSubmit();
          }}
        >
          <section className="lead-form-section lead-form-primary-section">
            <div className="lead-form-grid">
              <label className="missing-item-modal-field lead-form-field lead-form-field-wide">
                <span>{titleField?.label}</span>
                <input
                  value={props.titleValue}
                  onChange={(event) => props.onTitleChange(event.target.value)}
                  placeholder={titleField?.placeholder}
                  aria-invalid={Boolean(props.error)}
                  required
                />
              </label>

              <label className="missing-item-modal-field lead-form-field lead-form-field-wide">
                <span>{kindField?.label}</span>
                <select className="lead-form-select" value={props.missingKindValue} onChange={(event) => props.onMissingKindChange(event.target.value as MissingItemKind)}>
                  {Object.entries(MISSING_ITEM_KIND_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>

              <label className="missing-item-modal-checkbox lead-form-checkbox" data-stage232a-blocks-progress-field="true">
                <input
                  type="checkbox"
                  checked={props.blocksProgressValue}
                  onChange={(event) => props.onBlocksProgressChange(event.target.checked)}
                />
                <span>
                  <strong>{MISSING_ITEM_MODAL_COPY.blocksProgressLabel}</strong>
                  <small>Oznacz tylko wtedy, gdy brak realnie zatrzymuje następny krok.</small>
                </span>
              </label>

              {props.blocksProgressValue ? (
                <label className="missing-item-modal-field lead-form-field lead-form-field-wide">
                  <span>{blockScopeField?.label}</span>
                  <input
                    value={props.blockScopeValue}
                    onChange={(event) => props.onBlockScopeChange(event.target.value)}
                    placeholder={blockScopeField?.placeholder}
                  />
                </label>
              ) : null}

              <label className="missing-item-modal-field lead-form-field lead-form-field-wide">
                <span>{noteField?.label}</span>
                <textarea
                  className="lead-form-textarea"
                  value={props.noteValue}
                  onChange={(event) => props.onNoteChange(event.target.value)}
                  placeholder={noteField?.placeholder}
                  rows={3}
                />
              </label>
            </div>
          </section>

          {props.error ? <p className="missing-item-modal-error">{props.error}</p> : null}

          <footer className="missing-item-modal-actions lead-form-footer">
            <button type="button" className="missing-item-modal-secondary-action" onClick={props.onCancel}>
              {MISSING_ITEM_MODAL_COPY.cancel}
            </button>
            <button type="submit" className="missing-item-modal-primary-action" disabled={props.isSaving}>
              {props.isSaving ? 'Zapisywanie...' : MISSING_ITEM_MODAL_COPY.submit}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
