import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  MessageSquare,
  Check,
  X,
  Paperclip,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import {
  createPortalSessionFromSupabase,
  fetchPortalCaseBundleFromSupabase,
  insertPortalActivityToSupabase,
  isSupabaseConfigured,
  submitPortalCaseItemInSupabase,
  uploadPortalFileInSupabase,
} from '../lib/supabase-fallback';

const SENSITIVE_INPUT_PATTERN = /\b(haslo|hasło|password|passcode|secret|credential|login|api[_ -]?key|token)\b/i;

function containsSensitiveText(value: string) {
  return SENSITIVE_INPUT_PATTERN.test(value);
}

export default function ClientPortal() {
  const { caseId, token } = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [portalSession, setPortalSession] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [invalidReason, setInvalidReason] = useState('Link wygasł lub jest nieprawidłowy');

  async function refreshSupabasePortal(session?: string) {
    if (!caseId) return;
    const activeSession = session || portalSession;
    if (!activeSession) return;
    const bundle = await fetchPortalCaseBundleFromSupabase(caseId, activeSession);
    setCaseData(bundle.caseRow);
    setItems(bundle.items);
  }

  useEffect(() => {
    if (!caseId || !token) return;

    let cancelled = false;
    setLoading(true);

    if (!isSupabaseConfigured()) {
      setInvalidReason('Portal klienta wymaga skonfigurowanego Supabase.');
      setIsValid(false);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    createPortalSessionFromSupabase(caseId, token)
      .then(async (sessionResult) => {
        if (cancelled) return;
        setPortalSession(sessionResult.portalSession);
        setIsValid(true);
        await refreshSupabasePortal(sessionResult.portalSession);
        if (!cancelled) setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        setIsValid(false);
        setInvalidReason('Link wygasł, jest nieprawidłowy albo portal nie został jeszcze przygotowany.');
      });

    return () => {
      cancelled = true;
    };
  }, [caseId, token]);

  const handleSubmitResponse = async () => {
    if (!selectedItem || !caseId || !portalSession) return;
    setUploading(true);

    try {
      const trimmedResponse = (response || '').trim();
      if (trimmedResponse && containsSensitiveText(trimmedResponse)) {
        throw new Error('SENSITIVE_CREDENTIALS_NOT_ALLOWED');
      }

      let encodedFile: { name: string; type: string; size: number; dataBase64: string } | null = null;
      if (file) {
        const allowedTypes = new Set([
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/webp',
          'text/plain',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]);
        if (!allowedTypes.has(file.type)) {
          throw new Error('PORTAL_FILE_TYPE_NOT_ALLOWED');
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('PORTAL_FILE_SIZE_LIMIT');
        }
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
        encodedFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          dataBase64: btoa(binary),
        };
      }

      let uploadedPath: string | null = null;
      let uploadedName: string | null = null;
      if (encodedFile) {
        const uploaded = await uploadPortalFileInSupabase({
          caseId,
          itemId: selectedItem.id,
          portalSession,
          file: encodedFile,
        });
        uploadedPath = uploaded.filePath;
        uploadedName = uploaded.fileName;
      }

      await submitPortalCaseItemInSupabase({
        id: selectedItem.id,
        caseId: caseId!,
        portalSession,
        status: 'uploaded',
        response: trimmedResponse || selectedItem.response || null,
        filePath: uploadedPath,
        fileName: uploadedName,
      });

      await insertPortalActivityToSupabase({
        caseId,
        portalSession,
        eventType: file ? 'file_uploaded' : 'response_sent',
        payload: { title: selectedItem.title },
      });

      await refreshSupabasePortal();

      toast.success('Przesłano pomyślnie!');
      setIsUploadOpen(false);
      setResponse('');
      setFile(null);
      setSelectedItem(null);
    } catch (error: any) {
      if (error?.message === 'SENSITIVE_CREDENTIALS_NOT_ALLOWED') {
        toast.error('Nie wpisuj haseł ani sekretów. Prześlij dokument albo neutralną notatkę.');
        return;
      }
      toast.error('Błąd: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDecision = async (itemId: string, decision: 'accepted' | 'rejected', title: string) => {
    if (!caseId || !portalSession) return;
    try {
      await submitPortalCaseItemInSupabase({
        id: itemId,
        caseId: caseId!,
        portalSession,
        status: decision === 'accepted' ? 'accepted' : 'rejected',
      });

      await insertPortalActivityToSupabase({
        caseId,
        portalSession,
        eventType: 'decision_made',
        payload: { title, decision },
      });

      await refreshSupabasePortal();

      toast.success(decision === 'accepted' ? 'Zaakceptowano!' : 'Odrzucono.');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!isValid) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full text-center p-8">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Portal niedostępny</h2>
        <p className="text-slate-500 mb-6">{invalidReason}</p>
      </Card>
    </div>
  );

  const completedCount = items.filter(i => i.status === 'accepted').length;
  const totalCount = items.length;
  const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-primary text-white py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{caseData.title}</h1>
          <p className="text-white/70 mb-8">Witaj! Poniżej znajdziesz listę rzeczy, których potrzebujemy od Ciebie, aby ruszyć dalej z projektem.</p>

          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-md mx-auto">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span>Twój postęp</span>
              <span>{completedCount} / {totalCount} gotowe</span>
            </div>
            <Progress value={percent} className="h-3 bg-white/20" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-8">
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className={`border-none shadow-sm transition-all ${
              item.status === 'accepted' ? 'opacity-70' : 'hover:shadow-md'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    item.status === 'accepted' ? 'bg-green-100 text-green-600' :
                    item.status === 'uploaded' ? 'bg-blue-100 text-blue-600' :
                    item.status === 'rejected' ? 'bg-red-100 text-red-600' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {item.status === 'accepted' ? <CheckCircle2 className="w-5 h-5" /> :
                     item.status === 'uploaded' ? <Clock className="w-5 h-5" /> :
                     item.status === 'rejected' ? <AlertCircle className="w-5 h-5" /> :
                     <FileText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                      {item.isRequired && <span className="text-[10px] h-4 px-1.5 border border-red-200 text-red-500 rounded-full inline-flex items-center">Wymagane</span>}
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{item.description}</p>

                    {(item.fileUrl || item.response) && (
                      <div className="mb-4 p-3 bg-slate-100 rounded-xl text-sm space-y-2">
                        {item.fileUrl && (
                          <div className="flex items-center gap-2 text-primary font-medium">
                            <Paperclip className="w-4 h-4" />
                            <span className="truncate">{item.fileName || 'Przesłany plik'}</span>
                          </div>
                        )}
                        {item.response && (
                          <div className="flex items-start gap-2 text-slate-600 italic">
                            <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{item.response}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {item.status === 'accepted' ? (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                        <Check className="w-4 h-4" />
                        Gotowe
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {item.type === 'file' && (
                          <Dialog open={isUploadOpen && selectedItem?.id === item.id} onOpenChange={(open) => {
                            setIsUploadOpen(open);
                            if (open) setSelectedItem(item);
                          }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="gap-2">
                                <Upload className="w-4 h-4" />
                                {item.status === 'uploaded' ? 'Zmień plik' : 'Wgraj plik'}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Wgraj plik: {item.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Wybierz plik</Label>
                                  <Input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Komentarz (opcjonalnie)</Label>
                                  <Textarea placeholder="Dodaj wiadomość dla opiekuna..." value={response} onChange={e => setResponse(e.target.value)} />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Anuluj</Button>
                                <Button onClick={handleSubmitResponse} disabled={uploading || !file}>
                                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Wyślij'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        {item.type === 'text' && (
                          <Dialog open={isUploadOpen && selectedItem?.id === item.id} onOpenChange={(open) => {
                            setIsUploadOpen(open);
                            if (open) setSelectedItem(item);
                          }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="gap-2">
                                <MessageSquare className="w-4 h-4" />
                                {item.status === 'uploaded' ? 'Zmień odpowiedź' : 'Odpowiedz'}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Twoja odpowiedź: {item.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                                  Nie wpisuj haseł, loginów ani sekretów. Użyj załącznika lub neutralnej informacji.
                                </div>
                                <div className="space-y-2">
                                  <Label>Treść odpowiedzi</Label>
                                  <Textarea placeholder="Wpisz swoją odpowiedź tutaj..." value={response} onChange={e => setResponse(e.target.value)} />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Anuluj</Button>
                                <Button onClick={handleSubmitResponse} disabled={uploading || !response}>
                                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Wyślij'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        {item.type === 'decision' && (
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="gap-2 text-green-600 hover:bg-green-50" onClick={() => handleDecision(item.id, 'accepted', item.title)}>
                              <Check className="w-4 h-4" />
                              Tak / Akceptuję
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2 text-red-600 hover:bg-red-50" onClick={() => handleDecision(item.id, 'rejected', item.title)}>
                              <X className="w-4 h-4" />
                              Nie / Odrzucam
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
