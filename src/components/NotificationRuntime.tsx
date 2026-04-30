import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { fetchCalendarBundleFromSupabase } from '../lib/calendar-items';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  buildRuntimeNotificationItems,
  getBrowserNotificationPermission,
  getBrowserNotificationsEnabled,
  recordDeliveredNotification,
  supportsBrowserNotifications,
  hasDeliveredNotification,
  getNotificationDeliveryKey,
} from '../lib/notifications';

type NotificationRuntimeProps = {
  enabled: boolean;
};

export default function NotificationRuntime({ enabled }: NotificationRuntimeProps) {
  const scanPendingRef = useRef(false);
  const { profile, workspace, loading } = useWorkspace();

  useEffect(() => {
    if (!enabled) return;
    if (loading) return;
    if (!workspace?.id) return;

    let cancelled = false;

    const runScan = async () => {
      if (scanPendingRef.current) return;
      scanPendingRef.current = true;

      try {
        const bundle = await fetchCalendarBundleFromSupabase();
        if (cancelled) return;

        const items = buildRuntimeNotificationItems(bundle, new Date());
        const permission = getBrowserNotificationPermission();
        const browserEnabled =
          typeof profile?.browserNotificationsEnabled === 'boolean'
            ? profile.browserNotificationsEnabled
            : getBrowserNotificationsEnabled();
        const pageVisible = typeof document !== 'undefined' ? document.visibilityState === 'visible' : true;

        for (const item of items) {
          const deliveryKey = getNotificationDeliveryKey(item.key);
          if (hasDeliveredNotification(deliveryKey)) continue;

          recordDeliveredNotification(item, deliveryKey);

          if (!pageVisible && browserEnabled && permission === 'granted' && supportsBrowserNotifications()) {
            const notification = new Notification(item.title, {
              body: item.body,
              tag: deliveryKey,
            });
            notification.onclick = () => {
              window.focus();
              window.location.assign(item.link);
            };
          } else {
            toast(item.title, {
              description: item.body,
              duration: 6000,
            });
          }
        }
      } catch (error) {
        console.warn('NOTIFICATION_RUNTIME_SCAN_FAILED', error);
      } finally {
        scanPendingRef.current = false;
      }
    };

    void runScan();
    const interval = window.setInterval(() => {
      void runScan();
    }, 60_000);

    const handleFocus = () => {
      void runScan();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [enabled, loading, profile?.browserNotificationsEnabled, workspace?.id]);

  return null;
}
