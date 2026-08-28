import React from 'react';
import {
  MISSING_ITEM_KIND_LABELS,
  MISSING_ITEM_MODAL_COPY,
  MISSING_ITEM_MODAL_FIELDS,
  type MissingItemKind,
  type MissingItemModalContext,
  type MissingItemPriority,
} from '../../lib/missing-items/stage227c2-missing-item-modal-contract';

export const STAGE227C2_MISSING_ITEM_MODAL_COMPONENT =
  'Stage227C2 shared Brak modal component owns the real FRT-017 missing/blocker form; it does not own persistence';

export const STAGE232A_R4_MISSING_ITEM_MODAL_BLOCKER_FIELDS =
  'MissingItemQuickActionModal exposes missingKind, priority, dueDate, blocksProgress and blockScope for the shared blocker contract';

export const STAGE232A_R5_MISSING_ITEM_MODAL_VISUAL_SOURCE_TRUTH =
  'FRT-017 MissingItemQuickActionModal uses the canonical Forteca calm-light dialog source of truth';

export const STAGE232A_R10_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_TRUTH =
  'Compatibility marker retained; FRT-017 owns the current calm-light visual source for the real blocker dialog';

export const STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR =
  'Historical light/dark screenshot interpretation is superseded by the current FRT-017 reference and semantic VST tokens';

export const STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE =
  'Historical dark modal decision is deprecated; FRT-017 uses the current light reference and canonical VST surface tokens';

export const STAGE232A_R11_R1_MISSING_MODAL_CONST_ANCHOR_FIX =
  'Compatibility marker retained while FRT-017 supersedes the historical screenshot interpretation';

