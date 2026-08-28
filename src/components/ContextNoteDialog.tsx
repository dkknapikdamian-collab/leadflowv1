import {
  type ClipboardEvent,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Bold,
  CalendarDays,
  ChevronDown,
  Info,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Paperclip,
  Underline,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  fetchActivitiesFromSupabase,
  insertActivityToSupabase,
} from '../lib/supabase-fallback';
import type { ActivityDto } from '../lib/data-contract';
import { requireWorkspaceId } from '../lib/workspace-context';
import type { TaskCreateDialogContext } from './TaskCreateDialog';

const STAGE85_CONTEXT_NOTE_DIALOG_SHARED = 'Shared note dialog for lead, client and case detail context actions';
const STAGE27E_CONTEXT_NOTE_SAVED_EVENT = 'closeflow:context-note-saved';
const STAGE27A_CONTEXT_NOTE_SAVED_EVENT = 'closeflow:context-note-saved';
const STAGE231H_R1D2_R11_CONTEXT_NOTE_FOLLOWUP_HANDOFF = 'ContextNoteDialog passes saved note record so CaseDetail can open the same follow-up prompt as dictation notes';
void STAGE85_CONTEXT_NOTE_DIALOG_SHARED;
void STAGE27E_CONTEXT_NOTE_SAVED_EVENT;
void STAGE231H_R1D2_R11_CONTEXT_NOTE_FOLLOWUP_HANDOFF;
const STAGE231H_R1D2_R12F_CONTEXT_NOTE_SAVED_BEFORE_CLOSE = 'ContextNoteDialog calls onSaved with savedRecord before closing so CaseDetail keeps the case note source-of-truth handoff';
void STAGE231H_R1D2_R12F_CONTEXT_NOTE_SAVED_BEFORE_CLOSE;
const STAGE231H_R1D2_R12_CONTEXT_NOTE_CASE_SOURCE_TRUTH = 'ContextNoteDialog keeps case notes scoped to caseId and calls onSaved before closing the host request';
void STAGE231H_R1D2_R12_CONTEXT_NOTE_CASE_SOURCE_TRUTH;

const STAGE231H_R1D2_R12D_CONTEXT_NOTE_ONSAVED_BEFORE_CLOSE = 'ContextNoteDialog calls onSaved(createdNote) before closing so quick case note handoff is not lost';
void STAGE231H_R1D2_R12D_CONTEXT_NOTE_ONSAVED_BEFORE_CLOSE;

const FRT015_NOTE_TAG_SUGGESTIONS = ['Rozmowa', 'Oferta', 'Spotkanie', 'Feedback klienta'] as const;
const FRT015_NOTE_VISIBILITY_OPTIONS = [
  { value: 'private', label: 'Tylko dla mnie' },
  { value: 'workspace', label: 'Cały zespół' },
] as const;
const FRT015_ALLOWED_EDITOR_ELEMENTS = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a']);
const FRT015_REMOVED_EDITOR_ELEMENTS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'form', 'svg', 'math']);

type ContextNoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (savedRecord?: unknown) => void | Promise<void>;
  context?: TaskCreateDialogContext;
};

type FRT015Visibility = (typeof FRT015_NOTE_VISIBILITY_OPTIONS)[number]['value'];

function eventTypeForContext(context?: TaskCreateDialogContext) {
  if (context?.recordType === 'case') return 'operator_note';
  if (context?.recordType === 'client') return 'client_note';
  return 'note_added';
}

function getTodayDateInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function formatDateInputValue(value: string) {
  const parts = value.split('-');
  if (parts.length !== 3) return value || '—';
  return parts[2] + '.' + parts[1] + '.' + parts[0];
}

function formatActivityDate(activity: ActivityDto) {
  const value = activity.createdAt;
  if (!value) return 'Brak daty';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Brak daty';
  return parsed.toLocaleDateString('pl-PL');
}

function getActivityPayload(activity: ActivityDto) {
  return activity.payload && typeof activity.payload === 'object' ? activity.payload : {};
}

function getPayloadText(payload: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (typeof payload[key] === 'string' && payload[key].trim()) return payload[key].trim();
  }
  return '';
}

function getPayloadTags(payload: Record<string, unknown>) {
  return Array.isArray(payload.tags)
    ? payload.tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0).map((tag) => tag.trim())
    : [];
}

