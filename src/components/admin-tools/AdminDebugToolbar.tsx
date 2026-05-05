import { useEffect, useMemo, useState } from 'react';
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
  mode: 'review' | 'copy';
  candidates: AdminTargetCandidate[];
  selectedIndex: number;
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
  const [bugOpen, setBugOpen] = useState(false);
  const [bugWhatIDid, setBugWhatIDid] = useState('');
  const [bugWhatHappened, setBugWhatHappened] = useState('');
  const [bugExpected, setBugExpected] = useState('');
  const [bugPriority, setBugPriority] = useState<AdminPriority>('P1');
  const [reviewCount, setReviewCount] = useState(() => readReviewItems().length);
  const [copyCount, setCopyCount] = useState(() => readCopyItems().length);
  const [bugCount, setBugCount] = useState(() => readBugItems().length);
  const [buttonSnapshots, setButtonSnapshots] = useState(() => readButtonSnapshots());

  const canCollect = activeTool === 'review' && reviewMode === 'collect';
  const canCopyCollect = activeTool === 'copy';

  useEffect(() => {
    writeActiveAdminTool(activeTool);
  }, [activeTool]);

  useEffect(() => {
    writeAdminToolsSettings({ reviewMode, showOverlay: true });
  }, [reviewMode]);

  useEffect(() => {
    if (!canCollect && !canCopyCollect) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (isAdminToolClick(event)) return;
      if (activeTool === 'review' && reviewMode !== 'collect') return;
      if (activeTool !== 'review' && activeTool !== 'copy') return;

      event.preventDefault();
      event.stopPropagation();

      const route = getRoute();
      const screen = currentSection || 'unknown';
      const selection = pickAdminTargetCandidate(event, route, screen);
      const candidates = selection.candidates.length
        ? selection.candidates
        : buildTargetCandidates(getComposedPath(event), route, screen);

      if (!candidates.length) return;

      const mode = activeTool === 'copy' ? 'copy' : 'review';
      setTargetDialog({ mode, candidates, selectedIndex: 0 });

      if (mode === 'copy') {
        const candidate = candidates[0];
        setCopyProposed(candidate.target.text || candidate.target.ariaLabel || '');
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [activeTool, canCollect, canCopyCollect, currentSection, reviewMode]);

  const currentCandidate = selectedCandidate(targetDialog);
  const dialogTitle = useMemo(() => describeAdminTarget(currentCandidate), [currentCandidate]);

  const chooseTool = (tool: AdminToolMode) => {
    setActiveTool((prev) => (prev === tool ? 'off' : tool));
    if (tool === 'review' && reviewMode === 'off') setReviewMode('collect');
    if (tool === 'bug') setBugOpen(true);
  };

  const scanButtons = () => {
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
    setTargetDialog(null);
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
    setTargetDialog(null);
  };

  const saveBug = () => {
    if (!bugWhatIDid.trim() || !bugWhatHappened.trim()) return;
    const item: AdminBugItem = {
      id: createAdminToolId('bug'),
      kind: 'bug_note',
      createdAt: new Date().toISOString(),
      route: getRoute(),
      whatIDid: bugWhatIDid.trim(),
      whatHappened: bugWhatHappened.trim(),
      expected: bugExpected.trim(),
      priority: bugPriority,
      target: null,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      viewport: getViewport(),
    };
    appendBugItem(item);
    setBugCount(readBugItems().length);
    setBugWhatIDid('');
    setBugWhatHappened('');
    setBugExpected('');
    setBugOpen(false);
  };

  const moveCandidate = (direction: -1 | 1) => {
    setTargetDialog((prev) => {
      if (!prev) return prev;
      const nextIndex = Math.max(0, Math.min(prev.candidates.length - 1, prev.selectedIndex + direction));
      return { ...prev, selectedIndex: nextIndex };
    });
  };

  return (
    <div className="admin-debug-toolbar" data-admin-tool-ui="true" data-admin-debug-toolbar-stage87="true">
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
          <small>{reviewMode === 'collect' ? 'Klik element zatrzyma akcję i otworzy uwagę.' : 'Browse przepuszcza kliknięcia normalnie.'}</small>
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

      {bugOpen ? (
        <div className="admin-tool-dialog-backdrop" data-admin-tool-ui="true">
          <div className="admin-tool-dialog" data-admin-tool-ui="true">
            <div className="admin-tool-row">
              <strong>Bug Note Recorder</strong>
              <button type="button" onClick={() => setBugOpen(false)} data-admin-tool-ui="true">Zamknij</button>
            </div>
            <label>Co zrobiłem<textarea value={bugWhatIDid} onChange={(event) => setBugWhatIDid(event.target.value)} data-admin-tool-ui="true" /></label>
            <label>Co się stało<textarea value={bugWhatHappened} onChange={(event) => setBugWhatHappened(event.target.value)} data-admin-tool-ui="true" /></label>
            <label>Co miało się stać<textarea value={bugExpected} onChange={(event) => setBugExpected(event.target.value)} data-admin-tool-ui="true" /></label>
            <label>Priorytet<select value={bugPriority} onChange={(event) => setBugPriority(event.target.value as AdminPriority)} data-admin-tool-ui="true">
              <option value="P0">P0</option><option value="P1">P1</option><option value="P2">P2</option><option value="P3">P3</option>
            </select></label>
            <button type="button" onClick={saveBug} data-admin-tool-ui="true">Zapisz błąd</button>
          </div>
        </div>
      ) : null}

      {activeTool === 'export' ? (
        <div className="admin-tool-popover" data-admin-tool-ui="true">
          <strong>Export Center</strong>
          <button type="button" onClick={exportAdminFeedbackJson} data-admin-tool-ui="true">Pobierz JSON</button>
          <button type="button" onClick={exportAdminFeedbackMarkdown} data-admin-tool-ui="true">Pobierz Markdown</button>
          <small>Pliki trafią do Downloads przez mechanizm przeglądarki.</small>
        </div>
      ) : null}

      {targetDialog ? (
        <div className="admin-tool-dialog-backdrop" data-admin-tool-ui="true">
          <div className="admin-tool-dialog admin-tool-dialog-large" data-admin-tool-ui="true">
            <div className="admin-tool-row">
              <strong>{targetDialog.mode === 'copy' ? 'Copy Review' : 'UI Review'}</strong>
              <button type="button" onClick={() => setTargetDialog(null)} data-admin-tool-ui="true">Zamknij</button>
            </div>
            <div className="admin-target-card">
              <span>Wybrano: {dialogTitle}</span>
              <small>{currentCandidate?.reason} · {currentCandidate?.target.selectorHint}</small>
              {currentCandidate?.target.composedPathSummary?.[0]?.includes('svg') ? (
                <small>Kliknięto ikonę, wybrano nadrzędny element z listy kandydatów.</small>
              ) : null}
              <div className="admin-tool-row">
                <button type="button" onClick={() => moveCandidate(1)} data-admin-tool-ui="true">Zaznacz większy</button>
                <button type="button" onClick={() => moveCandidate(-1)} data-admin-tool-ui="true">Zaznacz mniejszy</button>
              </div>
              <select value={targetDialog.selectedIndex} onChange={(event) => setTargetDialog({ ...targetDialog, selectedIndex: Number(event.target.value) })} data-admin-tool-ui="true">
                {targetDialog.candidates.slice(0, 6).map((candidate, index) => (
                  <option key={`${candidate.target.selectorHint}-${index}`} value={index}>
                    {index + 1}. {describeAdminTarget(candidate)} · score {candidate.score}
                  </option>
                ))}
              </select>
            </div>

            {targetDialog.mode === 'review' ? (
              <>
                <div className="admin-preset-grid">
                  {REVIEW_PRESETS.map((preset) => (
                    <button key={preset} type="button" onClick={() => setReviewComment(preset)} data-admin-tool-ui="true">{preset}</button>
                  ))}
                </div>
                <label>Komentarz *<textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} data-admin-tool-ui="true" /></label>
                <label>Typ<select value={reviewType} onChange={(event) => setReviewType(event.target.value as AdminReviewType)} data-admin-tool-ui="true">
                  <option value="visual">wygląd</option><option value="position">pozycja</option><option value="copy">tekst</option><option value="behavior">działanie</option><option value="bug">błąd</option><option value="mobile">mobile</option><option value="performance">performance</option><option value="other">inne</option>
                </select></label>
                <label>Priorytet<select value={reviewPriority} onChange={(event) => setReviewPriority(event.target.value as AdminPriority)} data-admin-tool-ui="true">
                  <option value="P0">P0</option><option value="P1">P1</option><option value="P2">P2</option><option value="P3">P3</option>
                </select></label>
                <label>Obecne zachowanie<textarea value={currentBehavior} onChange={(event) => setCurrentBehavior(event.target.value)} data-admin-tool-ui="true" /></label>
                <label>Oczekiwane zachowanie<textarea value={expectedBehavior} onChange={(event) => setExpectedBehavior(event.target.value)} data-admin-tool-ui="true" /></label>
                <button type="button" onClick={saveReview} disabled={!reviewComment.trim()} data-admin-tool-ui="true">Zapisz uwagę</button>
              </>
            ) : (
              <>
                <label>Stary tekst<input value={currentCandidate?.target.text || currentCandidate?.target.ariaLabel || ''} readOnly data-admin-tool-ui="true" /></label>
                <label>Nowy tekst<textarea value={copyProposed} onChange={(event) => setCopyProposed(event.target.value)} data-admin-tool-ui="true" /></label>
                <label>Powód<textarea value={copyReason} onChange={(event) => setCopyReason(event.target.value)} data-admin-tool-ui="true" /></label>
                <label>Priorytet<select value={copyPriority} onChange={(event) => setCopyPriority(event.target.value as AdminPriority)} data-admin-tool-ui="true">
                  <option value="P0">P0</option><option value="P1">P1</option><option value="P2">P2</option><option value="P3">P3</option>
                </select></label>
                <button type="button" onClick={saveCopy} disabled={!copyProposed.trim()} data-admin-tool-ui="true">Zapisz zmianę copy</button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ADMIN_DEBUG_TOOLBAR_STAGE87
// ADMIN_DEBUG_TOOLBAR_NO_BACKEND_STAGE87
