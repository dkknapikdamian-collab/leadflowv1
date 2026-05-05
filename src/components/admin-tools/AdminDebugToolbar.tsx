import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  AdminBugItem,
  AdminCopyItem,
  AdminPriority,
  AdminReviewItem,
  AdminReviewMode,
  AdminReviewType,
  AdminTargetCandidate,
  AdminToolMode,
} from './admin-tools-types';
import {
  appendBugItem,
  appendCopyItem,
  appendReviewItem,
  createAdminToolId,
  readActiveAdminTool,
  readBugItems,
  readButtonSnapshots,
  readCopyItems,
  readReviewItems,
  readAdminToolsSettings,
  clearAdminFeedbackItems,
  writeActiveAdminTool,
  writeAdminToolsSettings,
  writeButtonSnapshots,
} from './admin-tools-storage';
import { exportAdminFeedbackJson, exportAdminFeedbackMarkdown } from './admin-tools-export';
import { buildTargetCandidates, scanActionElements } from './dom-candidates';
import { describeAdminTarget, getComposedPath, isAdminToolClick, pickAdminTargetCandidate } from './dom-targeting';
import '../../styles/admin-tools.css';

type Props = {
  currentSection: string;
};

type TargetDialogState = {
  mode: 'review' | 'copy' | 'bug';
  candidates: AdminTargetCandidate[];
  selectedIndex: number;
};

type QuickEditorPosition = {
  top: number;
  right: number;
};

type QuickEditorDragState = {
  startClientX: number;
  startClientY: number;
  startTop: number;
  startRight: number;
};

const ADMIN_CLICK_TO_ANNOTATE_STAGE87D = 'admin tools select element first, then quick note, Enter saves';
const ADMIN_QUICK_EDITOR_PORTAL_DRAG_STAGE87F = 'quick editor is portaled to body and draggable below topbar';
const ADMIN_TOOLBAR_UTF8_PORTAL_FORCE_STAGE87G = 'toolbar copied as utf8 source file to prevent PowerShell mojibake';
const ADMIN_EXPORT_CLEARS_COUNTERS_STAGE89 = 'export downloads feedback and clears local counters immediately';
const ADMIN_DIALOG_STACK_FIX_STAGE87C = 'superseded by Stage87D click-to-annotate quick editor';
const ADMIN_DIALOG_DRAG_LOWER_STAGE87B = 'superseded by Stage87D click-to-annotate quick editor';

const DEFAULT_QUICK_EDITOR_POSITION: QuickEditorPosition = {
  top: 136,
  right: 24,
};

const REVIEW_PRESETS = [
  'Przenieść wyżej',
  'Przenieść niżej',
  'Zmniejszyć',
  'Powiększyć',
  'Zły tekst',
  'Zły przycisk / złe działanie',
  'Ukryć',
  'Dodać wyraźniejszy CTA',
  'Za dużo chaosu',
  'Nie działa po kliknięciu',
];

function getRoute() {
  if (typeof window === 'undefined') return '';
  return `${window.location.pathname}${window.location.search}`;
}

function getViewport() {
  return {
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
  };
}

function isVisible(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
}

function clampQuickEditorPosition(next: QuickEditorPosition): QuickEditorPosition {
  if (typeof window === 'undefined') return next;
  const maxTop = Math.max(96, window.innerHeight - 180);
  const maxRight = Math.max(12, window.innerWidth - 180);

  return {
    top: Math.max(84, Math.min(maxTop, Math.round(next.top))),
    right: Math.max(8, Math.min(maxRight, Math.round(next.right))),
  };
}

function candidateToButtonSnapshot(candidate: AdminTargetCandidate) {
  const element = candidate.element;
  return {
    id: createAdminToolId('button'),
    kind: 'button_matrix_item' as const,
    route: getRoute(),
    text: candidate.target.text || candidate.target.ariaLabel || candidate.target.title,
    selectorHint: candidate.target.selectorHint,
    tag: candidate.target.tag,
    role: candidate.target.role,
    disabled: Boolean((element as HTMLButtonElement).disabled || element.getAttribute('aria-disabled') === 'true'),
    visible: isVisible(element),
    rect: candidate.target.rect,
    qaStatus: 'unchecked' as const,
  };
}

