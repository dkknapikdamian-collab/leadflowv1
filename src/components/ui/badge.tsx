import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const STAGE220A19_CARDS_BADGES_METRICS_VST = "shared Badge primitive uses CloseFlow Visual Source of Truth";
void STAGE220A19_CARDS_BADGES_METRICS_VST;

const badgeVariants = cva(
  "cf-vst-badge cf-vst-pill inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "border border-slate-300 bg-white text-slate-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge: React.FC<BadgeProps> = ({ className, variant, ...props }) => {
  const vstVariantClass =
    variant === "destructive"
      ? "cf-vst-kind-delete"
      : variant === "secondary" || variant === "outline"
        ? "cf-vst-kind-status"
        : "cf-vst-kind-primary"

  return (
    <div
      data-cf-vst-badge="true"
      data-cf-vst-badge-kind={variant || "default"}
      className={cn(badgeVariants({ variant }), vstVariantClass, className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
