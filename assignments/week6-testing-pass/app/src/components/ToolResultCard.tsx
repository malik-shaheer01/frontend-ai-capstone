import type { ToolResult } from "../lib/types"

interface ToolResultCardProps {
  toolName: string
  result: ToolResult
}

export function ToolResultCard({ toolName, result }: ToolResultCardProps) {
  if (result.status === "error") {
    return (
      <div role="alert" className="tool-result tool-result--error">
        <p className="tool-result__title">{toolName} failed</p>
        <p className="tool-result__message">{result.message}</p>
      </div>
    )
  }

  return (
    <div className="tool-result tool-result--success">
      <p className="tool-result__title">{toolName} result</p>
      <dl className="tool-result__data">
        {Object.entries(result.data).map(([key, value]) => (
          <div className="tool-result__row" key={key}>
            <dt>{key}</dt>
            <dd>{String(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
