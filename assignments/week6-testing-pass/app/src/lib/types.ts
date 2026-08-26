export type MessagePart =
  | { type: "text"; text: string }
  | { type: "tool-call"; toolName: string; args: Record<string, unknown> }
  | { type: "tool-result"; toolName: string; result: ToolResult }
  | { type: "image"; url: string; alt: string }

export type ToolResult =
  | { status: "success"; data: Record<string, unknown> }
  | { status: "error"; message: string }

export type MessageStatus = "pending" | "streaming" | "complete" | "error"

export interface ChatMessageData {
  id: string
  role: "user" | "assistant"
  status: MessageStatus
  parts: MessagePart[]
  errorMessage?: string
}
