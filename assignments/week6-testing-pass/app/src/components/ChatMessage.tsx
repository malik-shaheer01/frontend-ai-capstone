import type { ChatMessageData } from "../lib/types"
import { ToolResultCard } from "./ToolResultCard"

interface ChatMessageProps {
  message: ChatMessageData
}

export function ChatMessage({ message }: ChatMessageProps) {
  const label = message.role === "user" ? "You" : "Assistant"

  if (message.status === "pending") {
    return (
      <div role="status" aria-label={`${label} message pending`} className="chat-message chat-message--pending">
        <span className="chat-message__author">{label}</span>
        <span>Waiting to send…</span>
      </div>
    )
  }

  if (message.status === "error") {
    return (
      <div role="alert" className="chat-message chat-message--error">
        <span className="chat-message__author">{label}</span>
        <p>{message.errorMessage ?? "Something went wrong sending this message."}</p>
      </div>
    )
  }

  return (
    <div
      className="chat-message"
      aria-label={`${label} message`}
      aria-busy={message.status === "streaming"}
    >
      <span className="chat-message__author">{label}</span>
      {message.parts.map((part, index) => {
        switch (part.type) {
          case "text":
            return <p key={index}>{part.text}</p>
          case "image":
            return <img key={index} src={part.url} alt={part.alt} />
          case "tool-call":
            return (
              <p key={index} className="chat-message__tool-call">
                Calling <code>{part.toolName}</code>…
              </p>
            )
          case "tool-result":
            return <ToolResultCard key={index} toolName={part.toolName} result={part.result} />
        }
      })}
      {message.status === "streaming" && (
        <span aria-hidden="true" className="chat-message__cursor">
          ▍
        </span>
      )}
    </div>
  )
}
