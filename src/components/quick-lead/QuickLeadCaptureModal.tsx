import { useMemo, useState } from 'react';
import { Loader2, Mic, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from '../../firebase';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { parseQuickLeadNote, type QuickLeadDraft } from '../../lib/quick-lead-parser';
import { archiveAiLeadDraftAsync, markAiLeadDraftConvertedAsync, saveAiLeadDraftAsync, updateAiLeadDraftAsync } from '../../lib/ai-drafts';
import { insertLeadToSupabase, insertTaskToSupabase } from '../../lib/supabase-fallback';
import { requireWorkspaceId } from '../../lib/workspace-context';
import '../../styles/quick-lead-capture-stage27.css';

export const QUICK_LEAD_CAPTURE_MODAL_STAGE27 = 'QUICK_LEAD_CAPTURE_MODAL_STAGE27';

type QuickLeadCaptureModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace: any;
  hasAccess: boolean;
  onLeadCreated?: () => void | Promise<void>;
};

const SOURCE_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefon' },
  { value: 'form', label: 'Formularz' },
  { value: 'referral', label: 'Polecenie' },
  { value: 'other', label: 'Inne' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Niski' },
  { value: 'medium', label: 'Normalny' },
  { value: 'high', label: 'Wysoki' },
];

function makeEmptyDraft(): QuickLeadDraft {
  return {
    contactName: '',
    phone: '',
    email: '',
    source: 'other',
    need: '',
    nextAction: '',
    dueAt: '',
    priority: 'medium',
  };
}

function getDraftName(draft: QuickLeadDraft) {
  return draft.contactName.trim() || draft.phone.trim() || draft.email.trim() || 'Lead bez nazwy';
}

function createParsedDraftPayload(draft: QuickLeadDraft) {
  return {
    contactName: draft.contactName.trim(),
    phone: draft.phone.trim(),
    email: draft.email.trim(),
    source: draft.source || 'other',
    need: draft.need.trim(),
    nextAction: draft.nextAction.trim(),
    dueAt: draft.dueAt || '',
    priority: draft.priority || 'medium',
  };
}

function getLeadRecordId(record: Record<string, unknown> | null | undefined) {
  if (!record) return '';
  return String(record.id || record.leadId || record.lead_id || '').trim();
}

