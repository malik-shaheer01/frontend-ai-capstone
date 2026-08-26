import type { ChatMessageData } from "./types"

/**
 * Stands in for a real AI route (e.g. POST /api/chat). Tests mock this
 * function directly instead of hitting a network layer, so no test ever
 * makes a real call.
 */
export async function sendMessage(text: string): Promise<ChatMessageData> {
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 800))

  if (text.trim().length === 0) {
    throw new Error("Message can't be empty.")
  }

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    status: "complete",
    parts: [{ type: "text", text: `Echo: ${text}` }],
  }
}
