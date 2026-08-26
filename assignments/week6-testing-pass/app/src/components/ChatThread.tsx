import { useState, type FormEvent } from "react"
import { sendMessage } from "../lib/chat"
import type { ChatMessageData } from "../lib/types"
import { ChatMessage } from "./ChatMessage"

export function ChatThread() {
  const [messages, setMessages] = useState<ChatMessageData[]>([])
  const [input, setInput] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = input.trim()
    if (text.length === 0) return

    const userMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      role: "user",
      status: "complete",
      parts: [{ type: "text", text }],
    }
    const assistantId = crypto.randomUUID()
    const pendingMessage: ChatMessageData = {
      id: assistantId,
      role: "assistant",
      status: "streaming",
      parts: [],
    }

    setMessages((prev) => [...prev, userMessage, pendingMessage])
    setInput("")

    try {
      const reply = await sendMessage(text)
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...reply, id: assistantId } : m))
      )
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, status: "error", errorMessage: (err as Error).message }
            : m
        )
      )
    }
  }

  return (
    <div>
      <div role="log" aria-label="Conversation" aria-live="polite">
        {messages.length === 0 && <p>No messages yet — try asking something.</p>}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="chat-input">Message</label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
