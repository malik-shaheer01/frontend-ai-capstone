import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ChatMessage } from "./ChatMessage"
import type { ChatMessageData } from "../lib/types"

function makeMessage(overrides: Partial<ChatMessageData>): ChatMessageData {
  return {
    id: "1",
    role: "assistant",
    status: "complete",
    parts: [],
    ...overrides,
  }
}

describe("ChatMessage part types", () => {
  it("renders a text part", () => {
    render(<ChatMessage message={makeMessage({ parts: [{ type: "text", text: "Hello there" }] })} />)
    expect(screen.getByText("Hello there")).toBeInTheDocument()
  })

  it("renders an image part with its alt text", () => {
    render(
      <ChatMessage
        message={makeMessage({
          parts: [{ type: "image", url: "https://example.com/cat.png", alt: "A cat" }],
        })}
      />
    )
    expect(screen.getByRole("img", { name: "A cat" })).toBeInTheDocument()
  })

  it("renders a tool-call part naming the tool", () => {
    render(
      <ChatMessage
        message={makeMessage({
          parts: [{ type: "tool-call", toolName: "get_weather", args: { city: "Lahore" } }],
        })}
      />
    )
    expect(screen.getByText("get_weather")).toBeInTheDocument()
  })

  it("renders a tool-result part's success data", () => {
    render(
      <ChatMessage
        message={makeMessage({
          parts: [
            {
              type: "tool-result",
              toolName: "get_weather",
              result: { status: "success", data: { temp: "24C" } },
            },
          ],
        })}
      />
    )
    expect(screen.getByText("24C")).toBeInTheDocument()
  })

  it("renders a tool-result part's error message", () => {
    render(
      <ChatMessage
        message={makeMessage({
          parts: [
            {
              type: "tool-result",
              toolName: "get_weather",
              result: { status: "error", message: "City not found" },
            },
          ],
        })}
      />
    )
    expect(screen.getByRole("alert")).toHaveTextContent("City not found")
  })
})

describe("ChatMessage status", () => {
  it("shows a pending indicator and no message content while pending", () => {
    render(<ChatMessage message={makeMessage({ status: "pending", parts: [] })} />)
    expect(screen.getByRole("status")).toHaveTextContent("Waiting to send")
  })

  it("marks itself busy while streaming", () => {
    render(
      <ChatMessage
        message={makeMessage({ status: "streaming", parts: [{ type: "text", text: "Partial…" }] })}
      />
    )
    expect(screen.getByLabelText("Assistant message")).toHaveAttribute("aria-busy", "true")
  })

  it("surfaces an error as an alert with the failure message", () => {
    render(
      <ChatMessage
        message={makeMessage({ status: "error", errorMessage: "Network request failed", parts: [] })}
      />
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Network request failed")
  })
})
