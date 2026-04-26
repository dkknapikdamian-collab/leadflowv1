import { useMemo, useState, type ReactNode } from 'react';
import { Mic, Sparkles, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  QUICK_LEAD_SOURCE_LABELS,
  cancelQuickLeadDraft,
  confirmQuickLeadDraft,
  createQuickLeadDraft,
  formatQuickLeadDateForInput,
  fromDateTimeLocalInput,
  normalizeMissingFields,
  sanitizeQuickLeadParsedData,
  validateQuickLeadRawText,
  type QuickLeadDraft,
  type QuickLeadParsedData,
  type QuickLeadPriority,
} from '../../lib/quick-lead-capture';

type QuickLeadCaptureModalProps = {
  trigger: ReactNode;
  disabled?: boolean;
  onConfirm: (data: QuickLeadParsedData) => Promise<void> | void;
};

const PRIORITY_LABELS: Record<QuickLeadPriority, string> = {
  low: 'Niski',
  normal: 'Normalny',
  high: 'Wysoki',
};

export default function QuickLeadCaptureModal({ trigger, disabled = false, onConfirm }: QuickLeadCaptureModalProps) {
  const [open, setOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [draft, setDraft] = useState<QuickLeadDraft | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);

  const parsed = draft?.parsedData ?? null;
  const canProcess = rawText.trim().length >= 5;

  const missingFieldsText = useMemo(() => {
    if (!parsed?.missingFields.length) return null;
    const labels: Record<string, string> = {
      contactName: 'kontakt',
      phone: 'telefon',
      email: 'e-mail',
      source: 'źródło',
      need: 'sprawa',
      nextAction: 'akcja',
      nextActionAt: 'termin',
    };
    return parsed.missingFields.map((field) => labels[field] ?? field).join(', ');
  }, [parsed]);

  const reset = () => {
    setRawText('');
    setDraft(null);
    setConfirmed(false);
    setSaving(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && draft && !confirmed) {
      setDraft(cancelQuickLeadDraft(draft));
    }
    setOpen(nextOpen);
    if (!nextOpen) reset();
  };

  const handleProcess = () => {
    const validation = validateQuickLeadRawText(rawText);
    if (!validation.ok) {
      toast.error(validation.message ?? 'Nie udało się przygotować szkicu.');
      return;
    }

    const nextDraft = createQuickLeadDraft(rawText);
    setDraft(nextDraft);
    toast.success('Przygotowaliśmy szkic. Sprawdź dane przed zapisem.');
  };

  const updateParsed = <K extends keyof QuickLeadParsedData>(key: K, value: QuickLeadParsedData[K]) => {
    if (!draft?.parsedData) return;
    const nextParsed = normalizeMissingFields({ ...draft.parsedData, [key]: value });
    setDraft({ ...draft, parsedData: nextParsed, updatedAt: new Date().toISOString() });
  };

  const handleConfirm = async () => {
    if (!draft?.parsedData) return;
    const sanitized = sanitizeQuickLeadParsedData(draft.parsedData);

    setSaving(true);
    try {
      await onConfirm(sanitized);
      setDraft(confirmQuickLeadDraft({ ...draft, parsedData: sanitized }));
      setConfirmed(true);
      toast.success('Lead zapisany. Tekst dyktowania został usunięty.');
      setOpen(false);
      reset();
    } catch (error: any) {
      toast.error(error?.message ? `Błąd zapisu: ${error.message}` : 'Nie udało się zapisać leada.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Dodaj szybkiego leada
          </DialogTitle>
          <DialogDescription>
            Wpisz albo podyktuj krótką notatkę po rozmowie. Aplikacja przygotuje szkic, ale nic nie zapisze bez Twojego potwierdzenia.
          </DialogDescription>
        </DialogHeader>

        {!draft?.parsedData ? (
          <div className="space-y-4 py-2">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
              Na telefonie użyj mikrofonu z klawiatury systemowej. To nie nagrywa rozmowy, tylko pomaga szybko wpisać notatkę.
            </div>
            <div className="space-y-2">
              <Label>Notatka po rozmowie</Label>
              <Textarea
                value={rawText}
                onChange={(event) => setRawText(event.target.value)}
                placeholder="Np. Pani Anna z Tarnowa chce wycenę mieszkania, zadzwonić jutro po 15, przyszła z Facebooka."
                className="min-h-36 resize-y rounded-2xl"
                maxLength={5000}
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Minimum 5 znaków. Maksymalnie 5000 znaków.</span>
                <span>{rawText.length}/5000</span>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" type="button" onClick={() => handleOpenChange(false)}>
                Anuluj
              </Button>
              <Button type="button" onClick={handleProcess} disabled={!canProcess}>
                <Sparkles className="mr-2 h-4 w-4" />
                Przetwórz notatkę
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-semibold">To jest szkic. Sprawdź dane przed zapisem.</p>
                  <p>Po zatwierdzeniu utworzymy leada, opcjonalne zadanie i usuniemy tekst dyktowania.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <Label>Tekst podyktowany / wpisany</Label>
                <Badge variant="outline" className="rounded-full">parser regułowy</Badge>
              </div>
              <p className="whitespace-pre-wrap text-sm text-slate-700">{draft.rawText}</p>
            </div>

            {missingFieldsText && (
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                Brakuje lub wymaga sprawdzenia: <span className="font-semibold text-slate-900">{missingFieldsText}</span>.
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Kontakt</Label>
                <Input value={parsed.contactName ?? ''} onChange={(e) => updateParsed('contactName', e.target.value || null)} placeholder="Pan Marek" />
              </div>
              <div className="space-y-2">
                <Label>Firma</Label>
                <Input value={parsed.companyName ?? ''} onChange={(e) => updateParsed('companyName', e.target.value || null)} placeholder="Opcjonalnie" />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input value={parsed.phone ?? ''} onChange={(e) => updateParsed('phone', e.target.value || null)} placeholder="516 439 989" />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" value={parsed.email ?? ''} onChange={(e) => updateParsed('email', e.target.value || null)} placeholder="kontakt@example.pl" />
              </div>
              <div className="space-y-2">
                <Label>Źródło</Label>
                <Select value={parsed.source ?? 'other'} onValueChange={(value) => updateParsed('source', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(QUICK_LEAD_SOURCE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priorytet</Label>
                <Select value={parsed.priority} onValueChange={(value) => updateParsed('priority', value as QuickLeadPriority)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Sprawa / potrzeba</Label>
                <Input value={parsed.need ?? ''} onChange={(e) => updateParsed('need', e.target.value || null)} placeholder="Oferta na stronę, wycena mieszkania..." />
              </div>
              <div className="space-y-2">
                <Label>Następna akcja</Label>
                <Input value={parsed.nextAction ?? ''} onChange={(e) => updateParsed('nextAction', e.target.value || null)} placeholder="Oddzwonić, wysłać ofertę..." />
              </div>
              <div className="space-y-2">
                <Label>Termin akcji</Label>
                <Input
                  type="datetime-local"
                  value={formatQuickLeadDateForInput(parsed.nextActionAt)}
                  onChange={(e) => updateParsed('nextActionAt', fromDateTimeLocalInput(e.target.value))}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" type="button" onClick={() => handleOpenChange(false)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Anuluj szkic
              </Button>
              <Button type="button" onClick={handleConfirm} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Zatwierdź i zapisz
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