function formatActivityDisplayDate(activity: ActivityDto) {
  const entryDate = getPayloadText(getActivityPayload(activity), ['entryDate']);
  return /^\d{4}-\d{2}-\d{2}$/.test(entryDate) ? formatDateInputValue(entryDate) : formatActivityDate(activity);
}

function isNoteActivity(activity: ActivityDto) {
  const eventType = String(activity.eventType || '').toLowerCase();
  const payload = getActivityPayload(activity);
  const source = getPayloadText(payload, ['source']).toLowerCase();
  return eventType.includes('note') || source.includes('note');
}

function activityOptionLabel(activity: ActivityDto) {
  const payload = getActivityPayload(activity);
  const detail = getPayloadText(payload, ['title', 'content', 'note', 'summary', 'text']);
  const eventType = String(activity.eventType || 'Aktywność').replace(/[_-]+/g, ' ');
  return (detail || eventType) + ' · ' + formatActivityDate(activity);
}

function sanitizeEditorHtml(value: string) {
  if (!value || typeof DOMParser === 'undefined') return '';

  const parsed = new DOMParser().parseFromString(value, 'text/html');
  Array.from(parsed.body.getElementsByTagName('*')).forEach((element) => {
    const tagName = element.tagName.toLowerCase();
    if (FRT015_REMOVED_EDITOR_ELEMENTS.has(tagName)) {
      element.remove();
      return;
    }
    if (!FRT015_ALLOWED_EDITOR_ELEMENTS.has(tagName)) {
      const fragment = parsed.createDocumentFragment();
      while (element.firstChild) fragment.append(element.firstChild);
      element.replaceWith(fragment);
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      if (tagName !== 'a' || attribute.name !== 'href') {
        element.removeAttribute(attribute.name);
        return;
      }
      try {
        const url = new URL(attribute.value, typeof window === 'undefined' ? 'https://closeflow.local' : window.location.origin);
        if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) {
          element.removeAttribute(attribute.name);
        } else {
          element.setAttribute('href', url.href);
        }
      } catch {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return parsed.body.innerHTML;
}

function normalizeTags(value: string) {
  return Array.from(new Set(value.split(',').map((tag) => tag.trim()).filter(Boolean)));
}

function getLeadContextId(context?: TaskCreateDialogContext) {
  return context?.leadId || context?.recordId || null;
}

const FRT015_DRAWER_STYLE = {
  height: '100dvh',
  maxHeight: '100dvh',
} as CSSProperties;

export default function ContextNoteDialog({ open, onOpenChange, onSaved, context }: ContextNoteDialogProps) {
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [note, setNote] = useState('');
  const [editorHtml, setEditorHtml] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<FRT015Visibility>('private');
  const [entryDate, setEntryDate] = useState(getTodayDateInputValue);
  const [relatedActivityId, setRelatedActivityId] = useState('');
  const [recentActivities, setRecentActivities] = useState<ActivityDto[]>([]);
  const [recentActivitiesLoading, setRecentActivitiesLoading] = useState(false);
  const [recentActivitiesError, setRecentActivitiesError] = useState('');
  const [formError, setFormError] = useState('');
  const [formErrorField, setFormErrorField] = useState<'title' | 'content' | null>(null);
  const [saving, setSaving] = useState(false);

  const isFortecaLead = context?.recordType === 'lead';
  const leadContextId = getLeadContextId(context);
  const recentNoteActivities = useMemo(
    () => recentActivities.filter(isNoteActivity).slice(0, 3),
    [recentActivities],
  );

  const resetFortecaNoteState = () => {
    setNote('');
    setEditorHtml('');
    setNoteTitle('');
    setSelectedTags([]);
    setVisibility('private');
    setEntryDate(getTodayDateInputValue());
    setRelatedActivityId('');
    setFormError('');
    setFormErrorField(null);
    if (editorRef.current) editorRef.current.innerHTML = '';
  };

  useEffect(() => {
    if (open) {
      resetFortecaNoteState();
    }
  }, [open, context?.recordType, context?.recordId, context?.leadId]);

  useEffect(() => {
    let cancelled = false;

    if (!open || !isFortecaLead || !leadContextId) {
      setRecentActivities([]);
      setRecentActivitiesLoading(false);
      setRecentActivitiesError('');
      return () => {
        cancelled = true;
      };
    }

    setRecentActivitiesLoading(true);
    setRecentActivitiesError('');
    void fetchActivitiesFromSupabase({ leadId: leadContextId, limit: 100 })
      .then((activities) => {
        if (!cancelled) setRecentActivities(activities);
      })
      .catch(() => {
        if (!cancelled) {
          setRecentActivities([]);
          setRecentActivitiesError('Nie udało się pobrać aktywności tego leada.');
        }
      })
      .finally(() => {
        if (!cancelled) setRecentActivitiesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, isFortecaLead, leadContextId]);

  const closeDialog = () => {
    if (saving) return;
    onOpenChange(false);
    resetFortecaNoteState();
  };

  const syncEditorState = () => {
    const element = editorRef.current;
    setNote(element?.innerText.trim() || '');
    setEditorHtml(element?.innerHTML || '');
    if (element?.innerText.trim() && formErrorField === 'content') {
      setFormError('');
      setFormErrorField(null);
    }
  };

  const runEditorCommand = (command: string, value?: string) => {
    if (typeof document === 'undefined' || !editorRef.current) return;
    editorRef.current.focus();
    try {
      document.execCommand(command, false, value);
    } catch {
      return;
    }
    syncEditorState();
  };

  const handleEditorToolbarKeyDown = (event: KeyboardEvent<HTMLButtonElement>, command: string, value?: string) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    runEditorCommand(command, value);
  };

  const handleCreateLink = () => {
    if (typeof window === 'undefined') return;
    const candidate = window.prompt('Wklej adres linku');
    if (!candidate?.trim()) return;
    try {
      const url = new URL(candidate.trim(), window.location.origin);
      if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) {
        toast.error('Dozwolone są tylko bezpieczne linki http(s) lub mailto.');
        return;
      }
      runEditorCommand('createLink', url.href);
    } catch {
      toast.error('Wpisz poprawny adres linku.');
    }
  };

  const handleSuggestedTag = (tag: string) => {
    setSelectedTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  };

  const handleTagsChange = (value: string) => {
    setSelectedTags(normalizeTags(value));
  };

  const showFormError = (message: string, field: 'title' | 'content' | null = null) => {
    setFormError(message);
    setFormErrorField(field);
    toast.error(message);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const content = isFortecaLead
      ? (editorRef.current?.innerText.trim() || note.trim())
      : note.trim();
    const title = noteTitle.trim();

    if (!hasAccess) return showFormError('Trial wygasł.');
    if (isFortecaLead && !title) return showFormError('Wpisz tytuł notatki.', 'title');
    if (!content) return showFormError('Wpisz treść notatki.', 'content');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return showFormError('Kontekst workspace nie jest jeszcze gotowy.');

    const input: any = {
      leadId: isFortecaLead ? leadContextId : (context?.leadId || null),
      caseId: context?.caseId || null,
      ownerId: null,
      actorId: null,
      actorType: 'operator',
      eventType: eventTypeForContext(context),
      payload: {
        content: content,
        note: content,
        source: 'stage85-context-note-dialog',
        recordType: context?.recordType || null,
        recordLabel: context?.recordLabel || null,
        ...(isFortecaLead ? {
          title: title,
          contentHtml: sanitizeEditorHtml(editorHtml || editorRef.current?.innerHTML || ''),
          tags: selectedTags,
          visibility: visibility,
          entryDate: entryDate,
          relatedActivityId: relatedActivityId || null,
        } : {}),
      },
      workspaceId,
    };
    if (context?.clientId) input.clientId = context.clientId;

    setSaving(true);
    try {
      const createdNote = await insertActivityToSupabase(input);
      const savedRecord = createdNote || input;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(STAGE27A_CONTEXT_NOTE_SAVED_EVENT, {
          detail: {
            ...input,
            savedRecord,
            activity: savedRecord,
          },
        }));
      }
      await onSaved?.(savedRecord);
      toast.success('Notatka dodana');
      onOpenChange(false);
      resetFortecaNoteState();
    } catch {
      showFormError('Nie udało się zapisać notatki.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditorPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const plainText = event.clipboardData.getData('text/plain');
    if (typeof document !== 'undefined' && plainText) {
      document.execCommand('insertText', false, plainText);
      syncEditorState();
    }
  };

  if (isFortecaLead) {
    return (
      <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : closeDialog())}>
        <DialogContent
          className="forteca-frt-015-dialog !left-auto !right-0 !top-0 !bottom-auto !translate-x-0 !translate-y-0 !max-w-none !w-[min(620px,100vw)] !h-[100dvh] !max-h-[100dvh] !rounded-none !p-0 !gap-0 !flex !flex-col sm:!w-[620px]"
          style={FRT015_DRAWER_STYLE}
          data-forteca-frt-015-lead-note="true"
          data-forteca-frt-015-form="true"
        >
          <DialogHeader className="forteca-frt-015-header flex-none !space-y-0 border-b border-slate-200 px-7 py-5 pr-16 text-left">
            <DialogTitle className="text-[20px] font-bold leading-7 tracking-[-0.02em]">
              Dodaj notatkę
            </DialogTitle>
            <DialogDescription className="sr-only">
              Formularz dodawania notatki powiązanej z leadem.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="forteca-frt-015-form flex min-h-0 flex-1 flex-col" data-forteca-frt-015-note-form="true" aria-describedby={formError ? 'forteca-frt-015-form-error' : undefined}>
            <div className="forteca-frt-015-scroll-area min-h-0 flex-1 space-y-6 overflow-y-auto px-7 py-6">
              {formError ? <p id="forteca-frt-015-form-error" className="forteca-frt-015-error" role="alert">{formError}</p> : null}
              <div className="forteca-frt-015-field space-y-2">
                <Label htmlFor="forteca-frt-015-note-title" className="text-[13px] font-semibold">
                  Tytuł notatki <span className="forteca-frt-015-required">*</span>
                </Label>
                <Input
                  id="forteca-frt-015-note-title"
                  value={noteTitle}
                  onChange={(event) => {
                    setNoteTitle(event.target.value);
                    if (formErrorField === 'title') {
                      setFormError('');
                      setFormErrorField(null);
                    }
                  }}
                  placeholder="Np. Rozmowa telefoniczna – potrzeby klienta"
                  autoComplete="off"
                  aria-required="true"
                  aria-invalid={formErrorField === 'title'}
                  aria-describedby={formErrorField === 'title' ? 'forteca-frt-015-form-error' : undefined}
                  data-forteca-frt-015-note-title="true"
                />
              </div>

              <div className="forteca-frt-015-field space-y-2">
                <Label htmlFor="forteca-frt-015-note-editor" className="text-[13px] font-semibold">
                  Treść notatki <span className="forteca-frt-015-required">*</span>
                </Label>
                <div className="forteca-frt-015-editor-shell" data-forteca-frt-015-editor-shell="true">
                  <div className="forteca-frt-015-toolbar" role="toolbar" aria-label="Formatowanie treści notatki">
                    <select
                      aria-label="Styl tekstu"
                      className="forteca-frt-015-toolbar-select"
                      defaultValue="p"
                      onChange={(event) => runEditorCommand('formatBlock', event.target.value)}
                    >
                      <option value="p">Normalny</option>
                      <option value="h3">Nagłówek</option>
                    </select>
                    <span className="forteca-frt-015-toolbar-divider" aria-hidden="true" />
                    <Button type="button" variant="ghost" size="icon" title="Pogrubienie" aria-label="Pogrubienie" className="forteca-frt-015-toolbar-button" onMouseDown={(event) => { event.preventDefault(); runEditorCommand('bold'); }} onKeyDown={(event) => handleEditorToolbarKeyDown(event, 'bold')}>
                      <Bold className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" title="Kursywa" aria-label="Kursywa" className="forteca-frt-015-toolbar-button" onMouseDown={(event) => { event.preventDefault(); runEditorCommand('italic'); }} onKeyDown={(event) => handleEditorToolbarKeyDown(event, 'italic')}>
                      <Italic className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" title="Podkreślenie" aria-label="Podkreślenie" className="forteca-frt-015-toolbar-button" onMouseDown={(event) => { event.preventDefault(); runEditorCommand('underline'); }} onKeyDown={(event) => handleEditorToolbarKeyDown(event, 'underline')}>
                      <Underline className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <span className="forteca-frt-015-toolbar-divider" aria-hidden="true" />
                    <Button type="button" variant="ghost" size="icon" title="Lista punktowana" aria-label="Lista punktowana" className="forteca-frt-015-toolbar-button" onMouseDown={(event) => { event.preventDefault(); runEditorCommand('insertUnorderedList'); }} onKeyDown={(event) => handleEditorToolbarKeyDown(event, 'insertUnorderedList')}>
                      <List className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" title="Lista numerowana" aria-label="Lista numerowana" className="forteca-frt-015-toolbar-button" onMouseDown={(event) => { event.preventDefault(); runEditorCommand('insertOrderedList'); }} onKeyDown={(event) => handleEditorToolbarKeyDown(event, 'insertOrderedList')}>
                      <ListOrdered className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" title="Dodaj link" aria-label="Dodaj link" className="forteca-frt-015-toolbar-button" onMouseDown={(event) => { event.preventDefault(); handleCreateLink(); }} onKeyDown={(event) => handleEditorToolbarKeyDown(event, 'createLink')}>
                      <Link2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Paperclip className="forteca-frt-015-attachment-icon" aria-hidden="true" />
                  </div>
                  <div
                    id="forteca-frt-015-note-editor"
                    ref={editorRef}
                    role="textbox"
                    aria-label="Treść notatki"
                    aria-multiline="true"
                    aria-required="true"
                    aria-invalid={formErrorField === 'content'}
                    aria-describedby={formErrorField === 'content' ? 'forteca-frt-015-form-error' : undefined}
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Wpisz treść notatki..."
                    className="forteca-frt-015-editor"
                    data-forteca-frt-015-editor="true"
                    onInput={syncEditorState}
                    onPaste={handleEditorPaste}
                  />
                </div>
              </div>

              <div className="forteca-frt-015-field space-y-2">
                <Label className="text-[13px] font-semibold">Sugerowane tagi</Label>
                <div className="forteca-frt-015-suggested-tags flex flex-wrap gap-2">
                  {FRT015_NOTE_TAG_SUGGESTIONS.map((tag) => {
                    const selected = selectedTags.includes(tag);
                    return (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        className={selected ? 'is-selected' : undefined}
                        data-forteca-frt-015-tag={tag}
                        aria-pressed={selected}
                        onClick={() => handleSuggestedTag(tag)}
                      >
                        {tag}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="forteca-frt-015-field space-y-2">
                <Label htmlFor="forteca-frt-015-note-tags" className="text-[13px] font-semibold">Tagi</Label>
                <div className="relative">
                  <Input
                    id="forteca-frt-015-note-tags"
                    value={selectedTags.join(', ')}
                    onChange={(event) => handleTagsChange(event.target.value)}
                    placeholder="Wybierz lub wpisz tagi..."
                    autoComplete="off"
                    list="forteca-frt-015-tag-options"
                    className="pr-10"
                    data-forteca-frt-015-tags="true"
                  />
                  <datalist id="forteca-frt-015-tag-options">
                    {FRT015_NOTE_TAG_SUGGESTIONS.map((tag) => <option key={tag} value={tag} />)}
                  </datalist>
                  <ChevronDown className="forteca-frt-015-control-icon pointer-events-none" aria-hidden="true" />
                </div>
              </div>

              <div className="forteca-frt-015-grid-row grid gap-5 sm:grid-cols-2">
                <div className="forteca-frt-015-field space-y-2">
                  <Label htmlFor="forteca-frt-015-visibility" className="flex items-center gap-1.5 text-[13px] font-semibold">
                    Widoczność
                      <span className="forteca-frt-015-info" title="Określa, kto może zobaczyć tę notatkę." aria-label="Informacja o widoczności">
                      <Info className="forteca-frt-015-control-icon" aria-hidden="true" />
                    </span>
                  </Label>
                  <select
                    id="forteca-frt-015-visibility"
                    value={visibility}
                    onChange={(event) => setVisibility(event.target.value as FRT015Visibility)}
                    className="forteca-frt-015-native-select"
                    data-forteca-frt-015-visibility="true"
                  >
                    {FRT015_NOTE_VISIBILITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="forteca-frt-015-field space-y-2">
                  <Label htmlFor="forteca-frt-015-entry-date" className="text-[13px] font-semibold">
                    Data wpisu <span className="forteca-frt-015-required">*</span>
                  </Label>
                  <div className="forteca-frt-015-date-control relative">
                    <Input
                      id="forteca-frt-015-entry-date"
                      type="date"
                      value={entryDate}
                      onChange={(event) => setEntryDate(event.target.value)}
                      className="pr-10"
                      data-forteca-frt-015-entry-date="true"
                    />
                    <CalendarDays className="forteca-frt-015-control-icon pointer-events-none" aria-hidden="true" />
                    <span className="forteca-frt-015-date-label">{formatDateInputValue(entryDate)}</span>
                  </div>
                </div>
              </div>

              <div className="forteca-frt-015-field space-y-2">
                <Label htmlFor="forteca-frt-015-related-activity" className="text-[13px] font-semibold">
                  Powiązanie z aktywnością
                </Label>
                <div className="forteca-frt-015-control-with-icon relative">
                  <select
                    id="forteca-frt-015-related-activity"
                    value={relatedActivityId}
                    onChange={(event) => setRelatedActivityId(event.target.value)}
                    className="forteca-frt-015-native-select"
                    disabled={recentActivitiesLoading || recentActivities.length === 0}
                    data-forteca-frt-015-related-activity="true"
                  >
                    <option value="">
                      {recentActivitiesLoading ? 'Pobieranie aktywności...' : 'Wybierz lub wyszukaj aktywność...'}
                    </option>
                    {recentActivities.map((activity) => (
                      <option key={activity.id} value={activity.id}>{activityOptionLabel(activity)}</option>
                    ))}
                  </select>
                  <ChevronDown className="forteca-frt-015-control-icon pointer-events-none" aria-hidden="true" />
                </div>
              </div>

              <section className="forteca-frt-015-recent-notes space-y-3 border-t border-slate-100 pt-5" data-forteca-frt-015-recent-notes="true">
                <div className="forteca-frt-015-recent-heading flex items-center justify-between gap-3">
                  <h3>Ostatnie notatki</h3>
                  {recentActivitiesLoading ? <Loader2 className="forteca-frt-015-loading-icon" aria-label="Pobieranie notatek" /> : null}
                </div>
                {recentActivitiesError ? <p className="forteca-frt-015-error">{recentActivitiesError}</p> : null}
                {!recentActivitiesLoading && !recentActivitiesError && recentNoteActivities.length === 0 ? (
                  <p className="forteca-frt-015-empty-notes">
                    Brak zapisanych notatek dla tego leada.
                  </p>
                ) : null}
                <div className="space-y-2.5">
                  {recentNoteActivities.map((activity) => {
                    const payload = getActivityPayload(activity);
                    const noteText = getPayloadText(payload, ['content', 'note', 'text']) || 'Notatka bez treści';
                    const noteTitle = getPayloadText(payload, ['title']) || 'Notatka';
                    const tags = getPayloadTags(payload);
                    return (
                      <article key={activity.id} className="forteca-frt-015-note-row">
                        <div className="forteca-frt-015-note-row-heading flex items-start justify-between gap-3">
                          <h4>{noteTitle}</h4>
                          <time>{formatActivityDisplayDate(activity)}</time>
                        </div>
                        <p>{noteText}</p>
                        <div className="forteca-frt-015-note-row-meta mt-2 flex flex-wrap gap-1.5">
                          {(tags.length ? tags : ['Notatka']).map((tag) => (
                            <span key={tag} data-forteca-frt-015-tag={tag}>{tag}</span>
                          ))}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>

            <DialogFooter className="forteca-frt-015-footer flex-none !flex-row !justify-end !space-x-3 !space-y-0 border-t border-slate-200 px-7 py-4">
              <Button type="button" variant="outline" onClick={closeDialog} disabled={saving}>Anuluj</Button>
              <Button type="submit" disabled={saving || workspaceLoading} data-forteca-frt-015-save="true">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Zapisz notatkę
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : closeDialog())}>
      <DialogContent className="max-w-2xl" data-context-note-dialog-stage85="true">
        <DialogHeader>
          <DialogTitle>Dodaj notatkę</DialogTitle>
          <DialogDescription className="sr-only">
            Formularz dodawania notatki do bieżącego rekordu.
          </DialogDescription>
        </DialogHeader>
        {context?.recordLabel ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900" data-stage85-context-relation="true">
            Powiązanie: {context.recordLabel}
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Treść notatki</Label>
            <Textarea value={note} onChange={(event) => setNote(event.target.value)} rows={8} placeholder="Wpisz notatkę po rozmowie, ustalenia albo ważny kontekst." />
            <p className="text-xs font-medium text-slate-500">Notatka zostanie przypięta do aktualnego rekordu. Nie tworzy zadania ani wydarzenia bez osobnego kliknięcia.</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={saving}>Anuluj</Button>
            <Button type="submit" disabled={saving || workspaceLoading}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Zapisz notatkę</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
