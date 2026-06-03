import * as React from "react"
import { cn } from "../../lib/utils"

const STAGE220A18_SHARED_MODAL_FORM_VST = "shared textarea primitive uses CloseFlow Visual Source of Truth";
void STAGE220A18_SHARED_MODAL_FORM_VST;

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        data-cf-vst-input="textarea"
        className={cn(
          "cf-vst-input cf-vst-textarea flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
