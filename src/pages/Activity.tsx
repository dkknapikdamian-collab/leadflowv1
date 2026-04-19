import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { History, Briefcase, Target, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { fetchActivitiesFromSupabase, isSupabaseConfigured } from '../lib/supabase-fallback';
import { toast } from 'sonner';

function formatWhen(value: any) {
  if (!value) return '';
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleString();
  }
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }
  return '';
}

export default function Activity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      let cancelled = false;
      const load = async () => {
        try {
          setLoading(true);
          const rows = await fetchActivitiesFromSupabase({ limit: 50 });
          if (!cancelled) {
            setActivities(rows as any[]);
          }
        } catch (error: any) {
          if (!cancelled) {
            toast.error(`Błąd aktywności: ${error.message}`);
            setActivities([]);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      void load();
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
      setActivities(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                </div>
              ) : activities.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  Brak zarejestrowanej aktywności.
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="p-6 flex gap-4 items-start hover:bg-slate-50 transition-colors">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      activity.leadId || activity.lead_id ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {activity.leadId || activity.lead_id ? <Target className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-bold text-slate-900">
                          {(activity.actorType || activity.actor_type) === 'operator' ? 'Operator' : 'Klient'}
                          <span className="font-normal text-slate-500 ml-1">
                            {(activity.eventType || activity.event_type) === 'status_changed' ? `zmienił status na ${(activity.payload || {}).status}` :
                             (activity.eventType || activity.event_type) === 'case_created' ? `uruchomił realizację: ${(activity.payload || {}).title}` :
                             (activity.eventType || activity.event_type) === 'item_added' ? `dodał element: ${(activity.payload || {}).title}` :
                             (activity.eventType || activity.event_type) === 'file_uploaded' ? `wgrał plik do: ${(activity.payload || {}).title}` :
                             (activity.eventType || activity.event_type) === 'decision_made' ? `podjął decyzję w: ${(activity.payload || {}).title}` :
                             'wykonał akcję'}
                          </span>
                        </p>
                        <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                          {formatWhen(activity.createdAt || activity.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {(activity.leadId || activity.lead_id) ? 'Lead' : 'Sprawa'}: {activity.leadId || activity.lead_id || activity.caseId || activity.case_id}
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