export interface MissingItemQuickActionModalProps {
  open: boolean;
  context: MissingItemModalContext;
  titleValue: string;
  noteValue: string;
  missingKindValue: MissingItemKind | '';
  priorityValue: MissingItemPriority | '';
  dueDateValue: string;
  blocksProgressValue: boolean;
  blockScopeValue: string;
  error?: string;
  isSaving?: boolean;
  onTitleChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onMissingKindChange: (value: MissingItemKind | '') => void;
  onPriorityChange: (value: MissingItemPriority | '') => void;
  onDueDateChange: (value: string) => void;
  onBlocksProgressChange: (value: boolean) => void;
  onBlockScopeChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function MissingItemQuickActionModal(props: MissingItemQuickActionModalProps) {
  if (!props.open) return null;

  const titleField = MISSING_ITEM_MODAL_FIELDS.find((field) => field.name === 'title');
  const kindField = MISSING_ITEM_MODAL_FIELDS.find((field) => field.name === 'missingKind');
  const priorityField = MISSING_ITEM_MODAL_FIELDS.find((field) => field.name === 'priority');
  const dueDateField = MISSING_ITEM_MODAL_FIELDS.find((field) => field.name === 'dueDate');
  const blockScopeField = MISSING_ITEM_MODAL_FIELDS.find((field) => field.name === 'blockScope');
  const noteField = MISSING_ITEM_MODAL_FIELDS.find((field) => field.name === 'note');

  return (
    <div
      className="cf-vst-overlay forteca-frt-017-overlay"
      data-forteca-frt-017-lead-blocker="true"
      data-stage227c2-missing-item-modal="true"
      data-stage232a-missing-blocker-modal="true"
      role="presentation"
    >
      <section
        className="cf-vst-dialog forteca-frt-017-dialog"
        data-cf-vst-dialog="true"
        data-forteca-frt-017-modal="true"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forteca-frt-017-title"
        aria-describedby="forteca-frt-017-description"
      >
        <header className="forteca-frt-017-header">
          <div className="forteca-frt-017-title-block">
            <h2 id="forteca-frt-017-title">{MISSING_ITEM_MODAL_COPY.title}</h2>
            <p id="forteca-frt-017-description">{MISSING_ITEM_MODAL_COPY.subtitle}</p>
            <span hidden data-forteca-frt-017-context="true">
              Powiązane z: <strong>{props.context.entityLabel}</strong>
            </span>
          </div>
          <button
            type="button"
            className="cf-vst-dialog-close forteca-frt-017-close"
            aria-label="Zamknij"
            onClick={props.onCancel}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <form
          className="forteca-frt-017-form"
          data-forteca-frt-017-form="true"
          onSubmit={(event) => {
            event.preventDefault();
            props.onSubmit();
          }}
        >
          <div className="forteca-frt-017-scroll-area">
            <div className="forteca-frt-017-grid">
              <label className="forteca-frt-017-field forteca-frt-017-field--full" htmlFor="forteca-frt-017-title-input">
                <span>{titleField?.label} <em aria-hidden="true">*</em></span>
                <input
                  id="forteca-frt-017-title-input"
                  name="missing-title"
                  value={props.titleValue}
                  onChange={(event) => props.onTitleChange(event.target.value)}
                  placeholder={titleField?.placeholder}
                  aria-invalid={Boolean(props.error)}
                  autoFocus
                  required
                />
                <small>{MISSING_ITEM_MODAL_COPY.titleHelp}</small>
              </label>

              <label className="forteca-frt-017-field forteca-frt-017-field--full" htmlFor="forteca-frt-017-category-input">
                <span>{kindField?.label} <em aria-hidden="true">*</em></span>
                <select
                  id="forteca-frt-017-category-input"
                  name="missing-category"
                  value={props.missingKindValue}
                  onChange={(event) => props.onMissingKindChange(event.target.value as MissingItemKind | '')}
                  required
                >
                  <option value="" disabled>Wybierz kategorię</option>
                  {Object.entries(MISSING_ITEM_KIND_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <small>{MISSING_ITEM_MODAL_COPY.categoryHelp}</small>
              </label>

              <label className="forteca-frt-017-field forteca-frt-017-field--full" htmlFor="forteca-frt-017-description-input">
                <span>{noteField?.label} <em aria-hidden="true">*</em></span>
                <textarea
                  id="forteca-frt-017-description-input"
                  name="missing-description"
                  value={props.noteValue}
                  onChange={(event) => props.onNoteChange(event.target.value)}
                  placeholder={noteField?.placeholder}
                  rows={3}
                  required
                />
                <small>{MISSING_ITEM_MODAL_COPY.noteHelp}</small>
              </label>

              <label className="forteca-frt-017-field" htmlFor="forteca-frt-017-priority-input">
                <span>{priorityField?.label} <em aria-hidden="true">*</em></span>
                <select
                  id="forteca-frt-017-priority-input"
                  name="missing-priority"
                  value={props.priorityValue}
                  onChange={(event) => props.onPriorityChange(event.target.value as MissingItemPriority | '')}
                  required
                >
                  <option value="" disabled>Wybierz poziom</option>
                  <option value="high">Wysoki</option>
                  <option value="medium">Średni</option>
                  <option value="low">Niski</option>
                </select>
                <small>{MISSING_ITEM_MODAL_COPY.priorityHelp}</small>
              </label>

              <div className="forteca-frt-017-field forteca-frt-017-capability-field">
                <label htmlFor="forteca-frt-017-responsible-input">
                  <span>{MISSING_ITEM_MODAL_COPY.responsibleLabel} <em aria-hidden="true">*</em></span>
                  <select id="forteca-frt-017-responsible-input" name="missing-responsible" disabled aria-describedby="forteca-frt-017-responsible-help">
                    <option>Brak przypisania</option>
                  </select>
                </label>
                <small id="forteca-frt-017-responsible-help">{MISSING_ITEM_MODAL_COPY.unsupportedResponsible}</small>
              </div>

              <label className="forteca-frt-017-field" htmlFor="forteca-frt-017-due-date-input">
                <span>{dueDateField?.label} <em aria-hidden="true">*</em></span>
                <input
                  id="forteca-frt-017-due-date-input"
                  name="missing-due-date"
                  type="date"
                  value={props.dueDateValue}
                  onChange={(event) => props.onDueDateChange(event.target.value)}
                  aria-invalid={Boolean(props.error && !props.dueDateValue)}
                  required
                />
                <small>{MISSING_ITEM_MODAL_COPY.dueDateHelp}</small>
              </label>

              <div className="forteca-frt-017-field forteca-frt-017-switch-field">
                <label className="forteca-frt-017-switch" htmlFor="forteca-frt-017-blocking-input">
                  <input
                    id="forteca-frt-017-blocking-input"
                    name="missing-blocking"
                    type="checkbox"
                    checked={props.blocksProgressValue}
                    onChange={(event) => props.onBlocksProgressChange(event.target.checked)}
                  />
                  <span className="forteca-frt-017-switch-track" aria-hidden="true"><span /></span>
                  <span>{MISSING_ITEM_MODAL_COPY.blocksProgressLabel}</span>
                </label>
                <small>{MISSING_ITEM_MODAL_COPY.blocksProgressHelp}</small>
              </div>

              <div className="forteca-frt-017-field forteca-frt-017-field--full forteca-frt-017-switch-field">
                <label className="forteca-frt-017-switch forteca-frt-017-switch--disabled" htmlFor="forteca-frt-017-client-decision-input">
                  <input
                    id="forteca-frt-017-client-decision-input"
                    name="missing-client-decision"
                    type="checkbox"
                    disabled
                    aria-describedby="forteca-frt-017-client-decision-help"
                  />
                  <span className="forteca-frt-017-switch-track" aria-hidden="true"><span /></span>
                  <span>{MISSING_ITEM_MODAL_COPY.clientDecisionLabel}</span>
                </label>
                <small id="forteca-frt-017-client-decision-help" className="forteca-frt-017-capability-note">
                  {MISSING_ITEM_MODAL_COPY.unsupportedClientDecision}
                </small>
              </div>

              {props.blocksProgressValue ? (
                <label className="forteca-frt-017-field forteca-frt-017-field--full" htmlFor="forteca-frt-017-block-scope-input">
                  <span>{blockScopeField?.label}</span>
                  <input
                    id="forteca-frt-017-block-scope-input"
                    name="missing-block-scope"
                    value={props.blockScopeValue}
                    onChange={(event) => props.onBlockScopeChange(event.target.value)}
                    placeholder={blockScopeField?.placeholder}
                  />
                </label>
              ) : null}
            </div>
            {props.error ? <p className="forteca-frt-017-error" role="alert">{props.error}</p> : null}
          </div>

          <footer className="forteca-frt-017-footer">
            <button type="button" className="forteca-frt-017-secondary" onClick={props.onCancel}>
              {MISSING_ITEM_MODAL_COPY.cancel}
            </button>
            <button type="submit" className="forteca-frt-017-primary" disabled={props.isSaving}>
              {props.isSaving ? 'Zapisywanie...' : MISSING_ITEM_MODAL_COPY.submit}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export const STAGE227C2_MISSING_ITEM_QUICK_ACTION_MODAL =
  'Stage227C2 keeps Brak as a shared modal host while FRT-017 owns the complete real form';

export const STAGE232A_R4_LEAD_MISSING_BLOCKER_CONTRACT =
  'Brak modal stores explicit missingKind, priority, dueDate, blocksProgress and blockScope for lead missing/blocker source of truth';
