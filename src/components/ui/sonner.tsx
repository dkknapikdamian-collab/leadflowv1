"use client"

import * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
import { useAppearance } from "../appearance-provider"
import "../../styles/closeflow-toast-source-truth-stage220a33.css"

const STAGE220A33_CLOSEFLOW_TOAST_SOURCE_TRUTH = "global CloseFlow toast visual source truth is owned by src/components/ui/sonner.tsx"
void STAGE220A33_CLOSEFLOW_TOAST_SOURCE_TRUTH

const Toaster = ({ ...props }: ToasterProps) => {
  const { toastTheme } = useAppearance()

  return (
    <Sonner
      theme={toastTheme as ToasterProps["theme"]}
      className="toaster group closeflow-toast-source-truth-stage220a33"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--app-surface-strong)",
          "--normal-text": "var(--app-text)",
          "--normal-border": "var(--app-border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast closeflow-toast-source-truth-stage220a33",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
