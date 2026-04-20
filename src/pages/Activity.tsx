import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Briefcase, Loader2, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { fetchActivitiesFromSupabase, isSupabaseConfigured } from '../lib/supabase-fallback';
import { toast } from 'sonner';

function formatActivityTime(value: any) {
  if (!value) return 'Brak daty';
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 'Brak daty' : parsed.toLocaleString();
  }
  if (typeof value?.toDate === 'function') {
    return value.toDate().toLocaleString();
  }
  return 'Brak daty';
}

export default function Activity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      let cancelled = false;
      setLoading(true);

      fetchActivitiesFromSupabase({ limit: 50 })
        .then((rows) => {
          if (cancelled) return;
          setActivities(rows);
          setLoading(false);
        })
        .catch((error: any) => {
          if (cancelled) return;
          toast.error(`Błąd aktywności API: ${error.message}`);
          setActivities([]);
          setLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }

    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'activities'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Aktywność</h1>
          <p className="text-slate-500">Historia wszystkich zdarzeń w Twoim systemie.</p>
        </header>

        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                </div>
              ) : activities.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  Brak zarejestrowanej aktywności.
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="p-6 flex gap-4 items-start hover:bg-slate-50 transition-colors">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      activity.leadId ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {activity.leadId ? <Target className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-bold text-slate-900">
                          {activity.actorType === 'operator' ? 'Operator' : 'Klient'}
                          <span className="font-normal text-slate-500 ml-1">
                            {activity.eventType === 'status_changed' ? `zmienił status na ${activity.payload?.status}` :
                             activity.eventType === 'case_created' ? `uruchomił realizację: ${activity.payload?.title}` :
                             activity.eventType === 'item_added' ? `dodał element: ${activity.payload?.title}` :
                             activity.eventType === 'file_uploaded' ? `wgrał plik do: ${activity.payload?.title}` :
                             activity.eventType === 'decision_made' ? `podjął decyzję w: ${activity.payload?.title}` :
                             activity.eventType === 'portal_token_created' ? `wygenerował link portalu dla: ${activity.payload?.title}` :
                             activity.eventType === 'case_reminder_requested' ? `wysłał przypomnienie i utworzył follow-up` :
                             activity.eventType === 'reminder_scheduled' ? `zaplanował przypomnienie: ${activity.payload?.title || 'pozycja'}` :
                             'wykonał akcję'}
                          </span>
                        </p>
                        <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                          {formatActivityTime(activity.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {activity.leadId ? 'Lead' : 'Sprawa'}: {activity.leadId || activity.caseId || 'Brak'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
