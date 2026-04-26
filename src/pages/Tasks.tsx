import { useState, useEffect, FormEvent } from 'react';
import { auth, db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { useWorkspace } from '../hooks/useWorkspace';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  CheckSquare, 
  Square, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit2,
  Calendar,
  Loader2,
  X
} from 'lucide-react';
import { format, isToday, isPast, parseISO, isTomorrow, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const TASK_TYPES = [
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'phone', label: 'Telefon' },
  { value: 'reply', label: 'Odpisać' },
  { value: 'send_offer', label: 'Wysłać ofertę' },
  { value: 'meeting', label: 'Spotkanie' },
  { value: 'other', label: 'Inne' },
];

export default function Tasks() {
  const { workspace, hasAccess } = useWorkspace();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todo');
  const [typeFilter, setTypeFilter] = useState('all');

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', type: 'follow_up', date: format(new Date(), 'yyyy-MM-dd'), priority: 'medium' });

  useEffect(() => {
    if (!auth.currentUser || !workspace) return;

    const q = query(
      collection(db, 'tasks'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('date', 'asc'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [workspace]);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!newTask.title) return toast.error('Wpisz tytuł zadania');

    try {
      await addDoc(collection(db, 'tasks'), {
        ...newTask,
        status: 'todo',
        scheduledAt: newTask.date,
        dueAt: newTask.date,
        ownerId: auth.currentUser?.uid,
        workspaceId: workspace.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Zadanie dodane');
      setIsNewTaskOpen(false);
      setNewTask({ title: '', type: 'follow_up', date: format(new Date(), 'yyyy-MM-dd'), priority: 'medium' });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: currentStatus === 'todo' ? 'done' : 'todo',
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!window.confirm('Usunąć zadanie?')) return;
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      toast.success('Zadanie usunięte');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const groupedTasks = filteredTasks.reduce((acc: any, task) => {
    const date = task.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedTasks).sort();

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Zadania</h1>
            <p className="text-slate-500">Zarządzaj swoją codzienną egzekucją.</p>
          </div>
          <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" /> Nowe zadanie
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Dodaj zadanie</DialogTitle></DialogHeader>
              <form onSubmit={handleAddTask} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Tytuł zadania</Label>
                  <Input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Typ</Label>
                    <Select value={newTask.type} onValueChange={v => setNewTask({...newTask, type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TASK_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input type="date" value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Priorytet</Label>
                  <Select value={newTask.priority} onValueChange={v => setNewTask({...newTask, priority: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Niski</SelectItem>
                      <SelectItem value="medium">Średni</SelectItem>
                      <SelectItem value="high">Wysoki</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">Dodaj zadanie</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {/* Filters */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Szukaj zadania..." 
                className="pl-10 rounded-xl bg-slate-50 border-none h-11"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="todo">Do zrobienia</SelectItem>
                  <SelectItem value="done">Zrobione</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie typy</SelectItem>
                  {TASK_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-slate-500">Ładowanie zadań...</p>
            </div>
          ) : sortedDates.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Brak zadań</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-1">Wszystko zrobione! Możesz odpocząć lub dodać nowe zadanie.</p>
            </div>
          ) : (
            sortedDates.map(date => {
              const dateObj = parseISO(date);
              const isOverdue = isPast(dateObj) && !isToday(dateObj);
              const dateLabel = isToday(dateObj) ? 'Dzisiaj' : isTomorrow(dateObj) ? 'Jutro' : format(dateObj, 'EEEE, d MMMM', { locale: pl });

              return (
                <div key={date} className="space-y-3">
                  <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isOverdue ? 'text-rose-600' : 'text-slate-400'}`}>
                    {isOverdue && <AlertTriangle className="w-4 h-4" />}
                    {dateLabel}
                  </h3>
                  <div className="grid gap-3">
                    {groupedTasks[date].map((task: any) => (
                      <Card key={task.id} className={`border-none shadow-sm group transition-all ${task.status === 'done' ? 'opacity-60' : ''}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <button 
                              onClick={() => toggleTask(task.id, task.status)}
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                                task.status === 'done' ? 'bg-primary border-primary text-white' : 'border-slate-200 hover:border-primary'
                              }`}
                            >
                              {task.status === 'done' && <CheckSquare className="w-4 h-4" />}
                            </button>
                            <div className="flex-1">
                              <p className={`font-bold text-slate-900 ${task.status === 'done' ? 'line-through' : ''}`}>{task.title}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold h-5">{TASK_TYPES.find(t => t.value === task.type)?.label}</Badge>
                                {task.priority === 'high' && <Badge variant="destructive" className="text-[10px] uppercase font-bold h-5">Wysoki</Badge>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="w-4 h-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-rose-600"><Trash2 className="w-4 h-4 mr-2" /> Usuń</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
