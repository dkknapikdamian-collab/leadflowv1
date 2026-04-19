import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "../../lib/utils"

type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

type SelectContextValue = {
  value: string
  disabled?: boolean
  onValueChange: (value: string) => void
  options: SelectOption[]
  setOptions: React.Dispatch<React.SetStateAction<SelectOption[]>>
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

type SelectProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  children: React.ReactNode
}

function useSelectContext(componentName: string) {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error(`${componentName} must be used within Select`)
  }
  return context
}

function getTextContent(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") {
    return ""
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join("")
  }

  if (React.isValidElement(node)) {
    return getTextContent((node as React.ReactElement<any>).props.children)
  }

  return ""
}

function extractOptions(children: React.ReactNode): SelectOption[] {
  const collected: SelectOption[] = []

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return
    }

    const element = child as React.ReactElement<any>

    if (element.type === SelectItem) {
      const value = typeof element.props.value === "string" ? element.props.value : ""
      if (!value) {
        return
      }

      collected.push({
        value,
        label: getTextContent(element.props.children).trim() || value,
        disabled: Boolean(element.props.disabled),
      })
      return
    }

    if (element.props?.children) {
      collected.push(...extractOptions(element.props.children))
    }
  })

  return collected
}

function getPlaceholderFromChildren(children: React.ReactNode): string | undefined {
  let placeholder: string | undefined

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return
    }

    const element = child as React.ReactElement<any>

    if (element.type === SelectValue && typeof element.props.placeholder === "string") {
      placeholder = element.props.placeholder
      return
    }

    if (!placeholder && element.props?.children) {
      placeholder = getPlaceholderFromChildren(element.props.children)
    }
  })

  return placeholder
}

function Select({
  value,
  defaultValue = "",
  onValueChange,
  disabled,
  children,
}: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [options, setOptions] = React.useState<SelectOption[]>([])

  const currentValue = value ?? internalValue

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue)
      }
      onValueChange?.(nextValue)
    },
    [onValueChange, value]
  )

  const context = React.useMemo<SelectContextValue>(
    () => ({
      value: currentValue,
      disabled,
      onValueChange: handleValueChange,
      options,
      setOptions,
    }),
    [currentValue, disabled, handleValueChange, options]
  )

  return <SelectContext.Provider value={context}>{children}</SelectContext.Provider>
}

function SelectGroup({ children }: { className?: string; children?: React.ReactNode }) {
  return <>{children}</>
}

function SelectValue(_props: { className?: string; placeholder?: string }) {
  return null
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
  size?: "sm" | "default"
}) {
  const context = useSelectContext("SelectTrigger")
  const placeholder = getPlaceholderFromChildren(children)

  return (
    <div className="relative w-full">
      <select
        {...props}
        data-slot="select-trigger"
        data-size={size}
        value={context.value}
        disabled={context.disabled || props.disabled}
        onChange={(event) => context.onValueChange(event.target.value)}
        className={cn(
          "flex w-full appearance-none items-center justify-between gap-1.5 rounded-lg border border-slate-300 bg-white py-2 pr-8 pl-2.5 text-sm whitespace-nowrap text-slate-900 transition-colors outline-none select-none focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)]",
          className
        )}
      >
        {placeholder && context.value === "" ? (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        ) : null}
        {context.options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
    </div>
  )
}

function SelectContent({
  children,
}: {
  className?: string
  children?: React.ReactNode
  side?: string
  sideOffset?: number
  align?: string
  alignOffset?: number
  alignItemWithTrigger?: boolean
}) {
  const { setOptions } = useSelectContext("SelectContent")
  const options = React.useMemo(() => extractOptions(children), [children])

  React.useEffect(() => {
    setOptions(options)
  }, [options, setOptions])

  return null
}

function SelectLabel({ children }: { className?: string; children?: React.ReactNode }) {
  return <>{children}</>
}

function SelectItem({
  children,
}: {
  className?: string
  children?: React.ReactNode
  value: string
  disabled?: boolean
}) {
  return <>{children}</>
}

function SelectSeparator() {
  return null
}

function SelectScrollUpButton() {
  return null
}

function SelectScrollDownButton() {
  return null
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
