# STAGE223 R2AD V4 - Local TodayStable source audit

Data: 2026-06-05
Repo: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Znalezione miejsca w lokalnym pliku

### moveTodaySectionToTop

```tsx
  589 |   if (!root || !title) return null;
  590 | 
  591 |   const headers = Array.from(root.querySelectorAll('button[aria-expanded]')) as HTMLElement[];
  592 |   return headers.find((element) => (element.textContent || '').includes(title)) || null;
  593 | }
  594 | 
  595 | function getTodaySectionCardElement(key: TodaySectionKey) {
  596 |   const header = getTodaySectionHeaderElement(key);
  597 |   if (!header) return null;
  598 |   return (header.closest('[data-cf-today-section-card="true"], .rounded-xl.border, .rounded-xl, section') || header.parentElement) as HTMLElement | null;
  599 | }
  600 | 
  601 | function moveTodaySectionToTop(key: TodaySectionKey) {
  602 |   const target = getTodaySectionCardElement(key);
  603 |   if (!target || !target.parentElement) return;
  604 |   const parent = target.parentElement;
  605 |   const first = TODAY_SECTION_KEYS
  606 |     .map((sectionKey) => getTodaySectionCardElement(sectionKey))
  607 |     .find((element): element is HTMLElement => Boolean(element && element.parentElement === parent));
  608 | 
  609 |   if (first && first !== target) parent.insertBefore(target, first);
  610 | }
  611 | 
  612 | function scrollToTodaySection(key: TodaySectionKey) {
  613 |   if (!shouldFb4ScrollTodaySection()) return;
```

### scrollToTodaySection

```tsx
  600 | 
  601 | function moveTodaySectionToTop(key: TodaySectionKey) {
  602 |   const target = getTodaySectionCardElement(key);
  603 |   if (!target || !target.parentElement) return;
  604 |   const parent = target.parentElement;
  605 |   const first = TODAY_SECTION_KEYS
  606 |     .map((sectionKey) => getTodaySectionCardElement(sectionKey))
  607 |     .find((element): element is HTMLElement => Boolean(element && element.parentElement === parent));
  608 | 
  609 |   if (first && first !== target) parent.insertBefore(target, first);
  610 | }
  611 | 
  612 | function scrollToTodaySection(key: TodaySectionKey) {
  613 |   if (!shouldFb4ScrollTodaySection()) return;
  614 |   const target = getTodaySectionCardElement(key);
  615 |   target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  616 | }
  617 | 
  618 | function RowLink({
  619 |   to,
  620 |   title,
  621 |   meta,
  622 |   helper,
  623 |   badge,
  624 |   onDone,
```

### focusTodaySectionFromMetricTile

```tsx
  928 |   const [lastLoadedAt, setLastLoadedAt] = useState<string>('');
  929 |   const [manualRefreshing, setManualRefreshing] = useState(false);
  930 |   const [errorMessage, setErrorMessage] = useState<string>('');
  931 |   const [expandedSection, setExpandedSection] = useState<'all' | TodaySectionKey>('all');
  932 |   const [todayViewOpen, setTodayViewOpen] = useState(false);
  933 |   const [visibleTodaySections, setVisibleTodaySections] = useState<TodaySectionKey[]>(() => readTodayVisibleSections());
  934 |   const [actionPendingId, setActionPendingId] = useState<string>('');
  935 |   const [collapsedSections, setCollapsedSections] = useState<TodaySectionKey[]>(() => [...TODAY_SECTION_KEYS]);
  936 |   const [activeTodaySection, setActiveTodaySection] = useState<TodaySectionKey | null>(null);
  937 |   const todayRefreshInFlightRef = useRef<Promise<void> | null>(null);
  938 |   const todayLastSuccessfulRefreshAtRef = useRef(0);
  939 | 
  940 |   const focusTodaySectionFromMetricTile = useCallback((sectionKey: TodaySectionKey) => {
  941 |     setActiveTodaySection(sectionKey);
  942 |     setExpandedSection(sectionKey);
  943 |     setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey));
  944 | 
  945 |     window.setTimeout(() => {
  946 |       moveTodaySectionToTop(sectionKey);
  947 |       scrollToTodaySection(sectionKey);
  948 |     }, 80);
  949 |   }, []);
  950 | 
  951 |   useEffect(() => {
  952 |     syncTodayMetricTileFocusA11y(activeTodaySection, collapsedSections);
```

### handleMetricTileClick