export function QuickLeadCaptureModal({ open, onOpenChange, workspace, hasAccess, onLeadCreated }: QuickLeadCaptureModalProps) {
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [rawText, setRawText] = useState('');
  const [draft, setDraft] = useState<QuickLeadDraft>(() => makeEmptyDraft());
  const [draftId, setDraftId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canProcess = useMemo(() => rawText.trim().length >= 3, [rawText]);

  const reset = () => {
    setStep('input');
    setRawText('');
    setDraft(makeEmptyDraft());
    setDraftId(null);
    setProcessing(false);
    setSubmitting(false);
  };

  const closeAndReset = () => {
    onOpenChange(false);
    reset();
  };

  const handleProcessNote = async () => {
    const cleanText = rawText.trim();
    if (!cleanText) {
      toast.error('Wpisz krótką notatkę po rozmowie.');
      return;
    }

    try {
      setProcessing(true);
      const parsed = parseQuickLeadNote(cleanText);
      setDraft(parsed);

      const savedDraft = await saveAiLeadDraftAsync({
        rawText: cleanText,
        parsedDraft: createParsedDraftPayload(parsed),
        source: 'quick_capture',
        type: 'lead',
      });

      setDraftId(savedDraft.id);
      setStep('review');
      toast.success('Szkic leada przygotowany. Sprawdź dane przed zapisem.');
    } catch {
      toast.error('Nie udało się przygotować szkicu. Spróbuj krótszą notatkę.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveDraftOnly = async () => {
    try {
      setSubmitting(true);
      const payload = createParsedDraftPayload(draft);
      if (draftId) {
        await updateAiLeadDraftAsync(draftId, { parsedDraft: payload, parsedData: payload });
      } else if (rawText.trim()) {
        const savedDraft = await saveAiLeadDraftAsync({ rawText: rawText.trim(), parsedDraft: payload, source: 'quick_capture', type: 'lead' });
        setDraftId(savedDraft.id);
      }
      toast.success('Szkic zapisany do sprawdzenia.');
      closeAndReset();
    } catch {
      toast.error('Nie udało się zapisać szkicu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!hasAccess) {
      toast.error('Trial wygasł.');
      return;
    }

    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) {
      toast.error('Kontekst workspace nie jest jeszcze gotowy.');
      return;
    }

    const name = getDraftName(draft);
    if (!name && !draft.phone && !draft.email) {
      toast.error('Uzupełnij kontakt, telefon albo e-mail.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = createParsedDraftPayload(draft);
      const leadRecord = await insertLeadToSupabase({
        name,
        phone: payload.phone,
        email: payload.email,
        source: payload.source,
        summary: payload.need,
        notes: payload.need,
        status: 'new',
        isAtRisk: payload.priority === 'high',
        nextActionAt: payload.dueAt || undefined,
        ownerId: workspace?.ownerId || auth.currentUser?.uid,
        workspaceId,
      } as any);

      const leadId = getLeadRecordId(leadRecord as Record<string, unknown>);

      if (payload.nextAction && payload.dueAt) {
        await insertTaskToSupabase({
          title: payload.nextAction,
          type: 'follow_up',
          date: payload.dueAt.slice(0, 10),
          scheduledAt: payload.dueAt,
          dueAt: payload.dueAt,
          priority: payload.priority,
          status: 'todo',
          leadId: leadId || null,
          ownerId: auth.currentUser?.uid || workspace?.ownerId,
          workspaceId,
        });
      }

      if (draftId) {
        await markAiLeadDraftConvertedAsync(draftId, {
          linkedRecordId: leadId || null,
          linkedRecordType: 'lead',
          parsedDraft: { ...payload, rawText: '' },
        });
      }

      setRawText('');
      toast.success('Lead zapisany.');
      await onLeadCreated?.();
      closeAndReset();
    } catch (error: any) {
      toast.error('Nie udało się zapisać leada. Sprawdź pola i spróbuj ponownie.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    try {
      if (draftId) {
        await archiveAiLeadDraftAsync(draftId);
      }
    } catch {
      // Local reset below is the privacy fallback.
    }
    setRawText('');
    closeAndReset();
  };

  const updateDraft = (patch: Partial<QuickLeadDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : void handleCancel())}>
      <DialogContent className="quick-lead-stage27-modal" data-stage27-quick-lead-modal="true" aria-describedby="quick-lead-stage27-description">
        {step === 'input' ? (
          <>
            <DialogHeader className="quick-lead-stage27-header">
              <span className="quick-lead-stage27-kicker">Szybki lead z notatki</span>
              <DialogTitle>Dodaj szybkiego leada</DialogTitle>
              <p id="quick-lead-stage27-description">
                Wpisz albo podyktuj notatkę po rozmowie. Aplikacja przygotuje szkic, ale nic nie zapisze bez Twojego potwierdzenia.
              </p>
            </DialogHeader>

            <div className="quick-lead-stage27-body">
              <Label htmlFor="quick-lead-stage27-raw">Notatka</Label>
              <textarea
                id="quick-lead-stage27-raw"
                className="quick-lead-stage27-textarea"
                value={rawText}
                onChange={(event) => setRawText(event.target.value)}
                placeholder="Np. Pani Anna z Tarnowa chce wycenę mieszkania, zadzwonić jutro po 15, przyszła z Facebooka."
                rows={7}
              />
              <p className="quick-lead-stage27-hint">
                Dyktowanie działa przez klawiaturę telefonu. Nie nagrywamy rozmów i nie zapisujemy finalnego leada bez zatwierdzenia.
              </p>
            </div>

            <DialogFooter className="quick-lead-stage27-footer">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={processing}>
                Anuluj
              </Button>
              <Button type="button" onClick={handleProcessNote} disabled={!canProcess || processing} data-stage27-process-note="true">
                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Przetwórz notatkę
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="quick-lead-stage27-header">
              <span className="quick-lead-stage27-kicker">Szkic przed zapisem</span>
              <DialogTitle>Sprawdź przed zapisem</DialogTitle>
              <p id="quick-lead-stage27-description">
                To jest szkic. Nic nie zostanie zapisane jako lead, dopóki nie zatwierdzisz.
              </p>
            </DialogHeader>

            <div className="quick-lead-stage27-review-grid" data-stage27-review-fields="true">
              <div className="quick-lead-stage27-field quick-lead-stage27-field-wide">
                <Label>Kontakt</Label>
                <Input value={draft.contactName} onChange={(event) => updateDraft({ contactName: event.target.value })} placeholder="Imię, nazwisko albo nazwa kontaktu" />
              </div>

              <div className="quick-lead-stage27-field">
                <Label>Telefon</Label>
                <Input value={draft.phone} onChange={(event) => updateDraft({ phone: event.target.value })} placeholder="Telefon" />
              </div>

              <div className="quick-lead-stage27-field">
                <Label>E-mail</Label>
                <Input type="email" value={draft.email} onChange={(event) => updateDraft({ email: event.target.value })} placeholder="E-mail" />
              </div>

              <div className="quick-lead-stage27-field">
                <Label>Źródło</Label>
                <select className="quick-lead-stage27-select" value={draft.source} onChange={(event) => updateDraft({ source: event.target.value })}>
                  {SOURCE_OPTIONS.map((source) => <option key={source.value} value={source.value}>{source.label}</option>)}
                </select>
              </div>

              <div className="quick-lead-stage27-field">
                <Label>Priorytet</Label>
                <select className="quick-lead-stage27-select" value={draft.priority} onChange={(event) => updateDraft({ priority: event.target.value as QuickLeadDraft['priority'] })}>
                  {PRIORITY_OPTIONS.map((priority) => <option key={priority.value} value={priority.value}>{priority.label}</option>)}
                </select>
              </div>

              <div className="quick-lead-stage27-field quick-lead-stage27-field-wide">
                <Label>Temat / potrzeba</Label>
                <Input value={draft.need} onChange={(event) => updateDraft({ need: event.target.value })} placeholder="Czego potrzebuje lead?" />
              </div>

              <div className="quick-lead-stage27-field quick-lead-stage27-field-wide">
                <Label>Następna akcja</Label>
                <Input value={draft.nextAction} onChange={(event) => updateDraft({ nextAction: event.target.value })} placeholder="Np. zadzwonić jutro po 15" />
              </div>

              <div className="quick-lead-stage27-field quick-lead-stage27-field-wide">
                <Label>Termin</Label>
                <Input type="datetime-local" value={draft.dueAt} onChange={(event) => updateDraft({ dueAt: event.target.value })} />
              </div>
            </div>

            <DialogFooter className="quick-lead-stage27-footer">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
                Anuluj
              </Button>
              <Button type="button" variant="outline" onClick={handleSaveDraftOnly} disabled={submitting} data-stage27-save-draft="true">
                Zapisz jako szkic
              </Button>
              <Button type="button" onClick={handleConfirm} disabled={submitting} data-stage27-confirm-lead="true">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mic className="mr-2 h-4 w-4" />}
                Zatwierdź i zapisz
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