function selectedCandidate(dialog: TargetDialogState | null) {
  if (!dialog) return null;
  return dialog.candidates[dialog.selectedIndex] || dialog.candidates[0] || null;
}

function clearAdminTargetMarks() {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('[data-admin-debug-selected-stage87d="true"]').forEach((element) => {
    element.removeAttribute('data-admin-debug-selected-stage87d');
  });
}

function markSelectedCandidate(candidate: AdminTargetCandidate | null | undefined) {
  clearAdminTargetMarks();
  if (!candidate?.element) return;
  candidate.element.setAttribute('data-admin-debug-selected-stage87d', 'true');
}

function markSavedCandidate(candidate: AdminTargetCandidate | null | undefined) {
  if (!candidate?.element) return;
  candidate.element.setAttribute('data-admin-debug-saved-stage87d', 'true');
  window.setTimeout(() => {
    candidate.element.removeAttribute('data-admin-debug-saved-stage87d');
  }, 2400);
}

function targetLabel(candidate: AdminTargetCandidate | null | undefined) {
  if (!candidate) return 'Brak elementu';
  return candidate.target.text || candidate.target.ariaLabel || candidate.target.title || candidate.target.selectorHint || candidate.target.tag;
}

export default function AdminDebugToolbar({ currentSection }: Props) {
  const [activeTool, setActiveTool] = useState<AdminToolMode>(() => readActiveAdminTool());
  const [reviewMode, setReviewMode] = useState<AdminReviewMode>(() => readAdminToolsSettings().reviewMode || 'off');
  const [targetDialog, setTargetDialog] = useState<TargetDialogState | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewType, setReviewType] = useState<AdminReviewType>('visual');
  const [reviewPriority, setReviewPriority] = useState<AdminPriority>('P2');
  const [currentBehavior, setCurrentBehavior] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [copyProposed, setCopyProposed] = useState('');
  const [copyReason, setCopyReason] = useState('');
  const [copyPriority, setCopyPriority] = useState<AdminPriority>('P2');
  const [bugWhatIDid, setBugWhatIDid] = useState('');
  const [bugWhatHappened, setBugWhatHappened] = useState('');
  const [bugExpected, setBugExpected] = useState('');
  const [bugPriority, setBugPriority] = useState<AdminPriority>('P1');
  const [reviewCount, setReviewCount] = useState(() => readReviewItems().length);
  const [copyCount, setCopyCount] = useState(() => readCopyItems().length);
  const [bugCount, setBugCount] = useState(() => readBugItems().length);
  const [buttonSnapshots, setButtonSnapshots] = useState(() => readButtonSnapshots());
  const [lastSaveMessage, setLastSaveMessage] = useState('');
  const [quickEditorPosition, setQuickEditorPosition] = useState<QuickEditorPosition>(DEFAULT_QUICK_EDITOR_POSITION);
  const [quickEditorDragState, setQuickEditorDragState] = useState<QuickEditorDragState | null>(null);

  const canPickElement =
    activeTool === 'copy'
    || activeTool === 'bug'
    || (activeTool === 'review' && reviewMode === 'collect');

  useEffect(() => {
    writeActiveAdminTool(activeTool);
  }, [activeTool]);

  useEffect(() => {
    writeAdminToolsSettings({ reviewMode, showOverlay: true });
  }, [reviewMode]);

  useEffect(() => {
    if (!lastSaveMessage) return;
    const timeout = window.setTimeout(() => setLastSaveMessage(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [lastSaveMessage]);

  useEffect(() => () => clearAdminTargetMarks(), []);

  useEffect(() => {
    if (!quickEditorDragState) return;

    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();
      const deltaX = event.clientX - quickEditorDragState.startClientX;
      const deltaY = event.clientY - quickEditorDragState.startClientY;
      setQuickEditorPosition(clampQuickEditorPosition({
        top: quickEditorDragState.startTop + deltaY,
        right: quickEditorDragState.startRight - deltaX,
      }));
    };

    const stopDrag = () => setQuickEditorDragState(null);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopDrag, { once: true });
    window.addEventListener('pointercancel', stopDrag, { once: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDrag);
      window.removeEventListener('pointercancel', stopDrag);
    };
  }, [quickEditorDragState]);

  useEffect(() => {
    if (!canPickElement) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (isAdminToolClick(event)) return;
      if (activeTool === 'review' && reviewMode !== 'collect') return;
      if (activeTool !== 'review' && activeTool !== 'copy' && activeTool !== 'bug') return;

      event.preventDefault();
      event.stopPropagation();

      const route = getRoute();
      const screen = currentSection || 'unknown';
      const selection = pickAdminTargetCandidate(event, route, screen);
      const candidates = selection.candidates.length
        ? selection.candidates
        : buildTargetCandidates(getComposedPath(event), route, screen);

      if (!candidates.length) return;

      const mode = activeTool === 'copy' ? 'copy' : activeTool === 'bug' ? 'bug' : 'review';
      const nextDialog: TargetDialogState = { mode, candidates, selectedIndex: 0 };
      setTargetDialog(nextDialog);
      markSelectedCandidate(candidates[0]);

      const label = targetLabel(candidates[0]);
      if (mode === 'copy') {
        setCopyProposed(candidates[0].target.text || candidates[0].target.ariaLabel || '');
        setCopyReason('');
      }
      if (mode === 'bug') {
        setBugWhatIDid(`Kliknięto element: ${label}`);
        setBugWhatHappened('');
        setBugExpected('');
      }
      if (mode === 'review') {
        setReviewComment('');
        setCurrentBehavior('');
        setExpectedBehavior('');
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [activeTool, canPickElement, currentSection, reviewMode]);

  const currentCandidate = selectedCandidate(targetDialog);
  const dialogTitle = useMemo(() => describeAdminTarget(currentCandidate), [currentCandidate]);

  const chooseTool = (tool: AdminToolMode) => {
    setTargetDialog(null);
    clearAdminTargetMarks();
    setActiveTool((prev) => (prev === tool ? 'off' : tool));
    if (tool === 'review' && reviewMode === 'off') setReviewMode('collect');
  };

  const scanButtons = () => {
    setTargetDialog(null);
    clearAdminTargetMarks();
    const snapshots = scanActionElements(getRoute()).map(candidateToButtonSnapshot);
    writeButtonSnapshots(snapshots);
    setButtonSnapshots(snapshots);
    setActiveTool('buttons');
  };

  const updateButtonStatus = (id: string, qaStatus: 'unchecked' | 'ok' | 'bug' | 'move' | 'rename' | 'remove') => {
    const next = buttonSnapshots.map((item) => (item.id === id ? { ...item, qaStatus } : item));
    writeButtonSnapshots(next);
    setButtonSnapshots(next);
  };

  const closeQuickEditor = () => {
    setTargetDialog(null);
    clearAdminTargetMarks();
  };

  const finishSave = (candidate: AdminTargetCandidate | null | undefined, label: string) => {
    markSavedCandidate(candidate);
    clearAdminTargetMarks();
    setTargetDialog(null);
    setLastSaveMessage(`Zapisano: ${label}. Możesz kliknąć kolejny element.`);
  };

  const saveReview = () => {
    const candidate = currentCandidate;
    if (!candidate || !reviewComment.trim()) return;

    const item: AdminReviewItem = {
      id: createAdminToolId('review'),
      kind: 'ui_review',
      createdAt: new Date().toISOString(),
      status: 'todo',
      priority: reviewPriority,
      type: reviewType,
      route: getRoute(),
      screen: currentSection,
      comment: reviewComment.trim(),
      currentBehavior: currentBehavior.trim(),
      expectedBehavior: expectedBehavior.trim(),
      target: candidate.target,
      rect: candidate.target.rect,
      viewport: candidate.target.viewport,
      scroll: candidate.target.scroll,
    };

    appendReviewItem(item);
    setReviewCount(readReviewItems().length);
    setReviewComment('');
    setCurrentBehavior('');
    setExpectedBehavior('');
    finishSave(candidate, 'uwaga UI');
  };

  const saveCopy = () => {
    const candidate = currentCandidate;
    if (!candidate || !copyProposed.trim()) return;

    const item: AdminCopyItem = {
      id: createAdminToolId('copy'),
      kind: 'copy_review',
      createdAt: new Date().toISOString(),
      route: getRoute(),
      oldText: candidate.target.text || candidate.target.ariaLabel || '',
      proposedText: copyProposed.trim(),
      reason: copyReason.trim(),
      priority: copyPriority,
      target: candidate.target,
    };

    appendCopyItem(item);
    setCopyCount(readCopyItems().length);
    setCopyProposed('');
    setCopyReason('');
    finishSave(candidate, 'copy');
  };

  const saveBug = () => {
    const candidate = currentCandidate;
    if (!candidate || !bugWhatHappened.trim()) return;

    const item: AdminBugItem = {
      id: createAdminToolId('bug'),
      kind: 'bug_note',
      createdAt: new Date().toISOString(),
      route: getRoute(),
      whatIDid: bugWhatIDid.trim() || `Kliknięto element: ${targetLabel(candidate)}`,
      whatHappened: bugWhatHappened.trim(),
      expected: bugExpected.trim(),
      priority: bugPriority,
      target: candidate.target,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      viewport: getViewport(),
    };

    appendBugItem(item);
    setBugCount(readBugItems().length);
    setBugWhatIDid('');
    setBugWhatHappened('');
    setBugExpected('');
    finishSave(candidate, 'bug');
  };

  const saveCurrentQuickEditor = () => {
    if (targetDialog?.mode === 'bug') saveBug();
    if (targetDialog?.mode === 'copy') saveCopy();
    if (targetDialog?.mode === 'review') saveReview();
  };

  const saveOnEnter = (event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    saveCurrentQuickEditor();
  };

  const moveCandidate = (direction: -1 | 1) => {
    setTargetDialog((prev) => {
      if (!prev) return prev;
      const nextIndex = Math.max(0, Math.min(prev.candidates.length - 1, prev.selectedIndex + direction));
      const next = { ...prev, selectedIndex: nextIndex };
      window.setTimeout(() => markSelectedCandidate(next.candidates[nextIndex]), 0);
      return next;
    });
  };

  const startQuickEditorDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, input, textarea, select, a')) return;
    event.preventDefault();
    setQuickEditorDragState({
      startClientX: event.clientX,
      startClientY: event.clientY,
      startTop: quickEditorPosition.top,
      startRight: quickEditorPosition.right,
    });
  };

  const resetQuickEditorPosition = () => {
    setQuickEditorPosition(DEFAULT_QUICK_EDITOR_POSITION);
  };

  const refreshAdminFeedbackCounters = () => {
    setReviewCount(readReviewItems().length);
    setBugCount(readBugItems().length);
    setCopyCount(readCopyItems().length);
    setButtonSnapshots(readButtonSnapshots());
  };

  const clearExportedAdminFeedback = (kind: 'JSON' | 'Markdown') => {
    clearAdminFeedbackItems();
    refreshAdminFeedbackCounters();
    setTargetDialog(null);
    clearAdminTargetMarks();
    setLastSaveMessage(`Wyeksportowano ${kind} i wyczyszczono licznik zgłoszeń.`);
  };

  const exportJsonAndClear = () => {
    exportAdminFeedbackJson();
    clearExportedAdminFeedback('JSON');
  };

  const exportMarkdownAndClear = () => {
    exportAdminFeedbackMarkdown();
    clearExportedAdminFeedback('Markdown');
  };

  const getQuickEditorStyle = (): CSSProperties => ({
    top: quickEditorPosition.top,
    right: quickEditorPosition.right,
    bottom: 'auto',
  });

  const toolHint = (() => {
    if (activeTool === 'bug') return 'BUG: kliknij element na stronie, wpisz co nie działa i naciśnij Enter.';
    if (activeTool === 'copy') return 'COPY: kliknij tekst/przycisk, wpisz nową treść i naciśnij Enter.';
    if (activeTool === 'review' && reviewMode === 'collect') return 'REVIEW: kliknij element, wpisz uwagę i naciśnij Enter.';
    if (activeTool === 'buttons') return 'BUTTONS: zeskanowano akcje na ekranie.';
    return '';
  })();

  const quickEditorTitle = targetDialog?.mode === 'bug'
    ? 'Bug Note Recorder'
    : targetDialog?.mode === 'copy'
      ? 'Copy Review'
      : 'UI Review';

  const floatingAdminTools = (
    <>
      {toolHint ? <div className="admin-tool-mode-hint" data-admin-tool-ui="true">{toolHint}</div> : null}
      {lastSaveMessage ? <div className="admin-tool-save-toast" data-admin-tool-ui="true">{lastSaveMessage}</div> : null}

      {targetDialog ? (
        <div
          className={`admin-tool-quick-editor admin-tool-quick-editor-${targetDialog.mode}`}
          style={getQuickEditorStyle()}
          data-admin-tool-ui="true"
          data-admin-click-to-annotate-editor-stage87d="true"
          data-admin-quick-editor-portal-drag-stage87f="true"
          data-admin-toolbar-utf8-portal-force-stage87g="true"
        >
          <div
            className="admin-tool-row admin-tool-quick-editor-head"
            onPointerDown={startQuickEditorDrag}
            data-admin-tool-ui="true"
            title="Przeciągnij okno"
          >
            <strong>{quickEditorTitle}</strong>
            <div className="admin-tool-row admin-tool-quick-editor-head-actions">
              <button type="button" onClick={resetQuickEditorPosition} data-admin-tool-ui="true">Reset pozycji</button>
              <button type="button" onClick={closeQuickEditor} data-admin-tool-ui="true">Zamknij</button>
            </div>
          </div>

          <div className="admin-target-card">
            <span>Wybrano: {dialogTitle}</span>
            <small>{currentCandidate?.reason} · {currentCandidate?.target.selectorHint}</small>
            <div className="admin-tool-row">
              <button type="button" onClick={() => moveCandidate(1)} data-admin-tool-ui="true">Większy cel</button>
              <button type="button" onClick={() => moveCandidate(-1)} data-admin-tool-ui="true">Mniejszy cel</button>
            </div>
            <select value={targetDialog.selectedIndex} onChange={(event) => {
              const selectedIndex = Number(event.target.value);
              setTargetDialog({ ...targetDialog, selectedIndex });
              markSelectedCandidate(targetDialog.candidates[selectedIndex]);
            }} data-admin-tool-ui="true">
              {targetDialog.candidates.slice(0, 6).map((candidate, index) => (
                <option key={`${candidate.target.selectorHint}-${index}`} value={index}>
                  {index + 1}. {describeAdminTarget(candidate)} · score {candidate.score}
                </option>
              ))}
            </select>
          </div>

          {targetDialog.mode === 'bug' ? (
            <>
              <label>Co zrobiłem<input value={bugWhatIDid} onChange={(event) => setBugWhatIDid(event.target.value)} onKeyDown={saveOnEnter} data-admin-tool-ui="true" /></label>
              <label>Co nie działa *<textarea autoFocus value={bugWhatHappened} onChange={(event) => setBugWhatHappened(event.target.value)} onKeyDown={saveOnEnter} placeholder="np. ten przycisk nie działa" data-admin-tool-ui="true" /></label>
              <label>Co powinno się stać<textarea value={bugExpected} onChange={(event) => setBugExpected(event.target.value)} onKeyDown={saveOnEnter} placeholder="opcjonalnie" data-admin-tool-ui="true" /></label>
              <label>Priorytet<select value={bugPriority} onChange={(event) => setBugPriority(event.target.value as AdminPriority)} data-admin-tool-ui="true">
                <option value="P0">P0</option><option value="P1">P1</option><option value="P2">P2</option><option value="P3">P3</option>
              </select></label>
              <button type="button" onClick={saveBug} disabled={!bugWhatHappened.trim()} data-admin-tool-ui="true">Zapisz bug · Enter</button>
            </>
          ) : null}

          {targetDialog.mode === 'review' ? (
            <>
              <div className="admin-preset-grid">
                {REVIEW_PRESETS.map((preset) => (
                  <button key={preset} type="button" onClick={() => setReviewComment(preset)} data-admin-tool-ui="true">{preset}</button>
                ))}
              </div>
              <label>Uwaga *<textarea autoFocus value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} onKeyDown={saveOnEnter} placeholder="np. ten napis jest za wysoko, przemieść niżej" data-admin-tool-ui="true" /></label>
              <label>Typ<select value={reviewType} onChange={(event) => setReviewType(event.target.value as AdminReviewType)} data-admin-tool-ui="true">
                <option value="visual">wygląd</option><option value="position">pozycja</option><option value="copy">tekst</option><option value="behavior">działanie</option><option value="bug">błąd</option><option value="mobile">mobile</option><option value="performance">performance</option><option value="other">inne</option>
              </select></label>
              <label>Priorytet<select value={reviewPriority} onChange={(event) => setReviewPriority(event.target.value as AdminPriority)} data-admin-tool-ui="true">
                <option value="P0">P0</option><option value="P1">P1</option><option value="P2">P2</option><option value="P3">P3</option>
              </select></label>
              <label>Obecne zachowanie<textarea value={currentBehavior} onChange={(event) => setCurrentBehavior(event.target.value)} onKeyDown={saveOnEnter} data-admin-tool-ui="true" /></label>
              <label>Oczekiwane zachowanie<textarea value={expectedBehavior} onChange={(event) => setExpectedBehavior(event.target.value)} onKeyDown={saveOnEnter} data-admin-tool-ui="true" /></label>
              <button type="button" onClick={saveReview} disabled={!reviewComment.trim()} data-admin-tool-ui="true">Zapisz uwagę · Enter</button>
            </>
          ) : null}

          {targetDialog.mode === 'copy' ? (
            <>
              <label>Stary tekst<input value={currentCandidate?.target.text || currentCandidate?.target.ariaLabel || ''} readOnly data-admin-tool-ui="true" /></label>
              <label>Nowy tekst *<textarea autoFocus value={copyProposed} onChange={(event) => setCopyProposed(event.target.value)} onKeyDown={saveOnEnter} data-admin-tool-ui="true" /></label>
              <label>Powód<textarea value={copyReason} onChange={(event) => setCopyReason(event.target.value)} onKeyDown={saveOnEnter} placeholder="opcjonalnie" data-admin-tool-ui="true" /></label>
              <label>Priorytet<select value={copyPriority} onChange={(event) => setCopyPriority(event.target.value as AdminPriority)} data-admin-tool-ui="true">
                <option value="P0">P0</option><option value="P1">P1</option><option value="P2">P2</option><option value="P3">P3</option>
              </select></label>
              <button type="button" onClick={saveCopy} disabled={!copyProposed.trim()} data-admin-tool-ui="true">Zapisz copy · Enter</button>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );

  return (
    <>
      <div
        className="admin-debug-toolbar"
        data-admin-tool-ui="true"
        data-admin-debug-toolbar-stage87="true"
        data-admin-click-to-annotate-stage87d="true"
        data-admin-quick-editor-portal-drag-stage87f="true"
        data-admin-toolbar-utf8-portal-force-stage87g="true"
      >
        <button type="button" className={activeTool === 'review' ? 'active' : ''} onClick={() => chooseTool('review')} data-admin-tool-ui="true">
          Review {reviewCount ? <span>{reviewCount}</span> : null}
        </button>
        <button type="button" className={activeTool === 'buttons' ? 'active' : ''} onClick={scanButtons} data-admin-tool-ui="true">
          Buttons {buttonSnapshots.length ? <span>{buttonSnapshots.length}</span> : null}
        </button>
        <button type="button" className={activeTool === 'bug' ? 'active' : ''} onClick={() => chooseTool('bug')} data-admin-tool-ui="true">
          Bug {bugCount ? <span>{bugCount}</span> : null}
        </button>
        <button type="button" className={activeTool === 'copy' ? 'active' : ''} onClick={() => chooseTool('copy')} data-admin-tool-ui="true">
          Copy {copyCount ? <span>{copyCount}</span> : null}
        </button>
        <button type="button" className={activeTool === 'export' ? 'active' : ''} onClick={() => chooseTool('export')} data-admin-tool-ui="true">
          Export
        </button>

        {activeTool === 'review' ? (
          <div className="admin-tool-popover" data-admin-tool-ui="true">
            <strong>UI Review Mode</strong>
            <div className="admin-tool-segment">
              {(['off', 'collect', 'browse'] as AdminReviewMode[]).map((mode) => (
                <button key={mode} type="button" className={reviewMode === mode ? 'active' : ''} onClick={() => setReviewMode(mode)} data-admin-tool-ui="true">
                  {mode === 'off' ? 'OFF' : mode === 'collect' ? 'Zbieraj' : 'Browse'}
                </button>
              ))}
            </div>
            <small>{reviewMode === 'collect' ? 'Kliknij element, wpisz uwagę, Enter zapisuje.' : 'Browse przepuszcza kliknięcia normalnie.'}</small>
          </div>
        ) : null}

        {activeTool === 'buttons' ? (
          <div className="admin-tool-popover admin-tool-wide" data-admin-tool-ui="true">
            <div className="admin-tool-row">
              <strong>Button Matrix</strong>
              <button type="button" onClick={scanButtons} data-admin-tool-ui="true">Skanuj ponownie</button>
            </div>
            <div className="admin-button-list">
              {buttonSnapshots.length ? buttonSnapshots.map((item) => (
                <div key={item.id} className="admin-button-row">
                  <div>
                    <strong>{item.text || item.selectorHint || item.tag}</strong>
                    <small>{item.route} · {item.tag} · {item.visible ? 'visible' : 'hidden'} · {item.disabled ? 'disabled' : 'enabled'}</small>
                  </div>
                  <select value={item.qaStatus} onChange={(event) => updateButtonStatus(item.id, event.target.value as any)} data-admin-tool-ui="true">
                    <option value="unchecked">unchecked</option>
                    <option value="ok">OK</option>
                    <option value="bug">Nie działa</option>
                    <option value="move">Przenieść</option>
                    <option value="rename">Zły tekst</option>
                    <option value="remove">Usuń</option>
                  </select>
                </div>
              )) : <small>Brak skanu na tej trasie.</small>}
            </div>
          </div>
        ) : null}

        {activeTool === 'export' ? (
          <div className="admin-tool-popover" data-admin-tool-ui="true">
            <strong>Export Center</strong>
            <button type="button" onClick={exportJsonAndClear} data-admin-tool-ui="true">Pobierz JSON i wyczyść licznik</button>
            <button type="button" onClick={exportMarkdownAndClear} data-admin-tool-ui="true">Pobierz Markdown i wyczyść licznik</button>
            <small>Po eksporcie lokalne zgłoszenia i licznik zostaną wyczyszczone. Pliki trafią do Downloads.</small>
          </div>
        ) : null}
      </div>

      {typeof document !== 'undefined' ? createPortal(floatingAdminTools, document.body) : null}
    </>
  );
}

// ADMIN_DEBUG_TOOLBAR_STAGE87
// ADMIN_DEBUG_TOOLBAR_NO_BACKEND_STAGE87
// ADMIN_CLICK_TO_ANNOTATE_STAGE87D
// ADMIN_QUICK_EDITOR_PORTAL_DRAG_STAGE87F
// ADMIN_TOOLBAR_UTF8_PORTAL_FORCE_STAGE87G

// ADMIN_EXPORT_CLEARS_COUNTERS_STAGE89