```tsx
  946 |       moveTodaySectionToTop(sectionKey);
  947 |       scrollToTodaySection(sectionKey);
  948 |     }, 80);
  949 |   }, []);
  950 | 
  951 |   useEffect(() => {
  952 |     syncTodayMetricTileFocusA11y(activeTodaySection, collapsedSections);
  953 | 
  954 |     if (typeof document === 'undefined') return undefined;
  955 |     const root = document.querySelector('[data-p0-today-stable-rebuild="true"]') as HTMLElement | null;
  956 |     if (!root) return undefined;
  957 | 
  958 |     const handleMetricTileClick = (event: MouseEvent) => {
  959 |       const target = event.target instanceof HTMLElement ? event.target : null;
  960 |       const tile = target?.closest('button[data-cf-semantic-label]');
  961 |       if (!(tile instanceof HTMLElement)) return;
  962 | 
  963 |       const sectionKey = getTodaySectionKeyFromMetricTile(tile);
  964 |       if (!sectionKey) return;
  965 | 
  966 |       window.setTimeout(() => {
  967 |         focusTodaySectionFromMetricTile(sectionKey);
  968 |         syncTodayMetricTileFocusA11y(sectionKey, collapsedSections.filter((entry) => entry !== sectionKey));
  969 |       }, 0);
  970 |     };
```

### handleTileClick

```tsx
 1051 |     });
 1052 | 
 1053 |     return () => {
 1054 |       if (refreshTimer) window.clearTimeout(refreshTimer);
 1055 |       unsubscribe();
 1056 |     };
 1057 |   }, [refreshData]);
 1058 | 
 1059 |   useEffect(() => {
 1060 |     // CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP: Today tiles control one expanded list, move it to the top and avoid mobile scroll jump.
 1061 |     if (typeof window === 'undefined') return;
 1062 | 
 1063 |     const handleTileClick = (event: Event) => {
 1064 |       const target = event.target as HTMLElement | null;
 1065 |       const clickable = target?.closest('button, a, [role="button"]') as HTMLElement | null;
 1066 |       const section = getTodaySectionFromTileText(clickable?.textContent || '');
 1067 |       if (!section) return;
 1068 | 
 1069 |       setExpandedSection(section);
 1070 |       setActiveTodaySection(section);
 1071 |       setCollapsedSections(TODAY_SECTION_KEYS.filter((key) => key !== section));
 1072 | 
 1073 |       window.setTimeout(() => {
 1074 |         moveTodaySectionToTop(section);
 1075 |         scrollToTodaySection(section);
```

### top metric tile button

```tsx
 1524 |                         </span>
 1525 |                         <span className="min-w-0">
 1526 |                           <span className="block truncate font-semibold">{tile.title}</span>
 1527 |                           <span className="block text-xs text-slate-500">{tile.count} wpisów</span>
 1528 |                         </span>
 1529 |                       </label>
 1530 |                     );
 1531 |                   })}
 1532 |                 </div>
 1533 |               </CardContent>
 1534 |             </Card>
 1535 |           </section>
 1536 |         ) : null}
 1537 | 
 1538 |                 <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-stage16ai-today-tiles-match-lists="true">
 1539 |           {visibleTodayTiles.map((tile) => {
 1540 |             const active = expandedSection === tile.key;
 1541 |             return (
 1542 |               <button key={tile.key} type="button" onClick={() => setExpandedSection(active ? 'all' : tile.key)} className="text-left">
 1543 |                 <Card className={
 1544 |                   'border-slate-100 transition hover:shadow-md ' +
 1545 |                   tile.activeTone +
 1546 |                   (active ? ' ring-2 ring-slate-200' : '')
 1547 |                 }>
 1548 |                   <CardContent className="p-4">
 1549 |                     <div className="flex items-center gap-2">
 1550 |                       <p className="min-w-0 flex-1 truncate text-xs font-bold uppercase tracking-wide text-slate-500">{tile.title}</p>
 1551 |                       <p className={'text-2xl font-black leading-none ' + tile.tone}>{tile.count}</p>
 1552 |                       <span className={'rounded-full bg-slate-50 p-2 shrink-0 ' + tile.tone}>{tile.icon}</span>
 1553 |                     </div>
 1554 |                   </CardContent>
 1555 |                 </Card>
 1556 |               </button>
 1557 |             );
 1558 |           })}
 1559 |         </section>
 1560 | 
```

## Wniosek

Ten audyt jest wykonywany na lokalnym pliku przed patchem V4. Nie opiera się na założeniu z GitHuba.
