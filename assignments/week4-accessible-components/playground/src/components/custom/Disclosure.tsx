import { useId, useState, type ReactNode } from "react"

interface DisclosureProps {
  label: string
  children: ReactNode
  defaultOpen?: boolean
}

export function Disclosure({ label, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <div className="border border-neutral-200 rounded-md">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          {label}
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
      </h3>
      <div id={contentId} hidden={!open} className="px-3 pb-3 text-sm text-neutral-700">
        {children}
      </div>
    </div>
  )
}
