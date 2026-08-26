import { useRef, useState, type KeyboardEvent, type ReactNode } from "react"

interface TabItem {
  id: string
  label: string
  panel: ReactNode
}

interface TabsProps {
  label: string
  items: TabItem[]
}

export function Tabs({ label, items }: TabsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  function activate(id: string) {
    setActiveId(id)
    tabRefs.current[id]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowRight": {
        event.preventDefault()
        const next = items[(index + 1) % items.length]
        activate(next.id)
        break
      }
      case "ArrowLeft": {
        event.preventDefault()
        const prev = items[(index - 1 + items.length) % items.length]
        activate(prev.id)
        break
      }
      case "Home": {
        event.preventDefault()
        activate(items[0].id)
        break
      }
      case "End": {
        event.preventDefault()
        activate(items[items.length - 1].id)
        break
      }
    }
  }

  return (
    <div>
      <div role="tablist" aria-label={label} className="flex gap-1 border-b border-neutral-200">
        {items.map((item, index) => {
          const selected = item.id === activeId
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[item.id] = node
              }}
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => activate(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={
                "px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 " +
                (selected
                  ? "border-b-2 border-neutral-900 text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900")
              }
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`panel-${item.id}`}
          aria-labelledby={`tab-${item.id}`}
          hidden={item.id !== activeId}
          tabIndex={0}
          className="p-3 text-sm text-neutral-700"
        >
          {item.panel}
        </div>
      ))}
    </div>
  )
}
