import * as React from "react"
import { cn } from "../../lib/utils"

const STAGE220A19_CARDS_BADGES_METRICS_VST = "shared Card primitive uses CloseFlow Visual Source of Truth";
void STAGE220A19_CARDS_BADGES_METRICS_VST;
const STAGE232T_R1A_TODAY_VIEW_SECTION_CARD_VISIBILITY = "STAGE232T_R1A_TODAY_VIEW_SECTION_CARD_VISIBILITY";
void STAGE232T_R1A_TODAY_VIEW_SECTION_CARD_VISIBILITY;

const TODAY_VIEW_STORAGE_KEY_STAGE232T_R1A = "closeflow:today:view-sections:v1";
const TODAY_SECTION_KEYS_STAGE232T_R1A = ["no_action", "risk", "waiting", "leads", "tasks", "events", "upcoming", "drafts"] as const;
type TodaySectionKeyStage232TR1A = typeof TODAY_SECTION_KEYS_STAGE232T_R1A[number];

function normalizeTodayCardTextStage232TR1A(value: unknown) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readTodayViewSetStage232TR1A(): Set<TodaySectionKeyStage232TR1A> {
  if (typeof window === "undefined") return new Set(TODAY_SECTION_KEYS_STAGE232T_R1A);
  try {
    const raw = window.localStorage.getItem(TODAY_VIEW_STORAGE_KEY_STAGE232T_R1A);
    const parsed = raw ? JSON.parse(raw) : TODAY_SECTION_KEYS_STAGE232T_R1A;
    if (!Array.isArray(parsed)) return new Set(TODAY_SECTION_KEYS_STAGE232T_R1A);
    const next = new Set<TodaySectionKeyStage232TR1A>();
    for (const item of parsed) {
      if (TODAY_SECTION_KEYS_STAGE232T_R1A.includes(item as TodaySectionKeyStage232TR1A)) next.add(item as TodaySectionKeyStage232TR1A);
    }
    return next;
  } catch {
    return new Set(TODAY_SECTION_KEYS_STAGE232T_R1A);
  }
}

function getTodayCardSectionKeyStage232TR1A(value: unknown): TodaySectionKeyStage232TR1A | null {
  const text = normalizeTodayCardTextStage232TR1A(value);
  if (text.includes("leady bez najblizszej akcji")) return "no_action";
  if (text.includes("wysoka wartosc") || text.includes("ryzyko")) return "risk";
  if (text.includes("leady czekajace")) return "waiting";
  if (text.includes("wymaga ruchu")) return "leads";
  if (text.includes("zadania dzis") || text.includes("zalegle zadania") || text.includes("zadania do obslugi") || text.includes("zadania do wykonania dzis")) return "tasks";
  if (text.includes("wydarzenia dzis")) return "events";
  if (text.includes("najblizsze 7 dni")) return "upcoming";
  if (text.includes("szkice ai")) return "drafts";
  return null;
}

function applyTodayCardSectionVisibilityStage232TR1A(node: HTMLDivElement | null) {
  if (!node || typeof window === "undefined") return;
  if (!node.closest('[data-p0-today-stable-rebuild="true"]')) return;
  const title = node.querySelector('button[aria-expanded] h2')?.textContent || "";
  const sectionKey = getTodayCardSectionKeyStage232TR1A(title);
  if (!sectionKey) return;
  const visible = readTodayViewSetStage232TR1A().has(sectionKey);
  node.style.display = visible ? "" : "none";
  node.dataset.cfTodayViewSectionCard = sectionKey;
  node.dataset.stage232tR1aTodayViewVisibility = visible ? "visible" : "not-visible";
}

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const localRef = React.useRef<HTMLDivElement | null>(null);

  const setRefs = React.useCallback((node: HTMLDivElement | null) => {
    localRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  }, [ref]);

  React.useEffect(() => {
    applyTodayCardSectionVisibilityStage232TR1A(localRef.current);
  });

  return (
    <div
      ref={setRefs}
      data-cf-vst-card="true"
      className={cn(
        "cf-vst-card rounded-xl border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("cf-vst-card-header flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "cf-vst-card-title cf-vst-text-card-title text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("cf-vst-card-description cf-vst-text-meta text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("cf-vst-card-content p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("cf-vst-card-footer flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
