import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, storage } from '../firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  updateDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
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

export default function ClientPortal() {
  const { caseId, token } = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!caseId || !token) return;

    async function validateToken() {
      const tokenRef = doc(db, 'client_portal_tokens', caseId!);
      const tokenSnap = await getDoc(tokenRef);
      
      if (tokenSnap.exists() && tokenSnap.data().token === token) {
        setIsValid(true);
        
        const caseRef = doc(db, 'cases', caseId!);
        onSnapshot(caseRef, (doc) => {
          if (doc.exists()) setCaseData({ id: doc.id, ...doc.data() });
        });

        const itemsRef = collection(db, 'cases', caseId!, 'items');
        const qItems = query(itemsRef, orderBy('order', 'asc'));
        onSnapshot(qItems, (snapshot) => {
          setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });
      } else {
        setLoading(false);
        setIsValid(false);
      }
    }

    validateToken();
  }, [caseId, token]);

  const handleSubmitResponse = async () => {
    if (!selectedItem) return;
    setUploading(true);

    try {
      let fileUrl = selectedItem.fileUrl || null;
      let fileName = selectedItem.fileName || null;

      if (file) {
        const storageRef = ref(storage, `cases/${caseId}/${selectedItem.id}/${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(uploadResult.ref);
        fileName = file.name;
      }

      await updateDoc(doc(db, 'cases', caseId!, 'items', selectedItem.id), {
        status: 'uploaded',
        response: response || selectedItem.response || null,
        fileUrl,
        fileName,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, 'activities'), {
        caseId,
        ownerId: caseData.ownerId,
        actorType: 'client',
        eventType: file ? 'file_uploaded' : 'response_sent',
        payload: { title: selectedItem.title },
        createdAt: serverTimestamp(),
      });

      toast.success('Przesłano pomyślnie!');
      setIsUploadOpen(false);
      setResponse('');
      setFile(null);
      setSelectedItem(null);
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDecision = async (itemId: string, decision: 'accepted' | 'rejected', title: string) => {
    try {
      await updateDoc(doc(db, 'cases', caseId!, 'items', itemId), {
        status: decision === 'accepted' ? 'accepted' : 'rejected',
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, 'activities'), {
        caseId,
        ownerId: caseData.ownerId,
        actorType: 'client',
        eventType: 'decision_made',
        payload: { title, decision },
        createdAt: serverTimestamp(),
      });

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
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Link wygasł lub jest nieprawidłowy</h2>
        <p className="text-slate-500 mb-6">Skontaktuj się z opiekunem projektu, aby otrzymać nowy link dostępu.</p>
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
                      {item.isRequired && <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-red-200 text-red-500">Wymagane</Badge>}
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
                        {(item.type === 'text' || item.type === 'access') && (
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
                                <DialogTitle>{item.type === 'access' ? 'Podaj dane dostępu' : 'Twoja odpowiedź'}: {item.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>{item.type === 'access' ? 'Login, hasło, link' : 'Treść odpowiedzi'}</Label>
                                  <Textarea placeholder={item.type === 'access' ? 'Wpisz dane dostępu tutaj...' : 'Wpisz swoją odpowiedź tutaj...'} value={response} onChange={e => setResponse(e.target.value)} />
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
