import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';

import QuickAiCapture from './QuickAiCapture';
import TodayAiAssistant from './TodayAiAssistant';
import { Button } from './ui/button';
import { fetchCalendarBundleFromSupabase } from '../lib/calendar-items';
import { useWorkspace } from '../hooks/useWorkspace';

type BundleState = {
  leads: Record<string, unknown>[];
  tasks: Record<string, unknown>[];
  events: Record<string, unknown>[];
  cases: Record<string, unknown>[];
};

const emptyBundle: BundleState = {
  leads: [],
  tasks: [],
  events: [],
  cases: [],
};

export default function GlobalQuickActions() {
  const { workspaceReady } = useWorkspace();
  const location = useLocation();
  const [bundle, setBundle] = useState<BundleState>(emptyBundle);
  const [quickCaptureSeed, setQuickCaptureSeed] = useState('');
  const [quickCaptureOpenSignal, setQuickCaptureOpenSignal] = useState(0);

  const refreshBundle = async () => {
    if (!workspaceReady) return;
    try {
      const nextBundle = await fetchCalendarBundleFromSupabase();
      setBundle({
        leads: nextBundle.leads || [],
        tasks: nextBundle.tasks || [],
        events: nextBundle.events || [],
        cases: nextBundle.cases || [],
      });
    } catch {
      // The global action bar must never block the current page.
    }
  };

  useEffect(() => {
    void refreshBundle();
  }, [workspaceReady, location.pathname]);

  const openQuickCaptureFromAssistant = (text: string) => {
    const nextText = String(text || '').trim();
    if (!nextText) return;
    setQuickCaptureSeed(nextText);
    setQuickCaptureOpenSignal((current) => current + 1);
  };

  return (
    <div className="sticky top-16 z-30 border-b border-slate-200 bg-slate-50/95 px-4 py-2 backdrop-blur md:top-0" data-global-quick-actions="true">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-2">
        <TodayAiAssistant
          leads={bundle.leads}
          tasks={bundle.tasks}
          events={bundle.events}
          cases={bundle.cases}
          disabled={!workspaceReady}
          onCaptureRequest={openQuickCaptureFromAssistant}
        />
        <QuickAiCapture
          onSaved={() => void refreshBundle()}
          initialText={quickCaptureSeed}
          openSignal={quickCaptureOpenSignal}
          draftSource="quick_capture"
        />
        <Link to="/leads" className="inline-flex">
          <Button type="button" className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Lead
          </Button>
        </Link>
        <Link to="/tasks" className="inline-flex">
          <Button type="button" variant="outline" className="rounded-xl bg-white">
            <Plus className="mr-2 h-4 w-4" />
            Zadanie
          </Button>
        </Link>
        <Link to="/calendar" className="inline-flex">
          <Button type="button" variant="outline" className="rounded-xl bg-white">
            <Plus className="mr-2 h-4 w-4" />
            Wydarzenie
          </Button>
        </Link>
      </div>
    </div>
  );
}
